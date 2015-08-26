var Movie = function(movieData){
  this.title = (movieData.title || movieData.Title); //accounting for omdb's naming conventions
  this.year = (+movieData.year || +movieData.Year); //+ prefix works like Number() (I think)
  this.imdbId = (movieData.imdbId || movieData.imdbID);
  this.type = (movieData.type || movieData.Type);
  this.favorite = movieData.favorite;
};

Movie.favorites = function(){ //Populates Movie.favs with an array of movies from favorites
  var url = "/favorites";
  var request = get(url)
  .then(function(responseText){
    var responseJson = JSON.parse(responseText); //parse responseText (str) to JSON
    var movies = [];
    responseJson.forEach(function(movie){
      movies.push(new Movie(movie));
    });
    Movie.favs = movies; //This seems very wrong. What I'm trying to avoid is a server call every time I see if search results are favorited already
  });
  return request;
};

Movie.search = function(searchString){ //returns promise containing array of movies from searching omdb
  var url = "https://www.omdbapi.com/?s=" + searchString;
  var request = get(url)
  .then(function(responseText){
    var responseArray = JSON.parse(responseText).Search;
    var movies = [];
    responseArray.forEach(function(movie){
      movies.push(new Movie(movie));
    })
    console.log(movies);
    return movies
  })
  .catch(function(error){
    return []; //Return empty array if errors with search
  })
  return request;
};

Movie.moreInfo = function(id){
  var url = "https://www.omdbapi.com/?i=" + id;
  var request = get(url);
  return request;
}

Movie.prototype.isFavorite = function(){  //This is dependent on Movie.favorites() having been run. Tried to add a conditional dealing with this but found myself on the road to promise hell again.
  if (this.favorite){return true}
  else if (!Movie.favs){return false} //If there is a server error and favorites can't be fetched, there are no favorites. I think I may have spent the last hour battling imaginary monsters
  else{
    return Movie.favs.some(function(movie){
      return (this.imdbId === movie.imdbId) //Check if any of the movies in favs have the same imdbId as the movie in question
    }.bind(this)) //need to bind this or else this will refer to window
  }
};

Movie.prototype.makeFavorite = function(){ //will add a movie to favorites -- does nothing if already a favorite
  if (this.isFavorite()) return;
  var url = "/favorites"
  var movieData = {
    title: this.title,
    year: this.year,
    imdbId: this.imdbId,
    type: this.type,
    favorite: true
  };
  var movieData = JSON.stringify(movieData);
  var request = post(url, movieData)
  .then(function(responseText){
    var responseJson = JSON.parse(responseText); //Same as above
    var movies = [];
    responseJson.forEach(function(movie){
      movies.push(new Movie(movie));
    });
    Movie.favs = movies;
  });
  return request;
};

//Prolly gonna want to put this someplace else
//Straight out of Eloquent JS
function get(url) {
  return new Promise(function(succeed, fail) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function() {
      if (req.status < 400)
        succeed(req.responseText);
      else
        fail(new Error("Request failed: " + req.statusText));
    });
    req.addEventListener("error", function() {
      fail(new Error("Network error"));
    });
    req.send(null);
  });
}
function post(url, object) {
  return new Promise(function(succeed, fail) {
    var req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json") //Specify content type using request header
    req.addEventListener("load", function() {
      if (req.status < 400)
        succeed(req.responseText);
      else
        fail(new Error("Request failed: " + req.statusText));
    });
    req.addEventListener("error", function() {
      fail(new Error("Network error"));
    });
    req.send(object);
  });
}
