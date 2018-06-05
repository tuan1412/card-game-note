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

app.post('/api/game',(req,res)=>{
    console.log(req.body)
    const newGame = {
        player: req.body.player
    }
    console.log(newGame);
    Game.create(newGame,(err, gameCreated)=>{
        if (err) res.status(500).send({ success: 0, err })
        else res.send({ success: 1, gameId: gameCreated._id })
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



app.use(express.static('public'));

app.listen(8000, function (err) {
    if (err) console.log(err)
    else console.log('Server is up');
})




