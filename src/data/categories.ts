import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'ai-chat',
    nameAr: 'الذكاء الاصطناعي والمحادثة',
    nameEn: 'AI & Chat',
    slug: 'ai-chat',
    descriptionAr: 'نماذج لغوية متقدمة ومساعدين أذكياء للمحادثة والبحث وتحليل المعلومات',
    descriptionEn: 'Advanced language models and conversational AI assistants for reasoning and research',
    icon: 'Bot',
    order: 1,
    isActive: true
  },
  {
    id: 'images-design',
    nameAr: 'الصور والتصميم',
    nameEn: 'Images & Design',
    slug: 'images-design',
    descriptionAr: 'أدوات توليد وتعديل الصور والرسوميات وإزالة الخلفيات وتصميم الجرافيك',
    descriptionEn: 'AI image generation, vector editing, photo enhancement, and graphic design',
    icon: 'Image',
    order: 2,
    isActive: true
  },
  {
    id: 'video',
    nameAr: 'الفيديو والأنيميشن',
    nameEn: 'Video',
    slug: 'video',
    descriptionAr: 'إنشاء وتعديل الفيديوهات السينمائية وصناعة المقاطع والشخصيات الرمزية',
    descriptionEn: 'Video generation, AI avatars, automated editing, and motion design',
    icon: 'Video',
    order: 3,
    isActive: true
  },
  {
    id: 'audio-music',
    nameAr: 'الصوت والموسيقى',
    nameEn: 'Audio & Music',
    slug: 'audio-music',
    descriptionAr: 'توليد الأصوات الواقعية والموسيقى وتفريغ التسجيلات وتلخيص الاجتماعات',
    descriptionEn: 'Voice generation, music composition, speech-to-text, and meeting notes',
    icon: 'Music',
    order: 4,
    isActive: true
  },
  {
    id: 'writing-content',
    nameAr: 'الكتابة والمحتوى',
    nameEn: 'Writing & Content',
    slug: 'writing-content',
    descriptionAr: 'كتابة المقالات وإعادة الصياغة والتدقيق اللغوي والترجمة الاحترافية',
    descriptionEn: 'Copywriting, text paraphrasing, grammar checking, and multilingual translation',
    icon: 'PenTool',
    order: 5,
    isActive: true
  },
  {
    id: 'programming',
    nameAr: 'البرمجة وبناء التطبيقات',
    nameEn: 'Programming & App Building',
    slug: 'programming',
    descriptionAr: 'محررات ذكية ومساعدات برمجية لتطوير الأكواد وبناء التطبيقات بسرعة فائقة',
    descriptionEn: 'AI-assisted code editors, web app builders, and development environments',
    icon: 'Code2',
    order: 6,
    isActive: true
  },
  {
    id: 'productivity',
    nameAr: 'الإنتاجية والأتمتة',
    nameEn: 'Productivity & Automation',
    slug: 'productivity',
    descriptionAr: 'تنظيم المهام وإدارة المعرفة وربط التطبيقات وأتمتة مسارات العمل اليومية',
    descriptionEn: 'Knowledge workspaces, workflow automation, screen recording, and task management',
    icon: 'Zap',
    order: 7,
    isActive: true
  },
  {
    id: 'seo-marketing',
    nameAr: 'SEO والتسويق',
    nameEn: 'SEO & Marketing',
    slug: 'seo-marketing',
    descriptionAr: 'تحليل الكلمات المفتاحية وتحسين محركات البحث وبناء صفحات الهبوط والعروض',
    descriptionEn: 'Search engine optimization, keyword research, website building, and presentations',
    icon: 'TrendingUp',
    order: 8,
    isActive: true
  },
  {
    id: 'other',
    nameAr: 'أدوات أخرى مميزة',
    nameEn: 'Other',
    slug: 'other',
    descriptionAr: 'أدوات تخطيط الخرائط الذهنية والعروض التقديمية ومعالجة الصور السريعة',
    descriptionEn: 'Mind mapping, visual brainstorms, rapid object removal, and smart decks',
    icon: 'Sparkles',
    order: 9,
    isActive: true
  }
];
