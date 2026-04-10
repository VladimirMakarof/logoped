module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session && req.session.userId) {
            return next();
        }
        res.redirect('/login');
    },

    isAdmin: (req, res, next) => {
        if (req.session && req.session.role === 'admin') {
            return next();
        }
        res.status(403).send('Доступ запрещен');
    },

    isTeacher: (req, res, next) => {
        if (req.session && req.session.role === 'teacher') {
            return next();
        }
        res.status(403).send('Доступ запрещен');
    },

    isStudent: (req, res, next) => {
        if (req.session && req.session.role === 'student') {
            return next();
        }
        res.status(403).send('Доступ запрещен');
    }
};
