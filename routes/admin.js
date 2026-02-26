const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Blog = require('../models/Blog');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

// --- MULTER SETUP FOR IMAGE UPLOADS ---
const storage = multer.diskStorage({
    destination: './public/uploads/', // Where images will be saved
    filename: function(req, file, cb) {
        // Renames file to avoid duplicates: imageFile-168432345.jpg
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 } // Limit file size to 5MB
}).single('imageFile'); // 'imageFile' will be the name of our input field

// --- DASHBOARD ROUTE ---
router.get('/', async (req, res) => {
    const matches = await Match.find().sort({date: -1});
    const players = await Player.find().sort({runs: -1});
    const blogs = await Blog.find().sort({date: -1});
    res.render('admin/dashboard', { matches, players, blogs });
});

// --- BLOG ACTIONS (Updated for Image Upload) ---
router.post('/blog/add', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.send("Error uploading file.");
        }
        
        // Construct the image URL path if a file was uploaded
        const newBlog = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.file ? '/uploads/' + req.file.filename : '' // Save the path to DB
        };

        await Blog.create(newBlog);
        res.redirect('/admin');
    });
});

router.post('/blog/delete/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

// --- MATCH ACTIONS (Remains exactly the same) ---
router.post('/match/add', async (req, res) => {
    await Match.create(req.body);
    res.redirect('/admin');
});
router.post('/match/delete/:id', async (req, res) => {
    await Match.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

// --- PLAYER ACTIONS (Remains exactly the same) ---
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