const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fetch = require("node-fetch"); // ✅ Import node-fetch

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city) {
    return res.status(400).json({ error: "City parameter is required." });
  }

  if (!apiKey || apiKey.includes("appid=")) {
    return res.status(500).json({ error: "Invalid or missing API key." });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    console.log("🌐 API Request URL:", url);

    const weatherRes = await fetch(url);
    const rawText = await weatherRes.text();

    console.log("📡 Status Code:", weatherRes.status);
    console.log("📨 Raw API Response:", rawText);

    if (!weatherRes.ok) {
      return res.status(weatherRes.status).json({ error: "Failed to fetch weather data." });
    }

    const data = JSON.parse(rawText);

    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };

    res.json(weatherData);
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
