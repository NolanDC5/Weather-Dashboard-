var APIKey = "383ad6b4c6a4b93dc4b0bd6f3869cfa6"
var cityName = document.getElementById("cityName")
var currentWeather = document.getElementById("currentWeather")
var currentForecast = document.getElementById("currentForecast")
var citySearchEl = document.getElementById("city")
var currentTemperature = document.getElementById("tempature")
var currentWind = document.getElementById("wind")
var currentHumidity = document.getElementById("humidity")
var currentUV = document.getElementById("uvIndex")
var futureForcast = document.getElementById("futureForcast")
var searchEl = document.getElementById("search-button")
var clearEl = document.getElementById("clear-search")
var clearDisplayEl = document.getElementById("clear-search")
var historyEl = document.getElementById("search-history")

var searchHistory = JSON.parse(localStorage.getItem("search")) || [];


searchEl.addEventListener("click", function() {
    const searchReq = cityName.value;
    getWeather(searchReq);
    if(searchReq === ''){
        return null;
    }
    searchHistory.push(searchReq);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
    document.getElementById("cityName").value = "";
})

function getWeather(citySearch) {
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIKey;
    axios.get(queryUrl)

        .then(function (response) {
            currentWeather.classList.remove("d-none");
            
            var todaysDate = new Date(response.data.dt * 1000);
            var day = todaysDate.getDate();
            var month = todaysDate.getMonth() + 1;
            var year = todaysDate.getFullYear();
            citySearchEl.innerHTML = response.data.name + " " +  month + "/" + day + "/" + year;
            var weatherIcon = response.data.weather[0].icon;
            currentForecast.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            currentForecast.setAttribute("alt", response.data.weather[0].description);
            currentTemperature.innerHTML = "Temp: " + k2f(response.data.main.temp) + " &#176F";
            console.log(currentTemperature)
            currentWind.innerHTML = "Wind: " + response.data.wind.speed + " MPH";
            console.log(currentWind)
            currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            console.log(currentHumidity)

            var lat = response.data.coord.lat;
            var lon = response.data.coord.lon;
            var indexQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            axios.get(indexQueryURL)
                .then(function (response) {
                    var indexEl = document.createElement("span");

                    if (response.data[0].value < 4 ) {
                        indexEl.setAttribute("class", "badge bg-success");
                    }
                    else if (response.data[0].value < 8) {
                        indexEl.setAttribute("class", "badge bg-warning");
                    }
                    else {
                        indexEl.setAttribute("class", "badge bg-danger");
                    }
                    console.log(response.data[0].value)
                    indexEl.innerHTML = response.data[0].value;
                    currentUV.innerHTML = "UV Index: ";
                    currentUV.append(indexEl);
                });

            var cityID = response.data.id;
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            axios.get(forecastURL)
                .then(function (response) {
                    futureForcast.classList.remove("d-none");

                    var futureFiveDay = document.querySelectorAll(".forecast")
                    for (i = 0; i < futureFiveDay.length; i++) {
                        futureFiveDay[i].innerHTML = "";
                        var forecastIndex = i * 8 + 4;
                        var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                        var forecastDay = forecastDate.getDate();
                        var forecastMonth = forecastDate.getMonth() + 1;
                        var forecastYear = forecastDate.getFullYear();
                        var forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date ");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        futureFiveDay[i].append(forecastDateEl);

                        var fiveDayForecastEl = document.createElement("img");
                        fiveDayForecastEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                        fiveDayForecastEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                        futureFiveDay[i].append(fiveDayForecastEl);
                        var forecastTempEl = document.createElement("p");
                        forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                        futureFiveDay[i].append(forecastTempEl);
                        var forecastWindEl = document.createElement("p")
                        forecastWindEl.innerHTML = "Wind: " + response.data.list[forecastIndex].wind.speed + " MPH";
                        futureFiveDay[i].append(forecastWindEl);
                        var forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                        futureFiveDay[i].append(forecastHumidityEl);
                    }
                })
        });
}

function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyReq = document.createElement("input");
        historyReq.setAttribute("type", "text");
        historyReq.setAttribute("readonly", true);
        historyReq.setAttribute("class", "form-control d-block bg-white mb-1");
        historyReq.setAttribute("value", searchHistory[i]);
        historyReq.addEventListener("click", function () {
            console.log(historyReq.value)
            getWeather(historyReq.value);
        })
        historyEl.append(historyReq);
    }
}

renderSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}

clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})
