import React, { useState } from 'react';
import { 
  X, MapPin, Phone, Mail, Globe, Star, Award, CheckCircle2, 
  GraduationCap, Building, ShieldCheck, IndianRupee, Wifi, Bed, 
  ExternalLink, Bookmark, Scale, MessageSquarePlus, Send, Sparkles
} from 'lucide-react';

export default function CollegeDetailModal({
  college,
  onClose,
  onToggleBookmark,
  onToggleCompare,
  isComparing,
  onOpenCounseling,
  user,
  onOpenAuth,
  onSubmitReview
}) {
  const [activeTab, setActiveTab] = useState('courses');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewPros, setReviewPros] = useState('');
  const [reviewCons, setReviewCons] = useState('');
  const [reviewProgram, setReviewProgram] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!college) return null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    setSubmittingReview(true);
    try {
      await onSubmitReview({
        college_id: college.id,
        rating: reviewRating,
        title: reviewTitle,
        review_text: reviewText,
        pros: reviewPros,
        cons: reviewCons,
        user_program: reviewProgram || 'Student'
      });
      setShowReviewForm(false);
      setReviewTitle('');
      setReviewText('');
      setReviewPros('');
      setReviewCons('');
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Banner */}
        <div className="relative min-h-[180px] sm:h-64 bg-slate-900 shrink-0 p-4 flex flex-col justify-between">
          <img
            src={college.banner_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'}
            alt={college.name}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          {/* Top Bar inside Banner */}
          <div className="relative z-10 flex items-start justify-between gap-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 max-w-[80%]">
              {college.nirf_rank_2024 && (
                <span className="bg-amber-500 text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs">
                  NIRF #{college.nirf_rank_2024} Ranked
                </span>
              )}
              <span className="bg-sky-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs">
                NAAC {college.naac_grade}
              </span>
              <span className="bg-emerald-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs hidden xs:inline-flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> AICTE & UGC Approved
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* College Title & Quick Header in Banner */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-4">
            <div className="text-white">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-sky-400 font-bold block">
                {college.institution_type} • {college.category === 'Both' ? 'IT & Management' : college.category}
              </span>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight mt-0.5 line-clamp-2">
                {college.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 flex items-center mt-1 truncate">
                <MapPin className="w-3.5 h-3.5 mr-1 text-sky-400 shrink-0" />
                <span className="truncate">{college.address}</span>
              </p>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => onToggleBookmark(college)}
                className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-md transition cursor-pointer ${
                  college.is_bookmarked
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
                title="Shortlist"
              >
                <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${college.is_bookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onToggleCompare(college)}
                className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition flex items-center space-x-1 cursor-pointer ${
                  isComparing
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isComparing ? 'Comparing' : 'Compare'}</span>
              </button>

              <button
                onClick={() => onOpenCounseling(college)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Book Counseling</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Horizontally scrollable on mobile */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 flex overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'courses', label: `Courses (${college.courses?.length || 0})` },
            { id: 'overview', label: 'Overview & Metrics' },
            { id: 'facilities', label: 'Facilities & Campus' },
            { id: 'reviews', label: `Reviews (${college.reviews?.length || 0})` },
            { id: 'contact', label: 'Direct Helpline Desk' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-2.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: COURSES & FEES */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Verified Academic Programs</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">Curriculums, eligibility criteria, and annual fee breakdowns.</p>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full border border-sky-200">
                  {college.courses?.length || 0} Programs
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {college.courses?.map((course) => (
                  <div key={course.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between hover:border-sky-300 transition shadow-2xs">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          course.domain === 'IT' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {course.domain} • {course.degree_level}
                        </span>
                        {course.duration_years && (
                          <span className="text-[11px] text-slate-500 font-semibold">{course.duration_years} Years</span>
                        )}
                      </div>

                      <h5 className="font-bold text-slate-900 text-sm sm:text-base mt-2">{course.course_name}</h5>
                      {course.specialization && (
                        <p className="text-xs text-slate-600 mt-0.5">
                          <span className="font-semibold text-slate-500">Specializations:</span> {course.specialization}
                        </p>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1 text-xs text-slate-600">
                        {course.entrance_exams && (
                          <div>
                            <span className="font-semibold text-slate-700">Entrance Exams:</span>{' '}
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-800">
                              {course.entrance_exams}
                            </span>
                          </div>
                        )}
                        {course.eligibility && (
                          <div className="line-clamp-2">
                            <span className="font-semibold text-slate-700">Eligibility:</span> {course.eligibility}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 block">Annual Tuition</span>
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          ₹{course.total_annual_fee ? (course.total_annual_fee / 100000).toFixed(2) + ' Lakhs/yr' : 'Contact Inst.'}
                        </span>
                      </div>
                      {course.avg_salary_lpa && (
                        <div className="text-right">
                          <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 block">Avg CTC</span>
                          <span className="font-extrabold text-emerald-600 text-xs sm:text-sm">
                            ₹{course.avg_salary_lpa} LPA
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & KEY METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">About the Institution</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
                  {college.description}
                </p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
                  <span className="text-[11px] text-sky-700 font-medium block">Average CTC</span>
                  <span className="text-lg sm:text-2xl font-black text-sky-900">₹{college.avg_package_lpa} LPA</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <span className="text-[11px] text-emerald-700 font-medium block">Highest CTC</span>
                  <span className="text-lg sm:text-2xl font-black text-emerald-900">₹{college.highest_package_lpa} LPA</span>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <span className="text-[11px] text-amber-700 font-medium block">NIRF Rank</span>
                  <span className="text-lg sm:text-2xl font-black text-amber-900">#{college.nirf_rank_2024 || 'Top 100'}</span>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                  <span className="text-[11px] text-purple-700 font-medium block">Campus Area</span>
                  <span className="text-lg sm:text-2xl font-black text-purple-900">{college.campus_area_acres || 50} Acres</span>
                </div>
              </div>

              {/* Ratings Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h5 className="font-bold text-slate-800 text-xs sm:text-sm mb-3">Campus Ratings Breakdown</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Placements & ROI</span>
                      <span className="text-emerald-700">{college.placement_rating || 4.8} / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${((college.placement_rating || 4.8) / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Infrastructure & Labs</span>
                      <span className="text-sky-700">{college.infrastructure_rating || 4.6} / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: `${((college.infrastructure_rating || 4.6) / 5) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Faculty & Research</span>
                      <span className="text-purple-700">{college.faculty_rating || 4.7} / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${((college.faculty_rating || 4.7) / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Campus Amenities Pill List */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="flex items-center px-2.5 py-1.5 bg-slate-100 rounded-lg">
                  <Wifi className="w-3.5 h-3.5 mr-1 text-sky-600" />
                  {college.wifi_campus ? 'Wi-Fi Campus' : 'Wi-Fi in Labs'}
                </span>
                <span className="flex items-center px-2.5 py-1.5 bg-slate-100 rounded-lg">
                  <Bed className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {college.hostel_available ? 'Student Hostels' : 'Hostels Nearby'}
                </span>
                <span className="flex items-center px-2.5 py-1.5 bg-slate-100 rounded-lg">
                  <Award className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  NAAC Grade {college.naac_grade}
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: FACILITIES */}
          {activeTab === 'facilities' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Campus & Academic Facilities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {college.facilities?.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Student Experiences & Ratings</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">Verified feedback from enrolled students and alumni.</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>{showReviewForm ? 'Cancel' : 'Write Review'}</span>
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 animate-in fade-in duration-200">
                  <h5 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Share Your Authentic Campus Experience</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Your Program / Degree Level</label>
                      <input
                        type="text"
                        required
                        value={reviewProgram}
                        onChange={(e) => setReviewProgram(e.target.value)}
                        placeholder="e.g. B.Tech CSE (Class of 2025)"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Rating (1 to 5 Stars)</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold text-amber-600"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Exceptional)</option>
                        <option value={4}>⭐⭐⭐⭐ (4.0 - Very Good)</option>
                        <option value={3}>⭐⭐⭐ (3.0 - Average)</option>
                        <option value={2}>⭐⭐ (2.0 - Below Average)</option>
                        <option value={1}>⭐ (1.0 - Poor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Review Headline / Title</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Great faculty, rigorous coding culture, excellent placements"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Review</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your detailed feedback regarding campus infrastructure, coding labs, hostel food, curriculum, and placement support..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-emerald-700 mb-1">Pros (Key Strengths)</label>
                      <input
                        type="text"
                        value={reviewPros}
                        onChange={(e) => setReviewPros(e.target.value)}
                        placeholder="e.g. Top tier coding labs, lush campus"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-rose-700 mb-1">Cons (Areas for Improvement)</label>
                      <input
                        type="text"
                        value={reviewCons}
                        onChange={(e) => setReviewCons(e.target.value)}
                        placeholder="e.g. Tough grading curve, competitive pressure"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {college.reviews?.length === 0 ? (
                  <p className="text-xs sm:text-sm text-slate-500 italic py-4">No reviews yet for this college. Be the first to share your experience!</p>
                ) : (
                  college.reviews?.map((rev) => (
                    <div key={rev.id} className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{rev.user_name}</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[150px]">• {rev.user_program}</span>
                        </div>
                        <div className="flex items-center space-x-0.5 text-amber-500">
                          {Array.from({ length: Math.round(rev.rating) }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <h5 className="font-bold text-slate-800 text-xs sm:text-sm">{rev.title}</h5>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{rev.review_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DIRECT HELPLINE */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">Direct Official Contact & Helpline</h4>
                <p className="text-[11px] sm:text-xs text-slate-500">Reach the admissions office directly without middle-agent markups.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase block">Admissions Helpline</span>
                      <a href={`tel:${college.admission_helpline || college.contact_number}`} className="font-bold text-slate-900 hover:text-sky-600 text-sm sm:text-base break-all">
                        {college.admission_helpline || college.contact_number}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-2.5 border-t border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase block">Official Email</span>
                      <a href={`mailto:${college.email}`} className="font-bold text-sky-600 hover:underline text-xs sm:text-sm break-all">
                        {college.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-2.5 border-t border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase block">Official Website</span>
                      <a href={college.website} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 hover:underline text-xs sm:text-sm flex items-center break-all">
                        <span className="truncate">{college.website}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase block">Campus Postal Address</span>
                    <p className="font-semibold text-slate-800 text-xs sm:text-sm mt-1">{college.address}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Pincode: {college.pincode || 'Verified'}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    <span className="font-bold block mb-0.5">Verified Institutional Access:</span>
                    <span>Direct access without marketing sales agent commission traps.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-slate-100 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 truncate">
            Source: Official Prospectus & NIRF 2024
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
