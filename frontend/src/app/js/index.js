import $ from 'jquery';
import { initPhotoSwipeFromDOM } from './gallery';
import 'bootstrap';
import 'photoswipe';

$('a').click(function() {
    $('html, body').animate(
        {
            scrollTop: $($(this).attr('href')).offset().top - 120
        },
        500
    );
    return false;
});

initPhotoSwipeFromDOM('.gallery');

function openMenu() {}
