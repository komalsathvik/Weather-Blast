
# 🌦️ Weather App with Air Pollution Insights 🌫️

**Link:** [Weather Blast](https://weather-blast.netlify.app/)

This project is a comprehensive weather application built with **HTML**, **CSS**, and **JavaScript**. It fetches real-time weather data and air quality information, enhancing users’ awareness of both weather and pollution conditions.

## 🌐 Features

- 🌍 **Search by City Name**: Users can enter a city name to retrieve current weather and air quality for that location.
- 📍 **Geolocation Support**: Fetch weather and pollution details based on the user's location using the browser’s geolocation.
- 🔄 **Fallback to GeoApify**: Uses GeoApify’s geocoding service for latitude and longitude if the city name is not found on OpenWeatherMap.
- 🌞 **Weather Details**: Get real-time data on temperature, weather conditions, humidity, pressure, visibility, wind speed, sunrise, and sunset times.
- 🌫️ **Air Pollution Data**: Stay informed about air quality with pollution level indicators (such as PM2.5, PM10, and AQI).

## 🛠️ Technologies Used

- **HTML**: For structuring the application.
- **CSS**: Basic styling.
- **JavaScript**: Logic to fetch and display data.
- **OpenWeatherMap API**: For retrieving weather and air pollution data based on city name or geographic coordinates.
- **GeoApify API**: Used as a fallback to fetch latitude and longitude if the city isn’t found in OpenWeatherMap.

## 🚀 Running the Project

### Prerequisites

1. **API Keys**:
   - [OpenWeatherMap API](https://openweathermap.org/api): For weather and air quality data.
   - [GeoApify API](https://www.geoapify.com/): For geocoding services.

2. Add your API keys to the `script.js` file:
   ```javascript
   const apiKey = 'your_openweathermap_api_key';  // OpenWeatherMap API key
   const geoAPI = 'your_geoapify_api_key'; // GeoApify API key
   ```

## 📂 File Structure

```plaintext
weather-app/
│
├── index.html       # Main HTML structure
├── style.css        # Styling for the application
├── script.js        # JavaScript for fetching and displaying data
└── README.md        # Project documentation
```

## 🔧 Key JavaScript Functions

- **`getWeatherByCity()`**: Fetches weather and air pollution data for a given city.
- **`getWeatherByLocation()`**: Gets the user’s geolocation for weather and air quality data.
- **`fetchLatLon()`**: Fetches coordinates from GeoApify if the city isn’t found.
- **`fetchWeatherByCoordinates()`**: Fetches weather data using latitude and longitude.
- **`fetchAirQuality()`**: Retrieves air quality data based on geographic coordinates.
- **`displayWeather()`**: Displays weather information.
- **`displayAirQuality()`**: Shows air pollution details like AQI, PM2.5, and PM10 levels.

## 🧰 Error Handling

- **GeoApify Fallback**: If OpenWeatherMap does not recognize the city name, GeoApify fetches latitude and longitude.
- **Geolocation Access Denied**: Notifies users if location access is restricted.

## 🌟 Future Enhancements

- Add more detailed pollution levels for various pollutants.
- Implement a 5-day weather and pollution forecast.
- Enhance the user interface with weather and pollution icons.
- Provide more descriptive error messages for various API issues.

## 📜 License

This project is open-source and available under the [MIT License](LICENSE). 
