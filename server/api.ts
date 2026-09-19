import { Router, Request, Response } from 'express';
import { db } from './db';
import {
  PROJECT_ID,
  ALLOWED_OPERATIONS,
  authenticateAgent,
  enforceAllowlist,
  hashIp
} from './security';
import { Tool, Category } from '../src/types';

export const publicApi = Router();
export const agentApi = Router();

// ============================================================================
// 1. PUBLIC API (Read-only for public website visitors)
// ============================================================================

publicApi.get('/meta', (_req: Request, res: Response) => {
  const tools = db.getAllTools();
  const categories = db.getAllCategories();
  res.json({
    projectId: PROJECT_ID,
    name: 'TOOLVERSE',
    version: '1.0.0',
    totalActiveTools: tools.length,
    totalActiveCategories: categories.length,
    status: 'online'
  });
});

publicApi.get('/tools', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  let tools = db.getAllTools();

  if (category && category !== 'all') {
    tools = tools.filter((t) => t.category === category);
  }

  res.json({
    projectId: PROJECT_ID,
    count: tools.length,
    tools
  });
});

publicApi.get('/tools/:id', (req: Request, res: Response) => {
  const tool = db.getToolById(req.params.id);
  if (!tool) {
    res.status(404).json({ error: 'Not Found', message: 'Tool not found' });
    return;
  }
  res.json({ tool });
});

publicApi.get('/categories', (_req: Request, res: Response) => {
  const categories = db.getAllCategories();
  res.json({
    projectId: PROJECT_ID,
    count: categories.length,
    categories
  });
});

publicApi.get('/categories/:id', (req: Request, res: Response) => {
  const category = db.getCategoryById(req.params.id);
  if (!category) {
    res.status(404).json({ error: 'Not Found', message: 'Category not found' });
    return;
  }
  res.json({ category });
});

// ============================================================================
// 2. PROTECTED AGENT / ADMIN API (Requires TOOLVERSE_AGENT_SECRET)
// ============================================================================

// Apply authentication and allowlist verification to all agent endpoints
agentApi.use(authenticateAgent);
agentApi.use(enforceAllowlist);

/**
 * Metadata and Allowlist manifest for future Agent integration
 */
agentApi.get('/meta', (req: Request, res: Response) => {
  db.appendAuditLog({
    operation: 'GET /api/agent/v1/meta',
    source: 'agent',
    targetType: 'system',
    success: true,
    message: 'Inspected agent metadata and allowlist',
    ipHash: hashIp(req)
  });

  res.json({
    projectId: PROJECT_ID,
    version: '1.0.0',
    status: 'ready',
    allowedOperations: ALLOWED_OPERATIONS,
    toolsCount: db.getAllTools(true).length,
    categoriesCount: db.getAllCategories(true).length
  });
});

// --- Tools Management ---

agentApi.get('/tools', (req: Request, res: Response) => {
  const tools = db.getAllTools(true);
  db.appendAuditLog({
    operation: 'GET /api/agent/v1/tools',
    source: 'agent',
    targetType: 'tool',
    success: true,
    message: `Fetched all ${tools.length} tools`,
    ipHash: hashIp(req)
  });
  res.json({ tools });
});

agentApi.get('/tools/:id', (req: Request, res: Response) => {
  const tool = db.getToolById(req.params.id);
  if (!tool) {
    db.appendAuditLog({
      operation: `GET /api/agent/v1/tools/${req.params.id}`,
      source: 'agent',
      targetType: 'tool',
      targetId: req.params.id,
      success: false,
      message: 'Tool not found',
      ipHash: hashIp(req)
    });
    res.status(404).json({ error: 'Not Found', message: `Tool "${req.params.id}" not found` });
    return;
  }

  db.appendAuditLog({
    operation: `GET /api/agent/v1/tools/${req.params.id}`,
    source: 'agent',
    targetType: 'tool',
    targetId: tool.id,
    success: true,
    ipHash: hashIp(req)
  });
  res.json({ tool });
});

