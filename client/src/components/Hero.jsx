import React from 'react';
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Hero({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  onSearch,
  stats,
  onSelectCity
}) {
  const quickCities = ['All', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune', 'Hyderabad'];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden pt-8 pb-14 sm:pt-16 sm:pb-20">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Verified Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 mb-5 backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Cloud Counselage GPI • 100% Verified Academic Database</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-none">
          Discover India's Premier <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">IT & Management</span> Colleges
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 sm:mt-5 text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Accurate cutoffs, verified admission helplines, and transparent placement statistics without advertising bias.
        </p>

        {/* Floating White Search Card */}
        <div className="mt-7 sm:mt-9 max-w-2xl mx-auto bg-white rounded-3xl p-3 sm:p-4 text-slate-900 shadow-2xl border border-slate-100">
          
          {/* Segmented Stream Filter Tabs */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center justify-between gap-1 mb-3 no-scrollbar overflow-x-auto">
            {[
              { id: 'All', label: 'All Colleges' },
              { id: 'IT', label: 'IT & CS' },
              { id: 'Management', label: 'Management & MBA' },
              { id: 'Both', label: 'Dual Stream' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  category === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Unified Search Input & Action */}
          <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200/80 p-1.5 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent transition">
            <div className="pl-2.5 text-slate-400 shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search college, city (Mumbai, Pune), or degree (BCA, MBA)..."
              className="w-full px-2.5 py-2 text-slate-900 placeholder-slate-400 text-xs sm:text-sm bg-transparent focus:outline-none"
            />
            <button
              onClick={onSearch}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick city filter chips */}
          <div className="flex items-center flex-wrap justify-center gap-1 mt-2.5 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400 flex items-center mr-1">
              <MapPin className="w-3 h-3 mr-0.5 text-slate-400" /> Hubs:
            </span>
            {quickCities.map(city => (
              <button
                key={city}
                onClick={() => onSelectCity(city === 'All' ? '' : city)}
                className="px-2 py-0.5 rounded-md hover:bg-slate-100 transition cursor-pointer text-slate-600 font-medium"
              >
                {city}
              </button>
            ))}
          </div>

        </div>

        {/* Integrated Frosted Trust Bar */}
        {stats && (
          <div className="mt-8 sm:mt-11 max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-3 sm:p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              <div className="py-2 px-3 text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">{stats.totalColleges}+</span>
                <span className="text-[11px] text-slate-400 font-medium">Verified Colleges</span>
              </div>

              <div className="py-2 px-3 text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">{stats.totalCourses}+</span>
                <span className="text-[11px] text-slate-400 font-medium">IT & Mgmt Programs</span>
              </div>

              <div className="py-2 px-3 text-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">₹{stats.avgSalary || stats.avgPackageLpa || '12.5'} LPA</span>
                <span className="text-[11px] text-slate-400 font-medium">Average Placement CTC</span>
              </div>

              <div className="py-2 px-3 text-center">
                <span className="text-xl sm:text-2xl font-black text-sky-400 block">100%</span>
                <span className="text-[11px] text-slate-400 font-medium">Direct Helplines</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
