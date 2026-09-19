import {
  Tool,
  Category,
  ToolCategory,
  PricingType,
  SortOption,
  ToolFilterOptions,
  SeoMetadata,
  Language
} from '../types';
import { RAW_TOOLS } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { validateAndSanitizeTools } from '../utils/validation';
import { searchToolsEngine } from '../utils/searchEngine';
import { PROJECT_ID } from '../config/project';

export interface RepositoryExportPackage {
  projectId: typeof PROJECT_ID;
  version: string;
  exportedAt: string;
  tools: Tool[];
  categories: Category[];
}

/**
 * Interface defining the Data Access Layer contract.
 * Enables future administrative systems or remote sync layers to read and modify data without refactoring.
 */
export interface IToolRepository {
  getTools(options?: ToolFilterOptions): Tool[];
  getToolBySlug(slug: string): Tool | null;
  getToolById(id: string): Tool | null;
  getToolsByCategory(categoryId: ToolCategory, options?: ToolFilterOptions): Tool[];
  getFeaturedTools(limit?: number): Tool[];
  getNewTools(limit?: number): Tool[];
  getSimilarTools(toolId: string, limit?: number): Tool[];
  searchTools(query: string, options?: ToolFilterOptions): Tool[];
  getCategories(): Category[];
  getCategoryBySlug(slug: string): Category | null;
  getCategoryById(id: ToolCategory): Category | null;
  getCategoryToolCount(categoryId: ToolCategory): number;
  getToolSeo(tool: Tool, lang: Language): SeoMetadata;
  getCategorySeo(category: Category, lang: Language): SeoMetadata;

  // Management & Future Admin Extensibility Contracts
  syncFromBackend(): Promise<boolean>;
  addTool(tool: Tool): boolean;
  updateTool(id: string, updates: Partial<Tool>): boolean;
  deleteTool(id: string): boolean;
  addCategory(category: Category): boolean;
  updateCategory(id: ToolCategory, updates: Partial<Category>): boolean;
  deleteCategory(id: ToolCategory): boolean;
  exportData(): RepositoryExportPackage;
  importData(data: { tools?: Tool[]; categories?: Category[] }): boolean;
  subscribe(listener: () => void): () => void;
}

/**
 * In-Memory Local Implementation of IToolRepository.
 * Pre-validates and sanitizes all tools upon initialization.
 */
