$(document).ready(function(){
    var id = 'c0b2e256491361d28c75bbe8f9e59a85';
    var baseUrl = 'https://api.themoviedb.org/3/';
    var getGenresUrl = `${baseUrl}genre/movie/list?api_key=${id}&language=en-US`;
    var $navbarButton = $('.navbar__button');
    var $leftMenu = $(".main__left-menu");
    var $leftSelect = $(".main__left-select");
    

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
            console.log(response);
        });
    });
    
    
    
});