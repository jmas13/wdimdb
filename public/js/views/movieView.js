function MovieView(movie){
  this.movie = movie;
  this.html = document.createElement("div");
  this.html.setAttribute("data-imdbid", this.movie.imdbId);
  this.html.addEventListener("click", this.onClick.bind(this));
  this.template();
};

MovieView.toggleFavorites = function(){
  var favoritesDiv = document.getElementById("favorites");
  if (!favoritesDiv.innerHTML){
    MovieView.renderFavorites();
  }
  else{
    (favoritesDiv.style.display == "none") ? favoritesDiv.style.display = "block" : favoritesDiv.style.display = "none";
  }
}

MovieView.renderFavorites = function(){
  var favViews = Movie.favs.map(function(movie){
    return new MovieView(movie);
  });
  favViews.forEach(function(favView){
    favView.renderAt("favorites")
  });
};

MovieView.renderSearch = function(searchStr){
  document.getElementById("results").innerHTML = null;
  Movie.search(searchStr)
  .then(function(searchResults){
    var searchViews = searchResults.map(function(searchResult){
      return new MovieView(searchResult);
    });
    searchViews.forEach(function(searchView){
      searchView.renderAt("results")
    });
  })
};


MovieView.prototype.template = function(){
  var titleStr = "<h3>" + this.movie.title + " <span class='heart'" + (this.movie.isFavorite() ? "style='color: red'" : "") + ">&hearts;</span></h3>";
  var yrStr = "<p>released: " + this.movie.year + "</p>";
  var extendedInfo = "<p class='info'>more info</p><div class='extendedInfo'></div>"
  this.html.innerHTML = titleStr + yrStr + extendedInfo;
};

MovieView.prototype.renderAt = function(locationId){
  var target = document.getElementById(locationId);
  target.appendChild(this.html);
};

MovieView.prototype.onClick = function(event){
  if (event.target.classList.contains("heart")){
    this.movie.makeFavorite().then(function(){
      document.getElementById('favorites').innerHTML = null;
      MovieView.renderFavorites();
    });
  }
  else{
    this.toggleExtendedInfo()
  }
}

MovieView.prototype.toggleExtendedInfo = function(){
  var extInfo = this.html.querySelector(".extendedInfo");
  if (!extInfo.innerHTML){
    Movie.moreInfo(this.movie.imdbId)
    .then(function(info){
      info = JSON.parse(info);
      for (var attr in info){
        extInfo.innerHTML += "<p>" + attr + ": " + info[attr] + "</p>";
      }
    })
  }
  else{
    (extInfo.style.display == "none") ? extInfo.style.display = "block" : extInfo.style.display = "none";
  }
}
