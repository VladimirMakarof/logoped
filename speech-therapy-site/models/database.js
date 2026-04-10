const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataFile = path.join(__dirname, '..', 'data', 'users.json');
const diaryFile = path.join(__dirname, '..', 'data', 'diary.json');

// Инициализация файлов данных
function initDataFiles() {
    if (!fs.existsSync(dataFile)) {
        const initialUsers = [
            {
                id: 1,
                username: 'admin',
                password: bcrypt.hashSync('admin123', 8),
                role: 'admin',
                fullName: 'Администратор'
            },
            {
                id: 2,
                username: 'teacher',
                password: bcrypt.hashSync('teacher123', 8),
                role: 'teacher',
                fullName: 'Иванова Мария Петровна'
            },
            {
                id: 3,
                username: 'student',
                password: bcrypt.hashSync('student123', 8),
                role: 'student',
                fullName: 'Петров Алексей',
                teacherId: 2
            }
        ];
        fs.writeFileSync(dataFile, JSON.stringify(initialUsers, null, 2));
    }

    if (!fs.existsSync(diaryFile)) {
        const initialDiary = [
            {
                id: 1,
                studentId: 3,
                date: '2025-01-15',
                subject: 'Постановка звука [Р]',
                homework: 'Упражнение 1, страница 15',
                grade: 4,
                comment: 'Хороший прогресс',
                teacherId: 2
            }
        ];
        fs.writeFileSync(diaryFile, JSON.stringify(initialDiary, null, 2));
    }
}

// Получить всех пользователей
function getAllUsers() {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
}

// Найти пользователя по username
function getUserByUsername(username) {
    const users = getAllUsers();
    return users.find(u => u.username === username);
}

// Найти пользователя по ID
function getUserById(id) {
    const users = getAllUsers();
    return users.find(u => u.id === id);
}

// Получить всех студентов
function getAllStudents() {
    const users = getAllUsers();
    return users.filter(u => u.role === 'student');
}

// Получить всех учителей
function getAllTeachers() {
    const users = getAllUsers();
    return users.filter(u => u.role === 'teacher');
}

// Добавить пользователя
function addUser(user) {
    const users = getAllUsers();
    user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    user.password = bcrypt.hashSync(user.password, 8);
    users.push(user);
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
    return user;
}

// Обновить пользователя
function updateUser(id, updates) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
        return users[index];
    }
    return null;
}

// Удалить пользователя
function deleteUser(id) {
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length < users.length) {
        fs.writeFileSync(dataFile, JSON.stringify(filtered, null, 2));
        return true;
    }
    return false;
}

// Получить все записи дневника
function getAllDiaryEntries() {
    const data = fs.readFileSync(diaryFile, 'utf8');
    return JSON.parse(data);
}

// Получить записи дневника для студента
function getDiaryByStudentId(studentId) {
    const entries = getAllDiaryEntries();
    return entries.filter(e => e.studentId === studentId);
}

// Получить записи дневника для учителя
function getDiaryByTeacherId(teacherId) {
    const entries = getAllDiaryEntries();
    return entries.filter(e => e.teacherId === teacherId);
}

// Добавить запись в дневник
function addDiaryEntry(entry) {
    const entries = getAllDiaryEntries();
    entry.id = entries.length > 0 ? Math.max(...entries.map(e => e.id)) + 1 : 1;
    entries.push(entry);
    fs.writeFileSync(diaryFile, JSON.stringify(entries, null, 2));
    return entry;
}

// Обновить запись в дневнике
function updateDiaryEntry(id, updates) {
    const entries = getAllDiaryEntries();
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
        entries[index] = { ...entries[index], ...updates };
        fs.writeFileSync(diaryFile, JSON.stringify(entries, null, 2));
        return entries[index];
    }
    return null;
}

// Удалить запись из дневника
function deleteDiaryEntry(id) {
    const entries = getAllDiaryEntries();
    const filtered = entries.filter(e => e.id !== id);
    if (filtered.length < entries.length) {
        fs.writeFileSync(diaryFile, JSON.stringify(filtered, null, 2));
        return true;
    }
    return false;
}

initDataFiles();

module.exports = {
    getAllUsers,
    getUserByUsername,
    getUserById,
    getAllStudents,
    getAllTeachers,
    addUser,
    updateUser,
    deleteUser,
    getAllDiaryEntries,
    getDiaryByStudentId,
    getDiaryByTeacherId,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry
};
