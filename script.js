const apiKey = 'a9597b9143bd10ce791e1b80c44d2d50'; // OpenWeatherMap API key
const geoAPI = '2783701aa79748f9b21e86f7ca361dd4'; // GeoApify API key
const opt = { timeStyle: 'short', hour12: true }; // Time formatting options


function initMap() {
    map = new mappls.Map("map", {
        center: [28.6138954, 77.2090057]
    });
}

window.onload = initMap();




function initMap1(data) {
    const latitude = data.coord.lat;
    const longitude = data.coord.lon;
    map = new mappls.Map("map", {
        center: [latitude, longitude]
    });
}





function autoComplete() {
    const input = document.getElementById('city-input').value;
    if (input.length <= 2) {
        document.getElementById("suggestion-box").style.display = "none";
        return;
    }
    getSuggestion(input);
    document.getElementById("suggestion-box").style.display = "flex";
}

function getSuggestion(input) {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&apiKey=${geoAPI}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const suggestions = data.features.slice(0, 5).map(feature => ({
                address: feature.properties.address_line1,
                state: feature.properties.state,
                country: feature.properties.country,
            }));

            updateSuggestions(suggestions);
        })
        .catch(error => console.log('error', error));
}

function updateSuggestions(suggestions) {
    const suggestionBox = document.getElementById("suggestion-box");
    suggestions.forEach((suggestion, index) => {
        const suggestionElement = document.getElementById(`suggestion-${index}`);
        if (suggestionElement) {
            suggestionElement.innerText = `${suggestion.address}, ${suggestion.state}, ${suggestion.country}`;
            suggestionElement.onclick = () => {
                document.getElementById("city-input").value = `${suggestion.address}, ${suggestion.state}`;
                suggestionBox.style.display = "none";
            };
        }
    });
}






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
            initMap1(position);

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
                fetchWeatherByCoordinates(lat, lon);

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
            initMap1(data);

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
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    fetchPollution(lat, lon);
    getWeatherForecast(lat, lon);



    document.getElementById("weat").innerText = `Weather Information : ${city}`;
    document.getElementById("air").innerText = `Air Pollution : ${city}`;


    //FOR BIG SCREENS
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

    //FOR SMALL SCREENS
    document.getElementById("wi1").innerText = `${weatherdes}`;
    document.getElementById("date1").innerText = `${date}`;
    document.getElementById("city1").innerText = `${city}`;
    document.getElementById("temp1").innerText = `${currTemp}°C`;
    document.getElementById("fl1").innerText = `${feelsLike}°C`;
    document.getElementById("humi1").innerText = `${humidity}%`;
    document.getElementById("press1").innerText = `${pressure} hPa`;
    document.getElementById("visi1").innerText = `${visibility} Km`;
    document.getElementById("ws1").innerText = `${windSpeed} m/s`;
    document.getElementById("sr1").innerText = `${sunrise}`;
    document.getElementById("ss1").innerText = `${sunset}`;
    document.getElementById("cc1").innerText = `${countryCode}`;

    // Clear city input after displaying weather
    document.getElementById("city-input").value = '';
    initMap1(data);

}

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

function displayPollution(data) {
    const aqi = data.list[0].main.aqi;
    const co = data.list[0].components.co;
    const no = data.list[0].components.no;
    const no2 = data.list[0].components.no2;
    const o3 = data.list[0].components.o3;
    const so2 = data.list[0].components.so2;
    const pm2 = data.list[0].components.pm2_5;
    const pm10 = data.list[0].components.pm10;
    const nh3 = data.list[0].components.nh3;

    if (aqi === 1) {
        document.getElementById("aqi").innerText = `Good`;
        document.getElementById("aqi1").innerText = `Good`;
    }
    else if (aqi === 2) {
        document.getElementById("aqi").innerText = `Fair`;
        document.getElementById("aqi1").innerText = `Fair`;
    }
    else if (aqi === 3) {
        document.getElementById("aqi").innerText = `Moderate`;
        document.getElementById("aqi1").innerText = `Moderate`;
    }
    else if (aqi === 4) {
        document.getElementById("aqi").innerText = `Poor`;
        document.getElementById("aqi1").innerText = `Poor`;
    }
    else {
        document.getElementById("aqi").innerText = `Very Poor`;
        document.getElementById("aqi1").innerText = `Very Poor`;
    }


    //FOR BIG SCREENS
    document.getElementById("co").innerText = `${co} μg/m3`;
    document.getElementById("no").innerText = `${no} μg/m3`;
    document.getElementById("no2").innerText = `${no2} μg/m3`;
    document.getElementById("o3").innerText = `${o3} μg/m3`;
    document.getElementById("so2").innerText = `${so2} μg/m3`;
    document.getElementById("pm2.5").innerText = `${pm2} μg/m3`;
    document.getElementById("pm10").innerText = `${pm10} μg/m3`;
    document.getElementById("nh3").innerText = `${nh3} μg/m3`;

    //FOR SMALL SCREENS
    document.getElementById("co1").innerText = `${co} μg/m3`;
    document.getElementById("no1").innerText = `${no} μg/m3`;
    document.getElementById("no21").innerText = `${no2} μg/m3`;
    document.getElementById("o31").innerText = `${o3} μg/m3`;
    document.getElementById("so21").innerText = `${so2} μg/m3`;
    document.getElementById("pm2.51").innerText = `${pm2} μg/m3`;
    document.getElementById("pm101").innerText = `${pm10} μg/m3`;
    document.getElementById("nh31").innerText = `${nh3} μg/m3`;
}




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

