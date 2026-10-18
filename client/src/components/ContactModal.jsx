import React, { useState } from 'react';
import { 
  X, Phone, Mail, MapPin, Globe, Clock, ShieldCheck, 
  Send, CheckCircle2, MessageSquare, Headphones, Building 
} from 'lucide-react';

export default function ContactModal({ isOpen, onClose, onOpenCounseling }) {
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query_type: 'Admission Helpline',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest">
                Direct Academic Helplines & Support
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                Contact Information Desk
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Notice */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start space-x-3 text-sky-900">
            <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Zero-Spam Direct Contact Guarantee</p>
              <p className="text-sky-700 leading-relaxed">
                CampusCompass does not sell or distribute student phone numbers to commercial coaching portals or third-party telemarketers. All contact numbers listed below connect directly to official institutional admissions desks and Cloud Counselage GPI academic mentors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Central Support & Helplines */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center">
                <Building className="w-4 h-4 mr-1.5 text-slate-600" />
                Cloud Counselage Headquarters
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Student Helpline Toll-Free</span>
                    <a href="tel:18002008899" className="text-sky-600 font-semibold hover:underline">
                      1800-200-8899 / +91 91520 03344
                    </a>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Mon - Sat, 9:30 AM - 6:30 PM IST</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Admissions & Verification Desk</span>
                    <a href="mailto:support@campuscompass.in" className="text-sky-600 font-semibold hover:underline">
                      support@campuscompass.in
                    </a>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Response within 4 business hours</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Project Development Center</span>
                    <p className="text-slate-600 leading-relaxed mt-0.5">
                      Cloud Counselage Pvt. Ltd. & CC-GAC Research Cell, Mumbai & Pune Innovation Hub, Maharashtra 400076
                    </p>
                  </div>
                </div>
              </div>

              {/* Central Admission Portals */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Key Counseling Authorities
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-800">JoSAA / CSAB (IITs, NITs, IIITs)</span>
                    <span className="font-bold text-sky-600">josaa.nic.in</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-800">IIM Common Admission (CAT)</span>
                    <span className="font-bold text-sky-600">iimcat.ac.in</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-800">State CET Cell Maharashtra</span>
                    <span className="font-bold text-sky-600">cetcell.mahacet.org</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Column 2: Send Direct Query Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1.5 text-sky-600" />
                Submit Verification Inquiry
              </h3>

              {inquirySent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Inquiry Received</h4>
                  <p className="text-xs text-emerald-700">
                    A certified Cloud Counselage academic advisor will review your query and contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@gmail.com"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98..."
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Inquiry Focus</label>
                    <select
                      value={formData.query_type}
                      onChange={(e) => setFormData({ ...formData, query_type: e.target.value })}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="Admission Helpline">Admission Cutoff Helpline</option>
                      <option value="Fee Breakdown Verification">Fee Breakdown Verification</option>
                      <option value="IT Stream Selection">IT / Computer Science Guidance</option>
                      <option value="MBA Stream Selection">Management / MBA Guidance</option>
                      <option value="Dispute College Record">Report Incorrect College Data</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Message / Questions</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify the college, cutoff query, or stream guidance needed..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Query</span>
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Cloud Counselage Global Professional Internship • 2025
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            Close Desk
          </button>
        </div>

      </div>
    </div>
  );
}
