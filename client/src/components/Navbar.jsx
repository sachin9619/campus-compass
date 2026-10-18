import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, GraduationCap, Scale, Bookmark, User, LogOut, 
  ShieldAlert, PhoneCall, ChevronDown, Settings, FileText, 
  Menu, X, Sparkles, Home 
} from 'lucide-react';

export default function Navbar({
  user,
  onOpenAuth,
  onEndSession,
  onOpenProfile,
  compareCount,
  onOpenCompare,
  onOpenCounseling,
  onOpenContact,
  activeTab,
  setActiveTab,
  bookmarkedCount
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TOP HEADER (CLEAN & NON-OVERLAPPING ON ALL SCREENS)   */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo & Brand */}
            <div 
              className="flex items-center space-x-2.5 cursor-pointer shrink-0" 
              onClick={() => setActiveTab('discover')}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
                    Campus<span className="text-sky-600">Compass</span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                    Ad-Free
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline leading-none">
                  Cloud Counselage GPI Project
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (>= md) */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('discover')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'discover'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Discover
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === 'courses'
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Courses
              </button>

              <button
                onClick={onOpenCompare}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                  compareCount > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Compare</span>
                {compareCount > 0 && (
                  <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full inline-flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </button>

              <button
                onClick={onOpenContact}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1 cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                <span>Helplines</span>
              </button>

              {user && (
                <>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                      activeTab === 'applications'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Applications</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                      activeTab === 'bookmarks'
                        ? 'bg-rose-50 text-rose-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5 text-rose-500" />
                    <span>Shortlist ({bookmarkedCount})</span>
                  </button>
                </>
              )}

              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              )}
            </nav>

            {/* Top Right Header Controls */}
            <div className="flex items-center space-x-2 shrink-0">
              {/* Counseling CTA (Available on sm screens and up, mobile has Hero & Bottom bar) */}
              <button
                onClick={onOpenCounseling}
                className="hidden sm:inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Free Counseling</span>
              </button>

              {/* Desktop User Avatar & Menu */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1.5 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer border border-slate-200"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-600 text-white font-extrabold text-[11px] sm:text-xs flex items-center justify-center shadow-xs">
                      {getInitials(user.full_name)}
                    </div>
                    <div className="hidden lg:flex flex-col text-left pr-1">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[100px]">{user.full_name}</span>
                      <span className="text-[10px] text-slate-400 capitalize leading-none">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Desktop Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <div className="py-1 text-xs">
                        <button
                          onClick={() => { setActiveTab('applications'); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition"
                        >
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>My Inquiries</span>
                        </button>
                        <button
                          onClick={() => { setActiveTab('bookmarks'); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition"
                        >
                          <Bookmark className="w-4 h-4 text-rose-500" />
                          <span>Shortlist ({bookmarkedCount})</span>
                        </button>
                        <button
                          onClick={() => { onOpenProfile(); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition"
                        >
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Account Settings</span>
                        </button>
                        {user.role === 'admin' && (
                          <button
                            onClick={() => { setActiveTab('admin'); setDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2 text-purple-700 hover:bg-purple-50 flex items-center space-x-2 transition font-semibold"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            <span>Admin Portal</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => { setDropdownOpen(false); onEndSession(); }}
                          className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center space-x-2 text-xs font-bold transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>End Session</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center space-x-1 bg-sky-600 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold hover:bg-sky-700 transition shadow-xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. THUMB-FRIENDLY BOTTOM NAVIGATION BAR FOR HANDHELD (MOBILE) */}
      {/* ========================================================= */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 flex items-center justify-around h-15">
        
        {/* Discover Tab */}
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'discover' ? 'text-sky-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Discover</span>
        </button>

        {/* Courses Tab */}
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'courses' ? 'text-sky-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className={`w-5 h-5 ${activeTab === 'courses' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Courses</span>
        </button>

        {/* Compare Tab */}
        <button
          onClick={onOpenCompare}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            compareCount > 0 ? 'text-amber-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Scale className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Compare</span>
          {compareCount > 0 && (
            <span className="absolute top-0.5 right-1.5 bg-amber-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {compareCount}
            </span>
          )}
        </button>

        {/* Shortlist Tab */}
        <button
          onClick={() => {
            if (!user) onOpenAuth();
            else setActiveTab('bookmarks');
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            activeTab === 'bookmarks' ? 'text-rose-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${activeTab === 'bookmarks' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Shortlist</span>
          {bookmarkedCount > 0 && (
            <span className="absolute top-0.5 right-1.5 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {bookmarkedCount}
            </span>
          )}
        </button>

        {/* User Account / Settings Tab */}
        <button
          onClick={() => {
            if (!user) onOpenAuth();
            else setMobileAccountOpen(true);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
            mobileAccountOpen || activeTab === 'applications' ? 'text-sky-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black flex items-center justify-center">
            {user ? getInitials(user.full_name) : <User className="w-3.5 h-3.5 text-slate-600" />}
          </div>
          <span className="text-[10px] mt-0.5">{user ? 'Account' : 'Sign In'}</span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE ACCOUNT BOTTOM SHEET (CLEAN & NON-OVERLAPPING)  */}
      {/* ========================================================= */}
      {mobileAccountOpen && user && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto p-5 space-y-4 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
            
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-extrabold text-sm flex items-center justify-center">
                  {getInitials(user.full_name)}
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block leading-tight">{user.full_name}</span>
                  <span className="text-[11px] text-slate-500">{user.email}</span>
                </div>
              </div>

              <button
                onClick={() => setMobileAccountOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Account Links */}
            <div className="space-y-1 text-sm font-semibold">
              <button
                onClick={() => {
                  setActiveTab('applications');
                  setMobileAccountOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl flex items-center space-x-3 hover:bg-slate-50 text-slate-800"
              >
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>My Counseling Requests</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('bookmarks');
                  setMobileAccountOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl flex items-center justify-between hover:bg-slate-50 text-slate-800"
              >
                <div className="flex items-center space-x-3">
                  <Bookmark className="w-5 h-5 text-rose-500" />
                  <span>Shortlisted Colleges</span>
                </div>
                <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  {bookmarkedCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileAccountOpen(false);
                  onOpenProfile();
                }}
                className="w-full text-left p-3 rounded-xl flex items-center space-x-3 hover:bg-slate-50 text-slate-800"
              >
                <Settings className="w-5 h-5 text-slate-500" />
                <span>Account & Password Settings</span>
              </button>

              <button
                onClick={() => {
                  setMobileAccountOpen(false);
                  onOpenContact();
                }}
                className="w-full text-left p-3 rounded-xl flex items-center space-x-3 hover:bg-slate-50 text-slate-800"
              >
                <PhoneCall className="w-5 h-5 text-sky-600" />
                <span>Admission Helplines & Support</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileAccountOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-xl flex items-center space-x-3 text-purple-700 bg-purple-50/70"
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span>Admin Control Center</span>
                </button>
              )}
            </div>

            {/* Logout */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileAccountOpen(false);
                  onEndSession();
                }}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>End Session / Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
