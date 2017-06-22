'use strict';
// http://www.codyrushing.com/using-handlebars-helpers-on-both-client-and-server/
var register = function(hbs, $) {
    var helpers = {
            getPartialByName: function(name, data, options) {
            if (typeof window !== "undefined") {
            var template = Handlebars.partials[name] || Handlebars.templates[name];
            console.log(template);
            if (template) {
                if (typeof template !== 'function') {
                    template = Handlebars.compile(template);
                }
                return template(data, options);
            }
            }
        },
        customVijaya: function(data) {
        //{{customVijaya sortedAffinities}} in hbs
            // console.log("customVijaya function is called whenever the view is rendered");
            if (typeof window !== "undefined") {
                // console.log("rendered from client");
                return data;
            }
            else {
                // console.log("rendered from server");
            }
        },
        getDestinationName: function(destArray, index) {
        if (typeof window !== "undefined") {
            return destArray[index];
        }
        },
        getStartTla: function (tlas) {
        if (typeof window !== "undefined") {
            console.log("in getStartTla");
            console.log(tlas[0]);
            return tlas[0];
            }
        },
        getEndTla: function (tlas) {
        if (typeof window !== "undefined") {
            console.log("in endTla");
            var index = tlas.length;
            console.log(tlas[index-1]);
            return tlas[index-1];
            }
        },
        getDate: function(date) {
        if (typeof window !== "undefined") {
            console.log("In getDate");
            console.log(date);
            var dateStr = moment(date).add(1, 'days').format("MMM DD, YYYY");
            return dateStr;
            }
        },
        getRid: function(data, index) {
        if (typeof window !== "undefined") {
            console.log("In getRid");
            console.log(data);
            }
        },
    };

    if (hbs && typeof hbs.registerHelper === "function") {
        console.log("hbs exists");
        // register helpers
        for (var prop in helpers) {
            hbs.registerHelper(prop, helpers[prop]);
        }
    } else {
        console.log("server no hbs");
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

// client
if (typeof window !== "undefined") {
    console.log("client");
    // since all partials and templates precompiled into the same bucket, do this to allow partial lookups to work
    // Only necessary for precompiled templates using grunt etc
    // hbs.partials = hbs.templates;
    register(Handlebars, $);
}
// server
else {
    console.log("server");
    module.exports.register = register;
    module.exports.helpers = register(null, null);
}