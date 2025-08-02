// === API KEYS ===
const apiKey = 'a9597b9143bd10ce791e1b80c44d2d50'; // OpenWeatherMap API key
const geoAPI = '2783701aa79748f9b21e86f7ca361dd4'; // GeoApify API key
const opt = { timeStyle: 'short', hour12: true }; // Time formatting options

let map; // Global map object
let isUserSearch = false; // For auto scrolling

// === Check Toggle State ===
function isFahrenheitToggled() {
    const toggle = document.getElementById("unitToggle");
    return toggle && toggle.checked;
}

// === INITIALIZE DEFAULT MAP ===
function initMap() {
    map = new mappls.Map("map", {
        center: [28.6138954, 77.2090057] // Default to New Delhi
    });
}
window.onload = initMap;

// === RE-CENTER MAP TO SPECIFIC LOCATION ===
function initMap1(data) {
    const latitude = data.coord.lat;
    const longitude = data.coord.lon;

    map.setCenter({ lat: latitude, lng: longitude });

    if (window.currentMarker) {
        window.currentMarker.remove();
    }

    const marker = new mappls.Marker({
        map: map,
        position: { lat: latitude, lng: longitude },
        title: "Selected Location"
    });

    // Save reference to current marker globally
    window.currentMarker = marker;
}
// scrollable page 
function scrollToWeatherInfo() {
    const weatherSection = document.getElementById("weat");
    if (weatherSection) {
        weatherSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// === AUTOCOMPLETE LOCATION INPUT ===
function autoComplete() {
    const input = document.getElementById('city-input').value;
    if (input.length <= 2) {
        document.getElementById("suggestion-box").style.display = "none";
        return;
    }
    getSuggestion(input);
    document.getElementById("suggestion-box").style.display = "flex";
}

// === FETCH LOCATION SUGGESTIONS FROM GEOAPIFY ===
function getSuggestion(input) {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&apiKey=${geoAPI}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const suggestions = data.features.slice(0, 5).map(feature => ({
                address: feature.properties.address_line1,
                state: feature.properties.state,
                country: feature.properties.country,

            }));
            updateSuggestions(suggestions);
        })
        .catch(err => console.log('error', err));
}

// === POPULATE AUTOCOMPLETE SUGGESTIONS ===
function updateSuggestions(suggestions) {
    const suggestionBox = document.getElementById("suggestion-box");
    suggestions.forEach((suggestion, index) => {
        const el = document.getElementById(`suggestion-${index}`);
        if (el) {
            el.innerText = `${suggestion.address}, ${suggestion.state}, ${suggestion.country}`;
            el.onclick = () => {
                document.getElementById("city-input").value = `${suggestion.address}, ${suggestion.state}`;
                suggestionBox.style.display = "none";
            };
        }
    });
}

// === FETCH WEATHER FOR CITY ===
function getWeatherByCity() {
    const cityInput = document.getElementById("city-input");
    const city = cityInput.value.trim();
    const validationMsg = document.getElementById("validationMsg");

    if (!city) {
        validationMsg.textContent = "Oops! Empty Input ";
        validationMsg.classList.remove("hidden");
        cityInput.focus();
        return;
    }

    validationMsg.classList.add("hidden");
    isUserSearch = true;
    fetchWeatherByCity(city);
}

// === FETCH WEATHER FOR CURRENT LOCATION ===
function getWeatherByLocation() {
    if (navigator.geolocation) {
        isUserSearch = true;
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            fetchWeatherByCoordinates(lat, lon);
            initMap1({ coord: { lat, lon } });
        }, () => alert("Unable to retrieve your location."));
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// === GET WEATHER FROM CITY NAME ===
function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('City not found');
            return res.json();
        })
        .then(data => displayWeather(data))
        .catch(err => {
            console.error(err);
            fetchLatLon(city);
        });
}




