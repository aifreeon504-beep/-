/**
 * TOOLVERSE - Project Configuration & Future Binding Architecture
 * 
 * Defines constant project identifiers, reserved route definitions for future modules,
 * and structural integration points without introducing external backends or APIs.
 */

export const PROJECT_ID = 'TOOLVERSE' as const;

export interface FutureRouteConfig {
  path: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  isAvailable: boolean;
}

export const PROJECT_CONFIG = {
  id: PROJECT_ID,
  name: 'TOOLVERSE',
  version: '1.0.0',
  routes: {
    home: '/',
    tool: (slug: string) => `/tool/${slug}`,
    category: (slug: string) => `/category/${slug}`,
    about: '/about',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms',
    // Reserved routes for future expansions
    admin: '/admin',
    agent: '/agent'
  },
  futureModules: {
    admin: {
      path: '/admin',
      nameEn: 'Admin Portal',
      nameAr: 'لوحة الإدارة',
      descriptionEn: 'Future administrative management system for tools and categories.',
      descriptionAr: 'منظومة إدارة المحتوى والأدوات والتصنيفات للمراحل المستقبلية.',
      isAvailable: false
    } as FutureRouteConfig,
    agent: {
      path: '/agent',
      nameEn: 'Intelligent Agent',
      nameAr: 'الوكيل الذكي',
      descriptionEn: 'Future conversational agent and intelligent assistant.',
      descriptionAr: 'واجهة الوكيل الذكي والمساعد التفاعلي للمراحل المستقبلية.',
      isAvailable: false
    } as FutureRouteConfig
  }
} as const;

export type ReservedRouteType = 'admin' | 'agent';
