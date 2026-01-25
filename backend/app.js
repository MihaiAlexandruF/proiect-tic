const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const listingRoutes = require('./routes/listingRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
const db = require('./config/firebase');
const path = require('path');

// Middleware
app.use(cors());
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