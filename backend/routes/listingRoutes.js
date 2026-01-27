const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/firebase');

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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const snapshot = await db.collection('listings')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .offset(offset)
            .get();

        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Eroare la preluarea anunturilor', error });
    }
});

// IMPORTANT: Rutele specifice ÎNAINTE de rutele cu parametri dinamici!
router.get('/my-listings', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const snapshot = await db.collection('listings').where('ownerId','==',uid).get();
        if(snapshot.empty) {
            return res.status(200).json([]);
        }
        const myListings = snapshot.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
        }));
        res.status(200).json(myListings);
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

router.get('/owner/:listingId', verifyToken, async (req, res) => {
    try {
        const listingId = req.params.listingId;
        const listingDoc = await db.collection('listings').doc(listingId).get();
        if (!listingDoc.exists) return res.status(404).json({ message: 'Anunțul nu a fost găsit' });

        const listingData = listingDoc.data();
        const ownerUid = listingData.ownerId || listingData.userId || listingData.uid;
        if (!ownerUid) return res.status(404).json({ message: 'Proprietarul nu este setat pe anunț' });

        const userDoc = await db.collection('users').doc(ownerUid).get();
        if (!userDoc.exists) return res.status(404).json({ message: 'Proprietarul nu a fost găsit' });

        const u = userDoc.data();
        res.status(200).json({
            id: userDoc.id,
            firstname: u.firstname || null,
            lastname: u.lastname || null,
            phone: u.phone || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la preluarea proprietarului', error: error.message });
    }
});

router.patch('/changeStatus/:id', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const docRef = db.collection('listings').doc(req.params.id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return res.status(404).json({ message: 'Anunțul nu a fost găsit' });
        }

        const listingData = docSnap.data();
        if (uid !== listingData.ownerId) {
            return res.status(403).json({ message: 'Nu ai dreptul de modificare' });
        }
        const currentStatus = listingData.meta?.status || 'inactive';
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        await docRef.update({
            "meta.status": newStatus
        });

        res.status(200).json({ 
            message: `Anunțul este acum ${newStatus}`, 
            status: newStatus 
        });
    } catch (error) {
        console.error("Eroare backend:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('listings').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Anuntul nu a fost gasit' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la preluarea anuntului', error });
    }
});

router.post('/', verifyToken, upload.array('images', 8), async (req, res) => {
    try {
        const uid = req.user.uid;
        const listingId = req.listingId || Date.now() + Math.random().toString(36).substring(2, 12);

        const imagePaths = req.files ? req.files.map(file => {
            return `/uploads/${uid}/${listingId}/${file.filename}`;
        }) : [];

        const newListing = {
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            region: req.body.region,
            locality: req.body.locality,
            street: req.body.street,
            specs: req.body.specs ? JSON.parse(req.body.specs) : {},
            costs: req.body.costs ? JSON.parse(req.body.costs) : {},
            rules: req.body.rules ? JSON.parse(req.body.rules) : {},
            meta: req.body.meta ? JSON.parse(req.body.meta) : {
                status: 'active',
                viewsCount: 0,
                favoritesCount: 0
            },
            images: imagePaths,
            ownerId: uid,
            createdAt: new Date().toISOString()
        };

        await db.collection('listings').doc(listingId).set(newListing);
        
        res.status(201).json({ id: listingId, ...newListing });
    } catch (error) {
        res.status(500).json({ message: 'Eroare la crearea anuntului', error: error.message });
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