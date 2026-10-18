const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'campus_compass.db');
const db = new Database(dbPath, {
  // verbose: console.log
});

// Enable foreign keys and WAL mode for better concurrency and performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      phone TEXT,
      target_degree TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS colleges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      short_name TEXT,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL, -- 'IT', 'Management', 'Both'
      institution_type TEXT NOT NULL, -- 'IIT', 'IIM', 'NIT', 'IIIT', 'Central University', 'State University', 'Private', 'Deemed to be University'
      established_year INTEGER,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT,
      address TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      admission_helpline TEXT,
      email TEXT NOT NULL,
      website TEXT NOT NULL,
      nirf_rank_2024 INTEGER,
      naac_grade TEXT, -- 'A++', 'A+', 'A', 'B++', 'NA'
      aicte_approved INTEGER DEFAULT 1,
      ugc_approved INTEGER DEFAULT 1,
      campus_area_acres REAL,
      avg_package_lpa REAL,
      highest_package_lpa REAL,
      median_package_lpa REAL,
      min_annual_fee INTEGER,
      max_annual_fee INTEGER,
      rating REAL DEFAULT 4.5,
      reviews_count INTEGER DEFAULT 0,
      description TEXT,
      logo_url TEXT,
      banner_url TEXT,
      hostel_available INTEGER DEFAULT 1,
      wifi_campus INTEGER DEFAULT 1,
      placement_rating REAL DEFAULT 4.5,
      infrastructure_rating REAL DEFAULT 4.5,
      faculty_rating REAL DEFAULT 4.5,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      college_id INTEGER NOT NULL,
      course_name TEXT NOT NULL,
      degree_level TEXT NOT NULL, -- 'Undergraduate', 'Postgraduate', 'Doctorate', 'Executive'
      domain TEXT NOT NULL, -- 'IT', 'Management', 'IT & Management'
      duration_years REAL NOT NULL,
      total_annual_fee INTEGER NOT NULL,
      seats INTEGER,
      eligibility TEXT,
      entrance_exams TEXT,
      specialization TEXT,
      avg_salary_lpa REAL,
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      college_id INTEGER NOT NULL,
      facility_name TEXT NOT NULL,
      category TEXT,
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      college_id INTEGER,
      student_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      student_phone TEXT NOT NULL,
      city TEXT,
      interested_stream TEXT,
      interested_course TEXT,
      message TEXT,
      type TEXT DEFAULT 'inquiry', -- 'inquiry', 'counseling_booking', 'brochure_request'
      status TEXT DEFAULT 'pending', -- 'pending', 'contacted', 'resolved'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      college_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, college_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      college_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      user_program TEXT,
      rating REAL NOT NULL,
      title TEXT NOT NULL,
      review_text TEXT NOT NULL,
      pros TEXT,
      cons TEXT,
      is_verified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
    );

    -- Create helpful indexes for fast search and filtering
    CREATE INDEX IF NOT EXISTS idx_colleges_category ON colleges(category);
    CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
    CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
    CREATE INDEX IF NOT EXISTS idx_colleges_nirf ON colleges(nirf_rank_2024);
    CREATE INDEX IF NOT EXISTS idx_colleges_avg_package ON colleges(avg_package_lpa);
    CREATE INDEX IF NOT EXISTS idx_courses_college_id ON courses(college_id);
    CREATE INDEX IF NOT EXISTS idx_courses_domain ON courses(domain);
    CREATE INDEX IF NOT EXISTS idx_courses_degree ON courses(degree_level);
  `);
}

module.exports = {
  db,
  initSchema
};
