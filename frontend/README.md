# Business Consulting Website - Frontend

React frontend for the business consulting website with authentication, appointment booking, and payment integration.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (if needed for environment-specific API URLs):
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Development Server

Start the development server with:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Building for Production

Create a production build:
```bash
npm build
```

## Project Structure

```
src/
├── components/         # Reusable components (Navbar, Footer, ProtectedRoute)
├── context/           # React Context (AuthContext)
├── pages/             # Page components
│   ├── Home.js
│   ├── About.js
│   ├── Services.js
│   ├── Projects.js
│   ├── Blog.js
│   ├── Contact.js
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   ├── Profile.js
│   ├── Appointments.js
│   ├── MakeAppointment.js
│   └── Payments.js
├── services/          # API service files
│   └── api.js
├── styles/            # Global and component styles
│   ├── global.css
│   ├── navbar.css
│   └── footer.css
├── App.js            # Main app component with routing
└── index.js          # Entry point
```

## Features

- **Home Page**: Hero section with service preview and CTA
- **About Page**: Company information and statistics
- **Services Page**: Detailed service offerings
- **Projects Page**: Portfolio of completed projects
- **Blog Page**: Blog posts with pagination
- **Contact Page**: Contact form and business information
- **Authentication**: User registration and login with JWT
- **Dashboard**: User dashboard with quick links
- **Profile**: User profile management
- **Appointments**: Book and manage appointments
- **Payments**: View payment history
- **Responsive Design**: Mobile-friendly layout

## Technologies Used

- React 18
- React Router v6
- Axios
- Context API for state management

## Notes

- Backend API should be running on `http://localhost:5000`
- Update `REACT_APP_API_URL` in `.env` if backend runs on a different port
- Login token is stored in localStorage
- Protected routes require authentication
