'use strict';

// Configures the database

var mongoose = require('mongoose');
var config = require('./config');

//Uses sanjana_db by default for the app
mongoose.connect(config.db_url, function(err){
    if(!err){
        console.log('connected to artemis_db');
    } else{
        console.log(err);
        throw err;
    }
});

module.exports = {
    User: require('./models/user')
};
