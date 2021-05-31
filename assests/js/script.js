var mobileHistoryCounter = 0; 
//if the length of the play history is over 2 set class d-sm-none, and if history is over 20 delete the 21st



function getGeolocation() {
    //gets a geolocation from the name of the city API_KEY: AIzaSyDcSaXUpjF8v5imMvCPScFZGSa0arEGi7o
    var search = $("#city").val();
    $("#city").val("");
    search = search.trim();
    search = search.split(" ")
    var searchTemp = "CWC8%2BR9%20";
    for (var i = 0; i < search.length; i++) {
        searchTemp = search.join("%20" + search[i]);
    }
    search = searchTemp;

    fetch("https://maps.googleapis.com/maps/api/geocode/json?adress=" + search + "key=IzaSyDcSaXUpjF8v5imMvCPScFZGSa0arEGi7o").then(function(responce) {

    }).then(function(data) {

    });
}

function getWeather() {
    //takes the city name and gets the weather values for it. It then sends it to the
    

    fetch().then(function(responce) {
        //check to see if city comes up / if error in responce
    }).then(function(data) {
        //do stuff with the data
    });

}

function searchClicked() {
     //Starts up funcitons for displaying weather for current city
     var check = $("#city").val();
     if (check) {
         getGeolocation();
     }
     else {
         alert("Please enter a city name to search!");
     }
}

function getIcon() {
    //Based of the weather data, sets a value for the weather icon to be displayed
}

function saveHistory(){
    //Saves the search history
}

function loadHistory() {
    //Loads the history and fills the values
}



//Inital functions and event listeners

$("#city-form").on("submit", searchClicked());