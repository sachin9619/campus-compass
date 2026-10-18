const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { optionalToken } = require('../middleware/authMiddleware');

// GET /api/colleges/stats - Platform aggregated metrics
router.get('/stats', (req, res) => {
  try {
    const totalColleges = db.prepare('SELECT COUNT(*) as count FROM colleges').get().count;
    const totalCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
    const itColleges = db.prepare("SELECT COUNT(*) as count FROM colleges WHERE category IN ('IT', 'Both')").get().count;
    const mgmtColleges = db.prepare("SELECT COUNT(*) as count FROM colleges WHERE category IN ('Management', 'Both')").get().count;
    const avgSalary = db.prepare('SELECT ROUND(AVG(avg_package_lpa), 1) as avg FROM colleges').get().avg;
    const statesCovered = db.prepare('SELECT COUNT(DISTINCT state) as count FROM colleges').get().count;

    res.json({
      totalColleges,
      totalCourses,
      itColleges,
      mgmtColleges,
      avgSalary,
      statesCovered
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch platform metrics' });
  }
});

// GET /api/colleges/filters - Filter facet options for frontend
router.get('/filters', (req, res) => {
  try {
    const states = db.prepare('SELECT DISTINCT state FROM colleges ORDER BY state ASC').all().map(r => r.state);
    const cities = db.prepare('SELECT DISTINCT city FROM colleges ORDER BY city ASC').all().map(r => r.city);
    const types = db.prepare('SELECT DISTINCT institution_type FROM colleges ORDER BY institution_type ASC').all().map(r => r.institution_type);
    const degrees = db.prepare('SELECT DISTINCT degree_level FROM courses ORDER BY degree_level ASC').all().map(r => r.degree_level);
    const exams = [
      'JEE Advanced', 'JEE Main', 'GATE', 'CAT', 'XAT', 'NMAT by GMAC', 'SNAP', 'BITSAT', 'VITEEE', 'NIMCET', 'MHT-CET'
    ];

    res.json({
      states,
      cities,
      types,
      degrees,
      exams
    });
  } catch (err) {
    console.error('Filters error:', err);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
});

// GET /api/colleges/featured - Spotlight top colleges
router.get('/featured', (req, res) => {
  try {
    const featured = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM courses WHERE college_id = c.id) as total_courses_count
      FROM colleges c
      WHERE c.is_featured = 1
      ORDER BY c.nirf_rank_2024 ASC, c.rating DESC
      LIMIT 6
    `).all();

    res.json(featured);
  } catch (err) {
    console.error('Featured colleges error:', err);
    res.status(500).json({ error: 'Failed to fetch featured institutions' });
  }
});

// GET /api/colleges/all-names - Directory of colleges for selectors and comparison matrix
router.get('/all-names', (req, res) => {
  try {
    const list = db.prepare(`
      SELECT id, name, short_name, slug, category, institution_type, city, state, 
             nirf_rank_2024, avg_package_lpa, highest_package_lpa, min_annual_fee, max_annual_fee, 
             logo_url, naac_grade, contact_number, admission_helpline, email, website,
             hostel_available, wifi_campus, campus_area_acres, rating
      FROM colleges 
      ORDER BY nirf_rank_2024 ASC NULLS LAST, name ASC
    `).all();
    res.json(list);
  } catch (err) {
    console.error('All names error:', err);
    res.status(500).json({ error: 'Failed to fetch college list' });
  }
});

// GET /api/colleges - Main Search & Discovery Endpoint
router.get('/', optionalToken, (req, res) => {
  try {
    const {
      search = '',
      category, // 'IT', 'Management', 'Both'
      type, // 'IIT', 'IIM', etc.
      state,
      city,
      max_fee,
      min_package,
      naac,
      degree,
      sort = 'recommended', // 'nirf', 'rating', 'package_desc', 'fee_asc', 'fee_desc', 'name_asc'
      page = 1,
      limit = 12
    } = req.query;

    const conditions = [];
    const params = [];

    // Full text search in name, short_name, city, state, description, or matching course names
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      conditions.push(`(
        c.name LIKE ? OR 
        c.short_name LIKE ? OR 
        c.city LIKE ? OR 
        c.state LIKE ? OR 
        c.description LIKE ? OR
        EXISTS (SELECT 1 FROM courses cr WHERE cr.college_id = c.id AND (cr.course_name LIKE ? OR cr.specialization LIKE ?))
      )`);
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Category filter: IT, Management, or Both
    if (category && category !== 'All') {
      if (category === 'IT') {
        conditions.push(`(c.category = 'IT' OR c.category = 'Both')`);
      } else if (category === 'Management') {
        conditions.push(`(c.category = 'Management' OR c.category = 'Both')`);
      } else {
        conditions.push(`c.category = ?`);
        params.push(category);
      }
    }

    // Institution Type filter
    if (type && type !== 'All') {
      conditions.push(`c.institution_type = ?`);
      params.push(type);
    }

    // State filter
    if (state && state !== 'All') {
      conditions.push(`c.state = ?`);
      params.push(state);
    }

    // City filter
    if (city && city !== 'All') {
      conditions.push(`c.city = ?`);
      params.push(city);
    }

    // Max Fee filter
    if (max_fee && !isNaN(Number(max_fee))) {
      conditions.push(`c.min_annual_fee <= ?`);
      params.push(Number(max_fee));
    }

    // Min Package filter
    if (min_package && !isNaN(Number(min_package))) {
      conditions.push(`c.avg_package_lpa >= ?`);
      params.push(Number(min_package));
    }

    // NAAC grade
    if (naac && naac !== 'All') {
      conditions.push(`c.naac_grade = ?`);
      params.push(naac);
    }

    // Degree level filter (e.g. Undergraduate, Postgraduate)
    if (degree && degree !== 'All') {
      conditions.push(`EXISTS (SELECT 1 FROM courses cr WHERE cr.college_id = c.id AND cr.degree_level = ?)`);
      params.push(degree);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sort order
    let orderByClause = 'ORDER BY c.nirf_rank_2024 ASC, c.rating DESC';
    switch (sort) {
      case 'nirf':
        orderByClause = 'ORDER BY c.nirf_rank_2024 ASC NULLS LAST';
        break;
      case 'rating':
        orderByClause = 'ORDER BY c.rating DESC';
        break;
      case 'package_desc':
        orderByClause = 'ORDER BY c.avg_package_lpa DESC';
        break;
      case 'fee_asc':
        orderByClause = 'ORDER BY c.min_annual_fee ASC';
        break;
      case 'fee_desc':
        orderByClause = 'ORDER BY c.max_annual_fee DESC';
        break;
      case 'name_asc':
        orderByClause = 'ORDER BY c.name ASC';
        break;
      default:
        orderByClause = 'ORDER BY c.is_featured DESC, c.nirf_rank_2024 ASC, c.avg_package_lpa DESC';
    }

    // Count total matches
    const countSql = `SELECT COUNT(*) as count FROM colleges c ${whereClause}`;
    const totalCount = db.prepare(countSql).get(...params).count;

    // Fetch pagination
    const offset = (Number(page) - 1) * Number(limit);
    const selectSql = `
      SELECT c.*,
        (SELECT COUNT(*) FROM courses WHERE college_id = c.id) as total_courses_count,
        (SELECT GROUP_CONCAT(course_name, ' | ') FROM (SELECT course_name FROM courses WHERE college_id = c.id LIMIT 3)) as top_courses_sample
      FROM colleges c
      ${whereClause}
      ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    const colleges = db.prepare(selectSql).all(...params, Number(limit), offset);

    // If user is logged in, attach is_bookmarked status
    let bookmarkedIds = new Set();
    if (req.user && req.user.id) {
      const bookmarks = db.prepare('SELECT college_id FROM bookmarks WHERE user_id = ?').all(req.user.id);
      bookmarkedIds = new Set(bookmarks.map(b => b.college_id));
    }

    const collegesWithMeta = colleges.map(col => ({
      ...col,
      is_bookmarked: bookmarkedIds.has(col.id)
    }));

    res.json({
      colleges: collegesWithMeta,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (err) {
    console.error('College search error:', err);
    res.status(500).json({ error: 'Failed to retrieve college records' });
  }
});

// GET /api/colleges/:slug - Detailed Profile
router.get('/:slug', optionalToken, (req, res) => {
  try {
    const { slug } = req.params;
    const college = db.prepare('SELECT * FROM colleges WHERE slug = ? OR id = ?').get(slug, slug);

    if (!college) {
      return res.status(404).json({ error: 'College not found in our database' });
    }

    // Fetch all courses
    const courses = db.prepare('SELECT * FROM courses WHERE college_id = ? ORDER BY domain ASC, degree_level ASC').all(college.id);

    // Fetch facilities
    const facilities = db.prepare('SELECT * FROM facilities WHERE college_id = ?').all(college.id);

    // Fetch reviews
    const reviews = db.prepare('SELECT * FROM reviews WHERE college_id = ? ORDER BY created_at DESC').all(college.id);

    // Check bookmark
    let is_bookmarked = false;
    if (req.user && req.user.id) {
      const bk = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND college_id = ?').get(req.user.id, college.id);
      is_bookmarked = !!bk;
    }

    // Similar colleges in same state or category
    const similar = db.prepare(`
      SELECT id, name, short_name, slug, city, state, avg_package_lpa, min_annual_fee, rating, nirf_rank_2024, category, logo_url
      FROM colleges
      WHERE id != ? AND (category = ? OR state = ?)
      ORDER BY rating DESC
      LIMIT 3
    `).all(college.id, college.category, college.state);

    res.json({
      ...college,
      is_bookmarked,
      courses,
      facilities: facilities.map(f => f.facility_name),
      reviews,
      similar
    });
  } catch (err) {
    console.error('College detail error:', err);
    res.status(500).json({ error: 'Failed to fetch college profile' });
  }
});

module.exports = router;
