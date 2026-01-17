const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
    console.log('Header Authorization:', req.headers.authorization);
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        console.log('Token lipseste');
        return res.status(401).json({ message: 'Tokenul lipseste' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token invalid' });
    }
};

module.exports = verifyToken;