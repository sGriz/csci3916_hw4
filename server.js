/*
CSC3916 HW3
File: server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
var Review = require('./Reviews')

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}


router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

        res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

router.route('/movies/:id')
    .get(authJwtController.isAuthenticated, function(req, res) {
        var search_title = req.params['id'].replaceAll("_", " ");//replace the '_' characters with whitespaces for the search functionality
        Movie.findOne({ title: { $regex: search_title, $options: "i" } }, function(err, movs) {
            if (err || movs==null){
                res.json({success: false, msg: 'Could not find a movie.', err});
            }
            else{
                if (req.query.reviews === 'true'){//reviews
                    Review.find({ movieTitle: { $regex: search_title, $options: "i" } }, function(err, revs) {
                        if (err){
                            res.json({success: false, msg: 'Error searching for movie reviews.', movs, err});
                        }
                        else{
                            var sumRating = 0;
                            var avgRating = 0;
                            for (i=0; i<revs.length ;i++){
                                avgRating += revs[i].rating;
                            }
                            avgRating = (sumRating / revs.length);
                            res.json({msg: 'Successfully searched for a movie and reviews.', movs, revs, avgRating});
                        }
                    });
                }
                else{
                    res.json({success: true, msg: 'Successfully searched for a movie.', movs});
                }
            }
        });
    }
    )
    .delete(authJwtController.isAuthenticated, function(req, res) {
        var search_title = req.params['id'].replaceAll("_", " ");//replace the '_' characters with whitespaces for the search functionality
        Movie.deleteOne({ title: { $regex: search_title, $options: "i" } }, function(err, docs) {
            if (err){
                res.json({success: false, msg: 'Could not delete a movie.', err});
            }
            else{
                res.json({success: true, msg: 'Successfully deleted a movie.', docs});
            }
        });
    }
    )
    .put(authJwtController.isAuthenticated, function(req, res) {
        var movie = new Movie();
        search_title = req.params['id'].replaceAll("_", " ");//replace the '_' characters with whitespaces for the search functionality
        Movie.updateOne({ title: search_title }, req.body, { runValidators: true }, function(err, docs) {
            if (err){
                res.json({success: false, msg: 'Could not update a movie.', err});
            }
            else{
                res.json({success: true, msg: 'Successfully updated a movie.', docs});
            }
        });
    }
    );

router.route('/movies')
    .post(authJwtController.isAuthenticated, function(req, res) {
        if (!req.body.title || !req.body.year || !req.body.genre || !req.body.actors || !req.body.imageUrl) {
            res.json({success: false, msg: 'Please include a title, year, genre, image url, and three actors (actor names and character names) to add a movie to the database.'})
        } else {
            var movie = new Movie();
            movie.title = req.body.title;
            movie.year = req.body.year;
            movie.genre = req.body.genre;
            movie.actors = req.body.actors;
            movie.imageUrl = req.body.imageUrl;

            movie.save(function(err){
                if (err) {
                    if (err.code == 11000)
                        return res.json({ success: false, msg: 'A movie with that title already exists.'});
                    else
                        return res.json(err);
                }

            var o = getJSONObjectForMovieRequirement(req);
            res.json({success: true, msg: 'Successfully added a movie.', o})
            });
        }
    }
    )
    .get(authJwtController.isAuthenticated, function(req, res) {
        Movie.find( function(err, movs) {
            if (err || movs==null){
                res.json({success: false, msg: 'Could not find any movies.', err});
            }
            else{
                if (req.query.reviews === 'true'){//reviews
                    Review.find( function(err, revs) {
                        if (err){
                            res.json({success: false, msg: 'Error searching for movie reviews.', movs, err});
                        }
                        else{
                            res.json({msg: 'Successfully searched for movies and reviews.', movs, revs});
                        }
                    });
                }
                else{
                    res.json({success: true, msg: 'Successfully searched for movies.', movs});
                }
            }
        });
    }
    );

router.route('/reviews/:id')
    .get(authJwtController.isAuthenticated, function(req, res) {
        var search_title = req.params['id'].replaceAll("_", " ");//replace the '_' characters with whitespaces for the search functionality
        Review.find({ movieTitle: { $regex: search_title, $options: "i" } }, function(err, revs) {
            if (err || revs==null){
                res.json({success: false, msg: 'Could not find reviews', err});
            }
            else{
                res.json({success: true, msg: 'Successfully searched reviews', revs});
            }
        });
    }
    )
    .post(authJwtController.isAuthenticated, function(req, res) {
        var search_title = req.params['id'].replaceAll("_", " ");//replace the '_' characters with whitespaces for the search functionality
        if (!req.body.quote || !req.body.rating) {
            res.json({success: false, msg: 'Please include a quote and a rating between 0 and 5.'})
        } else {
            Movie.findOne({ title: { $regex: search_title, $options: "i" } }, function(err, movs) {
                if (err || movs==null){
                    res.json({success: false, msg: 'Failed to search for a movie.', err});
                }
                else{
                    if (movs.title.length > 0){//check that a movie title was found
                        var review = new Review();
                        review.movieTitle = movs.title;
                        review.name = req.user.username;
                        review.quote = req.body.quote;
                        review.rating = req.body.rating;

                        review.save(function(err){
                            if (err) {
                                return res.json(err);
                            }

                        var o = getJSONObjectForMovieRequirement(req);
                        res.json({success: true, msg: 'Successfully added a review.', o})
                        });
                    }
                    else{
                        res.json({success: false, msg: 'Movie title was not found, so a review was not created'});
                    }
                }
            });
        }
    }
    );

router.route('/reviews')
    .get(authJwtController.isAuthenticated, function(req, res) {
        Review.find( function(err, revs) {
            if (err || revs==null){
                res.json({success: false, msg: 'Could not find any reviews.', err});
            }
            else{
                res.json({success: true, msg: 'Successfully searched for reviews.', revs});
            }
        });
    }
    );

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only
