const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const NearestLocations = require('../models/nearestLocation');

const nearestLocationRouter = express.Router();

nearestLocationRouter.use(bodyParser.json());

nearestLocationRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser,  (req, res, next) => {
        console.log(req.body);
        NearestLocations.find(({
            zone : req.body.zone,
            location: {
             $near: {
              $geometry: {
               type: "Point",
               coordinates: [req.body.lat, req.body.long]
              }
             }
            }
           }))
            .then((nearestLocations) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(nearestLocations);
            }, (err) => next(err))
            .catch((err) => next(err)); 
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        NearestLocations.create(req.body)
            .then((nearestLocations) => {
                console.log('Vehicle Created ', nearestLocations);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(nearestLocations);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /vehicles/');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        NearestLocations.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = nearestLocationRouter;