// === GET LAT/LON FROM CITY NAME ===
function fetchLatLon(city) {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${city}&format=json&apiKey=${geoAPI}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.results || !data.results.length) throw new Error("No results");
            const lat = data.results[0].lat;
            const lon = data.results[0].lon;
            fetchWeatherByCoordinates(lat, lon);
        })
        .catch(err => {
            console.error(err);
            alert("Invalid location. Try again.");
        });
}

// === GET WEATHER FROM LAT/LON ===
function fetchWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayWeather(data);
            initMap1(data);
        })
        .catch(err => console.error(err));
}

// === DISPLAY WEATHER DETAILS IN UI ===
// === DISPLAY WEATHER DETAILS IN UI ===
function displayWeather(data) {
    const { temp, feels_like, humidity, pressure } = data.main;
    const visibility = data.visibility / 1000;
    const windSpeed = data.wind.speed;
    const windDeg = data.wind.deg;
    const windArrow = getWindDirectionArrow(windDeg);
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const weatherdes = data.weather[0].main;
    const { country } = data.sys;
    const city = data.name;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', opt);
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', opt);
    const { lat, lon } = data.coord;

    fetchPollution(lat, lon);
    getWeatherForecast(lat, lon);

    // Titles
    document.getElementById("weat").innerText = `Weather Information : ${city}`;

    // Store Celsius in dataset
    ["temp", "fl", "temp1", "fl1"].forEach(id => {
        document.getElementById(id).dataset.celsius = id.includes("fl") ? feels_like : temp;
    });

    // Unit toggle
    const isCelsius = !isFahrenheitToggled();
    updateTemperatureDisplay(isCelsius);

    // --- Weather data for BIG TABLE and SMALL TABLE ---

    // City
    document.getElementById("city1").innerText = city; // Corrected for Big Table
    document.getElementById("city1_small").innerText = city;

    // Date
    document.getElementById("date1").innerText = date; // Corrected for Big Table
    document.getElementById("date1_small").innerText = date;

    // Weather Info (Description)
    document.getElementById("wi").innerText = weatherdes;
    document.getElementById("wi1").innerText = weatherdes;

    // Humidity
    document.getElementById("humi").innerText = `${humidity}%`;
    document.getElementById("humi1").innerText = `${humidity}%`;

    // Pressure
    document.getElementById("press").innerText = `${pressure} hPa`;
    document.getElementById("press1").innerText = `${pressure} hPa`;

    // Visibility
    document.getElementById("visi").innerText = `${visibility} Km`;
    document.getElementById("visi1").innerText = `${visibility} Km`;

    // Wind Speed
    document.getElementById("ws").innerText = `${windSpeed} m/s ${windArrow}`;
    document.getElementById("ws1").innerText = `${windSpeed} m/s ${windArrow}`;

    // Sunrise
    document.getElementById("sr").innerText = sunrise;
    document.getElementById("sr1").innerText = sunrise;

    // Sunset
    document.getElementById("ss").innerText = sunset;
    document.getElementById("ss1").innerText = sunset;

    // Country Code
    document.getElementById("cc").innerText = country;
    document.getElementById("cc1").innerText = country;

    document.getElementById("city-input").value = '';
    if (isUserSearch) {
    scrollToWeatherInfo();
    isUserSearch = false; // reset
}

}
window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});
// Add an initial weather fetch when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Existing theme loading logic
    cindow.scrollTo(0, 0);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        toggle = 1;
        changedisplay();
    } else if (savedTheme === "light") {
        toggle = 0;
        changedisplay();
    }
    fetchWeatherByCity("Kolkata");
});

// === CONVERSION HELPERS ===
function celsiusToFahrenheit(c) { return (c * 9 / 5) + 32; }
function fahrenheitToCelsius(f) { return (f - 32) * 5 / 9; }

