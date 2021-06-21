$('header .hamburger').click(() => {
    $('header nav').toggleClass('active');
    if ($('header nav').hasClass('active')) {
        setTimeout(() => {
            $('header .hamburger').toggleClass('active');
        }, 100);
    }
    else {
        $('header .hamburger').toggleClass('active');
    }
})

