var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GenreSchema = new Schema({
  name: String
});

var Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
