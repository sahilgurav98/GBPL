const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Blog = require('../models/Blog');

// 1. Homepage (Blogs Only)
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 });
        res.render('index', { blogs, user: req.session.userId, isAdmin: req.session.isAdmin });
    } catch (err) { res.send("Error loading homepage"); }
});

// 2. Matches Page
router.get('/matches', async (req, res) => {
    try {
        const matches = await Match.find().sort({ date: -1 });
        res.render('matches', { matches, user: req.session.userId, isAdmin: req.session.isAdmin });
    } catch (err) { res.send("Error loading matches"); }
});

// 3. Stats Page
router.get('/stats', async (req, res) => {
    try {
        const players = await Player.find().sort({ runs: -1 });
        res.render('stats', { players, user: req.session.userId, isAdmin: req.session.isAdmin });
    } catch (err) { res.send("Error loading stats"); }
});

// --- AUTH ROUTES ---
router.get('/login', (req, res) => res.render('login'));
router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const isFirstUser = (await User.countDocuments()) === 0;
        await User.create({ username, password: hashedPassword, isAdmin: isFirstUser });
        res.redirect('/login');
    } catch (err) { res.send("Error signing up (Username might exist)"); }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;
        res.redirect(user.isAdmin ? '/admin' : '/');
    } else {
        res.send("Invalid login. <a href='/login'>Try again</a>");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;