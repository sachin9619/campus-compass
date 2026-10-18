const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { authenticateToken, optionalToken } = require('../middleware/authMiddleware');

// POST /api/inquiries - Submit an inquiry or counseling booking
router.post('/', optionalToken, (req, res) => {
  try {
    const {
      college_id,
      student_name,
      student_email,
      student_phone,
      city,
      interested_stream,
      interested_course,
      message,
      type = 'inquiry' // 'inquiry', 'counseling_booking', 'brochure_request'
    } = req.body;

    if (!student_name || !student_email || !student_phone) {
      return res.status(400).json({ error: 'Name, email, and contact number are required.' });
    }

    const insert = db.prepare(`
      INSERT INTO inquiries (
        college_id, student_name, student_email, student_phone,
        city, interested_stream, interested_course, message, type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    const result = insert.run(
      college_id || null,
      student_name.trim(),
      student_email.trim().toLowerCase(),
      student_phone.trim(),
      city || '',
      interested_stream || 'Both',
      interested_course || '',
      message || '',
      type
    );

    res.status(201).json({
      success: true,
      message: 'Your inquiry/counseling request has been registered. An academic counselor will connect with you with verified information.',
      inquiryId: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Inquiry submission error:', err);
    res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' });
  }
});

// GET /api/inquiries/my - Fetch inquiries made by current student
router.get('/my', authenticateToken, (req, res) => {
  try {
    const userEmail = req.user.email;
    const inquiries = db.prepare(`
      SELECT i.*, c.name as college_name, c.slug as college_slug, c.city as college_city
      FROM inquiries i
      LEFT JOIN colleges c ON i.college_id = c.id
      WHERE i.student_email = ?
      ORDER BY i.created_at DESC
    `).all(userEmail);

    res.json(inquiries);
  } catch (err) {
    console.error('My inquiries error:', err);
    res.status(500).json({ error: 'Failed to retrieve your inquiries.' });
  }
});

module.exports = router;
