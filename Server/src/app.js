import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import UserRoutes from './routes/UserRoutes.js';
import EventRoutes from './routes/EventRoutes.js';
import RegistrationRoutes from './routes/Registration.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/users', UserRoutes);
app.use('/api/events', EventRoutes);
app.use('/api/registrations', RegistrationRoutes);
// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;