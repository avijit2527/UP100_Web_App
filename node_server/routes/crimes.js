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
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log({
            zone: req.query.zone,
            lat: {
                $lte: req.query.latlte,
                $gte: req.query.latgte
            },
            lng: {
                $lte: req.query.lnglte,
                $gte: req.query.lnggte
            }
        });
        Crimes.find({
            zone: req.query.zone,
            lat: {
                $lte: req.query.latlte,
                $gte: req.query.latgte
            },
            lng: {
                $lte: req.query.lnglte,
                $gte: req.query.lnggte
            }
        })
            .then((crimes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(crimes);
            }, (err) => next(err))
            .catch((err) => {
                console.log(err);
                next(err);
            });
    })

module.exports = crimeRouter;

