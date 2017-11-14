$(document).ready(function(){   
    var key = 'c0b2e256491361d28c75bbe8f9e59a85';
    var baseUrl = 'https://api.themoviedb.org/3/';
    var imageUrl = 'http://image.tmdb.org/t/p/w500';
    var imageUrlBackDrop = 'http://image.tmdb.org/t/p/w1920';
    var $navbarButton = $('.js-navbar-button');
    var $leftSelect = $('.js-left-select');
    var $leftMenu = $('.main__left-menu');
    var $favoriteMovies = [];
    var $leftMenuContainer = $('.main__left-menu-container');
    var $descriptionVideo = $('.main__description-video');
    var $descriptionTitle = $('.main__description-title');
    var $descriptionText = $('.main__description-text');
    var $grid = $('.grid');
    var $descriptionContainer = $('.main__description-container');
    
    // Function to toggle the left menu
    var onToggleMenu = () => $leftMenu.toggle();
    $navbarButton.click(onToggleMenu);
    
    // Function to get movie genres
    var getGenresUrl = `${baseUrl}genre/movie/list?api_key=${key}&language=en-US`;
    $.get(getGenresUrl, onGetGenres); 

    function onGetGenres(result) {
        onRenderSelectOptions(result);
        $leftSelect.append(`<option value=favorites>Favorites</option>`);
        $('.js-left-select option[value="favorites"]').hide();
        // Function to render the movies on the left menu
        var firstGenreId = result.genres[0].id;
        var getMoviesGenreUrl = `${baseUrl}genre/${firstGenreId}/movies?api_key=${key}&language=en-US&include_adult=false&sort_by=created_at.asc`;
        $.get(getMoviesGenreUrl, OnRenderMoviesGenre);
    }
    
    function OnRenderMoviesGenre(movies) {
        movies.results.forEach(appendMoviesLeft);
        // Function to render the movies with the click event

        // Function to get the information of the first movie in the list on the left menu
        var idMovie = movies.results[0].id
        var urlInfoMovie = `${baseUrl}movie/${idMovie}?api_key=${key}&append_to_response=videos`;
        $.get(urlInfoMovie, getInfoMovie); 

        // Function to get the similar movies of the first movie in the list on the left menu
        var urlSimilarMovies = `${baseUrl}movie/${idMovie}/similar?api_key=${key}&language=en-US&page=1`;
        $.get(urlSimilarMovies, getSimilarMovies);
    }

    function getSimilarMovies(similars) {
        similars.results.forEach(function(similar){
            var year = similar.release_date.substring(0,4);
            $grid.append(`<div class="grid__item one-quarter main__gallery-item"><img class=main__gallery-image src=${imageUrl+similar.poster_path} alt="poster of movie '${similar.title}'"><div class=main__gallery-info><h4 class=main__gallery-title>${similar.title}</h4><span class=main__gallery-text>${year}</span></div></div>`);
        });
    }

    function getInfoMovie(infoMovie) {
        var idMovie = infoMovie.id
        $descriptionVideo.prepend(`<iframe class=main__video width=560 height=315 src=https://www.youtube.com/embed/${infoMovie.videos.results[0].key} frameborder=0 allowfullscreen=></iframe>`);
        $descriptionTitle.append(`${infoMovie.title}`);
        $descriptionText.append(`${infoMovie.overview}`);
        $('.js-main').css('background-image', 'url('+imageUrlBackDrop+infoMovie.backdrop_path+')');
        $('.main__description-button').remove();
        $descriptionContainer.append(`<button type=button class='main__description-button js-button' data-id=${idMovie}>ADD TO FAVORITES</button>`);
        var text = $("button[data-id='" + idMovie +"']").text();
        if($.inArray(idMovie, $favoriteMovies) !== -1) {
            $('.js-button').addClass('main__description-button--add');
            text = text.replace('ADD TO FAVORITES', 'REMOVE FROM FAVORITES');
            $('.js-button').text(text);
        }
        $("button[data-id='" + idMovie +"']").click(favoriteMovies);   
    }

    function favoriteMovies(){
        var idMovie = $(this).data('id');
        var classBtn = $(this).attr('class');
        var text = $(this).text();

        if (classBtn === 'main__description-button js-button'){
            $('.js-button').addClass('main__description-button--add');
            text = text.replace('ADD TO FAVORITES', 'REMOVE FROM FAVORITES');
            $('.js-button').text(text);
            $favoriteMovies.unshift(idMovie);
            var favoriteArray = $favoriteMovies.length;
            if (favoriteArray > 0){
                $('.js-left-select option[value="favorites"]').show();
            }
        } else {
            var removeItem = idMovie;
            $('.js-button').removeClass('main__description-button--add');
            text = text.replace('REMOVE FROM FAVORITES', 'ADD TO FAVORITES');
            $('.js-button').text(text);
            $favoriteMovies = $.grep($favoriteMovies, function(value){
                return value != removeItem;
            });
            var favoriteArray = $favoriteMovies.length;
            if (favoriteArray  < 1){
                $('.js-left-select option[value="favorites"]').hide();
            }
        }
    }

    function onRenderMovieInfo() {
        var idMovie = $(this).data('id');
        $descriptionVideo.empty();
        $descriptionTitle.empty();
        $descriptionText.empty();
        $grid.empty();
        
        $.get(`${baseUrl}movie/${idMovie}?api_key=${key}&append_to_response=videos`, getInfoMovie);
        // function to get the similar movies with the click event
        $.get(`${baseUrl}movie/${idMovie}/similar?api_key=${key}&language=en-US&page=1`, getSimilarMovies);
    }

    function appendMoviesLeft(movie) {
        var year = movie.release_date.substring(0,4);
        $leftMenuContainer.append(`<div class=main__left-menu-movie><img src=${imageUrl+movie.poster_path} data-id=${movie.id} class="main__left-menu-image js-left-menu-image"><h4 class=main__left-menu-title>${movie.title}</h4><span class=main__left-menu-text>${year}</span></div>`);
        $(`[data-id=${movie.id}]`).click(onRenderMovieInfo);
    }
    
    function onRenderSelectOptions(result) {
        result.genres.forEach(function(genre){
            $leftSelect.append(`<option value=${genre.id}>${genre.name}</option>`);
        });
    }
    
    // Function to render the select options
    $leftSelect.change(function(){
        var id = '';
        $('.js-left-select option:selected').each(function(){
            id = $(this).val();
        });
        
        $leftMenuContainer.empty();
        $descriptionVideo.empty();
        $descriptionTitle.empty();
        $descriptionText.empty();
        $grid.empty();

        if (id !== "favorites" ) {
            $.get(`${baseUrl}genre/${id}/movies?api_key=${key}&language=en-US&include_adult=false&sort_by=created_at.asc`, OnRenderMoviesGenre);
        } else {

            OnRenderMoviesFirstGenreFavorite();
            
            var idMovie = $favoriteMovies[0];
            var urlInfoMovie = `${baseUrl}movie/${idMovie}?api_key=${key}&append_to_response=videos`;
            $.get(urlInfoMovie, getInfoMovie);
    
            // Function to get the similar movies of the first movie in the list on the left menu
            var urlSimilarMovies = `${baseUrl}movie/${idMovie}/similar?api_key=${key}&language=en-US&page=1`;
            $.get(urlSimilarMovies, getSimilarMovies);
        }
    });

    function OnRenderMoviesFirstGenreFavorite() {
        $favoriteMovies.forEach(getIdFavoritesMovies);
        $leftMenuContainer.on('click', '.js-left-menu-image', onRenderMovieInfo);
    }    

    function getIdFavoritesMovies(idMovie) {
        urlInfoMovie = `${baseUrl}movie/${idMovie}?api_key=${key}&append_to_response=videos`;
        $.get(urlInfoMovie, appendMoviesLeftFavorite);
    }

    function appendMoviesLeftFavorite(movie){
        var year = movie.release_date.substring(0,4);
        $leftMenuContainer.append(`<div class=main__left-menu-movie><img src=${imageUrl+movie.poster_path} data-id=${movie.id} class="main__left-menu-image js-left-menu-image"><h4 class=main__left-menu-title>${movie.title}</h4><span class=main__left-menu-text>${year}</span></div>`);
    }
}); 
