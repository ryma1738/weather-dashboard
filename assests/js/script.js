//Main Java Script file for Weather Dashboard Project

var searchHistory = [];
var iconWeatherClasses = ["bi-cloud-lightning-rain", "bi-cloud-lightning", "bi-lightning", "bi-cloud-drizzle", 
"bi-cloud-rain", "bi-cloud-rain-heavy", "bi-cloud-snow", "bi-cloud-sleet", "bi-cloud-fog", "bi-cloud-fog2", "bi-cloud-haze", 
"bi-cloud-haze-1", "bi-cloud-haze-fill", "bi-tornado", "bi-brightness-high", "bi-cloud-sun", "bi-cloud", "bi-clouds"]
var iconWeatherIndex = {
    200: "bi-cloud-lightning-rain",201: "bi-cloud-lightning-rain",202: "bi-cloud-lightning-rain",
    210: "bi-cloud-lightning",211: "bi-cloud-lightning",212: "bi-cloud-lightning",221: "bi-lightning",
    230: "bi-cloud-lightning-rain",231: "bi-cloud-lightning-rain",232: "bi-cloud-lightning-rain",
    300: "bi-cloud-drizzle",301: "bi-cloud-drizzle",302: "bi-cloud-drizzle",310: "bi-cloud-drizzle",
    311: "bi-cloud-drizzle",312: "bi-cloud-drizzle",313: "bi-cloud-rain",314: "bi-cloud-rain",
    321: "bi-cloud-rain",500: "bi-cloud-rain",501: "bi-cloud-rain",502: "bi-cloud-rain",503: "bi-cloud-rain-heavy",
    504: "bi-cloud-rain-heavy",511: "bi-snow",520: "bi-cloud-rain-",521: "bi-cloud-rain-",522: "bi-cloud-rain-heavy",
    531: "bi-cloud-rain-heavy",600: "bi-cloud-snow",601: "bi-cloud-snow",602: "bi-cloud-snow",611: "bi-cloud-sleet",
    612: "bi-cloud-sleet",613: "bi-cloud-sleet",615: "bi-cloud-sleet",616: "bi-cloud-sleet", 620: "bi-cloud-snow",
    621: "bi-cloud-snow",622: "bi-cloud-snow",701: "bi-cloud-fog2",711: "bi-cloud-haze-1",721: "bi-cloud-haze",
    731: "bi-cloud-haze-fill",741: "bi-cloud-fog",751: "bi-cloud-haze-fill",761: "bi-cloud-haze-fill",
    762: "bi-cloud-haze-fill",771: "bi-cloud-haze-fill",781: "bi-tornado",800: "bi-brightness-high",
    801: "bi-cloud-sun",802: "bi-cloud",803: "bi-clouds",804: "bi-clouds",
}

function getGeolocation() {
    //takes the city name and gets the weather values for it. It then sends it to the
    var search = $("#city").val();
    $("#city").val("");
    search = search.trim().toLowerCase().split(" ");
    for (var i = 0; i < search.length; i++) {
        search[i] = search[i].charAt(0).toUpperCase() + search[i].substring(1);
    }
    search = search.join(" ");

    var apiKey = "http://api.openweathermap.org/geo/1.0/direct?q=" + search +  
    "&limit=1&appid=092da386c4cb34ff855fb9f8e6c59a3b";

    fetch(apiKey).then(function(responce) {
        //check to see if city comes up / if error in responce
        if (responce.ok) {
            responce.json().then(function(data) {
                //do stuff with the data
                console.log(data)
                if (data.length > 0) {
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    getWeather(lat, lon, search);
                }     
                else if (data.length === 0) {
                    alert("City Not found. Please try again.");
                }
                else {
                    alert("Unknown Error Occured")
                }
            });     
        }
        else {
            alert("Their was an unexpected network error. Please try again.")
        }
    });
}

