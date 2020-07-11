function populateCityWeather() {
    
    var city = $("#city-input").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9bcf5e17bdf9a0b802d15f96847a6ef0";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(weather) {

        console.log(queryURL);
        console.log(weather);

        var nowMoment = moment();

        var displayMoment = $("<h3>");
        $("#city-name").empty();
        $("#city-name").append(
          displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
        );

        var cityName = $("<h2>").text(weather.name);
        $("#city-name").prepend(cityName);  

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
            console.log(uvIndex);
    
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

function populateForecast () {

    var city = $("#city-input").val();
    var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=9bcf5e17bdf9a0b802d15f96847a6ef0";
    $.ajax({
        url: queryURL3,
        method: "GET"
      }).then(function(forecast) {

        console.log(queryURL3);
        console.log(forecast);

        var nowMoment = moment();

        for (var i = 6; i < forecast.list.length; i += 8) {

            var forecastDate = $("<h3>");

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

function createCityList() {
   
    $("#city-list").empty();
  
    var cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");
    cityListEntry.text("#city-list").val();

    $("#city-list").append(cityListEntry);
}


$("#search-button").on("click", function(event) {
    event.preventDefault();
    populateCityWeather();
    populateForecast();
    createCityList();
});