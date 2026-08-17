const inp = document.getElementById('search-inp');
async function geocoords(city) {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();
    return {
        longitude: geoData.results[0].longitude,
        latitude: geoData.results[0].latitude
    }
};
async function weather(longitude,latitude) {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code`);
    const weatherData = await weatherResponse.json();
    return {
        temp: weatherData.current.temperature_2m,
        humidity:weatherData.current.relative_humidity_2m,
        wind:weatherData.current.wind_speed_10m,
        code:weatherData.current.weather_code,
    }   
};
async function getWeather(city) {
    const coords = await geocoords(city);

    const data = await weather(
        coords.longitude,
        coords.latitude
    )

    console.log(data);
}
getWeather('Delhi');