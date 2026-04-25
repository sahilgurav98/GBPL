const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Blog = require('../models/Blog');

function decorateBlogs(blogs) {
    return blogs.map(blog => ({
        ...blog.toObject(),
        displayTitle: blog.title || '',
        displayDescription: blog.description || ''
    }));
}

function decorateMatches(matches) {
    return matches.map(match => ({
        ...match.toObject(),
        displayResult: match.result || '',
        displayDescription: match.description || ''
    }));
}

router.get('/', async (req, res) => {
    try {
        const [blogs, matches, players] = await Promise.all([
            Blog.find().sort({ date: -1 }).limit(6),
            Match.find().sort({ date: -1 }).limit(4),
            Player.find().sort({ runs: -1 })
        ]);

        const localizedBlogs = decorateBlogs(blogs);
        const localizedMatches = decorateMatches(matches);
        const topRunScorer = players[0] || null;
        const topWicketTaker = [...players].sort((a, b) => b.wickets - a.wickets)[0] || null;

        res.render('index', {
            blogs: localizedBlogs,
            matches: localizedMatches,
            topRunScorer,
            topWicketTaker,
            counts: {
                players: players.length,
                matches: await Match.countDocuments(),
                blogs: await Blog.countDocuments()
            },
            user: req.session.userId,
            isAdmin: req.session.isAdmin,
            currentPath: '/'
        });
    } catch (err) {
        res.status(500).send('Error loading homepage');
    }
});

router.get('/matches', async (req, res) => {
    try {
        const matches = await Match.find().sort({ date: -1 });
        res.render('matches', {
            matches: decorateMatches(matches),
            user: req.session.userId,
            isAdmin: req.session.isAdmin,
            currentPath: '/matches'
        });
    } catch (err) {
        res.status(500).send('Error loading matches');
    }
});

router.get('/stats', async (req, res) => {
    try {
        const players = await Player.find().sort({ runs: -1, wickets: -1, matchesPlayed: -1 });
        const topWicketTakers = [...players].sort((a, b) => b.wickets - a.wickets).slice(0, 3);

        res.render('stats', {
            players,
            topWicketTakers,
            user: req.session.userId,
            isAdmin: req.session.isAdmin,
            currentPath: '/stats'
        });
    } catch (err) {
        res.status(500).send('Error loading stats');
    }
});

router.get('/login', (req, res) => res.render('login', { currentPath: '/login' }));
router.get('/signup', (req, res) => res.render('signup', { currentPath: '/signup' }));

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const isFirstUser = (await User.countDocuments()) === 0;
        await User.create({ username, password: hashedPassword, isAdmin: isFirstUser });
        res.redirect('/login');
    } catch (err) {
        res.status(400).send('Error signing up. Username may already exist.');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;
        res.redirect(user.isAdmin ? '/admin' : '/');
        return;
    }

    res.status(401).send("Invalid login. <a href='/login'>Try again</a>");
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
