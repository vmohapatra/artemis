var express = require('express');
var path = require('path');
var hbs = require('hbs');
var expressHbs = require('express3-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require('./config');
// var hbsHelpers = require("./static_resources/js/client/handlebar_helpers");

// var login = require('./dbutils/login');
// var data = require('./dbutils/data-interaction');

var app = express();

app.use(express.static('static'));
app.use('/static', express.static(__dirname + '/static_resources'));

// view engine setup to use Handlebars templates
app.set('views', path.join(__dirname, 'views'));
//Set .hbs as the default extension to be used in view engine for the app
app.engine('hbs', expressHbs({extname:'.hbs', defaultLayout: "artemis"}));
app.set('view engine', 'hbs');

//Use register partials to get partial templates from the specific partials directory "partials"
hbs.registerPartials(__dirname + '/views/partials');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    // res.send('Hello World!')
    res.render(
        app.get('views') + '/layouts/'+ 'artemis'
    );
});

app.listen(config.http_port, function () {
  console.log('App listening on port : '+config.http_port);
  console.log('Please access app at http://localhost:'+config.http_port);
  //console.log(config.root);
  //console.log("Variable __dirname : "+__dirname);
});

module.exports = app;