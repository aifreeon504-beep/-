import React from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { Language } from '../types';
import { motion } from 'motion/react';

interface HeroProps {
  lang: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTag: (tag: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  searchQuery,
  onSearchChange,
  onSelectTag
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const quickTags = [
    { label: 'ChatGPT', tag: 'ChatGPT' },
    { label: 'Claude', tag: 'Claude' },
    { label: 'Midjourney', tag: 'Midjourney' },
    { label: 'Cursor', tag: 'Cursor' },
    { label: 'Suno', tag: 'Suno' },
    { label: 'Notion', tag: 'Notion' },
    { label: 'Runway', tag: 'Runway' },
    { label: lang === 'ar' ? 'أدوات مجانية' : 'Free Tools', tag: 'free' }
  ];

  return (
    <section className="relative pt-10 pb-14 md:pt-16 md:pb-20 overflow-hidden">
      {/* Calm ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle pill badge - Replaced text per user requirement */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold mb-5 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>
            {lang === 'ar'
              ? 'اكتشف أفضل الأدوات الرقمية في مكان واحد'
              : 'Discover the best digital tools in one place'}
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-tight mb-4"
        >
          {lang === 'ar' ? (
            <>
              اكتشف أفضل الأدوات الرقمية <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                والذكاء الاصطناعي
              </span>{' '}
              في مكان واحد
            </>
          ) : (
            <>
              Discover the Best Digital &{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                AI Tools
              </span>{' '}
              in One Place
            </>
          )}
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal"
        >
          {lang === 'ar'
            ? 'ابحث، اكتشف، ثم انتقل مباشرة إلى الموقع الرسمي للأداة.'
            : 'Search, discover, and launch directly to the verified official tool website.'}
        </motion.p>

        {/* Search Box with Semantic Search Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
          className="relative max-w-2xl mx-auto"
        >
          <div
            className={`relative flex items-center rounded-2xl transition-all duration-200 ${
              isFocused
                ? 'ring-2 ring-amber-500/50 shadow-2xl shadow-amber-500/15 border-amber-500/60 bg-white dark:bg-slate-900/95'
                : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white/95 dark:bg-slate-900/80 shadow-md dark:shadow-lg'
            } border backdrop-blur-xl`}
          >
            <div className={`p-4 transition-transform duration-200 ${isFocused ? 'scale-110 text-amber-500 dark:text-amber-400' : 'text-slate-400'}`}>
              <Search className="w-5 h-5" />
            </div>

            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث باسم الأداة، أو اكتب ما تبحث عنه (مثال: أداة تسوي فيديو، إزالة الخلفية)...'
                  : 'Search by tool name, or describe what you need (e.g. video editor, remove bg)...'
              }
              className="w-full bg-transparent py-4 text-sm sm:text-base md:text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />

            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-3 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}

            <div className="p-2 sm:p-2.5">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-amber-500/20 whitespace-nowrap"
              >
                <span>{lang === 'ar' ? 'بحث' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Quick tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'ar' ? 'الأكثر بحثاً:' : 'Trending:'}
            </span>
            {quickTags.map((item) => (
              <button
                key={item.tag}
                onClick={() => onSelectTag(item.tag)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 hover:bg-amber-500/10 hover:border-amber-500/40 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 transition-all duration-150 active:scale-95 shadow-2xs"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
