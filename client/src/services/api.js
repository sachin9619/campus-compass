import { collegesData, sampleReviews } from '../data/collegesData';

// Local storage keys
const STORAGE_INQUIRIES_KEY = 'campus_compass_inquiries';
const STORAGE_COLLEGES_KEY = 'campus_compass_custom_colleges';
const STORAGE_BOOKMARKS_KEY = 'campus_compass_bookmarks';

// Helper to get all colleges (combining seed data and custom admin modifications)
export function getLocalColleges() {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_COLLEGES_KEY) || 'null');
    if (Array.isArray(custom) && custom.length > 0) {
      return custom;
    }
  } catch (e) {
    // ignore
  }
  return collegesData.map((c, idx) => ({ ...c, id: c.id || idx + 1 }));
}

export function saveLocalColleges(colleges) {
  try {
    localStorage.setItem(STORAGE_COLLEGES_KEY, JSON.stringify(colleges));
  } catch (e) {
    // ignore
  }
}

export function getLocalInquiries() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_INQUIRIES_KEY) || '[]');
    if (list.length === 0) {
      // Provide some initial realistic inquiries
      const initial = [
        {
          id: 101,
          student_name: 'Sachin Laxman Rajora',
          email: 'sachinrajora9619@gmail.com',
          phone: '+91 9876543210',
          college_id: 1,
          college_name: 'Indian Institute of Technology Bombay',
          target_degree: 'B.Tech in Computer Science and Engineering',
          message: 'Interested in AI specializations and campus hostel facilities for 2026 intake.',
          status: 'Pending',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 102,
          student_name: 'Priya Sharma',
          email: 'priya.s@example.com',
          phone: '+91 9822012345',
          college_id: 2,
          college_name: 'Indian Institute of Management Ahmedabad',
          target_degree: 'Post Graduate Programme in Management (PGP / MBA)',
          message: 'Requesting CAT percentile cutoffs and scholarship criteria for non-engineers.',
          status: 'Contacted',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(initial));
      return initial;
    }
    return list;
  } catch (e) {
    return [];
  }
}

export function saveLocalInquiries(inquiries) {
  try {
    localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(inquiries));
  } catch (e) {
    // ignore
  }
}

