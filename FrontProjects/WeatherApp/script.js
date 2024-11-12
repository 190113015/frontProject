const API_KEY = "ce47db88d09178b21f3e68382f5c2fc4";
const searchField = document.getElementById("city-input");
const searchBtn = document.getElementById("search-button");
const currentLocationBtn = document.getElementById("location-button");
const temperatureUnitToggle = document.getElementById("unit-toggle");
const cityElement = document.getElementById("city-name");
const temperatureElement = document.getElementById("current-temp");
const weatherDescription = document.getElementById("current-condition");
const weatherImage = document.getElementById("weather-icon");
const forecastDisplay = document.getElementById("forecast-container");

let unitType = "metric";

temperatureUnitToggle.addEventListener("change", (event) => {
  unitType = event.target.value;
  fetchWeatherData(searchField.value || "London");
});

searchBtn.addEventListener("click", () => {
  const city = searchField.value.trim();
  if (city) {
    fetchWeatherData(city);
  }
});

currentLocationBtn.addEventListener("click", () => {
  fetchWeatherByCurrentLocation();
});

async function fetchWeatherData(city) {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unitType}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unitType}`;

    const weatherResponse = await fetch(weatherUrl);
    const forecastResponse = await fetch(forecastUrl);

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    updateWeatherInfo(weatherData);
    updateForecast(forecastData);
  } catch (error) {
    alert("There was an error fetching the weather data.");
  }
}

function updateWeatherInfo(data) {
  cityElement.textContent = `${data.name}, ${data.sys.country}`;
  temperatureElement.textContent = `${data.main.temp}°`;
  weatherDescription.textContent = data.weather[0].description;
  weatherImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

function updateForecast(data) {
  forecastDisplay.innerHTML = "";
  for (let i = 0; i < data.list.length; i += 8) {
    const dayData = data.list[i];
    const date = new Date(dayData.dt * 1000);
    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");
    forecastItem.innerHTML = `
      <p>${date.toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/wn/${
        dayData.weather[0].icon
      }.png" alt="weather icon">
      <p>${dayData.main.temp_max}° / ${dayData.main.temp_min}°</p>
      <p>${dayData.weather[0].description}</p>
    `;
    forecastDisplay.appendChild(forecastItem);
  }
}

function fetchWeatherByCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoordinates(latitude, longitude);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

async function fetchWeatherByCoordinates(lat, lon) {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitType}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unitType}`;

    const weatherResponse = await fetch(weatherUrl);
    const forecastResponse = await fetch(forecastUrl);

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    updateWeatherInfo(weatherData);
    updateForecast(forecastData);
  } catch (error) {
    alert("There was an error fetching the weather data.");
  }
}

fetchWeatherData("London");
