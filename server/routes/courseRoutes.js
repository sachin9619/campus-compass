const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET /api/courses - Search & filter across courses offered by colleges
router.get('/', (req, res) => {
  try {
    const { domain, degree_level, exam, search } = req.query;
    const conditions = [];
    const params = [];

    if (domain && domain !== 'All') {
      conditions.push('cr.domain LIKE ?');
      params.push(`%${domain}%`);
    }

    if (degree_level && degree_level !== 'All') {
      conditions.push('cr.degree_level = ?');
      params.push(degree_level);
    }

    if (exam && exam !== 'All') {
      conditions.push('cr.entrance_exams LIKE ?');
      params.push(`%${exam}%`);
    }

    if (search && search.trim()) {
      conditions.push('(cr.course_name LIKE ? OR cr.specialization LIKE ? OR c.name LIKE ?)');
      params.push(`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT cr.*, 
        c.name as college_name, 
        c.short_name as college_short_name,
        c.slug as college_slug, 
        c.city as college_city, 
        c.state as college_state,
        c.nirf_rank_2024 as college_nirf,
        c.logo_url as college_logo
      FROM courses cr
      JOIN colleges c ON cr.college_id = c.id
      ${whereClause}
      ORDER BY cr.avg_salary_lpa DESC NULLS LAST
      LIMIT 50
    `;

    const courses = db.prepare(query).all(...params);
    res.json(courses);
  } catch (err) {
    console.error('Courses fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve course offerings.' });
  }
});

module.exports = router;
