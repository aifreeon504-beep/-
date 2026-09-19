import React from 'react';
import { Sparkles, ShieldCheck, ArrowUp, Mail, FileText, Lock, Info } from 'lucide-react';
import { Language, ToolCategory, Category } from '../types';
import { toolRepository } from '../repository/toolRepository';

interface FooterProps {
  lang: Language;
  onSelectCategory: (catId: ToolCategory | 'all') => void;
  onSelectCategoryPage?: (cat: Category) => void;
  onNavigateStaticPage: (page: 'about' | 'contact' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onSelectCategory,
  onSelectCategoryPage,
  onNavigateStaticPage
}) => {
  const isAr = lang === 'ar';
  const categories = toolRepository.getCategories();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat: Category) => {
    if (onSelectCategoryPage) {
      onSelectCategoryPage(cat);
    } else {
      onSelectCategory(cat.id);
    }
    scrollToTop();
  };

  const handleStaticClick = (page: 'about' | 'contact' | 'privacy' | 'terms') => {
    onNavigateStaticPage(page);
    scrollToTop();
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#06080d] text-slate-400 text-sm mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 & 2: Brand Info & Scope Declaration */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold shadow-md shadow-amber-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                TOOLVERSE
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              {isAr
                ? 'دليل استكشافي عام ومجاني لأفضل الأدوات والمنصات الرقمية ونماذج الذكاء الاصطناعي مع روابط الاستخدام الرسمية والمباشرة دون وسطاء.'
                : 'A curated open directory to explore verified digital tools, AI platforms, and creative software with instant official direct links.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isAr
                  ? 'دليل موثق لأفضل الأدوات الرسمية'
                  : 'Curated directory of verified official tools'}
              </span>
            </div>
          </div>

          {/* Col 3: Categories 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isAr ? 'تصنيفات الذكاء الاصطناعي' : 'AI & Creative'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-amber-400 transition-colors text-right"
                  >
                    {isAr ? cat.nameAr : cat.nameEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Categories 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isAr ? 'البرمجة والإنتاجية' : 'Code & Productivity'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.slice(5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-amber-400 transition-colors text-right"
                  >
                    {isAr ? cat.nameAr : cat.nameEn}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    scrollToTop();
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors text-right"
                >
                  {isAr ? 'جميع الأدوات' : 'All Tools'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Essential Static Pages */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {isAr ? 'روابط الموقع' : 'Site Pages'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleStaticClick('about')}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <Info className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>{isAr ? 'عن الموقع' : 'About Us'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleStaticClick('contact')}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleStaticClick('privacy')}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleStaticClick('terms')}
                  className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>{isAr ? 'شروط الاستخدام' : 'Terms of Service'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {isAr
              ? '© TOOLVERSE. جميع الروابط تنقلك مباشرة إلى المواقع الرسمية للأدوات المعنية.'
              : '© TOOLVERSE. All links navigate directly to the verified official tool websites.'}
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:text-white hover:border-slate-700 transition-colors"
          >
            <span>{isAr ? 'العودة للأعلى' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
