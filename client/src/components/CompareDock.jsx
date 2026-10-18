import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';

export default function CompareDock({
  compareColleges,
  onRemoveCompare,
  onOpenCompare,
  onClearCompare
}) {
  if (!compareColleges || compareColleges.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-11/12 max-w-3xl bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left icon & count */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <span className="font-bold text-[11px] sm:text-sm block leading-tight">Compare ({compareColleges.length}/4)</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 hidden xs:inline">
              Selected institutions
            </span>
          </div>
        </div>

        {/* Selected College Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-[40%] sm:max-w-[45%]">
          {compareColleges.map((c) => (
            <div
              key={c.id}
              className="flex items-center space-x-1 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs shrink-0"
            >
              <span className="font-semibold max-w-[80px] sm:max-w-[120px] truncate">{c.short_name || c.name}</span>
              <button
                onClick={() => onRemoveCompare(c.id)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          <button
            onClick={onClearCompare}
            className="text-[11px] sm:text-xs text-slate-400 hover:text-white px-1.5 py-1 rounded transition hidden xs:inline-block"
          >
            Clear
          </button>

          <button
            onClick={onOpenCompare}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center space-x-1 transition shadow-xs shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer"
          >
            <span>{compareColleges.length >= 2 ? 'Compare Now' : 'Add & Compare'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
