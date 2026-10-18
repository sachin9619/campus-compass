import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, ExternalLink, GraduationCap } from 'lucide-react';

export default function Footer({ onOpenCounseling, onOpenAuth, onOpenContact }) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand & Problem Statement context */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Campus<span className="text-sky-400">Compass</span> India
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Developed as part of the <span className="text-white font-semibold">Global Professional Internship (GPI)</span> by <span className="text-sky-400 font-semibold">Cloud Counselage</span> & CC-GAC Foundation. Built to eradicate unsolicited advertisement spam, providing students with verified direct helplines, accurate fee breakdowns, and unbiased IT & Management college discovery.
            </p>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 mr-1" /> 100% Ad-Free
              </span>
              <span>•</span>
              <span className="flex items-center text-sky-400 font-semibold">
                <GraduationCap className="w-4 h-4 mr-1" /> NIRF & NAAC Verified
              </span>
            </div>
          </div>

          {/* Col 2: Academic Streams */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-3">
              Academic Tracks
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition">B.Tech in Computer Science & AI</li>
              <li className="hover:text-white transition">Master of Computer Applications (MCA)</li>
              <li className="hover:text-white transition">MBA / PGDM in Tech Management</li>
              <li className="hover:text-white transition">BCA & BBA Business Analytics</li>
              <li className="hover:text-white transition">Executive Leadership & Data Science</li>
            </ul>
          </div>

          {/* Col 3: Student Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-3">
              Student Guidance
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenCounseling} className="hover:text-emerald-400 text-left transition cursor-pointer">
                  Book 1-on-1 Free Counseling
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-sky-400 text-left transition cursor-pointer">
                  Direct Helplines & Contact Desk
                </button>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-white text-left transition cursor-pointer">
                  Student Portal & Shortlist
                </button>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-white text-left transition cursor-pointer">
                  Administrator & Mentor Access
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2025 CampusCompass India • Built for Cloud Counselage GPI Live Project Workflow</p>
          <p className="flex items-center">
            Empowering students with transparent education metrics.
          </p>
        </div>

      </div>
    </footer>
  );
}
