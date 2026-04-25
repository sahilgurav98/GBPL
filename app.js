const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const { getDictionary } = require('./utils/i18n');
require('dotenv').config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'gbpl-development-session-secret',
    resave: false,
    saveUninitialized: false,
    proxy: isProduction,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use((req, res, next) => {
    req.lang = 'en';
    res.locals.lang = 'en';
    res.locals.t = getDictionary();
    next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('DB Connection Error:', err));

app.use('/', require('./routes/public'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
