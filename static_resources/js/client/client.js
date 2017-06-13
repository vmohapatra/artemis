$(document).ready(function(){

    /*******************************************************
        Utility functions
    *******************************************************/

    function getWelcomeTagline() {
      var welcomeTaglines = [
          "Discover your itinerary",
          "Let’s get going",
          "Extraordinary Places to Stay, Things to Do"
      ];

      var index = 0;
      setInterval(function() {
        $("#hdr_taglineStatic").text(welcomeTaglines[index++]);
        if (index == arr.length) { index = 0 }
      }, 1500);
    };
    /*******************************************************
        Event Handlers
    *******************************************************/


});
