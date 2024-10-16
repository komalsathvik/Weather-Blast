# Weather App 🌦️


**Link:** https://weather-blast.netlify.app/


This project is a weather application built using **HTML**, **CSS**, and **JavaScript**. It fetches real-time weather data from the **OpenWeatherMap API** and allows users to:
- Search for weather by city name.
- Fetch weather data based on the user's current geolocation.
- Handle fallback by using the **GeoApify API** to fetch latitude and longitude if the city is not found.

## Features

- 🌍 **Search by City Name**: Users can enter a city name and retrieve current weather conditions for that location.
- 📍 **Geolocation Support**: The app can fetch the user's current location using the browser's geolocation API and show weather details for that position.
- 🔄 **Fallback to GeoApify**: If the city name is not found via OpenWeatherMap, the app tries fetching latitude and longitude using the GeoApify geocoding service.
- 🌞 **Weather Details**: Displays temperature, weather conditions, humidity, pressure, visibility, wind speed, sunrise, and sunset times.

## Technologies Used

- **HTML**: Structure and layout of the webpage.
- **CSS**: Basic styling of the application.
- **JavaScript**: Logic to fetch and display weather data using APIs.
- **OpenWeatherMap API**: To retrieve weather data based on city or geographic coordinates.
- **GeoApify API**: To fetch latitude and longitude if a city is not found by OpenWeatherMap.

## How to Run the Project

### Prerequisites

1. **API Keys**:
   - Sign up for an account on [OpenWeatherMap](https://openweathermap.org/api) and get an API key.
   - Sign up for an account on [GeoApify](https://www.geoapify.com/) to get an API key for geocoding.

2. Add your API keys in the `script.js` file:
   ```javascript
   const apiKey = 'your_openweathermap_api_key';  // OpenWeatherMap API key
   const geoAPI = 'your_geoapify_api_key'; // GeoApify API key
   ```

### Running the Project

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/RAJIV81205/Weather-Info.git
   cd weather-app
   ```

2. Open the project folder and edit the `index.html` file in your favorite browser.

3. To test the functionality:
   - Enter a city name and click "Get Weather" to fetch weather details.
   - Use "Get Current Location" to retrieve weather data for your current position.

### File Structure

```plaintext
weather-app/
│
├── index.html       # The main HTML file for the structure of the app
├── style.css        # The CSS file for basic styling
├── script.js        # The main JavaScript file that contains all functionality
└── README.md        # Documentation for the project
```

### Key JavaScript Functions

- **`getWeatherByCity()`**: Fetches weather data for a given city name using OpenWeatherMap.
- **`getWeatherByLocation()`**: Retrieves the user's geolocation coordinates and fetches weather data.
- **`fetchLatLon()`**: If the city is not found, it uses GeoApify to fetch the latitude and longitude.
- **`fetchWeatherByCoordinates()`**: Fetches weather data using latitude and longitude.
- **`displayWeather()`**: Displays the fetched weather information on the webpage.

## Error Handling

- If the city name is not found by OpenWeatherMap, the app attempts to get the latitude and longitude from GeoApify.
- If the geolocation service is unavailable or denied by the user, an alert will appear notifying them that their location couldn’t be retrieved.

## Future Enhancements

- Add weather icons to visually represent the current weather conditions.
- Implement a 5-day forecast feature using OpenWeatherMap’s One Call API.
- Improve user interface styling for better aesthetics.
- Display detailed error messages for various API response failures.

## License

This project is open-source and available under the [MIT License](LICENSE).
