import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Filter, BookOpen, IndianRupee, Award, ArrowUpRight } from 'lucide-react';

import { apiRequest } from '../services/api';

export default function CourseCatalog({ onSelectCollege }) {
  const [courses, setCourses] = useState([]);
  const [domainFilter, setDomainFilter] = useState('All');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [domainFilter, degreeFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (domainFilter !== 'All') params.append('domain', domainFilter);
      if (degreeFilter !== 'All') params.append('degree_level', degreeFilter);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await apiRequest(`/api/courses?${params.toString()}`);
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses catalog', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center space-x-1.5 bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <GraduationCap className="w-4 h-4" />
          <span>Centralized Degree & Curriculum Catalog</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black">
          Explore IT & Management Degree Programs
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
          Compare curriculums, eligibility criteria, entrance exams, and fee matrices across Bachelor's, Master's, and Executive diplomas.
        </p>

        {/* Search & Domain Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by degree name (e.g. Artificial Intelligence, MBA Finance, MCA, BCA)..."
              className="w-full pl-9 pr-3 py-2.5 bg-white text-slate-900 rounded-xl text-xs sm:text-sm focus:outline-none placeholder-slate-400 shadow-md"
            />
          </form>

          <div className="flex space-x-2">
            {['All', 'IT', 'Management'].map(d => (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  domainFilter === d ? 'bg-sky-500 text-white shadow-md' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {d === 'All' ? 'All Tracks' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Degree Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs font-semibold">
        <span className="text-slate-400 mr-1 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> Degree Level:
        </span>
        {['All', 'Undergraduate', 'Postgraduate', 'Executive'].map(deg => (
          <button
            key={deg}
            onClick={() => setDegreeFilter(deg)}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              degreeFilter === deg ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {deg}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading courses catalog...</div>
        ) : courses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No courses match the criteria.</div>
        ) : (
          courses.map((crs) => (
            <div key={crs.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    crs.domain === 'IT' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {crs.domain}
                  </span>
                  <span className="text-slate-500 font-semibold">{crs.degree_level} • {crs.duration_years} Yrs</span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base line-clamp-1">{crs.course_name}</h4>
                
                <p 
                  onClick={() => onSelectCollege(crs.college_slug)}
                  className="text-xs font-bold text-sky-600 hover:underline cursor-pointer mt-1"
                >
                  {crs.college_name}{crs.college_city ? ` (${crs.college_city})` : ''}
                </p>

                {crs.specialization && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                    <span className="font-semibold text-slate-600">Focus:</span> {crs.specialization}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  {crs.entrance_exams && (
                    <div>
                      <span className="font-semibold text-slate-700">Exam:</span>{' '}
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">{crs.entrance_exams}</span>
                    </div>
                  )}
                  {crs.eligibility && (
                    <div className="line-clamp-1">
                      <span className="font-semibold text-slate-700">Eligibility:</span> {crs.eligibility}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Tuition</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {crs.total_annual_fee ? `₹${(crs.total_annual_fee / 100000).toFixed(2)} Lakhs` : 'Contact Inst.'}
                  </span>
                </div>

                <button
                  onClick={() => onSelectCollege(crs.college_slug)}
                  className="bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
                >
                  <span>Institution</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
