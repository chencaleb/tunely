// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');

// generate a new express app and call it 'app'
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var ejs = require('ejs');
var expressSession = require('express-session');
var cookieParser = require("cookie-parser");
var logger = require('morgan');
// mongoose.connect('mongodb://localhost:27017/facebook-authentication-app');
var passport = require("./config/passport");

app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

/************
 * DATABASE *
 ************/

//require models
var db = require("./models");

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

//facebook oauth
app.get('/', function(req, res){
  res.render('layout', {user: req.user});
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'} ));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/api'
  })
);

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


//render album index page
app.get('/', function homepage (req, res) {
  res.render('index');
});

//render genre page
app.get('/api/genres', function genrespage (req, res) {
  res.render('genres');
});

/*
 * JSON API Endpoints
 */

//ALBUM

//api
app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

//album index
app.get('/api/albums', function index (req,res) {
  db.Album.find(function(err, albums) {
    res.json(albums);
  });
});

//create album
app.post('/api/albums', function create(req, res) {
  console.log('body', req.body);

  // split at comma and remove and trailing space
  var genres = req.body.genres.split(',').map(function(item) { return item.trim(); } );
  req.body.genres = genres;

  db.Album.create(req.body, function(err, album) {
    if (err) { console.log('error', err); }
    console.log(album);
    res.json(album);
  });
});

//delete album
app.delete('/api/albums/:id', function deleteAlbum(req, res) {
  console.log('deleting id: ', req.params.id);

  //grabs the album's id
  var id = req.params.id;
  db.Album.remove({_id: id}, function(err) {
    if (err) { return console.log(err); }
    console.log(req.params.id  + "was removed");
    res.status(200).send(); // everything is a-OK
  });
});

// UPDATE//

app.put('/api/albums/:id', function updateAlbum(req, res) {
  console.log('updating id ', req.params.id);
  console.log('received body ', req.body);

  db.Album.findOne({_id: req.params.id}, function(err, Album) {
    if (err) { console.log('error', err); }
    //artistname needed to be adjusted here
    Album.artistName = req.body.artistName;
    Album.name = req.body.name;
    Album.releaseDate = req.body.releaseDate;
    Album.save(function(err, saved) {
      if(err) { console.log('error', err); }
      res.json(saved);
    });
  });
});

//GENRE

//genre index
app.get('/api/genres/index', function genreIndex (req, res) {
  db.Genre.find(function(err, genres) {
    res.json(genres);
  });
});

//create genre
app.post('/api/genres/index', function create(req, res) {

  db.Genre.create(req.body, function(err, genre) {
    if (err) { console.log('error', err); }
    console.log(genre);
    res.json(genre);
  });

});



//UPDATE genre

app.put('/api/genres/:id', function updateGenre(req, res) {
  console.log('updating id ', req.params.id);
  console.log('received body ', req.body);

  db.Genre.findOne({_id: req.params.id}, function(err, Genre) {
    if (err) { console.log('error', err); }
    Genre.name = req.body.name;
    Genre.save(function(err, saved) {
      if(err) { console.log('error', err); }
      res.json(saved);
    });
  });
});


// delete for genres
app.delete('/api/genres/:id', function deleteGenre(req, res) {
  console.log('deleting id: ', req.params.id);

  //grabs the genres's id
  var id = req.params.id;
  db.Genre.remove({_id: id}, function(err) {
    if (err) { return console.log(err); }
    console.log(req.params.id  + "was removed");
    res.status(200).send(); // everything is a-OK
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
