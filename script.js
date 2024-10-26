const apiKey = 'a9597b9143bd10ce791e1b80c44d2d50'; // OpenWeatherMap API key
const geoAPI = '2783701aa79748f9b21e86f7ca361dd4'; // GeoApify API key
const opt = { timeStyle: 'short', hour12: true }; // Time formatting options






function autoComplete(){
    const input = document.getElementById('city-input').value;
    if (input.length <= 2){
        document.getElementById("suggestion-box").style.display = "none";
        return;
    }
    getSuggestion(input);
    document.getElementById("suggestion-box").style.display = "flex";
}


function getSuggestion(input){
    const suggestion0=document.getElementById("suggestion-0");
    const suggestion1=document.getElementById("suggestion-1");
    const suggestion2=document.getElementById("suggestion-2");
    const suggestion3=document.getElementById("suggestion-3");
    const suggestion4=document.getElementById("suggestion-4");


    url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&apiKey=${geoAPI}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        suggestion0.innerText = [data.features[0].properties.address_line1 , data.features[0].properties.state , data.features[0].properties.country] ;
        suggestion1.innerText = [data.features[1].properties.address_line1 , data.features[1].properties.state ,data.features[1].properties.country] ;
        suggestion2.innerText = [data.features[2].properties.address_line1 , data.features[2].properties.state ,data.features[2].properties.country] ;
        suggestion3.innerText = [data.features[3].properties.address_line1 , data.features[3].properties.state ,data.features[3].properties.country] ;
        suggestion4.innerText = [data.features[4].properties.address_line1 , data.features[4].properties.state ,data.features[4].properties.country] ;

        const suggest0 =[data.features[0].properties.address_line1 , data.features[0].properties.state];
        const suggest1 =[data.features[1].properties.address_line1 , data.features[1].properties.state];
        const suggest2 =[data.features[2].properties.address_line1 , data.features[2].properties.state];
        const suggest3 =[data.features[3].properties.address_line1 , data.features[3].properties.state];
        const suggest4 =[data.features[4].properties.address_line1 , data.features[4].properties.state];

        inputSuggestion(suggest0,suggest1,suggest2,suggest3,suggest4);
        
    })
    .catch(error => 
        console.log('error', error));

}

function inputSuggestion(suggest0,suggest1,suggest2,suggest3,suggest4){
    const suggestion0=document.getElementById("suggestion-0");
    const suggestion1=document.getElementById("suggestion-1");
    const suggestion2=document.getElementById("suggestion-2");
    const suggestion3=document.getElementById("suggestion-3");
    const suggestion4=document.getElementById("suggestion-4");

    suggestion0.onclick = () => {
        document.getElementById("city-input").value = suggest0; // Set input to selected city name
        document.getElementById("suggestion-box").style.display = "none";
    };
    suggestion1.onclick = () => {
        document.getElementById("city-input").value = suggest1; // Set input to selected city name
        document.getElementById("suggestion-box").style.display = "none";
    };
    suggestion2.onclick = () => {
        document.getElementById("city-input").value = suggest2; // Set input to selected city name
        document.getElementById("suggestion-box").style.display = "none";
    };
    suggestion3.onclick = () => {
        document.getElementById("city-input").value = suggest3; // Set input to selected city name
        document.getElementById("suggestion-box").style.display = "none";
    };
    suggestion4.onclick = () => {
        document.getElementById("city-input").value = suggest4; // Set input to selected city name
        document.getElementById("suggestion-box").style.display = "none";
    };
    

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
            initMap1(data);
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


var map = document.getElementById("map");
function initMap1(data) {
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    map = new mappls.Map("map", {
        center: [lat, lon]
    });
}



