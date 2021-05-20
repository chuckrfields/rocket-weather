var openWeatherMapAPI = '41dcd9d8063f4abb3ee28c6c6fbc6354';
var citiesContainerEL = document.querySelector("#cities-container");
var launchContainerEL = document.querySelector("#launch-container");
var forecastContainerEL = document.querySelector("#forecast-container");
var cityFormEL = document.querySelector("#city-form");
var cityTitleEL  = document.querySelector("#city-title");
var cityNameEL = document.querySelector("#cityname");
var fiveDayForecastEL = document.querySelector("#five-day-forecast");
var cityHistoryEL = document.querySelector("#cities-container");

// function WeatherObj(image, temp, wind, humidity) {
//     this.image = image;
//     this.temp = temp;
//     this.wind = wind;
//     this.humidity = humidity;
// }
var weatherObj;// = {image: "", temp: "", wind: "", humidity: ""};

var list = JSON.parse(localStorage.getItem('weathercities')) || []; //Short-circuit evaluation

var formSubmitHander = function(event) {
    event.preventDefault();
    /*
    event.preventDefault() stops the browser from performing the default action the event wants it to do. 
    In the case of submitting a form, it prevents the browser from sending the form's input data to a URL, 
    as we'll handle what happens with the form input data ourselves in JavaScript.
    */
    launchContainerEL.textContent = "";
    cityTitleEL.textContent = "";
    forecastContainerEL.textContent = "";
    fiveDayForecastEL.textContent = "";

    var cityname = cityNameEL.value.trim();
    if (cityname) {
        // format city name - Capitalize first letter of word(s) in city name
        var cityWords = cityname.toLowerCase().split(' ');
        for (var i = 0; i < cityWords.length; i++) {
            cityWords[i] = cityWords[i].charAt(0).toUpperCase() + cityWords[i].substring(1);
        }
        cityname = cityWords.join(' ');
        saveCityHistory(cityname);
        getCityCoordinates(cityname);
        cityNameEL.value = '';
    }
    else {
        alert("Please enter a city");
    }
}

cityFormEL.addEventListener("submit", formSubmitHander);

var date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    };

