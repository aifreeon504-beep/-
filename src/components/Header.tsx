import React, { useState } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Globe,
  Compass,
  Grid,
  X,
  LogIn,
  UserPlus,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Language, Theme, ToolCategory } from '../types';
import { toolRepository } from '../repository/toolRepository';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  lang: Language;
  theme: Theme;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onNavigateHome: () => void;
  onSelectCategory: (cat: ToolCategory | 'all') => void;
  onNavigateStaticPage?: (page: 'about' | 'contact' | 'privacy' | 'terms') => void;
  activeCategory: ToolCategory | 'all';
  isDetailsOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  onNavigateHome,
  onSelectCategory,
  onNavigateStaticPage,
  activeCategory,
  isDetailsOpen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register' | null>(null);

  const isAr = lang === 'ar';
  const categories = toolRepository.getCategories();

  const handleStaticNavigate = (page: 'about' | 'contact' | 'privacy' | 'terms') => {
    if (onNavigateStaticPage) {
      onNavigateStaticPage(page);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-200 border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-[#07090e]/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={onNavigateHome}
              className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/35 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-black transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-amber-600 dark:from-white dark:via-slate-200 dark:to-amber-400 bg-clip-text text-transparent">
                  TOOLVERSE
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400/80 font-medium tracking-wider uppercase">
                  {isAr ? 'دليل الأدوات الرقمية' : 'Digital Tools Directory'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              id="nav-home-btn"
              onClick={onNavigateHome}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                !isDetailsOpen && activeCategory === 'all'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>

            <button
              id="nav-explore-btn"
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                !isDetailsOpen && activeCategory !== 'all'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {isAr ? 'جميع الأدوات' : 'All Tools'}
            </button>

            <button
              id="nav-about-btn"
              onClick={() => handleStaticNavigate('about')}
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200"
            >
              {isAr ? 'عن الموقع' : 'About'}
            </button>

            <button
              id="nav-contact-btn"
              onClick={() => handleStaticNavigate('contact')}
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200"
            >
              {isAr ? 'اتصل بنا' : 'Contact'}
            </button>
          </nav>

          {/* Right Actions: Auth Buttons + Toggles */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Auth Buttons: "تسجيل الدخول" & "التسجيل" */}
            <div className="hidden sm:flex items-center gap-1.5 me-1">
              <button
                id="header-login-btn"
                onClick={() => setAuthModalType('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{isAr ? 'تسجيل الدخول' : 'Log In'}</span>
              </button>

              <button
                id="header-register-btn"
                onClick={() => setAuthModalType('register')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all duration-200 shadow-sm shadow-amber-500/20 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5 text-black" />
                <span>{isAr ? 'التسجيل' : 'Register'}</span>
              </button>
            </div>

            {/* Language Toggle */}
            <motion.button
              id="lang-toggle-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-xs"
              title={isAr ? 'تبديل للإنجليزية' : 'Switch to Arabic'}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              id="theme-toggle-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all duration-200 shadow-xs"
              title={theme === 'dark' ? (isAr ? 'الوضع النهاري' : 'Light Mode') : (isAr ? 'الوضع الليلي' : 'Dark Mode')}
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </motion.button>

            {/* Mobile Menu Toggle Button */}
            <motion.button
              id="mobile-menu-btn"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d14] px-4 py-4 space-y-4"
          >
            {/* Mobile Auth Buttons */}
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setAuthModalType('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{isAr ? 'تسجيل الدخول' : 'Log In'}</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalType('register');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-black" />
                <span>{isAr ? 'التسجيل' : 'Register'}</span>
              </button>
            </div>

            {/* Quick Static Links */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-semibold bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-200"
              >
                {isAr ? 'الرئيسية' : 'Home'}
              </button>
              <button
                onClick={() => handleStaticNavigate('about')}
                className="flex-1 py-2 text-center text-xs font-semibold bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-200"
              >
                {isAr ? 'عن الموقع' : 'About'}
              </button>
              <button
                onClick={() => handleStaticNavigate('contact')}
                className="flex-1 py-2 text-center text-xs font-semibold bg-slate-100 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-200"
              >
                {isAr ? 'اتصل بنا' : 'Contact'}
              </button>
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              {isAr ? 'تصفح حسب التصنيف' : 'Browse Categories'}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/40 hover:bg-amber-500/10 text-slate-800 dark:text-slate-200 text-start"
              >
                <Compass className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>{isAr ? 'جميع الأدوات' : 'All Tools'}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-start transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{isAr ? cat.nameAr : cat.nameEn}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Auth UI Notice Dialog (Clean UI only, no database or backend) */}
      <AnimatePresence>
        {authModalType && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setAuthModalType(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl text-center"
            >
              <button
                onClick={() => setAuthModalType(null)}
                className="absolute top-4 end-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                {authModalType === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {authModalType === 'login'
                  ? isAr
                    ? 'تسجيل الدخول إلى TOOLVERSE'
                    : 'Log in to TOOLVERSE'
                  : isAr
                  ? 'إنشاء حساب جديد في TOOLVERSE'
                  : 'Register a New Account'}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                {isAr
                  ? 'ميزة الحسابات والمفضلة المخصصة قيد التطوير وستتوفر قريباً! يمكنك حالياً تصفح الدليل واستكشاف جميع الأدوات وروابطها الرسمية مجاناً ومباشرة وبدون الحاجة لأي تسجيل.'
                  : 'Personal accounts and customized bookmarks are coming soon! You can currently explore all curated tools and official direct links freely without any registration.'}
              </p>

              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-6">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {isAr
                    ? 'جميع الأدوات مفتوحة ومتاحة للجميع مجاناً'
                    : 'All tools are publicly accessible for free'}
                </span>
              </div>

              <button
                onClick={() => setAuthModalType(null)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors shadow-sm"
              >
                {isAr ? 'حسناً، متابعة التصفح' : 'Continue Browsing'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