// === TOGGLE CELSIUS/FAHRENHEIT DISPLAY ===
function updateTemperatureDisplay(isCelsius) {
    const elements = ["temp", "fl", "temp1", "fl1"];
    elements.forEach(id => {
        const el = document.getElementById(id);
        const c = parseFloat(el.dataset.celsius);
        if (isCelsius) {
            el.innerText = `${c.toFixed(1)}°C`;
        } else {
            const f = celsiusToFahrenheit(c);
            el.innerText = `${f.toFixed(1)}°F`;
        }
    });
}
// === FETCH POLLUTION DATA ===
function fetchPollution(lat, lon) { 
    const pollurl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(pollurl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayPollution(data);
        })
        .catch(error => {
            console.error('Error fetching pollution info', error);
        });
}

// Display pollution data
function displayPollution(data) {
    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;

    const aqiLabel = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    const label = aqiLabel[aqi - 1] || "Unknown";
    document.getElementById("aqi").innerText = label;
    document.getElementById("aqi1").innerText = label;

    const aqiBigElement = document.getElementById("aqi_big");
    if (aqiBigElement) { // Always good to check if element exists before setting innerText
        aqiBigElement.innerText = label;
    }

    // ✅ Health suggestion based on AQI
    let healthMessage = "";
    switch (aqi) {
        case 1:
            healthMessage = "Air quality is good. No health risk.";
            break;
        case 2:
            healthMessage = "Air quality is fair. Sensitive people should take precautions.";
            break;
        case 3:
            healthMessage = "Moderate risk for sensitive groups. Limit prolonged outdoor exertion.";
            break;
        case 4:
            healthMessage = "Poor air quality. General public may experience discomfort.";
            break;
        case 5:
            healthMessage = "Very poor. Avoid outdoor activities if possible.";
            break;
        default:
            healthMessage = "Air quality data unavailable.";
    }

    // Insert this message into the DOM (You must add a tag with id="aqi-message" in HTML)
    const messageElement = document.getElementById("aqi-message");
    if (messageElement) {
        messageElement.innerText = healthMessage;
    }

    // Existing pollutant values
    const pollutionMetrics = ["co", "no", "no2", "o3", "so2", "pm2_5", "pm10", "nh3"];
    pollutionMetrics.forEach(metric => {
        const value = components[metric];
        const label = metric === 'pm2_5' ? 'pm2.5' : metric;
        document.getElementById(label).innerText = `${value} μg/m3`;
        document.getElementById(label + "1").innerText = `${value} μg/m3`;
    });
}


// Forecast display with °C ⇄ °F toggle support
function getWeatherForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            showWeatherForecast(data);
        })
        .catch(error => {
            console.error('Error fetching Forecast', error);
        });
}

function convertTemp(temp, isCelsius) {
    return isCelsius ? `${temp.toFixed(1)} °C` : `${((temp * 9/5) + 32).toFixed(1)} °F`;
}
//Adding an object for notes 
const notes = {
    clear: ["Sun’s out, shades on! Don’t forget sunscreen 😎", "Perfect day for an ice cream or a long walk 🍦🚶‍♀️", "Clear skies and good vibes ahead 🌞✨"],
    clouds: ["Clouds are having a meeting up there! ☁️", "Still a great day to be outdoors — maybe a light jacket?", "Sky's wearing a gray sweater today! 🌫️"],
    rain: ["Don’t forget your umbrella — it's nature’s splash party ☔💃", "Perfect day for pakoras and Netflix 🍲🎬", "Tiny droplets, big cozy vibes!"],
    snow: ["Snowball fights or hot cocoa? Or both? ☕❄️", "Snowflakes are saying hello! ❄️👋", "Winter wonderland loading... ⛄❄️"],
    thunderstorm: ["⚡ Dramatic skies incoming! Stay safe and unplug if needed.", "A good day to stay in and watch the show from your window 🎭", "It's Thor's bowling night! ⚡🎳"],
    atmosphere: ["Dreamy, soft-focus day! 🌫️✨", "It’s one of those days… where the air's got secrets. Stay curious, stay indoors if needed! 🔮🌪️", "Atmospheric trickery afoot! The skies are casting illusions — step carefully, seer of weather 👁️‍🗨️🌫️"]
}

