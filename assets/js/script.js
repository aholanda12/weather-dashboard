// Global variables
var city = "";
var searchedCities = [];
var searchHistory = JSON.parse(localStorage.getItem("cities"));
const data = searchedCities;


// Hides HTML sections upon loading
$("#current-weather").hide();
$("#forecast-weather").hide();


// Checks local storage to produce buttons
if (searchHistory) {
  showPrevious();
}


// Defines city variable based on user input
function getCityInput() {
  city = $("#city-input").val(); 
}


// Calls weather/UV data and populates the current weather section
function populateCityWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9bcf5e17bdf9a0b802d15f96847a6ef0";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(weather) {

        $("#current-weather").show();

        var nowMoment = moment();

        var displayMoment = $("<h3>");
        $("#current-date").empty();
        $("#current-date").append(
          displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
        );

        var cityName = $("<h2>").text(weather.name);
        $("#city-name").empty();
        $("#city-name").append(cityName);  

        var weatherIcon = $("<img>");
        weatherIcon.attr(
            "src",
            "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
        );

        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);

        var fahrenheit = (parseInt((weather.main.temp - 273.15) * 9/5 + 32));
        var windSpeed = (parseInt(weather.wind.speed * 2.237));

        $("#current-temp").text("Temperature: " + fahrenheit + " °F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + windSpeed + " MPH");
        
        latitude = weather.coord.lat;
        longitude = weather.coord.lon;
  
        var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=9bcf5e17bdf9a0b802d15f96847a6ef0&lat=" + latitude + "&lon=" + longitude;
        $.ajax({
            url: queryURL2,
            method: "GET"
          }).then(function(uvIndex) {
    
            var uvIndexDisplay = $("<button>");
            uvIndexDisplay.addClass("btn");
            if (uvIndex.value <= 2) {
                uvIndexDisplay.addClass("btn-success");
            }
            else if (uvIndex.value > 2 && uvIndex.value < 9) {
                uvIndexDisplay.addClass("btn-warning");
            }
            else if (uvIndex.value >= 9) {
                uvIndexDisplay.addClass("btn-danger");
            }
    
            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvIndexDisplay.text(uvIndex.value));
          });
    });
}


// Calls forecast data and populates the forecast section
function populateForecast () {
    var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=9bcf5e17bdf9a0b802d15f96847a6ef0";
    $.ajax({
        url: queryURL3,
        method: "GET"
      }).then(function(forecast) {

        $("#forecast-weather").show();

        var nowMoment = moment();

        for (var i = 6; i < forecast.list.length; i += 8) {

            var forecastDate = $("<h4>");

            var forecastPosition = (i + 2) / 8;

            $("#forecast-date" + forecastPosition).empty();
            $("#forecast-date" + forecastPosition).append(
              forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
            );

            var forecastIcon = $("<img>");
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
                forecast.list[i].weather[0].icon +
                ".png"
            );

            $("#forecast-icon" + forecastPosition).empty();
            $("#forecast-icon" + forecastPosition).append(forecastIcon);

            var fahrenheit = (parseInt((forecast.list[i].main.temp - 273.15) * 9/5 + 32));

            $("#forecast-temp" + forecastPosition).text(
              "Temp: " + fahrenheit + " °F"
            );
            $("#forecast-humidity" + forecastPosition).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );
        }
    });
}


// Creates new buttons based off input data and saves it to local storage
function createCityList() {  
    var cityListEntry = $("<li>");
    var cityListEntryBtn = $("<button>");
    
    cityListEntry.append(cityListEntryBtn);
    cityListEntryBtn.addClass("list-group-item list-group-item-action city-button");
    cityListEntryBtn.text(city);

    $("#city-list").append(cityListEntry);

    searchedCities.push(city);
    localStorage.setItem('cities', JSON.stringify(searchedCities));

    cityListEntryBtn.on("click", function(){ 
      city = event.target.innerHTML
      event.preventDefault();
      populateCityWeather();
      populateForecast();
    });
}


// Creates buttons upon loading based on the local storage
function showPrevious() {

      for (var i = 0; i < searchHistory.length; i++) {
        var cityListEntry = $("<li>");
        var cityListEntryBtn = $("<button>");
        
        cityListEntry.append(cityListEntryBtn);
        cityListEntryBtn.addClass("list-group-item list-group-item-action city-button");
        cityListEntryBtn.text(searchHistory[i]);
        $("#city-list").append(cityListEntry);
      }

      cityListEntryBtn.on("click", function(){ 
        city = event.target.innerHTML
        event.preventDefault();
        populateCityWeather();
        populateForecast();
        console.log(event);
      });
}


// Search button executes functions
$("#search-button").on("click", function(event) {
    event.preventDefault();
    getCityInput();
    populateCityWeather();
    populateForecast();
    createCityList();
});



