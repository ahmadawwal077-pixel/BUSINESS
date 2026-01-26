# Quick Test Guide - All Features

## Prerequisites
- Backend running: `cd backend && npm start` (Port 5000)
- Frontend running: `cd frontend && npm start` (Port 3000)
- MongoDB running locally on port 27017
- Admin user account exists (use `node backend/scripts/makeAdmin.js` if needed)

---

## 1. Test Admin Delete Live Class

**Steps:**
1. Login with admin account
2. Go to Admin Dashboard → "Classes" tab
3. In "Upcoming Classes" section, find any live class
4. Click the **🗑️ Delete** button (red button)
5. Confirm deletion in dialog
6. Class should disappear from list

**Expected Result:**
- Live class deleted from database
- UI updated immediately
- No error messages

---

## 2. Test Admin Mark Attendance

**Steps:**
1. Stay in Admin Dashboard
2. Click **"Mark Attendance"** button on any live class in "Upcoming Classes"
3. A modal opens showing all enrolled students
4. For each student, select attendance status from dropdown:
   - Present ✅
   - Absent ❌
   - Late ⏱️
5. Click **"Submit Attendance"** button
6. Modal closes, success message appears

**Expected Result:**
- Attendance records created in database
- Modal closes automatically
- Success notification shown
- Attendance persisted for future reference

---

## 3. Test Student Dashboard Average Grade

**Steps:**
1. Logout and login with student account
2. Go to Dashboard
3. Look at the statistics cards section
4. Find the **"📊 Average Grade"** card
5. Verify it shows a percentage (e.g., "85%")

**Expected Result:**
- Average grade displays correctly
- Calculation: sum of all course finalGrades ÷ number of courses
- Updates when new grades are assigned

---

## 4. Test Student Previous Grades Page

**Steps:**
1. On Dashboard, find the **"📜 View Previous Grades"** card
   - Purple gradient card below statistics
   - Shows "Review all your submitted assignments and their grades"
2. Click on the card
3. Page navigates to `/student-previous-grades`
4. All submitted assignments display as cards:
   - Title of assignment
   - Course name
   - Submission date
   - Score (if graded) - e.g., "85/100"
   - Status badge (Green ✅ if graded, Yellow ⏳ if pending)
   - Instructor feedback/comments
5. Click **"View Your Submission"** to expand and see the submitted text

**Expected Result:**
- All submissions load without errors
- Grades display correctly with colors
- Feedback/comments visible
- Can collapse/expand submission content
- Page is responsive
- Empty state message if no submissions exist

---

## 5. Full User Flow Test

### As Admin:
```
Login (admin account)
  ↓
Admin Dashboard
  ↓
Classes → Delete a live class ✅
  ↓
Classes → Mark Attendance ✅
  ↓
Check Attendance tab (new tab replaces Students)
```

### As Student:
```
Login (student account)
  ↓
Dashboard
  ↓
See Average Grade in statistics ✅
  ↓
Click "View Previous Grades" card ✅
  ↓
StudentPreviousGrades page opens
  ↓
See all submissions with grades ✅
  ↓
Expand submission details ✅
```

---

## API Endpoints Summary

### Admin Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| DELETE | `/api/live/:id` | Delete a live class |
| POST | `/api/live/:id/attendance` | Mark attendance for a class |
| GET | `/api/courses/:courseId/enrollments` | Get enrolled students |

### Student Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/courses/dashboard/student-stats` | Get dashboard stats (including averageGrade) |
| GET | `/api/assignments/my-submissions` | Get all student submissions with grades |

### Request Body Examples

**Delete Live Class:**
```
DELETE /api/live/class_id_123
Authorization: Bearer token_here
```

**Mark Attendance:**
```
POST /api/live/class_id_123/attendance
Authorization: Bearer token_here

{
  "attendance": [
    { "studentId": "user_123", "status": "present" },
    { "studentId": "user_456", "status": "absent" },
    { "studentId": "user_789", "status": "late" }
  ]
}
```

---

## Troubleshooting

### Attendance Modal Doesn't Show Enrolled Students
- **Fix**: Check that live class has enrolled students in CourseEnrollment collection
- **Check**: GET `/api/courses/:courseId/enrollments` returns data

### Average Grade Shows 0%
- **Fix**: Ensure student is enrolled in courses with finalGrade values
- **Check**: CourseEnrollment records have `finalGrade` set (not 0 or undefined)

### Previous Grades Page Shows "No Submissions"
- **Fix**: Student needs to submit assignments first
- **Check**: Student has AssignmentSubmission records in database

### Delete Button Doesn't Work
- **Fix**: Ensure you're logged in as admin
- **Fix**: Verify JWT token is valid in localStorage
- **Check**: Browser console for error messages

### Navigation to Previous Grades Fails
- **Fix**: Clear browser cache and refresh
- **Fix**: Check that `/student-previous-grades` route exists in App.js
- **Check**: StudentPreviousGrades component is imported

---

## Files Changed Summary

**Backend (4 files)**
- liveClassController.js: Added delete and attendance functions
- courseController.js: Added getCourseEnrollments function
- liveRoutes.js: Added delete and attendance routes
- courseRoutes.js: Added enrollments route

**Frontend (5 files + 1 new)**
- Dashboard.js: Added Previous Grades card
- AdminDashboard.js: Attendance modal and delete buttons
- StudentPreviousGrades.js: **NEW PAGE**
- api.js: Added 4 API helpers
- App.js: Added route for previous grades page

---

## Success Criteria Checklist

- [ ] Admin can delete live classes
- [ ] Admin can mark attendance with student dropdown selections
- [ ] Attendance data persists in database
- [ ] Student sees average grade on dashboard
- [ ] Student can navigate to Previous Grades page
- [ ] Previous Grades page shows all submissions with grades
- [ ] Grading status badges show correctly (graded/pending)
- [ ] Instructor feedback displays properly
- [ ] All features work without console errors
- [ ] Responsive design works on mobile

---

## Performance Notes

- Live class deletions are instant (no pagination)
- Attendance marking for 20-50 students should be < 1 second
- Average grade calculation is optimized with single aggregation
- Previous grades page loads all submissions in one request

