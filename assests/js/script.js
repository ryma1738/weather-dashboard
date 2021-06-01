var mobileHistoryCounter = 0; 
//if the length of the search history is over 2 set class d-sm-none, and if history is over 10 delete the 11th
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
                getWeather(lat, lon, search);
            });
        }
        else {
            alert("City Not found or server is down. Please try again.");
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

                for (var i = 0; i < 6; i++) {
                    if (current) {
                        current = false;
                        date.push(moment().format("MM,DD,YYYY"));
                        temp.push(data.current.temp);
                        wind.push(data.current.wind_speed);
                        humidity.push(data.current.humidity);
                        uvIndex = data.current.uvi;
                        icon.push(data.current.weather[0].id);
                        i--;
                    }
                    else {
                        date.push(moment().format("MM,DD,YYYY").add((i + 1), "days"));
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
                    wind: wind,
                    humidity: humidity,
                    uvIndex: uvIndex,
                    icon: icon,
                    city: city
                };
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
    if (index === 0) {
        var baseClasses = "icon-lg bi ";
    }
    else {
        var baseClasses = "icon-sm bi ";
    }
    for (var i = 0; i < iconWeatherClasses.length; i++) {
        if ($("#icon-" + index).hasClass(iconWeatherClasses[i])) {
            $("#icon-" + index).removeClass(iconWeatherClasses[i]);
        }
    }
    var classIndex = weather.icon;
    $("icon-" + index).addClass(iconWeatherIndex.classIndex);
    


    
}

function displayWeather(weather) {
    //updates html with new weather data
    if ($("#display-weather").hasClass("d-none")) {
        $("#display-weather").removeClass("d-none");
    }

    $("#uv-index").text(weather.uvIndex);
    $("#city-displayed").text(weather.city + ":");

    for (var i = 0; i < weather.tempLow.length; i++) {
        $("#temp-" + i + "-low").text(weather.tempLow[i]);
    }
    for (var i = 0; i < weather.temp.length; i++) {
        $("#temp-" + i).text(weather.temp[i]);
        $("#wind-" + i).text(weather.wind[i]);
        $("#hum-" + i).text(weather.humidity[i]);
        $("#icon-" + i).addClass(getIcon(weather, i));
    }
}

function saveHistory(){
    //Saves the search history
}

function loadHistory() {
    //Loads the history and fills the values
}



//Inital functions and event listeners

$("#city-form").on("submit", searchClicked);


