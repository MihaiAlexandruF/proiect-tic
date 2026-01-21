const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/firebase');
const { ro } = require('@faker-js/faker');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uid = req.user.uid;
        if (!req.listingId) {
            req.listingId = Date.now() + Math.random().toString(36).substring(2, 12);
        }
        const uploadPath = path.join(__dirname, '../uploads/', uid, req.listingId);

        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/',async (req, res) => {
    try {
        const snapshot = await db.collection('listings').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la preluarea anunturilor', error });
    }
});

router.post('/', verifyToken, upload.array('images', 8), async (req, res) => {
    try {
        const uid = req.user.uid;
        const listingId = req.listingId;

        const imagePaths = req.files.map(file => {
            return `/uploads/${uid}/${listingId}/${file.filename}`;
        });
        const newListing = {
            ...req.body,
            images: imagePaths,
            ownerId: uid,
            createdAt: new Date().toISOString()
        };
        await db.collection('listings').doc(listingId).set(newListing);
        res.status(201).json({ id: listingId, ...newListing });
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