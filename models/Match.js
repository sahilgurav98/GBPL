const mongoose = require('mongoose');
const matchSchema = new mongoose.Schema({
    season: String,
    teamA: String,
    teamB: String,
    scoreA: String,
    scoreB: String,
    result: String,
    description: String,
    date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Match', matchSchema);