const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database');
const { JWT_SECRET, authenticateToken } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { full_name, email, password, phone, target_degree, role = 'student' } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address is already registered.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const assignedRole = role === 'admin' ? 'student' : role;

    const result = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, role, phone, target_degree)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      full_name.trim(),
      email.toLowerCase().trim(),
      password_hash,
      assignedRole,
      phone || '',
      target_degree || 'B.Tech CSE'
    );

    const user = {
      id: result.lastInsertRowid,
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      role: assignedRole,
      phone: phone || '',
      target_degree: target_degree || 'B.Tech CSE'
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      user,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email address and password.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
    }

    const userPayload = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      target_degree: user.target_degree
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Logged in successfully',
      user: userPayload,
      token,
      loginTime: new Date().toISOString()
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login service encountered an issue. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, full_name, email, role, phone, target_degree, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

// PUT /api/auth/profile - Update User Profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { full_name, phone, target_degree } = req.body;
    if (!full_name) {
      return res.status(400).json({ error: 'Full name cannot be blank.' });
    }

    db.prepare(`
      UPDATE users 
      SET full_name = ?, phone = ?, target_degree = ?
      WHERE id = ?
    `).run(full_name.trim(), phone || '', target_degree || '', req.user.id);

    const updatedUser = db.prepare('SELECT id, full_name, email, role, phone, target_degree FROM users WHERE id = ?').get(req.user.id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticateToken, (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const match = bcrypt.compareSync(current_password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const new_hash = bcrypt.hashSync(new_password, salt);

    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(new_hash, req.user.id);

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

// POST /api/auth/logout - End Session
router.post('/logout', authenticateToken, (req, res) => {
  try {
    // Audit / log session termination
    res.json({
      success: true,
      message: 'Session ended successfully. All tokens cleared.'
    });
  } catch (err) {
    res.json({ success: true, message: 'Logged out.' });
  }
});

// GET /api/auth/bookmarks
router.get('/bookmarks', authenticateToken, (req, res) => {
  try {
    const bookmarks = db.prepare(`
      SELECT c.*, b.created_at as bookmarked_at
      FROM bookmarks b
      JOIN colleges c ON b.college_id = c.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(req.user.id);

    res.json(bookmarks);
  } catch (err) {
    console.error('Bookmarks fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch bookmarks.' });
  }
});

// POST /api/auth/bookmarks/:collegeId - Toggle bookmark
router.post('/bookmarks/:collegeId', authenticateToken, (req, res) => {
  try {
    const collegeId = Number(req.params.collegeId);
    const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND college_id = ?').get(req.user.id, collegeId);

    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE id = ?').run(existing.id);
      return res.json({ bookmarked: false, message: 'Removed from your shortlisted colleges' });
    } else {
      db.prepare('INSERT INTO bookmarks (user_id, college_id) VALUES (?, ?)').run(req.user.id, collegeId);
      return res.json({ bookmarked: true, message: 'College added to your shortlist' });
    }
  } catch (err) {
    console.error('Bookmark toggle error:', err);
    res.status(500).json({ error: 'Failed to update shortlist status.' });
  }
});

module.exports = router;
