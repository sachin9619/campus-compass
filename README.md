# CampusCompass India 🎓🧭
## Centralized IT & Management Higher Education Discovery & Counseling Platform

[![Platform](https://img.shields.io/badge/Platform-CampusCompass%20India-0284c7.svg)](#)
[![Internship](https://img.shields.io/badge/Project-Global%20Professional%20Internship%20(GPI)-emerald.svg)](#)
[![Mentor](https://img.shields.io/badge/Mentorship-Cloud%20Counselage%20Pvt.%20Ltd.-amber.svg)](#)
[![Database](https://img.shields.io/badge/Database-SQLite%20(SQL)--Compliant-indigo.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)

---

## 📌 Executive Summary & Problem Statement Alignment

This project is developed as the official submission for the **Global Professional Internship (GPI)** under **Cloud Counselage Pvt. Ltd.** & the **Industry Academia Community (IOO) / CC-GAC Foundation**.

### The Problem
Prospective students across India face major hurdles when researching higher education in Information Technology (IT) and Management:
1. **Aggressive Advertising & Lead Traps:** Online aggregators sell student phone numbers to third-party telemarketing agencies, causing spam.
2. **Scattered & Outdated Data:** Accurate annual tuition fee breakdowns, cutoff percentiles, and seat matrices are rarely centralized.
3. **Hidden Contact Channels:** Direct official institutional helplines and admissions desk contacts are replaced with promotional affiliate forms.

### The Solution: CampusCompass India
CampusCompass India delivers an **ad-free, verified, centralized discovery and counseling engine** encompassing premier IT and Management institutions across India. Built strictly using **HTML, CSS, JavaScript (Frontend & Node.js/Express Backend), and a SQL-compliant Relational Database**, the platform provides verified helpline phone numbers, official admissions emails, NIRF rankings, NAAC grades, and a 1-on-1 counseling scheduling desk.

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |         CampusCompass Client          |
                                  |  (React 19 + Tailwind CSS + Lucide)   |
                                  +-------------------+-------------------+
                                                      |
                                           REST API Requests (JSON)
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |         Node.js / Express API         |
                                  |    (Routing, Auth, Search, Compare)   |
                                  +---------+-------------------+---------+
                                            |                   |
                                JWT & Bcrypt Auth       better-sqlite3 Driver
                                            |                   |
                                            v                   v
                                  +-------------------+ +-----------------+
                                  |   Session Token   | |  SQLite Engine  |
                                  |   Verification    | |  (WAL Mode SQL) |
                                  +-------------------+ +--------+--------+
                                                                 |
                                +--------------------------------+--------------------------------+
                                |                                |                                |
                                v                                v                                v
                       [colleges table]                  [courses table]                 [inquiries table]
                       - Direct Helpline                 - Degree Level                  - Student Contact
                       - Verified Email                  - Tuition Fees                  - Preferred Track
                       - NIRF 2024 / NAAC                - Eligibility & Exams           - Status Pipeline
```

---

## 📋 Compliance with Project Instructions (Slide 1 & Slide 2)

| # | Instruction / Guideline from Slide | CampusCompass Implementation | Status |
|---|---|---|:---:|
| **1** | Read the Problem Statement thoroughly | Designed specifically to solve unavailability of centralized, ad-free IT & Management college data. | ✅ |
| **2** | Academic mentor alignment | Tailored for Cloud Counselage's academic partnership and student professional development mandate. | ✅ |
| **3** | Easily searchable & well-presented UI/UX | Real-time multi-criteria search, live facet filtering, and responsive grid/list views. | ✅ |
| **4** | Intuitive, visually appealing UI | Modern design system built with clean typography, micro-animations, and visual badges. | ✅ |
| **5** | Responsive across various devices | Mobile, tablet, and desktop responsive layouts with accessible touch targets. | ✅ |
| **6** | Mandatory Database Fields | Normalized SQL tables storing: **Name, Address, City, State, Contact Phone, Admission Email, Official Website, Courses Offered, and Fee Structures**. | ✅ |
| **7** | Accurate & Up-to-Date Data | Pre-seeded with official data from **NIRF 2024**, **NAAC**, and official institutional prospectuses. | ✅ |
| **8** | User Authentication Mechanisms | Secure **JWT + Bcrypt authentication** with role-based access for Students and Administrators. | ✅ |
| **9** | Deployment Readiness | Built with self-contained SQL database, production bundling, and zero third-party cloud database dependencies. | ✅ |
| **10** | Regular updates & visibility | Includes export-ready reports, counseling pipeline management, and audit logs. | ✅ |
| **11** | List of Deliverables | Complete codebase, database migrations, seed scripts, REST API documentation, and user manual. | ✅ |

---

## 🚀 Key Functional Capabilities

### 1. Smart Institutional Discovery & Multi-Facet Filtering
- Search across institution names, cities, states, and specific degree programs (e.g. *B.Tech, MBA, MCA, BCA, BBA*).
- Instant multi-facet filters:
  - **Academic Discipline:** Pure IT & CS, Management & MBA, or Dual-track institutions.
  - **Type of Institution:** IIT, IIM, NIT, IIIT, Central University, State University, Private, Deemed University.
  - **State & City Dropdowns:** Covering Maharashtra, Karnataka, Delhi NCR, Tamil Nadu, Gujarat, Telangana, Rajasthan, West Bengal, Jharkhand.
  - **Tuition Budget Slider:** Max Annual Tuition Fee filter (from ₹50,000 to ₹20,00,000+).
  - **Placement Package Slider:** Minimum Average Package filter (up to 30 LPA+).
  - **NAAC Grade:** Filter by `A++`, `A+`, or `A`.
  - **Sorting:** By NIRF Rank, Average CTC, Student Rating, or Tuition Fees.

### 2. Multi-College Comparison Engine (2 to 4 Institutions)
- Side-by-side tabular comparison of NIRF Rank, NAAC Grade, Average CTC, Highest CTC, Annual Fees, Courses count, Campus acreage, Direct phone numbers, and Student ratings.

### 3. Institutional Profiles & Verified Helpline Desk
- Full institutional breakdown:
  - **Courses & Fees Matrix:** Breakdown of undergraduate, postgraduate, and executive degrees, durations, seat intakes, entrance exams (*JEE, CAT, NIMCET, GATE, SNAP, XAT, BITSAT*), and eligibility criteria.
  - **Verified Contact Information:** Official admission helpline phone numbers, office emails, campus street address, and direct links to official websites.
  - **Student Reviews System:** Authentic reviews with star ratings and verified **Pros & Cons**.

### 4. 1-on-1 Free Academic Counseling (Cloud Counselage Pipeline)
- Dedicated counseling booking portal allowing students to schedule unbiased guidance sessions.
- Inquiries are logged directly into the administrative pipeline.

### 5. Administrative Center & Mentorship Portal
- Secure dashboard for administrators and counselors.
- Real-time pipeline tracking (`pending` ➔ `contacted` ➔ `resolved`).
- Database CRUD: Add, update, and manage colleges and course offerings in real-time.

---

## 🗄️ Relational Database Schema (`data/campus_compass.db`)

```sql
-- Colleges Master Table
CREATE TABLE colleges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  short_name TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'IT', 'Management', 'Both'
  institution_type TEXT NOT NULL, -- 'IIT', 'IIM', 'NIT', 'IIIT', etc.
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
  naac_grade TEXT,
  aicte_approved INTEGER DEFAULT 1,
  ugc_approved INTEGER DEFAULT 1,
  campus_area_acres REAL,
  avg_package_lpa REAL,
  highest_package_lpa REAL,
  min_annual_fee INTEGER,
  max_annual_fee INTEGER,
  rating REAL DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  hostel_available INTEGER DEFAULT 1,
  wifi_campus INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Courses Relational Table
CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id INTEGER NOT NULL,
  course_name TEXT NOT NULL,
  degree_level TEXT NOT NULL,
  domain TEXT NOT NULL,
  duration_years REAL NOT NULL,
  total_annual_fee INTEGER NOT NULL,
  seats INTEGER,
  eligibility TEXT,
  entrance_exams TEXT,
  specialization TEXT,
  avg_salary_lpa REAL,
  FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Inquiries & Counseling Table
CREATE TABLE inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id INTEGER,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  city TEXT,
  interested_stream TEXT,
  message TEXT,
  type TEXT DEFAULT 'inquiry',
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  phone TEXT,
  target_degree TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚡ Quick Start & Deployment Guide

### 1. Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Setup & Launch
```bash
# Clone or navigate to the project root directory
cd campus-compass

# Install dependencies (if setting up on a new machine)
npm install
npm install --prefix client

# Seed the relational SQL database:
npm run seed

# Build the production client bundle:
npm run build

# Start the fullstack platform (Port 5000):
npm start
```

Access the platform at:
👉 **`http://localhost:5000`**

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and server status |
| `GET` | `/api/colleges` | Search & filter colleges with pagination |
| `GET` | `/api/colleges/stats` | Aggregated metrics (total colleges, courses, average CTC) |
| `GET` | `/api/colleges/filters` | Dynamic facet options (states, cities, types, degrees) |
| `GET` | `/api/colleges/:slug` | In-depth profile with all courses, facilities, and verified contact desk |
| `GET` | `/api/courses` | Search courses catalog across IT and Management |
| `POST` | `/api/compare` | Multi-institution comparison matrix (2 to 4 colleges) |
| `POST` | `/api/inquiries` | Submit counseling session booking or brochure request |
| `POST` | `/api/auth/register` | Student account creation |
| `POST` | `/api/auth/login` | JWT authentication |
| `GET` | `/api/auth/bookmarks` | Fetch authenticated student's shortlisted colleges |
| `POST` | `/api/auth/bookmarks/:id` | Toggle shortlist status |
| `POST` | `/api/reviews` | Submit verified student feedback with ratings, pros & cons |
| `GET` | `/api/admin/metrics` | Admin summary metrics (Protected) |
| `GET` | `/api/admin/inquiries` | Counseling leads management pipeline (Protected) |
| `PATCH` | `/api/admin/inquiries/:id` | Update lead status (`pending` / `contacted` / `resolved`) |
| `POST` | `/api/admin/colleges` | Add new verified college to SQL database (Protected) |
| `DELETE` | `/api/admin/colleges/:id` | Remove college and relational records (Protected) |
