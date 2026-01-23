# 📊 Course System - Visual Architecture Guide

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CONSULTATION PLATFORM                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐              ┌──────────────────────────┐
│     FRONTEND (React)     │              │    BACKEND (Node/Exp)    │
│   http://localhost:3000  │              │   http://localhost:5000  │
├──────────────────────────┤              ├──────────────────────────┤
│                          │              │                          │
│ Pages:                   │              │ Controllers:             │
│ ├─ Home                  │              │ ├─ authController        │
│ ├─ About                 │              │ ├─ blogController        │
│ ├─ Services              │              │ ├─ courseController ✨   │
│ ├─ Projects              │              │ └─ Others                │
│ ├─ Blog                  │              │                          │
│ ├─ Courses ✨            │              │ Routes:                  │
│ ├─ CourseDetail ✨       │              │ ├─ authRoutes           │
│ ├─ Dashboard (Updated)   │              │ ├─ blogRoutes           │
│ ├─ Profile               │              │ ├─ courseRoutes ✨      │
│ └─ Others                │              │ └─ Others               │
│                          │              │                          │
│ Components:              │              │ Middleware:             │
│ ├─ Navbar (Updated)      │              │ ├─ auth (JWT)           │
│ ├─ Footer                │              │ ├─ errorHandler         │
│ └─ Others                │              │ └─ Others               │
│                          │              │                          │
│ Services:                │              │ Models:                 │
│ ├─ api.js (Updated)      │              │ ├─ User                 │
│ └─ courseAPI ✨          │              │ ├─ Blog                 │
└──────────────────────────┘              │ ├─ Course ✨            │
         │                                │ ├─ CourseEnrollment ✨  │
         │ HTTP Requests                  │ ├─ Assignment ✨        │
         ├──────────────────────────────>│ ├─ Attendance ✨        │
         │<────────────── JSON Response ─┤ └─ Others               │
         │                                │                          │
         │ (JWT Bearer Token)             │ Database:               │
         │                                │ ├─ BUSINESS-COLLECTION  │
         │                                │ └─ MongoDB              │
         │                                │                          │
         │   Stores in LocalStorage       │   Port: 27017           │
         │   Token after login            │                          │
         │                                │                          │
         └────────────────────────────────┘
```

---

## 🔄 User Data Flow

### Student Enrollment Flow
```
┌──────────┐
│  Student │
└────┬─────┘
     │
     ▼
┌─────────────────────────┐
│  Browse /courses        │
│  (GET /api/courses)     │
└────────┬────────────────┘
         │
         ▼
   ┌─────────────┐
   │  Filter by: │
   │ - Category  │
   │ - Level     │
   └────┬────────┘
        │
        ▼
┌──────────────────────────┐
│ Click Course Card        │
│ View /course/:id         │
└────────┬─────────────────┘
         │
         ▼
    ┌─────────────────┐
    │ Review Details: │
    │ - Schedule      │
    │ - Price         │
    │ - Features      │
    └────────┬────────┘
             │
             ▼
  ┌────────────────────────┐
  │ Click "Enroll Now"     │
  │ POST /api/courses/enroll
  └────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Payment Modal Appears    │
│ Select Payment Method    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ POST /api/courses/confirm-   │
│        payment               │
└────────┬─────────────────────┘
         │
         ▼
    ┌──────────────┐
    │ Enrollment   │
    │ Confirmed!   │
    └────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ Redirect to /dashboard   │
│ Course now visible       │
│ Progress tracking begins │
└──────────────────────────┘
```

---

## 🗄️ Database Schema Relationships

```
┌──────────────────────┐
│      USERS           │
│  ─────────────────   │
│  _id                 │
│  name                │
│  email               │
│  password            │
│  isAdmin             │
│  createdAt           │
└──────────┬───────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐   ┌──────────────┐
│COURSES  │   │ENROLL-       │
│─────────│   │MENTS         │
│_id      │   │──────────────│
│title    │◄──│course (ref)  │
│desc     │   │student(ref)──┼──────────┐
│price    │   │payment_status│         │
│schedule │   │enrollDate    │         │
│instruc-◄├──→│assgnSub      │         │
│tor(ref) │   │finalGrade    │         │
└────┬────┘   │attendance%   │         │
     │        └──────────────┘         │
     │                                 │
     ▼                                 │
