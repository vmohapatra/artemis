$(document).ready(function(){

    /*******************************************************
        Utility functions
    *******************************************************/

    // Utility function to set a dynamic tagline
    function getWelcomeTagline() {
        var welcomeTaglines = [
            "Let’s get going",
            "Discover your itinerary",
            "Amazing Places to Stay",
            "Things to do"
        ];

        var index = 0;
        setInterval(function() {
            $("#hdr_taglineStatic").text(welcomeTaglines[index++]);
            if (index == welcomeTaglines.length) { index = 0 }
        }, 2000);
    }
    getWelcomeTagline();
    /*******************************************************
        Event Handlers
    *******************************************************/


});
