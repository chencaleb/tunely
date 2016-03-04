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

//user bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

//app setup
app.use(methodOverride('_method'));

//views
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

app.get('/', function homepage (req, res) {
  res.render('index');
});

/*
 * JSON API Endpoints
 */

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

//index
app.get('/api/albums', function index (req,res) {
  db.Album.find(function(err, albums) {
    res.json(albums);
  });
});

//create
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

app.put('/api/albums/:id',function(req,res){

  Album.findById(req.params, function(err, album){

    if (err)
      res.send(err);
    album.name = req.body.name;


    album.save(function(err){
      if (err)
        res.send(err);

      res.json({message: 'Its updated'});


    });

  });

});

//delete 
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

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
