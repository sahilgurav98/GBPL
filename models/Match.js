const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    season: { type: String, default: '' },
    teamA: { type: String, required: true },
    teamB: { type: String, required: true },
    scoreA: { type: String, default: '' },
    scoreB: { type: String, default: '' },
    result: { type: String, required: true },
    resultMr: { type: String, default: '' },
    description: { type: String, default: '' },
    descriptionMr: { type: String, default: '' },
    venue: { type: String, default: '' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
