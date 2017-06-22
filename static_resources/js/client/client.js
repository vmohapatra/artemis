/* global Handlebars */

$(document).ready(function(){
    /*******************************************************
        Utility functions
    *******************************************************/
    if(document.getElementById("div_activitiesContainer")) {
        function treatAsUTC(date) {
            var result = new Date(date);
            result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
            return result;
        }

        function daysBetween(startDate, endDate) {
            var millisecondsPerDay = 24 * 60 * 60 * 1000;
            var duration = (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
            return duration;
        }
        /*
        categories:"Attractions|Food & Drink",
        destination:"Paris, France",
        enddate:"2017-06-24"
        rid:"179898"
        startdate:"2017-06-24"

        categories:"Water Activities"
        destination:"Hawaii, United States of America"
        enddate:"2017-06-16"
        rid:"180077,180073,180074"
        startdate:"2017-06-16"
        */
        if(document.getElementById("ip_itinContext")) {
            var itinContext = JSON.parse($("#ip_itinContext").val());
            console.log("in itin context");
            console.log(itinContext);
            var activitiesContext = {
                "days" : daysBetween(itinContext.startdate, itinContext.enddate),
                "destination" : itinContext.destination,
                "rid" : (itinContext.rids).split(','),
                "categories" : itinContext.categories,
                "destinations" : (itinContext.destinations).split('|'),
                "tlas" : (itinContext.tlas).split(',')
            }
            $("#hdr_destinationName").html(activitiesContext.destination);
            console.log((itinContext.destinations).split('|'));
            console.log(itinContext.startdate);
            $("#div_activitiesContainer").html(Handlebars.templates.activities({ 
                activityContext : JSON.stringify(activitiesContext),
                rids : activitiesContext.rid,
                days : daysBetween(itinContext.startdate, itinContext.enddate),
                destination : itinContext.destination,
                categories : itinContext.categories,
                activities : "",
                destinations : activitiesContext.destinations,
                tlas : activitiesContext.tlas,
                startDate: new Date(itinContext.startdate).getTime(),
                endDate: new Date(itinContext.enddate).getTime()
            }));
        }
        /*
            { activityContext: $("#ip_itinContext").val()    }
        */
    }


    // Function to specify what happens on suggestion selection
    function selectionCallback(data) {
        //console.log("Typeahead selection happened and we got this back");
        //console.log(data);
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
        //console.log(endorsementAffinities);
        var uniqueAffinities = removeDuplicates(endorsementAffinities, "theme", "endorsement");
        var sortedAffinities = uniqueAffinities;
        sortedAffinities.sort(dynamicSort("-endorsement"))
        //console.log(sortedAffinities);
        //Pass the sorted affinities to the affinities template
        $("#div_affinities_container").html(Handlebars.templates.affinities({sortedAffinities: sortedAffinities}));


    }

    function getActivities(rid) {
        var ActivityModel = require('../models/activityResponse');

        var query = ActivityModel.find({'id' : '391088'});
        query.select('title fromPrice duration');

        query.exec(function (err, activities) {
          if (err) return handleError(err);
          // activities contains a list of activities with id=391088
          $("#div_activities_container").html(Handlebars.templates.activities({selectedActivities:
          selectedActivities}));

        })
    }

//    var daysdata = [
//        { "date" : "August 1, 2017"},
//        { "date" : "August 2, 2017"},
//        { "date" : "August 3, 2017"},
//    ]
//    function setDays() {
//         console.log(daysdata);
//         $("#div_days").html(Handlebars.templates.days({daysdata: daysdata}));
//    }
//
//    setDays();

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

    var rid_activity_mapping = {
        // Honolulu
        "180077" : [
            {
                "ActivityID" : "391088",
                "title" : "Ali'i Luau Dinner Package with Admission to Polynesian Cultural Center",
                "duration" : "8h+",
                "fromPrice" : "$121",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/391088_l.jpeg?v=103991",
                "categories" : "Attractions, Food & Drink, Nightlife, Show & Sport Tickets, Theme Parks"
            },
            {
                "ActivityID" : "390706",
                "title" : "Small-Group Pearl Harbor Memorials Tour with Lunch",
                "duration" : "8h",
                "fromPrice" : "$127",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/391088_l.jpeg?v=103991",
                "categories" : "Attractions, Food & Drink, Nightlife, Show & Sport Tickets, Theme Parks"
            },
            {
                "ActivityID" : "385382",
                "title" : "Hollywood Movie Sites & Ranch Tour",
                "duration" : "1h 30m",
                "fromPrice" : "$49",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/385382_l.jpeg?v=103991",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "379242",
                "title" : "Blue Skies of Oahu Helicopter Tour",
                "duration" : "45m",
                "fromPrice" : "$211",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/379242_l.jpeg?v=103991",
                "categories" : "Air, Balloon & Helicopter Tours"
            },
            {
                "ActivityID" : "470264",
                "title" : "Grand Circle Island Tour of Oahu",
                "duration" : "9h",
                "fromPrice" : "$84",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/470264_l.jpeg?v=103991",
                "categories" : "Air, Balloon & Helicopter Tours"
            },
            {
                "ActivityID" : "379642",
                "title" : "Dolphin-Watching & Snorkeling Cruise",
                "duration" : "3h 30m",
                "fromPrice" : "$149",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/379642_l.jpeg?v=103991",
                "categories" : "Cruises & Water Tours, Water Activities"
            },
            {
                "ActivityID" : "228225",
                "title" : "Go Oahu Card: 34 Attractions in 1 Card",
                "duration" : "1d+",
                "fromPrice" : "$69",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/228225_l.jpeg?v=103991",
                "categories" : "Sightseeing Passes"
            },
            {
                "ActivityID" : "390496",
                "title" : "Paradise Cove Luau",
                "duration" : "6h",
                "fromPrice" : "$108",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/390496_l.jpeg?v=103991",
                "categories" : "Food & Drink, Nightlife, Show & Sport Tickets"
            },
            {
                "ActivityID" : "470267",
                "title" : "Pearl Harbor & Arizona Memorial Half-Day Tour",
                "duration" : "6h",
                "fromPrice" : "$41",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/470267_l.jpeg?v=103991",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "387516",
                "title" : "Atlantis IV Submarine Adventure",
                "duration" : "1h 30m",
                "fromPrice" : "$124",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/387516_l.jpeg?v=103991",
                "categories" : "Cruises & Water Tours"
            },
            {
                "ActivityID" : "381272",
                "title" : "Sunset Cruise & 5-Course Dinner",
                "duration" : "2h",
                "fromPrice" : "$149",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/381272_l.jpeg?v=103991",
                "categories" : "Cruises & Water Tours,Food & Drink, Nightlife"
            },
            {
                "ActivityID" : "385422",
                "title" : "Kualoa Treetop Canopy Zipline Tour",
                "duration" : "2h",
                "fromPrice" : "$168",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/385422_l.jpeg?v=103991",
                "categories" : "Adventures"
            },
            {
                "ActivityID" : "388064",
                "title" : "Swim with Sharks Adventure",
                "duration" : "2h",
                "fromPrice" : "$105",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/388064_l.jpeg?v=103991",
                "categories" : "Adventures, Water Activities"
            },
            {
                "ActivityID" : "388064",
                "title" : "Swim with Sharks Adventure",
                "duration" : "2h",
                "fromPrice" : "$105",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/388064_l.jpeg?v=103991",
                "categories" : "Adventures, Water Activities"
            },
            {
                "ActivityID" : "405422",
                "title" : "Bishop Museum Admission",
                "duration" : "8h",
                "fromPrice" : "$25",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/405422_l.jpeg?v=103991",
                "categories" : "Attractions"
            },
            {
                "ActivityID" : "382152",
                "title" : "Kayak Adventure to the Mokulua Islands",
                "duration" : "5h",
                "fromPrice" : "$188",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/382152_l.jpeg?v=103991",
                "categories" : "Adventures, Water Activities"
            },
            {
                "ActivityID" : "390598",
                "title" : "Waikiki Parasail",
                "duration" : "1h",
                "fromPrice" : "$188",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/390598_l.jpeg?v=103991",
                "categories" : "Adventures, Water Activities"
            },
            {
                "ActivityID" : "382922",
                "title" : "Royal Crown of Oahu Helicopter Tour",
                "duration" : "1h",
                "fromPrice" : "$295",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/382922_l.jpeg?v=103991",
                "categories" : "Air, Balloon & Helicopter Tours"
            },
            ],
        // Maui
        "180073" : [
            {
                "ActivityID" : "382152",
                "title" : "Kayak Adventure to the Mokulua Islands",
                "duration" : "5h",
                "fromPrice" : "$188",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/382152_l.jpeg?v=103991",
                "categories" : "Adventures, Water Activities"
            },
            {
                "ActivityID" : "402924",
                "title" : "Luau at Royal Lahaina Resort",
                "duration" : "3h",
                "fromPrice" : "$103",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/402924_l.jpeg?v=104026",
                "categories" : "Food & Drink,Nightlife"
            },
            {
                "ActivityID" : "379536",
                "title" : "Molokini & Turtle Arches Snorkeling",
                "duration" : "5h",
                "fromPrice" : "$105",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/379536_l.jpeg?v=104026",
                "categories" : "Water Activities"
            },
            {
                "ActivityID" : "470262",
                "title" : "Heavenly Hana Tour",
                "duration" : "8h",
                "fromPrice" : "$136",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/470262_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "379582",
                "title" : "Sunset Dinner Cruise",
                "duration" : "2h",
                "fromPrice" : "$94",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/379582_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing, Nightlife"
            },
            {
                "ActivityID" : "387430",
                "title" : "Underwater Submarine Adventure",
                "duration" : "1h 30m",
                "fromPrice" : "$113",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/387430_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing, Water Activities"
            },
            {
                "ActivityID" : "379518",
                "title" : "Lanai Snorkeling & Dolphin Sighting",
                "duration" : "5h",
                "fromPrice" : "$113",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/379518_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing, Water Activities"
            },
            ],
        // Hawaii Island
        "180074" : [
            {
                "ActivityID" : "382628",
                "title" : "Royal Kona Resort Luau",
                "duration" : "3h",
                "fromPrice" : "$188",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/382628_l.jpeg?v=104026",
                "categories" : "Nightlife"
            },
            {
                "ActivityID" : "379214",
                "title" : "Hilo Fire & Falls Helicopter Tour",
                "duration" : "45m",
                "fromPrice" : "$223",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/379214_l.jpeg?v=104026",
                "categories" : "Air, Balloon & Helicopter Tours"
            },
            {
                "ActivityID" : "470250",
                "title" : "Grand Circle Island Nature Tour",
                "duration" : "8h",
                "fromPrice" : "$98",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/470250_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            ],
        //Cancun
        "179995" : [
           {
                "ActivityID" : "419435",
                "title" : "Isla Mujeres Catamaran Trip",
                "duration" : "7h",
                "fromPrice" : "$82",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/419435_l.jpeg?v=103991",
                "categories" : "Water Activities, Cruises & Water Tours, Tours & Sightseeing"
            },
           {
                "ActivityID" : "425709",
                "title" : "Day Trip to the Walled City of Tulum & Zacil-Ha Cenote",
                "duration" : "4h+",
                "fromPrice" : "$40",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/425709_l.jpeg?v=103991",
                "categories" : "Attractions, Tours & Sightseeing"
            },
           {
                "ActivityID" : "245013",
                "title" : "Tulum Ruins & Tankah Eco-Adventure Park Excursion",
                "duration" : "8h",
                "fromPrice" : "$95",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/245013_l.jpeg?v=103991",
                "categories" : "Attractions, Water Activities"
            },
           {
                "ActivityID" : "189657",
                "title" : "Interactive Dolphin Programs & Wet'n Wild Water Park Admission",
                "duration" : "1h",
                "fromPrice" : "$89",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/189657_l.jpeg?v=103991",
                "categories" : "Attractions, Water Activities"
            },
           {
                "ActivityID" : "414139",
                "title" : "ATV Xtreme, Cenote & Zipline Tour",
                "duration" : "5h+",
                "fromPrice" : "$118",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/414139_l.jpeg?v=103991",
                "categories" : "Attractions, Water Activities"
            },
           {
                "ActivityID" : "450160",
                "title" : "Maroma Jungle ATV Tour",
                "duration" : "45m",
                "fromPrice" : "$77",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/450160_l.jpeg?v=103991",
                "categories" : "Adventures"
            },
           {
                "ActivityID" : "276275",
                "title" : "Jungle Speedboat Tour & Snorkeling",
                "duration" : "2h 30m",
                "fromPrice" : "$70",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/276275_l.jpeg?v=103991",
                "categories" : "Adventures, Cruises & Water Tours"
            },
           {
                "ActivityID" : "189647",
                "title" : "Vegas-Style Show & Open Bar at Coco Bongo Nightclub",
                "duration" : "5h",
                "fromPrice" : "$70",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/189647_l.jpeg?v=103991",
                "categories" : "Nightlife"
            },
           {
                "ActivityID" : "430337",
                "title" : "Jolly Roger Pirate Show & Dinner Cruise with Deluxe Open Bar",
                "duration" : "3h 30m",
                "fromPrice" : "$95",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/430337_l.jpeg?v=103991",
                "categories" : "Cruises & Water Tours, Food & Drink"
            },
           {
                "ActivityID" : "189831",
                "title" : "Tulum Xtreme Ruins, Cenote & Zipline Tour with Lunch",
                "duration" : "8h",
                "fromPrice" : "$116",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/189831_l.jpeg?v=103991",
                "categories" : "Adventures, Tours & Sightseeing"
            },
            ],
        //Orlando
        "178294" : [
            {
                "ActivityID" : "181173",
                "title" : "Pirate's Dinner Adventure",
                "duration" : "2h",
                "fromPrice" : "$49",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/181173_l.jpeg?v=104026",
                "categories" : "Food & Drink"
            },
            {
                "ActivityID" : "407866",
                "title" : "SeaWorld Orlando Single-Day Admission",
                "duration" : "1d",
                "fromPrice" : "$86",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/407866_l.jpeg?v=104026",
                "categories" : "Attractions"
            },
            {
                "ActivityID" : "407892",
                "title" : "Aquatica Orlando Single-Day Admission",
                "duration" : "1d",
                "fromPrice" : "$54",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/407892_l.jpeg?v=104026",
                "categories" : "Water Activities"
            },
            {
                "ActivityID" : "450917",
                "title" : "SEA LIFE Orlando Aquarium",
                "duration" : "1d",
                "fromPrice" : "$22",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/450917_l.jpeg?v=104026",
                "categories" : "Attractions"
            },
            {
                "ActivityID" : "181141",
                "title" : "Gatorland Admission",
                "duration" : "4h",
                "fromPrice" : "$27",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/181141_l.jpeg?v=104026",
                "categories" : "Adventures"
            }
            ],
        //Brisbane
        "179993" : [
            {
                "ActivityID" : "170697",
                "title" : "Lone Pine Koala Sanctuary Day Admission",
                "duration" : "1d",
                "fromPrice" : "$28",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/170697_l.jpeg?v=104026",
                "categories" : "Attractions"
            },
            {
                "ActivityID" : "251488",
                "title" : "River Cruise with Admission to Lone Pine Koala Sanctuary",
                "duration" : "6h",
                "fromPrice" : "$58",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/251488_l.jpeg?v=104026",
                "categories" : "Attractions"
            },
            {
                "ActivityID" : "255528",
                "title" : "Croc Express to the Australia Zoo",
                "duration" : "8h",
                "fromPrice" : "$106",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/255528_l.jpeg?v=104026",
                "categories" : "Attractions"
            },
            {
                "ActivityID" : "473228",
                "title" : "Tangalooma Island Resort Day Trip",
                "duration" : "6h",
                "fromPrice" : "$68",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/473228_l.jpeg?v=104026",
                "categories" : "Cruises & Water Tours"
            },
            {
                "ActivityID" : "473240",
                "title" : "Whale-Watching Lunch Cruise with Tangalooma Island Resort Day Trip",
                "duration" : "6h",
                "fromPrice" : "$99",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/473240_l.jpeg?v=104026",
                "categories" : "Cruises & Water Tours"
            },
            {
                "ActivityID" : "170705",
                "title" : "Tangalooma Island Resort Premuim Day Trip with Dolphin Feeding",
                "duration" : "8h",
                "fromPrice" : "$152",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/170705_l.jpeg?v=104026",
                "categories" : "Cruises & Water Tours"
            },
            {
                "ActivityID" : "170685",
                "title" : "Australia Zoo Day Trip",
                "duration" : "7h",
                "fromPrice" : "$106",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/170685_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "170685",
                "title" : "Australia Zoo Day Trip",
                "duration" : "7h",
                "fromPrice" : "$106",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/170685_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            }
            ],
        // Cairns
        "179999" : [
            {
                "ActivityID" : "472464",
                "title" : "City Sites Morning Tour",
                "duration" : "4h",
                "fromPrice" : "$61",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/472464_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "239055",
                "title" : "Tjapukai Aboriginal Cultural Park by Night Tour",
                "duration" : "3h",
                "fromPrice" : "$94",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/239055_l.jpeg?v=104026",
                "categories" : "Attractions"
            },
            {
                "ActivityID" : "184860",
                "title" : "Marine World Cruise",
                "duration" : "8h",
                "fromPrice" : "$164",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/184860_l.jpeg?v=104026",
                "categories" : "Water Activities"
            },
            {
                "ActivityID" : "184517",
                "title" : "Green Island Reef Cruise",
                "duration" : "6h",
                "fromPrice" : "$72",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/184517_l.jpeg?v=104026",
                "categories" : "Water Activities"
            },
            {
                "ActivityID" : "184648",
                "title" : "Sunlover Cruise to Moore Reef",
                "duration" : "8h",
                "fromPrice" : "$162",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/184648_l.jpeg?v=104026",
                "categories" : "Water Activities"
            },
            {
                "ActivityID" : "428695",
                "title" : "Full-Day Outer Great Barrier Reef & Helicopter Flight Package",
                "duration" : "8h",
                "fromPrice" : "$195",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/428695_l.jpeg?v=104026",
                "categories" : "Water Activities"
            },
            ],
        //Melbourne
        "178283" : [
            {
                "ActivityID" : "473220",
                "title" : "Yarra Valley Tandem Skydive",
                "duration" : "4h",
                "fromPrice" : "$202",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/473220_l.jpeg?v=104026",
                "categories" : "Adventures, Water Activities"
            },
            {
                "ActivityID" : "473208",
                "title" : "St Kilda Beach Tandem Skydive",
                "duration" : "4h",
                "fromPrice" : "$255",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/473208_l.jpeg?v=104026",
                "categories" : "Adventures, Water Activities"
            },
            {
                "ActivityID" : "190779",
                "title" : "Private Helicopter Tour: Great Ocean Road & Twelve Apostles",
                "duration" : "3h",
                "fromPrice" : "$2513",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/190779_l.jpeg?v=104026",
                "categories" : "Adventures, Water Activities"
            },
            {
                "ActivityID" : "470762",
                "title" : "Customizable Tour of Melbourne with a Private Guide",
                "duration" : "5h",
                "fromPrice" : "$343",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/470762_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "190807",
                "title" : "Small Group Yarra Valley Wine, Cider & Chocolate Tour from Melbourne",
                "duration" : "8h",
                "fromPrice" : "$103",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/190807_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "190752",
                "title" : "Spirit of Melbourne Dinner Cruise",
                "duration" : "3h",
                "fromPrice" : "$99",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/190752_l.jpeg?v=104026",
                "categories" : "Nightlife"
            },
            ],
        // Sydney
        "178312" : [
            {
                "ActivityID" : "188962",
                "title" : "BridgeClimb Experience at Sydney Harbour Bridge",
                "duration" : "4h",
                "fromPrice" : "$193",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/188962_l.jpeg?v=104026",
                "categories" : "Adventures"
            },
            {
                "ActivityID" : "473217",
                "title" : "Wollongong Tandem Skydive",
                "duration" : "4h",
                "fromPrice" : "$217",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/473217_l.jpeg?v=104026",
                "categories" : "Adventures"
            },
            {
                "ActivityID" : "189016",
                "title" : "Blue Mountains & Wildlife Day Tour",
                "duration" : "8h",
                "fromPrice" : "$119",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/189016_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "470655",
                "title" : "Hop-On Hop-Off Bus Tour",
                "duration" : "1d",
                "fromPrice" : "$35",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/470655_l.jpeg?v=104026",
                "categories" : "Hop-on Hop-off,Tours & Sightseeing"
            },
            ],
        // Paris
        "179898" : [
            {
                "ActivityID" : "171574",
                "title" : "Hop-On Hop-Off Bus Tour",
                "duration" : "1d",
                "fromPrice" : "$37",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/171574_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "171081",
                "title" : "Dinner Cruise on the Seine River",
                "duration" : "1h 30m",
                "fromPrice" : "$78",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/171081_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "171138",
                "title" : "Skip-the-Line: Louvre Museum Half-Day Tour",
                "duration" : "3h",
                "fromPrice" : "$63",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/171138_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "171063",
                "title" : "River Seine Sightseeing Cruise",
                "duration" : "2h",
                "fromPrice" : "$17",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/171063_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "171336",
                "title" : "Versailles & Gardens Half-Day Tour with Skip-the-Line Entry",
                "duration" : "4h",
                "fromPrice" : "$90",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/171336_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "171593",
                "title" : "Louvre Museum Ticket with Skip-the-Line Entry & Audio-Guide",
                "duration" : "3h 30m",
                "fromPrice" : "$44",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/171593_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "469026",
                "title" : "Seine Dinner Cruise, Eiffel Tower & Moulin Rouge with Champagne",
                "duration" : "8h",
                "fromPrice" : "$291",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/469026_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "256718",
                "title" : "Small-Group Mona Lisa & Best of the Louvre Tour",
                "duration" : "2h",
                "fromPrice" : "$79",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/256718_l.jpeg?v=104026",
                "categories" : "Tours & Sightseeing"
            },
            {
                "ActivityID" : "171070",
                "title" : "The Lido Cabaret Show",
                "duration" : "2h",
                "fromPrice" : "$79",
                "largeImageURL" : "//a.travel-assets.com/lxweb/media-vault/171070_l.jpeg?v=104026",
                "categories" : "Attractions"
            }
            ],
    }

    function getActivitiesForRid(rid) {
        console.log("Inside getActivitiesForRid : "+rid);
        //console.log(rid_activity_mapping[rid]);
        var mappedActivities = rid_activity_mapping[rid];
        var htmlStr; 
        var ulId = "ul_activitiesPerRid_"+rid;
        var ulElem = document.getElementById(ulId);
        if($.trim($(ulElem).text()) == '') {
            $(ulElem).show();
            if(mappedActivities) {
                for(var i=0; i< mappedActivities.length;i++) {
                    htmlStr = "<li>";
                    htmlStr += "<div class='activity-tile' style='background-image: url(https://"+mappedActivities[i].largeImageURL+")'></div>";
                    htmlStr += "<div class='activity-title'>"+mappedActivities[i].title+"</div>";
                    htmlStr += "</li>";
                    //console.log(htmlStr);
                    $(ulElem).append(htmlStr);
                }
            }
        }
        else {
            $(ulElem).empty();
            $(ulElem).hide();
        }
    }

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

    function encodeQueryData(data) {
        var ret = [];
        for (var d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

    function createPlanUrl() {
        // https://www.expedia.com/lx/api/search?
        // rid=1488&startDate=2017-06-18&endDate=2017-06-24&categories=Water+Activities
        var selectedDestData = JSON.parse($("#ip_selectedDestinationData").val());
        //console.log("********");
        //console.log(selectedDestData);
        var startDate = $("#div_startDatepicker").val();
        var endDate = $("#div_endDatepicker").val();
        var selectedAffinities = [];
        $('.affinity-ip').each(function (index, value) { 
            if( $(this).is(':checked') ) {
                var affinity = $(this).attr('data');
                //Get corresponding activity filter
                $.each(affinity_filter_mapping, function(key, value) {
                //console.log(key);
                //console.log(value);
                   if( _.contains(value, affinity)) {
                       if(!_.contains(selectedAffinities, key)) {
                           selectedAffinities.push(key);
                        }
                   }
                });
            }
        });
        //console.log(selectedAffinities);
        // Currently destination or multi region ids are not supported.
        // get activities for each region and create a ranked mapping
        // Activities are delimited by "|" or %7C
        var lxUrlObj = {
            "destination" : selectedDestData.value,
            "rids" : selectedDestData.rids,
            "startDate" : startDate,
            "endDate" : endDate,
            "categories" : selectedAffinities,
            "destinations" : selectedDestData.destinations,
            "tlas" : selectedDestData.tlas
        }
        
        var url = "rid="+selectedDestData.rids[0]
                  +"&startDate="+startDate+"&endDate="+endDate+"&categories=";
        //console.log(url);
        return lxUrlObj;
    }

    function buildUrl(url, parameters){
        var qs = "";
        for(var key in parameters) {
            var value = parameters[key];
            qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
        if (qs.length > 0){
            qs = qs.substring(0, qs.length-1); //chop off last "&"
            url = url + "?" + qs;
        }
        return url;
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
                    destinations: ["Orlando, Florida, USA"],
                    rids: ["178294"],
                    tlas: ["ORL"],
                    coordinates: [{ lat: "28.541290", lng: "-81.379040"}]
                },
                {
                    label: "Hawaii, USA", // Multiregion
                    value: "Hawaii, United States of America",
                    rids: ["180077", "180073", "180074" ], // oahu, maui, big island
                    tlas: ["HNL", "OGG", "KOA"],
                    destinations: ["Honolulu, Hawaii, USA", "Maui, Hawaii, USA", "Hawaii Island, Hawaii, USA"],
                    coordinates: [
                        { lat: "20.618483", lng: "-157.199225"},
                        { lat: "20.798363", lng: "-156.331925"},
                        { lat: "19.542915", lng: "-155.665857"}
                    ]
                },
                {
                    label: "Honolulu, Hawaii, USA", // Multiregion
                    value: "Honolulu, Hawaii, United States of America",
                    rids: ["180077"], // oahu, maui, big island
                    tlas: ["HNL"],
                    destinations: ["Honolulu, Hawaii, USA"],
                    coordinates: [
                        { lat: "20.618483", lng: "-157.199225"}
                    ]
                },
                {
                    label: "Maui, Hawaii, USA", // Multiregion
                    value: "Maui, Hawaii, United States of America",
                    rids: ["180073"], // oahu, maui, big island
                    tlas: ["OGG"],
                    destinations: ["Maui, Hawaii, USA"],
                    coordinates: [
                        { lat: "20.798363", lng: "-156.331925"}
                    ]
                },
                {
                    label: "Hawaii Island, Hawaii, USA", // Multiregion
                    value: "Hawaii Island, Hawaii, United States of America",
                    rids: ["180074"], // oahu, maui, big island
                    tlas: ["KOA"],
                    destinations: ["Hawaii Island, Hawaii, USA"],
                    coordinates: [
                        { lat: "19.542915", lng: "-155.665857"}
                    ]
                },
                {
                    label: "Cancun, Quintana Roo, Mexico", // Multicity
                    value: "Cancun, Quintana Roo, Mexico",
                    rids: ["179995"],
                    tlas: ["CUN"],
                    destinations: ["Cancun, Quintana Roo, Mexico"],
                    coordinates: [{ lat: "21.163620", lng: "-86.825780"}]
                },
                {
                    label: "Paris, France", // Multicity
                    value: "Paris, France",
                    rids: ["179898"],
                    tlas: ["PAR"],
                    destinations: ["Paris, France"],
                    coordinates: [{ lat: "48.862720", lng: "2.343750"}]
                },
                {
                    label: "Australia", // Multiregion
                    value: "Australia",
                    rids: ["179993", "179999", "178283", "178312"],
                    destinations: ["Brisbane, Australia", "Cairns, Australia", "Melbourne, Australia", "Sydney, Australia"],
                    tlas: ["BNE", "CNS", "MEL", "SYD"],// Brisbane, Cairns, Melbourne, Sydney
                    coordinates: [
                        { lat: "-27.468300", lng: "153.026990"},
                        { lat: "-16.927434", lng: "145.747143"},
                        { lat: "-37.815130", lng: "144.960750"},
                        { lat: "-33.867570", lng: "151.208440"}
                    ]
                },
                {
                    label: "Brisbane, Australia", // Multiregion
                    value: "Brisbane, Australia",
                    rids: ["179993"],
                    tlas: ["BNE"],// Brisbane
                    destinations: ["Brisbane, Australia"],
                    coordinates: [
                        { lat: "-27.468300", lng: "153.026990"}
                    ]
                },
                {
                    label: "Cairns, Australia", // Multiregion
                    value: "Cairns, Australia",
                    rids: ["179999"],
                    tlas: ["CNS"],// Cairns
                    destinations: ["Cairns, Australia"],
                    coordinates: [
                        { lat: "-16.927434", lng: "145.747143"}
                    ]
                },
                {
                    label: "Melbourne, Australia", // Multiregion
                    value: "Melbourne, Australia",
                    rids: ["178283"],
                    tlas: ["MEL"],// Cairns
                    destinations: ["Melbourne, Australia"],
                    coordinates: [
                        { lat: "-37.815130", lng: "144.960750"}
                    ]
                },
                {
                    label: "Sydney, Australia", // Multiregion
                    value: "Sydney, Australia",
                    rids: ["178312"],
                    tlas: ["MEL"],// Cairns
                    destinations: ["Melbourne, Australia"],
                    coordinates: [
                        { lat: "-33.867570", lng: "151.208440"}
                    ]
                },
                {
                    label: "Japan", // Multiregion
                    value: "Japan",
                    rids: ["179900", "179897"],
                    tlas: ["TYO", "OSA"],// Tokyo, Osaka
                    destinations: ["Tokyo, Japan", "Kyoto, Japan"],
                    coordinates: [
                        { lat: "35.675000", lng: "139.760000"},
                        { lat: "35.011229", lng: "135.768125"}
                    ]
                },
                {
                    label: "Tokyo, Japan", // Multiregion
                    value: "Tokyo, Japan",
                    rids: ["179900"],
                    tlas: ["TYO"],// Tokyo
                    destinations: ["Tokyo, Japan"],
                    coordinates: [
                        { lat: "35.675000", lng: "139.760000"}
                    ]
                },
                {
                    label: "Kyoto, Japan", // Multiregion
                    value: "Kyoto, Japan",
                    rids: ["179897"],
                    tlas: ["OSA"],// Tokyo, Osaka
                    destinations: ["Kyoto, Japan"],
                    coordinates: [
                        { lat: "35.011229", lng: "135.768125"}
                    ]
                },
                {
                    label: "Morocco", // Multiregion
                    value: "Morocco",
                    rids: ["6084755", "6084756"],
                    tlas: ["CMN", "RAK"],// Casablanca, Marrakech
                    destinations: ["Casablanca, Morocco", "Marrakech, Morocco"],
                    coordinates: [
                        { lat: "33.515640", lng: "-7.694306"},
                        { lat: "31.631600", lng: "-8.009210"}
                    ]
                },
                {
                    label: "Casablanca, Morocco", // Multiregion
                    value: "Casablanca, Morocco",
                    rids: ["6084755"],
                    tlas: ["CMN"],// Casablanca
                    destinations: ["Casablanca, Morocco"],
                    coordinates: [
                        { lat: "33.515640", lng: "-7.694306"}
                    ]
                },
                {
                    label: "Marrakech, Morocco", // Multicity
                    value: "Marrakech, Morocco",
                    rids: ["6084756"],
                    tlas: ["RAK"],// Marrakech
                    destinations: ["Marrakech, Morocco"],
                    coordinates: [
                        { lat: "31.631600", lng: "-8.009210"}
                    ]
                },
                {
                    label: "Thailand", // Multiregion
                    value: "Thailand",
                    rids: ["178236"],
                    tlas: ["BKK"],// Bangkok
                    destinations: ["Bangkok, Thailand"],
                    coordinates: [
                        { lat:"13.747500", lng:"100.536010"}
                    ]
                },
                {
                    label: "Bangkok, Thailand", // Multiregion
                    value: "Bangkok, Thailand",
                    rids: ["178236"],
                    tlas: ["BKK"],// Bangkok
                    destinations: ["Bangkok, Thailand"],
                    coordinates: [
                        { lat:"13.747500", lng:"100.536010"}
                    ]
                },
                {
                    label: "Scotland, United Kingdom", // Multiregion
                    value: "Scotland, United Kingdom",
                    rids: ["6069845", "602905"],
                    tlas: ["EDI", "GLA"],// Edinburgh, Glasgow
                    destinations: ["Edinburgh, Scotland, United Kingdom", "Glasgow, Scotland, United Kingdom"],
                    coordinates: [
                        { lat:"55.951370", lng:"-3.196380"},
                        { lat: "55.861180", lng: "-4.250200"}
                    ]
                },
                {
                    label: "Edinburgh, Scotland, United Kingdom", // Multiregion
                    value: "Edinburgh, Scotland, United Kingdom",
                    rids: ["6069845"],
                    tlas: ["EDI"],// Edinburgh
                    destinations: ["Edinburgh, Scotland, United Kingdom"],
                    coordinates: [
                        { lat:"55.951370", lng:"-3.196380"}
                    ]
                },
                {
                    label: "Glasgow, Scotland, United Kingdom", // Multiregion
                    value: "Glasgow, Scotland, United Kingdom",
                    rids: ["602905"],
                    tlas: ["GLA"],// Edinburgh
                    destinations: ["Glasgow, Scotland, United Kingdom"],
                    coordinates: [
                        { lat: "55.861180", lng: "-4.250200"}
                    ]
                },
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
        //console.log("submit clicked");

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
                var nextUrlObj = createPlanUrl();

                //Go to itinerary view
                $.ajax({
                    type: "POST",
                    url: "/itinerary",
                    data: nextUrlObj
                })
                .done(function(d){
                    //console.log("POST sucess");
                    //console.log(d);
                    var categoryStr = _.compact(d.categories).join('|');
                    var ridStr = _.compact(d.rids).join(',');
                    var destStr = _.compact(d.destinations).join('|');
                    var params = {
                        "destination" : d.destination,
                        "rids" : ridStr,
                        "startDate" : encodeURIComponent(d.startDate),
                        "endDate" : encodeURIComponent(d.endDate),
                        "categories" : categoryStr,
                        "destinations" : destStr,
                        "tlas" : d.tlas
                    }

                    var itinUrl = "/itinerary";
                    //console.log(buildUrl(itinUrl,params));
                    window.location.href = buildUrl(itinUrl,params) ;
                })
                .fail(function(e){console.log(e);console.log('POST fail');})
                .always(function(){});

            }
        }
        else {
            $("#div_errorSubmit").show();
        }
    });

    $("#div_bkBtn,#div_itinHdrTxt").each(function(){
        $(this).on('click', function(e) {
            //pass some params to rpeserve search values
            window.location.href = "/welcome";
        });
    });

    $("#div_ftrRedoSearch,#div_hdrRedoSearch").each(function(){
        $(this).on('click', function(e) {
            window.location.href = "/welcome";
        });
    });

    $("#div_hdrDay2Day,#div_hdrDay2Day").each(function(){
        $(this).on('click', function(e) {
            //pass some params to show the day2day view without url change
            window.location.href = "/welcome";
        });
    });

    $("li.things-to-do div.timeline-body, li.things-to-do h4").on("click", function(e) {
        console.log("activity body clicked");
        console.log($(this).attr("data"));
        getActivitiesForRid($(this).attr("data"));
    });
});
