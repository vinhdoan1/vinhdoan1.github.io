//Lets load the mongoose module in our program
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var Schema = mongoose.Schema;
var Contact = mongoose.Contact;

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://vinh:hologic@ds013931.mlab.com:13931/hologicinterns');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));


// start up the index.html
app.use(express.static(path.join(__dirname)));

//Define type Test with only property msg (for testing purposes)
var Test = mongoose.model('Test', { msg: String });

var Table = mongoose.model('Table', {});
var TableString = mongoose.model('TableString', { id: Number, tableJSON: String});

var Table2;

app.post('/uploadtablestring', function (req, res) {
    TableString.findOne({ id: 0 }, function (err, userObj) {
        if (err) {
            console.log(err);
        }
        else if (userObj) {
            userObj.tableJSON = req.body.content;
            userObj.save(function (err) {
                console.log("Table updated");
                res.send();
            });
        }
        else {
            TableString({ id: 0, tableJSON: req.body.content }).save(function (err) {
                console.log("Table added");
                res.send();
            });
        }
    });

});

app.post('/fetchtable', function (req, res) {
    TableString.findOne({ id: 0 }, function (err, userObj) {
        if (err) {
            console.log(err);
        } else if (userObj) {
            res.send(userObj.tableJSON);
        } else {
            console.log("Table not found");
        }
    });
});

app.post('/uploadtable', function (req, res) {

    var TableSchema = {};
    var tableHeader = req.body[0];

    for (var j = 0; j < tableHeader; j++) {
        tableObj[tableHeader[j]] = String;
    }
    TableSchema.push(tableObj);

    console.log(req.body);

    /*
    var schema = GenerateSchema.mongoose('Product', req.body);

    Table3 = mongoose.model('Table3', schema);
    Table3(TableSchema).save(function (err) {
        console.log("Item added");
        res.send();
    });
    */

    /*
    Table({ tableJSON: req.body }).save(function (err) {
        console.log("Item added");
        res.send();
    }); */
});

app.post('/upload', function (req, res) {
    var newTest = new Test({ msg: req.body.content });
    newTest.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved successfully:', userObj);
        }
    });
});

app.post('/fetch', function (req, res) {
    var allTests = {};

    Test.find({}, function (err, tests) {
        tests.forEach(function (test) {
            allTests[test._id] = test;
        });

        res.send(tests);
    });
});

app.post('/clear', function (req, res) {
    Test.remove({}, function (err) {
        console.log('collection removed')
    });
});

app.listen(3005);