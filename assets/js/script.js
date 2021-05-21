var openWeatherMapAPI = '41dcd9d8063f4abb3ee28c6c6fbc6354';
var citiesContainerEL = document.querySelector("#cities-container");
var launchContainerEL = document.querySelector("#launch-container");
var forecastContainerEL = document.querySelector("#forecast-container");
var cityFormEL = document.querySelector("#city-form");
var cityTitleEL  = document.querySelector("#city-title");
var cityNameEL = document.querySelector("#cityname");
var fiveDayForecastEL = document.querySelector("#five-day-forecast");
var cityHistoryEL = document.querySelector("#cities-container");

var date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    };

var list = JSON.parse(localStorage.getItem('weathercities')) || []; //Short-circuit evaluation

const getLaunchData = async () => {
    // var apiURL = "https://ll.thespacedevs.com/2.0.0/launch/upcoming/?limit=10&offset=0&ordering=net"; //prod
    // var apiURL = "https://lldev.thespacedevs.com/2.0.0/launch/upcoming/?limit=10&offset=0&ordering=net"; //dev
    console.log("index.html 10 | Processing...");
    const request = await fetch("https://ll.thespacedevs.com/2.0.0/launch/upcoming/?limit=10&offset=0&ordering=net");
    const data = await request.json();
    return data;
  };

  const getWeatherForLocation = async (latitude, longitude) => {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&APPID=" + openWeatherMapAPI;
    const request = await fetch(apiURL);
    const data = await request.json();
    return data;
  };

  const callDataInOrder = async () => {
    launchContainerEL.textContent = "";
    var containerEL = document.createElement("div");
    containerEL.setAttribute("class", "container");
    var rowEL = document.createElement("div");
    rowEL.setAttribute("class", "row");

    const launchData = await getLaunchData();
    // console.log('callDataInCorder line 43');
    // console.log(launchData);
     // check if api returned forecast
     if (launchData.length === 0) {
        launchData.textContent = "No launch found";
        return;
     }

         // loop through next 10 launches in array
    var launchesArr = launchData.results;
    // console.log(dailyArr);
    for (var i = 0; i< launchesArr.length; i++) {
         console.log('line 55 looping through launches; at number: ', i);
        // get date
        var launchDate = launchesArr[i].net;

        // date = '2021-05-20T17:09:00Z';
        // console.log(date);
        var convertedDate = new Date(launchDate);// new Date(date * 1000).toLocaleString();
        console.log('convertedDate: ' + convertedDate);

        var convertedTime;
        var daysOut = 30;

        var today = new Date();
        // console.log('today: ', today);
        // console.log('convertedDate: ', convertedDate);
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
           var timezone = new Date(launchDate).toString().match(/\(([A-Za-z\s].*)\)/)[1];
    
            if (pm) {
                convertedTime = h + ":" + m.toString() + ' PM ' + timezone;
            }
            else {
                convertedTime = h + ":"  + m.toString() + ' AM ' + timezone;
            }

            // console.log('time: ' + convertedTime);
        }

        // console.log(convertedTime);
        // console.log('daysout: ' + daysOut);

        var colEL = document.createElement("div");
        colEL.setAttribute("class", "col col-md-2.5");
        colEL.setAttribute("id", "#col-" + i);
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
             console.log('missionDescription 153: ', missionDescription);
            var missionDescEL = document.createElement("p");
            // missionDescEL.setAttribute("style", ".card-body");
            missionDescEL.textContent = missionDescription;
            cardBodyEL.appendChild(missionDescEL);

            var weatherDescEL = document.createElement("div");

            if (daysOut < 9) {
                console.log("index.html 170 | launchData", launchData);
                // document.getElementById("total-cases").innerText =
                //   covidData.confirmed.value;
            
                const detailData = await getWeatherForLocation(lat, long);
                console.log("index.html 175 | detail Data", detailData);
                // document.getElementById("city-of-origin").innerText =
                //   detailData[0].confirmed;
                console.log("index.html 178 | detail Data timezone", detailData.timezone);

                //get forecast array
                var dailyArr = detailData.daily;
                console.log ("dailyArr", dailyArr);

                //find matching date
                for (var w = 0; w< dailyArr.length; w++) {
                    // console.log(dailyArr[i]);
                    // get date
                    var date = dailyArr[w].dt;
                    var convertedDate = new Date(date * 1000).toDateString();
                    // console.log(date);
                    launchDate = new Date(launchDate).toDateString();
                    var launchTime = new Date(date).toTimeString();
                    console.log("launchTime: ", launchTime);
                    
                    if (launchDate === convertedDate) {
                        console.log('launchDate: ' + launchDate);
                        console.log('convertedDate: ' + convertedDate);
                        console.log("We have a match!");

                        var weatherHeading = document.createElement("h3");
                        weatherHeading.setAttribute("class", "weather-title");
                        weatherHeading.textContent = "Launch Forecast";
                        weatherDescEL.appendChild(weatherHeading);
           
                        //icon
                        var iconURL = 'http://openweathermap.org/img/wn/' + dailyArr[w].weather[0].icon + '@2x.png';
                        // console.log('iconURL: ', iconURL);
                        
                        //temperature
                        var tempKelvin = dailyArr[w].temp.day;
                        var forecastTempF = (tempKelvin - 273.15) * (9/5) + 32;
            
                        // wind
                        var windSpeed = dailyArr[w].wind_speed; 
            
                        // icon
                        var weatherImage = document.createElement("img");
                        weatherImage.setAttribute("src", iconURL);
                        weatherImage.setAttribute("class", "weather-icon");
                        // console.log(iconURL);
                        weatherDescEL.appendChild(weatherImage);

                        //weather description
                        var weatherForecast = dailyArr[w].weather[0].description;
                        var weatherForecastEL = document.createElement("div");
                        weatherForecastEL.textContent = weatherForecast;
                        weatherDescEL.appendChild(weatherForecastEL);

                        //cloud cover
                        var cloudCover = "Cloud Coverage: " + dailyArr[w].clouds + "%";
                        var cloudCoverEL = document.createElement("div");
                        cloudCoverEL.textContent = cloudCover;
                        weatherDescEL.appendChild(cloudCoverEL);

                        //chance of rain
                        if (dailyArr[i].rain != undefined && dailyArr[w].rain != null) {
                            var rainChance = "Chance of Rain: " + dailyArr[w].rain + "%";
                            var rainChanceEL = document.createElement("div");
                            rainChanceEL.textContent = rainChance;
                            weatherDescEL.appendChild(rainChanceEL);
                        };
                        
                        //temperature
                        var forecastTemperatureEL = document.createElement("div");
                        var n = parseInt(launchTime.substring(0,2));
                        var currentTempF = dailyArr[w].temp.day;                       

                        // console.log('launchTimeHours', n);
                        switch (true) {
                            case (n < 6):
                                console.log("midnight");
                                currentTempF = dailyArr[w].temp.night;
                                break;
                            case (n < 17):
                                console.log("day");
                                currentTempF = dailyArr[w].temp.day;
                                break;
                            case (n < 20):
                                console.log("evening");
                                currentTempF = dailyArr[w].temp.eve;
                                break;
                            default:
                                console.log("night");
                                currentTempF = dailyArr[w].temp.night;
                        }
                        // var currentTempF = (tempKelvin - 273.15) * (9/5) + 32;

                        forecastTemperatureEL.textContent = "Temp: " + currentTempF.toFixed(2) + "˚ F";
                        weatherDescEL.appendChild(forecastTemperatureEL);

                        // wind
                        var forecastWindEL = document.createElement("div");
                        forecastWindEL.textContent = "Wind speed: " + dailyArr[w].wind_speed + " mph";
                        weatherDescEL.appendChild(forecastWindEL);

                        // humidity
                        var forecastHumidityEL = document.createElement('div');
                        forecastHumidityEL.textContent = "Humidity: " + dailyArr[w].humidity  + "%";
                        weatherDescEL.appendChild(forecastHumidityEL);
            
                    };
                };

            };

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
    // fiveDayForecastEL.textContent = "";

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

// getUpcomingLaunches();
callDataInOrder();