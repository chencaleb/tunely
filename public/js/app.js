/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */
/* hard-coded data! */
var sampleAlbums = [];
sampleAlbums.push({
             artistName: 'Ladyhawke',
             name: 'Ladyhawke',
             releaseDate: '2008, November 18',
             genres: [ 'new wave', 'indie rock', 'synth pop' ]
           });
sampleAlbums.push({
             artistName: 'The Knife',
             name: 'Silent Shout',
             releaseDate: '2006, February 17',
             genres: [ 'synth pop', 'electronica', 'experimental' ]
           });
sampleAlbums.push({
             artistName: 'Juno Reactor',
             name: 'Shango',
             releaseDate: '2000, October 9',
             genres: [ 'electronic', 'goa trance', 'tribal house' ]
           });
sampleAlbums.push({
             artistName: 'Philip Wesley',
             name: 'Dark Night of the Soul',
             releaseDate: '2008, September 12',
             genres: [ 'piano' ]
           });
/* end of hard-coded data */

$(document).ready(function() {
  console.log('app.js loaded!');

// AJAX album methods
  //get method
  $.get('/api/albums').success(function (albums) {
    console.log(albums);
    albums.forEach(function(album) {
      renderAlbum(album);
    });
  });

  //post method
  $('#album-form form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    console.log('formData', formData);
    $.post('/api/albums', formData, function(album) {
      console.log('album after POST', album);
      renderAlbum(album);  //render the server's response
    });
    $(this).trigger("reset");
  });

  //on click, the genre delete button will run the DeleteAlbum function
  $('#albums').on('click', '.delete-album', DeleteAlbum);

  $('#albums').on('click', '.edit-album', EditAlbum);

  $('#albums').on('click', '.put-album', SaveChanges);

   $('#genres').on('click', '.edit-genre', EditGenre);

  $('#genres').on('click', '.put-genre', SaveGenre);

  //update method
  function getAlbumRowById(id) {
    return $('[data-album-id=' + id + ']');
  }

  function EditAlbum(e) {
    var albumId = $(this).parents('.album').data('album-id');
    var $albumRow = getAlbumRowById(albumId);

    console.log('attempt to edit id', albumId);

    // replace edit button with save button
    $(this).parent().find('.btn').hide();
    $(this).parent().find('.default-hidden').show();

    // replace current spans with inputs
    var albumName = $albumRow.find('span.album-name').text();
    $albumRow.find('span.album-name').html('<input class="edit-album-name" value="' + albumName + '"></input>');

    var artistName = $albumRow.find('span.artist-name').text();
    $albumRow.find('span.artist-name').html('<input class="edit-artist-name" value="' + artistName + '"></input>');

    var releaseDate = $albumRow.find('span.album-release-date').text();
    $albumRow.find('span.album-release-date').html('<input class="edit-album-release-date" value="' + releaseDate + '"></input>');
}

function SaveChanges(e) {
  var albumId = $(this).parents('.album').data('album-id');
  var $albumRow = getAlbumRowById(albumId);

  var data = {
    name: $albumRow.find('.edit-album-name').val(),
    artistName: $albumRow.find('.edit-artist-name').val(),
    releaseDate: $albumRow.find('.edit-album-release-date').val()
  };

  $.ajax({
    method: 'PUT',
    url: '/api/albums/' + albumId,
    data: data,
    success: function(data) {
      console.log(data);
      $albumRow.replaceWith(generateAlbumHtml(data));
    }
  });

    window.location.href = '/';
}








// UPDATE GENRES 

 function getGenreRowById(id) {
    return $('[data-genre-id=' + id + ']');
  }


function EditGenre(e) {
    var genreId = $(this).parents('.genre').data('genre-id');
    var $genreRow = getGenreRowById(genreId);

    console.log('attempt to edit id', genreId);

    // replace edit button with save button
    $(this).parent().find('.btn').hide();
    $(this).parent().find('.default-hidden').show();

    // replace current spans with inputs
    var genreName = $genreRow.find('span.genre-name').text();
    $genreRow.find('span.genre-name').html('<input class="edit-genre-name" value="' + genreName + '"></input>');

 
}

function SaveGenre(e) {
  var genreId = $(this).parents('.genre').data('genre-id');
  var $genreRow = getGenreRowById(genreId);

  var data = {
    name: $genreRow.find('.edit-genre-name').val()
  };


  $.ajax({
    method: 'PUT',
    url: '/api/genres/' + genreId,
    data: data,
    success: function(data) {
      console.log(data);
      $genreRow.replaceWith(renderGenre(data));
    }
  });

    window.location.href = '/api/genres';
}







// AJAX genre methods
  //get method
  $.get('/api/genres/index').success(function (genres) {
    genres.forEach(function(genre) {
      renderGenre(genre);
    });
  });

  //post method
  $('#genre-form form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    // console.log('formData', formData);
    $.post('/api/genres/index', formData, function(genre) {
      // console.log('genre after POST', genre);
      renderGenre(genre);  //render the server's response
    });
    $(this).trigger("reset");
  });


  //on click, the genre delete button will run the DeleteGenre function
  $('#genres').on('click', '.delete-genre', DeleteGenre);

  //serializes form data logs it and clears form
  $("form").on("submit", function(event) {
    event.preventDefault();
    $(this).serialize();
    $("form").trigger("reset");
  });


});

//This function deletes album
function DeleteAlbum(e) {
//this grabs the album id from the hard-coded html
  var albumId = $(this).parents('.album').data('album-id');
  console.log('deleting album with id =' + albumId );
//jquery does not have a delete method, so we just use ajax
  $.ajax({
    method: 'DELETE',
    url: ('/api/albums/' + albumId),
    success: function() {
      console.log("just deleted album");
      //concatenates the album ID to grab the html data for specific album
      $('[data-album-id='+ albumId + ']').remove();
    }
  });
}

//This function deletes genre
function DeleteGenre(e) {
//this grabs the album id from the hard-coded html
  var genreId = $(this).parents('.genre').data('genre-id');
  console.log('deleting genre with id =' + genreId );
//jquery does not have a delete method, so we just use ajax
  $.ajax({
    method: 'DELETE',
    url: ('/api/genres/' + genreId),
    success: function() {
      console.log("just deleted genre");
      //concatenates the album ID to grab the html data for specific album
      $('[data-genre-id='+ genreId + ']').remove();
    }
  });
}
// end delete genre here


// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album:', album);

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + album.coverImage + "' alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-release-date'>" + album.releaseDate + "</span>" +
  "                      </li>" +
 
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                <button class='btn btn-color edit-album'>Edit Album</button>" +
  "                <button class='btn btn-color put-album default-hidden'>Save Changes</button>" +
  "                <button class='btn btn-color delete-album'>Delete Album</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  $("#albums").append(albumHtml);
}

function renderGenre(genre){

  var genreHtml = "        <!-- one genre -->" +
  "        <div class='row genre' data-genre-id='" + genre._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin genre internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail genre-art'>" +
  "                     <img src='" + genre.coverImage + "' alt='genre image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>genre Name:</h4>" +
  "                        <span class='genre-name'>" + genre.name + "</span>" +
  "                      </li>" +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "              <!-- end of genre internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                <button class='btn btn-color edit-genre'>Edit Album</button>" +
  "                <button class='btn btn-color put-genre default-hidden'>Save Changes</button>" +
  "                <button class='btn btn-color delete-genre'>Delete Genre</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "         </div>" +
  "          <!-- end one genre -->";

  $("#genres").append(genreHtml);
}


