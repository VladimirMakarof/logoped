const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Парсинг данных форм
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Сессии
const session = require('express-session');
app.use(session({
    secret: 'speech-therapy-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Маршруты
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);

// Главная страница
app.get('/', (req, res) => {
    res.render('index', { user: req.session || null });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('\nТестовые учетные записи:');
    console.log('Администратор: admin / admin123');
    console.log('Учитель: teacher / teacher123');
    console.log('Ученик: student / student123');
});
