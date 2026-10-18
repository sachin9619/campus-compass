import React from 'react';
import { MapPin, Phone, Mail, Award, CheckCircle, Star, Scale, Bookmark, ArrowUpRight, GraduationCap } from 'lucide-react';

export default function CollegeCard({
  college,
  onSelectCollege,
  isComparing,
  onToggleCompare,
  onToggleBookmark,
  onOpenCounseling
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      
      {/* Top Banner & Header */}
      <div className="relative h-36 sm:h-44 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={college.banner_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent" />
        
        {/* Badges on banner */}
        <div className="absolute top-2.5 left-2.5 right-12 flex flex-wrap gap-1">
          {college.nirf_rank_2024 && (
            <span className="bg-amber-500 text-white font-extrabold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs flex items-center">
              NIRF #{college.nirf_rank_2024}
            </span>
          )}
          <span className="bg-sky-600 text-white font-bold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
            NAAC {college.naac_grade}
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-slate-200 font-semibold text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs hidden xs:inline-block">
            {college.institution_type}
          </span>
        </div>

        {/* Shortlist bookmark action */}
        <button
          onClick={() => onToggleBookmark(college)}
          title="Save to shortlist"
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition cursor-pointer z-10 ${
            college.is_bookmarked
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 text-slate-700 hover:bg-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${college.is_bookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Stream badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs ${
            college.category === 'IT'
              ? 'bg-blue-600 text-white'
              : college.category === 'Management'
              ? 'bg-emerald-600 text-white'
              : 'bg-purple-600 text-white'
          }`}>
            {college.category === 'Both' ? 'IT & Management' : `${college.category} Focus`}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Title & Location */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                onClick={() => onSelectCollege(college.slug)}
                className="font-bold text-sm sm:text-base lg:text-lg text-slate-900 hover:text-sky-600 cursor-pointer transition line-clamp-1"
                title={college.name}
              >
                {college.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 flex items-center mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                <span className="truncate">{college.city}, {college.state}</span>
              </p>
            </div>
            
            {/* Rating badge */}
            <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-1.5 sm:px-2 py-0.5 rounded-lg shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-[11px] sm:text-xs font-bold text-amber-800">{college.rating}</span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3 p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[9px] sm:text-[10px] font-semibold uppercase">Avg Package</span>
              <span className="text-emerald-700 font-extrabold text-xs sm:text-base">
                ₹{college.avg_package_lpa} <span className="text-[10px] sm:text-xs font-semibold">LPA</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] sm:text-[10px] font-semibold uppercase">Annual Fees</span>
              <span className="text-slate-800 font-extrabold text-xs sm:text-base">
                ₹{(college.min_annual_fee / 100000).toFixed(1)}L - ₹{(college.max_annual_fee / 100000).toFixed(1)}L
              </span>
            </div>
          </div>

          {/* Course Sample Tags */}
          <div className="mt-2.5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-1 flex items-center truncate">
              <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-sky-500 shrink-0" />
              <span className="truncate">{college.total_courses_count || 'Multiple'} Verified Courses:</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {(college.top_courses_sample || 'B.Tech | MBA').split(' | ').slice(0, 2).map((c, i) => (
                <span key={i} className="text-[10px] sm:text-[11px] bg-slate-100 text-slate-700 px-1.5 sm:px-2 py-0.5 rounded-md font-medium truncate max-w-[140px] sm:max-w-[180px]">
                  {c}
                </span>
              ))}
              <span className="text-[10px] sm:text-[11px] bg-sky-50 text-sky-700 px-1 sm:px-1.5 py-0.5 rounded-md font-semibold shrink-0">
                +{college.total_courses_count > 2 ? college.total_courses_count - 2 : 1}
              </span>
            </div>
          </div>

          {/* Verified Official Contact Strip */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] sm:text-[11px] text-slate-600 space-y-0.5">
            <div className="flex items-center space-x-1.5 truncate">
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-700">Helpline:</span>
              <span className="truncate">{college.contact_number}</span>
            </div>
            <div className="flex items-center space-x-1.5 truncate">
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600 shrink-0" />
              <span className="font-semibold text-slate-700">Admissions:</span>
              <span className="truncate">{college.email}</span>
            </div>
          </div>

        </div>

        {/* Card Footer Actions */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
          
          {/* Compare Checkbox */}
          <button
            onClick={() => onToggleCompare(college)}
            className={`text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-lg border transition-all flex items-center space-x-1 cursor-pointer shrink-0 ${
              isComparing
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Scale className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isComparing ? 'Comparing' : 'Compare'}</span>
          </button>

          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <button
              onClick={() => onOpenCounseling(college)}
              className="text-[11px] sm:text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2 sm:px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              Inquire
            </button>

            <button
              onClick={() => onSelectCollege(college.slug)}
              className="text-[11px] sm:text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 px-2.5 sm:px-3 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <span>View</span>
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
