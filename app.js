const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const { getDictionary } = require('./utils/i18n');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
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
