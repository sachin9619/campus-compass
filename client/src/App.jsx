import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterSidebar from './components/FilterSidebar';
import CollegeCard from './components/CollegeCard';
import CollegeDetailModal from './components/CollegeDetailModal';
import CompareDock from './components/CompareDock';
import CompareModal from './components/CompareModal';
import CounselingModal from './components/CounselingModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import CourseCatalog from './components/CourseCatalog';
import MyApplications from './components/MyApplications';
import ProfileModal from './components/ProfileModal';
import SessionEndModal from './components/SessionEndModal';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
import { 
  Search, SlidersHorizontal, LayoutGrid, List, Sparkles, 
  ChevronLeft, ChevronRight, Bookmark, ArrowRight, ShieldCheck, ShieldAlert, 
  HelpCircle, Scale, GraduationCap, CheckCircle2, AlertCircle, Filter, X 
} from 'lucide-react';
import { apiRequest } from './services/api';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('cc_token') || '');

  // Navigation tab: 'discover', 'courses', 'bookmarks', 'applications', 'admin'
  const [activeTab, setActiveTab] = useState('discover');

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [minPackage, setMinPackage] = useState('');
  const [selectedNaac, setSelectedNaac] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data State
  const [colleges, setColleges] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [stats, setStats] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(false);

  // College Detail Modal
  const [selectedCollegeSlug, setSelectedCollegeSlug] = useState(null);
  const [collegeDetail, setCollegeDetail] = useState(null);

  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [allCollegesList, setAllCollegesList] = useState([]);

  // Modals & Real Session States
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);
  const [counselingTargetCollege, setCounselingTargetCollege] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSessionEndModalOpen, setIsSessionEndModalOpen] = useState(false);
  const [sessionEndReason, setSessionEndReason] = useState('manual');

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Active filters count
  const activeFiltersCount = [
    selectedState,
    selectedCity,
    selectedType,
    selectedDegree,
    maxFee,
    minPackage,
    selectedNaac
  ].filter(Boolean).length;

  // Bookmarks / Shortlist
  const [bookmarkedColleges, setBookmarkedColleges] = useState([]);

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchFilterOptions();
    fetchAllColleges();
  }, []);

  const fetchAllColleges = async () => {
    try {
      const { data } = await apiRequest('/api/colleges/all-names');
      if (Array.isArray(data)) setAllCollegesList(data);
    } catch (err) {
      console.error('Failed to load all colleges list', err);
    }
  };

  // Fetch colleges on criteria changes
  useEffect(() => {
    if (activeTab === 'discover') {
      fetchColleges();
    }
  }, [
    category, selectedState, selectedCity, selectedType, 
    selectedDegree, maxFee, minPackage, selectedNaac, sortBy, page, activeTab
  ]);

  // Fetch bookmarks
  useEffect(() => {
    if (activeTab === 'bookmarks' && token) {
      fetchBookmarks();
    }
  }, [activeTab, token]);

  const fetchStats = async () => {
    try {
      const { data } = await apiRequest('/api/colleges/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const { data } = await apiRequest('/api/colleges/filters');
      setFilterOptions(data);
    } catch (err) {
      console.error('Failed to load filters', err);
    }
  };

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (category !== 'All') params.append('category', category);
      if (selectedState) params.append('state', selectedState);
      if (selectedCity) params.append('city', selectedCity);
      if (selectedType) params.append('type', selectedType);
      if (selectedDegree) params.append('degree', selectedDegree);
      if (maxFee) params.append('max_fee', maxFee);
      if (minPackage) params.append('min_package', minPackage);
      if (selectedNaac) params.append('naac', selectedNaac);
      if (sortBy) params.append('sort', sortBy);
      params.append('page', page);
      params.append('limit', 9);

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const result = await apiRequest(`/api/colleges?${params.toString()}`, { headers });
      if (result.status === 401 && token) {
        handleSessionExpired();
        return;
      }
      const data = result.data;
      setColleges(data.colleges || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load colleges', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const result = await apiRequest('/api/auth/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (result.status === 401) {
        handleSessionExpired();
        return;
      }
      setBookmarkedColleges(result.data);
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    }
  };

  const handleSelectCollege = async (slug) => {
    setSelectedCollegeSlug(slug);
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const { data } = await apiRequest(`/api/colleges/${slug}`, { headers });
      setCollegeDetail(data);
    } catch (err) {
      console.error('Failed to load college detail', err);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setSelectedState('');
    setSelectedCity('');
    setSelectedType('');
    setSelectedDegree('');
    setMaxFee('');
    setMinPackage('');
    setSelectedNaac('');
    setSortBy('recommended');
    setPage(1);
    showToast('Filters reset to default');
  };

  // Compare Handler
  const handleToggleCompare = (college) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.id === college.id);
      if (exists) {
        showToast(`Removed ${college.short_name || college.name} from comparison`);
        return prev.filter(c => c.id !== college.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 colleges at a time.');
          return prev;
        }
        showToast(`Added ${college.short_name || college.name} to comparison matrix`);
        return [...prev, college];
      }
    });
  };

  // Bookmark Handler
  const handleToggleBookmark = async (college) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const result = await apiRequest(`/api/auth/bookmarks/${college.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (result.status === 401) {
        handleSessionExpired();
        return;
      }
      const data = result.data;

      setColleges(prev => prev.map(c => c.id === college.id ? { ...c, is_bookmarked: data.bookmarked } : c));
      if (collegeDetail && collegeDetail.id === college.id) {
        setCollegeDetail(prev => ({ ...prev, is_bookmarked: data.bookmarked }));
      }
      if (activeTab === 'bookmarks') {
        fetchBookmarks();
      }
      showToast(data.message);
    } catch (err) {
      console.error('Bookmark error', err);
    }
  };

  // Login Handler
  const handleLogin = async ({ email, password }) => {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = result.data;
    if (!result.ok) throw new Error(data.error);

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('cc_user', JSON.stringify(data.user));
    localStorage.setItem('cc_token', data.token);
    if (data.user.role === 'admin') {
      setActiveTab('admin');
    }
    showToast(`Welcome back, ${data.user.full_name}! Session started.`);
  };

  // Register Handler
  const handleRegister = async (formPayload) => {
    const result = await apiRequest('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPayload)
    });
    const data = result.data;
    if (!result.ok) throw new Error(data.error);

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('cc_user', JSON.stringify(data.user));
    localStorage.setItem('cc_token', data.token);
    showToast('Student profile created successfully!');
  };

  // Session Termination Handler
  const handleEndSession = async () => {
    try {
      if (token) {
        await apiRequest('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {
      // Ignore network errors on logout
    }

    setUser(null);
    setToken('');
    localStorage.removeItem('cc_user');
    localStorage.removeItem('cc_token');
    setActiveTab('discover');
    setSessionEndReason('manual');
    setIsSessionEndModalOpen(true);
  };

  // Session Timeout / 401 Handler
  const handleSessionExpired = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('cc_user');
    localStorage.removeItem('cc_token');
    setActiveTab('discover');
    setSessionEndReason('expired');
    setIsSessionEndModalOpen(true);
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('cc_user', JSON.stringify(updatedUser));
  };

  const handleInquirySubmit = async (inquiryData) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const result = await apiRequest('/api/inquiries', {
      method: 'POST',
      headers,
      body: JSON.stringify(inquiryData)
    });
    const data = result.data;
    if (!result.ok) throw new Error(data.error);

    showToast('Counseling request registered successfully!');
    return data;
  };

  const handleReviewSubmit = async (reviewData) => {
    const result = await apiRequest('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    if (result.status === 401) {
      handleSessionExpired();
      throw new Error('Your session has ended. Please log in again.');
    }
    const data = result.data;
    if (!result.ok) throw new Error(data.error);

    if (selectedCollegeSlug) {
      handleSelectCollege(selectedCollegeSlug);
    }
    showToast('Verified student review submitted!');
    return data;
  };

  // Pure Dedicated Admin Console (Standalone, contains only tools required by admin)
  if (activeTab === 'admin' && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {toast && (
          <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 border border-slate-700 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{toast.message}</span>
            </div>
          </div>
        )}

        <AdminDashboard
          user={user}
          token={token}
          onExitAdmin={() => setActiveTab('discover')}
          onLogout={handleEndSession}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-18 sm:top-20 right-3 sm:right-4 left-3 sm:left-auto z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 border border-slate-700 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Admin Mode Floating Strip when Administrator is previewing the student website */}
      {user?.role === 'admin' && (
        <div className="bg-purple-950 text-purple-200 px-3 sm:px-6 py-2 border-b border-purple-800 flex items-center justify-between text-xs sticky top-0 z-40 shadow-sm">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-extrabold text-white">Administrator Preview Mode</span>
            <span className="hidden sm:inline text-purple-300">• Viewing public website as Administrator</span>
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer shrink-0"
          >
            <span>Return to Admin Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onEndSession={handleEndSession}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        compareCount={compareList.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenCounseling={() => {
          setCounselingTargetCollege(null);
          setIsCounselingModalOpen(true);
        }}
        onOpenContact={() => setIsContactModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkedCount={bookmarkedColleges.length}
      />

      {/* Hero Banner (Only on Discover Colleges tab) */}
      {activeTab === 'discover' && (
        <Hero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          onSearch={() => { setPage(1); fetchColleges(); }}
          stats={stats}
          onSelectCity={(city) => {
            setSelectedCity(city);
            setPage(1);
          }}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 pb-20 md:pb-6">
        
        {/* TAB 1: DISCOVER COLLEGES */}
        {activeTab === 'discover' && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
            
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              
              {/* Desktop Left Column: Persistent Facet Filters */}
              <div className="hidden lg:block w-72 shrink-0">
                <FilterSidebar
                  filterOptions={filterOptions}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedDegree={selectedDegree}
                  setSelectedDegree={setSelectedDegree}
                  maxFee={maxFee}
                  setMaxFee={setMaxFee}
                  minPackage={minPackage}
                  setMinPackage={setMinPackage}
                  selectedNaac={selectedNaac}
                  setSelectedNaac={setSelectedNaac}
                  onResetFilters={handleResetFilters}
                />
              </div>

              {/* Main Content Area: Search Results */}
              <div className="flex-1 space-y-4 sm:space-y-5">
                
                {/* Result header bar with Mobile Filter Trigger */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base sm:text-xl">
                        {pagination.total} Institutions Found
                      </h2>
                      <p className="text-[11px] sm:text-xs text-slate-500">
                        Accurate fees, verified contact numbers & NIRF rankings.
                      </p>
                    </div>

                    {/* Mobile Filter Button */}
                    <button
                      onClick={() => setMobileFilterOpen(true)}
                      className="lg:hidden bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Filters</span>
                      {activeFiltersCount > 0 && (
                        <span className="bg-sky-600 text-white w-4 h-4 rounded-full text-[10px] inline-flex items-center justify-center font-bold">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Sorting & Layout Toggle */}
                  <div className="flex items-center justify-between sm:justify-end space-x-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-600 w-full sm:w-auto">
                      <span className="font-semibold text-[11px] sm:text-xs shrink-0">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:w-auto"
                      >
                        <option value="recommended">Recommended & NIRF</option>
                        <option value="nirf">NIRF Rank (Ascending)</option>
                        <option value="package_desc">Highest Average CTC</option>
                        <option value="rating">Student Rating</option>
                        <option value="fee_asc">Lowest Tuition Fee</option>
                        <option value="fee_desc">Highest Tuition Fee</option>
                        <option value="name_asc">College Name (A-Z)</option>
                      </select>
                    </div>

                    <div className="hidden sm:flex border border-slate-200 rounded-xl p-0.5 bg-slate-50 shrink-0">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-xs text-sky-600' : 'text-slate-400'}`}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-xs text-sky-600' : 'text-slate-400'}`}
                        title="List View"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* College Cards Grid */}
                {loading ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-500">Searching verified database...</p>
                  </div>
                ) : colleges.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3 shadow-xs">
                    <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">No matching colleges found</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                      Try adjusting or clearing your filters like state, fees, or category to see more institutions.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-4 sm:gap-5 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {colleges.map((college) => (
                      <CollegeCard
                        key={college.id}
                        college={college}
                        onSelectCollege={handleSelectCollege}
                        isComparing={compareList.some(c => c.id === college.id)}
                        onToggleCompare={handleToggleCompare}
                        onToggleBookmark={handleToggleBookmark}
                        onOpenCounseling={(col) => {
                          setCounselingTargetCollege(col);
                          setIsCounselingModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-xs flex items-center justify-between">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 border ${
                        page === 1 ? 'border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <span className="text-xs font-semibold text-slate-600">
                      Page <span className="text-slate-900 font-bold">{page}</span> of <span className="text-slate-900 font-bold">{pagination.totalPages}</span>
                    </span>

                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 border ${
                        page === pagination.totalPages ? 'border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: COURSE CATALOG */}
        {activeTab === 'courses' && (
          <CourseCatalog onSelectCollege={handleSelectCollege} />
        )}

        {/* TAB 3: MY APPLICATIONS & COUNSELING REQUESTS */}
        {activeTab === 'applications' && user && (
          <MyApplications
            token={token}
            onSelectCollege={handleSelectCollege}
            onOpenCounseling={(col) => {
              setCounselingTargetCollege(col);
              setIsCounselingModalOpen(true);
            }}
          />
        )}

        {/* TAB 4: BOOKMARKED / SHORTLIST */}
        {activeTab === 'bookmarks' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Shortlisted Colleges</h2>
                <p className="text-xs text-slate-500 mt-1">Colleges saved to your profile for easy comparison and counseling.</p>
              </div>
              <span className="bg-rose-50 text-rose-700 font-extrabold text-sm px-3 py-1 rounded-full border border-rose-200">
                {bookmarkedColleges.length} Shortlisted
              </span>
            </div>

            {bookmarkedColleges.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-extrabold text-slate-800 text-base">Your shortlist is currently empty</h3>
                <p className="text-xs text-slate-500">Click the bookmark icon on any college card to save it here.</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="mt-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition"
                >
                  Discover Colleges
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {bookmarkedColleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={{ ...college, is_bookmarked: true }}
                    onSelectCollege={handleSelectCollege}
                    isComparing={compareList.some(c => c.id === college.id)}
                    onToggleCompare={handleToggleCompare}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenCounseling={(col) => {
                      setCounselingTargetCollege(col);
                      setIsCounselingModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}



      </main>

      {/* MOBILE SLIDE-IN FILTER DRAWER (Bottom Sheet / Modal) */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-5 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-300">
            <FilterSidebar
              filterOptions={filterOptions}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedDegree={selectedDegree}
              setSelectedDegree={setSelectedDegree}
              maxFee={maxFee}
              setMaxFee={setMaxFee}
              minPackage={minPackage}
              setMinPackage={setMinPackage}
              selectedNaac={selectedNaac}
              setSelectedNaac={setSelectedNaac}
              onResetFilters={handleResetFilters}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Compare Dock */}
      <CompareDock
        compareColleges={compareList}
        onRemoveCompare={(id) => setCompareList(prev => prev.filter(c => c.id !== id))}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onClearCompare={() => setCompareList([])}
      />

      {/* College Detail Modal */}
      {selectedCollegeSlug && (
        <CollegeDetailModal
          college={collegeDetail}
          onClose={() => {
            setSelectedCollegeSlug(null);
            setCollegeDetail(null);
          }}
          onToggleBookmark={handleToggleBookmark}
          onToggleCompare={handleToggleCompare}
          isComparing={collegeDetail ? compareList.some(c => c.id === collegeDetail.id) : false}
          onOpenCounseling={(col) => {
            setCounselingTargetCollege(col);
            setIsCounselingModalOpen(true);
          }}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSubmitReview={handleReviewSubmit}
        />
      )}

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <CompareModal
          colleges={compareList}
          allColleges={allCollegesList}
          onClose={() => setIsCompareModalOpen(false)}
          onAddCollege={handleToggleCompare}
          onRemoveCollege={(id) => setCompareList(prev => prev.filter(c => c.id !== id))}
          onClearCompare={() => setCompareList([])}
          onOpenCounseling={(col) => {
            setIsCompareModalOpen(false);
            setCounselingTargetCollege(col);
            setIsCounselingModalOpen(true);
          }}
        />
      )}

      {/* Free Counseling & Inquiry Modal */}
      {isCounselingModalOpen && (
        <CounselingModal
          college={counselingTargetCollege}
          user={user}
          onClose={() => {
            setIsCounselingModalOpen(false);
            setCounselingTargetCollege(null);
          }}
          onSubmitInquiry={handleInquirySubmit}
        />
      )}

      {/* Contact Information & Helplines Desk Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onOpenCounseling={(col) => {
          setIsContactModalOpen(false);
          setCounselingTargetCollege(col);
          setIsCounselingModalOpen(true);
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {/* Profile & Security Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        token={token}
        onProfileUpdated={handleProfileUpdated}
        onNotify={(msg) => showToast(msg)}
      />

      {/* Session End / Expiry Notice Modal */}
      <SessionEndModal
        isOpen={isSessionEndModalOpen}
        onClose={() => setIsSessionEndModalOpen(false)}
        onReLogin={() => {
          setIsSessionEndModalOpen(false);
          setIsAuthModalOpen(true);
        }}
        reason={sessionEndReason}
      />

      {/* Footer */}
      <Footer
        onOpenCounseling={() => {
          setCounselingTargetCollege(null);
          setIsCounselingModalOpen(true);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

    </div>
  );
}
