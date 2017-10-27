$(document).ready(function(){
    var id = 'c0b2e256491361d28c75bbe8f9e59a85';
    var baseUrl = 'https://api.themoviedb.org/3/';
    var getGenresUrl = `${baseUrl}genre/movie/list?api_key=${id}&language=en-US`;
    var imageBaseUrl = 'http://image.tmdb.org/t/p/w500';
    var $navbarButton = $('.js-navbar-button');
    var $leftMenu = $(".js-left-menu");
    var $leftSelect = $(".js-left-select");
    

    var onToggleMenu = () => $leftMenu.toggle();

    var onRenderSelectOptions = (results) => {
        results.genres.forEach((genre) => {
            $leftSelect.append(`<option value=${genre.id}>${genre.name}</option>`);
        });
    }

    // Function to render select options
    var onGetGenres = (results) => {
        onRenderSelectOptions(results);
    };
    
    // Function to toggle left menu
    $navbarButton.click(onToggleMenu);

    // Function to get movie genres and 
    $.get(getGenresUrl, onGetGenres);

    $leftSelect.change(() => {
        var selectedGenreId = $(this).find("option:selected").val();    
        var getMoviesGenre = `${baseUrl}genre/${selectedGenreId}/movies?api_key=${id}&language=en-US&include_adult=false&sort_by=created_at.asc`;
        
        $.get(getMoviesGenre, (response) => {
            $leftMenu.empty();
            response.results.forEach((result) => {
                $leftMenu.append(`<div class=main__left-menu-container><div class=main__left-menu-movie><a href=#><img src=${imageBaseUrl+result.poster_path} alt= Image of "${result.title}" movie class=main__left-menu-image></a><h4 class=main__left-menu-title>${result.title}</h4><span class=main__left-menu-text></span></div></div>`)
            });
        });
    });
});