//categories grouping together weather desc 
const weatherKeywords = {
    clear: ['clear', 'sunny'], clouds: ['cloud', 'overcast'], rain: ['rain', 'drizzle', 'shower'], snow: ["snow", "sleet"], thunderstorm: ['thunderstorm', 'thunder'], atmosphere: ['mist', 'fog', 'haze', 'smoke', 'dust', 'sand', 'tornado']
}

//assign category to weather desc info
function extractWeatherInfo(weatherMain = ''){
    const main = weatherMain.toLowerCase();
    for(const [category, keywords] of Object.entries(weatherKeywords)){
        if(keywords.some(keyword=>main.includes(keyword))){
            return category;
        }
    }
    return 'clear';
}

//function to give note randomly
function giveNotes(weatherMain = ''){
    const category = extractWeatherInfo(weatherMain);
    const note = notes[category];

    const randomIdx = Math.floor(Math.random()*note.length);
    return note[randomIdx];
}

function showWeatherForecast(data) {
    const isCelsius = !document.getElementById('unitToggle').checked;
     if (data.alerts && data.alerts.length > 0) {
        displayWeatherAlerts(data.alerts);
    } else {
        hideWeatherAlerts();
    }
    const forecast = data.daily.slice(0, 8);
    const opt = { hour: '2-digit', minute: '2-digit' };

    const dates = forecast.map(day => `<th>${new Date(day.dt * 1000).toLocaleDateString()}</th>`).join("");
    const maxTemps = forecast.map(day => `<td>${convertTemp(day.temp.max, isCelsius)}</td>`).join("");
    const minTemps = forecast.map(day => `<td>${convertTemp(day.temp.min, isCelsius)}</td>`).join("");
    const sunrises = forecast.map(day => `<td>${new Date(day.sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>`).join("");
    const sunsets = forecast.map(day => `<td>${new Date(day.sunset * 1000).toLocaleTimeString('en-US', opt)}</td>`).join("");
    const summaries = forecast.map(day => `<td>${day.weather[0].description}</td>`).join("");
    const icons = forecast.map(day => `<td class = "icons-block"><img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"></td>`).join("");
    const noteForUser = forecast.map(day => `<td class = "notes"><p class="notes-txt">${giveNotes(day.weather[0].main)}</p></td>`).join("");

    document.getElementById("forecast").style.display = "block";
    document.getElementById("forecast-section").style.display = "block";

    document.getElementById("forecast-table").innerHTML = `
        <tr><th>Date</th>${dates}</tr>
        <tr><th>Max-Temperature</th>${maxTemps}</tr>
        <tr><th>Min-Temperature</th>${minTemps}</tr>
        <tr><th>Sunrise</th>${sunrises}</tr>
        <tr><th>Sunset</th>${sunsets}</tr>
        <tr><th>Summary</th>${summaries}</tr>
        <tr><th>Something for you!<br>(hover to unlock)</th>${noteForUser}</tr>
        <tr><th>Icon</th>${icons}</tr>
    `;

    if (toggle === 0) {
        document.querySelector('.forecasttable').querySelectorAll('th').forEach(et => {
            et.style.color = "rgba(17, 34, 29, 0.7)";
        });
        document.querySelector('.forecasttable').querySelectorAll('td').forEach(ed => {
            ed.style.color = "rgb(233, 239, 236)";
        });
        document.querySelectorAll('.forecasttable td, .forecasttable th').forEach(el => {
            el.style.border = "1px solid rgb(233, 239, 236)";
        });
    }

    function displayWeatherAlerts(alerts) {
    const alertBox = document.getElementById("weather-alert-box");
    alertBox.innerHTML = ''; // Clear previous alerts

    alerts.forEach(alert => {
        const alertEl = document.createElement("div");
        alertEl.className = "alert-card";
        alertEl.innerHTML = `
            <div class="alert-header">
                ⚠️ ${alert.event}
                <button class="close-btn" onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
            <div class="alert-body">
                <p><strong>From:</strong> ${new Date(alert.start * 1000).toLocaleString()}</p>
                <p><strong>To:</strong> ${new Date(alert.end * 1000).toLocaleString()}</p>
                <p><strong>Description:</strong><br>${alert.description.replace(/\n/g, '<br>')}</p>
                <p><strong>Source:</strong> ${alert.sender_name}</p>
            </div>
        `;
        alertBox.appendChild(alertEl);
    });

        alertBox.style.display = "block";
    }

    function hideWeatherAlerts() {
        const alertBox = document.getElementById("weather-alert-box");
        alertBox.innerHTML = "";
        alertBox.style.display = "none";
}
    
  
    const ctx = document.getElementById('tempLineChart').getContext('2d');

    const chartLabels = forecast.map(day => new Date(day.dt * 1000).toLocaleDateString());
    const maxTempValues = forecast.map(day => isCelsius ? day.temp.max : (day.temp.max * 9/5 + 32));
    const minTempValues = forecast.map(day => isCelsius ? day.temp.min : (day.temp.min * 9/5 + 32));

    // Destroy previous chart if it exists
    if (window.tempChart) {
        window.tempChart.destroy();
    }

    window.tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Max Temp',
                    data: maxTempValues,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Min Temp',
                    data: minTempValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: toggle === 0 ? 'white' : 'rgba(22, 66, 60, 1)'
                    }
                },
                title: {
                    display: true,
                    text: '7-Day Temperature Trend',
                    color: toggle === 0 ? 'white' : 'rgba(22, 66, 60, 1)'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: `Temperature (${isCelsius ? '°C' : '°F'})`,
                        color: toggle === 0 ? 'white' : 'rgba(22, 66, 60, 1)'
                    },
                    ticks: {
                        color: toggle === 0 ? 'white' : 'rgba(22, 66, 60, 1)'
                    }
                },
                x: {
                    ticks: {
                        color: toggle === 0 ? 'white' : 'rgba(22, 66, 60, 1)'
                    }
                }
            }
        }
    });


}

