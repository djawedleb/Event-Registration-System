# Event Registration System

A full-stack web application for managing event registrations, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication (Register/Login)
- Event Management (Create, Read, Update, Delete)
- Event Registration
- User Profile Management
- Role-based Access Control
- File Upload Support
- Responsive Material-UI Design

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Router DOM
- Axios for API calls
- Date-fns for date handling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- Helmet for security
- CORS enabled
- Morgan for logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for production)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/djawedleb/event-registration-system.git
cd event-registration-system
```

2. Install backend dependencies:
```bash
cd Server
npm install
```

3. Install frontend dependencies:
```bash
cd ../my-app
npm install
```

4. Create a `.env` file in the `Server` directory with the following variables for **local development**:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-registration
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

## Running the Application

1. Start the backend server:
```bash
cd Server
npm run dev
```

2. Start the frontend development server:
```bash
cd ../my-app
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Deployment

This application is deployed as a full-stack solution, with the frontend and backend hosted separately, connected to a MongoDB Atlas cloud database. This deployment reflects the culmination of the internship project.

-   **Frontend (React.js):** Deployed on [Vercel](https://vercel.com/)
    *   Live URL: [https://event-registration-system-five.vercel.app](https://event-registration-system-five.vercel.app)
    *   Environment Variable `REACT_APP_API_URL` is configured in the Vercel dashboard to point to the deployed backend API (e.g., `https://event-registration-system-71tf.onrender.com/api`).

-   **Backend (Node.js/Express.js):** Deployed on [Render](https://render.com/)
    *   Live URL: [https://event-registration-system-71tf.onrender.com](https://event-registration-system-71tf.onrender.com)
    *   Environment Variables (`NODE_ENV=production`, `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`) are securely configured in the Render dashboard.

-   **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
    *   A free-tier MongoDB Atlas cluster is used for the production database, enabling a robust and scalable data store.

**Note:** Sensitive environment variables are crucial for successful deployment and must be securely configured in the respective hosting platform's environment settings, never committed directly to the repository.

## API Endpoints

### Authentication
- POST /api/users/Register - Register a new user
- POST /api/users/Login - Login user

### Events
- GET /api/events - Get all events
- POST /api/events - Create new event
- GET /api/events/:id - Get event by ID
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event

### Registrations
- POST /api/registrations - Register for an event
- GET /api/registrations - Get all registrations
- GET /api/registrations/:id - Get registration by ID

## Project Structure

```
event-registration-system/
├── Server/                 # Backend directory
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── config/        # Configuration files
│   │   └── app.js         # Express app setup
│   └── public/            # Upload directory
│
└── my-app/                # Frontend directory
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   └── App.js        # Main App component
    └── public/           # Static files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

DJAWED LEBAILI - djawedlebaili156@gmail.com

Project Link: [https://github.com/djawedleb/event-registration-system](https://github.com/djawedleb/event-registration-system)
