import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Send,
  CheckCircle2,
  FileText,
  Lock,
  Compass,
  ExternalLink,
  MessageSquarePlus,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { motion } from 'motion/react';

export type StaticPageType = 'about' | 'contact' | 'privacy' | 'terms';

interface StaticPagesProps {
  page: StaticPageType;
  lang: Language;
  onNavigateHome: () => void;
  onNavigatePage: (page: StaticPageType) => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({
  page,
  lang,
  onNavigateHome,
  onNavigatePage
}) => {
  const isAr = lang === 'ar';

  // Contact Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  const renderBreadcrumb = (title: string) => (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8"
    >
      <button
        onClick={onNavigateHome}
        className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
      >
        {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
        <span>{isAr ? 'الرئيسية' : 'Home'}</span>
      </button>
      <span>/</span>
      <span className="text-amber-400 font-bold">{title}</span>
    </nav>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* 1. ABOUT PAGE */}
      {page === 'about' && (
        <div>
          {renderBreadcrumb(isAr ? 'عن الموقع' : 'About Us')}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10 backdrop-blur-xl mb-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {isAr ? 'عن منصة TOOLVERSE' : 'About TOOLVERSE'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {isAr ? 'دليل الأدوات والمواقع الرقمية والذكاء الاصطناعي' : 'Curated Directory of Digital & AI Tools'}
                </p>
              </div>
            </div>

            <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                {isAr
                  ? 'تم إطلاق TOOLVERSE ليكون دليلاً عربياً وعالمياً حديثاً وسريعاً يهدف إلى تسهيل اكتشاف الأدوات الرقمية وحلول الذكاء الاصطناعي الأكثر تأثيراً وكفاءة في العالم.'
                  : 'TOOLVERSE was crafted to be a modern, lightning-fast public directory helping creators, developers, designers, and professionals explore the most impactful AI solutions and digital tools worldwide.'}
              </p>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isAr ? 'مبدأ عمل المنصة الأساسي' : 'Core Operational Philosophy'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200">
                  {isAr
                    ? 'الموقع عبارة عن دليل توثيقي واستكشافي فقط. نحن لا نشغل الأدوات أو النماذج داخلياً، ولا نطلب منك إنشاء حساب لدينا. عند العثور على أي أداة تناسبك، نوجهك مباشرة إلى موقعها الرسمي المعتمد لتجربتها واستخدامها بكل أمان.'
                    : 'TOOLVERSE acts purely as an indexing and discovery directory. We do not execute tools internally, and we never ask for account registrations. When you discover an instrument you like, we direct you safely to its verified official homepage.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                    <span className="text-sm font-bold text-white">{isAr ? 'دليل موثق' : 'Verified'}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {isAr ? 'أدوات رقمية معتمدة' : 'Official Digital Tools'}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40">
                  <div className="text-2xl font-black text-amber-400 mb-1">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {isAr ? 'تصنيفات تخصصية شاملة' : 'Curated Categories'}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40">
                  <div className="text-2xl font-black text-emerald-400 mb-1">100%</div>
                  <div className="text-xs text-slate-400 font-medium">
                    {isAr ? 'روابط رسمية ومباشرة' : 'Official Direct Links'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT PAGE */}
      {page === 'contact' && (
        <div>
          {renderBreadcrumb(isAr ? 'تواصل معنا' : 'Contact Us')}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
            {/* Info Side */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">
                      {isAr ? 'يسعدنا تواصلكم' : 'Get in Touch'}
                    </h1>
                    <span className="text-xs text-slate-400">
                      {isAr ? 'اقتراحات، ملاحظات، أو إضافة أداة' : 'Suggestions, feedback, or tool submissions'}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {isAr
                    ? 'هل تملك أداة رقمية جديدة تود إدراجها في TOOLVERSE؟ أو لديك ملاحظة لتحسين الدليل؟ يسعدنا تلقي رسالتك وسنرد في أقرب وقت.'
                    : 'Do you have a digital or AI tool you would like featured on TOOLVERSE? Or do you have feedback to improve the directory? We would love to hear from you.'}
                </p>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span className="font-mono">contact@toolverse.directory</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? 'الرد خلال 24-48 ساعة' : 'Response within 24-48 hours'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="md:col-span-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl">
                {formSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {isAr ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
                      {isAr
                        ? 'شكراً لتواصلك مع فريق TOOLVERSE. سنقوم بمراجعة رسالتك والتواصل معك قريباً.'
                        : 'Thank you for reaching out to TOOLVERSE. We will review your message and reply promptly.'}
                    </p>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                    >
                      {isAr ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={isAr ? 'أدخل اسمك الكريم' : 'Enter your name'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {isAr ? 'الموضوع' : 'Subject'}
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={isAr ? 'مثال: اقتراح إضافة أداة جديدة' : 'e.g., Suggest a new tool'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {isAr ? 'الرسالة *' : 'Message *'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={isAr ? 'اكتب رسالتك أو تفاصيل الأداة المقترحة...' : 'Write your message...'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY */}
      {page === 'privacy' && (
        <div>
          {renderBreadcrumb(isAr ? 'سياسة الخصوصية' : 'Privacy Policy')}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10 backdrop-blur-xl mb-10 shadow-2xl space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {isAr ? 'آخر تحديث: 2026' : 'Last updated: 2026'}
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? '1. التزامنا بخصوصية الزائر' : '1. Our Privacy Commitment'}
              </h2>
              <p>
                {isAr
                  ? 'في TOOLVERSE، نولي خصوصيتك أهمية قصوى. موقعنا متاح للجميع بشكل عام ومجاني ولا يتطلب تسجيل حساب، ولا يجمع أي معلومات شخصية حساسة مثل كلمات المرور أو أرقام البطاقات الائتمانية.'
                  : 'At TOOLVERSE, your privacy is paramount. Our directory is open and free to browse, requiring no personal account registrations, passwords, or financial payment details.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? '2. التخزين المحلي (Local Storage)' : '2. Local Storage Usage'}
              </h2>
              <p>
                {isAr
                  ? 'نستخدم ميزة التخزين المحلي في متصفحك (LocalStorage) فقط لحفظ تفضيلاتك الشخصية لواجهة الموقع مثل: اختيار اللغة (العربية/الإنجليزية) والسمة البصرية (الوضع الداكن/الفاتح).'
                  : 'We strictly utilize browser local storage to persist your UI display preferences (e.g., preferred language and light/dark theme selection).'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? '3. الروابط الخارجية للمواقع الرسمية' : '3. External Links Disclaimer'}
              </h2>
              <p>
                {isAr
                  ? 'يتضمن موقعنا روابط خارجية تنقلك إلى المواقع الرسمية للأدوات المدرجة. يرجى العلم بأن هذه المواقع الخارجية تخضع لسياسات الخصوصية وشروط الاستخدام الخاصة بها وليست تحت سيطرة TOOLVERSE.'
                  : 'Our directory links directly to verified official tool portals. Please note that once you navigate to an external website, their individual privacy statements and terms apply.'}
              </p>
            </section>
          </div>
        </div>
      )}

      {/* 4. TERMS OF USE */}
      {page === 'terms' && (
        <div>
          {renderBreadcrumb(isAr ? 'شروط الاستخدام' : 'Terms of Use')}

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10 backdrop-blur-xl mb-10 shadow-2xl space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {isAr ? 'شروط الاستخدام' : 'Terms of Service'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {isAr ? 'القواعد والإرشادات المنظمة لاستخدام الدليل' : 'Usage guidelines for the TOOLVERSE directory'}
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? '1. طبيعة الخدمة' : '1. Nature of the Service'}
              </h2>
              <p>
                {isAr
                  ? 'TOOLVERSE هو دليل رقمي توثيقي يهدف إلى تقديم مراجعات وشروحات وروابط لأفضل الأدوات والبرمجيات ونماذج الذكاء الاصطناعي. لا يقدم الموقع أي برامج ضارة أو تشغيل سري، ولا يدعي ملكية أي من الأدوات المدرجة.'
                  : 'TOOLVERSE is an informational indexing service intended to provide curated overviews, descriptions, and verified links to digital and AI products. We make no proprietary claims to listed third-party tools.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? '2. حقوق الملكية الفكرية والعلامات التجارية' : '2. Intellectual Property & Trademarks'}
              </h2>
              <p>
                {isAr
                  ? 'جميع أسماء الأدوات والشركات والشعارات المذكورة هي علامات تجارية مسجلة لملاكها الأصليين (مثل OpenAI, Anthropic, Google, Figma, Canva, إلخ). استخدام أسمائها هنا يتم لغرض التعريف والإشارة والتوثيق فقط.'
                  : 'All third-party brand names, trademarks, and associated logos remain the exclusive intellectual property of their respective owners (e.g., OpenAI, Google, Anthropic, Figma, Canva). They are used on TOOLVERSE purely for referential and indexing purposes.'}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">
                {isAr ? '3. إخلاء المسؤولية' : '3. Disclaimer of Warranties'}
              </h2>
              <p>
                {isAr
                  ? 'نحرص باستمرار على مراجعة دقة الروابط ومصداقية الأدوات ومخططات الأسعار، ومع ذلك، قد تتغير أسعار أو سياسات أي أداة من قِبل مطوريها الرسميين في أي وقت دون إشعار مسبق.'
                  : 'While we strive to keep all links and pricing indicators up-to-date and verified, providers may alter their pricing models or features at any time without prior notice.'}
              </p>
            </section>
          </div>
        </div>
      )}

      {/* Cross-navigation between static pages */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-800 text-xs">
        <button
          onClick={() => onNavigatePage('about')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            page === 'about'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isAr ? 'عن الموقع' : 'About'}
        </button>
        <button
          onClick={() => onNavigatePage('contact')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            page === 'contact'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isAr ? 'اتصل بنا' : 'Contact'}
        </button>
        <button
          onClick={() => onNavigatePage('privacy')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            page === 'privacy'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </button>
        <button
          onClick={() => onNavigatePage('terms')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            page === 'terms'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isAr ? 'شروط الاستخدام' : 'Terms of Service'}
        </button>
      </div>
    </motion.div>
  );
};
