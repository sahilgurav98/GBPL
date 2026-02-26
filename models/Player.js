const mongoose = require('mongoose');
const playerSchema = new mongoose.Schema({
    name: String,
    matchesPlayed: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 }
});
module.exports = mongoose.model('Player', playerSchema);