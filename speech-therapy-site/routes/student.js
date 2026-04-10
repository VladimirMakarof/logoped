const express = require('express');
const router = express.Router();
const db = require('../models/database');
const auth = require('../middleware/auth');

// Применить middleware ко всем маршрутам
router.use(auth.isAuthenticated);
router.use(auth.isStudent);

// Главная панель студента
router.get('/dashboard', (req, res) => {
    const diaryEntries = db.getDiaryByStudentId(req.session.userId);
    
    res.render('student/dashboard', {
        user: req.session,
        diaryEntries
    });
});

// Электронный дневник
router.get('/diary', (req, res) => {
    const diaryEntries = db.getDiaryByStudentId(req.session.userId);
    
    res.render('student/diary', {
        user: req.session,
        diaryEntries
    });
});

module.exports = router;
