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

        $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");
        
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
            console.log(uvIndex.value);
          });





    });
    
    
}

$("#search-button").on("click", function(event) {
    event.preventDefault();
    populateCityWeather();
});