var displayLaunches = function(data) {
    // console.log(data);
    launchContainerEL.textContent = "";
    var containerEL = document.createElement("div");
    containerEL.setAttribute("class", "container");
    var rowEL = document.createElement("div");
    rowEL.setAttribute("class", "row");

    // check if api returned forecast
    if (data.length === 0) {
        launchContainerEL.textContent = "No launch found";
        return;
    }

    fiveDayForecastEL.textContent = "Upcoming Launches:"
    // loop through next 10 launches in array
    var launchesArr = data.results;
    // console.log(dailyArr);
    for (var i = 0; i< 10; i++) {
        // console.log(dailyArr[i]);
        // get date
        var date = launchesArr[i].net;

        // date = '2021-05-20T17:09:00Z';
        // console.log(date);
        var convertedDate = new Date(date);// new Date(date * 1000).toLocaleString();
        // console.log('convertedDate: ' + convertedDate);

        var convertedTime;
        var daysOut = 30;

        var today = new Date();
        console.log(today);
        console.log(convertedDate);
        daysOut = date_diff_indays(today, convertedDate);

        if (convertedDate.getHours() == 20 && convertedDate.getMinutes() == 0) {
            convertedTime = "tbd";
        }
        else {
            var h = convertedDate.getHours();
            var pm = false;
            if (h > 12) {
                pm = true;
                h = h - 12;
            }
            
            var m = convertedDate.getMinutes();
            if (m < 10) {
                m = "0" + m;
            }

            // console.log('h: ' + h);
            // console.log('m: ' + m);
           var timezone = new Date(date).toString().match(/\(([A-Za-z\s].*)\)/)[1];
    
            if (pm) {
                convertedTime = h + ":" + m.toString() + ' PM ' + timezone;
            }
            else {
                convertedTime = h + ":"  + m.toString() + ' AM ' + timezone;
            }

            // console.log('time: ' + convertedTime);
        }

        // console.log(convertedTime);
        console.log('daysout: ' + daysOut);

        var colEL = document.createElement("div");
        colEL.setAttribute("class", "col col-md-2.5");
        var cardEL = document.createElement("div");
        cardEL.classList = "card text-white bg-secondary mb-3";
        cardEL.setAttribute("style", "width: 30rem;");
        var cardHeaderEL = document.createElement("div");
        cardHeaderEL.setAttribute("class", "card-header");
        cardHeaderEL.textContent = convertedDate.toLocaleDateString();

        var cardTitleEL =document.createElement("div");
        cardTitleEL.setAttribute("class", "card-title");
        cardTitleEL.textContent = convertedTime;

        var cardBodyEL = document.createElement("div");
        cardBodyEL.setAttribute("class", "card-body");

        //imgURL
        var rocketImage = document.createElement("img");
        var imgURL = launchesArr[i].image;
        rocketImage.setAttribute("src", imgURL);
        rocketImage.setAttribute("class", ".card-img-top");
        rocketImage.setAttribute("style", "width: 25rem;");
        // console.log(iconURL);
        cardBodyEL.appendChild(rocketImage);

        //name
        var missionNameEL = document.createElement("div");
        var missionName = launchesArr[i].name;
        missionNameEL.setAttribute("class", "card-title");
        missionNameEL.textContent = missionName;
        cardBodyEL.appendChild(missionNameEL);
        console.log(missionName);

        //location
        var lat = launchesArr[i].pad.latitude;
        var long = launchesArr[i].pad.longitude;
        // console.log(lat);
        // console.log(long);

       //description
       var missionDescription;
       if (!launchesArr[i].mission) {
           //ignore
           missionDescription = '';
       }
       else {
            missionDescription = launchesArr[i].mission.description;
            // console.log(missionDescription);
            var missionDescEL = document.createElement("p");
            // missionDescEL.setAttribute("style", ".card-body");
            missionDescEL.textContent = missionDescription;
            cardBodyEL.appendChild(missionDescEL);

            var weatherDescEL = document.createElement("div");

            if (daysOut < 9) {
                console.log('daysout < 9: ' + daysOut);
                 getCityWeather(lat, long, location, convertedDate);
                console.log('in displayLaunches');
                console.log(weatherObj);
                
                if (weatherObj != null) {
                   // loop over values
                   console.log(Object.values(weatherObj));

                    // icon
                    var weatherImage = document.createElement("img");
                    var iconURL = weatherObj.image;
                    weatherImage.setAttribute("src", iconURL);
                    weatherImage.setAttribute("class", "weather-icon");
                    // console.log(iconURL);
                    weatherDescEL.appendChild(weatherImage);

                    //temperature
                    var forecastTemperatureEL = document.createElement("p");
                    forecastTemperatureEL.textContent = weatherObj.temp;
                    weatherDescEL.appendChild(forecastTemperatureEL);

                    // wind
                    var forecastWindEL = document.createElement("p");
                    forecastWindEL.textContent = weatherObj.wind;
                    weatherDescEL.appendChild(forecastWindEL);

                    // humidity
                    var forecastHumidityEL = document.createElement('p');
                    forecastHumidityEL.textContent = weatherObj.humidity;
                    weatherDescEL.appendChild(forecastHumidityEL);
                }
                else {
                    console.log("weatherObj is null");
                    weatherDescEL.textContent = "nothing to display";
                }
            }

            cardBodyEL.appendChild(weatherDescEL);
       }

        var location = "";
        if (!launchesArr[i].pad) {
            location = launchesArr[i].pad.location.name;
            console.log('location: ' + location);
        }

        cardEL.appendChild(cardHeaderEL);
        cardEL.appendChild(cardTitleEL);
        cardEL.appendChild(cardBodyEL);

        colEL.appendChild(cardEL);

        rowEL.appendChild(colEL);
    }
    
    containerEL.appendChild(rowEL);

    launchContainerEL.appendChild(containerEL);
};

var getUVIndexColorClass = function(uvIndex) {
    if (uvIndex < 3) {
        return "favorable";
    }
    else if (uvIndex <8) {
        return "moderate";
    }
    else {
        return "severe";
    }
}