class LocalToolRepository implements IToolRepository {
  private tools: Tool[];
  private categories: Category[];
  private toolsBySlug: Map<string, Tool> = new Map();
  private toolsById: Map<string, Tool> = new Map();
  private categoriesBySlug: Map<string, Category> = new Map();
  private categoriesById: Map<string, Category> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Run initial validation pass
    this.tools = validateAndSanitizeTools(RAW_TOOLS);
    this.categories = CATEGORIES.filter((c) => c.isActive).sort((a, b) => a.order - b.order);
    this.rebuildIndices();
  }

  /**
   * Rebuilds fast lookup maps and notifies active subscribers.
   */
  private rebuildIndices(): void {
    this.toolsBySlug.clear();
    this.toolsById.clear();
    for (const tool of this.tools) {
      this.toolsBySlug.set(tool.slug.toLowerCase(), tool);
      this.toolsById.set(tool.id.toLowerCase(), tool);
    }

    this.categoriesBySlug.clear();
    this.categoriesById.clear();
    for (const category of this.categories) {
      this.categoriesBySlug.set(category.slug.toLowerCase(), category);
      this.categoriesById.set(category.id, category);
    }

    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch {
        // Safe swallow to avoid breaking caller
      }
    });
  }

  /**
   * Retrieves tools with intelligent search, synonyms, multi-criteria filtering, and sorting.
   */
  public getTools(options?: ToolFilterOptions): Tool[] {
    let result = [...this.tools];

    if (!options) {
      return result;
    }

    // 1. Category Filter
    if (options.category && options.category !== 'all') {
      result = result.filter((tool) => tool.category === options.category);
    }

    // 2. Pricing Filter
    if (options.pricing && options.pricing !== 'all') {
      result = result.filter((tool) => tool.pricing.toLowerCase() === options.pricing!.toLowerCase());
    }

    // 3. Featured Filter
    if (options.featured !== undefined) {
      result = result.filter((tool) => tool.featured === options.featured);
    }

    // 4. isNew Filter
    if (options.isNew !== undefined) {
      result = result.filter((tool) => tool.isNew === options.isNew);
    }

    // 5. Intelligent Semantic Search Filter (Arabic + English + Synonyms + NL Phrases)
    const hasSearchQuery = Boolean(options.searchQuery && options.searchQuery.trim());
    if (hasSearchQuery) {
      result = searchToolsEngine(result, options.searchQuery!);
    }

    // 6. Sorting
    // If a search query is active and sortBy is 'popular' (default), searchToolsEngine already ranks by relevance + popularity.
    // Otherwise, apply user-chosen sorting explicitly.
    if (options.sortBy && (!hasSearchQuery || options.sortBy !== 'popular')) {
      result = this.sortTools(result, options.sortBy);
    } else if (!hasSearchQuery && (!options.sortBy || options.sortBy === 'popular')) {
      result = this.sortTools(result, 'popular');
    }

    return result;
  }

  public getToolBySlug(slug: string): Tool | null {
    if (!slug) return null;
    return this.toolsBySlug.get(slug.toLowerCase().trim()) || null;
  }

  public getToolById(id: string): Tool | null {
    if (!id) return null;
    return this.toolsById.get(id.toLowerCase().trim()) || null;
  }

  public getToolsByCategory(categoryId: ToolCategory, options?: ToolFilterOptions): Tool[] {
    return this.getTools({
      ...options,
      category: categoryId
    });
  }

  public getFeaturedTools(limit: number = 6): Tool[] {
    return this.tools.filter((t) => t.featured).slice(0, limit);
  }

  public getNewTools(limit: number = 6): Tool[] {
    return this.tools.filter((t) => t.isNew).slice(0, limit);
  }

  /**
   * Finds similar tools from the same category, excluding the current tool.
   */
  public getSimilarTools(toolId: string, limit: number = 3): Tool[] {
    const target = this.getToolById(toolId);
    if (!target) return [];

    return this.tools
      .filter((t) => t.category === target.category && t.id !== target.id)
      .slice(0, limit);
  }

  public searchTools(query: string, options?: ToolFilterOptions): Tool[] {
    return this.getTools({
      ...options,
      searchQuery: query
    });
  }

  public getCategories(): Category[] {
    return [...this.categories];
  }

  public getCategoryBySlug(slug: string): Category | null {
    if (!slug) return null;
    return this.categoriesBySlug.get(slug.toLowerCase().trim()) || null;
  }

  public getCategoryById(id: ToolCategory): Category | null {
    return this.categoriesById.get(id) || null;
  }

  public getCategoryToolCount(categoryId: ToolCategory): number {
    return this.tools.filter((t) => t.category === categoryId).length;
  }

  /**
   * Generates clean SEO metadata for an individual Tool.
   */
  public getToolSeo(tool: Tool, lang: Language): SeoMetadata {
    const category = this.getCategoryById(tool.category);
    const catName = category ? (lang === 'ar' ? category.nameAr : category.nameEn) : tool.category;

    if (lang === 'ar') {
      return {
        title: `${tool.nameAr || tool.name} - دليل ورابط الاستخدام الرسمي | TOOLVERSE`,
        metaDescription: `${tool.descriptionAr} اكتشف مميزات ورابط ${tool.name} الرسمي في تصنيف ${catName}.`,
        canonicalSlug: `/tool/${tool.slug}`
      };
    }

    return {
      title: `${tool.nameEn || tool.name} - Official Tool Directory & Direct Link | TOOLVERSE`,
      metaDescription: `${tool.descriptionEn} Discover verified features and the official link for ${tool.name} in ${catName}.`,
      canonicalSlug: `/tool/${tool.slug}`
    };
  }

  /**
   * Generates clean SEO metadata for a Category (without exposing tool numbers).
   */
  public getCategorySeo(category: Category, lang: Language): SeoMetadata {
    if (lang === 'ar') {
      return {
        title: `أفضل أدوات ${category.nameAr} | TOOLVERSE`,
        metaDescription: `${category.descriptionAr}. تصفح قائمة مختارة وموثقة مع روابط الاستخدام المباشرة.`,
        canonicalSlug: `/category/${category.slug}`
      };
    }

    return {
      title: `Best ${category.nameEn} Tools | TOOLVERSE`,
      metaDescription: `${category.descriptionEn}. Browse a curated directory of verified tools with direct official links.`,
      canonicalSlug: `/category/${category.slug}`
    };
  }

  /**
   * Sort helper:
   * - 'popular': popularityScore descending
   * - 'newest': isNew first, then createdAt descending
   * - 'name-asc': English / Latin alphabetical
   * - 'name-ar': Arabic alphabetical comparison
   * - 'free-first': Free first, then Freemium, then Paid
   */
  private sortTools(tools: Tool[], sortBy: SortOption): Tool[] {
    const list = [...tools];
    switch (sortBy) {
      case 'popular':
        return list.sort((a, b) => b.popularityScore - a.popularityScore);

      case 'newest':
        return list.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

      case 'name-ar':
        return list.sort((a, b) => (a.nameAr || a.name).localeCompare(b.nameAr || b.name, 'ar'));

      case 'free-first': {
        const orderWeight: Record<PricingType, number> = {
          Free: 1,
          Freemium: 2,
          Paid: 3
        };
        return list.sort((a, b) => orderWeight[a.pricing] - orderWeight[b.pricing]);
      }

      default:
        return list;
    }
  }

  // =========================================================================
  // Administrative & Management Methods (For future Admin Panel / Extensions)
  // =========================================================================

  /**
   * Adds a new tool to the in-memory repository and updates indices.
   */
  public addTool(tool: Tool): boolean {
    if (!tool.id || !tool.slug || this.toolsById.has(tool.id.toLowerCase())) {
      return false;
    }
    this.tools.push(tool);
    this.rebuildIndices();
    return true;
  }

  /**
   * Updates an existing tool by ID and refreshes indices.
   */
  public updateTool(id: string, updates: Partial<Tool>): boolean {
    const index = this.tools.findIndex((t) => t.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return false;

    this.tools[index] = {
      ...this.tools[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.rebuildIndices();
    return true;
  }

  /**
   * Deletes a tool by ID.
   */
  public deleteTool(id: string): boolean {
    const initialLength = this.tools.length;
    this.tools = this.tools.filter((t) => t.id.toLowerCase() !== id.toLowerCase());
    if (this.tools.length !== initialLength) {
      this.rebuildIndices();
      return true;
    }
    return false;
  }

  /**
   * Adds a new category to the repository.
   */
  public addCategory(category: Category): boolean {
    if (!category.id || this.categoriesById.has(category.id)) {
      return false;
    }
    this.categories.push(category);
    this.categories.sort((a, b) => a.order - b.order);
    this.rebuildIndices();
    return true;
  }

  /**
   * Updates an existing category by ID.
   */
  public updateCategory(id: ToolCategory, updates: Partial<Category>): boolean {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.categories[index] = {
      ...this.categories[index],
      ...updates
    };
    this.categories.sort((a, b) => a.order - b.order);
    this.rebuildIndices();
    return true;
  }

  /**
   * Deletes a category by ID.
   */
  public deleteCategory(id: ToolCategory): boolean {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter((c) => c.id !== id);
    if (this.categories.length !== initialLength) {
      this.rebuildIndices();
      return true;
    }
    return false;
  }

  /**
   * Exports full repository state packaged with project metadata.
   */
  public exportData(): RepositoryExportPackage {
    return {
      projectId: PROJECT_ID,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tools: [...this.tools],
      categories: [...this.categories]
    };
  }

  /**
   * Imports tools and categories data batch and validates.
   */
  public importData(data: { tools?: Tool[]; categories?: Category[] }): boolean {
    if (data.tools && Array.isArray(data.tools)) {
      this.tools = validateAndSanitizeTools(data.tools);
    }
    if (data.categories && Array.isArray(data.categories)) {
      this.categories = data.categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);
    }
    this.rebuildIndices();
    return true;
  }

  /**
   * Fetches latest tools and categories from the backend database (/api/public/tools, /api/public/categories)
   * and dynamically updates repository state.
   */
  public async syncFromBackend(): Promise<boolean> {
    try {
      const [toolsRes, catRes] = await Promise.all([
        fetch('/api/public/tools'),
        fetch('/api/public/categories')
      ]);

      if (!toolsRes.ok || !catRes.ok) return false;

      const toolsData = await toolsRes.json();
      const catData = await catRes.json();

      if (Array.isArray(toolsData.tools) && Array.isArray(catData.categories)) {
        this.importData({
          tools: toolsData.tools,
          categories: catData.categories
        });
        return true;
      }
      return false;
    } catch {
      // Graceful fallback to initial bundled data if offline or during server bootstrap
      return false;
    }
  }

  /**
   * Allows external consumers (future Admin, etc.) to listen to data updates.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Export singleton instance for the app
export const toolRepository = new LocalToolRepository();
