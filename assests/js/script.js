var mobileHistoryCounter = 0; 
//if the length of the search history is over 2 set class d-sm-none, and if history is over 10 delete the 11th
var weather = {};


function getGeolocation() {
    //takes the city name and gets the weather values for it. It then sends it to the
    var search = $("#city").val();
    search = search.trim();
    var apiKey = "http://api.openweathermap.org/geo/1.0/direct?q=" + search +  
    "&limit=1&appid=092da386c4cb34ff855fb9f8e6c59a3b";

    fetch(apiKey).then(function(responce) {
        //check to see if city comes up / if error in responce
        if (responce.ok) {
            responce.json().then(function(data) {
                //do stuff with the data
                var lat = data[0].lat;
                var lon = data[0].lon;
                getWeather(lat, lon)
            });
        }
        else {
            alert("City Not found or server is down. Please try again.");
        }
        
    });

}

function getWeather(lat, lon) {
    weather = {};
    var apiKey = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +  
    "&units=imperial&exclude=minutely,hourly,alerts&appid=092da386c4cb34ff855fb9f8e6c59a3b";

    fetch(apiKey).then(function(responce) {
        //check to see if city comes up / if error in responce
        if (responce.ok) {
            responce.json().then(function(data) {
                //do stuff with the data
                var date = [];
                var temp = [];
                var tempLow = [];
                var wind = [];
                var humidity = [];
                var uvIndex = null;
                var icon = [];
                var current = true;

                for (var i = 0; i < 6; i++) {
                    if (current) {
                        current = false;
                        date.push(moment().format("MM,DD,YYYY"));
                        temp.push(data.current.temp);
                        wind.push(data.current.wind_speed);
                        humidity.push(data.current.humidity);
                        uvIndex = data.current.uvi;
                        icon.push(data.current.weather[0].main);
                        i--;
                    }
                    else {
                        date.push(moment().format("MM,DD,YYYY"));
                        temp.push(data.daily[i].temp.max);
                        tempLow.push(data.daily[i].temp.min)
                        wind.push(data.daily[i].wind_speed);
                        humidity.push(data.daily[i].humidity);
                        icon.push(data.daily[i].weather[0].main);
                    }
                }

                weather = {
                    date: date,
                    temp: temp,
                    wind: wind,
                    humidity: humidity,
                    uvIndex: uvIndex,
                    icon: icon
                };

            });
        }
        else {
            alert("ERROR: Unkown Issue");
        }
        
    });
}

function searchClicked(event) {
     //Starts up funcitons for displaying weather for current city
     event.preventDefault();
     var check = $("#city").val();
     if (check) {
         getGeolocation();
     }
     else {
         alert("Please enter a city name!")
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

$("#city-form").on("submit", searchClicked);


