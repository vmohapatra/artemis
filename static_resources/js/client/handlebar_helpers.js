Handlebars.registerHelper('getWelcomeTaglines', function() {
    console.log("Inside htagbs helper");
    var welcomeTaglines = [
        "Discover your itinerary",
        "Let’s get going",
        "Extraordinary Places to Stay, Things to Do"
    ];

    return "hello";
/*
    var index = 0;
    setInterval(function() {
        //$("#hdr_taglineStatic").text(welcomeTaglines[index++]);
        var txt = welcomeTaglines[index++];
        if (index == welcomeTaglines.length) { index = 0 }
        return txt;
    }, 1500);
    */
});