┌──────────────┐     ┌──────────────┐ │
│ASSIGNMENTS   │     │ATTENDANCES   │ │
│──────────────│     │──────────────│ │
│_id           │     │_id           │ │
│course (ref)──┤────┐│course (ref)──┤─┘
│title         │    ││student(ref)  │
│desc          │    ││date          │
│dueDate       │    ││status        │
│totalPoints   │    ││notes         │
└──────────────┘    └──────────────┘
```

---

## 📡 API Endpoint Diagram

```
COURSE ENDPOINTS
├─ GET    /api/courses
│          Returns: Array of all courses
│          Public: ✅ Yes
│          
├─ GET    /api/courses/:id
│          Returns: Single course details
│          Public: ✅ Yes
│          
├─ POST   /api/courses/create
│          Requires: JWT + Admin/Instructor role
│          Returns: Created course
│          Public: ❌ No
│          
├─ PUT    /api/courses/:id
│          Requires: JWT + Author verification
│          Returns: Updated course
│          Public: ❌ No
│          
├─ DELETE /api/courses/:id
│          Requires: JWT + Author verification
│          Returns: Success message
│          Public: ❌ No
│          
├─ POST   /api/courses/enroll
│          Requires: JWT + CourseID
│          Returns: Enrollment + Payment prompt
│          Public: ❌ No (Student only)
│          
├─ POST   /api/courses/confirm-payment
│          Requires: JWT + EnrollmentID
│          Returns: Confirmed enrollment
│          Public: ❌ No (Student only)
│          
├─ GET    /api/courses/my-courses
│          Requires: JWT
│          Returns: Student's enrollments
│          Public: ❌ No (Student only)
│          
├─ GET    /api/courses/:courseId/assignments
│          Requires: JWT
│          Returns: Course assignments
│          Public: ❌ No (Enrolled students)
│          
├─ GET    /api/courses/:courseId/attendance
│          Requires: JWT
│          Returns: Student's attendance
│          Public: ❌ No (Enrolled students)
│          
├─ POST   /api/courses/:courseId/add-assignment
│          Requires: JWT + Instructor role
│          Returns: Created assignment
│          Public: ❌ No (Instructor only)
│          
├─ POST   /api/courses/:courseId/mark-attendance
│          Requires: JWT + Instructor role
│          Returns: Attendance record
│          Public: ❌ No (Instructor only)
│          
└─ GET    /api/courses/dashboard/student-stats
           Requires: JWT
           Returns: Dashboard statistics
           Public: ❌ No (Student only)
```

---

## 🎯 Component Hierarchy

```
┌──────────────────────────────────────┐
│         App.js                       │
│  (Routing + Auth Provider)           │
└──────────┬───────────────────────────┘
           │
    ┌──────┼──────┬──────────┐
    │      │      │          │
    ▼      ▼      ▼          ▼
  Home   About  Services  Projects
    │
    ├─→ Navbar (Updated)
    │   ├─ Links to: Home, About, Services, Projects
    │   ├─ NEW: Courses link ✨
    │   └─ Auth buttons
    │
    ├─→ Courses Page (NEW)
    │   ├─ Filter Sidebar
    │   │   ├─ Category dropdown
    │   │   ├─ Level dropdown
    │   │   └─ Clear filters button
    │   │
    │   └─ Course Grid
    │       ├─ Course Card
    │       │   ├─ Image
    │       │   ├─ Title
    │       │   ├─ Category badge
    │       │   ├─ Description
    │       │   ├─ Price
    │       │   ├─ Duration
    │       │   └─ Enroll button
    │       │
    │       └─ (Repeats for 8 courses)
    │
    ├─→ CourseDetail Page (NEW)
    │   ├─ Back button
    │   │
    │   ├─ Course Header
    │   │   ├─ Hero image
    │   │   ├─ Category badge
    │   │   ├─ Level badge
    │   │   ├─ Course title
    │   │   └─ Description
    │   │
    │   ├─ Course Info Grid
    │   │   ├─ Instructor name
    │   │   ├─ Duration
    │   │   ├─ Schedule
    │   │   └─ Available spots
    │   │
    │   ├─ Price + Enroll Button
    │   │   └─ Opens Payment Modal
    │   │
    │   └─ Course Sections
    │       ├─ What you'll learn
    │       ├─ Requirements
    │       └─ Features
    │
    ├─→ Dashboard (Updated)
    │   ├─ Welcome Header
    │   │   └─ Logout button
    │   │
    │   ├─ Course Stats Cards
    │   │   ├─ Active Courses
    │   │   ├─ Completed Courses
    │   │   ├─ Average Grade
    │   │   └─ Upcoming Assignments
    │   │
    │   ├─ My Active Courses Section (NEW)
    │   │   ├─ Course Card
    │   │   │   ├─ Image
    │   │   │   ├─ Title
    │   │   │   ├─ Schedule
    │   │   │   ├─ Progress bar
    │   │   │   ├─ Attendance %
    │   │   │   └─ View Course button
    │   │   │
    │   │   └─ (Repeats for each enrolled course)
    │   │
    │   └─ Quick Actions Cards
    │       ├─ Browse Courses
    │       ├─ My Assignments
    │       ├─ Attendance
    │       └─ Profile
    │
    ├─→ Login Page
    ├─→ Register Page
    ├─→ Profile Page
    ├─→ Blog Page
    ├─→ Blog Detail Page
    ├─→ Contact Page
    ├─→ Admin Blog Page
    │
    └─→ Footer
        └─ Links + Info