agentApi.post('/tools', (req: Request, res: Response) => {
  const body = req.body as Partial<Tool>;

  // Strict Validation
  if (!body.id || !body.slug || !body.name || !body.category || !body.officialUrl) {
    db.appendAuditLog({
      operation: 'POST /api/agent/v1/tools',
      source: 'agent',
      targetType: 'tool',
      targetId: body.id,
      success: false,
      message: 'Validation failure: missing required fields (id, slug, name, category, officialUrl)',
      ipHash: hashIp(req)
    });
    res.status(400).json({
      error: 'Bad Request',
      message: 'Missing required tool fields: id, slug, name, category, officialUrl'
    });
    return;
  }

  const toolPayload: Tool = {
    id: String(body.id).trim().toLowerCase(),
    slug: String(body.slug).trim().toLowerCase(),
    name: String(body.name).trim(),
    nameAr: String(body.nameAr || body.name).trim(),
    nameEn: String(body.nameEn || body.name).trim(),
    descriptionAr: String(body.descriptionAr || '').trim(),
    descriptionEn: String(body.descriptionEn || '').trim(),
    longDescriptionAr: String(body.longDescriptionAr || body.descriptionAr || '').trim(),
    longDescriptionEn: String(body.longDescriptionEn || body.descriptionEn || '').trim(),
    category: body.category,
    subcategory: String(body.subcategory || 'General').trim(),
    pricing: body.pricing || 'Freemium',
    officialUrl: String(body.officialUrl).trim(),
    icon: String(body.icon || 'Sparkles').trim(),
    brandColor: body.brandColor || '#F59E0B',
    features: body.features || { ar: [], en: [] },
    keywords: Array.isArray(body.keywords) ? body.keywords : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    featured: Boolean(body.featured),
    isNew: body.isNew !== undefined ? Boolean(body.isNew) : true,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    popularityScore: typeof body.popularityScore === 'number' ? body.popularityScore : 50
  };

  const result = db.addTool(toolPayload);
  if (!result.success) {
    db.appendAuditLog({
      operation: 'POST /api/agent/v1/tools',
      source: 'agent',
      targetType: 'tool',
      targetId: toolPayload.id,
      success: false,
      message: result.error,
      ipHash: hashIp(req)
    });
    res.status(409).json({ error: 'Conflict', message: result.error });
    return;
  }

  db.appendAuditLog({
    operation: 'POST /api/agent/v1/tools',
    source: 'agent',
    targetType: 'tool',
    targetId: toolPayload.id,
    success: true,
    message: `Created new tool: ${toolPayload.name} (${toolPayload.id})`,
    ipHash: hashIp(req)
  });

  res.status(201).json({
    success: true,
    message: 'Tool created successfully',
    tool: result.tool
  });
});

agentApi.put('/tools/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const updates = req.body as Partial<Tool>;

  const result = db.updateTool(id, updates);
  if (!result.success) {
    db.appendAuditLog({
      operation: `PUT /api/agent/v1/tools/${id}`,
      source: 'agent',
      targetType: 'tool',
      targetId: id,
      success: false,
      message: result.error,
      ipHash: hashIp(req)
    });
    res.status(400).json({ error: 'Bad Request', message: result.error });
    return;
  }

  db.appendAuditLog({
    operation: `PUT /api/agent/v1/tools/${id}`,
    source: 'agent',
    targetType: 'tool',
    targetId: id,
    success: true,
    message: `Updated tool ${id}`,
    ipHash: hashIp(req)
  });

  res.json({
    success: true,
    message: 'Tool updated successfully',
    tool: result.tool
  });
});

agentApi.delete('/tools/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const confirm = req.body?.confirm === true || req.query?.confirm === 'true';
  const forceUnlock = req.body?.forceUnlock === true || req.query?.forceUnlock === 'true';

  const result = db.deleteTool(id, { confirm, forceUnlock });
  if (!result.success) {
    db.appendAuditLog({
      operation: `DELETE /api/agent/v1/tools/${id}`,
      source: 'agent',
      targetType: 'tool',
      targetId: id,
      success: false,
      message: result.error,
      ipHash: hashIp(req)
    });
    res.status(400).json({
      error: 'Bad Request',
      message: result.error
    });
    return;
  }

  db.appendAuditLog({
    operation: `DELETE /api/agent/v1/tools/${id}`,
    source: 'agent',
    targetType: 'tool',
    targetId: id,
    success: true,
    message: `Deleted tool ${id} with explicit confirmation`,
    ipHash: hashIp(req)
  });

  res.json({
    success: true,
    message: `Tool "${id}" has been deleted.`
  });
});

// --- Categories Management ---

agentApi.get('/categories', (req: Request, res: Response) => {
  const categories = db.getAllCategories(true);
  db.appendAuditLog({
    operation: 'GET /api/agent/v1/categories',
    source: 'agent',
    targetType: 'category',
    success: true,
    message: `Fetched all ${categories.length} categories`,
    ipHash: hashIp(req)
  });
  res.json({ categories });
});

