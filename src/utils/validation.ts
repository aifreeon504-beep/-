import { Tool, Category, PricingType, ToolCategory } from '../types';

const VALID_CATEGORIES: ToolCategory[] = [
  'ai-chat',
  'images-design',
  'video',
  'audio-music',
  'writing-content',
  'programming',
  'productivity',
  'seo-marketing',
  'other'
];

const VALID_PRICING: PricingType[] = ['Free', 'Freemium', 'Paid'];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a single Tool object against Phase 2 schema requirements.
 */
export function validateTool(tool: Partial<Tool>): ValidationResult {
  const errors: string[] = [];

  if (!tool.id || typeof tool.id !== 'string' || !tool.id.trim()) {
    errors.push('Tool ID is missing or empty.');
  }

  if (!tool.name || typeof tool.name !== 'string' || !tool.name.trim()) {
    errors.push(`Tool "${tool.id || 'unknown'}" is missing mandatory property: "name".`);
  }

  if (!tool.slug || typeof tool.slug !== 'string' || !tool.slug.trim()) {
    errors.push(`Tool "${tool.name || tool.id}" is missing mandatory property: "slug".`);
  } else if (!/^[a-z0-9-]+$/.test(tool.slug)) {
    errors.push(`Tool "${tool.name}" slug "${tool.slug}" is invalid. Must contain lowercase letters, numbers, and dashes only.`);
  }

  if (!tool.category || !VALID_CATEGORIES.includes(tool.category)) {
    errors.push(
      `Tool "${tool.name}" has invalid category "${tool.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`
    );
  }

  if (!tool.pricing || !VALID_PRICING.includes(tool.pricing)) {
    errors.push(
      `Tool "${tool.name}" has invalid pricing "${tool.pricing}". Must be one of: ${VALID_PRICING.join(', ')}`
    );
  }

  if (!tool.officialUrl || typeof tool.officialUrl !== 'string' || !tool.officialUrl.trim()) {
    errors.push(`Tool "${tool.name}" is missing mandatory property: "officialUrl".`);
  } else {
    try {
      const parsedUrl = new URL(tool.officialUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        errors.push(`Tool "${tool.name}" officialUrl "${tool.officialUrl}" must use http or https protocol.`);
      }
    } catch {
      errors.push(`Tool "${tool.name}" officialUrl "${tool.officialUrl}" is not a valid URL.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates an array of tools, logs developer warnings for any defective data,
 * and filters out any invalid entries to prevent UI crashes.
 */
export function validateAndSanitizeTools(rawTools: Tool[]): Tool[] {
  const validatedTools: Tool[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const tool of rawTools) {
    const result = validateTool(tool);

    if (!result.isValid) {
      console.error(`[TOOLVERSE Data Validation Error] Invalid tool dropped:`, tool.id, result.errors);
      continue;
    }

    if (seenIds.has(tool.id)) {
      console.error(`[TOOLVERSE Data Validation Error] Duplicate tool ID detected: "${tool.id}". Dropping duplicate.`);
      continue;
    }

    if (seenSlugs.has(tool.slug)) {
      console.error(`[TOOLVERSE Data Validation Error] Duplicate tool slug detected: "${tool.slug}". Dropping duplicate.`);
      continue;
    }

    seenIds.add(tool.id);
    seenSlugs.add(tool.slug);
    validatedTools.push(tool);
  }

  return validatedTools;
}

/**
 * Validates a category item.
 */
export function validateCategory(cat: Partial<Category>): boolean {
  if (!cat.id || !cat.nameAr || !cat.nameEn || !cat.slug) {
    console.error(`[TOOLVERSE Category Validation Error] Missing required category field:`, cat);
    return false;
  }
  return true;
}
