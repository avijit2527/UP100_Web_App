const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Locations = require('../models/location');

const locationRouter = express.Router();

locationRouter.use(bodyParser.json());

locationRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Locations.find({})
            .then((locations) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(locations);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Locations.create(req.body)
            .then((location) => {
                console.log('Location Created ', location);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(location);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /locations/');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Locations.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



    locationRouter.route('/:locationId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Locations.findById(req.params.locationId)
            .then((location) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(location);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /locations/' + req.params.locationId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Locations.findByIdAndUpdate(req.params.locationId, {
            $set: req.body
        }, { new: true })
            .then((location) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(location);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Locations.findByIdAndRemove(req.params.locationId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })





module.exports = locationRouter;