```

---

## 📊 Dashboard Statistics Flow

```
User Opens Dashboard
        │
        ▼
Call courseAPI.getStudentDashboardStats()
        │
        ├─→ appointmentAPI.getMyEnrolledCourses()
        │   └─ Returns: [enrollment1, enrollment2, ...]
        │
        └─→ Queries Database
            │
            ├─ Count: course enrollments
            │  └─ Returns: activeCourses
            │
            ├─ Filter: status = 'completed'
            │  └─ Returns: completedCourses
            │
            ├─ Calculate: Average grades
            │  └─ Returns: averageGrade
            │
            └─ Count: Pending assignments
               └─ Returns: upcomingAssignments

            ▼
Dashboard Displays:
├─ [📚 X Active Courses]
├─ [🎓 Y Completed Courses]
├─ [📊 Z% Average Grade]
└─ [📋 N Upcoming Assignments]
```

---

## 💳 Payment Flow

```
Student on CourseDetail Page
        │
        ▼
Clicks "Enroll Now" Button
        │
        ▼
POST /api/courses/enroll
{courseId: "..."}
        │
        ▼
Backend Creates CourseEnrollment
(paymentStatus: "pending")
        │
        ▼
Frontend Opens Payment Modal
        │
        ├─ Shows: Course name + Price
        │
        ├─ Select: Payment method
        │  ├─ Paystack
        │  ├─ Stripe
        │  └─ Bank Transfer
        │
        └─ Buttons:
           ├─ Cancel (closes modal)
           └─ Confirm Payment

               ▼
        POST /api/courses/confirm-payment
        {enrollmentId: "..."}
        
               ▼
        Backend Updates CourseEnrollment
        (paymentStatus: "completed")
        (status: "active")
        
               ▼
        Frontend: Success message
        + Redirect to Dashboard
        
               ▼
        Course appears in
        "My Active Courses" section
```

---

## 🔐 Authentication & Authorization

```
┌─────────────────────────────────┐
│ Public Access                   │
│ ├─ /                           │
│ ├─ /about                      │
│ ├─ /services                   │
│ ├─ /projects                   │
│ ├─ /blog                       │
│ ├─ /blog/:slug                 │
│ ├─ /contact                    │
│ ├─ /login                      │
│ ├─ /register                   │
│ ├─ /courses (NEW)              │
│ ├─ /course/:id (NEW)           │
│ └─ (API: /api/courses/*)       │
└─────────────────────────────────┘

         ↓ Login Required ↓

┌─────────────────────────────────┐
│ Protected Access (JWT Required) │
│ ├─ /dashboard                  │
│ ├─ /profile                    │
│ ├─ /appointments               │
│ ├─ /make-appointment           │
│ ├─ /payments                   │
│ ├─ /admin/blog                 │
│ └─ (Many API endpoints)        │
└─────────────────────────────────┘

         ↓ Admin/Instructor ↓

┌─────────────────────────────────┐
│ Admin/Instructor Functions      │
│ ├─ Create courses              │
│ ├─ Update courses              │
│ ├─ Delete courses              │
│ ├─ Add assignments             │
│ ├─ Mark attendance             │
│ ├─ Create blog posts           │
│ └─ View all analytics          │
└─────────────────────────────────┘
```

---

## 📱 Responsive Breakpoints

```
Desktop (1200px+)
├─ 3-column grid
├─ Full sidebar
└─ Desktop navigation

Tablet (768px - 1199px)
├─ 2-column grid
├─ Collapsible sidebar
└─ Hamburger menu

Mobile (< 768px)
├─ 1-column grid
├─ Full-width cards
├─ Hamburger menu
└─ Optimized touch targets
```

---

## ✨ What's New (Quick Reference)

```
✨ = NEW  |  🔄 = UPDATED  |  ✅ = EXISTING

BACKEND:
├─ ✨ Course.js
├─ ✨ CourseEnrollment.js
├─ ✨ Assignment.js
├─ ✨ Attendance.js
├─ ✨ courseController.js
├─ ✨ courseRoutes.js
└─ 🔄 server.js

FRONTEND:
├─ ✨ Courses.js
├─ ✨ CourseDetail.js
├─ 🔄 Dashboard.js
├─ 🔄 Navbar.js
├─ 🔄 App.js
└─ 🔄 api.js

DATABASE:
├─ ✨ courses
├─ ✨ courseenrollments
├─ ✨ assignments
└─ ✨ attendances

API ENDPOINTS:
└─ ✨ 13 new course endpoints
```

---

This visual guide should help you understand the complete architecture of your course management system!