agentApi.get('/categories/:id', (req: Request, res: Response) => {
  const category = db.getCategoryById(req.params.id);
  if (!category) {
    db.appendAuditLog({
      operation: `GET /api/agent/v1/categories/${req.params.id}`,
      source: 'agent',
      targetType: 'category',
      targetId: req.params.id,
      success: false,
      message: 'Category not found',
      ipHash: hashIp(req)
    });
    res.status(404).json({ error: 'Not Found', message: `Category "${req.params.id}" not found` });
    return;
  }
  res.json({ category });
});

agentApi.post('/categories', (req: Request, res: Response) => {
  const body = req.body as Partial<Category>;

  if (!body.id || !body.nameAr || !body.nameEn || !body.slug) {
    db.appendAuditLog({
      operation: 'POST /api/agent/v1/categories',
      source: 'agent',
      targetType: 'category',
      targetId: body.id,
      success: false,
      message: 'Missing required fields for category (id, nameAr, nameEn, slug)',
      ipHash: hashIp(req)
    });
    res.status(400).json({
      error: 'Bad Request',
      message: 'Missing required category fields: id, nameAr, nameEn, slug'
    });
    return;
  }

  const categoryPayload: Category = {
    id: body.id as any,
    nameAr: String(body.nameAr).trim(),
    nameEn: String(body.nameEn).trim(),
    slug: String(body.slug).trim().toLowerCase(),
    descriptionAr: String(body.descriptionAr || '').trim(),
    descriptionEn: String(body.descriptionEn || '').trim(),
    icon: String(body.icon || 'Folder').trim(),
    order: typeof body.order === 'number' ? body.order : 99,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true
  };

  const result = db.addCategory(categoryPayload);
  if (!result.success) {
    db.appendAuditLog({
      operation: 'POST /api/agent/v1/categories',
      source: 'agent',
      targetType: 'category',
      targetId: categoryPayload.id,
      success: false,
      message: result.error,
      ipHash: hashIp(req)
    });
    res.status(409).json({ error: 'Conflict', message: result.error });
    return;
  }

  db.appendAuditLog({
    operation: 'POST /api/agent/v1/categories',
    source: 'agent',
    targetType: 'category',
    targetId: categoryPayload.id,
    success: true,
    message: `Created category ${categoryPayload.id}`,
    ipHash: hashIp(req)
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    category: result.category
  });
});

agentApi.put('/categories/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const updates = req.body as Partial<Category>;

  const result = db.updateCategory(id, updates);
  if (!result.success) {
    db.appendAuditLog({
      operation: `PUT /api/agent/v1/categories/${id}`,
      source: 'agent',
      targetType: 'category',
      targetId: id,
      success: false,
      message: result.error,
      ipHash: hashIp(req)
    });
    res.status(400).json({ error: 'Bad Request', message: result.error });
    return;
  }

  db.appendAuditLog({
    operation: `PUT /api/agent/v1/categories/${id}`,
    source: 'agent',
    targetType: 'category',
    targetId: id,
    success: true,
    message: `Updated category ${id}`,
    ipHash: hashIp(req)
  });

  res.json({
    success: true,
    message: 'Category updated successfully',
    category: result.category
  });
});

agentApi.delete('/categories/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const confirm = req.body?.confirm === true || req.query?.confirm === 'true';

  const result = db.deleteCategory(id, confirm);
  if (!result.success) {
    db.appendAuditLog({
      operation: `DELETE /api/agent/v1/categories/${id}`,
      source: 'agent',
      targetType: 'category',
      targetId: id,
      success: false,
      message: result.error,
      ipHash: hashIp(req)
    });
    res.status(400).json({ error: 'Bad Request', message: result.error });
    return;
  }

  db.appendAuditLog({
    operation: `DELETE /api/agent/v1/categories/${id}`,
    source: 'agent',
    targetType: 'category',
    targetId: id,
    success: true,
    message: `Deleted category ${id}`,
    ipHash: hashIp(req)
  });

  res.json({
    success: true,
    message: `Category "${id}" has been deleted.`
  });
});

// --- Audit Log Access ---

agentApi.get('/audit-log', (req: Request, res: Response) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 100, 250);
  const logs = db.getAuditLogs(limit);

  res.json({
    projectId: PROJECT_ID,
    count: logs.length,
    logs
  });
});
