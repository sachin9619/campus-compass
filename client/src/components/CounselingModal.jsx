import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, ShieldCheck, PhoneCall, HelpCircle } from 'lucide-react';

export default function CounselingModal({
  college,
  user,
  onClose,
  onSubmitInquiry
}) {
  const [formData, setFormData] = useState({
    student_name: user?.full_name || '',
    student_email: user?.email || '',
    student_phone: user?.phone || '',
    city: '',
    interested_stream: college?.category || 'Both',
    interested_course: '',
    message: college ? `I am interested in admission details and cutoff ranks for ${college.name}.` : '',
    type: 'counseling_booking'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inquiryId, setInquiryId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await onSubmitInquiry({
        ...formData,
        college_id: college?.id || null
      });
      setSuccess(true);
      setInquiryId(res.inquiryId);
    } catch (err) {
      alert(err.message || 'Failed to submit counseling request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cloud Counselage Academic Mentorship</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black">
            {college ? `Inquire: ${college.short_name || college.name}` : 'Book 1-on-1 Academic Counseling'}
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            Zero sales pressure. 100% unbiased academic guidance and verified cutoff information.
          </p>
        </div>

        {/* Form Body or Success Screen */}
        <div className="p-5 sm:p-6">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Counseling Request Registered!</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                Thank you! Your reference ID is <span className="font-mono font-bold text-emerald-700">#INQ-{inquiryId}</span>. A Cloud Counselage academic advisor will review your profile and reach out within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    placeholder="e.g. Priyanshu Roy"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.student_phone}
                    onChange={(e) => setFormData({ ...formData, student_phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.student_email}
                    onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                    placeholder="e.g. student@gmail.com"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Current City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Pune, Mumbai, Delhi"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Stream</label>
                  <select
                    value={formData.interested_stream}
                    onChange={(e) => setFormData({ ...formData, interested_stream: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="IT">Pure IT & Computer Science</option>
                    <option value="Management">Management & MBA / BBA</option>
                    <option value="Both">Both (IT & Management)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Request Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="counseling_booking">1-on-1 Career Counseling Session</option>
                    <option value="inquiry">Official Admission Inquiry</option>
                    <option value="brochure_request">Request Verified Prospectus / Brochure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specific Questions / Course Interest</label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Want to know cutoff percentile, hostel fees, placement records..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Privacy Promise */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your contact data is strictly confidential and never sold to third-party telecallers.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Counseling Request'}</span>
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
