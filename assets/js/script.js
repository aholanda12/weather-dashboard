function populateCityWeather() {
    
    var city = $("#city-input").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=9bcf5e17bdf9a0b802d15f96847a6ef0";

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {

        console.log(queryURL);

        var nowMoment = moment();

        var displayMoment = $("<h3>");
        $("#city-name").empty();
        $("#city-name").append(
          displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
        );
    });
    
    
}

$("#search-button").on("click", function(event) {
    event.preventDefault();
    populateCityWeather();
});