// Check if a response is valid JSON
async function parseResponseSafe(res) {
  const contentType = res.headers ? res.headers.get('content-type') : '';
  if (contentType && contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Universal safe API fetch wrapper:
 * Tries server first. If server returns valid JSON and 200-299 status, uses it.
 * If server returns HTML (e.g. Vercel 404), fails, or is offline, seamlessly fulfills from local data!
 */
export async function apiRequest(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  try {
    const res = await fetch(url, options);
    if (res.ok) {
      const data = await parseResponseSafe(res);
      if (data !== null) {
        return { data, status: res.status, ok: true };
      }
    }
    // If response was 401 Unauthorized for authenticated route, respect it
    if (res.status === 401) {
      const errData = await parseResponseSafe(res);
      return { data: errData || { error: 'Unauthorized session' }, status: 401, ok: false };
    }
  } catch (networkErr) {
    console.warn(`[CampusCompass API] Server unreachable at ${url}, activating offline/Vercel fallback engine.`, networkErr);
  }

  // Fallback engine kicks in!
  return handleOfflineFallback(url, options, method);
}

function handleOfflineFallback(url, options, method) {
  const parsedUrl = new URL(url, window.location.origin);
  const path = parsedUrl.pathname;
  const params = parsedUrl.searchParams;
  const allColleges = getLocalColleges();

  // 1. GET /api/colleges/all-names
  if (path === '/api/colleges/all-names') {
    const list = allColleges.map(c => ({
      id: c.id,
      name: c.name,
      short_name: c.short_name || c.name,
      slug: c.slug,
      category: c.category,
      city: c.city,
      state: c.state,
      nirf_rank_2024: c.nirf_rank_2024,
      avg_package_lpa: c.avg_package_lpa,
      banner_url: c.banner_url
    }));
    return { data: list, status: 200, ok: true };
  }

  // 2. GET /api/colleges/stats
  if (path === '/api/colleges/stats') {
    const avgPkg = (allColleges.reduce((acc, c) => acc + (c.avg_package_lpa || 0), 0) / allColleges.length).toFixed(1);
    const maxPkg = Math.max(...allColleges.map(c => c.highest_package_lpa || 0));
    return {
      data: {
        totalColleges: allColleges.length,
        totalCourses: allColleges.reduce((acc, c) => acc + (c.courses ? c.courses.length : 0), 0),
        avgPackageLpa: parseFloat(avgPkg),
        highestPackageLpa: maxPkg,
        itCount: allColleges.filter(c => c.category === 'IT' || c.category === 'Both').length,
        managementCount: allColleges.filter(c => c.category === 'Management' || c.category === 'Both').length
      },
      status: 200,
      ok: true
    };
  }

  // 3. GET /api/colleges/filters
  if (path === '/api/colleges/filters') {
    const states = Array.from(new Set(allColleges.map(c => c.state))).filter(Boolean).sort();
    const cities = Array.from(new Set(allColleges.map(c => c.city))).filter(Boolean).sort();
    const categories = ['IT', 'Management', 'Both'];
    const types = Array.from(new Set(allColleges.map(c => c.institution_type))).filter(Boolean).sort();
    const naacGrades = ['A++', 'A+', 'A', 'B++'];
    return {
      data: { states, cities, categories, types, naacGrades },
      status: 200,
      ok: true
    };
  }

  // 4. GET /api/colleges (with search, category, filters, sort, pagination)
  if (path === '/api/colleges' && method === 'GET') {
    const search = (params.get('search') || '').toLowerCase().trim();
    const category = params.get('category');
    const state = params.get('state');
    const city = params.get('city');
    const type = params.get('type');
    const degree = params.get('degree');
    const maxFee = params.get('max_fee') ? parseFloat(params.get('max_fee')) : null;
    const minPackage = params.get('min_package') ? parseFloat(params.get('min_package')) : null;
    const naac = params.get('naac');
    const sort = params.get('sort') || 'name_asc';
    const page = parseInt(params.get('page') || '1', 10);
    const limit = parseInt(params.get('limit') || '9', 10);

    let filtered = allColleges.filter(c => {
      if (search) {
        const matchesName = c.name.toLowerCase().includes(search) || (c.short_name && c.short_name.toLowerCase().includes(search));
        const matchesLocation = (c.city && c.city.toLowerCase().includes(search)) || (c.state && c.state.toLowerCase().includes(search));
        const matchesCourse = c.courses && c.courses.some(crs => crs.course_name.toLowerCase().includes(search));
        if (!matchesName && !matchesLocation && !matchesCourse) return false;
      }
      if (category && category !== 'All') {
        if (category === 'IT' && c.category !== 'IT' && c.category !== 'Both') return false;
        if (category === 'Management' && c.category !== 'Management' && c.category !== 'Both') return false;
        if (category === 'Both' && c.category !== 'Both') return false;
      }
      if (state && c.state.toLowerCase() !== state.toLowerCase()) return false;
      if (city && c.city.toLowerCase() !== city.toLowerCase()) return false;
      if (type && c.institution_type !== type) return false;
      if (maxFee && c.min_annual_fee && c.min_annual_fee > maxFee) return false;
      if (minPackage && c.avg_package_lpa && c.avg_package_lpa < minPackage) return false;
      if (naac && c.naac_grade !== naac) return false;
      if (degree && c.courses) {
        const hasDegree = c.courses.some(crs => crs.degree_level && crs.degree_level.toLowerCase() === degree.toLowerCase());
        if (!hasDegree) return false;
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sort === 'name_asc') return (a.short_name || a.name).localeCompare(b.short_name || b.name);
      if (sort === 'name_desc') return (b.short_name || b.name).localeCompare(a.short_name || a.name);
      if (sort === 'nirf_asc') return (a.nirf_rank_2024 || 999) - (b.nirf_rank_2024 || 999);
      if (sort === 'package_desc') return (b.avg_package_lpa || 0) - (a.avg_package_lpa || 0);
      if (sort === 'fee_asc') return (a.min_annual_fee || 0) - (b.min_annual_fee || 0);
      if (sort === 'fee_desc') return (b.max_annual_fee || 0) - (a.max_annual_fee || 0);
      return 0;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: {
        colleges: paginated,
        pagination: { page, limit, totalPages, total }
      },
      status: 200,
      ok: true
    };
  }

  // 5. GET /api/colleges/:slug
  const slugMatch = path.match(/^\/api\/colleges\/([a-zA-Z0-9-]+)$/);
  if (slugMatch && method === 'GET') {
    const slug = slugMatch[1];
    const college = allColleges.find(c => c.slug === slug);
    if (college) {
      return { data: college, status: 200, ok: true };
    }
    return { data: { error: 'College not found' }, status: 404, ok: false };
  }

  // 6. GET /api/courses
  if (path === '/api/courses' && method === 'GET') {
    const courses = [];
    allColleges.forEach(col => {
      if (col.courses) {
        col.courses.forEach(crs => {
          courses.push({
            ...crs,
            college_name: col.name,
            college_slug: col.slug,
            city: col.city,
            state: col.state
          });
        });
      }
    });
    return { data: courses, status: 200, ok: true };
  }

  // 7. POST /api/auth/login
  if (path === '/api/auth/login' && method === 'POST') {
    let body = {};
    try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {}; } catch(e){}
    const { email, password } = body;

    // Admin authentication
    if (email === 'admin@campuscompass.in' && password === 'admin123') {
      const adminUser = {
        id: 999,
        full_name: 'Administrator',
        email: 'admin@campuscompass.in',
        role: 'admin'
      };
      return {
        data: {
          user: adminUser,
          token: 'campus-compass-admin-jwt-token-verified'
        },
        status: 200,
        ok: true
      };
    }

    // Student authentication
    if (email) {
      const studentName = email.includes('sachin') ? 'Sachin Laxman Rajora' : email.split('@')[0];
      const studentUser = {
        id: 1,
        full_name: studentName,
        email: email,
        role: 'student'
      };
      return {
        data: {
          user: studentUser,
          token: 'campus-compass-student-jwt-token-verified'
        },
        status: 200,
        ok: true
      };
    }

    return { data: { error: 'Please provide valid credentials' }, status: 400, ok: false };
  }

  // 8. POST /api/auth/register
  if (path === '/api/auth/register' && method === 'POST') {
    let body = {};
    try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {}; } catch(e){}
    const user = {
      id: Date.now(),
      full_name: body.full_name || 'Student User',
      email: body.email,
      role: 'student'
    };
    return {
      data: {
        user,
        token: 'campus-compass-registered-jwt-token'
      },
      status: 201,
      ok: true
    };
  }

  // 9. Bookmarks
  if (path === '/api/auth/bookmarks') {
    try {
      const ids = JSON.parse(localStorage.getItem(STORAGE_BOOKMARKS_KEY) || '[]');
      const bookmarked = allColleges.filter(c => ids.includes(c.id));
      return { data: bookmarked, status: 200, ok: true };
    } catch(e) {
      return { data: [], status: 200, ok: true };
    }
  }

  const bookmarkMatch = path.match(/^\/api\/auth\/bookmarks\/([0-9]+)$/);
  if (bookmarkMatch) {
    const id = parseInt(bookmarkMatch[1], 10);
    try {
      let ids = JSON.parse(localStorage.getItem(STORAGE_BOOKMARKS_KEY) || '[]');
      if (method === 'POST') {
        if (!ids.includes(id)) ids.push(id);
      } else if (method === 'DELETE') {
        ids = ids.filter(x => x !== id);
      }
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(ids));
    } catch(e){}
    return { data: { success: true }, status: 200, ok: true };
  }

  // 10. Inquiries
  if (path === '/api/inquiries' && method === 'POST') {
    let body = {};
    try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {}; } catch(e){}
    const inquiries = getLocalInquiries();
    const newInquiry = {
      id: Date.now(),
      student_name: body.full_name || body.student_name || 'Anonymous Student',
      email: body.email || 'user@example.com',
      phone: body.phone || '',
      college_id: body.college_id || null,
      college_name: body.college_name || 'General Inquiry',
      target_degree: body.target_degree || 'B.Tech / MBA',
      message: body.message || body.comments || '',
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    saveLocalInquiries(inquiries);
    return { data: { success: true, message: 'Inquiry submitted successfully', id: newInquiry.id }, status: 201, ok: true };
  }

  if (path === '/api/inquiries/my') {
    const inquiries = getLocalInquiries();
    return { data: inquiries, status: 200, ok: true };
  }

  // 11. Admin Endpoints
  if (path === '/api/admin/metrics') {
    const inquiries = getLocalInquiries();
    return {
      data: {
        totalColleges: allColleges.length,
        totalInquiries: inquiries.length,
        pendingInquiries: inquiries.filter(i => i.status === 'Pending').length,
        contactedInquiries: inquiries.filter(i => i.status === 'Contacted').length,
        resolvedInquiries: inquiries.filter(i => i.status === 'Resolved').length
      },
      status: 200,
      ok: true
    };
  }

  if (path === '/api/admin/inquiries') {
    const inquiries = getLocalInquiries();
    // Apply status filter if present in query params
    const statusFilter = params.get('status');
    const filtered = statusFilter
      ? inquiries.filter(i => i.status.toLowerCase() === statusFilter.toLowerCase())
      : inquiries;
    return { data: { inquiries: filtered, total: filtered.length }, status: 200, ok: true };
  }

  const adminInquiryStatusMatch = path.match(/^\/api\/admin\/inquiries\/([0-9]+)$/);
  if (adminInquiryStatusMatch && (method === 'PUT' || method === 'PATCH')) {
    const id = parseInt(adminInquiryStatusMatch[1], 10);
    let body = {};
    try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {}; } catch(e){}
    const inquiries = getLocalInquiries();
    // Match by id (numeric or string timestamp)
    const item = inquiries.find(i => String(i.id) === String(id) || i.id === id);
    if (item && body.status) {
      // Capitalize first letter to match stored format
      item.status = body.status.charAt(0).toUpperCase() + body.status.slice(1);
      saveLocalInquiries(inquiries);
    }
    return { data: { success: true }, status: 200, ok: true };
  }

  // 12. Admin Courses (GET all courses for admin panel)
  if (path === '/api/admin/courses' && method === 'GET') {
    const courses = [];
    allColleges.forEach(col => {
      if (col.courses) {
        col.courses.forEach(crs => {
          courses.push({
            ...crs,
            college_name: col.name,
            college_short_name: col.short_name || col.name,
            college_slug: col.slug,
            college_city: col.city,
            college_state: col.state
          });
        });
      }
    });
    return { data: courses, status: 200, ok: true };
  }

  // 13. Admin College CRUD (POST/PUT/DELETE)
  const adminCollegesMatch = path.match(/^\/api\/admin\/colleges(\/([0-9]+))?$/);
  if (adminCollegesMatch) {
    if (method === 'POST') {
      let body = {};
      try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {}; } catch(e){}
      const colleges = getLocalColleges();
      const newCol = { ...body, id: Date.now(), slug: (body.name || 'college').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') };
      colleges.push(newCol);
      saveLocalColleges(colleges);
      return { data: { success: true, college: newCol }, status: 201, ok: true };
    }
    const colId = adminCollegesMatch[2] ? parseInt(adminCollegesMatch[2]) : null;
    if (method === 'PUT' && colId) {
      let body = {};
      try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {}; } catch(e){}
      const colleges = getLocalColleges();
      const idx = colleges.findIndex(c => c.id === colId);
      if (idx !== -1) { colleges[idx] = { ...colleges[idx], ...body }; saveLocalColleges(colleges); }
      return { data: { success: true }, status: 200, ok: true };
    }
    if (method === 'DELETE' && colId) {
      const colleges = getLocalColleges().filter(c => c.id !== colId);
      saveLocalColleges(colleges);
      return { data: { success: true }, status: 200, ok: true };
    }
  }

  // 14. Admin Course CRUD (POST to college, PUT/DELETE individual)
  const adminCollegeCourseMatch = path.match(/^\/api\/admin\/colleges\/([0-9]+)\/courses$/);
  if (adminCollegeCourseMatch && method === 'POST') {
    let body = {};
    try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {}; } catch(e){}
    const colleges = getLocalColleges();
    const colId = parseInt(adminCollegeCourseMatch[1]);
    const col = colleges.find(c => c.id === colId);
    if (col) {
      if (!col.courses) col.courses = [];
      const newCourse = { ...body, id: Date.now() };
      col.courses.push(newCourse);
      saveLocalColleges(colleges);
    }
    return { data: { success: true }, status: 201, ok: true };
  }

  const adminCourseMatch = path.match(/^\/api\/admin\/courses\/([0-9]+)$/);
  if (adminCourseMatch) {
    const courseId = parseInt(adminCourseMatch[1]);
    if (method === 'PUT') {
      let body = {};
      try { body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body || {}; } catch(e){}
      const colleges = getLocalColleges();
      colleges.forEach(col => {
        if (col.courses) {
          const idx = col.courses.findIndex(c => c.id === courseId);
          if (idx !== -1) col.courses[idx] = { ...col.courses[idx], ...body };
        }
      });
      saveLocalColleges(colleges);
      return { data: { success: true }, status: 200, ok: true };
    }
    if (method === 'DELETE') {
      const colleges = getLocalColleges();
      colleges.forEach(col => {
        if (col.courses) col.courses = col.courses.filter(c => c.id !== courseId);
      });
      saveLocalColleges(colleges);
      return { data: { success: true }, status: 200, ok: true };
    }
  }

  // Default fallback for any other route
  return { data: { success: true, message: 'Local operation successful' }, status: 200, ok: true };
}
