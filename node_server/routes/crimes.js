const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Crimes = require('../models/crime');

const crimeRouter = express.Router();

crimeRouter.use(bodyParser.json());

crimeRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser,  (req, res, next) => {
        console.log(req.query);
        Crimes.find(req.query)
            .then((crimes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(crimes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = crimeRouter;

