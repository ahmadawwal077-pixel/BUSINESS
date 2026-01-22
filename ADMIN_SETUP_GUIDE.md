# Admin Setup Guide - Blog Management

## Overview
Only **admin users** can create and manage blog posts. The system now includes role-based access control.

---

## How to Set Up Your Admin Account

### Option 1: Direct Database Update (Recommended for First Admin)

1. **Connect to MongoDB Atlas or your MongoDB instance**

2. **Find your user document:**
   ```
   Database: consultation_db
   Collection: users
   Find: { email: "youremail@example.com" }
   ```

3. **Update the user to admin:**
   - Add field: `isAdmin: true`
   - Or update existing if false

4. **MongoDB Query Example:**
   ```javascript
   db.users.updateOne(
     { email: "youremail@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

5. **Verify the change:**
   - Logout from the frontend
   - Login again
   - You should now see "Create Blog Post" in the dropdown menu

---

### Option 2: Using MongoDB Compass (Visual Tool)

1. Open **MongoDB Compass**
2. Connect to your database
3. Navigate to: `consultation_db` → `users`
4. Find your user by email
5. Click on the document to edit
6. Add field: `{ "isAdmin": true }`
7. Save changes
8. Refresh your browser and login again

---

## Verification Steps

### Step 1: Check Navbar Menu
1. Login with your admin account
2. Click on your profile dropdown (top-right)
3. **You should see:**
   - ✅ Dashboard
   - ✅ My Appointments
   - ✅ My Payments
   - ✅ Profile
   - ✅ **Create Blog Post** ← NEW (Only visible for admins)

### Step 2: Try Creating a Blog Post
1. Click **"Create Blog Post"**
2. URL should be: `http://localhost:3000/admin/blog`
3. You should see the blog creation form

### Step 3: Non-Admin Users See Access Denied
1. If a non-admin user tries to access `/admin/blog`
2. They will see: **"Access Denied - Only administrators can create blog posts"**

---

## Adding More Admins

To make another user an admin, follow the same database update steps:

```javascript
db.users.updateOne(
  { email: "another.admin@example.com" },
  { $set: { isAdmin: true } }
)
```

---

## Removing Admin Access

To revoke admin privileges:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: false } }
)
```

---

## Database Field Reference

**User Model:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  company: String,
  profileImage: String,
  isAdmin: Boolean (default: false),  ← NEW FIELD
  createdAt: Date
}
```

---

## Troubleshooting

### Problem: "Create Blog Post" not showing in dropdown
- **Solution:** Make sure `isAdmin: true` is set in the database
- Logout and login again to refresh the user data
- Check browser console for errors

### Problem: "Access Denied" message when accessing `/admin/blog`
- **Solution:** Your account is not marked as admin in the database
- Contact database administrator to set `isAdmin: true`

### Problem: Changes not reflecting after database update
- **Solution:** 
  1. Logout from the frontend
  2. Clear browser cache (Ctrl+Shift+Delete)
  3. Login again
  4. The auth context will fetch fresh user data

---

## Frontend Code Changes

The following changes have been made to enforce admin-only access:

### 1. **AdminBlog.js** - Access Control
```javascript
if (!user?.isAdmin) {
  return <AccessDeniedComponent />;
}
```

### 2. **Navbar.js** - Menu Visibility
```javascript
...(user?.isAdmin ? [{ icon: '✍️', name: 'Create Blog Post', path: '/admin/blog' }] : [])
```

### 3. **Backend User Model** - isAdmin Field
```javascript
isAdmin: {
  type: Boolean,
  default: false,
}
```

### 4. **Auth Controller** - Return isAdmin in Responses
```javascript
user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
```

---

## API Response Examples

### Login Response (Admin User)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

### Login Response (Regular User)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Regular User",
    "email": "user@example.com",
    "isAdmin": false
  }
}
```

---

## Security Notes

✅ **Admin check is performed on:**
- Frontend (UI visibility) - prevents non-admins from seeing the button
- Route protection - non-admins get access denied page
- Consider adding backend protection in future:
  - Create middleware to verify admin status on POST /api/blogs
  - This would prevent unauthorized users from bypassing frontend restrictions

---

## Next Steps

1. Update your user account to `isAdmin: true` in MongoDB
2. Logout and login
3. Click "Create Blog Post" from the dropdown
4. Fill out the form and create your first blog post!

For questions or issues, check the troubleshooting section above.
