const bcrypt = require('bcryptjs');
const { db, initSchema } = require('./database');
const { collegesData, sampleReviews } = require('./seedData');

function seedDatabase() {
  console.log('--- Initializing SQLite Schema ---');
  initSchema();

  console.log('--- Seeding Default Users ---');
  // Hash password 'admin123' and 'student123'
  const salt = bcrypt.genSaltSync(10);
  const adminPass = bcrypt.hashSync('admin123', salt);
  const studentPass = bcrypt.hashSync('student123', salt);

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (full_name, email, password_hash, role, phone, target_degree)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('Platform Administrator', 'admin@campuscompass.in', adminPass, 'admin', '+91 98765 43210', 'All');
  insertUser.run('Aditi Sharma', 'aditi.student@gmail.com', studentPass, 'student', '+91 98111 22334', 'B.Tech CSE');
  insertUser.run('Rahul Verma', 'rahul.mba@gmail.com', studentPass, 'student', '+91 98222 33445', 'MBA');

  console.log('--- Seeding Colleges, Courses & Facilities ---');

  const checkCollege = db.prepare('SELECT id FROM colleges WHERE slug = ?');
  const insertCollege = db.prepare(`
    INSERT INTO colleges (
      name, short_name, slug, category, institution_type, established_year,
      city, state, pincode, address, contact_number, admission_helpline,
      email, website, nirf_rank_2024, naac_grade, aicte_approved, ugc_approved,
      campus_area_acres, avg_package_lpa, highest_package_lpa, median_package_lpa,
      min_annual_fee, max_annual_fee, rating, reviews_count, description,
      logo_url, banner_url, hostel_available, wifi_campus,
      placement_rating, infrastructure_rating, faculty_rating, is_featured
    ) VALUES (
      @name, @short_name, @slug, @category, @institution_type, @established_year,
      @city, @state, @pincode, @address, @contact_number, @admission_helpline,
      @email, @website, @nirf_rank_2024, @naac_grade, @aicte_approved, @ugc_approved,
      @campus_area_acres, @avg_package_lpa, @highest_package_lpa, @median_package_lpa,
      @min_annual_fee, @max_annual_fee, @rating, @reviews_count, @description,
      @logo_url, @banner_url, @hostel_available, @wifi_campus,
      @placement_rating, @infrastructure_rating, @faculty_rating, @is_featured
    )
  `);

  const insertCourse = db.prepare(`
    INSERT INTO courses (
      college_id, course_name, degree_level, domain, duration_years,
      total_annual_fee, seats, eligibility, entrance_exams, specialization, avg_salary_lpa
    ) VALUES (
      @college_id, @course_name, @degree_level, @domain, @duration_years,
      @total_annual_fee, @seats, @eligibility, @entrance_exams, @specialization, @avg_salary_lpa
    )
  `);

  const insertFacility = db.prepare(`
    INSERT INTO facilities (college_id, facility_name, category)
    VALUES (?, ?, ?)
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (college_id, user_name, user_program, rating, title, review_text, pros, cons, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);

  // Clear existing college data for a clean fresh seed
  db.exec(`
    DELETE FROM reviews;
    DELETE FROM facilities;
    DELETE FROM courses;
    DELETE FROM bookmarks;
    DELETE FROM inquiries;
    DELETE FROM colleges;
  `);

  const transaction = db.transaction(() => {
    for (const c of collegesData) {
      const collegePayload = { ...c };
      delete collegePayload.facilities;
      delete collegePayload.courses;

      const result = insertCollege.run(collegePayload);
      const collegeId = result.lastInsertRowid;

      if (c.facilities && c.facilities.length > 0) {
        for (const f of c.facilities) {
          insertFacility.run(collegeId, f, 'General');
        }
      }

      if (c.courses && c.courses.length > 0) {
        for (const crs of c.courses) {
          insertCourse.run({
            ...crs,
            college_id: collegeId
          });
        }
      }
    }

    // Seed Sample Reviews
    for (const rev of sampleReviews) {
      const col = db.prepare('SELECT id FROM colleges WHERE slug = ?').get(rev.college_slug);
      if (col) {
        insertReview.run(
          col.id,
          rev.user_name,
          rev.user_program,
          rev.rating,
          rev.title,
          rev.review_text,
          rev.pros,
          rev.cons
        );
      }
    }

    // Seed sample inquiries to demonstrate counseling/admission desk functionality
    const firstCollege = db.prepare('SELECT id FROM colleges LIMIT 1').get();
    if (firstCollege) {
      const insertInquiry = db.prepare(`
        INSERT INTO inquiries (college_id, student_name, student_email, student_phone, city, interested_stream, interested_course, message, type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertInquiry.run(
        firstCollege.id,
        'Kunal Mehta',
        'kunal.mehta@gmail.com',
        '+91 99887 76655',
        'Pune',
        'IT',
        'B.Tech in Computer Science',
        'Looking for details on JEE cutoff rank and scholarship criteria for 2025-26 academic session.',
        'counseling_booking',
        'pending'
      );

      insertInquiry.run(
        firstCollege.id,
        'Sneha Roy',
        'sneha.roy@yahoo.com',
        '+91 91234 56789',
        'Kolkata',
        'Management',
        'MBA Tech Management',
        'Requested brochure and placement statistics for non-engineers in management program.',
        'brochure_request',
        'contacted'
      );
    }
  });

  transaction();
  console.log(`Successfully seeded ${collegesData.length} colleges with associated courses, facilities, and reviews!`);
}

if (require.main === module) {
  seedDatabase();
  console.log('Database seeding complete.');
}

module.exports = { seedDatabase };