// Dark-mode toggle
const darkbtn = document.getElementById('dark-mode');
let toggle = 1;
function changedisplay() {
    if (toggle == 1) {
        // dark mode styling
        document.querySelector('body').style.backgroundColor = "rgba(17, 34, 29, 0.7)";
        document.querySelector('body').style.color = "rgb(233, 239, 236)";
        darkbtn.textContent = "🌙";
        document.querySelectorAll("table, th, td").forEach(el => {
            el.style.border = "1px solid rgb(233, 239, 236)";
            el.style.color = "rgb(233, 239, 236)";
        });
        document.querySelector('.forecasttable')?.querySelectorAll('th').forEach(et => {
            et.style.color = "rgba(17, 34, 29, 0.7)";
        });
        localStorage.setItem("theme", "dark"); 
        toggle = 0;
    } else {
        // light mode styling
        document.querySelector('body').style.backgroundColor = "rgb(233, 239, 236)";
        document.querySelector('body').style.color = "black";
        darkbtn.textContent = "☀️";
        document.querySelectorAll("table, th, td").forEach(el => {
            el.style.border = "1px solid rgba(22, 66, 60, 1)";
            el.style.color = "rgba(22, 66, 60, 1)";
        });
        localStorage.setItem("theme", "light"); 
        toggle = 1;
    }
}

darkbtn.addEventListener('click', changedisplay);

// Check for saved theme in localStorage and apply on load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        toggle = 1; // important to allow toggling later
        changedisplay();
    } else if (savedTheme === "light") {
        toggle = 0;
        changedisplay();
    }
});

