(function ($) {

    $(document).ready(function() {
        $('.container').Carousel({
            visible: 3,
            rotateBy: 1,
            speed: 500,
            btnNext: '#next',
            btnPrev: '#prev',
            auto: false,
            position: 20,
            backslide: true,
            margin: 20
        });
    });

    $('.mobile-menu').click(function () {

        $(this).toggleClass('active');

        $('.head-menu').slideToggle();

    })

})(jQuery);

