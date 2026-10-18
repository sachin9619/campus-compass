const express = require('express');
const router = express.Router();
const { db } = require('../database');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/reviews - Post a genuine student review for a college
router.post('/', authenticateToken, (req, res) => {
  try {
    const { college_id, rating, title, review_text, pros, cons, user_program } = req.body;

    if (!college_id || !rating || !title || !review_text) {
      return res.status(400).json({ error: 'College ID, star rating, title, and review comments are required.' });
    }

    const college = db.prepare('SELECT id, rating, reviews_count FROM colleges WHERE id = ?').get(college_id);
    if (!college) {
      return res.status(404).json({ error: 'College not found.' });
    }

    const insert = db.prepare(`
      INSERT INTO reviews (college_id, user_name, user_program, rating, title, review_text, pros, cons, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    insert.run(
      college_id,
      req.user.full_name || 'Anonymous Student',
      user_program || 'Student',
      Number(rating),
      title.trim(),
      review_text.trim(),
      pros || '',
      cons || ''
    );

    // Recalculate college aggregate rating & review count
    const stats = db.prepare('SELECT AVG(rating) as avg_rat, COUNT(*) as cnt FROM reviews WHERE college_id = ?').get(college_id);
    db.prepare('UPDATE colleges SET rating = ROUND(?, 1), reviews_count = ? WHERE id = ?').run(
      stats.avg_rat || 4.5,
      stats.cnt || 1,
      college_id
    );

    res.status(201).json({
      success: true,
      message: 'Your review has been verified and posted!'
    });
  } catch (err) {
    console.error('Review submit error:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

module.exports = router;
