$(document).ready(function(){
    
    var key = 'c0b2e256491361d28c75bbe8f9e59a85';
    var baseUrl = 'https://api.themoviedb.org/3/';
    var imageUrl = 'http://image.tmdb.org/t/p/w500';
    var imageUrlBackDrop = 'http://image.tmdb.org/t/p/w1920';
    var $navbarButton = $('.js-navbar-button');
    var $leftSelect = $('.js-left-select');
    var $leftMenu = $('.main__left-menu');
    
    // Function to toggle the left menu
    var onToggleMenu = () => $leftMenu.toggle();
    $navbarButton.click(onToggleMenu);
    
    $.get(`${baseUrl}genre/movie/list?api_key=${key}&language=en-US`, function(result){
        result.genres.forEach(function(genre){
            $('.js-left-select').append(`<option value=${genre.id}>${genre.name}</option>`);
        });
        $.get(`${baseUrl}genre/${result.genres[0].id}/movies?api_key=${key}&language=en-US&include_adult=false&sort_by=created_at.asc`, function(movies){
            movies.results.forEach(function(movie){
                var year = movie.release_date.substring(0,4);
                $('.main__left-menu-container').append(`<div class=main__left-menu-movie><img src=${imageUrl+movie.poster_path} data-id=${movie.id} class="main__left-menu-image js-left-menu-image"><h4 class=main__left-menu-title>${movie.title}</h4><span class=main__left-menu-text>${year}</span></div>`);
            });
            $('.js-left-menu-image').click(function(){
                var id = $(this).data('id');
                $('.main__description-video').empty();
                $('.main__description-title').empty();
                $('.main__description-text').empty();
                $('.grid').empty();

                $.get(`${baseUrl}movie/${id}?api_key=${key}&append_to_response=videos`, function(infoMovie){
                    $('.main__description-video').prepend(`<iframe class=main__video width=560 height=315 src=https://www.youtube.com/embed/${infoMovie.videos.results[0].key} frameborder=0 allowfullscreen=></iframe>`);
                    $('.main__description-title').append(`${infoMovie.title}`);
                    $('.main__description-text').append(`${infoMovie.overview}`);
                    $('.js-main').css('background-image', 'url('+imageUrlBackDrop+infoMovie.backdrop_path+')');
                }); 
                $.get(`${baseUrl}movie/${id}/similar?api_key=${key}&language=en-US&page=1`, function(similars){
                    similars.results.forEach(function(similar){
                        var year = similar.release_date.substring(0,4);
                        $('.grid').append(`<div class="grid__item one-quarter main__gallery-item"><img class=main__gallery-image src=${imageUrl+similar.poster_path} alt="poster of movie '${similar.title}'"><div class=main__gallery-info><h4 class=main__gallery-title>${similar.title}</h4><span class=main__gallery-text>${year}</span></div></div>`);
                    });
                });
            });


            var idMovie = movies.results[0].id
            $.get(`${baseUrl}movie/${idMovie}?api_key=${key}&append_to_response=videos`, function(infoMovie){
                $('.main__description-video').prepend(`<iframe class=main__video width=560 height=315 src=https://www.youtube.com/embed/${infoMovie.videos.results[0].key} frameborder=0 allowfullscreen=></iframe>`);
                $('.main__description-title').append(`${infoMovie.title}`);
                $('.main__description-text').append(`${infoMovie.overview}`);
                $('.js-main').css('background-image', 'url('+imageUrlBackDrop+infoMovie.backdrop_path+')');
            }); 
            $.get(`${baseUrl}movie/${idMovie}/similar?api_key=${key}&language=en-US&page=1`, function(similars){
                similars.results.forEach(function(similar){
                    var year = similar.release_date.substring(0,4);
                    $('.grid').append(`<div class="grid__item one-quarter main__gallery-item"><img class=main__gallery-image src=${imageUrl+similar.poster_path} alt="poster of movie '${similar.title}'"><div class=main__gallery-info><h4 class=main__gallery-title>${similar.title}</h4><span class=main__gallery-text>${year}</span></div></div>`);
                });
            });
        });
    }); 
    
    $('.js-left-select').change(function(){
        var text = '';
        $('.js-left-select option:selected').each(function(){
            text = $(this).val();
        });
        $.get(`${baseUrl}genre/${text}/movies?api_key=${key}&language=en-US&include_adult=false&sort_by=created_at.asc` , function(response){
            $('.main__left-menu-container').empty();
            $('.main__description-video').empty();
            $('.main__description-title').empty();
            $('.main__description-text').empty();
            $('.grid').empty();

            response.results.forEach(function(movie){
                var year = movie.release_date.substring(0,4);
                $('.main__left-menu-container').append(`<div class=main__left-menu-movie><img src=${imageUrl+movie.poster_path} class="main__left-menu-image js-left-menu-image" data-id=${movie.id}></a><h4 class=main__left-menu-title>${movie.title}</h4><span class=main__left-menu-text>${year}</span></div>`);    
            });
            $('.js-left-menu-image').click(function(){
                var id = $(this).data('id');
                $('.main__description-video').empty();
                $('.main__description-title').empty();
                $('.main__description-text').empty();
                $('.grid').empty();

                $.get(`${baseUrl}movie/${id}?api_key=${key}&append_to_response=videos`, function(infoMovie){
                    $('.main__description-video').prepend(`<iframe class=main__video width=560 height=315 src=https://www.youtube.com/embed/${infoMovie.videos.results[0].key} frameborder=0 allowfullscreen=></iframe>`);
                    $('.main__description-title').append(`${infoMovie.title}`);
                    $('.main__description-text').append(`${infoMovie.overview}`);
                    $('.js-main').css('background-image', 'url('+imageUrlBackDrop+infoMovie.backdrop_path+')');
                }); 
                $.get(`${baseUrl}movie/${id}/similar?api_key=${key}&language=en-US&page=1`, function(similars){
                    similars.results.forEach(function(similar){
                        var year = similar.release_date.substring(0,4);
                        $('.grid').append(`<div class="grid__item one-quarter main__gallery-item"><img class=main__gallery-image src=${imageUrl+similar.poster_path} alt="poster of movie '${similar.title}'"><div class=main__gallery-info><h4 class=main__gallery-title>${similar.title}</h4><span class=main__gallery-text>${year}</span></div></div>`);
                    });
                });
            });    
            var idMovie = response.results[0].id;
            $.get(`${baseUrl}movie/${idMovie}?api_key=${key}&append_to_response=videos`, function(infoMovie){
                $('.main__description-video').prepend(`<iframe class=main__video width=560 height=315 src=https://www.youtube.com/embed/${infoMovie.videos.results[0].key} frameborder=0 allowfullscreen=></iframe>`);
                $('.main__description-title').append(`${infoMovie.title}`);
                $('.main__description-text').append(`${infoMovie.overview}`);
                $('.js-main').css('background-image', 'url('+imageUrlBackDrop+infoMovie.backdrop_path+')');
            }); 
            $.get(`${baseUrl}movie/${idMovie}/similar?api_key=${key}&language=en-US&page=1`, function(similars){
                similars.results.forEach(function(similar){
                    var year = similar.release_date.substring(0,4);
                    $('.grid').append(`<div class="grid__item one-quarter main__gallery-item"><img class=main__gallery-image src=${imageUrl+similar.poster_path} alt="poster of movie '${similar.title}'"><div class=main__gallery-info><h4 class=main__gallery-title>${similar.title}</h4><span class=main__gallery-text>${year}</span></div></div>`);
                });
            });
        });
    });  
}); 
