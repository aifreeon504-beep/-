import React from 'react';
import { ExternalLink, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Tool, Language } from '../types';
import { ToolIcon } from './ToolIcon';
import { toolRepository } from '../repository/toolRepository';
import { motion } from 'motion/react';

interface ToolCardProps {
  tool: Tool;
  lang: Language;
  onSelectTool: (tool: Tool) => void;
  index?: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  lang,
  onSelectTool,
  index = 0
}) => {
  const isAr = lang === 'ar';
  const categoryMeta = toolRepository.getCategoryById(tool.category);

  const getPricingBadge = () => {
    switch (tool.pricing) {
      case 'Free':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            {isAr ? 'مجاني' : 'Free'}
          </span>
        );
      case 'Freemium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            Freemium
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            {isAr ? 'مدفوع' : 'Paid'}
          </span>
        );
    }
  };

  const displayName = isAr && tool.nameAr ? `${tool.name} (${tool.nameAr})` : tool.name;
  const displayDesc = isAr ? tool.descriptionAr : tool.descriptionEn;
  const categoryName = categoryMeta ? (isAr ? categoryMeta.nameAr : categoryMeta.nameEn) : tool.category;

  const handleUseTool = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(tool.officialUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3), ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelectTool(tool)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/60 p-5 backdrop-blur-sm transition-all duration-200 hover:border-amber-500/50 hover:bg-white dark:hover:bg-slate-900/90 shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer text-start"
    >
      {/* Top row: Icon + Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <ToolIcon iconName={tool.icon} brandColor={tool.brandColor} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                  {displayName}
                </h3>
                {tool.isNew && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-black">
                    <Sparkles className="w-2.5 h-2.5" />
                    {isAr ? 'جديد' : 'NEW'}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {categoryName}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            {getPricingBadge()}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4">
          {displayDesc}
        </p>

        {/* Keywords tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tool.keywords.slice(0, 3).map((kw, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50"
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelectTool(tool)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <span>{isAr ? 'التفاصيل' : 'Details'}</span>
          {isAr ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>

        {/* "استخدام الأداة" button - opens official URL in new tab */}
        <button
          type="button"
          onClick={handleUseTool}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 active:scale-95 text-black transition-all duration-200 shadow-sm shadow-amber-500/20"
          title={isAr ? `فتح الموقع الرسمي لـ ${tool.name}` : `Open official website of ${tool.name}`}
        >
          <span>{isAr ? 'استخدام الأداة' : 'Use Tool'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
