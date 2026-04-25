const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleMr: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    description: { type: String, required: true },
    descriptionMr: { type: String, default: '' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
