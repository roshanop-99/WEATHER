const inp = document.getElementById('search-inp');
const searchBtn = document.getElementById('search-btn');
const temperature = document.getElementById('temp');
const cityElement = document.getElementById('city');
const countryElement = document.getElementById('country');
const wind = document.getElementById('wind-p');
const humid = document.getElementById('humidity-p');
const cloudsImg = document.getElementById('clouds');
const errorBox = document.querySelector('.error-box');



async function geocoords(city) {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();
    console.log(geoData);
    return {
        longitude: geoData.results[0].longitude,
        latitude: geoData.results[0].latitude,
        name: geoData.results[0].name,
        country: geoData.results[0].country
    }
};
async function weather(longitude,latitude) {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code`);
    const weatherData = await weatherResponse.json();
    return {
        temp: weatherData.current.temperature_2m,
        humidity:weatherData.current.relative_humidity_2m,
        windspeed:weatherData.current.wind_speed_10m,
        code:weatherData.current.weather_code,
    }   
};
async function getWeather(city) {
    if (!city.trim()) {
        alert('Please enter a city name.');
        return;
    }
    
    try{
        const coords = await geocoords(city);

        inp.value = '';

        const data = await weather(
        coords.longitude,
        coords.latitude
        )
        console.log(data);

        cityElement.textContent = coords.name;
        countryElement.textContent = coords.country;
        temperature.textContent = `${data.temp}°C`;
        humid.textContent = `${data.humidity}%`;
        wind.textContent = `${data.windspeed} km/h`;

        const imgData = imgChanger(data.code);
        cloudsImg.setAttribute('src' , `${imgData}`);
    }
    catch(error){
        errorBox.classList.add('active');
        setTimeout(()=>{
            errorBox.classList.remove('active');
        },3000);
        console.error(error);
        inp.value = '';
    }   

};

function imgChanger(code){
   switch (true) {
        case code === 0:
            return './images/clear.png';

        case [1, 2, 3].includes(code):
            return './images/clouds.png';

        case [45, 48].includes(code):
            return './images/mist.png';

        case [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code):
            return './images/rain.png';

        case [71, 73, 75, 77, 85, 86].includes(code):
            return './images/snow.png';

        case [95, 96, 99].includes(code):
            return './images/drizzle.png';

        default:
            return './images/clouds.png';
    }
};



searchBtn.addEventListener('click',()=>{
    getWeather(inp.value);
    
});

inp.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        getWeather(inp.value);
    }
});