function showWeatherForecast(data) {
    document.getElementById("forecast").style.display="block";
    const data0 = new Date(data.daily[0].dt * 1000);
    const data1 = new Date(data.daily[1].dt * 1000);
    const data2 = new Date(data.daily[2].dt * 1000);
    const data3 = new Date(data.daily[3].dt * 1000);
    const data4 = new Date(data.daily[4].dt * 1000);
    const data5 = new Date(data.daily[5].dt * 1000);
    const data6 = new Date(data.daily[6].dt * 1000);
    const data7 = new Date(data.daily[7].dt * 1000);

    document.getElementById("forecast-table").innerHTML = `
    <tr>
    <th>Date</th>
    <th>${data0.toLocaleDateString()}</th>
    <th>${data1.toLocaleDateString()}</th>
    <th>${data2.toLocaleDateString()}</th>
    <th>${data3.toLocaleDateString()}</th>
    <th>${data4.toLocaleDateString()}</th>
    <th>${data5.toLocaleDateString()}</th>
    <th>${data6.toLocaleDateString()}</th>
    <th>${data7.toLocaleDateString()}</th>
    </tr>
    <tr>
    <th>Max-Temperature</th>
    <td>${data.daily[0].temp.max} °C </td>
    <td>${data.daily[1].temp.max} °C</td>
    <td>${data.daily[2].temp.max} °C</td>
    <td>${data.daily[3].temp.max} °C</td>
    <td>${data.daily[4].temp.max} °C</td>
    <td>${data.daily[5].temp.max} °C</td>
    <td>${data.daily[6].temp.max} °C</td>
    <td>${data.daily[7].temp.max} °C</td>
    </tr>
    <tr>
    <th>Min-Temperature</th>
    <td>${data.daily[0].temp.min} °C </td>
    <td>${data.daily[1].temp.min} °C</td>
    <td>${data.daily[2].temp.min} °C</td>
    <td>${data.daily[3].temp.min} °C</td>
    <td>${data.daily[4].temp.min} °C</td>
    <td>${data.daily[5].temp.min} °C</td>
    <td>${data.daily[6].temp.min} °C</td>
    <td>${data.daily[7].temp.min} °C</td>
    </tr>
    <tr>
    <th>Sunrise</th>
    <td>${new Date(data.daily[0].sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[1].sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[2].sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[3].sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[4].sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[5].sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[6].sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[7].sunrise * 1000).toLocaleTimeString('en-US', opt)}</td>
    </tr>
    <tr>
    <th>Sunset</th>
    <td>${new Date(data.daily[0].sunset * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[1].sunset * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[2].sunset * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[3].sunset * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[4].sunset * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[5].sunset * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[6].sunset * 1000).toLocaleTimeString('en-US', opt)}</td>
    <td>${new Date(data.daily[7].sunset * 1000).toLocaleTimeString('en-US', opt)}</td>
    </tr>
    <tr>
    <th>Summary</th>
    <td>${data.daily[0].summary}</td>
    <td>${data.daily[1].summary}</td>
    <td>${data.daily[2].summary}</td>
    <td>${data.daily[3].summary}</td>
    <td>${data.daily[4].summary}</td>
    <td>${data.daily[5].summary}</td>
    <td>${data.daily[6].summary}</td>
    <td>${data.daily[7].summary}</td>
    </tr>
    <tr>
    <th>Icon</th>
    <td><img src="https://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png"></td>
    <td><img src="https://openweathermap.org/img/wn/${data.daily[1].weather[0].icon}@2x.png"></td>
    <td><img src="https://openweathermap.org/img/wn/${data.daily[2].weather[0].icon}@2x.png"></td>
    <td><img src="https://openweathermap.org/img/wn/${data.daily[3].weather[0].icon}@2x.png"></td>
    <td><img src="https://openweathermap.org/img/wn/${data.daily[4].weather[0].icon}@2x.png"></td>
    <td><img src="https://openweathermap.org/img/wn/${data.daily[5].weather[0].icon}@2x.png"></td>
    <td><img src="https://openweathermap.org/img/wn/${data.daily[6].weather[0].icon}@2x.png"></td>
    <td><img src="https://openweathermap.org/img/wn/${data.daily[7].weather[0].icon}@2x.png"></td>
    </tr>`

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
}

//Dark-mode toggle--->>

const darkbtn = document.getElementById('dark-mode');

let toggle = 1;

function changedisplay(){
    if(toggle){
        document.querySelector('body').style.backgroundColor = "rgba(17, 34, 29, 0.7)";
         document.querySelector('body').style.color = "rgb(233, 239, 236)";
         darkbtn.textContent = "☀️";
         document.querySelectorAll("table, th, td").forEach(el => {
         el.style.border = "1px solid rgb(233, 239, 236)";
         el.style.color = "rgb(233, 239, 236)";
         });
         document.querySelector('.forecasttable').querySelectorAll('th').forEach(et => {
            et.style.color = "rgba(17, 34, 29, 0.7)";
         });
        
        toggle = 0;
    }
    else{
        document.querySelector('body').style.backgroundColor = "rgb(233, 239, 236)"; 
          document.querySelector('body').style.color = "black";
          darkbtn.textContent = "🌙";
          document.querySelectorAll("table, th, td").forEach(el => {
         el.style.border = "1px solid rgba(22, 66, 60, 1)";
         el.style.color = "rgba(22, 66, 60, 1)";
         })
         
        toggle = 1;
    }
}


darkbtn.addEventListener('click', changedisplay);
