# Business Consulting Website

A full-stack business consulting website built with React (frontend), Node.js/Express (backend), and MongoDB (database).

## 🎯 Features

### Public Pages
- **Home**: Eye-catching hero section with service overview
- **About**: Company information and team details
- **Services**: Comprehensive service descriptions with features
- **Projects**: Portfolio of successful client projects
- **Blog**: Blog system with pagination and categories
- **Contact**: Contact form and business information

### User Features
- **Authentication**: Secure user registration and login with JWT
- **Dashboard**: Personalized user dashboard
- **Profile Management**: Update user information
- **Appointment Booking**: Schedule consultations
- **Payment Tracking**: View payment history
- **Responsive Design**: Works on all devices

## 📁 Project Structure

```
CONSULTATION/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── appointmentController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Blog.js
│   │   ├── Appointment.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── paymentRoutes.js
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── About.js
│   │   │   ├── Services.js
│   │   │   ├── Projects.js
│   │   │   ├── Blog.js
│   │   │   ├── Contact.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── Appointments.js
│   │   │   ├── MakeAppointment.js
│   │   │   └── Payments.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── navbar.css
│   │   │   └── footer.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/business-consulting
JWT_SECRET=your_secure_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev    # Development with nodemon
# or
npm start      # Production
```

The backend will run on [http://localhost:5000](http://localhost:5000)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at [http://localhost:3000](http://localhost:3000)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Blogs
- `GET /api/blogs` - Get all blogs (paginated)
- `GET /api/blogs/:slug` - Get single blog
- `POST /api/blogs` - Create blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)

### Appointments
- `POST /api/appointments` - Create appointment (auth required)
- `GET /api/appointments/my-appointments` - Get user appointments
- `PUT /api/appointments/:id/status` - Update status
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/my-payments` - Get user payments

## 🛠️ Technologies Used

### Backend
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Bcryptjs - Password hashing
- Stripe - Payment processing
- CORS - Cross-origin requests

### Frontend
- React 18 - UI library
- React Router v6 - Routing
- Axios - HTTP client
- Context API - State management

## 📝 Configuration

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/business-consulting
JWT_SECRET=your_jwt_secret_key_change_in_production
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NODE_ENV=development
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 Additional Setup

### MongoDB Installation
If you don't have MongoDB installed locally:

**Windows:**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow the installation wizard
- MongoDB will run as a service

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

## 🔒 Security Notes

1. **Never commit** `.env` file to version control
2. **Change** JWT_SECRET in production
3. **Use** HTTPS in production
4. **Validate** all user inputs
5. **Keep** dependencies updated with `npm audit`

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions, please check:
- [QUICK_START_COURSES.md](QUICK_START_COURSES.md) - Getting started guide
- [COURSE_SYSTEM_GUIDE.md](COURSE_SYSTEM_GUIDE.md) - Technical documentation
- [SYSTEM_TRANSFORMATION_SUMMARY.md](SYSTEM_TRANSFORMATION_SUMMARY.md) - Architecture overview

---

## ✨ Latest Update: Course Management System

**January 22, 2026** - We've successfully transformed this platform into a professional online learning system!

### What's New
- 📚 Full course management system
- 🎓 Student enrollment with payments
- 📊 Progress tracking (attendance, assignments, grades)
- 🏆 Certificate framework
- 📈 Enhanced dashboard with course statistics
- 🎯 8 sample courses across 6 categories

### Key Files
- **Backend**: `courseController.js`, `courseRoutes.js`, Course/CourseEnrollment/Assignment/Attendance models
- **Frontend**: `Courses.js`, `CourseDetail.js`, updated `Dashboard.js`, updated `Navbar.js`
- **Documentation**: 4 comprehensive guides to get you started

### Quick Start
1. Read [QUICK_START_COURSES.md](QUICK_START_COURSES.md)
2. Run `npm start` in both backend and frontend
3. Visit `/courses` to browse courses
4. Enroll in a course and track your progress on the dashboard

---

Built with ❤️ for professional online education

**Status**: ✅ Production Ready - Course System Complete
