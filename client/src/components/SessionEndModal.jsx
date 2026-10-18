import React from 'react';
import { LogOut, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export default function SessionEndModal({
  isOpen,
  onClose,
  onReLogin,
  reason = 'manual' // 'manual' or 'expired'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 p-6 text-center space-y-4 my-auto">
        
        {/* Animated Icon */}
        <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-200">
          <LogOut className="w-7 h-7 text-sky-600" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            Security & Session Notice
          </span>
          <h3 className="text-xl font-black text-slate-900">
            {reason === 'expired' ? 'Session Expired' : 'Session Ended Securely'}
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {reason === 'expired'
              ? 'Your active session has expired due to timeout. Please sign in again to access your shortlisted colleges and applications.'
              : 'You have been signed out. All local tokens and session credentials have been cleared.'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Device cache sanitized • Safe to close tab</span>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={onReLogin}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Sign In Again</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            Continue Browsing as Guest
          </button>
        </div>

      </div>
    </div>
  );
}
