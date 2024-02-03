// seperation of concerns tells us to create seperate functions that do one specific task
function refreshWeather(response) {
  let tempElement = document.querySelector("#temp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let timeElement = document.querySelector("#date");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  tempElement.innerHTML = Math.round(response.data.temperature.current);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${response.data.wind.speed}km/h`;
  timeElement.innerHTML = formatDate(date);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  apiKey = "8c106b65dft3cb9cbd6a0a0oc1dc9e43";
  apiURL = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiURL).then(refreshWeather);
}

document.addEventListener("DOMContentLoaded", (event) => {
  function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#search-form-input");
    searchCity(searchInput.value);
  }
  let searchFormElement = document.querySelector("#search-form");
  searchFormElement.addEventListener("submit", handleSearchSubmit);

  // F O R M A T  D A Y S  F O R   E A C H  D A I L Y   F O R E C A S T
  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return days[date.getDay()];
  }

  // F E T C H I N G   A P I   D A I L Y  F O R E C A S T
  let apiKeyForecast = `8c106b65dft3cb9cbd6a0a0oc1dc9e43`;
  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query={query}&key=${apiKeyForecast}`;
  axios.get(apiUrlForecast).then(displayForecast);

  function displayForecast(response) {
    console.log(response.data);

    let forecastHTML = "";

    response.data.daily.forEach(function (day, index) {
      if (index < 7) {
        forecastHTML =
          forecastHTML +
          `<div class="row">
                   <div class="col-2">
                       <div class="weather-forecast-date">
                          ${formatDay(day.time)}
                       </div>
                       <br/>
                       <img src="${
                         day.condition.icon_url
                       }" alt="showers of rain weather icon"  width="88" height="88">
                       <div class="weather-forecast-temp">
                           <span class="weather-forecast-temp-max">${Math.round(
                             day.temperature.maximum
                           )} º</span>
                           <span class="weather-forecast-temp-min">${Math.round(
                             day.temperature.minimum
                           )} º</span>
                       </div>
                   </div>
               </div>
           </div>`;
      }
    });
    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = forecastHTML;
  }

  searchCity("Sandton");
});
