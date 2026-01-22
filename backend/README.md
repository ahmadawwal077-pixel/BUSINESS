# Business Consulting Website - Backend

Node.js/Express backend for the business consulting website with MongoDB.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration (MongoDB URI, JWT Secret, Stripe Key, etc.)

4. Make sure MongoDB is running locally or update the MONGODB_URI

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Blogs
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:slug` - Get single blog by slug
- `POST /api/blogs` - Create blog (requires auth)
- `PUT /api/blogs/:id` - Update blog (requires auth)
- `DELETE /api/blogs/:id` - Delete blog (requires auth)

### Appointments
- `POST /api/appointments` - Create appointment (requires auth)
- `GET /api/appointments/my-appointments` - Get user appointments (requires auth)
- `GET /api/appointments/all` - Get all appointments (requires auth)
- `PUT /api/appointments/:id/status` - Update appointment status (requires auth)
- `PUT /api/appointments/:id/cancel` - Cancel appointment (requires auth)

### Payments
- `POST /api/payments/create-intent` - Create payment intent (requires auth)
- `POST /api/payments/confirm` - Confirm payment (requires auth)
- `GET /api/payments/my-payments` - Get user payments (requires auth)
- `GET /api/payments/all` - Get all payments (requires auth)

## Database Models

- **User** - User accounts with authentication
- **Blog** - Blog posts with categories and tags
- **Appointment** - Appointment booking with status
- **Payment** - Payment records with Stripe integration
