import jwt from 'jsonwebtoken';

// Authentication middleware
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Validation middleware for user registration
export const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    next();
};

// Validation middleware for event creation
export const validateEvent = (req, res, next) => {
    const { name, description, location, date, time, price } = req.body;

    if (!name || !description || !location || !date || !time || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (price < 0) {
        return res.status(400).json({ message: 'Price cannot be negative' });
    }

    next();
}; 