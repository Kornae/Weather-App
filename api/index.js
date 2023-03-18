const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.post("/", function (req, res) {
    const query = req.body.cityName;
    const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + query + '/today?unitGroup=us&include=current&key=' + process.env.API_KEY + '&contentType=json';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var city = data.resolvedAddress;
            var temp = Math.round(data.days[0].temp);
            var celcius = Math.round((temp - 32) * (5 / 9));
            var condition = data.days[0].conditions;
            var uv = data.days[0].uvindex;
            var humidity = data.days[0].humidity;
            var visibility = data.days[0].visibility;
            var wind = data.days[0].windgust;
            var icon = data.days[0].icon;
            const imageURL = 'https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/' + icon + '.png';
            res.render('sample', { location: city, t: temp, info: condition, uv: uv, humidity: humidity, visibility: visibility, wind: wind, image: imageURL, c: celcius })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

})

const port = process.env.PORT;
app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
})