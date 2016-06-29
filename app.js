var main = function () {
    var lefted = false;
    var righted = false;
    var speed = 700
    
    if (window.location.hash === "#aboutme") {
        lefted = true;
        $('.leftify').css({
            "right": '110%'
        });

        $('.thirdBar').css({
            "right": '35%'
        });

        $('.aboutmetext').css({
            "left": '10%'
        });

        $('.languagestext').css({
            "left": '10%'
        });
    }
    else if (window.location.hash === "#projects") {
        righted = true;
        $('.rightify').css({
            "left": '110%'
        });

        $('.fourthBar').css({
            "left": '35%'
        });

        $('.GeomBox').css({
            "left": '0%'
        });

        $('.flapBox').css({
            "left": '52%'
        });
    }


    $('.thirdBar').click(function () {
        if (lefted === false) {
            $('.leftify').animate({
                right: '110%'
            }, speed);

            $('.thirdBar').animate({
                right: '35%'
            }, speed);

            $('.aboutmetext').animate({
                left: '10%'
            }, speed);
            
            $('.languagestext').animate({
                left: '10%'
            }, speed);
            setTimeout(function () {
                lefted = true;
            }, speed - 50);

            if (history.pushState) {
                history.pushState(null, null, '#aboutme');
            } else {
                location.hash = '#aboutme';
            }
        } else {
            $('.leftify').animate({
                right: '0%'
            }, speed);

            $('.thirdBar').animate({
                right: '0%'
            }, speed);

            $('.aboutmetext').animate({
                left: '110%'
            }, speed);

            $('.languagestext').animate({
                left: '110%'
            }, speed);

            setTimeout(function () {
                lefted = false;
            }, speed - 50);
            
            if (history.pushState) {
                history.pushState(null, null, ' ');
            } else {
                location.hash = ' ';
            }
        }
    });

    $('.fourthBar').click(function () {
        if (righted === false) {
            $('.rightify').animate({
                left: '110%'
            }, speed);

            $('.fourthBar').animate({
                left: '35%'
            }, speed);

            $('.GeomBox').animate({
                left: '0%'
            }, speed);

            $('.flapBox').animate({
                left: '52%'
            }, speed);

            setTimeout(function () {
                righted = true;
            }, speed - 50);
            
            if (history.pushState) {
                history.pushState(null, null, '#projects');
            } else {
                location.hash = '#projects';
            }
        } else {
            $('.rightify').animate({
                left: '0%'
            }, speed);

            $('.fourthBar').animate({
                left: '0%'
            }, speed);

            $('.GeomBox').animate({
                left: '-110%'
            }, speed);

            $('.flapBox').animate({
                left: '-58%'
            }, speed);

            setTimeout(function () {
                righted = false;
            }, speed - 50);
            
            if (history.pushState) {
                history.pushState(null, null, ' ');
            } else {
                location.hash = ' ';
            }
        }
    });
};

$(document).ready(main);