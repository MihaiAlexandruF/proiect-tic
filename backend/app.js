const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const listingRoutes = require('./routes/listingRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
const db = require('./config/firebase');
const path = require('path');

const allowedOrigins = [
    'http://localhost:5173',
];

app.use(cors({
    origin: function (origin, callback) {
        console.log('Origin primit:', origin);
        
        if (!origin || 
            allowedOrigins.indexOf(origin) !== -1 || 
            (origin && origin.endsWith('.vercel.app'))) {
            console.log('CORS: Access permis pentru', origin);
            callback(null, true);
        } else {
            console.log('CORS: Access respins pentru', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});