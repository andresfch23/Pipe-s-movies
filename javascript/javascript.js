$(document).ready(function(){
    var id = 'c0b2e256491361d28c75bbe8f9e59a85';
    var baseUrl = 'https://api.themoviedb.org/3/';
    var getGenresUrl = `${baseUrl}genre/movie/list?api_key=${id}&language=en-US`;
    var imageBaseUrl = 'http://image.tmdb.org/t/p/w500';
    var $navbarButton = $('.js-navbar-button');
    var $leftMenu = $(".main__left-menu");
    var $listMovie = $(".js-list-movie");
    var $leftSelect = $(".js-left-select");
    
    // Function to toggle left menu
    var onToggleMenu = () => $leftMenu.toggle();
    $navbarButton.click(onToggleMenu);

    // Initial state aplication, Function to get movie genres 
    $.get(getGenresUrl, onGetGenres);

    // Function to render select options
    function onGetGenres(results) {
        var firstGenreId = results.genres[0].id;
        var getMoviesGenre = `${baseUrl}genre/${firstGenreId}/movies?api_key=${id}&language=en-US&include_adult=false&sort_by=created_at.asc`;
        onRenderSelectOptions(results);
        $.get(getMoviesGenre, onRenderMoviesFirstGenre);
    };

    var onRenderSelectOptions = (results) => {
        results.genres.forEach((genre) => {
            $leftSelect.append(`<option value=${genre.id}>${genre.name}</option>`);
        });
    }

    // Function to render Movies on the left menu
    function onRenderMoviesFirstGenre(movies) {
        var year = '';
        movies.results.forEach((movie) => {
            year = movie.release_date.substring(0,4);
            $listMovie.append(`<div class=main__left-menu-container><div class=main__left-menu-movie><a href=#><img src=${imageBaseUrl+movie.poster_path} alt= Image of "${movie.title}" movie class=main__left-menu-image></a><h4 class=main__left-menu-title>${movie.title}</h4><span class=main__left-menu-text>${year}</span></div></div>`);
        });
    };

    // Function to get Movies of the genre selected by user
    $leftSelect.change(() => {
        var selectedGenreId = $(this).find("option:selected").val();    
        var getMoviesGenre = `${baseUrl}genre/${selectedGenreId}/movies?api_key=${id}&language=en-US&include_adult=true&sort_by=created_at.asc`;
        $.get(getMoviesGenre, (response) => {
            $listMovie.empty();
            onRenderMoviesFirstGenre(response);
        });
    });
});
