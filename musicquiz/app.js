var main = function () {
    
    $('.quiz').hide();
    $('.loading').hide();
    var beginning = true;

    document.getElementById("vidEntered").value = localStorage.getItem("enter");
    
    var ytApiKey = "AIzaSyB3LFAO-suAsevvIfP4q6Zk269_j0TmXq8";
    var vidIDs = [];
    var vidTitles = [];
    var vidDurations = [];

    var vidIDsLeft;
    var correctButton;
    var chosenVidInd;

    var buttonPressed = false;

    var DURATION = 10;

    /*

    $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=" + "ZMoWqe6hKgw" + "&key=" + ytApiKey, function (json) {
        alert(json.items[0].snippet.title);
        alert(getYTDuration(json.items[0].contentDetails.duration));
    });
    */

    function getYTDuration(ISO) {
        var matches = /^PT?(?:(\d+)M)?(?:(\d+)S)?$/.exec(ISO);
        var total;
        if (!matches[1])
            matches[1] = 0
        return Number(matches[1]) * 60 + Number(matches[2]);
    }

    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    function quizRound() {
        var numVidsLeft = vidIDsLeft.length;
        var ind = Math.floor((Math.random() * numVidsLeft));
        var vids = [];
        var vidInds = [];

        vids.push(vidIDsLeft[ind]);
        vidInds.push(vidIDs.indexOf(vids[0]));
        chosenVidInd = ind;
        var timeStart = Math.floor((Math.random() * (vidDurations[vidInds[0]] - DURATION)))
      //  document.getElementById("headertag2").innerHTML = (timeStart) + "/" + (vidDurations[vidInds[0]]);
        var numVids = vidIDs.length;

        while (vids.length < 4) {
            var i = Math.floor((Math.random() * numVids));
            var id = vidIDs[i];

            if (vids.indexOf(id) == -1) {
                vids.push(id);
                vidInds.push(i);
            }
        }

        var vidOrder = [0, 1, 2, 3];
        // RANDOMIZE POSITIONS FOR BUTTONS
        var currentIndex = 4
            , temporaryValue, randomIndex;


        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = vidOrder[currentIndex];
            vidOrder[currentIndex] = vidOrder[randomIndex];
            vidOrder[randomIndex] = temporaryValue;
        }

        $("#buttonOne").text(vidTitles[vidInds[vidOrder[0]]]);
        $("#buttonTwo").text(vidTitles[vidInds[vidOrder[1]]]);
        $("#buttonThree").text(vidTitles[vidInds[vidOrder[2]]]);
        $("#buttonFour").text(vidTitles[vidInds[vidOrder[3]]]);



        correctButton = vidOrder.indexOf(0);


        document.getElementById('musicplayer').src = "https://www.youtube.com/embed/" + vids[0] + "?rel=0&autoplay=1&fs=0&start=" + timeStart + "&autohide=0";

    }

    function startQuiz() {
        beginning = false;
        $('.loading').hide();
        $('.quiz').show();


        document.getElementById("headertag").innerHTML = (vidIDs.length - vidIDsLeft.length) + "/" + (vidIDs.length);
        quizRound();

    }

    function setUpStartQuiz() {
        $('.beginning').hide();
        $('.loading').show();

        vidIDsLeft = vidIDs.slice(); // create temp list left

        var numVids = vidIDs.length;
        //get titles and duration of all videos

        for (var i = 0; i < numVids; i++) {
            (function (i) { // protects i in an immediately called function
                $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=" + vidIDs[i] + "&key=" + ytApiKey, function (json) {
                    vidTitles[i] = (json.items[0].snippet.title);
                    vidDurations[i] = (getYTDuration(json.items[0].contentDetails.duration));
                    if (vidTitles.length == numVids) // when last title is put in
                    {
                        startQuiz();
                    }
                });
            })(i);
        }
        /*
                for (var i = 0; i < numVids; i++) {
                    $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=" + vidIDs[i] + "&key=" + ytApiKey, function (json) {
                        vidTitles.push(json.items[0].snippet.title);
                        vidDurations.push(getYTDuration(json.items[0].contentDetails.duration));
                        if (vidTitles.length == numVids) // when last title is put in
                        {
                            startQuiz();
                        }
                    });
                }*/

    }
    
    $(window).unload(function() {
      $('#musicplayer').attr('src', '');
    }); 

    $("#submitButton").click(function () {
        var vidEnteredList = document.getElementById("vidEntered").value;
        vidIDs = vidEnteredList.trim().match(/[^\r\n]+/g);

        var arrayLength = vidIDs.length;

        for (var i = 0; i < arrayLength; i++) {
            vidIDs[i] = youtube_parser(vidIDs[i])
            if (vidIDs[i] == false) {
                alert("Enter valid YouTube links!");
                return;
            }
        }

        if (arrayLength < 4) {
            alert("Enter at least 4 videos!");
        } else {
            localStorage.setItem("enter", vidEnteredList);
            setUpStartQuiz();
        }
    })
    
    $("#titleButton").click(function () {
        $('#musicplayer').attr('src', '');
    //    var videos = $('#musicplayer');
     //   video.pause()
        window.location.reload();
    })
    
    $("#numberButton").click(function () {
        $(".numberButton").toggleClass('hideMe');            
    })
    
    function buttonPress(ind, butn) {
        var rightBtn;
        btn = $(butn);
        if (!buttonPressed) {
            //correct!
            if (ind == correctButton) {
                rightBtn = btn;

                btn.addClass('correct');
                
                
                // remove this vid from the list
                vidIDsLeft.splice(chosenVidInd, 1);

                //guessed all songs, so reset vidIdsLeft
                if (vidIDsLeft.length == 0)
                    vidIDsLeft = vidIDs.slice();
            } else //wrong!
            {
                
                btn.addClass('wrong');

                if (correctButton == 0) {
                    rightBtn = $("#buttonOne");
                } else if (correctButton == 1) {
                    rightBtn = $("#buttonTwo");
                } else if (correctButton == 2) {
                    rightBtn = $("#buttonThree");
                } else {
                    rightBtn = $("#buttonFour");
                }
                
                rightBtn.addClass('correct');

            }

            buttonPressed = true;
            document.getElementById("headertag").innerHTML = (vidIDs.length - vidIDsLeft.length) + "/" + (vidIDs.length);


            setTimeout(function () {

                
                 btn.removeClass('correct');
                btn.removeClass('wrong');
                 rightBtn.removeClass('correct');
                rightBtn.removeClass('wrong');

                buttonPressed = false;
                quizRound()

            }, 1000);
        } else {
             btn.removeClass('correct');
             btn.removeClass('wrong');

        }
    }

    $("#buttonOne").click(function () {
        buttonPress(0, this)
    })

    $("#buttonTwo").click(function () {
        buttonPress(1, this)
    })

    $("#buttonThree").click(function () {
        buttonPress(2, this)
    })

    $("#buttonFour").click(function () {
        buttonPress(3, this)
    })
    
    $('#musicplayer').attr('src', '');

};



$(document).ready(main);