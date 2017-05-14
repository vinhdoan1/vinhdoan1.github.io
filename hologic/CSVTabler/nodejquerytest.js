var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname)));


app.post('/test', function (req, res) {
    var obj = {};
    console.log('body: ' + JSON.stringify(req.body));
    res.send(req.body);
});

app.listen(3000);

console.log("Running at Port 3000");