var displayForecast = function(data, launchDate) {
    console.log("in displayForecast");
    // console.log(data);
    // forecastContainerEL.textContent = "";
    
    // check if api returned forecast
    if (data.length === 0) {
        console.log("No forecast found");
        return;
    }

    // fiveDayForecastEL.textContent = "5-Day Forecast:"
    // loop through 5-day forecast in daily array
    var dailyArr = data.daily;
    // console.log(dailyArr);
    for (var i = 0; i< dailyArr.length; i++) {
        // console.log(dailyArr[i]);
        // get date
        var date = dailyArr[i].dt;
        var convertedDate = new Date(date * 1000).toDateString();
        // console.log(date);
        launchDate = new Date(launchDate).toDateString();
        
        if (launchDate === convertedDate) {
            console.log('launchDate: ' + launchDate);
            console.log('convertedDate: ' + convertedDate);
            console.log("We have a match!");

            //icon
            var iconURL = 'http://openweathermap.org/img/wn/' + dailyArr[i].weather[0].icon + '@2x.png';

            //temperature
            var tempKelvin = dailyArr[i].temp.day;
            var forecastTempF = (tempKelvin - 273.15) * (9/5) + 32;

            // wind
            var windSpeed = dailyArr[i].wind_speed; 

            // weatherObj.image = iconURL;
            // weatherObj.temp = forecastTempF.toFixed(2) + "˚ F";
            // weatherObj.wind = windSpeed.toFixed(2) + ' MPH';
            // weatherObj.humidity = dailyArr[i].humidity + ' %';

            weatherObj = {image: iconURL, temp: forecastTempF.toFixed(2) + "˚ F", wind: windSpeed.toFixed(2) + ' MPH', humidity: dailyArr[i].humidity + ' %'};

            console.log('set weather obj');
            console.log(weatherObj);
             return;

        };
    };
};

var getCityWeather = function(lat, long, city, convertedDate) {
    // get current weather conditions for city
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&APPID=" + openWeatherMapAPI;
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                     console.log(data);
                    // displayWeather(city, data);
                    displayForecast(data, convertedDate);
                    console.log(" in getCityWeather");
                    console.log(weatherObj);
                //    return weatherObj;
                });
            }
            else {
                alert("Unable to get weather for " + city);
            }
        })
        .catch(function(error) {
            // 404 error returned
            alert("Unable to connect to OpenWeatherMap.org");
        });
};


var getUpcomingLaunches = () => {
    // var apiURL = "https://ll.thespacedevs.com/2.0.0/launch/upcoming/?limit=10&offset=0&ordering=net"; //prod
    var apiURL = "https://lldev.thespacedevs.com/2.0.0/launch/upcoming/?limit=10&offset=0&ordering=net"; //dev
    // console.log(apiURL);
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                     console.log(data);
                    displayLaunches(data);
                });
            }
            else {
                alert("Unable to get upcoming launches!");
            }
        })
        .catch(function(error) {
            // 404 error returned
            alert("Unable to connect to thespacedevs.com");
        });
};

// var saveCityHistory = function(city) {
//     cityHistoryEL.textContent = "";
//     var list = JSON.parse(localStorage.getItem('weathercities')) || []; //Short-circuit evaluation

//     var n = list.includes(city);

//     if (n === false) {
//         console.log("saving new city " + city)
//         list.push(city);
//         // Save the city into localStorage
//         // We need to use JSON.stringify to turn the list from an array into a string
//         localStorage.setItem('weathercities', JSON.stringify(list));
//     }

//     getSavedCities(list);

//     // Clear the textbox when done using `.val()`
//     // $('#cityname').val('');
// }


// getSavedCities = function(list) {

//      // Iterates over the 'list'
//      for (var i = 0; i < list.length; i++) {
//         // Creates a new variable 'cityItem' that will hold a "<p>" tag
//         // Sets the `list` item's value as text of this <p> element
//         var cityItem = $('<p>');
//         // cityItem.text(list[i]);

//         // Creates a button `citySearchBtn` with an attribute called `data-city and a unique `id`
//         var citySearchBtn = $('<button>');
//         citySearchBtn.attr('data-city', i);

//         // Gives the button a class 
//         citySearchBtn.addClass('button');

//         // Adds text value to button for city
//         citySearchBtn.text(list[i]);

//         // Adds the button to the `cityItem`
//         cityItem = cityItem.prepend(citySearchBtn);

//         // Adds 'cityItem' to the City History List div
//         $('#cities-container').append(cityItem);
//       }
// }

// City history search
$(document).on('click', '.button', function() {
    console.log('testing button click')
    weatherContainerEL.textContent = "";
    cityTitleEL.textContent = "";
    forecastContainerEL.textContent = "";
    fiveDayForecastEL.textContent = "";
    // Get the `id` of the button from its data attribute and hold in a variable called 'getCity' (array item index)
    //this refers to the function invoked by the click event.
    var getCity = $(this).attr('data-city');
    console.log(getCity);

    var list = JSON.parse(localStorage.getItem('weathercities')) || []; //Short-circuit evaluation
    // console.log(list);
    // console.log(list[getCity]);

    getCityCoordinates(list[getCity]);

  });

// getCityCoordinates("Indianapolis");
// getSavedCities(list);

getUpcomingLaunches();