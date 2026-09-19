import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 p-5 animate-pulse flex flex-col justify-between h-[230px]">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-16 h-3 rounded bg-slate-200/60 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="w-14 h-5 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="w-full h-3 rounded bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="w-3/4 h-3 rounded bg-slate-200/70 dark:bg-slate-800/70" />
        </div>
        <div className="flex gap-2">
          <div className="w-12 h-4 rounded bg-slate-200/50 dark:bg-slate-800/50" />
          <div className="w-12 h-4 rounded bg-slate-200/50 dark:bg-slate-800/50" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
        <div className="w-12 h-4 rounded bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="w-20 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};
