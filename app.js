const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongooes = require('mongoose');
const Game = require('./models/game.model.js');

mongooes.connect('mongodb://localhost/Game', (err) => {
    if (err) console.log(err)
    else console.log('DB connect success');
})

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
    res.render('home');
});

var gameID;

app.post('/api/game',(req,res)=>{
    console.log(req.body)
    const newGame = {
        player: req.body.player
    }
    console.log(newGame);
    Game.create(newGame,(err, gameCreated)=>{
        if (err) res.status(500).send({ success: 0, err })
        else{
            gameID = gameCreated._id;
            res.send({ success: 1, gameId: gameCreated._id })
        } 
    });
})


app.get('/game/:id', (req, res) => {
    Game.findById(req.params.id, (err,game) => {
        if (err) console.log(err)
        else{
            res.render('game',{
            player1: game.player[0],
            player2: game.player[1],
            player3: game.player[2],
            player4: game.player[3],            
            })
        }
    })
})

app.post('/api/round',(req,res)=>{
    Game.findById(gameID,(err,game)=>{
        if(err) throw err;
        let player1 = game.player[0]
        let player2 = game.player[1]
        let player3 = game.player[2]
        let player4 = game.player[3]

        let score1 = parseInt(req.body.p1s) 
        let score2 = parseInt(req.body.p2s)
        let score3 = parseInt(req.body.p3s)
        let score4 = parseInt(req.body.p4s)

        console.log(score1)

        game.round.push({
            score: [{
                player: player1,
                pscore :score1
            },
            {
                player: player2,
                pscore :score2
            },
            {
                player: player3,
                pscore :score3
            },
            {
                player: player4,
                pscore :score4
            }]
        })

        game.save((err)=>{
            if(err) console.log("Error");
        })
    })
})

app.use(express.static('public'));

app.listen(8000, function (err) {
    if (err) console.log(err)
    else console.log('Server is up');
})




