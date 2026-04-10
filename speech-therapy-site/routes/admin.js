const express = require('express');
const router = express.Router();
const db = require('../models/database');
const auth = require('../middleware/auth');

// Применить middleware ко всем маршрутам
router.use(auth.isAuthenticated);
router.use(auth.isAdmin);

// Главная панель администратора
router.get('/dashboard', (req, res) => {
    const students = db.getAllStudents();
    const teachers = db.getAllTeachers();
    const diaryEntries = db.getAllDiaryEntries();
    
    res.render('admin/dashboard', {
        user: req.session,
        students,
        teachers,
        diaryEntries
    });
});

// Управление пользователями
router.get('/users', (req, res) => {
    const users = db.getAllUsers();
    res.render('admin/users', { user: req.session, users });
});

// Добавить пользователя
router.post('/users/add', (req, res) => {
    const { username, password, fullName, role, teacherId } = req.body;
    
    const newUser = {
        username,
        password,
        fullName,
        role
    };
    
    if (role === 'student' && teacherId) {
        newUser.teacherId = parseInt(teacherId);
    }
    
    db.addUser(newUser);
    res.redirect('/admin/users');
});

// Обновить пользователя
router.post('/users/update/:id', (req, res) => {
    const { id } = req.params;
    const { fullName, role, teacherId } = req.body;
    
    const updates = { fullName, role };
    if (role === 'student' && teacherId) {
        updates.teacherId = parseInt(teacherId);
    }
    
    db.updateUser(parseInt(id), updates);
    res.redirect('/admin/users');
});

// Удалить пользователя
router.post('/users/delete/:id', (req, res) => {
    const { id } = req.params;
    db.deleteUser(parseInt(id));
    res.redirect('/admin/users');
});

// Управление дневником
router.get('/diary', (req, res) => {
    const entries = db.getAllDiaryEntries();
    const students = db.getAllStudents();
    const teachers = db.getAllTeachers();
    res.render('admin/diary', { user: req.session, entries, students, teachers });
});

// Добавить запись в дневник
router.post('/diary/add', (req, res) => {
    const { studentId, date, subject, homework, grade, comment, teacherId } = req.body;
    
    const newEntry = {
        studentId: parseInt(studentId),
        date,
        subject,
        homework,
        grade: parseInt(grade),
        comment,
        teacherId: parseInt(teacherId)
    };
    
    db.addDiaryEntry(newEntry);
    res.redirect('/admin/diary');
});

// Удалить запись из дневника
router.post('/diary/delete/:id', (req, res) => {
    const { id } = req.params;
    db.deleteDiaryEntry(parseInt(id));
    res.redirect('/admin/diary');
});

module.exports = router;
