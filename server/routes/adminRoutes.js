const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// All admin routes require valid admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/metrics - Admin dashboard summary
router.get('/metrics', (req, res) => {
  try {
    const totalColleges = db.prepare('SELECT COUNT(*) as count FROM colleges').get().count;
    const totalCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalInquiries = db.prepare('SELECT COUNT(*) as count FROM inquiries').get().count;
    const pendingInquiries = db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'pending'").get().count;

    const recentInquiries = db.prepare(`
      SELECT i.*, c.name as college_name
      FROM inquiries i
      LEFT JOIN colleges c ON i.college_id = c.id
      ORDER BY i.created_at DESC
      LIMIT 10
    `).all();

    res.json({
      totalColleges,
      totalCourses,
      totalUsers,
      totalInquiries,
      pendingInquiries,
      recentInquiries
    });
  } catch (err) {
    console.error('Admin metrics error:', err);
    res.status(500).json({ error: 'Failed to retrieve admin metrics' });
  }
});

// GET /api/admin/inquiries - List all inquiries
router.get('/inquiries', (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT i.*, c.name as college_name, c.city as college_city
      FROM inquiries i
      LEFT JOIN colleges c ON i.college_id = c.id
    `;
    const params = [];

    if (status && status !== 'all') {
      sql += ' WHERE i.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY i.created_at DESC';

    const inquiries = db.prepare(sql).all(...params);
    res.json(inquiries);
  } catch (err) {
    console.error('Admin inquiries error:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// PATCH /api/admin/inquiries/:id - Update inquiry status
router.patch('/inquiries/:id', (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true, message: `Inquiry status changed to ${status}` });
  } catch (err) {
    console.error('Update inquiry error:', err);
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

// POST /api/admin/colleges - Create a new College record
router.post('/colleges', (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.city || !data.state || !data.contact_number || !data.email) {
      return res.status(400).json({ error: 'Name, City, State, Contact Number, and Email are mandatory fields.' });
    }

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const insert = db.prepare(`
      INSERT INTO colleges (
        name, short_name, slug, category, institution_type, established_year,
        city, state, pincode, address, contact_number, admission_helpline,
        email, website, nirf_rank_2024, naac_grade, aicte_approved, ugc_approved,
        campus_area_acres, avg_package_lpa, highest_package_lpa, median_package_lpa,
        min_annual_fee, max_annual_fee, rating, description, logo_url, banner_url,
        hostel_available, wifi_campus, is_featured
      ) VALUES (
        @name, @short_name, @slug, @category, @institution_type, @established_year,
        @city, @state, @pincode, @address, @contact_number, @admission_helpline,
        @email, @website, @nirf_rank_2024, @naac_grade, @aicte_approved, @ugc_approved,
        @campus_area_acres, @avg_package_lpa, @highest_package_lpa, @median_package_lpa,
        @min_annual_fee, @max_annual_fee, @rating, @description, @logo_url, @banner_url,
        @hostel_available, @wifi_campus, @is_featured
      )
    `);

    const result = insert.run({
      name: data.name,
      short_name: data.short_name || data.name,
      slug,
      category: data.category || 'Both',
      institution_type: data.institution_type || 'State University',
      established_year: Number(data.established_year) || 2000,
      city: data.city,
      state: data.state,
      pincode: data.pincode || '',
      address: data.address || `${data.city}, ${data.state}`,
      contact_number: data.contact_number,
      admission_helpline: data.admission_helpline || data.contact_number,
      email: data.email,
      website: data.website || 'https://',
      nirf_rank_2024: data.nirf_rank_2024 ? Number(data.nirf_rank_2024) : null,
      naac_grade: data.naac_grade || 'A',
      aicte_approved: data.aicte_approved ? 1 : 0,
      ugc_approved: data.ugc_approved ? 1 : 0,
      campus_area_acres: Number(data.campus_area_acres) || 25,
      avg_package_lpa: Number(data.avg_package_lpa) || 8.0,
      highest_package_lpa: Number(data.highest_package_lpa) || 20.0,
      median_package_lpa: Number(data.median_package_lpa) || 7.0,
      min_annual_fee: Number(data.min_annual_fee) || 100000,
      max_annual_fee: Number(data.max_annual_fee) || 250000,
      rating: 4.5,
      description: data.description || 'Verified IT & Management College in India.',
      logo_url: data.logo_url || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80',
      banner_url: data.banner_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      hostel_available: data.hostel_available ? 1 : 0,
      wifi_campus: data.wifi_campus ? 1 : 0,
      is_featured: data.is_featured ? 1 : 0
    });

    res.status(201).json({
      success: true,
      message: 'College created successfully',
      collegeId: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Create college error:', err);
    res.status(500).json({ error: 'Failed to create college: ' + err.message });
  }
});

// PUT /api/admin/colleges/:id - Update existing college
router.put('/colleges/:id', (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.city || !data.state || !data.contact_number || !data.email) {
      return res.status(400).json({ error: 'Name, City, State, Contact Number, and Email are mandatory fields.' });
    }

    const update = db.prepare(`
      UPDATE colleges SET
        name = @name,
        short_name = @short_name,
        category = @category,
        institution_type = @institution_type,
        established_year = @established_year,
        city = @city,
        state = @state,
        pincode = @pincode,
        address = @address,
        contact_number = @contact_number,
        admission_helpline = @admission_helpline,
        email = @email,
        website = @website,
        nirf_rank_2024 = @nirf_rank_2024,
        naac_grade = @naac_grade,
        aicte_approved = @aicte_approved,
        ugc_approved = @ugc_approved,
        campus_area_acres = @campus_area_acres,
        avg_package_lpa = @avg_package_lpa,
        highest_package_lpa = @highest_package_lpa,
        median_package_lpa = @median_package_lpa,
        min_annual_fee = @min_annual_fee,
        max_annual_fee = @max_annual_fee,
        description = @description,
        logo_url = @logo_url,
        banner_url = @banner_url,
        hostel_available = @hostel_available,
        wifi_campus = @wifi_campus,
        is_featured = @is_featured
      WHERE id = @id
    `);

    update.run({
      id: req.params.id,
      name: data.name,
      short_name: data.short_name || data.name,
      category: data.category || 'Both',
      institution_type: data.institution_type || 'State University',
      established_year: Number(data.established_year) || 2000,
      city: data.city,
      state: data.state,
      pincode: data.pincode || '',
      address: data.address || `${data.city}, ${data.state}`,
      contact_number: data.contact_number,
      admission_helpline: data.admission_helpline || data.contact_number,
      email: data.email,
      website: data.website || 'https://',
      nirf_rank_2024: data.nirf_rank_2024 ? Number(data.nirf_rank_2024) : null,
      naac_grade: data.naac_grade || 'A',
      aicte_approved: data.aicte_approved ? 1 : 0,
      ugc_approved: data.ugc_approved ? 1 : 0,
      campus_area_acres: Number(data.campus_area_acres) || 25,
      avg_package_lpa: Number(data.avg_package_lpa) || 8.0,
      highest_package_lpa: Number(data.highest_package_lpa) || 20.0,
      median_package_lpa: Number(data.median_package_lpa) || 7.0,
      min_annual_fee: Number(data.min_annual_fee) || 100000,
      max_annual_fee: Number(data.max_annual_fee) || 250000,
      description: data.description || 'Verified IT & Management College in India.',
      logo_url: data.logo_url || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80',
      banner_url: data.banner_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      hostel_available: data.hostel_available ? 1 : 0,
      wifi_campus: data.wifi_campus ? 1 : 0,
      is_featured: data.is_featured ? 1 : 0
    });

    res.json({ success: true, message: 'College updated successfully' });
  } catch (err) {
    console.error('Update college error:', err);
    res.status(500).json({ error: 'Failed to update college: ' + err.message });
  }
});

// DELETE /api/admin/colleges/:id - Delete college
router.delete('/colleges/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM colleges WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'College and associated data removed.' });
  } catch (err) {
    console.error('Delete college error:', err);
    res.status(500).json({ error: 'Failed to delete college' });
  }
});

// GET /api/admin/courses - List all courses with college details for administration
router.get('/courses', (req, res) => {
  try {
    const { college_id, search } = req.query;
    let sql = `
      SELECT cr.*, c.name as college_name, c.short_name as college_short_name, c.city as college_city
      FROM courses cr
      JOIN colleges c ON cr.college_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (college_id) {
      conditions.push('cr.college_id = ?');
      params.push(college_id);
    }

    if (search && search.trim()) {
      conditions.push('(cr.course_name LIKE ? OR c.name LIKE ? OR cr.specialization LIKE ?)');
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ' ORDER BY cr.id DESC';

    const courses = db.prepare(sql).all(...params);
    res.json(courses);
  } catch (err) {
    console.error('Admin fetch courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// POST /api/admin/colleges/:id/courses - Add course to a college
router.post('/colleges/:id/courses', (req, res) => {
  try {
    const { course_name, degree_level, domain, duration_years, total_annual_fee, seats, eligibility, entrance_exams, specialization, avg_salary_lpa } = req.body;

    if (!course_name || !degree_level || !domain || !total_annual_fee) {
      return res.status(400).json({ error: 'Course name, degree level, domain, and fee are required.' });
    }

    const insert = db.prepare(`
      INSERT INTO courses (
        college_id, course_name, degree_level, domain, duration_years,
        total_annual_fee, seats, eligibility, entrance_exams, specialization, avg_salary_lpa
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      req.params.id,
      course_name,
      degree_level,
      domain,
      Number(duration_years) || 4,
      Number(total_annual_fee),
      seats ? Number(seats) : 60,
      eligibility || '',
      entrance_exams || '',
      specialization || '',
      avg_salary_lpa ? Number(avg_salary_lpa) : null
    );

    res.status(201).json({ success: true, message: 'Course added to institution.' });
  } catch (err) {
    console.error('Add course error:', err);
    res.status(500).json({ error: 'Failed to add course.' });
  }
});

// PUT /api/admin/courses/:id - Edit course
router.put('/courses/:id', (req, res) => {
  try {
    const { college_id, course_name, degree_level, domain, duration_years, total_annual_fee, seats, eligibility, entrance_exams, specialization, avg_salary_lpa } = req.body;

    if (!course_name || !degree_level || !domain || !total_annual_fee) {
      return res.status(400).json({ error: 'Course name, degree level, domain, and fee are required.' });
    }

    const update = db.prepare(`
      UPDATE courses SET
        college_id = COALESCE(?, college_id),
        course_name = ?,
        degree_level = ?,
        domain = ?,
        duration_years = ?,
        total_annual_fee = ?,
        seats = ?,
        eligibility = ?,
        entrance_exams = ?,
        specialization = ?,
        avg_salary_lpa = ?
      WHERE id = ?
    `);

    update.run(
      college_id ? Number(college_id) : null,
      course_name,
      degree_level,
      domain,
      Number(duration_years) || 4,
      Number(total_annual_fee),
      seats ? Number(seats) : 60,
      eligibility || '',
      entrance_exams || '',
      specialization || '',
      avg_salary_lpa ? Number(avg_salary_lpa) : null,
      req.params.id
    );

    res.json({ success: true, message: 'Course updated successfully.' });
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ error: 'Failed to update course.' });
  }
});

// DELETE /api/admin/courses/:id - Delete course
router.delete('/courses/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ error: 'Failed to delete course.' });
  }
});

module.exports = router;
