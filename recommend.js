// import fetch from 'node-fetch';
const fetch=require('node-fetch')

async function getLocation() {
    // Use an IP-based geolocation service
    const response = await fetch('https://ipinfo.io/json?token=5685227d964c08'); // Replace with your IPinfo token
    const data = await response.json();
    
    const [lat, lon] = data.loc ? data.loc.split(',') : [null, null];

    return {
        city: data.city || "Unknown City",
        state: data.region || "Unknown State"
    };
}

async function getWeather(city) {
    const apiKey = '5f2240019f7b71a7a89218452413b9d3'; // Replace with your OpenWeatherMap API key
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

    if (!response.ok) {
        throw new Error('Weather data not available');
    }

    const data = await response.json();
    return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        weather: data.weather[0].main
    };
}

function getCurrentMonth() {
    const date = new Date();
    return date.getMonth() + 1; // Convert to 1-indexed (1 = January, 12 = December)
}

function recommendCrops(state, month, weather) {
    const cropRecommendations = {
        "Punjab": {
            1: { "Clear": ["Wheat"], "Rain": ["Not favorable for any crop"], "Mist": ["Mustard"] },
            2: { "Clear": ["Barley"], "Rain": ["Not favorable for any crop"], "Mist": ["Onion"] },
            3: { "Clear": ["Potato"], "Rain": ["Not favorable for any crop"], "Mist": ["Cauliflower"] },
            4: { "Clear": ["Cotton"], "Rain": ["Not favorable for any crop"], "Mist": ["Okra"] },
            5: { "Clear": ["Maize"], "Rain": ["Not favorable for any crop"], "Mist": ["Pumpkin"] },
            6: { "Clear": ["Rice"], "Rain": ["Pulses"], "Mist": ["Brinjal"] },
            7: { "Clear": ["Not favorable for any crop"], "Rain": ["Turmeric"], "Mist": ["Chili"] },
            8: { "Clear": ["Not favorable for any crop"], "Rain": ["Taro"], "Mist": ["Coriander"] },
            9: { "Clear": ["Garlic"], "Rain": ["Not favorable for any crop"], "Mist": ["Mustard"] },
            10: { "Clear": ["Lentils"], "Rain": ["Not favorable for any crop"], "Mist": ["Peas"] },
            11: { "Clear": ["Cabbage"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            12: { "Clear": ["Fenugreek"], "Rain": ["Not favorable for any crop"], "Mist": ["Brinjal"] },
        },
        "Haryana": {
            1: { "Clear": ["Wheat"], "Rain": ["Not favorable for any crop"], "Mist": ["Mustard"] },
            2: { "Clear": ["Chickpea"], "Rain": ["Not favorable for any crop"], "Mist": ["Onion"] },
            3: { "Clear": ["Maize"], "Rain": ["Not favorable for any crop"], "Mist": ["Tomato"] },
            4: { "Clear": ["Cotton"], "Rain": ["Not favorable for any crop"], "Mist": ["Brinjal"] },
            5: { "Clear": ["Rice"], "Rain": ["Not favorable for any crop"], "Mist": ["Chili"] },
            6: { "Clear": ["Not favorable for any crop"], "Rain": ["Turmeric"], "Mist": ["Not favorable for any crop"] },
            7: { "Clear": ["Not favorable for any crop"], "Rain": ["Pumpkin"], "Mist": ["Not favorable for any crop"] },
            8: { "Clear": ["Not favorable for any crop"], "Rain": ["Spinach"], "Mist": ["Not favorable for any crop"] },
            9: { "Clear": ["Garlic"], "Rain": ["Not favorable for any crop"], "Mist": ["Coriander"] },
            10: { "Clear": ["Lentils"], "Rain": ["Not favorable for any crop"], "Mist": ["Mustard"] },
            11: { "Clear": ["Cabbage"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            12: { "Clear": ["Fenugreek"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
        },
        "Maharashtra": {
            1: { "Clear": ["Wheat"], "Rain": ["Not favorable for any crop"], "Mist": ["Mustard"] },
            2: { "Clear": ["Chickpea"], "Rain": ["Not favorable for any crop"], "Mist": ["Tomato"] },
            3: { "Clear": ["Cotton"], "Rain": ["Not favorable for any crop"], "Mist": ["Potato"] },
            4: { "Clear": ["Sorghum"], "Rain": ["Not favorable for any crop"], "Mist": ["Brinjal"] },
            5: { "Clear": ["Rice"], "Rain": ["Not favorable for any crop"], "Mist": ["Watermelon"] },
            6: { "Clear": ["Not favorable for any crop"], "Rain": ["Turmeric"], "Mist": ["Pumpkin"] },
            7: { "Clear": ["Not favorable for any crop"], "Rain": ["Chili"], "Mist": ["Not favorable for any crop"] },
            8: { "Clear": ["Garlic"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            9: { "Clear": ["Not favorable for any crop"], "Rain": ["Spinach"], "Mist": ["Not favorable for any crop"] },
            10: { "Clear": ["Lentils"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            11: { "Clear": ["Cabbage"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            12: { "Clear": ["Fenugreek"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
        },
        "Uttar Pradesh": {
            1: { "Clear": ["Wheat"], "Rain": ["Not favorable for any crop"], "Mist": ["Mustard"] },
            2: { "Clear": ["Chickpea"], "Rain": ["Not favorable for any crop"], "Mist": ["Onion"] },
            3: { "Clear": ["Maize"], "Rain": ["Not favorable for any crop"], "Mist": ["Potato"] },
            4: { "Clear": ["Cotton"], "Rain": ["Not favorable for any crop"], "Mist": ["Chili"] },
            5: { "Clear": ["Sorghum"], "Rain": ["Not favorable for any crop"], "Mist": ["Brinjal"] },
            6: { "Clear": ["Rice"], "Rain": ["Pulses"], "Mist": ["Watermelon"] },
            7: { "Clear": ["Not favorable for any crop"], "Rain": ["Turmeric"], "Mist": ["Not favorable for any crop"] },
            8: { "Clear": ["Not favorable for any crop"], "Rain": ["Taro"], "Mist": ["Not favorable for any crop"] },
            9: { "Clear": ["Garlic"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            10: { "Clear": ["Lentils"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            11: { "Clear": ["Cabbage"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            12: { "Clear": ["Fenugreek"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
        },
        "Tamil Nadu": {
            1: { "Clear": ["Rice"], "Rain": ["Not favorable for any crop"], "Mist": ["Mustard"] },
            2: { "Clear": ["Pulses"], "Rain": ["Not favorable for any crop"], "Mist": ["Onion"] },
            3: { "Clear": ["Tomato"], "Rain": ["Not favorable for any crop"], "Mist": ["Brinjal"] },
            4: { "Clear": ["Cotton"], "Rain": ["Not favorable for any crop"], "Mist": ["Okra"] },
            5: { "Clear": ["Sorghum"], "Rain": ["Not favorable for any crop"], "Mist": ["Chili"] },
            6: { "Clear": ["Rice"], "Rain": ["Not favorable for any crop"], "Mist": ["Cucumber"] },
            7: { "Clear": ["Not favorable for any crop"], "Rain": ["Turmeric"], "Mist": ["Not favorable for any crop"] },
            8: { "Clear": ["Not favorable for any crop"], "Rain": ["Taro"], "Mist": ["Not favorable for any crop"] },
            9: { "Clear": ["Garlic"], "Rain": ["Not favorable for any crop"], "Mist": ["Coriander"] },
            10: { "Clear": ["Lentils"], "Rain": ["Not favorable for any crop"], "Mist": ["Mustard"] },
            11: { "Clear": ["Cabbage"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            12: { "Clear": ["Fenugreek"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
        },
        "Andhra Pradesh": {
            1: { "Clear": ["Rice"], "Rain": ["Not favorable for any crop"], "Mist": ["Chili"] },
            2: { "Clear": ["Pulses"], "Rain": ["Not favorable for any crop"], "Mist": ["Cabbage"] },
            3: { "Clear": ["Tomato"], "Rain": ["Not favorable for any crop"], "Mist": ["Onion"] },
            4: { "Clear": ["Cotton"], "Rain": ["Not favorable for any crop"], "Mist": ["Okra"] },
            5: { "Clear": ["Sorghum"], "Rain": ["Not favorable for any crop"], "Mist": ["Pumpkin"] },
            6: { "Clear": ["Taro"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            7: { "Clear": ["Not favorable for any crop"], "Rain": ["Turmeric"], "Mist": ["Not favorable for any crop"] },
            8: { "Clear": ["Not favorable for any crop"], "Rain": ["Taro"], "Mist": ["Not favorable for any crop"] },
            9: { "Clear": ["Garlic"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            10: { "Clear": ["Lentils"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            11: { "Clear": ["Cabbage"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
            12: { "Clear": ["Fenugreek"], "Rain": ["Not favorable for any crop"], "Mist": ["Not favorable for any crop"] },
        },
    };
    

    const recommendations = cropRecommendations[state][month][weather] || [];
    return recommendations.length > 0 ? recommendations : ["No suitable crops found"];
}

async function main() {
    try {
        const location = (await getLocation()).state;
        console.log("Location:", `${location}`);
        const place = (await getLocation()).city;
        const currentMonth = getCurrentMonth();
        console.log("Current Month:", currentMonth);

        const weatherData = await getWeather(place);
        console.log("Weather:", weatherData.weather);

        const weatherCondition = weatherData.weather; // Example: "Clear", "Rain", "Mist"
        const cropSuggestions = recommendCrops(location, currentMonth, weatherCondition);
        console.log("Recommended Crops:", cropSuggestions);
    } catch (error) {
        console.error("Error:", error);
    }
}


main();