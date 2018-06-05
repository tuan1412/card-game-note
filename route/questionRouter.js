const express = require('express');
const fs = require('fs');
const path = require('path')
const QuestionModel = require('../models/question.model.js');

const Router = express.Router();

Router.get('/:id', (req, res) => {
    const idQuestion = req.params.id;
    QuestionModel.findById(idQuestion, (err, question) => {
        if (err) console.log(err)
        else {
            const totalVote = question.yes + question.no;
            const percentYes = totalVote != 0 ? (question.yes  / (question.yes + question.no) * 100).toFixed(0) : 50
            const percentNo = totalVote != 0 ? (question.no  / (question.yes + question.no) * 100).toFixed(0) : 50
            res.render('question', {
                question,
                totalVote,
                percentYes,
                percentNo
            });
        }
        
    });
})

Router.get('/:id/:vote', (req, res) => {
    const vote = req.params.vote;
    const idQuestion = req.params.id;

    // QuestionModel.findByIdAndUpdate(idQuestion, { $inc: { [vote]: 1 } }, (err, question) => {
    //     if (err) console.log(err);
    //     else res.redirect(`/question/${idQuestion}`)
    // })

    QuestionModel.findById(idQuestion, (err, questionFound) => {
        if (err) console.log(err);
        else {
            questionFound[vote] += 1;

            questionFound.save((err, question) => {
                if (err) console.log(err);
                else res.redirect(`/question/${idQuestion}`)
            });
        }

    })
});

module.exports = Router;