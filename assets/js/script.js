var openWeatherMapAPI = '41dcd9d8063f4abb3ee28c6c6fbc6354';
var launchAPIURL = "https://ll.thespacedevs.com/2.0.0/launch/upcoming/?limit=10&offset=0&ordering=net"; //prod
// var launchAPIURL = "https://lldev.thespacedevs.com/2.0.0/launch/upcoming/?limit=10&offset=0&ordering=net"; //dev
var launchContainerEL = document.querySelector("#launch-container");
var searchFormEL = document.querySelector("#search-form");
var searchtermTitleEL  = document.querySelector("#searchterm-title");
var searchtermEL = document.querySelector("#searchterm");

var date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    };

var list = JSON.parse(localStorage.getItem('weathercities')) || []; //Short-circuit evaluation

const getLaunchData = async (search) => {
    // console.log("index.html 10 | Processing...");
    if (search.length > 0) {
        launchAPIURL += "&search=" + search;
    }
    const request = await fetch(launchAPIURL);
    const data = await request.json();
    return data;
  };

  const getWeatherForLocation = async (latitude, longitude) => {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&APPID=" + openWeatherMapAPI;
    const request = await fetch(apiURL);
    const data = await request.json();
    return data;
  };

  const callLoadLaunches = async () => {
    launchContainerEL.textContent = "";
    var containerEL = document.createElement("div");
    containerEL.setAttribute("class", "card-columns");

    var search = searchtermEL.value.trim();
    
    const launchData = await getLaunchData(search);
    // console.log('callDataInCorder line 45');
    // console.log(launchData);
     // check if api returned forecast
     if (launchData.length === 0) {
        launchData.textContent = "No launch data available";
        return;
     }

     if (launchData.results != undefined && launchData.results != null) {
         // loop through next 10 launches in array
         var launchesArr = launchData.results;
        //  console.log('line 53', launchesArr);
         for (var i = 0; i< launchesArr.length; i++) {
            //   console.log('line 55 looping through launches; at number: ', i);
             // get date
             var launchDate = launchesArr[i].net;
     
             // date = '2021-05-20T17:09:00Z';
             // console.log(date);
             var convertedDate = new Date(launchDate);// new Date(date * 1000).toLocaleString();
             // console.log('convertedDate: ' + convertedDate);
     
             var convertedTime;
             var daysOut = 30;
     
             var today = new Date();
             // console.log('today: ', today);
            //  console.log('convertedDate: ', convertedDate);
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
                 else if (h == 0) {
                    h = 12;
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
             var cardEL = document.createElement("div");
             cardEL.classList = "card text-white bg-secondary mb-3";
             cardEL.setAttribute("style", "display: inline-block;");
     
             var cardTitleEL =document.createElement("div");
             cardTitleEL.setAttribute("class", "card-title");
             cardTitleEL.textContent = convertedDate.toLocaleDateString() + ' ' + convertedTime;
    
             var cardBodyEL = document.createElement("div");
             cardBodyEL.setAttribute("class", "card-body");

             var statusEL =document.createElement("div");
             statusEL.setAttribute("class", "card-title");
             statusEL.textContent = "Status: " + launchesArr[i].status.name;
             cardBodyEL.appendChild(statusEL);
     
             //imgURL
             var rocketImage = document.createElement("img");
             var imgURL = launchesArr[i].image;
             rocketImage.setAttribute("src", imgURL);
             rocketImage.setAttribute("class", "card-img-top");
             // console.log(iconURL);
             cardBodyEL.appendChild(rocketImage);
     
             //name
             var missionNameEL = document.createElement("div");
             var missionName = launchesArr[i].name;
             missionNameEL.setAttribute("class", "card-title");
             missionNameEL.textContent = missionName;
             cardBodyEL.appendChild(missionNameEL);
             // console.log(missionName);
     
             //location
             var lat = launchesArr[i].pad.latitude;
             var long = launchesArr[i].pad.longitude;
             // console.log(lat);
             // console.log(long);

             //pad
             var pad = launchesArr[i].pad.name;
             var padEL = document.createElement("div");
             padEL.setAttribute("class", "card-title");
             padEL.textContent = pad;
             cardBodyEL.appendChild(padEL);

            //pad location
            var padLocation = launchesArr[i].pad.location.name;
            var padLocationEL = document.createElement("div");
            padLocationEL.setAttribute("class", "card-title");
            padLocationEL.textContent = padLocation;
            cardBodyEL.appendChild(padLocationEL);
     
            //description
            var missionDescription;
            if (!launchesArr[i].mission) {
                //ignore
                missionDescription = '';
            }
            else {
                 missionDescription = launchesArr[i].mission.description;
                 //  console.log('missionDescription 158: ', missionDescription);
                 var missionDescEL = document.createElement("p");
                 // missionDescEL.setAttribute("style", ".card-body");
                 missionDescEL.textContent = missionDescription;
                 cardBodyEL.appendChild(missionDescEL);
     
                 var weatherDescEL = document.createElement("div");
     
                 if (daysOut < 9) {
                     // console.log("index.html 167 | launchData", launchData);
                 
                     const detailData = await getWeatherForLocation(lat, long);
                    //  console.log(" 159 | detail Data", detailData);
                     // console.log("index.html 175 | detail Data timezone", detailData.timezone);
     
                     //get forecast array
                     var dailyArr = detailData.daily;
                     // console.log ("dailyArr", dailyArr);
     
                     //find matching date
                     for (var w = 0; w< dailyArr.length; w++) {
                         // console.log(dailyArr[i]);
                         // get date
                         var date = dailyArr[w].dt;
                         var convertedDate = new Date(date * 1000).toDateString();
                         // console.log(date);
                         launchDate = new Date(launchDate).toDateString();
                         var launchTime = new Date(date).toTimeString();
                         // console.log("launchTime: ", launchTime);
                         
                         if (launchDate === convertedDate) {
                             // console.log('launchDate: ' + launchDate);
                             // console.log('convertedDate: ' + convertedDate);
                             // console.log("We have a match!");
     
                             var weatherHeading = document.createElement("h3");
                             weatherHeading.setAttribute("class", "weather-title");
                             weatherHeading.textContent = "Launch Pad Forecast";
                             weatherDescEL.appendChild(weatherHeading);
                
                             //icon
                             var iconURL = 'http://openweathermap.org/img/wn/' + dailyArr[w].weather[0].icon + '@2x.png';
                             // console.log('iconURL: ', iconURL);

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
                                     // console.log("midnight");
                                     currentTempF = dailyArr[w].temp.night;
                                     break;
                                 case (n < 17):
                                     // console.log("day");
                                     currentTempF = dailyArr[w].temp.day;
                                     break;
                                 case (n < 20):
                                     // console.log("evening");
                                     currentTempF = dailyArr[w].temp.eve;
                                     break;
                                 default:
                                     // console.log("night");
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
                 // console.log('location: ' + location);
             }
     
             cardEL.appendChild(cardTitleEL);
             cardEL.appendChild(cardBodyEL);
             containerEL.appendChild(cardEL);
         }
     }
     else {
        launchData.textContent = "No upcoming launches available";
     }

    // containerEL.appendChild(rowEL);

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
    searchtermTitleEL.textContent = "";

    var searchterm = searchtermEL.value.trim();
    if (searchterm) {
        callLoadLaunches();
        searchtermTitleEL.textContent = "Search results for " + searchterm;
        searchtermEL.value = '';
    }
    else {
        callLoadLaunches();
    }
}

searchFormEL.addEventListener("submit", formSubmitHander);

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

callLoadLaunches();