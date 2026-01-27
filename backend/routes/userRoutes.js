const express = require('express');
const router = express.Router();
const db = require('../config/firebase');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
  try {
    // Luam uid din token (req.user) sau din body ca backup
    const uid = req.user?.uid || req.body.uid;

    if (!uid) {
      console.log("EROARE: UID-ul lipseste!");
      return res.status(400).json({ message: 'UID lipsa' });
    }

    const { email, firstname, lastname, phone } = req.body;

    const userProfile = {
      firstname: firstname || '',
      lastname: lastname || '',
      email: email || '',
      phone: phone || '',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    console.log("Incercam salvarea in Firestore pentru UID:", uid);
    
    await db.collection('users').doc(uid).set(userProfile);
    
    res.status(201).json({ message: 'Succes', profile: userProfile });
  } catch (error) {
    // Aici vezi in terminalul de VS Code eroarea reala!
    console.error("Eroare detaliata server:", error); 
    res.status(500).json({ message: 'Eroare interna', error: error.message });
  }
});

module.exports = router;