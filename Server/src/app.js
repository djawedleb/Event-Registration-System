import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import UserRoutes from './routes/UserRoutes.js';
import EventRoutes from './routes/EventRoutes.js';
import RegistrationRoutes from './routes/Registration.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use absolute path for uploads directory
const uploadsPath = path.resolve('D:/Backend-Projects/Event-Registration-System/Server/public/uploads');
console.log('Uploads directory absolute path:', uploadsPath);

// Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
    console.error('Uploads directory does not exist:', uploadsPath);
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('Created uploads directory');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));
app.use(morgan('dev'));

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsPath, {
    setHeaders: (res, filePath, stat) => {
        console.log('Serving file:', filePath);
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('Access-Control-Allow-Origin', '*');
    }
}));

// Test route to verify file access
app.get('/test-uploads', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsPath);
        console.log('Files in uploads directory:', files);
        res.json({
            message: 'Uploads directory contents',
            path: uploadsPath,
            files: files
        });
    } catch (error) {
        console.error('Error reading uploads directory:', error);
        res.status(500).json({
            message: 'Error reading uploads directory',
            error: error.message,
            path: uploadsPath
        });
    }
});

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
    console.log(`Uploads directory: ${uploadsPath}`);
});

export default app;