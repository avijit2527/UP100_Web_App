const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite')

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('dishes.dish')
            .populate('user')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites) {
                    for (var i = (req.body.length - 1); i >= 0; i--) {
                        var flag = false;
                        for (var j = (favorites.dishes.length - 1); j >= 0; j--) {
                            if (req.body[i]._id === favorites.dishes[j].dish) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            favorites.dishes.push(req.body[i]._id);
                        }
                    }

                    favorites.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else {
                    var tempArray = [];
                    for (var i = (req.body.length - 1); i >= 0; i--) {
                        tempArray.push({ dish: req.body[i]._id });
                    }
                    tempFavorites = {
                        user: req.user._id,
                        dishes: tempArray
                    }
                    Favorites.create(tempFavorites)
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndDelete({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));

    })


favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('get operation not supported on /favorites/:dishId');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (favorites) {
                    var flag = false;
                    for (var j = (favorites.dishes.length - 1); j >= 0; j--) {
                        if (req.params.dishId === favorites.dishes[j].dish) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        favorites.dishes.push({ dish: req.params.dishId });
                    }


                    favorites.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else {
                    var tempArray = [];
                    tempArray.push({ dish: req.params.dishId });

                    tempFavorites = {
                        user: req.user._id,
                        dishes: tempArray
                    }
                    Favorites.create(tempFavorites)
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (!favorites) {
                    var err = new Error('No entry found for deleting!');
                    next(err);
                }
                var temp = []
                for (var j = (favorites.dishes.length - 1); j >= 0; j--) {
                    console.log(favorites.dishes[j])
                    if (!favorites.dishes[j].dish.equals(req.params.dishId)) {
                        temp.push(favorites.dishes[j]);
                    }
                }
                favorites.dishes = temp;
                favorites.save()
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));

    })

module.exports = favoriteRouter;

