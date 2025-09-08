document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  getWeather(city);
});

async function getWeather(city) {
  const weatherDiv = document.getElementById("weatherResult");

  if (!city) {
    weatherDiv.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  try {
    const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    if (data.error) {
      weatherDiv.innerHTML = `<p>${data.error}</p>`;
      return;
    }

    weatherDiv.innerHTML = `
      <h2>${data.city}, ${data.country}</h2>
      <p><strong>${data.temp}°C</strong></p>
      <p>${data.description}</p>
      <img src="${data.icon}" alt="Weather icon" />
    `;
  } catch (error) {
    weatherDiv.innerHTML = `<p>Something went wrong. Try again later.</p>`;
  }
}