function getWeather(lat, lon, city) {
    var weather = {};
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
                var today = moment();

                for (var i = 0; i < 6; i++) {
                    if (current) {
                        current = false;
                        date.push(today.format("L"));
                        temp.push(data.current.temp);
                        wind.push(data.current.wind_speed);
                        humidity.push(data.current.humidity);
                        uvIndex = data.current.uvi;
                        icon.push(data.current.weather[0].id);
                        i--;
                    }
                    else {
                        date.push(today.add(1, "days").format("L"));
                        temp.push(data.daily[i].temp.max);
                        tempLow.push(data.daily[i].temp.min)
                        wind.push(data.daily[i].wind_speed);
                        humidity.push(data.daily[i].humidity);
                        icon.push(data.daily[i].weather[0].id);
                    }
                }

                weather = {
                    date: date,
                    temp: temp,
                    tempLow: tempLow,
                    wind: wind,
                    humidity: humidity,
                    uvIndex: uvIndex,
                    icon: icon,
                    city: city
                };
                saveHistory(city);
                displayWeather(weather);
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

function getIcon(weather, index) {
    //Based of the weather data, sets a value for the weather icon to be displayed
    $("#icon-" + index).removeClass(iconWeatherClasses);

    for (var i = 0; i < iconWeatherClasses.length; i++) {
        if ($("#icon-" + index).hasClass(iconWeatherClasses[i])) {
            $("#icon-" + index).removeClass(iconWeatherClasses[i]);
        }
    }

    $("#icon-" + index).addClass(iconWeatherIndex[weather.icon[index]]);
}

function displayWeather(weather) {
    //updates html with new weather data
    if ($("#display-weather").hasClass("d-none")) {
        $("#display-weather").removeClass("d-none");
    }

    $("#uv-index").text(weather.uvIndex);
    $("#city-displayed").text(weather.city + ":");

    for (var i = 0; i < weather.tempLow.length; i++) {
        $("#temp-" + i + "-low").text(Math.round(weather.tempLow[i]) + "° F");
    }
    for (var i = 0; i < weather.temp.length; i++) {
        $("#weather-date-" + i).text(weather.date[i]);
        $("#temp-" + i).text(Math.round(weather.temp[i]) + "° F");
        $("#wind-" + i).text(weather.wind[i] + " MPH");
        $("#hum-" + i).text(weather.humidity[i]);
        getIcon(weather, i);
    }
}

function saveHistory(city){
    //Saves the search history
    searchHistory.splice(0, 0, city);
    if (searchHistory[0] === searchHistory[1]){
        searchHistory.shift();
    }
    if (searchHistory.length > 10) {
        searchHistory.pop();
    }

    localStorage.setItem("searchHistoryCity", JSON.stringify(searchHistory));
    displayHistory();
}

function loadHistory() {
    //Loads the history and fills the values
    //localStorage.removeItem("searchHistoryCity"); //use this to delete search history
    searchHistory = localStorage.getItem("searchHistoryCity");
    if (searchHistory === null) {
        searchHistory = [];
        return;
    }
        searchHistory = JSON.parse(searchHistory);
        displayHistory();
}

function displayHistory() {
    //Displays the history on the page
    var mobileHistoryCounter = 0;
    if (searchHistory) {
        $("#search-history").empty();
        for (var i = 0; i < searchHistory.length; i++) {
            mobileHistoryCounter++;
            if (mobileHistoryCounter > 2){ 
                $("#search-history")
                .append("<button class='bg-secondary bg-gradient col-12 mt-2 p-1 text-center rounded text-white d-none d-md-block'"
                + "id='history-btn' value='" + searchHistory[i] + "'>" + searchHistory[i] + "</div");
            }
            else {
                $("#search-history")
                .append("<button class='bg-secondary bg-gradient col-12 mt-2 p-1 text-center rounded text-white'"
                + "id='history-btn' value='" + searchHistory[i] + "'>" + searchHistory[i] + "</div");
            }
        }
    }  
}

//Inital functions and event listeners
loadHistory();
$("#city-form").on("submit", searchClicked);