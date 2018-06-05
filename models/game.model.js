const mongooes = require('mongoose');
const Schema = mongooes.Schema;

const GameModel = new Schema({
    player: [String],
    round: [{
        score: [{
            player: String,
            pscore: Number
        }]
    }]
})

module.exports = mongooes.model('Game', GameModel);

