import React from 'react';
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  lang: Language;
  onViewAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  lang,
  onViewAll
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors self-start sm:self-auto group"
        >
          <span>{lang === 'ar' ? 'عرض الكل' : 'View All'}</span>
          {lang === 'ar' ? (
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          ) : (
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      )}
    </div>
  );
};
