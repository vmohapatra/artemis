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
    
    // Utility function to set the autocomplete suggestion data
    function setSuggestions() {
        var input = document.getElementById("ip_destination");
        //data-list="Ada, Java, JavaScript, Brainfuck, LOLCODE, Node.js, Ruby on Rails"

        // Show label but insert value into the input:
        new Awesomplete(input, {
            list: [
                { label: "Belarus", value: "BY", rid: "12345" },
                { label: "China", value: "CN", rid: "54321" },
                { label: "United States", value: "US", rid: "67823" }
            ],
            options: {
                selectionCallback : function(data) { 
                    console.log("Typeahead selection happened and we got this back");
                    console.log(data);
                }
            }
        });
    }
    setSuggestions ();
    /*******************************************************
        Event Handlers
    *******************************************************/


});
