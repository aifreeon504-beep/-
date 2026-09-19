import React from 'react';
import {
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Globe,
  Share2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Tool, Language, Category } from '../types';
import { ToolIcon } from './ToolIcon';
import { ToolCard } from './ToolCard';
import { toolRepository } from '../repository/toolRepository';
import { updatePageSeo, buildToolJsonLd } from '../utils/seo';
import { motion } from 'motion/react';

interface ToolDetailsViewProps {
  tool: Tool;
  lang: Language;
  onBack: () => void;
  onSelectCategory: (cat: Category) => void;
  onSelectTool: (tool: Tool) => void;
}

export const ToolDetailsView: React.FC<ToolDetailsViewProps> = ({
  tool,
  lang,
  onBack,
  onSelectCategory,
  onSelectTool
}) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = React.useState(false);

  // Retrieve similar tools via data layer repository
  const similarTools = React.useMemo(() => {
    return toolRepository.getSimilarTools(tool.id, 3);
  }, [tool.id]);

  const categoryMeta = toolRepository.getCategoryById(tool.category);

  // SEO metadata generated from repository
  const seoData = React.useMemo(() => {
    return toolRepository.getToolSeo(tool, lang);
  }, [tool, lang]);

  // Update document SEO meta and JSON-LD structured data
  React.useEffect(() => {
    updatePageSeo({
      title: seoData.title,
      description: seoData.metaDescription,
      canonicalUrl: `${window.location.origin}/tool/${tool.slug}`,
      type: 'article',
      jsonLd: buildToolJsonLd(tool, lang)
    });
  }, [tool, lang, seoData]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: seoData.title,
          text: isAr ? tool.descriptionAr : tool.descriptionEn,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPricingBadge = () => {
    switch (tool.pricing) {
      case 'Free':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            {isAr ? 'مجاني بالكامل' : '100% Free'}
          </span>
        );
      case 'Freemium':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            {isAr ? 'Freemium (خطة مجانية + مدفوعة)' : 'Freemium (Free & Pro plans)'}
          </span>
        );
      case 'Paid':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            {isAr ? 'مدفوع / اشتراك' : 'Paid / Subscription'}
          </span>
        );
    }
  };

  const displayName = isAr && tool.nameAr ? `${tool.name} (${tool.nameAr})` : tool.name;
  const displayDesc = isAr ? tool.descriptionAr : tool.descriptionEn;
  const displayLongDesc = isAr ? tool.longDescriptionAr : tool.longDescriptionEn;
  const categoryName = categoryMeta ? (isAr ? categoryMeta.nameAr : categoryMeta.nameEn) : tool.category;
  const featuresList = isAr ? tool.features.ar : tool.features.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-start"
    >
      {/* Breadcrumbs Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap"
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
        {categoryMeta ? (
          <button
            onClick={() => onSelectCategory(categoryMeta)}
            className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
          >
            {categoryName}
          </button>
        ) : (
          <span>{tool.category}</span>
        )}
        {isAr ? (
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        )}
        <span className="text-amber-600 dark:text-amber-400 font-bold">{tool.name}</span>
      </nav>

      {/* Main Hero Header Card */}
      <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-lg dark:shadow-2xl mb-10 overflow-hidden">
        {/* Ambient background glow */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: tool.brandColor || '#F59E0B' }}
        />

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 relative z-10">
          {/* Logo & Basic Info */}
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="shrink-0 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-inner">
              <ToolIcon iconName={tool.icon} brandColor={tool.brandColor} className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {displayName}
                </h1>
                {tool.isNew && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-black">
                    <Sparkles className="w-3 h-3" />
                    {isAr ? 'جديد' : 'NEW'}
                  </span>
                )}
                {getPricingBadge()}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                {categoryMeta && (
                  <button
                    onClick={() => onSelectCategory(categoryMeta)}
                    className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
                  >
                    {categoryName}
                  </button>
                )}
                {tool.subcategory && (
                  <>
                    <span>•</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700/50">
                      {tool.subcategory}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {new URL(tool.officialUrl).hostname}
                </span>
              </div>

              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
                {displayDesc}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {/* Direct External Launch Button */}
            <motion.a
              href={tool.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm sm:text-base transition-all duration-200 shadow-xl shadow-amber-500/25"
            >
              <span>{isAr ? 'استخدام الأداة' : 'Use Tool'}</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>

            {/* Share / Copy link */}
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>
                {copied
                  ? isAr
                    ? 'تم نسخ الرابط!'
                    : 'Link Copied!'
                  : isAr
                  ? 'مشاركة الرابط'
                  : 'Share Tool'}
              </span>
            </button>
          </div>
        </div>

        {/* Notice badge confirming external official link */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>
            {isAr
              ? `رابط مباشر وموثق للموقع الرسمي (${tool.officialUrl}). يتم فتح الأداة في تبويب جديد خارجي بدون وسطاء.`
              : `Verified direct link to official platform (${tool.officialUrl}). Opens directly in a new external browser tab.`}
          </span>
        </div>
      </div>

      {/* Content Grid: Long Description + Key Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left 2 Cols: Long Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm shadow-sm dark:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block" />
              <span>{isAr ? `عن أداة ${tool.name}` : `About ${tool.name}`}</span>
            </h2>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 text-base">
              <p>{displayLongDesc}</p>
            </div>
          </div>

          {/* Keywords / Tags */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{isAr ? 'الكلمات المفتاحية والوسوم' : 'Keywords & Tags'}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {tool.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 text-xs font-medium"
                >
                  #{kw}
                </span>
              ))}
              {tool.tags.map((tg, i) => (
                <span
                  key={`tag-${i}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-medium"
                >
                  {tg}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Key Features Checklist & Direct Action */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 sm:p-7 backdrop-blur-sm shadow-sm dark:shadow-none">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{isAr ? 'أهم المميزات' : 'Key Features'}</span>
            </h2>

            <ul className="space-y-3.5">
              {featuresList.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <a
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold text-xs transition-colors shadow-sm"
              >
                <span>{isAr ? 'زيارة الموقع الرسمي' : 'Visit Official Website'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Tools Section */}
      {similarTools.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block" />
              <span>{isAr ? 'أدوات مشابهة في نفس التصنيف' : 'Similar Tools in this Category'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarTools.map((sTool, idx) => (
              <ToolCard
                key={sTool.id}
                tool={sTool}
                lang={lang}
                onSelectTool={onSelectTool}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
