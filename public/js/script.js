var stf = new Movie({"title":"Stranger than Fiction","year":"2006","imdbId":"tt0420223","type":"movie"});
Movie.favorites();
var favoritesHeading = document.getElementById('favoritesHeading');
var searchButton = document.querySelector('#search');
var searchField = document.querySelector('#searchField')
searchButton.addEventListener("click", function(e){
  e.preventDefault();
  var searchText = searchField.value;
  searchField.value = '';
  MovieView.renderSearch(searchText);
});
favoritesHeading.addEventListener("click", function(e){
  MovieView.toggleFavorites();
})
