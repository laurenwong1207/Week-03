let map;
let weatherCanvas;


// Mapping between weather conditions and GIF paths
const weatherGifsPaths = {
    Clear: 'gif/sunny.gif',
    Clouds: 'gif/cloudy.gif',
    Rain: 'gif/rain.gif',
    Thunderstorm:'gif/thunder.gif',
    Snow:'gif/snow.gif',
    Tornado:'gif/Tornado1.gif'
    // Add more mappings 
};

// Stores loaded GIF images
let weatherGifs = {};
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: { lat: -34.397, lng: 150.644 }
    });

    map.addListener('click', function (e) {
        getWeather(e.latLng.lat(), e.latLng.lng());
        showModal();
    });
}

function getWeather(lat, lng) {
    const apiKey = "001b0f58045147663b1ea518d34d88b4";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            visualizeWeather(data); // Call visualization function with weather data
            showModal(); // Show modal window containing visualization
        })
        .catch(error => console.error('Error:', error));
}


function showModal() {
    const modal = document.getElementById('weatherModal');
    modal.style.display = 'block';
    // showWeatherGif('Clear');
}

function closeModal() {
    const modal = document.getElementById('weatherModal');
    modal.style.display = 'none';
    hideWeatherGif();
}


document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.close');
    closeButton.onclick = function () {
        closeModal();
    };

    // Close modal when clicking outside the window
    window.onclick = function (event) {
        const modal = document.getElementById('weatherModal');
        if (event.target == modal) {
            closeModal();
        }
    };
});
function showWeatherGif(weatherState) {
    const gifPath = weatherGifsPaths[weatherState]; // Get the GIF path based on weather state
    const imgElement = document.getElementById('weatherGif');
    imgElement.src = gifPath; // Update the image source to the corresponding weather state GIF
    imgElement.style.display = 'block'; // Display the GIF
}

function hideWeatherGif() {
    const imgElement = document.getElementById('weatherGif');
    imgElement.style.display = 'none'; // Hide GIF
}
function updateGifPosition() {
    const imgElement = document.getElementById('weatherGif');
    if (imgElement.style.display === 'block') { // If the GIF is currently displayed
        const canvas = document.getElementById('weatherCanvas').querySelector('canvas');
        if (!canvas) return; // Exit if the canvas does not exist

        const canvasRect = canvas.getBoundingClientRect(); // Get the current position and size of the canvas
        const W = canvasRect.width ;

        const scaler=0.8;
        imgElement.style.width = `${W*scaler}px`; // Update GIF width to match canvas width
        imgElement.style.height = `auto`; // Automatically adjust height to maintain aspect ratio
        imgElement.style.position = 'absolute';
        imgElement.style.left = `${canvasRect.left+W*(1-scaler)/2}px`; 
        imgElement.style.top = `${canvasRect.top + 0 + 10}px`; 
    }
}
window.addEventListener('resize', updateGifPosition);

function visualizeWeather(weatherData) {
    if (weatherCanvas) {
        weatherCanvas.remove(); // Remove the canvas if it already exists
    }
    const weatherState = weatherData.weather[0].main;
    showWeatherGif(weatherState); // Display GIF based on weather state
    //let weatherGif; 
    weatherCanvas = new p5((sketch) => {
        sketch.preload = () => {
            // for (let state in weatherGifsPaths) {
            //     // Use p5.js's loadImage to load GIFs and store them in weatherGifs
            //     weatherGifs[state] = sketch.loadImage(weatherGifsPaths[state]);
            // }
        }
        sketch.setup = () => {
            let W = sketch.windowWidth * 0.25;
            let canvas = sketch.createCanvas(W, W * 1.5);
            canvas.parent('weatherCanvas'); // Ensure the canvas is placed inside the modal window
            updateGifPosition(); // Ensure updating GIF position after creating the canvas
        
        };

        sketch.draw = () => {
            let width = sketch.width;
            let height = sketch.height;
            sketch.noStroke();
            //sketch.background(10, 100, 180);
            sketch.fill(128,137,170);
            sketch.rect(0,0,width,height,width/8);
            sketch.fill(255);

            // Display temperature and weather condition
            let temp = `Temp: ${weatherData.main.temp}°C`;
            let weather = `Weather: ${weatherData.weather[0].main}`;
            let windSpeed = `windSpeed: ${weatherData.wind.speed}`;
            let windDeg = `windDeg: ${weatherData.wind.deg}`;
            let City = `City: ${weatherData.name}`;
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.textSize(20);
            sketch.text(City, width / 2, height / 1.5-25);
            sketch.text(temp, width / 2, height / 1.5);
            sketch.text(weather, width / 2, height / 1.5 + 25);
            sketch.text(windSpeed, width / 2, height / 1.5 + 50);
            sketch.text(windDeg, width / 2, height / 1.5 + 75);
        };
    });
}


