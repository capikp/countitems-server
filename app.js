var express = require ('express');
var bodyParser = require ('body-parser');
var cors = require ('cors');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use (bodyParser.urlencoded({ extended: true }));
app.use (bodyParser.json());

// Multiple origins
var whiteList = ['http://localhost:4200'] 
var corsOptions = { 
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true) 
        } else {
            callback(new Error ('No allowed by CORS'))
        }
    }
}

app.use (cors()); 
//app.use (cors(corsOptions)); 

var connection = require ('./connection');
var routes = require ('./routes');

connection.connectDB();
routes.configurar(app);

var number_port = process.env.NUMBER_PORT || 8000;

var server = app.listen(number_port, function(){
    console.log("Listening in the port: ", server.address().port);
});