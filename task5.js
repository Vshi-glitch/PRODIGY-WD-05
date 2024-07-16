const apiKey = '3d1f703092d9485699f54326241607'; // Replace with your WeatherAPI key

function fetchWeather() {
    const location = document.getElementById('locationInput').value;
    if (location) {
        getWeatherData(location);
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherDataByCoords(lat, lon);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }
}

function getWeatherData(location) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            displayForecast(data.forecast.forecastday);
            document.getElementById('default-info').style.display = 'none';
        })
        .catch(error => alert('Error fetching weather data: ' + error));
}

function getWeatherDataByCoords(lat, lon) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            displayForecast(data.forecast.forecastday);
            document.getElementById('default-info').style.display = 'none';
        })
        .catch(error => alert('Error fetching weather data: ' + error));
}

function displayWeather(data) {
    if (data.error) {
        alert('Error: ' + data.error.message);
        return;
    }
    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = `
        <div class="weather-info">
            <h2>Weather in ${data.location.name}, ${data.location.country}</h2>
            <p>Temperature: ${data.current.temp_c}°C</p>
            <p>Weather: ${data.current.condition.text}</p>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind Speed: ${data.current.wind_kph} kph</p>
            <p>UV Index: ${data.current.uv}</p>
            <p>Sunrise: ${data.forecast.forecastday[0].astro.sunrise}</p>
            <p>Sunset: ${data.forecast.forecastday[0].astro.sunset}</p>
            <img src="${data.current.condition.icon}" alt="Weather icon">
        </div>
    `;
}

function displayForecast(forecast) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<h2>7-Day Forecast</h2>`;
    forecast.forEach(day => {
        forecastDiv.innerHTML += `
            <div class="forecast-day">
                <p>${day.date}</p>
                <img src="${day.day.condition.icon}" alt="Weather icon">
                <p>${day.day.condition.text}</p>
                <p>Max: ${day.day.maxtemp_c}°C</p>
                <p>Min: ${day.day.mintemp_c}°C</p>
            </div>
        `;
    });
}
