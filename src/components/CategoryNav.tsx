import React from 'react';
import {
  Sparkles,
  Bot,
  Image,
  Video,
  Music,
  PenTool,
  Code2,
  Zap,
  TrendingUp,
  LayoutGrid,
  Filter
} from 'lucide-react';
import { Language, ToolCategory, PricingType } from '../types';
import { toolRepository } from '../repository/toolRepository';

interface CategoryNavProps {
  lang: Language;
  activeCategory: ToolCategory | 'all';
  onSelectCategory: (cat: ToolCategory | 'all') => void;
  activePricing: PricingType | 'all';
  onSelectPricing: (pricing: PricingType | 'all') => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Bot':
      return <Bot className="w-4 h-4" />;
    case 'Image':
      return <Image className="w-4 h-4" />;
    case 'Video':
      return <Video className="w-4 h-4" />;
    case 'Music':
      return <Music className="w-4 h-4" />;
    case 'PenTool':
      return <PenTool className="w-4 h-4" />;
    case 'Code2':
      return <Code2 className="w-4 h-4" />;
    case 'Zap':
      return <Zap className="w-4 h-4" />;
    case 'TrendingUp':
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  lang,
  activeCategory,
  onSelectCategory,
  activePricing,
  onSelectPricing
}) => {
  const categories = toolRepository.getCategories();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      {/* Category Tabs with horizontal scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
        {/* All Categories Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border ${
            activeCategory === 'all'
              ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 shadow-xs'
          } active:scale-95`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>{lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</span>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                isActive
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 shadow-xs'
              } active:scale-95`}
            >
              <span className={isActive ? 'text-black' : 'text-amber-500 dark:text-amber-400'}>
                {getCategoryIcon(cat.icon)}
              </span>
              <span>{lang === 'ar' ? cat.nameAr : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Pricing filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <Filter className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{lang === 'ar' ? 'تصفية حسب نوع السعر:' : 'Filter by pricing:'}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <button
            onClick={() => onSelectPricing('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activePricing === 'all'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {lang === 'ar' ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => onSelectPricing('Free')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activePricing === 'Free'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {lang === 'ar' ? 'مجاني 100%' : 'Free'}
          </button>
          <button
            onClick={() => onSelectPricing('Freemium')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activePricing === 'Freemium'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Freemium
          </button>
          <button
            onClick={() => onSelectPricing('Paid')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activePricing === 'Paid'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {lang === 'ar' ? 'مدفوع' : 'Paid'}
          </button>
        </div>
      </div>
    </div>
  );
};