// This is for showing wind direction
function getWindDirectionArrow(deg) {
    if (deg >= 337.5 || deg < 22.5) return '↑ N';
    if (deg >= 22.5 && deg < 67.5) return '↗ NE';
    if (deg >= 67.5 && deg < 112.5) return '→ E';
    if (deg >= 112.5 && deg < 157.5) return '↘ SE';
    if (deg >= 157.5 && deg < 202.5) return '↓ S';
    if (deg >= 202.5 && deg < 247.5) return '↙ SW';
    if (deg >= 247.5 && deg < 292.5) return '← W';
    if (deg >= 292.5 && deg < 337.5) return '↖ NW';
    return '❓';
}

// Save forecast data globally for reuse
let lastForecastData = null;

// Wrap fetch to save forecast
function getWeatherForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            lastForecastData = data;
            showWeatherForecast(data);

        })
        .catch(error => {
            console.error('Error fetching Forecast', error);
        });
}

// Temperature unit toggle listener
const unitToggle = document.getElementById('unitToggle');
unitToggle.addEventListener('change', function () {
    const isCelsius = !this.checked;
    updateTemperatureDisplay(isCelsius);
    if (lastForecastData) {
        showWeatherForecast(lastForecastData); 
    }
});

// Scroll to top button
window.onscroll = function () {
  const btn = document.getElementById("backToTopBtn");
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    btn.style.display = "flex";
  } else {
    btn.style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
//added share button
const shareBtn = document.getElementById("shareBtn");
shareBtn.style.display = "inline-block"; // show the button

shareBtn.onclick = async () => {
    // Corrected: Use city1 from the main table
    const city = document.getElementById("city1").textContent;
    const temperature = document.getElementById("temp").textContent;
    const description = document.getElementById("wi").textContent;
    const aqi = document.getElementById("aqi").textContent; // This will get the AQI from the span in pollution-info

    const shareText = `📍 ${city}\n🌡️ Temp: ${temperature}\n🌤️ ${description}\n🌫️ AQI: ${aqi}\nShared via Weather Blast`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: "Weather Update",
                text: shareText,
            });
        } catch (err) {
            console.error("Share failed:", err);
        }
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareText).then(() => {
            alert("Copied to clipboard!");
        });
    }
};



//SHOW RECENT SEARCHES;
const searchInput = document.getElementById('city-input');
const searchBtn = document.querySelector('button[onclick="getWeatherByCity()"]');
const recentList = document.getElementById('recent-list');
const resetBtn = document.getElementById('reset-searches-btn');

// Update recent searches in localStorage and re-render list
function updateRecentSearches(newSearch) {
  let recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
  recent = recent.filter(item => item.toLowerCase() !== newSearch.toLowerCase());
  recent.unshift(newSearch);
  if (recent.length > 5) recent = recent.slice(0, 5);
  localStorage.setItem('recentSearches', JSON.stringify(recent));
  renderRecentSearches();
}

// Render recent searches as clickable list items
function renderRecentSearches() {
  const recent = JSON.parse(localStorage.getItem('recentSearches')) || [];
  if (recent.length === 0) {
    recentList.innerHTML = '<li>No recent searches yet.</li>';
    return;
  }

  recentList.innerHTML = recent
    .map(item => `<li class="recent-item" tabindex="0" role="button">${item}</li>`)
    .join('');

  document.querySelectorAll('.recent-item').forEach(el => {
    el.onclick = () => {
      searchInput.value = el.innerText;
      getWeatherByCity();
    };
  });
}

// On Search button click, update recent searches and fetch weather
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    const validationMsg = document.getElementById("validationMsg");

    if (!query) {
        validationMsg.textContent = "Oops! Empty Input";
        validationMsg.classList.remove("hidden");
        searchInput.focus();
        return;
    }

    validationMsg.classList.add("hidden");
    updateRecentSearches(query);
});

// Reset recent searches and update display
resetBtn.addEventListener('click', () => {
  localStorage.removeItem('recentSearches');
  renderRecentSearches();
});

// Render recent searches on page load
window.addEventListener('DOMContentLoaded', renderRecentSearches);
