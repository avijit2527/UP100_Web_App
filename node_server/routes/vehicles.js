const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Vehicles = require('../models/vehicle');

const vehicleRouter = express.Router();

vehicleRouter.use(bodyParser.json());

vehicleRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser,  (req, res, next) => {
        Vehicles.find({})
            .then((vehicles) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vehicles);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vehicles.create(req.body)
            .then((vehicles) => {
                console.log('Vehicle Created ', vehicles);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vehicles);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /vehicles/');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vehicles.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });



    vehicleRouter.route('/:vehicleId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
        Vehicles.findById(req.params.vehicleId)
            .then((vehicles) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vehicles);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /vehicles/' + req.params.vehicleId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vehicles.findByIdAndUpdate(req.params.vehicleId, {
            $set: req.body
        }, { new: true })
            .then((vehicle) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(vehicle);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vehicles.findByIdAndRemove(req.params.vehicleId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })





module.exports = vehicleRouter;

