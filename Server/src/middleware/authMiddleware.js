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
        console.error('Token verification error:', error);
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Validation middleware for user registration
export const validateRegistration = (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate role if provided
    if (role && !['visitor', 'organizer'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be either "visitor" or "organizer"' });
    }

    next();
};

// Validation middleware for event creation
export const validateEvent = (req, res, next) => {
    // Log the entire request for debugging
    console.log('Validation - Full request body:', req.body);
    console.log('Validation - Content-Type:', req.headers['content-type']);
    console.log('Validation - Raw body:', req.body.toString ? req.body.toString() : req.body);
    
    // For multipart/form-data, all fields come as strings
    const { name, description, location, date, time, price } = req.body;

    // Log each field value
    console.log('Validation - Field values:', {
        name: name,
        description: description,
        location: location,
        date: date,
        time: time,
        price: price
    });

    // Check if any required field is missing or empty
    const missingFields = [];
    if (!name || (typeof name === 'string' && name.trim() === '')) missingFields.push('name');
    if (!description || (typeof description === 'string' && description.trim() === '')) missingFields.push('description');
    if (!location || (typeof location === 'string' && location.trim() === '')) missingFields.push('location');
    if (!date || (typeof date === 'string' && date.trim() === '')) missingFields.push('date');
    if (!time || (typeof time === 'string' && time.trim() === '')) missingFields.push('time');
    if (!price || (typeof price === 'string' && price.trim() === '')) missingFields.push('price');

    if (missingFields.length > 0) {
        console.log('Validation - Missing fields:', missingFields);
        return res.status(400).json({ 
            message: 'All fields are required',
            missingFields: missingFields,
            receivedData: req.body
        });
    }

    // Convert price to number and validate
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
        console.log('Validation - Invalid price:', price);
        return res.status(400).json({ 
            message: 'Price must be a valid number',
            receivedPrice: price
        });
    }
    if (priceNum < 0) {
        console.log('Validation - Negative price:', priceNum);
        return res.status(400).json({ 
            message: 'Price must be a positive number',
            receivedPrice: priceNum
        });
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        console.log('Validation - Invalid date:', date);
        return res.status(400).json({ 
            message: 'Invalid date format',
            receivedDate: date
        });
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
        console.log('Validation - Invalid time:', time);
        return res.status(400).json({ 
            message: 'Invalid time format. Use HH:mm format',
            receivedTime: time
        });
    }

    // Add the parsed values back to the request body
    req.body.price = priceNum;
    req.body.date = dateObj;

    console.log('Validation - All checks passed');
    next();
}; 