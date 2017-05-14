var main = function () {
    validateRegex();

};

var regexPattern;
var text = "";

function updateAll(isValid)
{
    var expression = document.getElementById("exprs").value;
    if (expression == "")
    {
        $('#exprform').removeClass('has-error');
        $('#glyphinput').removeClass('glyphicon-remove');
        $('#exprform').removeClass('has-success');
        $('#glyphinput').removeClass('glyphicon-ok');
        $('#modform').removeClass('has-error');
        $('#glyphinput2').removeClass('glyphicon-remove');
        $('#modform').removeClass('has-success');
        $('#glyphinput2').removeClass('glyphicon-ok');

        text = document.getElementById("textBox").value;
        $('#highlightedText').html(text);
        $('#replacedText').html(text);
    }
    else if (isValid) {
        $('#exprform').removeClass('has-error');
        $('#glyphinput').removeClass('glyphicon-remove');
        $('#exprform').addClass('has-success');
        $('#glyphinput').addClass('glyphicon-ok');
        $('#modform').removeClass('has-error');
        $('#glyphinput2').removeClass('glyphicon-remove');
        $('#modform').addClass('has-success');
        $('#glyphinput2').addClass('glyphicon-ok');

        text = document.getElementById("textBox").value;
        var highligtedText = text.replace(regexPattern, function myFunction(x) { return '<mark>' + x + '</mark>' });
        $('#highlightedText').html(highligtedText);

        replaceWith = document.getElementById("repl").value;
        var replacedText = text.replace(regexPattern, replaceWith);
        $('#replacedText').html(replacedText);
    }
    else {
        $('#exprform').removeClass('has-success');
        $('#glyphinput').removeClass('glyphicon-ok');
        $('#exprform').addClass('has-error');
        $('#glyphinput').addClass('glyphicon-remove');
        $('#modform').removeClass('has-success');
        $('#glyphinput2').removeClass('glyphicon-ok');
        $('#modform').addClass('has-error');
        $('#glyphinput2').addClass('glyphicon-remove');

        text = document.getElementById("textBox").value;
        $('#highlightedText').html(text);
        $('#replacedText').html(text);
    }
}

function validateRegex() {
    var expression = document.getElementById("exprs").value;
    var modification = document.getElementById("modIn").value;
    var isValid = true;
    try {
        regexPattern = new RegExp(expression, modification);
    } catch (e) {
        regexPattern = null;
        isValid = false;
    }

    updateAll(isValid);

    
}

function updateBottom()
{
    if (regexPattern != null)
    {
        updateAll(true);
    }
}


$(document).ready(main);