import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  Bot,
  Image,
  Video,
  Music,
  PenTool,
  Code2,
  Zap,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Category, Tool, Language, PricingType, SortOption } from '../types';
import { ToolCard } from './ToolCard';
import { SkeletonCard } from './SkeletonCard';
import { toolRepository } from '../repository/toolRepository';
import { motion } from 'motion/react';

interface CategoryPageViewProps {
  category: Category;
  lang: Language;
  onBack: () => void;
  onSelectTool: (tool: Tool) => void;
  onSelectCategory: (cat: Category) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Bot':
      return <Bot className="w-6 h-6" />;
    case 'Image':
      return <Image className="w-6 h-6" />;
    case 'Video':
      return <Video className="w-6 h-6" />;
    case 'Music':
      return <Music className="w-6 h-6" />;
    case 'PenTool':
      return <PenTool className="w-6 h-6" />;
    case 'Code2':
      return <Code2 className="w-6 h-6" />;
    case 'Zap':
      return <Zap className="w-6 h-6" />;
    case 'TrendingUp':
      return <TrendingUp className="w-6 h-6" />;
    default:
      return <Sparkles className="w-6 h-6" />;
  }
};

export const CategoryPageView: React.FC<CategoryPageViewProps> = ({
  category,
  lang,
  onBack,
  onSelectTool,
  onSelectCategory
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [pricing, setPricing] = useState<PricingType | 'all'>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const categoryName = isAr ? category.nameAr : category.nameEn;
  const categoryDesc = isAr ? category.descriptionAr : category.descriptionEn;
  const allCategories = toolRepository.getCategories();

  // Query through the Repository data layer
  const filteredTools = useMemo(() => {
    return toolRepository.getTools({
      category: category.id,
      pricing: pricing === 'all' ? undefined : pricing,
      featured: featuredOnly ? true : undefined,
      isNew: newOnly ? true : undefined,
      searchQuery: searchQuery.trim() || undefined,
      sortBy
    });
  }, [category.id, pricing, featuredOnly, newOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setPricing('all');
    setFeaturedOnly(false);
    setNewOnly(false);
    setSortBy('popular');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8"
      >
        <button
          onClick={onBack}
          className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
        >
          {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>
        {isAr ? (
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        )}
        <span className="text-amber-600 dark:text-amber-400 font-bold">{categoryName}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-lg dark:shadow-2xl mb-8 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-15 bg-amber-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 shrink-0">
              {getCategoryIcon(category.icon)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {categoryName}
                </h1>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                  {isAr ? 'قسم موثق' : 'Verified Category'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {categoryDesc}
              </p>
            </div>
          </div>

          {/* Quick jump to other categories */}
          <div className="flex flex-wrap items-center gap-1.5 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
            {allCategories
              .filter((c) => c.id !== category.id)
              .slice(0, 4)
              .map((otherCat) => (
                <button
                  key={otherCat.id}
                  onClick={() => onSelectCategory(otherCat)}
                  className="px-3 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 hover:border-amber-500/40 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white transition-colors"
                >
                  {isAr ? otherCat.nameAr : otherCat.nameEn}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* In-Category Search, Filters, and Sorting Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4 sm:p-5 mb-8 backdrop-blur-sm space-y-4 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search within this category */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? `البحث داخل تصنيف ${categoryName}...`
                  : `Search within ${categoryName}...`
              }
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {isAr ? 'الترتيب:' : 'Sort by:'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-white text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="popular">{isAr ? 'الأكثر شهرة' : 'Most Popular'}</option>
              <option value="newest">{isAr ? 'الأحدث أولاً' : 'Newest First'}</option>
              <option value="name-asc">{isAr ? 'الاسم (A-Z)' : 'Name (A-Z)'}</option>
              <option value="name-ar">{isAr ? 'الاسم عربي أ-ي' : 'Name (Arabic)'}</option>
              <option value="free-first">{isAr ? 'مجاني أولاً' : 'Free First'}</option>
            </select>
          </div>
        </div>

        {/* Pricing & Attribute Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{isAr ? 'نوع السعر:' : 'Pricing:'}</span>
            </span>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <button
                onClick={() => setPricing('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  pricing === 'all'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setPricing('Free')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  pricing === 'Free'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? 'مجاني' : 'Free'}
              </button>
              <button
                onClick={() => setPricing('Freemium')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  pricing === 'Freemium'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Freemium
              </button>
              <button
                onClick={() => setPricing('Paid')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  pricing === 'Paid'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isAr ? 'مدفوع' : 'Paid'}
              </button>
            </div>

            {/* Checkbox pills for Featured and New */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                featuredOnly
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50'
                  : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ★ {isAr ? 'المميزة فقط' : 'Featured'}
            </button>

            <button
              onClick={() => setNewOnly(!newOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                newOnly
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50'
                  : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ✦ {isAr ? 'الجديدة فقط' : 'New Only'}
            </button>
          </div>

          {(searchQuery || pricing !== 'all' || featuredOnly || newOnly || sortBy !== 'popular') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, idx) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              lang={lang}
              onSelectTool={onSelectTool}
              index={idx}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-10 text-center max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {isAr
              ? `لا توجد أدوات مطابقة في تصنيف ${categoryName}`
              : `No matching tools in ${categoryName}`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
            {isAr
              ? 'جرّب تعديل معايير البحث أو تصفية السعر لعرض جميع أدوات هذا التصنيف.'
              : 'Try relaxing your filter or search query to see all tools in this category.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-sm"
          >
            {isAr ? 'عرض جميع أدوات التصنيف' : 'Show All Tools in Category'}
          </button>
        </div>
      )}
    </motion.div>
  );
};
