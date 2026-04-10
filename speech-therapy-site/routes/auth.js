const express = require('express');
const router = express.Router();
const db = require('../models/database');
const bcrypt = require('bcryptjs');

// Страница входа
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Обработка входа
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = db.getUserByUsername(username);
    
    if (!user) {
        return res.render('login', { error: 'Пользователь не найден' });
    }
    
    const validPassword = bcrypt.compareSync(password, user.password);
    
    if (!validPassword) {
        return res.render('login', { error: 'Неверный пароль' });
    }
    
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.fullName = user.fullName;
    
    // Перенаправление в зависимости от роли
    switch(user.role) {
        case 'admin':
            res.redirect('/admin/dashboard');
            break;
        case 'teacher':
            res.redirect('/teacher/dashboard');
            break;
        case 'student':
            res.redirect('/student/dashboard');
            break;
        default:
            res.redirect('/');
    }
});

// Выход
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
