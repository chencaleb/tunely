var mongoose = require("mongoose");
var Album = require("../models/album");
var Schema = mongoose.Schema;

var AlbumSchema = new Schema({
    artistName: String,
    name: String,
    releaseDate: String,
    coverImage: String,
    genres: [String]
});

var GenreSchema = new Schema({
 name: String,
 coverImage: String,

 albums: [AlbumSchema]
});

var Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;