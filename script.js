// Your OpenWeatherMap API key
const apiKey = 'a9597b9143bd10ce791e1b80c44d2d50';



function getWeatherByCity(){
    const cityName = document.getElementById("city-input").value;
    if (!cityName){
        alert("PLEASE ENTER CITY NAME");
        return;
    }
    fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
    document.getElementById("city-input").innerHTML ='';

}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        }, () => {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


function fetchWeather(url){
    fetch(url)
    .then(response=>response.json())
    .then(data=>{console.log(data)

        const currTemp = data.main.temp;
        const feelsLike = data.main.feels_like;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const visibility = ((data.visibility)/1000);
        const windSpeed = data.wind.speed;
        const dt = new Date(data.dt*1000);////////////////////
        const date = dt.toLocaleDateString();
        const weatherdes = data.weather[0].main;
        const countryCode = data.sys.country;
        const city = data.name;
        const sunr = new Date(data.sys.sunrise*1000);
        const sunrise = sunr.toLocaleTimeString();
        const suns = new Date(data.sys.sunset*1000);
        const sunset = suns.toLocaleTimeString();

        document.getElementById("wi").innerText = `${weatherdes}`;
        document.getElementById("date").innerText = `${date}`;
        document.getElementById("city").innerText = `${city}`;
        document.getElementById("temp").innerText = `${currTemp}°C`;
        document.getElementById("fl").innerText = `${feelsLike}°C`;
        document.getElementById("humi").innerText = `${humidity}%`;
        document.getElementById("press").innerText = `${pressure} atm`;
        document.getElementById("visi").innerText = `${visibility} Km`;
        document.getElementById("ws").innerText = `${windSpeed} m/s`;
        document.getElementById("sr").innerText = `${sunrise}`;
        document.getElementById("ss").innerText = `${sunset}`;
        document.getElementById("cc").innerText = `${countryCode}`;
    

        document.getElementById("city-input").value = '';

    
    })

    .catch(error => {
        console.error('Error:', error);  // Log any errors if they occur
        alert("An error occurred. Please try again.");
    });

}

