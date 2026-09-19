import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Flame,
  Sparkles,
  Bot,
  Image,
  Video,
  Music,
  PenTool,
  Code2,
  Zap,
  TrendingUp,
  Gift,
  LayoutGrid,
  Search,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { Tool, Category, Language, Theme, ToolCategory, PricingType, SortOption } from './types';
import { toolRepository } from './repository/toolRepository';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { ToolCard } from './components/ToolCard';
import { ToolDetailsView } from './components/ToolDetailsView';
import { CategoryPageView } from './components/CategoryPageView';
import { SectionHeader } from './components/SectionHeader';
import { SkeletonCard } from './components/SkeletonCard';
import { Footer } from './components/Footer';
import { StaticPages, StaticPageType } from './components/StaticPages';
import { FutureRouteSlot } from './components/FutureRouteSlot';
import { PROJECT_ID, PROJECT_CONFIG, ReservedRouteType } from './config/project';
import { updatePageSeo, buildCategoryJsonLd } from './utils/seo';
import { trackPageView } from './config/integrations';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Language state (AR default, stored in localStorage)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('toolverse_lang');
    return saved === 'en' ? 'en' : 'ar';
  });

  // 2. Theme state (Dark default, stored in localStorage)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('toolverse_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // 3. Routing & Selection states
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategoryPage, setSelectedCategoryPage] = useState<Category | null>(null);
  const [selectedStaticPage, setSelectedStaticPage] = useState<StaticPageType | null>(null);
  const [futureRoute, setFutureRoute] = useState<ReservedRouteType | null>(null);

  // 4. Data version state for dynamic repository reactivity
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    // Initial sync from backend database
    toolRepository.syncFromBackend();

    const unsubscribe = toolRepository.subscribe(() => {
      setDataVersion((v) => v + 1);
    });
    return unsubscribe;
  }, []);

  // 5. Filtering states on Main Directory
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [activePricing, setActivePricing] = useState<PricingType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sync HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('toolverse_lang', lang);
  }, [lang]);

  // Sync Theme class on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#07090e';
      document.body.style.color = '#f1f5f9';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
    localStorage.setItem('toolverse_theme', theme);
  }, [theme]);

  // Parse path / query for Clean URL routing (/tool/:slug, /category/:slug, /about, /contact, etc.)
  const syncRouteFromUrl = useCallback(() => {
    const pathname = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);

    // 0. Check Future Reserved Routes (/admin, /agent)
    const routeParam = searchParams.get('route');
    if (pathname === '/admin' || routeParam === 'admin') {
      setFutureRoute('admin');
      setSelectedTool(null);
      setSelectedCategoryPage(null);
      setSelectedStaticPage(null);
      return;
    }
    if (pathname === '/agent' || routeParam === 'agent') {
      setFutureRoute('agent');
      setSelectedTool(null);
      setSelectedCategoryPage(null);
      setSelectedStaticPage(null);
      return;
    }
    setFutureRoute(null);

    // 1. Check Static Pages
    const staticParam = searchParams.get('page');
    if (pathname === '/about' || staticParam === 'about') {
      setSelectedStaticPage('about');
      setSelectedTool(null);
      setSelectedCategoryPage(null);
      return;
    }
    if (pathname === '/contact' || staticParam === 'contact') {
      setSelectedStaticPage('contact');
      setSelectedTool(null);
      setSelectedCategoryPage(null);
      return;
    }
    if (pathname === '/privacy' || staticParam === 'privacy') {
      setSelectedStaticPage('privacy');
      setSelectedTool(null);
      setSelectedCategoryPage(null);
      return;
    }
    if (pathname === '/terms' || staticParam === 'terms') {
      setSelectedStaticPage('terms');
      setSelectedTool(null);
      setSelectedCategoryPage(null);
      return;
    }

    // 2. Check Tool path / query
    const toolSlugFromPath = pathname.startsWith('/tool/') ? pathname.replace('/tool/', '') : null;
    const toolSlugFromQuery = searchParams.get('tool');
    const targetToolSlug = toolSlugFromPath || toolSlugFromQuery;

    if (targetToolSlug) {
      const tool = toolRepository.getToolBySlug(targetToolSlug) || toolRepository.getToolById(targetToolSlug);
      if (tool) {
        setSelectedTool(tool);
        setSelectedCategoryPage(null);
        setSelectedStaticPage(null);
        return;
      }
    }

    // 3. Check Category path / query
    const catSlugFromPath = pathname.startsWith('/category/') ? pathname.replace('/category/', '') : null;
    const catSlugFromQuery = searchParams.get('category');
    const targetCatSlug = catSlugFromPath || catSlugFromQuery;

    if (targetCatSlug) {
      const cat = toolRepository.getCategoryBySlug(targetCatSlug) || toolRepository.getCategoryById(targetCatSlug as ToolCategory);
      if (cat) {
        setSelectedCategoryPage(cat);
        setSelectedTool(null);
        setSelectedStaticPage(null);
        return;
      }
    }

    // Default: Main directory
    setSelectedTool(null);
    setSelectedCategoryPage(null);
    setSelectedStaticPage(null);
  }, []);

  useEffect(() => {
    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => window.removeEventListener('popstate', syncRouteFromUrl);
  }, [syncRouteFromUrl]);

  // Update dynamic document title & meta description based on current view
  useEffect(() => {
    const isAr = lang === 'ar';
    if (futureRoute) {
      const config = PROJECT_CONFIG.futureModules[futureRoute];
      updatePageSeo({
        title: `${isAr ? config.nameAr : config.nameEn} | ${PROJECT_ID}`,
        description: isAr ? config.descriptionAr : config.descriptionEn,
        canonicalUrl: `${window.location.origin}${config.path}`
      });
      trackPageView(config.path);
    } else if (selectedTool) {
      // ToolDetailsView manages its own fine-grained SEO, but we provide fallback here
      const seo = toolRepository.getToolSeo(selectedTool, lang);
      updatePageSeo({
        title: seo.title,
        description: seo.metaDescription,
        canonicalUrl: `${window.location.origin}/tool/${selectedTool.slug}`
      });
      trackPageView(`/tool/${selectedTool.slug}`);
    } else if (selectedCategoryPage) {
      const seo = toolRepository.getCategorySeo(selectedCategoryPage, lang);
      const count = toolRepository.getCategoryToolCount(selectedCategoryPage.id);
      updatePageSeo({
        title: seo.title,
        description: seo.metaDescription,
        canonicalUrl: `${window.location.origin}/category/${selectedCategoryPage.slug}`,
        jsonLd: buildCategoryJsonLd(selectedCategoryPage, count, lang)
      });
      trackPageView(`/category/${selectedCategoryPage.slug}`);
    } else if (selectedStaticPage) {
      let title = '';
      let desc = '';
      switch (selectedStaticPage) {
        case 'about':
          title = isAr ? 'عن TOOLVERSE | دليل الأدوات الرقمية والذكاء الاصطناعي' : 'About TOOLVERSE | Digital & AI Tools Directory';
          desc = isAr ? 'تعرف على رسالة TOOLVERSE في تيسير الوصول لأفضل الأدوات والمنصات التكنولوجية الرسمية.' : 'Learn about TOOLVERSE and our mission to curate verified digital and AI instruments.';
          break;
        case 'contact':
          title = isAr ? 'تواصل معنا | TOOLVERSE' : 'Contact Us | TOOLVERSE';
          desc = isAr ? 'تواصل مع فريق عمل TOOLVERSE للاقتراحات والملاحظات وإضافة أدوات جديدة.' : 'Get in touch with the TOOLVERSE team for suggestions, feedback, and tool additions.';
          break;
        case 'privacy':
          title = isAr ? 'سياسة الخصوصية | TOOLVERSE' : 'Privacy Policy | TOOLVERSE';
          desc = isAr ? 'سياسة الخصوصية وحماية بيانات الزائر في منصة TOOLVERSE.' : 'Privacy policy and visitor data protection terms for TOOLVERSE.';
          break;
        case 'terms':
          title = isAr ? 'شروط الاستخدام | TOOLVERSE' : 'Terms of Service | TOOLVERSE';
          desc = isAr ? 'شروط وقواعد استخدام دليل الأدوات الرقمية TOOLVERSE.' : 'Terms and conditions for utilizing the TOOLVERSE directory.';
          break;
      }
      updatePageSeo({
        title,
        description: desc,
        canonicalUrl: `${window.location.origin}/${selectedStaticPage}`
      });
      trackPageView(`/${selectedStaticPage}`);
    } else {
      updatePageSeo({
        title: isAr
          ? 'TOOLVERSE | دليل الأدوات والمواقع الرقمية والذكاء الاصطناعي'
          : 'TOOLVERSE | Curated Digital & AI Tools Directory',
        description: isAr
          ? 'دليل عام وشامل لاكتشاف أفضل الأدوات والمواقع الرقمية وأدوات الذكاء الاصطناعي مع روابط الاستخدام الرسمية والمباشرة.'
          : 'Explore a curated public directory of verified AI models, digital tools, and creative apps with direct official access.',
        canonicalUrl: window.location.origin
      });
      trackPageView('/');
    }
  }, [futureRoute, selectedTool, selectedCategoryPage, selectedStaticPage, lang]);

  // Navigation handlers
  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setSelectedCategoryPage(null);
    setSelectedStaticPage(null);
    setFutureRoute(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const newUrl = `/tool/${tool.slug}`;
    window.history.pushState({ toolSlug: tool.slug }, '', newUrl);
  };

  const handleSelectCategoryPage = (cat: Category) => {
    setSelectedCategoryPage(cat);
    setSelectedTool(null);
    setSelectedStaticPage(null);
    setFutureRoute(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const newUrl = `/category/${cat.slug}`;
    window.history.pushState({ categorySlug: cat.slug }, '', newUrl);
  };

  const handleNavigateStaticPage = (page: StaticPageType) => {
    setSelectedStaticPage(page);
    setSelectedTool(null);
    setSelectedCategoryPage(null);
    setFutureRoute(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const newUrl = `/${page}`;
    window.history.pushState({ staticPage: page }, '', newUrl);
  };

  const handleNavigateHome = () => {
    setSelectedTool(null);
    setSelectedCategoryPage(null);
    setSelectedStaticPage(null);
    setFutureRoute(null);
    setSearchQuery('');
    setActiveCategory('all');
    setActivePricing('all');
    setSortBy('popular');
    setFeaturedOnly(false);
    setNewOnly(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.history.pushState({}, '', '/');
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCategoryTabSelect = (catId: ToolCategory | 'all') => {
    setIsFiltering(true);
    setActiveCategory(catId);
    if (futureRoute || selectedTool || selectedCategoryPage || selectedStaticPage) {
      setFutureRoute(null);
      setSelectedTool(null);
      setSelectedCategoryPage(null);
      setSelectedStaticPage(null);
      window.history.pushState({}, '', '/');
    }
    setTimeout(() => setIsFiltering(false), 100);
  };

  const handlePricingSelect = (pricing: PricingType | 'all') => {
    setIsFiltering(true);
    setActivePricing(pricing);
    setTimeout(() => setIsFiltering(false), 100);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (futureRoute || selectedTool || selectedCategoryPage || selectedStaticPage) {
      setFutureRoute(null);
      setSelectedTool(null);
      setSelectedCategoryPage(null);
      setSelectedStaticPage(null);
      window.history.pushState({}, '', '/');
    }
  };

  // Categories and tools from repository (reactive to dataVersion)
  const allCategories = useMemo(() => toolRepository.getCategories(), [dataVersion]);
  const allTools = useMemo(() => toolRepository.getTools(), [dataVersion]);

  // Filtered & Sorted tools for Search / Filter mode via Repository
  const filteredTools = useMemo(() => {
    return toolRepository.getTools({
      searchQuery: searchQuery.trim() || undefined,
      category: activeCategory !== 'all' ? activeCategory : undefined,
      pricing: activePricing !== 'all' ? activePricing : undefined,
      featured: featuredOnly ? true : undefined,
      isNew: newOnly ? true : undefined,
      sortBy
    });
  }, [searchQuery, activeCategory, activePricing, featuredOnly, newOnly, sortBy]);

  // Curated section slices for standard Homepage layout
  const trendingTools = useMemo(() => toolRepository.getFeaturedTools(6), []);
  const newTools = useMemo(() => toolRepository.getNewTools(6), []);
  const freeTools = useMemo(
    () => toolRepository.getTools({ pricing: 'Free', sortBy: 'popular' }).slice(0, 6),
    []
  );

  const isSearchOrFilterActive =
    searchQuery.trim().length > 0 ||
    activeCategory !== 'all' ||
    activePricing !== 'all' ||
    featuredOnly ||
    newOnly ||
    sortBy !== 'popular';

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Global Header */}
      <Header
        lang={lang}
        theme={theme}
        onToggleLang={handleToggleLang}
        onToggleTheme={handleToggleTheme}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={(catId) => {
          if (catId === 'all') {
            handleNavigateHome();
          } else {
            const cat = toolRepository.getCategoryById(catId);
            if (cat) {
              handleSelectCategoryPage(cat);
            }
          }
        }}
        onNavigateStaticPage={handleNavigateStaticPage}
        activeCategory={selectedCategoryPage ? selectedCategoryPage.id : activeCategory}
        isDetailsOpen={!!futureRoute || !!selectedTool || !!selectedCategoryPage || !!selectedStaticPage}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* VIEW 0: Future Reserved Route Slots (/admin, /agent) */}
          {futureRoute ? (
            <FutureRouteSlot
              key={`future-route-${futureRoute}`}
              route={futureRoute}
              lang={lang}
              onNavigateHome={handleNavigateHome}
            />
          ) : selectedStaticPage ? (
            /* VIEW 1: Static Pages (/about, /contact, /privacy, /terms) */
            <StaticPages
              key={`static-page-${selectedStaticPage}`}
              page={selectedStaticPage}
              lang={lang}
              onNavigateHome={handleNavigateHome}
              onNavigatePage={handleNavigateStaticPage}
            />
          ) : selectedTool ? (
            /* VIEW 2: Tool Details View (/tool/:slug) */
            <ToolDetailsView
              key={`tool-page-${selectedTool.slug}`}
              tool={selectedTool}
              lang={lang}
              onBack={handleNavigateHome}
              onSelectCategory={(cat) => handleSelectCategoryPage(cat)}
              onSelectTool={handleSelectTool}
            />
          ) : selectedCategoryPage ? (
            /* VIEW 3: Dedicated Category Page (/category/:slug) */
            <CategoryPageView
              key={`category-page-${selectedCategoryPage.slug}`}
              category={selectedCategoryPage}
              lang={lang}
              onBack={handleNavigateHome}
              onSelectTool={handleSelectTool}
              onSelectCategory={(cat) => handleSelectCategoryPage(cat)}
            />
          ) : (
            /* VIEW 4: Main Directory Homepage */
            <motion.div
              key="directory-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Hero Banner */}
              <Hero
                lang={lang}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSelectTag={(tag) => {
                  if (tag === 'free') {
                    setActivePricing('Free');
                  } else {
                    setSearchQuery(tag);
                  }
                }}
              />

              {/* Category Nav Tabs and Pricing Filter */}
              <CategoryNav
                lang={lang}
                activeCategory={activeCategory}
                onSelectCategory={handleCategoryTabSelect}
                activePricing={activePricing}
                onSelectPricing={handlePricingSelect}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Filtered Results or Active Search */}
                {isSearchOrFilterActive ? (
                  <section className="pt-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-3">
                        <SlidersHorizontal className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                          {searchQuery
                            ? lang === 'ar'
                              ? `نتائج البحث عن: "${searchQuery}"`
                              : `Search results for: "${searchQuery}"`
                            : activeCategory !== 'all'
                            ? allCategories.find((c) => c.id === activeCategory)?.[lang === 'ar' ? 'nameAr' : 'nameEn']
                            : lang === 'ar'
                            ? 'الأدوات المفلترة'
                            : 'Filtered Tools'}
                        </h2>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                          {lang === 'ar' ? 'نتائج مطابقة' : 'Matching Results'}
                        </span>
                      </div>

                      {/* Sorting & Filter controls */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <ArrowUpDown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                          <span>{lang === 'ar' ? 'الترتيب:' : 'Sort:'}</span>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                          >
                            <option value="popular">{lang === 'ar' ? 'الأكثر شهرة' : 'Most Popular'}</option>
                            <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest'}</option>
                            <option value="name-asc">{lang === 'ar' ? 'الاسم A-Z' : 'Name A-Z'}</option>
                            <option value="name-ar">{lang === 'ar' ? 'الاسم عربي' : 'Arabic Name'}</option>
                            <option value="free-first">{lang === 'ar' ? 'مجاني أولاً' : 'Free First'}</option>
                          </select>
                        </div>

                        {/* Reset Filters */}
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setActiveCategory('all');
                            setActivePricing('all');
                            setSortBy('popular');
                            setFeaturedOnly(false);
                            setNewOnly(false);
                          }}
                          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors ps-2"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Skeletons or Tools List */}
                    {isFiltering ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <SkeletonCard key={i} />
                        ))}
                      </div>
                    ) : filteredTools.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTools.map((tool, idx) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            lang={lang}
                            onSelectTool={handleSelectTool}
                            index={idx}
                          />
                        ))}
                      </div>
                    ) : (
                      /* No Results State */
                      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-10 text-center max-w-xl mx-auto my-8">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                          <Search className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                          {lang === 'ar'
                            ? 'لم نتمكن من العثور على أي نتائج مطابقة'
                            : 'No matching tools found'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5">
                          {lang === 'ar'
                            ? 'جرّب البحث بكلمة مفتاحية عامة مثل "تصميم"، "ذكاء"، "برمجة"، أو تصفح أحد التصنيفات الرئيسية.'
                            : 'Try searching with generic terms like "design", "AI", "code", or browse our categories.'}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2">
                          {allCategories.slice(0, 4).map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setSearchQuery('');
                                handleSelectCategoryPage(cat);
                              }}
                              className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-amber-500/40 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white text-xs font-semibold transition-colors"
                            >
                              {lang === 'ar' ? cat.nameAr : cat.nameEn}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                ) : (
                  /* 2. Structured Homepage with Curated Sections */
                  <>
                    {/* Section: Trending Tools */}
                    <section id="trending-tools" className="pt-2">
                      <SectionHeader
                        title={lang === 'ar' ? 'الأدوات الشائعة' : 'Trending Tools'}
                        subtitle={
                          lang === 'ar'
                            ? 'الأدوات والمنصات الأكثر استخداماً وتأثيراً في العالم الرقمي'
                            : 'The most popular and impactful tools across the digital landscape'
                        }
                        icon={Flame}
                        lang={lang}
                        onViewAll={() => handleCategoryTabSelect('all')}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trendingTools.map((tool, idx) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            lang={lang}
                            onSelectTool={handleSelectTool}
                            index={idx}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Section: Latest Tools */}
                    <section id="new-tools">
                      <SectionHeader
                        title={lang === 'ar' ? 'أحدث الأدوات' : 'Latest Tools'}
                        subtitle={
                          lang === 'ar'
                            ? 'أدوات حديثة أحدثت ثورة جديدة في الذكاء الاصطناعي والتطوير'
                            : 'Newly introduced tools transforming AI workflows and app development'
                        }
                        icon={Sparkles}
                        lang={lang}
                        onViewAll={() => handleCategoryTabSelect('all')}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newTools.map((tool, idx) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            lang={lang}
                            onSelectTool={handleSelectTool}
                            index={idx}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Section: AI & Chat */}
                    <section id="ai-chat-section">
                      <SectionHeader
                        title={lang === 'ar' ? 'أدوات الذكاء الاصطناعي والمحادثة' : 'AI & Chat Tools'}
                        subtitle={allCategories.find((c) => c.id === 'ai-chat')?.[lang === 'ar' ? 'descriptionAr' : 'descriptionEn']}
                        icon={Bot}
                        lang={lang}
                        onViewAll={() => {
                          const cat = toolRepository.getCategoryById('ai-chat');
                          if (cat) handleSelectCategoryPage(cat);
                        }}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {toolRepository.getToolsByCategory('ai-chat').slice(0, 6).map((tool, idx) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            lang={lang}
                            onSelectTool={handleSelectTool}
                            index={idx}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Section: Image Generation */}
                    <section id="image-gen-section">
                      <SectionHeader
                        title={lang === 'ar' ? 'الصور والتصميم' : 'Images & Design'}
                        subtitle={allCategories.find((c) => c.id === 'images-design')?.[lang === 'ar' ? 'descriptionAr' : 'descriptionEn']}
                        icon={Image}
                        lang={lang}
                        onViewAll={() => {
                          const cat = toolRepository.getCategoryById('images-design');
                          if (cat) handleSelectCategoryPage(cat);
                        }}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {toolRepository.getToolsByCategory('images-design').slice(0, 6).map((tool, idx) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            lang={lang}
                            onSelectTool={handleSelectTool}
                            index={idx}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Section: Code & Dev */}
                    <section id="coding-section">
                      <SectionHeader
                        title={lang === 'ar' ? 'البرمجة والمطورين' : 'Programming & Developers'}
                        subtitle={allCategories.find((c) => c.id === 'programming')?.[lang === 'ar' ? 'descriptionAr' : 'descriptionEn']}
                        icon={Code2}
                        lang={lang}
                        onViewAll={() => {
                          const cat = toolRepository.getCategoryById('programming');
                          if (cat) handleSelectCategoryPage(cat);
                        }}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {toolRepository.getToolsByCategory('programming').slice(0, 6).map((tool, idx) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            lang={lang}
                            onSelectTool={handleSelectTool}
                            index={idx}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Section: Free Tools */}
                    <section id="free-tools">
                      <SectionHeader
                        title={lang === 'ar' ? 'أدوات مجانية بالكامل' : '100% Free Tools'}
                        subtitle={
                          lang === 'ar'
                            ? 'أدوات مفتوحة المصدر ومجانية بدون اشتراكات مدفوعة'
                            : 'Completely free and open-source software ready for instant use'
                        }
                        icon={Gift}
                        lang={lang}
                        onViewAll={() => {
                          setActivePricing('Free');
                        }}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freeTools.map((tool, idx) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            lang={lang}
                            onSelectTool={handleSelectTool}
                            index={idx}
                          />
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer
        lang={lang}
        onSelectCategory={handleCategoryTabSelect}
        onSelectCategoryPage={handleSelectCategoryPage}
        onNavigateStaticPage={handleNavigateStaticPage}
      />
    </div>
  );
}
