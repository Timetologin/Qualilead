# QualiLead - Lead Management System

A modern lead management platform built with React and Node.js for managing and distributing quality leads to clients.

## Features

- **Lead Management**: Create, assign, and track leads through their lifecycle
- **Client Portal**: Dedicated dashboard for clients to manage their leads
- **Admin Dashboard**: Comprehensive admin interface with analytics
- **Multi-language**: Full Hebrew and English support (RTL/LTR)
- **Real-time Notifications**: Email and SMS notifications for new leads
- **Analytics**: Visual charts and reports for lead performance

## Tech Stack

### Frontend
- React 18 with Vite
- React Router v6
- Recharts for data visualization
- Lucide React icons
- CSS Variables with RTL support

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Joi Validation
- Nodemailer & Twilio integration

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/qualilead.git
cd qualilead
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/qualilead
JWT_SECRET=your-secret-key
```

5. Start the development server:
```bash
# Start backend
npm run server

# Start frontend (in another terminal)
npm run dev
```

6. Open http://localhost:5173 in your browser

## Project Structure

```
qualilead/
├── src/                    # Frontend source
│   ├── components/         # Reusable React components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin dashboard pages
│   │   └── client/         # Client dashboard pages
│   ├── css/                # Global styles
│   └── App.jsx             # Main app component
├── server/                 # Backend source
│   ├── routes/             # API route handlers
│   ├── models/             # Mongoose models
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   └── index.mongo.js      # Server entry point
├── public/                 # Static assets
└── dist/                   # Production build output
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Leads
- `GET /api/leads` - Get all leads (filtered by role)
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead (admin)
- `PUT /api/leads/:id` - Update lead
- `POST /api/leads/:id/assign` - Assign lead to client
- `POST /api/leads/:id/convert` - Mark as converted
- `POST /api/leads/:id/return` - Return lead
- `DELETE /api/leads/:id` - Delete lead (admin)

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/leads-over-time` - Lead trends
- `GET /api/analytics/leads-by-category` - Category breakdown
- `GET /api/analytics/leads-by-status` - Status breakdown

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing

### Optional Variables
- `SMTP_*` - Email configuration
- `TWILIO_*` - SMS configuration
- `FRONTEND_URL` - For CORS configuration

## Scripts

```bash
npm run dev          # Start frontend dev server
npm run server       # Start backend server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Security Considerations

- Never commit `.env` file to version control
- Use strong JWT secrets in production
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Regularly update dependencies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.
