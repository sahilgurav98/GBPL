const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Blog = require('../models/Blog');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('image/')) {
            cb(null, true);
            return;
        }

        cb(new Error('Only image files are allowed.'));
    }
}).single('imageFile');

router.get('/', async (req, res) => {
    const [matches, players, blogs] = await Promise.all([
        Match.find().sort({ date: -1 }),
        Player.find().sort({ runs: -1 }),
        Blog.find().sort({ date: -1 })
    ]);

    res.render('admin/dashboard', {
        matches,
        players,
        blogs,
        currentPath: '/admin'
    });
});

router.post('/blog/add', (req, res) => {
    upload(req, res, async err => {
        if (err) {
            res.status(400).send(err.message || 'Error uploading file.');
            return;
        }

        const externalUrl = (req.body.imageUrl || '').trim();
        const newBlog = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: externalUrl || (req.file ? `/uploads/${req.file.filename}` : '')
        };

        await Blog.create(newBlog);
        res.redirect('/admin');
    });
});

router.post('/blog/delete/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

router.post('/match/add', async (req, res) => {
    await Match.create({
        season: req.body.season,
        teamA: req.body.teamA,
        teamB: req.body.teamB,
        scoreA: req.body.scoreA,
        scoreB: req.body.scoreB,
        result: req.body.result,
        description: req.body.description,
        venue: req.body.venue
    });

    res.redirect('/admin');
});

router.post('/match/delete/:id', async (req, res) => {
    await Match.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

router.post('/player/add', async (req, res) => {
    await Player.create(req.body);
    res.redirect('/admin');
});

router.post('/player/update/:id', async (req, res) => {
    await Player.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin');
});

router.post('/player/delete/:id', async (req, res) => {
    await Player.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

module.exports = router;
