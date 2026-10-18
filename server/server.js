const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initSchema } = require('./database');
const collegeRoutes = require('./routes/collegeRoutes');
const courseRoutes = require('./routes/courseRoutes');
const compareRoutes = require('./routes/compareRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize schema on boot
initSchema();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'CampusCompass India - Cloud Counselage GPI Project',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build in production if available
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Fallback to client index.html for SPA routing or info page
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>CampusCompass API</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; text-align: center; background: #0f172a; color: #f8fafc; }
            .card { background: #1e293b; max-width: 600px; margin: 40px auto; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            h1 { color: #38bdf8; }
            a { color: #38bdf8; text-decoration: none; font-weight: 600; }
            .badge { display: inline-block; background: #0284c7; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">Cloud Counselage - GPI Problem Statement</span>
            <h1>CampusCompass API Server</h1>
            <p>The backend API server is running successfully on port ${PORT}.</p>
            <p><a href="/api/colleges">Browse Colleges API &rarr;</a></p>
            <p><a href="/api/colleges/stats">Platform Stats API &rarr;</a></p>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error occurred', details: err.message });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CampusCompass Server running on http://localhost:${PORT}`);
  console.log(`🎓 Cloud Counselage GPI College Discovery & Counseling Platform`);
  console.log(`=======================================================`);
});
