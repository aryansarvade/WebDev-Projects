import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const API_URL = "https://api.open-meteo.com/v1/forecast"; //Base URL

//Parameters to fetch specific data
const parameters = {
  latitude: "18.5495976",
  longitude: "73.9035605",
  hourly: "temperature_2m,wind_speed_10m,wind_direction_10m",
  current: "temperature_2m,is_day,wind_speed_10m,wind_direction_10m",
  timezone: "GMT",
  forecast_days: "1",
};

//Using MiddleWares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      API_URL +
        `?latitude=${parameters.latitude}&longitude=${parameters.longitude}&hourly=${parameters.hourly}&current=${parameters.current}&timezone=${parameters.timezone}&forecast_days=${parameters.forecast_days}`
    );
    console.log(response.data);
    res.render("index.ejs", {
      temp: response.data.current.temperature_2m,
      hourly_temp: response.data.hourly.temperature_2m, //Array of 24 temperatures
      hourly_time: response.data.hourly.time, //Array of 24 hour times from 00:00 to 23:00
      is_day: response.data.current.is_day,
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      wind_speed: response.data.current.wind_speed_10m,
      wind_direction: response.data.current.wind_direction_10m,
      hourly_wind_speed: response.data.hourly.wind_speed_10m,
      hourly_wind_direction: response.data.hourly.wind_direction_10m,
      temp_unit: response.data.current_units.temperature_2m,
      wind_speed_unit: response.data.current_units.wind_speed_10m,
      wind_direction_unit: response.data.current_units.wind_direction_10m,
    });
  } catch (error) {
    console.log("Failed to make request:", error.message);
  }
});

app.listen(port, (req, res) => {
  console.log(`Server Running on port:${port}`);
});
