const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const db = require('../config/firebase');
const { ro } = require('@faker-js/faker');

router.get('/',async (req, res) => {
    try {
        const snapshot = await db.collection('listings').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la preluarea anunturilor', error });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const newListing = { ...req.body, ownerId: req.user.uid, createdAt: new Date().toISOString()     };
        const docRef = await db.collection('listings').add(newListing);
        res.status(201).json({ id: docRef.id, ...newListing });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la crearea anuntului', error });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('listings').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Anuntul nu a fost gasit' });
        }
        await docRef.update(req.body);
        res.status(200).json({ id: doc.id, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la actualizarea anuntului', error });
    }
});

module.exports = router;