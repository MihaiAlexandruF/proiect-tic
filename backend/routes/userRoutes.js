const express = require('express');
const router = express.Router();
const db = require('../config/firebase');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { uid, email, firstname, lastname , phone } = req.body;

        const userProfile ={
            firstname,
            lastname,
            email: email,
            role: 'user',
            phone: phone,
            createdAt: new Date().toISOString()
        };

        const userRef = db.collection('users').doc(uid);
        await userRef.set(userProfile);
        res.status(201).json({ message: 'Utilizator creat cu succes', profile: userProfile });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la crearea utilizatorului', error });
    }
});

module.exports = router;