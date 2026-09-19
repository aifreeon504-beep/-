import { Tool, ToolCategory } from '../types';

/**
 * Normalizes Arabic text:
 * - Strips tashkeel / harakat
 * - Strips tatweel (kashida)
 * - Normalizes Alefs (إ, أ, آ, ا -> ا)
 * - Normalizes Taa Marbuta (ة -> ه)
 * - Normalizes Alef Maksura & Yaa (ى, ي -> ي)
 * - Normalizes Hamza variants (ؤ -> و, ئ -> ي, stand-alone ء removed)
 * - Strips punctuation and collapses whitespace
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Remove Tashkeel / Harakat
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Remove Tatweel / Kashida
    .replace(/\u0640/g, '')
    // Normalize Alefs
    .replace(/[إأآا]/g, 'ا')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Normalize Alef Maksura / Yaa
    .replace(/[ىي]/g, 'ي')
    // Normalize Hamza forms
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ء/g, '')
    // Remove punctuation & symbols
    .replace(/[؟?.,!،؛;:\-_/\\()[\]{}'"`~^&*+=|<>@#$%]/g, ' ')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes English / Latin text:
 * - Lowercases
 * - Strips punctuation & symbols
 * - Collapses whitespace
 */
export function normalizeEnglish(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Combines Arabic and English normalization for unified searching.
 */
export function normalizeQuery(text: string): string {
  if (!text) return '';
  return normalizeArabic(text);
}

/**
 * Conversational phrase tokens to extract intent from natural language queries:
 * e.g., "أداة تسوي لي فيديو", "أبغى أداة للترجمة", "أداة تشيل خلفية الصورة", "أداة تساعدني في كتابة المحتوى"
 */
const CONVERSATIONAL_STOPWORDS = [
  'ابغى', 'ابي', 'اريد', 'بدي', 'بدنا', 'محتاج', 'احتاج', 'ابحث', 'ادور',
  'اداة', 'ادات', 'الاداة', 'ادوات', 'الادوات', 'موقع', 'مواقع', 'الموقع',
  'برنامج', 'برامج', 'البرنامج', 'تطبيق', 'تطبيقات', 'التطبيق', 'خدمة', 'خدمات',
  'تسوي', 'تسويلي', 'تسوي لي', 'تعمل', 'تعملي', 'تعمل لي', 'تساعدني', 'تساعد',
  'في', 'من', 'عن', 'على', 'الى', 'مع', 'حق', 'حقت', 'لي', 'لك', 'لنا',
  'لو', 'سمحت', 'لو سمحت', 'كيف', 'افضل', 'احسن', 'اروع', 'اقوى', 'جديد',
  'ممتاز', 'ارخص', 'اعطني', 'عطني', 'عايز', 'عاوز',
  'tool', 'app', 'website', 'best', 'free', 'online', 'want', 'need', 'help',
  'for', 'to', 'with', 'me', 'the', 'an', 'a'
];

/**
 * Internal Domain Synonyms & Concept Mapping
 * Maps Arabic and English synonyms to actual categories and priority tools in TOOLVERSE.
 */
export interface SynonymConcept {
  id: string;
  canonicalAr: string;
  canonicalEn: string;
  synonyms: string[];
  phrases: string[]; // Natural language phrase triggers
  categories: ToolCategory[];
  priorityToolIds: string[]; // Boosted tools strongly representing this intent
}

export const SYNONYM_DICTIONARY: SynonymConcept[] = [
  // 1. Background Removal (إزالة الخلفية)
  {
    id: 'background-removal',
    canonicalAr: 'إزالة الخلفية',
    canonicalEn: 'Background Removal',
    synonyms: [
      'ازالة الخلفية', 'ازاله الخلفيه', 'حذف الخلفية', 'حذف الخلفيه',
      'قص الخلفية', 'قص الخلفيه', 'بدون خلفية', 'بدون خلفيه',
      'مسح الخلفية', 'مسح الخلفيه', 'تفريغ الخلفية', 'تفريغ الصور',
      'تفريغ خلفية', 'تفريغ صورة', 'قص الصور', 'عزل الخلفية',
      'background removal', 'remove background', 'remove bg', 'transparent background'
    ],
    phrases: [
      'تشيل خلفية', 'تشيل خلفيه', 'تشيل الخلفية', 'تشيل الخلفيه',
      'تمسح الخلفية', 'تمسح خلفية', 'تحذف الخلفية', 'تحذف خلفية',
      'تفرغ خلفية', 'تفرغ صورة', 'عزل خلفية'
    ],
    categories: ['images-design'],
    priorityToolIds: ['photoroom', 'clipdrop', 'canva', 'adobe-firefly']
  },

  // 2. Video Creation & Editing (فيديو ومونتاج)
  {
    id: 'video',
    canonicalAr: 'فيديو',
    canonicalEn: 'Video',
    synonyms: [
      'فيديو', 'فديو', 'مقاطع', 'مقطع', 'مونتاج', 'تحرير فيديو', 'صناعة فيديو',
      'توليد فيديو', 'انشاء فيديو', 'اخراج فيديو', 'ريلز', 'تيك توك', 'يوتيوب',
      'فيديوهات', 'سينمائي', 'تصوير', 'كليب', 'شورتس',
      'video', 'video editing', 'video generation', 'reels', 'montage', 'clips'
    ],
    phrases: [
      'تسوي لي فيديو', 'تسوي فيديو', 'تسوي مقطع', 'تعمل فيديو', 'تعمل لي فيديو',
      'توليد فيديو', 'صنع فيديو', 'مونتاج مقاطع', 'مونتاج فيديو'
    ],
    categories: ['video'],
    priorityToolIds: ['runway', 'kling', 'sora', 'capcut', 'pika', 'luma-dream-machine', 'synthesia', 'heygen']
  },

  // 3. Translation (ترجمة)
  {
    id: 'translation',
    canonicalAr: 'ترجمة',
    canonicalEn: 'Translation',
    synonyms: [
      'ترجمة', 'ترجمه', 'مترجم', 'ترجمة نصوص', 'ترجمه نصوص', 'تحويل لغة',
      'تحويل لغات', 'لغات', 'مترجم فوري', 'ترجمة دقيقة', 'ترجمة مستندات',
      'translation', 'translate', 'translator', 'multilingual'
    ],
    phrases: [
      'اداة للترجمة', 'اداة ترجمة', 'ترجمة نصوص', 'تحويل لغة', 'ترجم لي', 'مترجم ذكي'
    ],
    categories: ['writing-content', 'ai-chat'],
    priorityToolIds: ['deepl', 'chatgpt', 'claude']
  },

  // 4. Content Writing & Copywriting (كتابة المحتوى)
  {
    id: 'writing',
    canonicalAr: 'كتابة',
    canonicalEn: 'Writing',
    synonyms: [
      'كتابة', 'كتابه', 'كتابة محتوى', 'كتابه محتوى', 'نصوص', 'نص', 'تأليف',
      'تاليف', 'محتوى', 'مقالات', 'مقال', 'تدقيق', 'تدقيق لغوي', 'اعادة صياغة',
      'صياغة', 'كوبي رايتنج', 'كتابة اعلانات', 'ابحاث', 'تدوين',
      'writing', 'copywriting', 'content writing', 'grammar', 'articles', 'paraphrasing'
    ],
    phrases: [
      'تساعدني في كتابة المحتوى', 'كتابة المحتوى', 'تساعدني في الكتابة', 'كتابة مقال',
      'صياغة نصوص', 'تدقيق المقالات', 'كتابة ايميل'
    ],
    categories: ['writing-content'],
    priorityToolIds: ['jasper', 'copy-ai', 'grammarly', 'notion-ai', 'quillbot', 'writesonic', 'chatgpt', 'claude']
  },

  // 5. Graphic Design (تصميم وجرافيك)
  {
    id: 'design',
    canonicalAr: 'تصميم',
    canonicalEn: 'Design',
    synonyms: [
      'تصميم', 'ديزاين', 'جرافيك', 'تصميم صور', 'تصميم جرافيكي', 'شعار',
      'شعارات', 'لوجو', 'لوقو', 'فوتوشوب', 'اليستريتور', 'واجهات', 'فيكتور',
      'هوية بصرية', 'بنرات', 'بوستر', 'بروشور', 'تصاميم',
      'design', 'graphic design', 'ui', 'ux', 'logo', 'vector', 'mockup', 'poster'
    ],
    phrases: [
      'تصميم لوجو', 'تصميم شعار', 'تصميم صور', 'تصميم جرافيكي', 'برنامج تصميم', 'اداة ديزاين'
    ],
    categories: ['images-design'],
    priorityToolIds: ['canva', 'figma', 'adobe-firefly', 'recraft', 'midjourney']
  },

  // 6. Image Generation & Creation (توليد وإنشاء الصور)
  {
    id: 'images',
    canonicalAr: 'صور',
    canonicalEn: 'Images',
    synonyms: [
      'صور', 'صوره', 'صورة', 'انشاء صور', 'إنشاء صور', 'توليد صور', 'رسم',
      'رسومات', 'خلفيات', 'تعديل صور', 'تحسين صور', 'فوتو', 'صناع الصور',
      'فن رقمي', 'رسم بالذكاء', 'صور ذكاء اصطناعي',
      'images', 'image generation', 'text to image', 'drawing', 'photos', 'wallpapers'
    ],
    phrases: [
      'توليد صور', 'انشاء صور', 'رسم صور', 'توليد صورة', 'صنع صور', 'صورة بالذكاء'
    ],
    categories: ['images-design'],
    priorityToolIds: ['midjourney', 'dall-e-3', 'stable-diffusion', 'recraft', 'flux', 'adobe-firefly']
  },

  // 7. Programming & Coding (برمجة وتطوير)
  {
    id: 'programming',
    canonicalAr: 'برمجة',
    canonicalEn: 'Programming',
    synonyms: [
      'برمجة', 'برمجه', 'كود', 'اكواد', 'أكواد', 'تطوير', 'تطوير مواقع',
      'تطوير تطبيقات', 'مطورين', 'مطور', 'بايثون', 'جافاسكربت', 'رياكت',
      'برمجة ويب', 'تطبيقات', 'محرر اكواد', 'تصحيح كود',
      'coding', 'programming', 'developer', 'code', 'web development', 'software'
    ],
    phrases: [
      'تساعدني في البرمجة', 'توليد كود', 'كتابة اكواد', 'تصحيح الكود', 'بناء تطبيق', 'برمجة موقع'
    ],
    categories: ['programming'],
    priorityToolIds: ['cursor', 'github-copilot', 'v0', 'replit', 'lovable', 'bolt-new', 'tabnine']
  },

  // 8. Website Building (مواقع ويب)
  {
    id: 'web-building',
    canonicalAr: 'مواقع',
    canonicalEn: 'Websites',
    synonyms: [
      'مواقع', 'موقع الكتروني', 'موقع ويب', 'مواقع ويب', 'انشاء مواقع',
      'بناء مواقع', 'تصميم مواقع', 'لاندنج بيج', 'صفحات هبوط', 'ويب',
      'websites', 'web builder', 'landing page', 'web design'
    ],
    phrases: [
      'انشاء موقع', 'بناء موقع', 'تصميم موقع', 'موقع ويب', 'صفحة هبوط'
    ],
    categories: ['programming', 'seo-marketing'],
    priorityToolIds: ['framer', 'webflow', 'v0', 'lovable']
  },

  // 9. AI & Chat (ذكاء اصطناعي ومحادثة)
  {
    id: 'ai-chat',
    canonicalAr: 'محادثة',
    canonicalEn: 'Chat & AI',
    synonyms: [
      'محادثة', 'محادثه', 'شات', 'دردشة', 'دردشه', 'مساعد ذكي', 'بوت', 'شات بوت',
      'ذكاء اصطناعي', 'ai', 'ذكاء', 'اسئلة', 'استفسارات', 'بحث ذكي',
      'chat', 'chatbot', 'ai chat', 'assistant', 'conversational ai', 'reasoning'
    ],
    phrases: [
      'شات ذكي', 'مساعد ذكي', 'دردشة مع الذكاء', 'اسئلة واجوبة', 'روبوت محادثة'
    ],
    categories: ['ai-chat'],
    priorityToolIds: ['chatgpt', 'claude', 'perplexity', 'gemini', 'poe', 'deepseek']
  },

  // 10. Audio & Voice (صوت وتسجيل)
  {
    id: 'audio',
    canonicalAr: 'صوت',
    canonicalEn: 'Audio',
    synonyms: [
      'صوت', 'اصوات', 'أصوات', 'تسجيل صوتي', 'تحويل نص الى صوت', 'تعليق صوتي',
      'دوبلاج', 'تفريغ صوتي', 'صوتيات', 'نطق', 'فويس اوفر', 'بودكاست',
      'audio', 'voice', 'text to speech', 'tts', 'voiceover', 'speech to text'
    ],
    phrases: [
      'تحويل نص الى صوت', 'تسجيل صوتي', 'تعليق صوتي', 'دوبلاج صوتي', 'توليد صوت'
    ],
    categories: ['audio-music'],
    priorityToolIds: ['elevenlabs', 'whisper', 'descript', 'murf-ai', 'suno', 'udio']
  },

  // 11. Music Composition (موسيقى وأغاني)
  {
    id: 'music',
    canonicalAr: 'موسيقى',
    canonicalEn: 'Music',
    synonyms: [
      'موسيقى', 'موسيقي', 'اغاني', 'أغاني', 'اغنية', 'انشاء موسيقى', 'توليد موسيقى',
      'الحان', 'تلحين', 'مؤثرات صوتية', 'نغمات', 'توزيع موسيقي',
      'music', 'songs', 'composition', 'audio generator', 'soundtrack'
    ],
    phrases: [
      'انشاء موسيقى', 'توليد اغاني', 'صنع موسيقى', 'تلحين اغنية', 'عمل موسيقى'
    ],
    categories: ['audio-music'],
    priorityToolIds: ['suno', 'udio']
  },

  // 12. Animation & Motion (تحريك وأنيميشن)
  {
    id: 'animation',
    canonicalAr: 'تحريك',
    canonicalEn: 'Animation',
    synonyms: [
      'تحريك', 'انيميشن', 'أنيميشن', 'رسوم متحركة', 'تحريك الصور', 'موشن',
      'موشن جرافيك', 'انمي', 'تحريك رسمة', 'صورة متحركة',
      'animation', 'motion', 'motion graphics', 'animate images', '3d animation'
    ],
    phrases: [
      'تحريك الصور', 'رسوم متحركة', 'تحريك صورة', 'عمل انيميشن'
    ],
    categories: ['video'],
    priorityToolIds: ['luma-dream-machine', 'runway', 'kling', 'pika']
  },

  // 13. Marketing & SEO (تسويق وSEO)
  {
    id: 'marketing',
    canonicalAr: 'تسويق',
    canonicalEn: 'Marketing & SEO',
    synonyms: [
      'تسويق', 'ماركتنج', 'تسويق رقمي', 'اعلانات', 'إعلانات', 'سيو', 'seo',
      'كلمات مفتاحية', 'تصدر نتائج البحث', 'جوجل', 'حملات اعلانية', 'تحليل منافسين',
      'marketing', 'seo', 'ads', 'keyword research', 'search engine', 'growth'
    ],
    phrases: [
      'تحسين محركات البحث', 'كلمات مفتاحية', 'تسويق الكتروني', 'ادارة اعلانات'
    ],
    categories: ['seo-marketing'],
    priorityToolIds: ['semrush', 'ahrefs', 'surfer-seo', 'jasper', 'copy-ai']
  },

  // 14. Productivity & Task Management (إنتاجية وتنظيم)
  {
    id: 'productivity',
    canonicalAr: 'إنتاجية',
    canonicalEn: 'Productivity',
    synonyms: [
      'انتاجية', 'إنتاجية', 'تنظيم', 'ادارة مهام', 'إدارة مهام', 'ادارة العمل',
      'ملاحظات', 'جداول', 'تتبع الوقت', 'اتمتة', 'أتمتة', 'ربط التطبيقات',
      'سير العمل', 'انجاز', 'مشاريع',
      'productivity', 'automation', 'tasks', 'notes', 'workflow', 'management'
    ],
    phrases: [
      'ادارة المهام', 'تنظيم العمل', 'اتمتة العمليات', 'تدوين ملاحظات'
    ],
    categories: ['productivity'],
    priorityToolIds: ['notion', 'zapier', 'make', 'loom', 'clickup']
  }
];

/**
 * Normalizes an array of strings.
 */
function normalizeTerms(terms: string[]): string[] {
  return terms.map(normalizeQuery).filter(Boolean);
}

/**
 * Extracts matched concepts from the query.
 * Tests against exact synonyms, phrases, and conversational sub-tokens.
 */
export function detectConcepts(query: string): {
  matchedConcepts: SynonymConcept[];
  cleanedKeywords: string[];
} {
  const normQuery = normalizeQuery(query);
  const matchedConcepts: SynonymConcept[] = [];

  for (const concept of SYNONYM_DICTIONARY) {
    // 1. Check natural language phrases
    const hasPhraseMatch = concept.phrases.some((phrase) => {
      const normPhrase = normalizeQuery(phrase);
      return normQuery.includes(normPhrase);
    });

    if (hasPhraseMatch) {
      matchedConcepts.push(concept);
      continue;
    }

    // 2. Check synonyms
    const hasSynonymMatch = concept.synonyms.some((synonym) => {
      const normSynonym = normalizeQuery(synonym);
      // Check for exact word or substring boundary
      return normQuery.includes(normSynonym);
    });

    if (hasSynonymMatch) {
      matchedConcepts.push(concept);
    }
  }

  // Extract core keywords by stripping filler stopwords
  const tokens = normQuery.split(/\s+/).filter(Boolean);
  const cleanedKeywords = tokens.filter((t) => !CONVERSATIONAL_STOPWORDS.includes(t));

  return {
    matchedConcepts,
    cleanedKeywords: cleanedKeywords.length > 0 ? cleanedKeywords : tokens
  };
}

/**
 * Intelligent semantic tool search function.
 * Matches across:
 * - Direct Name (AR / EN)
 * - Descriptions (AR / EN)
 * - Keywords & Tags
 * - Synonyms & Concepts
 * - Priority Tool boosts for specific intents
 * - Category association
 */
export function searchToolsEngine(tools: Tool[], query: string): Tool[] {
  const cleanQuery = query.trim();
  if (!cleanQuery) return tools;

  const normQuery = normalizeQuery(cleanQuery);
  const { matchedConcepts, cleanedKeywords } = detectConcepts(cleanQuery);

  // Collect boosted tool IDs and target categories from detected concepts
  const boostedToolIds = new Set<string>();
  const targetCategories = new Set<ToolCategory>();

  matchedConcepts.forEach((c) => {
    c.priorityToolIds.forEach((id) => boostedToolIds.add(id.toLowerCase()));
    c.categories.forEach((cat) => targetCategories.add(cat));
  });

  // Calculate matching scores for all tools
  const scoredTools: Array<{ tool: Tool; score: number }> = [];

  for (const tool of tools) {
    let score = 0;

    const normName = normalizeEnglish(tool.name);
    const normNameAr = normalizeArabic(tool.nameAr || '');
    const normNameEn = normalizeEnglish(tool.nameEn || tool.name);
    const normDescAr = normalizeArabic(tool.descriptionAr);
    const normDescEn = normalizeEnglish(tool.descriptionEn);
    const normLongDescAr = normalizeArabic(tool.longDescriptionAr || '');
    const normSubcategory = normalizeArabic(tool.subcategory || '');

    const normKeywords = tool.keywords.map(normalizeQuery);
    const normTags = tool.tags.map(normalizeQuery);
    const normFeatures = (tool.features?.ar || []).map(normalizeQuery)
      .concat((tool.features?.en || []).map(normalizeEnglish));

    // 1. Direct Name Match (Highest priority)
    if (normName === normQuery || normNameAr === normQuery || normNameEn === normQuery) {
      score += 150;
    } else if (normName.includes(normQuery) || normNameAr.includes(normQuery) || normNameEn.includes(normQuery)) {
      score += 90;
    }

    // Check each individual keyword token in name
    cleanedKeywords.forEach((token) => {
      if (normName.includes(token) || normNameAr.includes(token) || normNameEn.includes(token)) {
        score += 50;
      }
    });

    // 2. Direct Priority Tool boost from detected concepts (e.g. "أداة تشيل خلفية" -> photoroom)
    if (boostedToolIds.has(tool.id.toLowerCase())) {
      score += 85;
    }

    // 3. Category match from detected concepts
    if (targetCategories.has(tool.category)) {
      score += 45;
    }

    // 4. Keywords & Tags matching
    for (const kw of normKeywords) {
      if (kw === normQuery) {
        score += 60;
      } else if (kw.includes(normQuery)) {
        score += 40;
      } else {
        cleanedKeywords.forEach((token) => {
          if (kw.includes(token)) score += 25;
        });
      }
    }

    for (const tag of normTags) {
      if (tag === normQuery) {
        score += 50;
      } else if (tag.includes(normQuery)) {
        score += 30;
      } else {
        cleanedKeywords.forEach((token) => {
          if (tag.includes(token)) score += 20;
        });
      }
    }

    // 5. Descriptions & Subcategory matching
    if (normDescAr.includes(normQuery) || normDescEn.includes(normQuery)) {
      score += 35;
    }
    if (normLongDescAr.includes(normQuery)) {
      score += 25;
    }
    if (normSubcategory.includes(normQuery)) {
      score += 30;
    }

    cleanedKeywords.forEach((token) => {
      if (normDescAr.includes(token) || normDescEn.includes(token)) {
        score += 15;
      }
      if (normFeatures.some((f) => f.includes(token))) {
        score += 20;
      }
    });

    // 6. Concept synonyms matching directly in tool metadata
    for (const concept of matchedConcepts) {
      for (const syn of concept.synonyms) {
        const normSyn = normalizeQuery(syn);
        if (
          normDescAr.includes(normSyn) ||
          normKeywords.some((k) => k.includes(normSyn)) ||
          normTags.some((t) => t.includes(normSyn))
        ) {
          score += 25;
          break;
        }
      }
    }

    // Add tiny tie-breaker based on popularity score
    if (score > 0) {
      score += (tool.popularityScore || 50) * 0.05;
      scoredTools.push({ tool, score });
    }
  }

  // Sort by score descending
  scoredTools.sort((a, b) => b.score - a.score);

  // If we have matching results, return them
  if (scoredTools.length > 0) {
    return scoredTools.map((item) => item.tool);
  }

  // Fallback: If no direct match was found, but concept categories were detected,
  // return tools from the closest detected categories to never leave the user empty-handed!
  if (targetCategories.size > 0) {
    const fallbackTools = tools.filter((t) => targetCategories.has(t.category));
    if (fallbackTools.length > 0) {
      return fallbackTools;
    }
  }

  return [];
}
