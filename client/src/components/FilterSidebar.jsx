import React from 'react';
import { Filter, RotateCcw, Building, MapPin, IndianRupee, Award, GraduationCap, X } from 'lucide-react';

export default function FilterSidebar({
  filterOptions,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  selectedDegree,
  setSelectedDegree,
  maxFee,
  setMaxFee,
  minPackage,
  setMinPackage,
  selectedNaac,
  setSelectedNaac,
  onResetFilters,
  onCloseMobile
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm sm:text-base">
          <Filter className="w-4 h-4 text-sky-600" />
          <span>Filters & Facets</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center space-x-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> State
        </label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity('');
          }}
          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">All States in India</option>
          {filterOptions?.states?.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> City
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">All Cities</option>
          {filterOptions?.cities?.map(ct => (
            <option key={ct} value={ct}>{ct}</option>
          ))}
        </select>
      </div>

      {/* Institution Type Filter */}
      <div>
        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center">
          <Building className="w-3.5 h-3.5 mr-1 text-slate-400" /> Institution Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">All Types (IIT, IIM, NIT, etc.)</option>
          {filterOptions?.types?.map(tp => (
            <option key={tp} value={tp}>{tp}</option>
          ))}
        </select>
      </div>

      {/* Degree Level */}
      <div>
        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center">
          <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-400" /> Degree Level
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
          {['All', 'Undergraduate', 'Postgraduate', 'Executive'].map(deg => (
            <label key={deg} className="flex items-center text-xs sm:text-sm text-slate-600 hover:text-slate-900 cursor-pointer p-1 rounded hover:bg-slate-50">
              <input
                type="radio"
                name="degreeLevel"
                checked={(selectedDegree || 'All') === deg}
                onChange={() => setSelectedDegree(deg === 'All' ? '' : deg)}
                className="w-3.5 h-3.5 text-sky-600 rounded border-slate-300 focus:ring-sky-500 mr-2"
              />
              <span className="truncate">{deg === 'All' ? 'All Degrees' : deg}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Max Annual Tuition Fee Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-slate-400" /> Max Annual Fee
          </label>
          <span className="text-xs font-bold text-sky-700">
            {maxFee ? `₹${(maxFee / 100000).toFixed(1)}L` : 'Any Budget'}
          </span>
        </div>
        <input
          type="range"
          min="50000"
          max="2000000"
          step="50000"
          value={maxFee || 2000000}
          onChange={(e) => setMaxFee(e.target.value === '2000000' ? '' : Number(e.target.value))}
          className="w-full accent-sky-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-400 mt-1">
          <span>₹50K</span>
          <span>₹10L</span>
          <span>₹20L+</span>
        </div>
      </div>

      {/* Min Placement Package Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <Award className="w-3.5 h-3.5 mr-0.5 text-slate-400" /> Min Average CTC
          </label>
          <span className="text-xs font-bold text-emerald-700">
            {minPackage ? `${minPackage} LPA+` : 'Any Package'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          step="2"
          value={minPackage || 0}
          onChange={(e) => setMinPackage(e.target.value === '0' ? '' : Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-400 mt-1">
          <span>0 LPA</span>
          <span>15 LPA</span>
          <span>30 LPA+</span>
        </div>
      </div>

      {/* NAAC Accreditation */}
      <div>
        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          NAAC Grade
        </label>
        <div className="flex flex-wrap gap-1.5">
          {['All', 'A++', 'A+', 'A'].map(grade => (
            <button
              key={grade}
              onClick={() => setSelectedNaac(grade === 'All' ? '' : grade)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer ${
                (selectedNaac || 'All') === grade
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Close / Apply Button */}
      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full bg-sky-600 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm lg:hidden shadow-md cursor-pointer"
        >
          Apply Filters
        </button>
      )}

    </div>
  );
}
