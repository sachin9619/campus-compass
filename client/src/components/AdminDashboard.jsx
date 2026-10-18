import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Users, Building, BookOpen, MessageSquare, 
  CheckCircle, Clock, Plus, Trash2, Edit2, Search, Phone, Mail, 
  ExternalLink, RefreshCw, GraduationCap, X, Check, ArrowRight, 
  IndianRupee, Eye, LogOut, Activity, Database, CheckCircle2, ChevronRight
} from 'lucide-react';
import { apiRequest } from '../services/api';

export default function AdminDashboard({ user, token, onExitAdmin, onLogout }) {
  const [metrics, setMetrics] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // Admin Tabs: 'overview', 'inquiries', 'colleges', 'courses', 'add_college'
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [loading, setLoading] = useState(false);

  // New College Form State
  const initialCollegeState = {
    name: '',
    short_name: '',
    category: 'Both',
    institution_type: 'State University',
    established_year: 2005,
    city: '',
    state: '',
    address: '',
    contact_number: '',
    admission_helpline: '',
    email: '',
    website: 'https://',
    nirf_rank_2024: '',
    naac_grade: 'A',
    min_annual_fee: 150000,
    max_annual_fee: 300000,
    avg_package_lpa: 10.5,
    highest_package_lpa: 25.0,
    description: ''
  };

  const [newCollege, setNewCollege] = useState(initialCollegeState);
  const [savingCollege, setSavingCollege] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState('');

  // Editing College State
  const [editingCollege, setEditingCollege] = useState(null);
  const [savingEditCollege, setSavingEditCollege] = useState(false);

  // Manage Courses State
  const [courseSearch, setCourseSearch] = useState('');
  const [courseDomainFilter, setCourseDomainFilter] = useState('All');
  const [editingCourse, setEditingCourse] = useState(null);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    college_id: '',
    course_name: '',
    degree_level: 'Undergraduate',
    domain: 'IT',
    duration_years: 4,
    total_annual_fee: 200000,
    seats: 60,
    eligibility: '10+2 with PCM minimum 60%',
    entrance_exams: 'JEE Main, State CET',
    specialization: 'Artificial Intelligence & Data Science',
    avg_salary_lpa: 12.0
  });

  useEffect(() => {
    fetchMetrics();
    fetchInquiries();
    fetchColleges();
    fetchCourses();
  }, [token]);

  const fetchMetrics = async () => {
    try {
      const { data } = await apiRequest('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch admin metrics', err);
    }
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const url = inquiryStatusFilter === 'all' 
        ? '/api/admin/inquiries' 
        : `/api/admin/inquiries?status=${inquiryStatusFilter}`;
      const { data } = await apiRequest(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(Array.isArray(data) ? data : (data?.inquiries || []));
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const { data } = await apiRequest('/api/colleges/all-names');
      setColleges(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch colleges for admin', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await apiRequest('/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch courses for admin', err);
    }
  };

  const updateInquiryStatus = async (id, status) => {
    try {
      const result = await apiRequest(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (result.ok) {
        fetchInquiries();
        fetchMetrics();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Add College Handler
  const handleCreateCollege = async (e) => {
    e.preventDefault();
    setSavingCollege(true);
    try {
      const result = await apiRequest('/api/admin/colleges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCollege)
      });
      const data = result.data;
      if (!result.ok) throw new Error(data.error);

      alert('College created successfully!');
      setActiveAdminTab('colleges');
      fetchColleges();
      fetchMetrics();
      setNewCollege(initialCollegeState);
    } catch (err) {
      alert(err.message || 'Error creating college');
    } finally {
      setSavingCollege(false);
    }
  };

  // Update College Handler
  const handleUpdateCollege = async (e) => {
    e.preventDefault();
    if (!editingCollege) return;
    setSavingEditCollege(true);
    try {
      const result = await apiRequest(`/api/admin/colleges/${editingCollege.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingCollege)
      });
      const data = result.data;
      if (!result.ok) throw new Error(data.error);

      alert('College updated successfully!');
      setEditingCollege(null);
      fetchColleges();
      fetchMetrics();
    } catch (err) {
      alert(err.message || 'Error updating college');
    } finally {
      setSavingEditCollege(false);
    }
  };

  // Delete College Handler
  const handleDeleteCollege = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}? This will also delete all associated courses.`)) return;

    try {
      const result = await apiRequest(`/api/admin/colleges/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (result.ok) {
        fetchColleges();
        fetchCourses();
        fetchMetrics();
      }
    } catch (err) {
      alert('Failed to delete college');
    }
  };

  // Add Course Handler
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.college_id) {
      alert('Please select an institution for this course.');
      return;
    }
    try {
      const result = await apiRequest(`/api/admin/colleges/${newCourse.college_id}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      const data = result.data;
      if (!result.ok) throw new Error(data.error);

      alert('Course added successfully!');
      setIsAddCourseOpen(false);
      fetchCourses();
      fetchMetrics();
    } catch (err) {
      alert(err.message || 'Error adding course');
    }
  };

  // Update Course Handler
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      const result = await apiRequest(`/api/admin/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingCourse)
      });
      const data = result.data;
      if (!result.ok) throw new Error(data.error);

      alert('Course updated successfully!');
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      alert(err.message || 'Error updating course');
    }
  };

  // Delete Course Handler
  const handleDeleteCourse = async (id, courseName) => {
    if (!confirm(`Are you sure you want to delete ${courseName}?`)) return;
    try {
      const result = await apiRequest(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (result.ok) {
        fetchCourses();
        fetchMetrics();
      }
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  const filteredInquiries = inquiries.filter(inq =>
    (inq.student_name || inq.full_name || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
    (inq.student_email || inq.email || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
    (inq.student_phone || inq.phone || '').includes(inquirySearch) ||
    (inq.college_name || '').toLowerCase().includes(inquirySearch.toLowerCase())
  );

  const filteredColleges = colleges.filter(c => 
    (c.name || '').toLowerCase().includes(collegeSearch.toLowerCase()) ||
    (c.short_name || '').toLowerCase().includes(collegeSearch.toLowerCase()) ||
    (c.city || '').toLowerCase().includes(collegeSearch.toLowerCase()) ||
    (c.state || '').toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(cr => {
    const matchesSearch = (cr.course_name || '').toLowerCase().includes(courseSearch.toLowerCase()) ||
      (cr.college_name || '').toLowerCase().includes(courseSearch.toLowerCase()) ||
      (cr.specialization || '').toLowerCase().includes(courseSearch.toLowerCase());
    const matchesDomain = courseDomainFilter === 'All' || cr.domain === courseDomainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* ========================================================= */}
      {/* 1. DEDICATED ADMIN HEADER BAR (NO STUDENT NAV LINKS)     */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Admin Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-lg text-white tracking-tight">CampusCompass</span>
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Admin Console
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SQLite Connected (WAL Mode)</span>
                  <span>•</span>
                  <span>Cloud Counselage GPI</span>
                </div>
              </div>
            </div>

            {/* Desktop Admin Quick Actions */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => { fetchMetrics(); fetchInquiries(); fetchColleges(); fetchCourses(); }}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                title="Refresh database records"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync</span>
              </button>

              {onExitAdmin && (
                <button
                  onClick={onExitAdmin}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Student Site</span>
                </button>
              )}

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar py-1.5">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Activity, count: null },
              { id: 'inquiries', label: 'Counseling Inquiries', icon: MessageSquare, count: metrics?.pendingInquiries || null },
              { id: 'colleges', label: 'Manage Colleges', icon: Building, count: colleges.length },
              { id: 'courses', label: 'Manage Courses', icon: BookOpen, count: courses.length },
              { id: 'add_college', label: '+ Add College', icon: Plus, count: null }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-purple-800 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. ADMIN MAIN WORKSPACE                                  */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Colleges in DB</span>
                  <Building className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white">{metrics?.totalColleges || colleges.length}</div>
                <span className="text-[11px] text-purple-400 mt-1 block">24 Top National Institutions</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Course Catalog</span>
                  <BookOpen className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-black text-sky-400">{metrics?.totalCourses || courses.length}</div>
                <span className="text-[11px] text-slate-400 mt-1 block">B.Tech, MCA, MBA & Executive</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Inquiries</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400">{metrics?.totalInquiries || inquiries.length}</div>
                <span className="text-[11px] text-slate-400 mt-1 block">Cloud Counselage Leads</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-400">{metrics?.pendingInquiries || 0}</div>
                <span className="text-[11px] text-amber-300/80 mt-1 block">Awaiting Student Counselor</span>
              </div>
            </div>

            {/* Quick Launch Buttons */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-sm">Administrative Fast Actions</h3>
                <p className="text-xs text-slate-400 mt-0.5">Quickly manage college records, course offerings, or follow up with students.</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveAdminTab('add_college')}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New College</span>
                </button>
                <button
                  onClick={() => { setActiveAdminTab('courses'); setIsAddCourseOpen(true); }}
                  className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Course</span>
                </button>
                <button
                  onClick={() => setActiveAdminTab('inquiries')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  View Inquiries
                </button>
              </div>
            </div>

            {/* Recent Inquiries Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span>Recent Counseling Leads</span>
                </h3>
                <button
                  onClick={() => setActiveAdminTab('inquiries')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All Leads</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase">
                      <th className="p-3">Student</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Target College</th>
                      <th className="p-3">Stream</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {inquiries.slice(0, 5).map(inq => (
                      <tr key={inq.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-white whitespace-nowrap">{inq.student_name || inq.full_name}</td>
                        <td className="p-3 text-slate-300 whitespace-nowrap">{inq.student_phone || inq.phone || '—'}</td>
                        <td className="p-3 text-slate-300">{inq.college_name || 'General Guidance'}</td>
                        <td className="p-3 text-purple-300 font-semibold">{inq.interested_stream || inq.target_degree || '—'}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            (inq.status||'').toLowerCase() === 'resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            (inq.status||'').toLowerCase() === 'contacted' ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {inq.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {(inq.status||'').toLowerCase() === 'pending' && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'contacted')}
                              className="text-sky-400 hover:text-sky-300 text-xs font-bold underline cursor-pointer"
                            >
                              Mark Contacted
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: INQUIRIES & COUNSELING LEADS */}
        {activeAdminTab === 'inquiries' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base">Student Counseling Leads Pipeline</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage 1-on-1 counseling inquiries booked by students across India.</p>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center space-x-1.5">
                {['all', 'pending', 'contacted', 'resolved'].map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      setInquiryStatusFilter(status);
                      setTimeout(fetchInquiries, 50);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                      inquiryStatusFilter === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                placeholder="Search by student name, phone, email, or college..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Inquiries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-bold uppercase">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Target College</th>
                    <th className="p-3">Stream / Message</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                        No student inquiries found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-white whitespace-nowrap">
                          {inq.student_name || inq.full_name}
                          {inq.city && <span className="block text-[10px] text-slate-400 font-normal">{inq.city}</span>}
                        </td>
                        <td className="p-3 space-y-0.5 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-slate-300">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{inq.student_phone || inq.phone || '—'}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-400">
                            <Mail className="w-3 h-3 text-sky-400" />
                            <span>{inq.student_email || inq.email || '—'}</span>
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-slate-300">
                          {inq.college_name || <span className="italic text-slate-500">General Guidance</span>}
                        </td>
                        <td className="p-3 max-w-xs">
                          <span className="font-bold text-purple-300 bg-purple-950/80 border border-purple-800/50 px-1.5 py-0.5 rounded mr-1">
                            {inq.interested_stream || inq.target_degree || '—'}
                          </span>
                          <span className="text-slate-400 line-clamp-1">{inq.message || inq.type || ''}</span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            (inq.status||'').toLowerCase() === 'resolved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : (inq.status||'').toLowerCase() === 'contacted'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {inq.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                          {(inq.status||'').toLowerCase() === 'pending' && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'Contacted')}
                              className="bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Contacted
                            </button>
                          )}
                          {(inq.status||'').toLowerCase() !== 'resolved' && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'Resolved')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Resolved
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE COLLEGES (ADD / EDIT / DELETE) */}
        {activeAdminTab === 'colleges' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  placeholder="Search institutions by name, city, or state..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={() => setActiveAdminTab('add_college')}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add College Record</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-bold uppercase">
                    <th className="p-3">College Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">NIRF / NAAC</th>
                    <th className="p-3">Avg CTC</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredColleges.map((col) => (
                    <tr key={col.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">
                        {col.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{col.contact_number}</span>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-semibold text-[11px] border border-slate-700">
                          {col.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">
                        {col.city}, {col.state}
                      </td>
                      <td className="p-3 font-semibold text-purple-300">
                        NIRF #{col.nirf_rank_2024 || '-'} • NAAC {col.naac_grade || 'A'}
                      </td>
                      <td className="p-3 font-extrabold text-emerald-400">
                        ₹{col.avg_package_lpa} LPA
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setEditingCollege(col)}
                          className="text-sky-400 hover:text-sky-300 p-1.5 hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Edit College Information"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCollege(col.id, col.name)}
                          className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Delete College"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE COURSES */}
        {activeAdminTab === 'courses' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search courses, colleges, or specializations..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={courseDomainFilter}
                  onChange={(e) => setCourseDomainFilter(e.target.value)}
                  className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300"
                >
                  <option value="All">All Domains</option>
                  <option value="IT">IT Only</option>
                  <option value="Management">Management Only</option>
                  <option value="IT & Management">Dual Stream</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddCourseOpen(true)}
                className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-bold uppercase">
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Institution</th>
                    <th className="p-3">Domain / Level</th>
                    <th className="p-3">Annual Fee</th>
                    <th className="p-3">Seats & Exams</th>
                    <th className="p-3">Avg CTC</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                        No courses found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((cr) => (
                      <tr key={cr.id} className="hover:bg-slate-800/40">
                        <td className="p-3">
                          <span className="font-bold text-white block">{cr.course_name}</span>
                          {cr.specialization && (
                            <span className="text-[10px] text-sky-400 bg-sky-950/80 border border-sky-800/50 px-1.5 py-0.2 rounded font-medium">
                              {cr.specialization}
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-slate-300">
                          {cr.college_short_name || cr.college_name}
                          <span className="block text-[10px] text-slate-500 font-normal">{cr.college_city}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-300 block">{cr.domain}</span>
                          <span className="text-[10px] text-slate-500">{cr.degree_level} ({cr.duration_years} Yrs)</span>
                        </td>
                        <td className="p-3 font-bold text-white">
                          ₹{(cr.total_annual_fee / 100000).toFixed(2)} Lakhs
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-300 block">{cr.seats || 60} Seats</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-xs block">{cr.entrance_exams || 'Merit / Direct'}</span>
                        </td>
                        <td className="p-3 font-extrabold text-emerald-400">
                          {cr.avg_salary_lpa ? `₹${cr.avg_salary_lpa} LPA` : '-'}
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setEditingCourse(cr)}
                            className="text-sky-400 hover:text-sky-300 p-1.5 hover:bg-slate-800 rounded transition cursor-pointer"
                            title="Edit Course"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(cr.id, cr.course_name)}
                            className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-slate-800 rounded transition cursor-pointer"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ADD NEW COLLEGE RECORD */}
        {activeAdminTab === 'add_college' && (
          <form onSubmit={handleCreateCollege} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-white text-lg border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Building className="w-5 h-5 text-purple-400" />
              <span>Add Verified Institution to SQLite Database</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full College Name *</label>
                <input
                  type="text"
                  required
                  value={newCollege.name}
                  onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                  placeholder="e.g. National Institute of Technology Delhi"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Short Name</label>
                <input
                  type="text"
                  value={newCollege.short_name}
                  onChange={(e) => setNewCollege({ ...newCollege, short_name: e.target.value })}
                  placeholder="e.g. NIT Delhi"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Stream Category</label>
                <select
                  value={newCollege.category}
                  onChange={(e) => setNewCollege({ ...newCollege, category: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="IT">Pure IT</option>
                  <option value="Management">Management</option>
                  <option value="Both">Both (IT & Management)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Institution Type</label>
                <select
                  value={newCollege.institution_type}
                  onChange={(e) => setNewCollege({ ...newCollege, institution_type: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="IIT">IIT</option>
                  <option value="IIM">IIM</option>
                  <option value="NIT">NIT</option>
                  <option value="IIIT">IIIT</option>
                  <option value="Central University">Central University</option>
                  <option value="State University">State University</option>
                  <option value="Private">Private</option>
                  <option value="Deemed to be University">Deemed to be University</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Established Year</label>
                <input
                  type="number"
                  value={newCollege.established_year}
                  onChange={(e) => setNewCollege({ ...newCollege, established_year: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={newCollege.city}
                  onChange={(e) => setNewCollege({ ...newCollege, city: e.target.value })}
                  placeholder="e.g. Pune"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={newCollege.state}
                  onChange={(e) => setNewCollege({ ...newCollege, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">NAAC Grade</label>
                <select
                  value={newCollege.naac_grade}
                  onChange={(e) => setNewCollege({ ...newCollege, naac_grade: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="A++">A++</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B++">B++</option>
                  <option value="NA">NA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Helpline Phone *</label>
                <input
                  type="text"
                  required
                  value={newCollege.contact_number}
                  onChange={(e) => setNewCollege({ ...newCollege, contact_number: e.target.value })}
                  placeholder="+91 ..."
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Admissions Email *</label>
                <input
                  type="email"
                  required
                  value={newCollege.email}
                  onChange={(e) => setNewCollege({ ...newCollege, email: e.target.value })}
                  placeholder="admissions@..."
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Official Website</label>
                <input
                  type="url"
                  value={newCollege.website}
                  onChange={(e) => setNewCollege({ ...newCollege, website: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Average CTC (LPA)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newCollege.avg_package_lpa}
                  onChange={(e) => setNewCollege({ ...newCollege, avg_package_lpa: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Min Annual Tuition Fee (₹)</label>
                <input
                  type="number"
                  value={newCollege.min_annual_fee}
                  onChange={(e) => setNewCollege({ ...newCollege, min_annual_fee: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">NIRF Rank 2024</label>
                <input
                  type="number"
                  value={newCollege.nirf_rank_2024}
                  onChange={(e) => setNewCollege({ ...newCollege, nirf_rank_2024: e.target.value })}
                  placeholder="Optional"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Description & Academic Highlights</label>
              <textarea
                rows={3}
                value={newCollege.description}
                onChange={(e) => setNewCollege({ ...newCollege, description: e.target.value })}
                placeholder="Key placement milestones, alumni, research labs..."
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={savingCollege}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{savingCollege ? 'Saving...' : 'Add College to SQLite Database'}</span>
            </button>
          </form>
        )}

      </main>

      {/* EDIT COLLEGE MODAL */}
      {editingCollege && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col my-auto text-slate-100">
            <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">Institution Editor</span>
                <h3 className="text-lg font-bold">Edit {editingCollege.name}</h3>
              </div>
              <button 
                onClick={() => setEditingCollege(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCollege} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full College Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCollege.name || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, name: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Short Name</label>
                  <input
                    type="text"
                    value={editingCollege.short_name || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, short_name: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Stream Category</label>
                  <select
                    value={editingCollege.category || 'Both'}
                    onChange={(e) => setEditingCollege({ ...editingCollege, category: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="IT">IT</option>
                    <option value="Management">Management</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Institution Type</label>
                  <input
                    type="text"
                    value={editingCollege.institution_type || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, institution_type: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">NIRF 2024 Rank</label>
                  <input
                    type="number"
                    value={editingCollege.nirf_rank_2024 || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, nirf_rank_2024: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={editingCollege.city || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, city: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={editingCollege.state || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, state: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">NAAC Grade</label>
                  <select
                    value={editingCollege.naac_grade || 'A'}
                    onChange={(e) => setEditingCollege({ ...editingCollege, naac_grade: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="A++">A++</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B++">B++</option>
                    <option value="NA">NA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Direct Helpline *</label>
                  <input
                    type="text"
                    required
                    value={editingCollege.contact_number || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, contact_number: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={editingCollege.email || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, email: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Average CTC (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCollege.avg_package_lpa || ''}
                    onChange={(e) => setEditingCollege({ ...editingCollege, avg_package_lpa: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCollege(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEditCollege}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-md"
                >
                  {savingEditCollege ? 'Saving...' : 'Save College Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COURSE MODAL */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto text-slate-100">
            <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-400 tracking-wider">Curriculum Manager</span>
                <h3 className="text-lg font-bold">Add Course Offering</h3>
              </div>
              <button 
                onClick={() => setIsAddCourseOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Institution *</label>
                <select
                  required
                  value={newCourse.college_id}
                  onChange={(e) => setNewCourse({ ...newCourse, college_id: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="">-- Choose a College --</option>
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city}, {c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.course_name}
                    onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science & AI"
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={newCourse.specialization}
                    onChange={(e) => setNewCourse({ ...newCourse, specialization: e.target.value })}
                    placeholder="e.g. Machine Learning & Cloud"
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Degree Level *</label>
                  <select
                    value={newCourse.degree_level}
                    onChange={(e) => setNewCourse({ ...newCourse, degree_level: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Domain *</label>
                  <select
                    value={newCourse.domain}
                    onChange={(e) => setNewCourse({ ...newCourse, domain: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="IT">IT</option>
                    <option value="Management">Management</option>
                    <option value="IT & Management">IT & Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newCourse.duration_years}
                    onChange={(e) => setNewCourse({ ...newCourse, duration_years: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Total Annual Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newCourse.total_annual_fee}
                    onChange={(e) => setNewCourse({ ...newCourse, total_annual_fee: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Seats Available</label>
                  <input
                    type="number"
                    value={newCourse.seats}
                    onChange={(e) => setNewCourse({ ...newCourse, seats: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Avg Salary (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newCourse.avg_salary_lpa}
                    onChange={(e) => setNewCourse({ ...newCourse, avg_salary_lpa: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Accepted Entrance Exams</label>
                <input
                  type="text"
                  value={newCourse.entrance_exams}
                  onChange={(e) => setNewCourse({ ...newCourse, entrance_exams: e.target.value })}
                  placeholder="e.g. JEE Main, JEE Advanced, GATE, CAT"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-md"
                >
                  Create Course Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto text-slate-100">
            <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-400 tracking-wider">Curriculum Manager</span>
                <h3 className="text-lg font-bold">Edit Course: {editingCourse.course_name}</h3>
              </div>
              <button 
                onClick={() => setEditingCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.course_name || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, course_name: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={editingCourse.specialization || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, specialization: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Degree Level *</label>
                  <select
                    value={editingCourse.degree_level || 'Undergraduate'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, degree_level: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Domain *</label>
                  <select
                    value={editingCourse.domain || 'IT'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, domain: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="IT">IT</option>
                    <option value="Management">Management</option>
                    <option value="IT & Management">IT & Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingCourse.duration_years || 4}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration_years: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Total Annual Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingCourse.total_annual_fee || 0}
                    onChange={(e) => setEditingCourse({ ...editingCourse, total_annual_fee: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Seats Available</label>
                  <input
                    type="number"
                    value={editingCourse.seats || 60}
                    onChange={(e) => setEditingCourse({ ...editingCourse, seats: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Avg Salary (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingCourse.avg_salary_lpa || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, avg_salary_lpa: e.target.value })}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Entrance Exams</label>
                <input
                  type="text"
                  value={editingCourse.entrance_exams || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, entrance_exams: e.target.value })}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-md"
                >
                  Save Course Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
