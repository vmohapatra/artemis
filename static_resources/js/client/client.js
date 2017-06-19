/* global Handlebars */

$(document).ready(function(){
    /*******************************************************
        Utility functions
    *******************************************************/

    // Function to specify what happens on suggestion selection
    function selectionCallback(data) {
        console.log("Typeahead selection happened and we got this back");
        console.log(data);
        $("#ip_selectedDestinationData").val(JSON.stringify(data));
        getAffinityTags(data.rids);
        //endorsementRankedAffinity();
    }

    // Function to get affinity for a given set of ids
    function getAffinityTags(rids) {
        var ridsType = typeof rids;
        if(ridsType == "object") {
            if(Object.prototype.toString.call( rids ) === '[object Array]') {
                ipType = "array";
            }
        }
        var endorsementAffinities = [];
        for(var i=0; i<rids.length; i++) {
            var receivedAffinities = endorsementAffinity(rids[i]);
            for(var j=0; j<receivedAffinities.length; j++) {
                endorsementAffinities.push(receivedAffinities[j]);
            }
        }
        console.log(endorsementAffinities);
        var uniqueAffinities = removeDuplicates(endorsementAffinities, "theme", "endorsement");
        var sortedAffinities = uniqueAffinities;
        sortedAffinities.sort(dynamicSort("-endorsement"))
        console.log(sortedAffinities);
        //Pass the sorted affinities to the affinities template
        $("#div_affinities_container").html(Handlebars.templates.affinities({sortedAffinities: sortedAffinities}));

    }

    var rid_affinity_mapping = {
       //Orlando
        "178294" : { 
                      "Theme Parks": {"endorsement" : "2500" },
                      "Theaters": {"endorsement" : "109" },
                      "Luxury": {"endorsement" : "2500" },
                      "Golf": {"endorsement" : "172"},
                      "Lakes": {"endorsement" : "49" }
                  },
        //Oahu
        "180077" : { 
                      "Beaches": {"endorsement" : "2079" },
                      "Surfing": {"endorsement" : "134" },
                      "Sea": {"endorsement" : "65" },
                      "Islands": {"endorsement" : "69"},
                      "Ports": {"endorsement" : "218" }
                  },
        //Maui
        "180073" : { 
                      "Beaches": {"endorsement" : "1177" },
                      "Snorkeling": {"endorsement" : "334" },
                      "Sea": {"endorsement" : "70" },
                      "Islands": {"endorsement" : "6"},
                      "Luxury": {"endorsement" : "17" }
                  },
        //Big Island
        "180074" : { 
                      "Islands": {"endorsement" : "37" },
                      "Volcanoes": {"endorsement" : "334" },
                      "Sea": {"endorsement" : "47" },
                      "Snorkeling": {"endorsement" : "180"},
                      "Beaches": {"endorsement" : "458" }
                  },
        //Cancun
        "179995" : { 
                      "Beaches": {"endorsement" : "4088" },
                      "Luxury": {"endorsement" : "428" },
                      "Relaxing": {"endorsement" : "922" },
                      "Sea": {"endorsement" : "169"},
                      "Ruins": {"endorsement" : "184" }
                  },
        //Paris
        "179898" : { 
                      "Cafes": {"endorsement" : "1853" },
                      "Museums": {"endorsement" : "2160" },
                      "Architecture": {"endorsement" : "63" },
                      "Monuments": {"endorsement" : "68"},
                      "Public Transport": {"endorsement" : "178" }
                  },
        //Brisbane
        "179993" : { 
                      "Shopping": {"endorsement" : "293" },
                      "Rivers": {"endorsement" : "9" },
                      "Marinas": {"endorsement" : "0" },
                      "Parks": {"endorsement" : "2"},
                      "Culture": {"endorsement" : "2" }
                  },
        //Cairns
        "179999" : { 
                      "Coral Reefs": {"endorsement" : "39" },
                      "Rain Forests": {"endorsement" : "20" },
                      "Jungles": {"endorsement" : "16" },
                      "Beaches": {"endorsement" : "85"},
                      "Tropical": {"endorsement" : "2" }
                  },
        //Melbourne
        "178283" : { 
                      "Architecture": {"endorsement" : "0" },
                      "Urban": {"endorsement" : "0" },
                      "Shopping": {"endorsement" : "631" },
                      "Art": {"endorsement" : "0"},
                      "Cafes": {"endorsement" : "69" }
                  },
        //Sydney
        "178312" : { 
                      "Ports": {"endorsement" : "45" },
                      "Opera Houses": {"endorsement" : "71" },
                      "Cafes": {"endorsement" : "165" },
                      "Ferries": {"endorsement" : "19"},
                      "Shopping": {"endorsement" : "630" }
                  },
        //Tokyo
        "179900" : { 
                      "Temples": {"endorsement" : "138" },
                      "Museums": {"endorsement" : "236" },
                      "Urban": {"endorsement" : "7" },
                      "Monuments": {"endorsement" : "17"},
                      "Public Transport": {"endorsement" : "59" }
                  },
        //Osaka
        "178312" : { 
                      "Shopping": {"endorsement" : "280" },
                      "Castles": {"endorsement" : "27" },
                      "Public Transport": {"endorsement" : "5" },
                      "Museums": {"endorsement" : "18"},
                      "Aquariums": {"endorsement" : "10" }
                  },
        //Casablanca
        "6084755" : { 
                      "Cafes": {"endorsement" : "51" },
                      "Entertainment": {"endorsement" : "7" },
                      "Relaxing": {"endorsement" : "4" },
                      "Opera Houses": {"endorsement" : "0"},
                      "Sea": {"endorsement" : "5" }
                  },
        //Marrakech
        "6084756" : { 
                      "Cafes": {"endorsement" : "62" },
                      "Culture": {"endorsement" : "25" },
                      "Shopping": {"endorsement" : "278" },
                      "Romantic": {"endorsement" : "99"},
                      "Gardens": {"endorsement" : "14" }
                  },
        //Bangkok
        "178236" : { 
                      "Temples": {"endorsement" : "232" },
                      "Shopping": {"endorsement" : "1786" },
                      "Urban": {"endorsement" : "0" },
                      "Castles": {"endorsement" : "47"},
                      "Culture": {"endorsement" : "54" }
                  },
        //Edinburgh
        "6069845" : { 
                      "Historical": {"endorsement" : "304" },
                      "Museums": {"endorsement" : "264" },
                      "Festivals": {"endorsement" : "20" },
                      "Castles": {"endorsement" : "249"},
                      "Cafes": {"endorsement" : "132" }
                  },
        //Glasgow
        "602905" : { 
                      "Museums": {"endorsement" : "63" },
                      "Cafes": {"endorsement" : "34" },
                      "Entertainment": {"endorsement" : "14" },
                      "Dancing": {"endorsement" : "15"},
                      "Theaters": {"endorsement" : "0" }
                  }
    }

    // https://confluence/pages/viewpage.action?pageId=471953755
    var affinity_filter_mapping = {
        "Water Activities" : ["Tropical", "Surfing", "Snorkeling", "Coral Reefs", "Lakes", "Beaches", "Sea", "Rivers", "Marinas", "Islands" ],
        "Theme Parks" : ["Theme Parks", "Parks", "Rain Forests", "Jungles"],
        "Family Friendly" : ["Theaters", "Relaxing", "Shopping", "Culture", "Temples", "Castles"],
        "Tours & Sightseeing" : ["Opera Houses", "Gardens", "Ruins", "Architecture", "Monuments", "Public Transport", "Parks", "Rain Forests", "Jungles"],
        "Attractions" : ["Museums", "Aquariums", "Ports", "Volcanoes",  "Temples", "Castles", "Monuments"],
        "Nightlife" : ["Entertainment", "Dancing", "Romantic", "Urban", "Opera Houses"],
        "Adventures" : ["Golf", "Volcanoes", "Rain Forests"],
        "Food & Drink" : ["Romantic", "Luxury", "Cafes", "Shopping", "Culture"],
        "Spa" : ["Luxury", "Relaxing", "Shopping"]
    }

/*
        
        
        "Theme Parks" : "",//-----------
        "Theaters" : "",//-----------
        "Luxury" : "",//-----------
        "Golf" : "",//-----------
        "Lakes" : "",//-----------
        "Beaches" : "",//-----------
        "Surfing" : "",//-----------
        "Snorkeling" : "",//-----------
        "Sea" : "",//-----------
        "Islands" : "",//-----------
        "Ports" : "",//-----------
        "Volcanoes" : "",//-----------
        "Relaxing" : "",//-----------
        "Ruins" : "",//-----------
        "Cafes" : "",//-----------
        "Museums" : "",//-----------
        "Architecture" : "",//-----------
        "Monuments" : "",//-----------
        "Public Transport" : "",//-----------
        "Shopping" : "",//-----------
        "Rivers" : "",//-----------
        "Marinas" : "",//-----------
        "Parks" : "",//-----------
        "Culture" : "",//-----------
        "Coral Reefs" : "",//-----------
        "Rain Forests" : "",//-----------
        "Jungles" : "",//-----------
        "Tropical" : "",//-----------
        "Urban" : "",//-----------
        "Shopping" : "",//-----------
        "Art" : "",
        "Opera Houses" : "",//-----------
        "Ferries" : "",//-----------
        "Temples" : "",//-----------
        "Castles" : "",//-----------
        "Aquariums" : "",//-----------
        "Entertainment" : "",//-----------
        "Romantic" : "",//-----------
        "Gardens" : "",//-----------
        "Historical" : "",
        "Festivals" : "",
        "Dancing" : ""//-----------

*/
    function endorsementAffinity(rid) {
        var affinityForRids = [];
        for(affinity in rid_affinity_mapping[rid]) {
            affinityForRids.push({
                "theme" : affinity,
                "endorsement" : rid_affinity_mapping[rid][affinity]["endorsement"]
            });
        }
        return affinityForRids;
    }

    // Removes duplicates in an array of objects by key name value of objects and 
    // preserves the max value of the max key for the object
    function removeDuplicates(originalArray, objKey, maxKey) {
        var trimmedArray = [];
        var values = [];
        var value;

        for(var i = 0; i < originalArray.length; i++) {
            value = originalArray[i][objKey];

            if(values.indexOf(value) === -1) {
                // if the key does not exists
                trimmedArray.push(originalArray[i]);
                values.push(value);
            }
            else {
                // if the key already exists, update the endorsement to max number
                $.each(trimmedArray, function() {
                    if (this.theme == value && parseInt(this.endorsement) < parseInt(originalArray[i][maxKey]) ) {
                        this.endorsement = originalArray[i][maxKey];
                    }
                });
            }
        }

        return trimmedArray;

    }

    // Sorts an Array of unique objects by the numeric value of the key provided
    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (parseInt(a[property]) < parseInt(b[property])) ?
             -1 :
              (parseInt(a[property]) > parseInt(b[property])) ? 1 : 0;
            return result * sortOrder;
        }
    }

    function createPlanUrl() {
        // https://www.expedia.com/lx/api/search?
        // rid=1488&startDate=2017-06-18&endDate=2017-06-24&categories=Water+Activities
        var selectedDestData = JSON.parse($("#ip_selectedDestinationData").val());
        var startDate = $("#div_startDatepicker").val();
        var endDate = $("#div_startDatepicker").val();
        var selectedAffinities = [];
        $('.affinity-ip').each(function (index, value) { 
            if( $(this).is(':checked') ) {
                console.log('input' + index + ':' + $(this).attr('data'));
                var affinity = $(this).attr('data');
                //Get corresponding activity filter
                $.each(affinity_filter_mapping, function(key, value) {
                //console.log(key);
                //console.log(value);
                   if( _.contains(value, affinity)) {
                       console.log("************");
                       console.log(key);
                       if(!_.contains(selectedAffinities, key)) {
                           selectedAffinities.push(key);
                        }
                   }
                });
            }
        });
        console.log(selectedAffinities);
        // Currently destination or multi region ids are not supported.
        // get activities for each region and create a ranked mapping
    }
    /*******************************************************
        IIFEs
    *******************************************************/
    if(document.getElementById("hdr_taglineStatic")) {
    // IIFE : Function to set a dynamic tagline at page load
    (function getWelcomeTagline() {
        var welcomeTaglines = [
            "Let’s get going",
            "Discover your itinerary",
            "Things you want to do"
        ];

        var index = 0;
        setInterval(function() {
            $("#hdr_taglineStatic").text(welcomeTaglines[index++]);
            if (index == welcomeTaglines.length) { index = 0 }
        }, 2000);
    })();
    }

    var suggestions = [
                {
                    label: "Orlando, Florida, USA", // Multicity
                    value: "Orlando, Florida, United States of America",
                    rids: ["178294"],
                    tlas: ["ORL"],
                    coordinates: [{ lat: "28.541290", lng: "-81.379040"}]
                },
                {
                    label: "Hawaii, USA", // Multiregion
                    value: "Hawaii, United States of America",
                    rids: ["180077", "180073", "180074" ], // oahu, maui, big island
                    tlas: ["HNL", "OGG", "KOA"],
                    coordinates: [
                        { lat: "20.618483", lng: "-157.199225"},
                        { lat: "20.798363", lng: "-156.331925"},
                        { lat: "19.542915", lng: "-155.665857"}
                    ]
                },
                {
                    label: "Cancun, Quintana Roo, Mexico", // Multicity
                    value: "Cancun, Quintana Roo, Mexico",
                    rids: ["179995"],
                    tlas: ["CUN"],
                    coordinates: [{ lat: "21.163620", lng: "-86.825780"}]
                },
                {
                    label: "Paris, France", // Multicity
                    value: "Paris, France",
                    rids: ["179898"],
                    tlas: ["PAR"],
                    coordinates: [{ lat: "48.862720", lng: "2.343750"}]
                },
                {
                    label: "Australia", // Multiregion
                    value: "Australia",
                    rids: ["179993", "179999", "178283", "178312"],
                    tlas: ["BNE", "CNS", "MEL", "SYD"],// Brisbane, Cairns, Melbourne, Sydney
                    coordinates: [
                        { lat: "-27.468300", lng: "153.026990"},
                        { lat: "-16.927434", lng: "145.747143"},
                        { lat: "-37.815130", lng: "144.960750"},
                        { lat: "-33.867570", lng: "151.208440"}
                    ]
                },
                {
                    label: "Japan", // Multiregion
                    value: "Japan",
                    rids: ["179900", "179897"],
                    tlas: ["TYO", "OSA"],// Tokyo, Osaka
                    coordinates: [
                        { lat: "35.675000", lng: "139.760000"},
                        { lat: "35.011229", lng: "135.768125"}
                    ]
                },
                {
                    label: "Morocco", // Multiregion
                    value: "Morocco",
                    rids: ["6084755", "6084756"],
                    tlas: ["CMN", "RAK"],// Casablanca, Marrakech
                    coordinates: [
                        { lat: "33.515640", lng: "-7.694306"},
                        { lat: "31.631600", lng: "-8.009210"}
                    ]
                },
                {
                    label: "Marrakech, Morocco", // Multicity
                    value: "Marrakech, Morocco",
                    rids: ["6084756"],
                    tlas: ["RAK"],// Marrakech
                    coordinates: [
                        { lat: "31.631600", lng: "-8.009210"}
                    ]
                },
                {
                    label: "Thailand", // Multiregion
                    value: "Thailand",
                    rids: ["178236"],
                    tlas: ["BKK"],// Bangkok
                    coordinates: [
                        { lat:"13.747500", lng:"100.536010"}
                    ]
                },
                {
                    label: "Scotland, United Kingdom", // Multiregion
                    value: "Scotland, United Kingdom",
                    rids: ["6069845", "602905"],
                    tlas: ["EDI", "GLA"],// Edinburgh, Glasgow
                    coordinates: [
                        { lat:"55.951370", lng:"-3.196380"},
                        { lat: "55.861180", lng: "-4.250200"}
                    ]
                }
    ];
    if(document.getElementById("ip_destination")) {
    // IIFE : Function to set the autocomplete suggestion data at page load
    (function setSuggestions() {
        var input = document.getElementById("ip_destination");

        // Show label but insert value into the input:
        new Awesomplete(input, {
            list: suggestions,
            options: {
                selectionCallback : selectionCallback
            }
        });
    })();
    }

    /*******************************************************
        Event Handlers
    *******************************************************/
    $('#ip_destination').on('input', function() {
        $("#ip_selectedDestinationData").val("");
    }).trigger('input');

    $("#btn_itinSearchSubmit").on("click", function(e) {
        console.log("submit clicked");

        var destIp = $("#ip_destination").val();
        var startDate = $("#div_startDatepicker").val();
        var endDate = $("#div_endDatepicker").val();
        var selectedDestData = $("#ip_selectedDestinationData").val();
        if(destIp && startDate && endDate) {
            // Finds the suggestion based on text ip string match 
            var destination = $.grep(suggestions, function(e){ var destinationName = e.value; return (destinationName.indexOf(destIp) > -1); });
            if(!destination[0] || (selectedDestData && destination[0].value != JSON.parse(selectedDestData).value) ) {
               $("#ip_destination").val("");
               $("#ip_selectedDestinationData").val("");
               $("#div_errorSubmit").show();
            }
            else {
                $("#div_errorSubmit").hide();
                $("#ip_selectedDestinationData").val(JSON.stringify(destination[0]));
                var nextUrl = createPlanUrl();

                //Go to itinerary view
                $.ajax({
                    type: "POST",
                    url: "/itinerary",
                    data: {"Helloe" : "Vijaya"}
                })
                .done(function(d){console.log(d);window.location.href = "/itinerary";})
                .fail(function(e){console.log(e);console.log('POST fail');})
                .always(function(){});

            }
        }
        else {
            $("#div_errorSubmit").show();
        }
    });

});
