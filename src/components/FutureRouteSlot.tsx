import React from 'react';
import { ArrowLeft, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { PROJECT_ID, PROJECT_CONFIG, ReservedRouteType } from '../config/project';
import { Language } from '../types';

interface FutureRouteSlotProps {
  route: ReservedRouteType;
  lang: Language;
  onNavigateHome: () => void;
}

/**
 * FutureRouteSlot - Structural mounting slot for future modules (Admin / Agent).
 * Strictly preserves boundaries: no authentication, no mock forms, no unsolicited features.
 */
export const FutureRouteSlot: React.FC<FutureRouteSlotProps> = ({
  route,
  lang,
  onNavigateHome
}) => {
  const isAr = lang === 'ar';
  const moduleConfig = PROJECT_CONFIG.futureModules[route];
  const Icon = route === 'admin' ? ShieldAlert : Cpu;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center p-8 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Icon className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-400 tracking-wider">
            {PROJECT_ID} • {moduleConfig.path}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isAr ? moduleConfig.nameAr : moduleConfig.nameEn}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isAr
              ? 'هذا المسار محجوز هيكلياً في بنية المشروع للتجهيز المستقبلي.'
              : 'This route is reserved in the project architecture for future modular mounting.'}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm transition-colors"
          >
            {isAr ? (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
