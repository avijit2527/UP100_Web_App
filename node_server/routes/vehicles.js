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
        Vehicles.find(req.query)
            .then((vehicles) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                for(var i=0;i<vehicles.length;i++){
                    vehicles[i].locations = vehicles[i].locations.slice(-24);
                }
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





    vehicleRouter.route('/:vehicleId/locations')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser,  (req, res, next) => {
        Vehicles.findById(req.params.vehicleId)
            .then((vehicle) => {
                if (vehicle != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(vehicle.locations);
                }
                else {
                    err = new Error('Vehicle ' + req.params.vehicleId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vehicles.findById(req.params.vehicleId)
            .then((vehicle) => {
                if (vehicle != null) {
                    vehicle.locations.push(req.body);
                    vehicle.save()
                        .then((vehicle) => {
                            Vehicles.findById(vehicle._id)
                                .then((vehicle) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(vehicle);
                                }, (err) => next(err))
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Vehicle ' + req.params.vehicleId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /vehicle/' + req.params.vehicleId + '/locations');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vehicles.findById(req.params.vehicleId)
            .then((vehicle) => {
                if (vehicle != null) {
                    for (var i = (vehicle.locations.length - 1); i >= 0; i--) {
                        vehicle.locations.id(vehicle.locations[i]._id).remove();
                    }
                    vehicle.save()
                        .then((vehicle) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(vehicle);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Vehicle ' + req.params.vehicleId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });



vehicleRouter.route('/:vehicleId/locations/:locationId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Vehicles.findById(req.params.vehicleId)
            .then((vehicle) => {
                if (vehicle != null && vehicle.locations.id(req.params.locationId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(vehicle.locations.id(req.params.locationId));
                }
                else if (vehicle == null) {
                    err = new Error('Vehicle ' + req.params.vehicleId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Location ' + req.params.locationId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation not supported on /vehicles/' + req.params.vehicleId + '/locations/' + req.params.locationId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vehicles.findById(req.params.vehicleId)
            .then((vehicle) => {
                if (vehicle != null && vehicle.locations.id(req.params.locationId) != null) {
                    if (req.body.lat) {
                        vehicle.locations.id(req.params.locationId).lat = req.body.lat;
                    }
                    if (req.body.lng) {
                        vehicle.locations.id(req.params.locationId).lng = req.body.lng;
                    }
                    vehicle.save()
                        .then((vehicle) => {
                            Vehicles.findById(vehicle._id)
                                .then((vehicle) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(vehicle);
                                }, (err) => next(err));
                        }, (err) => next(err));
                }
                else if (vehicle == null) {
                    err = new Error('Vehicle ' + req.params.vehicleId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Location ' + req.params.locationId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Vehicles.findById(req.params.vehicleId)
            .then((vehicle) => {
                if (vehicle != null && vehicle.locations.id(req.params.locationId) != null) {
                    vehicle.locations.id(req.params.locationId).remove();

                    vehicle.save()
                        .then((vehicle) => {
                            Vehicles.findById(vehicle._id)
                                .then((vehicle) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(vehicle);
                                }, (err) => next(err));
                        }, (err) => next(err));
                }
                else if (vehicle == null) {
                    err = new Error('Vehicle ' + req.params.vehicleId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Location ' + req.params.locationId + ' not found!');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })



module.exports = vehicleRouter;

