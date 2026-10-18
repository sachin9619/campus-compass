const express = require('express');
const router = express.Router();
const { db } = require('../database');

// POST /api/compare - Compare 2 to 4 colleges side-by-side
router.post('/', (req, res) => {
  try {
    const { collegeIds } = req.body; // Array of IDs or slugs

    if (!Array.isArray(collegeIds) || collegeIds.length < 2) {
      return res.status(400).json({ error: 'Please select at least 2 colleges to compare.' });
    }

    if (collegeIds.length > 4) {
      return res.status(400).json({ error: 'You can compare a maximum of 4 colleges simultaneously.' });
    }

    const placeholders = collegeIds.map(() => '?').join(',');
    const query = `
      SELECT * FROM colleges
      WHERE id IN (${placeholders}) OR slug IN (${placeholders})
    `;

    const colleges = db.prepare(query).all(...collegeIds, ...collegeIds);

    if (colleges.length < 2) {
      return res.status(404).json({ error: 'Could not find matching colleges for comparison.' });
    }

    // Attach courses count and top courses for each college
    const comparisonData = colleges.map(col => {
      const courses = db.prepare('SELECT course_name, degree_level, domain, total_annual_fee, avg_salary_lpa, entrance_exams FROM courses WHERE college_id = ?').all(col.id);
      const facilities = db.prepare('SELECT facility_name FROM facilities WHERE college_id = ?').all(col.id).map(f => f.facility_name);

      return {
        ...col,
        courses,
        facilities,
        total_courses: courses.length
      };
    });

    res.json({
      colleges: comparisonData
    });
  } catch (err) {
    console.error('Comparison error:', err);
    res.status(500).json({ error: 'Failed to process college comparison.' });
  }
});

module.exports = router;
