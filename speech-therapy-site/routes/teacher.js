const express = require('express');
const router = express.Router();
const db = require('../models/database');
const auth = require('../middleware/auth');

// Применить middleware ко всем маршрутам
router.use(auth.isAuthenticated);
router.use(auth.isTeacher);

// Главная панель учителя
router.get('/dashboard', (req, res) => {
    const diaryEntries = db.getDiaryByTeacherId(req.session.userId);
    const students = db.getAllStudents().filter(s => s.teacherId === req.session.userId);
    
    res.render('teacher/dashboard', {
        user: req.session,
        diaryEntries,
        students
    });
});

// Электронный дневник
router.get('/diary', (req, res) => {
    const diaryEntries = db.getDiaryByTeacherId(req.session.userId);
    const students = db.getAllStudents().filter(s => s.teacherId === req.session.userId);
    
    res.render('teacher/diary', {
        user: req.session,
        diaryEntries,
        students
    });
});

// Добавить запись в дневник
router.post('/diary/add', (req, res) => {
    const { studentId, date, subject, homework, grade, comment } = req.body;
    
    const newEntry = {
        studentId: parseInt(studentId),
        date,
        subject,
        homework,
        grade: parseInt(grade),
        comment,
        teacherId: req.session.userId
    };
    
    db.addDiaryEntry(newEntry);
    res.redirect('/teacher/diary');
});

// Обновить запись в дневнике
router.post('/diary/update/:id', (req, res) => {
    const { id } = req.params;
    const { date, subject, homework, grade, comment } = req.body;
    
    const updates = {
        date,
        subject,
        homework,
        grade: parseInt(grade),
        comment
    };
    
    db.updateDiaryEntry(parseInt(id), updates);
    res.redirect('/teacher/diary');
});

// Удалить запись из дневника
router.post('/diary/delete/:id', (req, res) => {
    const { id } = req.params;
    db.deleteDiaryEntry(parseInt(id));
    res.redirect('/teacher/diary');
});

// Мои студенты
router.get('/students', (req, res) => {
    const students = db.getAllStudents().filter(s => s.teacherId === req.session.userId);
    res.render('teacher/students', { user: req.session, students });
});

module.exports = router;
