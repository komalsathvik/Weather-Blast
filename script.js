const apiKey = 'a9597b9143bd10ce791e1b80c44d2d50'; // OpenWeatherMap API key
const geoAPI = '2783701aa79748f9b21e86f7ca361dd4'; // GeoApify API key
const opt = { timeStyle: 'short', hour12: true }; // Time formatting options

// Fetch weather by city name
function getWeatherByCity() {
    const cityName = document.getElementById("city-input").value;
    if (!cityName) {
        alert("PLEASE ENTER CITY NAME");
        return;
    }
    console.log(`Fetching weather data for city: ${cityName}`);
    fetchWeatherByCity(cityName);
}

// Fetch weather by user's current geolocation
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Fetching weather data for current location: lat=${lat}, lon=${lon}`);
            fetchWeatherByCoordinates(lat, lon);
        }, () => {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Fetch weather by city name from OpenWeatherMap API
function fetchWeatherByCity(cityName) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                console.error(`City not found: ${cityName}`);
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data from OpenWeatherMap:', data);
            displayWeather(data);
        })
        .catch((error) => {
            console.error('Error fetching weather from OpenWeatherMap:', error);
            fetchLatLon(cityName); // Try to fetch lat/lon if the city is not found
        });
}

// Fetch latitude and longitude by city name from GeoApify API
function fetchLatLon(cityName) {
    const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${cityName}&format=json&apiKey=${geoAPI}`;
    console.log(`Fetching lat/lon for city: ${cityName}`);
    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const lat = data.results[0].lat;
                const lon = data.results[0].lon;
                console.log(`Coordinates for city: lat=${lat}, lon=${lon}`);
                fetchWeatherByCoordinates(lat, lon); // Now fetch weather by lat/lon
            } else {
                alert("Location not found. Please try entering a valid city name or pincode.");
                console.error(`No results found for city: ${cityName}`);
            }
        })
        .catch(error => {
            console.error('Error fetching lat/lon from GeoApify:', error);
            alert("There was an error fetching location data. Please try again.");
        });
}

// Fetch weather by latitude and longitude from OpenWeatherMap API
function fetchWeatherByCoordinates(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data from coordinates:', data);
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather by coordinates:', error);
        });
}

// Display weather data on the webpage
function displayWeather(data) {
    const currTemp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const visibility = (data.visibility / 1000); // Convert to km
    const windSpeed = data.wind.speed;
    const dt = new Date(data.dt * 1000);
    const date = dt.toLocaleDateString();
    const weatherdes = data.weather[0].main;
    const countryCode = data.sys.country;
    const city = data.name;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', opt);
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', opt);

    document.getElementById("wi").innerText = `${weatherdes}`;
    document.getElementById("date").innerText = `${date}`;
    document.getElementById("city").innerText = `${city}`;
    document.getElementById("temp").innerText = `${currTemp}°C`;
    document.getElementById("fl").innerText = `${feelsLike}°C`;
    document.getElementById("humi").innerText = `${humidity}%`;
    document.getElementById("press").innerText = `${pressure} hPa`;
    document.getElementById("visi").innerText = `${visibility} Km`;
    document.getElementById("ws").innerText = `${windSpeed} m/s`;
    document.getElementById("sr").innerText = `${sunrise}`;
    document.getElementById("ss").innerText = `${sunset}`;
    document.getElementById("cc").innerText = `${countryCode}`;

    // Clear city input after displaying weather
    document.getElementById("city-input").value = '';
}
