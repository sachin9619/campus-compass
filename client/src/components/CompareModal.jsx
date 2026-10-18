import React, { useState, useEffect } from 'react';
import { 
  X, Check, Minus, Star, MapPin, IndianRupee, Award, Phone, Mail, 
  Globe, ExternalLink, ArrowRight, Plus, Scale, Search, Building2, Sparkles, Trash2 
} from 'lucide-react';

export default function CompareModal({
  colleges = [],
  allColleges = [],
  onClose,
  onAddCollege,
  onRemoveCollege,
  onClearCompare,
  onOpenCounseling
}) {
  const [internalAllColleges, setInternalAllColleges] = useState(allColleges);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  // If allColleges wasn't passed down or empty, fetch from API
  useEffect(() => {
    if (!allColleges || allColleges.length === 0) {
      fetch('/api/colleges/all-names')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setInternalAllColleges(data);
        })
        .catch(err => console.error('Failed to load all colleges for comparison:', err));
    } else {
      setInternalAllColleges(allColleges);
    }
  }, [allColleges]);

  // Filter available colleges not already in compare list
  const availableColleges = (internalAllColleges || []).filter(
    c => !colleges.some(selected => selected.id === c.id)
  );

  const filteredAvailable = availableColleges.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.short_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.state || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Popular presets
  const popularPresets = [
    { title: 'IIT Bombay vs IIT Delhi', colleges: ['IIT Bombay', 'IIT Delhi'] },
    { title: 'IIM Ahmedabad vs IIM Bangalore', colleges: ['IIM Ahmedabad', 'IIM Bangalore'] },
    { title: 'BITS Pilani vs IIIT Hyderabad', colleges: ['BITS Pilani', 'IIIT Hyderabad'] },
    { title: 'IIT Madras vs NIT Trichy', colleges: ['IIT Madras', 'NIT Trichy'] }
  ];

  const applyPreset = (presetNames) => {
    const matched = (internalAllColleges || []).filter(c => 
      presetNames.some(name => (c.short_name || c.name || '').toLowerCase().includes(name.toLowerCase()))
    );
    if (matched.length > 0) {
      if (onClearCompare) onClearCompare();
      matched.forEach(c => {
        if (onAddCollege) onAddCollege(c);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  Side-by-Side Comparison Matrix
                </span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {colleges.length}/4 Selected
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black mt-0.5">
                {colleges.length === 0 ? 'Compare Colleges Side-by-Side' : `Comparing ${colleges.length} Institution${colleges.length > 1 ? 's' : ''}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {colleges.length > 0 && onClearCompare && (
              <button
                onClick={onClearCompare}
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-slate-700 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {colleges.length === 0 ? (
          /* EMPTY STATE: Help user pick colleges to compare */
          <div className="p-6 sm:p-10 flex-1 overflow-y-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Select Colleges to Compare
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Compare tuition fees, highest & average placement CTC, NIRF 2024 ranking, NAAC accreditation, and verified institutional helplines in a unified matrix.
              </p>
            </div>

            {/* Quick Matchups */}
            <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center mb-3">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Quick Matchup Presets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {popularPresets.map(preset => (
                  <button
                    key={preset.title}
                    onClick={() => applyPreset(preset.colleges)}
                    className="p-3 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition flex items-center justify-between group cursor-pointer shadow-xs"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700">
                      {preset.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Pick Colleges */}
            <div className="max-w-2xl mx-auto space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Or Search & Select Colleges from Catalog:
              </h4>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type college name, city, or stream (e.g. IIT, Mumbai, MBA)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 border border-slate-100 rounded-2xl">
                {filteredAvailable.slice(0, 10).map(col => (
                  <div
                    key={col.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-sky-300 transition shadow-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <h5 className="text-xs font-extrabold text-slate-900 truncate">
                        {col.short_name || col.name}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate">
                        {col.city}, {col.state} • NIRF #{col.nirf_rank_2024 || 'NA'}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddCollege && onAddCollege(col)}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* COMPARISON TABLE VIEW */
          <div className="p-3 sm:p-6 overflow-x-auto flex-1">
            <div className="sm:hidden mb-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>← Scroll horizontally to view all colleges →</span>
              {colleges.length < 4 && (
                <button
                  onClick={() => setIsAddingOpen(!isAddingOpen)}
                  className="text-sky-600 font-bold"
                >
                  + Add College
                </button>
              )}
            </div>

            {/* Quick Add Dropdown Bar (if user wants to add up to 4) */}
            {colleges.length < 4 && (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">
                    Add up to {4 - colleges.length} more college{4 - colleges.length > 1 ? 's' : ''} to this matrix:
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-1 sm:max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search to add college..."
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  {searchQuery && (
                    <div className="absolute z-20 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl p-1 w-72">
                      {filteredAvailable.slice(0, 6).map(col => (
                        <button
                          key={col.id}
                          onClick={() => {
                            if (onAddCollege) onAddCollege(col);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-2 hover:bg-sky-50 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{col.short_name || col.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">#{col.nirf_rank_2024 || '-'}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <table className="w-full text-left border-collapse min-w-[550px] sm:min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-2.5 sm:p-3 bg-slate-100 text-[11px] sm:text-xs font-bold uppercase text-slate-600 sticky left-0 z-10 w-36 sm:w-48 shadow-xs">
                    Feature / Metric
                  </th>
                  {colleges.map((col) => (
                    <th key={col.id} className="p-2.5 sm:p-3 bg-slate-50 text-slate-900 align-top min-w-[160px] sm:min-w-[200px]">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-extrabold text-xs sm:text-base line-clamp-1">
                          {col.short_name || col.name}
                        </span>
                        <button
                          onClick={() => onRemoveCollege && onRemoveCollege(col.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer rounded"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {col.city}, {col.state}
                      </span>
                    </th>
                  ))}

                  {/* Add Slot column if fewer than 4 */}
                  {colleges.length < 4 && (
                    <th className="p-2.5 sm:p-3 bg-slate-50/50 border-2 border-dashed border-slate-200 text-slate-400 align-middle text-center min-w-[160px]">
                      <span className="text-xs font-bold block mb-1">Slot Available</span>
                      <span className="text-[10px] text-slate-400">Search above to add</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                
                {/* Category */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Stream Focus
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 font-semibold text-slate-800">
                      <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold ${
                        col.category === 'IT' ? 'bg-blue-100 text-blue-800' : col.category === 'Management' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {col.category === 'Both' ? 'IT & Management' : col.category}
                      </span>
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Institution Type */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Institution Type
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 font-medium text-slate-800">
                      {col.institution_type}
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* NIRF Rank 2024 */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    NIRF 2024 Rank
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 font-extrabold text-amber-700">
                      {col.nirf_rank_2024 ? `#${col.nirf_rank_2024}` : 'Top 100 Band'}
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* NAAC Accreditation */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    NAAC Grade
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 font-bold text-sky-700">
                      Grade {col.naac_grade || 'A'}
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Average CTC */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Average CTC
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 font-black text-emerald-700 text-sm sm:text-base">
                      ₹{col.avg_package_lpa} LPA
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Highest CTC */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Highest CTC
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 font-bold text-slate-800">
                      ₹{col.highest_package_lpa} LPA
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Annual Tuition Fees */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Annual Tuition Range
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 font-semibold text-slate-800">
                      ₹{(col.min_annual_fee / 100000).toFixed(1)}L - ₹{(col.max_annual_fee / 100000).toFixed(1)}L
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Student Rating
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3">
                      <div className="flex items-center space-x-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{col.rating || 4.5} / 5.0</span>
                      </div>
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Campus Size */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Campus Area
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 text-slate-700">
                      {col.campus_area_acres || 30} Acres
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Direct Helpline */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Direct Helpline
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 font-semibold text-slate-900">
                      <a href={`tel:${col.contact_number}`} className="hover:text-sky-600 underline flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{col.contact_number}</span>
                      </a>
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Official Email */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Official Email
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3 text-slate-700 truncate max-w-[180px]">
                      <a href={`mailto:${col.email}`} className="hover:text-sky-600 underline flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-sky-600 shrink-0" />
                        <span className="truncate">{col.email}</span>
                      </a>
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Official Website */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    Website
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3">
                      <a 
                        href={col.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sky-600 hover:text-sky-700 font-bold inline-flex items-center space-x-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visit Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

                {/* Action / Free Counseling */}
                <tr>
                  <td className="p-2.5 sm:p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 shadow-xs text-[11px] sm:text-xs">
                    1-on-1 Guidance
                  </td>
                  {colleges.map(col => (
                    <td key={col.id} className="p-2.5 sm:p-3">
                      <button
                        onClick={() => onOpenCounseling(col)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition shadow-xs w-full cursor-pointer whitespace-nowrap"
                      >
                        Book Counseling
                      </button>
                    </td>
                  ))}
                  {colleges.length < 4 && <td className="bg-slate-50/30"></td>}
                </tr>

              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Cloud Counselage GPI • Verified Direct Helplines & Cutoff Data
          </span>
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
}
