import React, { useState, useEffect } from 'react';
import { FileText, Phone, Mail, Clock, CheckCircle2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export default function MyApplications({ token, onSelectCollege, onOpenCounseling }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyInquiries();
  }, [token]);

  const fetchMyInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inquiries/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load my inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Live Applications & Counseling Desk
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            My Counseling Requests & Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Track your 1-on-1 counseling appointments, admission queries, and official brochure requests in real-time.
          </p>
        </div>

        <button
          onClick={() => onOpenCounseling(null)}
          className="self-start sm:self-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center space-x-1.5 cursor-pointer"
        >
          <span>New Counseling Request</span>
        </button>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Retrieving your requests...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">No active counseling applications yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Need guidance regarding JEE cutoffs, CAT percentiles, or course fees? Book a free 1-on-1 session with a mentor.
          </p>
          <button
            onClick={() => onOpenCounseling(null)}
            className="mt-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
          >
            Book Free Guidance Session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    #INQ-{inq.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    inq.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : inq.status === 'contacted'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {inq.status === 'resolved'
                      ? 'Completed & Resolved'
                      : inq.status === 'contacted'
                      ? 'Counselor Assigned & Contacted'
                      : 'Under Academic Review'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • {new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base">
                  {inq.college_name ? (
                    <span
                      onClick={() => onSelectCollege(inq.college_slug)}
                      className="hover:text-sky-600 cursor-pointer"
                    >
                      {inq.college_name} ({inq.college_city})
                    </span>
                  ) : (
                    'General Career & Academic Mentorship'
                  )}
                </h4>

                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-500">Track:</span> {inq.interested_stream} Focus •{' '}
                  <span className="font-semibold text-slate-500">Type:</span> {inq.type.replace('_', ' ')}
                </p>

                {inq.message && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl">
                    "{inq.message}"
                  </p>
                )}
              </div>

              {/* Status Note & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <span className="text-xs text-slate-500 flex items-center mb-1">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Response SLA: &lt; 24h
                </span>

                {inq.college_slug && (
                  <button
                    onClick={() => onSelectCollege(inq.college_slug)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Institution Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
