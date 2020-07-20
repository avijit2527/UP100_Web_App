const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Zones = require('../models/zone');

const zonesRouter = express.Router();

zonesRouter.use(bodyParser.json());

zonesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser,  (req, res, next) => {
        //console.log(req.query);
        Zones.find(req.query)
            .then((crimes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(crimes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Zones.create(req.body)
            .then((zones) => {
                console.log('Zone Created ', zones);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(zones);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = zonesRouter;

