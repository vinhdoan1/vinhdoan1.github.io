$("#tableProgressBar").toggle();
var header = true;
var dataTable;

document.getElementById('headerCheck').checked = header;
document.getElementById("fileName").value = "";
var fileContents;

function filePicked(event) {
    var file = event.target.files[0];

    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        document.getElementById("fileName").value = file.name;
        fileContents = event.target.result;
        
        document.getElementById("generateButton").disabled = false;
        document.getElementById("saveButton").disabled = false;
        document.getElementById("showButton").disabled = false;
    };
    fileReader.readAsText(file);
}

function checkboxHeader(event) {
    header = document.getElementById('headerCheck').checked;
}

function saveTable() {
    $("#statusP").text("Status: Saving...");
    setTimeout(saveTableTest, 10);
}

function saveTableTest()
{
    var sep = "\t";
    if ($("#commaOption").hasClass("active"))
        sep = ",";
    var fileContentArray;
    fileContentArray = $.csv.toArrays(fileContents, {
        separator: sep
    });

    var thisdata = {};
    thisdata.content = JSON.stringify(fileContentArray);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(thisdata),
        contentType: 'application/json',
        url: '/uploadtablestring',
        success: function (data) {
            $("#statusP").text("Status: Saved Table");
        }
    });
}

function showSavedTable()
{
    $("#statusP").text("Status: Fetching Table...");
    setTimeout(showSavedTableTest, 10);
}



function showSavedTableTest()
{
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/fetchtable',
        success: function (data) {
            $("#statusP").text("Status: Generating Table...");
            setInterval(function () { showTable(JSON.parse(data)); }, 10);
        }
    });
}


function showTable(fileContentArray)
{
    var rows = fileContentArray.length;
    var cols = fileContentArray[0].length;
    if (dataTable) {
        $("#dataTable").html("");
        dataTable.destroy();
        $("#dataTable").html("");
    }
    //generate header
    if (header) {
        var headArr = fileContentArray.splice(0, 1);
        var headObjArr = [];
        for (i = 0; i < cols; i++) {
            var val = headArr[0][i];
            headObjArr.push({ title: val });
        }
        dataTable = $("#dataTable").DataTable({
            data: fileContentArray,
            columns: headObjArr
        });
    }

    else {

        //create empty header
        var headObjArr = [];
        for (i = 0; i < cols; i++) {
            headObjArr.push({ title: "" });
        }

        dataTable = $("#dataTable").DataTable({
            data: fileContentArray,
            columns: headObjArr
        });
    }

    $("#statusP").text("Status: -");
}


function generateTable2() {

    $("#tableProgressBar").toggle();
    document.getElementById("generateButton").disabled = true;

    if (dataTable) {
        $("#dataTable").html("");
        dataTable.destroy();
        $("#dataTable").html("");
    }
    
    var sep = "\t";
    if ($("#commaOption").hasClass("active"))
        sep = ",";
    var fileContentArray;
    fileContentArray = $.csv.toArrays(fileContents, {
        separator: sep
    });

    var rows = fileContentArray.length;
    var cols = fileContentArray[0].length;

    var newData = JSON.parse(JSON.stringify(fileContentArray));
    for (i = 0; i < rows; i++)
    {
        newData[i].splice(0, 1);
        newData[i].splice(-9, 9);
        newData[i].splice(1, 3);
    }
    
    for (i = 1; i < rows; i++)
    {
        var newDate = Number(newData[i][0].substring(0, 4));
        var newPercent = Number(newData[i][1]) * 100;
        newData[i][0] = newDate;
        newData[i][1] = newPercent;
    }

    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(
        function () { drawBasic(newData) }
        );
        

    if (fileContentArray[rows - 1][0].substring(0, 5) === "[end]")
    {
        fileContentArray.splice(rows - 1, 1);
    }
        
    //generate header
    if (header) {
        var headArr = fileContentArray.splice(0, 1);
        var headObjArr = [];
        for (i = 0; i < cols; i++) {
            var val = headArr[0][i];
            headObjArr.push({ title: val });
        }
        dataTable = $("#dataTable").DataTable({
            data: fileContentArray,
            columns: headObjArr
        });
    }

    else {

        //create empty header
        var headObjArr = [];
        for (i = 0; i < cols; i++) {
            headObjArr.push({ title: "" });
        }

        dataTable = $("#dataTable").DataTable({
            data: fileContentArray,
            columns: headObjArr
        });
    }
    
    
    $("#tableProgressBar").toggle();

}


function generateTable() {
    var arr = fileContentArray;

    var rows = arr.length;
    var cols = arr[0].length;
    var bodyStart = 0;

    if (header) {
        //generate header
        var headerHTML = "";
        for (i = 0; i < cols; i++) {
            headerHTML += "<th>" + arr[0][i] + "</th>";
        }
        $('#tableHead').html(headerHTML);
        bodyStart = 1;
    }
    else {
        $('#tableHead').html("");
    }

    // generate body
    $('#tableBody').html("");
    for (i = bodyStart; i < 10; i++) {
        var bodyHTML = "<tr>";
        for (j = 0; j < cols; j++) {
            bodyHTML += "<td>" + arr[i][j] + "</td>";
        }
        bodyHTML += "</tr>";
        $('#tableBody').append(bodyHTML);
    }
}

function drawBasic(arr) {
    var arr3 = [
        ['Season', 'W-L%', 'test', 'test2'],
        [1, 37.8, 80.8, 41.8],
        [2, 30.9, 69.5, 32.4],
        [3, 25.4, 57, 25.7],
        [4, 11.7, 18.8, 10.5],
        [5, 11.9, 17.6, 10.4],
        [6, 8.8, 13.6, 7.7],
        [7, 7.6, 12.3, 9.6],
        [8, 12.3, 29.2, 10.6],
        [9, 16.9, 42.9, 14.8],
        [10, 12.8, 30.9, 11.6],
        [11, 5.3, 7.9, 4.7],
        [12, 6.6, 8.4, 5.2],
        [13, 4.8, 6.3, 3.6],
        [14, 4.2, 6.2, 3.4]
    ];

    var arr2 = [
          ['Season', 'W-L%', 'test'],
          [1, 16.7, 10],
          [2, 28.0, 20],
          [3, 30.8, 30],
          [4, 33.3, 40]
    ];

    var data = google.visualization.arrayToDataTable(arr3);
    var data2 = google.visualization.arrayToDataTable(arr2);

    var options = {
        title: (arr[0][0] + ' vs ' + arr[0][1]),
        legend: {position: 'none'},
        height: 500,
        vAxis: {
            title: arr[0][1],
            minValue: 0,
            maxValue: 100,
            format: '#\'%\''
        },
        hAxis: {
            title: arr[0][0],
            format: '#',
            ticks: [1, 2, 3, 4,5 ,6 ,7 ,8 ,9, 10, 11, 12, 13, 14]

        },
        explorer: {
            keepInBounds: true,
            maxZoomIn: 8.0,
            maxZoomOut: 1.0,
            actions: ['dragToZoom', 'rightClickToReset'],
        },
        pointSize: 5,
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
    
}