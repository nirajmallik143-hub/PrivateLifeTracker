import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCurrentWeatherViewModel,
  buildForecastApiUrl,
  buildForecastViewModel,
  describeWeatherCode,
  formatLocationName
} from "../script.mjs";

test("describeWeatherCode falls back for unknown codes", () => {
  assert.deepEqual(describeWeatherCode(999), {
    description: "Weather unavailable",
    icon: "🌡️"
  });
});

test("formatLocationName joins available place parts", () => {
  assert.equal(
    formatLocationName({ name: "Paris", admin1: "Île-de-France", country: "France" }),
    "Paris, Île-de-France, France"
  );
});

test("buildForecastApiUrl requests current and daily forecast fields", () => {
  const url = new URL(buildForecastApiUrl(48.85, 2.35));

  assert.equal(url.origin + url.pathname, "https://api.open-meteo.com/v1/forecast");
  assert.equal(url.searchParams.get("latitude"), "48.85");
  assert.equal(url.searchParams.get("longitude"), "2.35");
  assert.equal(url.searchParams.get("forecast_days"), "5");
  assert.match(url.searchParams.get("current"), /temperature_2m/);
  assert.match(url.searchParams.get("daily"), /temperature_2m_max/);
});

test("weather view models format current and daily data", () => {
  const payload = {
    timezone: "Europe/Paris",
    current: {
      temperature_2m: 21.4,
      apparent_temperature: 19.6,
      relative_humidity_2m: 62,
      wind_speed_10m: 13.2,
      weather_code: 2
    },
    daily: {
      time: ["2026-09-16", "2026-09-17"],
      weather_code: [2, 61],
      temperature_2m_max: [24.4, 22.1],
      temperature_2m_min: [14.3, 12.8]
    }
  };

  assert.deepEqual(buildCurrentWeatherViewModel("Paris, France", payload), {
    locationName: "Paris, France",
    temperature: "21°C",
    feelsLike: "20°C",
    humidity: "62%",
    windSpeed: "13 km/h",
    description: "Partly cloudy",
    icon: "⛅",
    timezone: "Europe/Paris"
  });

  const forecast = buildForecastViewModel(payload);
  assert.equal(forecast.length, 2);
  assert.equal(forecast[0].max, "24°C");
  assert.equal(forecast[1].description, "Slight rain");
});
