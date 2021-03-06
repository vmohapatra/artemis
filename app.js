'use strict';
var Promise = global.Promise || require('promise');

var express = require('express');
var path = require('path');
var hbs = require('hbs');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = require('./config');
var hbsHelpers = require("./static_resources/js/client/handlebar_helpers.js");

// var login = require('./dbutils/login');
// var data = require('./dbutils/data-interaction');

var app = express();

app.use(express.static('static'));
app.use('/static', express.static(__dirname + '/static_resources'));

// view engine setup to use Handlebars templates
 app.set('views', path.join(__dirname, 'views'));

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    extname:'.hbs',
    defaultLayout: 'artemis',
    helpers      : hbsHelpers.helpers, // same file that gets used on our client

    // Uses multiple partials dirs, templates in "views/client_templates" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'views/client_templates/',
        'views/partials/'
    ],
    layoutsDir: "views/layouts"
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// Middleware to expose the app's shared templates to the client-side of the app
// for pages which need them.
function exposeTemplates(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    hbs.getTemplates('views/client_templates/', {
        //cache      : app.enabled('view cache'),
        precompiled: true
    }).then(function (templates) {
        // RegExp to remove the ".handlebars" extension from the template names.
        var extRegex = new RegExp(hbs.extname + '$');

        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                name    : name.replace(extRegex, ''),
                template: templates[name]
            };
        });

        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }

        setImmediate(next);
    })
    .catch(next);
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', exposeTemplates, function (req, res) {
    console.log("in /");
    res.redirect('/welcome');
});

app.get('/welcome', exposeTemplates, function (req, res) {
    console.log("in welcome view");
    res.render('welcome');
});

app.get('/itinerary', exposeTemplates, function (req, res) {
    console.log("In itin get");
    res.render('itinerary');
});


app.post('/itinerary', function (req, res) {
    console.log("received post to redirect"); 
    console.log(JSON.stringify(req.body));
    res.send(req.body);
});

app.listen(config.http_port, function () {
  console.log('App listening on port : '+config.http_port);
  console.log('Please access app at http://localhost:'+config.http_port);
  //console.log(config.root);
  //console.log("Variable __dirname : "+__dirname);
});

module.exports = app;