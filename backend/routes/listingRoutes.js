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

        const title = req.query.title;
        const county = req.query.county;
        const city = req.query.city;
        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
        const rooms = req.query.rooms;
        const surface = req.query.surface ? Number(req.query.surface) : null;
        const features = req.query.features;

        let query = db.collection('listings');

        query = query.orderBy('createdAt', 'desc');

        const fetchLimit = limit * 3;
        query = query.limit(fetchLimit);

        const snapshot = await query.get();
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (county) {
            const countyLower = county.toLowerCase();
            data = data.filter(listing => {
                const listingRegion = listing.region || '';
                return listingRegion.toLowerCase() === countyLower;
            });
        }

        if (city) {
            const cityLower = city.toLowerCase();
            data = data.filter(listing => {
                const listingCity = listing.locality || '';
                return listingCity.toLowerCase().includes(cityLower);
            });
        }

        if (title) {
            const titleLower = title.toLowerCase();
            data = data.filter(listing => {
                const listingTitle = listing.title || '';
                return listingTitle.toLowerCase().includes(titleLower);
            });
        }

        if (minPrice !== null) {
            data = data.filter(listing => {
                const listingPrice = Number(listing.price) || 0;
                return listingPrice >= minPrice;
            });
        }

        if (maxPrice !== null) {
            data = data.filter(listing => {
                const listingPrice = Number(listing.price) || 0;
                return listingPrice <= maxPrice;
            });
        }

        if (rooms) {
            data = data.filter(listing => {
                const listingRooms = listing.specs?.rooms;
                if (rooms === '4+') {
                    return listingRooms >= 4;
                }
                return listingRooms == Number(rooms);
            });
        }

        if (surface !== null) {
            data = data.filter(listing => {
                const listingSurface = Number(listing.specs?.surface) || 0;
                return listingSurface >= surface;
            });
        }

        if (features) {
            const featureArray = features.split(',');
            data = data.filter(listing => {
                const listingSpecs = listing.specs || {};
                return featureArray.every(feature => {
                    if (feature === 'mobilat') {
                        return listingSpecs.furnished === 'furnished';
                    }
                    if (feature === 'centrala') {
                        return listingSpecs.heating === 'central_heating' || listingSpecs.heating === 'private_boiler';
                    }
                    return false;
                });
            });
        }

        const offset = (page - 1) * limit;
        const paginatedData = data.slice(offset, offset + limit);

        res.status(200).json(paginatedData);
    } catch (error) {
        console.error('Eroare la preluarea anunturilor:', error);
        res.status(500).json({ message: 'Eroare la preluarea anunturilor', error: error.message });
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

router.put('/:id', verifyToken, upload.array('images', 8), async (req, res) => {
    try {
        const uid = req.user.uid;
        const docRef = db.collection('listings').doc(req.params.id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Anuntul nu a fost gasit' });
        }

        const listingData = doc.data();
        if (uid !== listingData.ownerId) {
            return res.status(403).json({ message: 'Nu ai dreptul de modificare' });
        }

        // Parse JSON
        const parsedSpecs = req.body.specs ? JSON.parse(req.body.specs) : listingData.specs;
        const parsedCosts = req.body.costs ? JSON.parse(req.body.costs) : listingData.costs;
        const parsedRules = req.body.rules ? JSON.parse(req.body.rules) : listingData.rules;
        const parsedMeta = req.body.meta ? JSON.parse(req.body.meta) : listingData.meta;
        const parsedExistingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];

        // Imagini noi
        const newImagePaths = req.files ? req.files.map(file => {
            return `/uploads/${uid}/${req.params.id}/${file.filename}`;
        }) : [];

        const allImages = [...parsedExistingImages, ...newImagePaths];

        const updatedData = {
            title: req.body.title || listingData.title,
            description: req.body.description || listingData.description,
            price: req.body.price ? Number(req.body.price) : listingData.price,
            region: req.body.region || listingData.region,
            locality: req.body.locality || listingData.locality,
            street: req.body.street || listingData.street,
            specs: parsedSpecs,
            costs: parsedCosts,
            rules: parsedRules,
            meta: parsedMeta,
            images: allImages,
            updatedAt: new Date().toISOString()
        };

        await docRef.update(updatedData);
        res.status(200).json({ id: req.params.id, ...updatedData });
    } catch (error) {
        console.error('Eroare:', error);
        res.status(500).json({ message: 'Eroare la actualizare', error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const listingId = req.params.id;
        
        const docRef = db.collection('listings').doc(listingId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Anuntul nu a fost gasit' });
        }

        const listingData = doc.data();
        if (uid !== listingData.ownerId) {
            return res.status(403).json({ message: 'Nu ai dreptul sa stergi acest anunt' });
        }

        const uploadPath = path.join(__dirname, '../uploads/', uid, listingId);
        if (fs.existsSync(uploadPath)) {
            fs.rmSync(uploadPath, { recursive: true, force: true });
        }

        await docRef.delete();
        
        res.status(200).json({ message: 'Anunt sters cu succes' });
    } catch (error) {
        console.error('Eroare la stergere:', error);
        res.status(500).json({ message: 'Eroare la stergerea anuntului', error: error.message });
    }
});

module.exports = router;