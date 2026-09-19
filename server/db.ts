import fs from 'fs';
import path from 'path';
import { Tool, Category } from '../src/types';
import { RAW_TOOLS } from '../src/data/tools';
import { CATEGORIES } from '../src/data/categories';

export interface AuditLogEntry {
  id: string;
  operation: string;
  timestamp: string;
  source: 'agent' | 'admin' | 'system';
  targetType: 'tool' | 'category' | 'system';
  targetId?: string;
  success: boolean;
  message?: string;
  ipHash?: string;
}

export interface DatabaseSchema {
  projectId: string;
  version: string;
  lastUpdated: string;
  tools: Tool[];
  categories: Category[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_log.json');

/**
 * Initializes data directory and bootstraps data from existing verified seed data if not present.
 */
function ensureDataStore(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      projectId: 'TOOLVERSE',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      tools: [...RAW_TOOLS],
      categories: [...CATEGORIES]
    };
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(initialData, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  if (!fs.existsSync(AUDIT_FILE)) {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readDatabase(): DatabaseSchema {
  ensureDataStore();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.tools || !parsed.categories) {
      throw new Error('Corrupted database schema');
    }
    return parsed;
  } catch {
    // If reading or parsing fails, recover safely
    const fallback: DatabaseSchema = {
      projectId: 'TOOLVERSE',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      tools: [...RAW_TOOLS],
      categories: [...CATEGORIES]
    };
    writeDatabaseAtomic(fallback);
    return fallback;
  }
}

function writeDatabaseAtomic(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  data.lastUpdated = new Date().toISOString();
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

export const db = {
  // --- Public / Read Methods ---
  getAllTools(includeInactive = false): Tool[] {
    const data = readDatabase();
    if (includeInactive) return data.tools;
    return data.tools.filter((t) => t.isActive);
  },

  getToolById(id: string): Tool | undefined {
    const tools = readDatabase().tools;
    const lower = id.toLowerCase();
    return tools.find((t) => t.id.toLowerCase() === lower || t.slug.toLowerCase() === lower);
  },

  getAllCategories(includeInactive = false): Category[] {
    const data = readDatabase();
    if (includeInactive) return data.categories;
    return data.categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);
  },

  getCategoryById(id: string): Category | undefined {
    const categories = readDatabase().categories;
    const lower = id.toLowerCase();
    return categories.find((c) => c.id.toLowerCase() === lower || c.slug.toLowerCase() === lower);
  },

  // --- Mutative Methods (Protected) ---
  addTool(tool: Tool): { success: boolean; error?: string; tool?: Tool } {
    const data = readDatabase();
    const exists = data.tools.some(
      (t) => t.id.toLowerCase() === tool.id.toLowerCase() || t.slug.toLowerCase() === tool.slug.toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'A tool with this ID or slug already exists' };
    }

    const newTool: Tool = {
      ...tool,
      createdAt: tool.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.tools.push(newTool);
    writeDatabaseAtomic(data);
    return { success: true, tool: newTool };
  },

  updateTool(id: string, updates: Partial<Tool>): { success: boolean; error?: string; tool?: Tool } {
    const data = readDatabase();
    const index = data.tools.findIndex(
      (t) => t.id.toLowerCase() === id.toLowerCase() || t.slug.toLowerCase() === id.toLowerCase()
    );
    if (index === -1) {
      return { success: false, error: `Tool with id or slug "${id}" not found` };
    }

    // Protect from changing ID to conflict
    if (updates.id && updates.id.toLowerCase() !== data.tools[index].id.toLowerCase()) {
      const conflict = data.tools.some((t) => t.id.toLowerCase() === updates.id?.toLowerCase());
      if (conflict) {
        return { success: false, error: 'Cannot change ID to an already existing tool ID' };
      }
    }

    const updated: Tool = {
      ...data.tools[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    data.tools[index] = updated;
    writeDatabaseAtomic(data);
    return { success: true, tool: updated };
  },

  deleteTool(id: string, options: { confirm: boolean; forceUnlock?: boolean }): { success: boolean; error?: string } {
    const data = readDatabase();
    const index = data.tools.findIndex(
      (t) => t.id.toLowerCase() === id.toLowerCase() || t.slug.toLowerCase() === id.toLowerCase()
    );
    if (index === -1) {
      return { success: false, error: `Tool with id "${id}" not found` };
    }

    // Accidental Deletion Protection Checks
    if (!options.confirm) {
      return {
        success: false,
        error: 'Accidental deletion prevention: request must include explicit confirmation { confirm: true }'
      };
    }

    const targetTool = data.tools[index];
    const isProtected = (targetTool as unknown as { deletionProtected?: boolean }).deletionProtected;
    if (isProtected && !options.forceUnlock) {
      return {
        success: false,
        error: 'This tool is locked against deletion (deletionProtected: true). Explicit "forceUnlock: true" is required.'
      };
    }

    data.tools.splice(index, 1);
    writeDatabaseAtomic(data);
    return { success: true };
  },

  addCategory(category: Category): { success: boolean; error?: string; category?: Category } {
    const data = readDatabase();
    const exists = data.categories.some(
      (c) => c.id.toLowerCase() === category.id.toLowerCase() || c.slug.toLowerCase() === category.slug.toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'A category with this ID or slug already exists' };
    }

    data.categories.push(category);
    data.categories.sort((a, b) => a.order - b.order);
    writeDatabaseAtomic(data);
    return { success: true, category };
  },

  updateCategory(id: string, updates: Partial<Category>): { success: boolean; error?: string; category?: Category } {
    const data = readDatabase();
    const index = data.categories.findIndex(
      (c) => c.id.toLowerCase() === id.toLowerCase() || c.slug.toLowerCase() === id.toLowerCase()
    );
    if (index === -1) {
      return { success: false, error: `Category "${id}" not found` };
    }

    const updated: Category = {
      ...data.categories[index],
      ...updates
    };

    data.categories[index] = updated;
    data.categories.sort((a, b) => a.order - b.order);
    writeDatabaseAtomic(data);
    return { success: true, category: updated };
  },

  deleteCategory(id: string, confirm: boolean): { success: boolean; error?: string } {
    const data = readDatabase();
    const index = data.categories.findIndex(
      (c) => c.id.toLowerCase() === id.toLowerCase() || c.slug.toLowerCase() === id.toLowerCase()
    );
    if (index === -1) {
      return { success: false, error: `Category "${id}" not found` };
    }

    if (!confirm) {
      return {
        success: false,
        error: 'Accidental deletion prevention: category deletion requires { confirm: true }'
      };
    }

    // Check if tools are using this category
    const catId = data.categories[index].id;
    const toolsInCat = data.tools.filter((t) => t.category === catId);
    if (toolsInCat.length > 0) {
      return {
        success: false,
        error: `Cannot delete category "${catId}" because it contains ${toolsInCat.length} associated tools. Move or reassign tools first.`
      };
    }

    data.categories.splice(index, 1);
    writeDatabaseAtomic(data);
    return { success: true };
  },

  // --- Audit Logging ---
  appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    ensureDataStore();
    const fullEntry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };

    try {
      const content = fs.existsSync(AUDIT_FILE) ? fs.readFileSync(AUDIT_FILE, 'utf-8') : '[]';
      const logs: AuditLogEntry[] = JSON.parse(content || '[]');
      logs.unshift(fullEntry);
      // Keep last 1000 logs to prevent file explosion
      const trimmed = logs.slice(0, 1000);
      fs.writeFileSync(AUDIT_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
    } catch {
      // Fallback
    }

    return fullEntry;
  },

  getAuditLogs(limit = 100): AuditLogEntry[] {
    ensureDataStore();
    try {
      const content = fs.readFileSync(AUDIT_FILE, 'utf-8');
      const logs: AuditLogEntry[] = JSON.parse(content || '[]');
      return logs.slice(0, limit);
    } catch {
      return [];
    }
  }
};
