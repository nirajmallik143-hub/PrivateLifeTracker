const WEATHER_CODE_MAP = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Foggy", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌦️" },
  53: { description: "Moderate drizzle", icon: "🌦️" },
  55: { description: "Dense drizzle", icon: "🌧️" },
  56: { description: "Light freezing drizzle", icon: "🌧️" },
  57: { description: "Dense freezing drizzle", icon: "🌧️" },
  61: { description: "Slight rain", icon: "🌦️" },
  63: { description: "Moderate rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️" },
  66: { description: "Light freezing rain", icon: "🌧️" },
  67: { description: "Heavy freezing rain", icon: "🌧️" },
  71: { description: "Slight snow fall", icon: "🌨️" },
  73: { description: "Moderate snow fall", icon: "🌨️" },
  75: { description: "Heavy snow fall", icon: "❄️" },
  77: { description: "Snow grains", icon: "🌨️" },
  80: { description: "Slight rain showers", icon: "🌦️" },
  81: { description: "Moderate rain showers", icon: "🌧️" },
  82: { description: "Violent rain showers", icon: "⛈️" },
  85: { description: "Slight snow showers", icon: "🌨️" },
  86: { description: "Heavy snow showers", icon: "❄️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
  96: { description: "Thunderstorm with hail", icon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️" }
};

const WEATHER_API_BASE = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_GEOCODING_API_BASE = "https://geocoding-api.open-meteo.com/v1/reverse";

const formatTemperature = (value) => `${Math.round(value)}°C`;
const formatWindSpeed = (value) => `${Math.round(value)} km/h`;
const formatHumidity = (value) => `${Math.round(value)}%`;

export function describeWeatherCode(code) {
  return WEATHER_CODE_MAP[code] ?? { description: "Weather unavailable", icon: "🌡️" };
}

export function formatLocationName(result) {
  return [result.name, result.admin1, result.country].filter(Boolean).join(", ");
}

export function buildForecastApiUrl(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code"
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min"
    ].join(","),
    timezone: "auto",
    forecast_days: "5"
  });

  return `${WEATHER_API_BASE}?${params.toString()}`;
}

export function buildCurrentWeatherViewModel(locationName, payload) {
  const currentWeather = describeWeatherCode(payload.current.weather_code);

  return {
    locationName,
    temperature: formatTemperature(payload.current.temperature_2m),
    feelsLike: formatTemperature(payload.current.apparent_temperature),
    humidity: formatHumidity(payload.current.relative_humidity_2m),
    windSpeed: formatWindSpeed(payload.current.wind_speed_10m),
    description: currentWeather.description,
    icon: currentWeather.icon,
    timezone: payload.timezone
  };
}

export function buildForecastViewModel(payload) {
  return payload.daily.time.map((date, index) => {
    const summary = describeWeatherCode(payload.daily.weather_code[index]);
    return {
      date,
      label: new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric"
      }),
      min: formatTemperature(payload.daily.temperature_2m_min[index]),
      max: formatTemperature(payload.daily.temperature_2m_max[index]),
      description: summary.description,
      icon: summary.icon
    };
  });
}

async function fetchJson(url, errorMessage) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}

async function fetchWeatherByCoordinates(latitude, longitude) {
  return fetchJson(
    buildForecastApiUrl(latitude, longitude),
    "Unable to load weather data right now. Please try again."
  );
}

async function findCity(query) {
  const params = new URLSearchParams({
    name: query.trim(),
    count: "1",
    language: "en",
    format: "json"
  });

  const payload = await fetchJson(
    `${GEOCODING_API_BASE}?${params.toString()}`,
    "Unable to search for that city right now. Please try again."
  );

  if (!payload.results?.length) {
    throw new Error("We could not find that city. Please check the spelling and try again.");
  }

  return payload.results[0];
}

async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    language: "en",
    format: "json"
  });

  const payload = await fetchJson(
    `${REVERSE_GEOCODING_API_BASE}?${params.toString()}`,
    "Unable to identify your current location."
  );

  return payload.results?.[0]
    ? formatLocationName(payload.results[0])
    : `Lat ${latitude.toFixed(2)}, Lon ${longitude.toFixed(2)}`;
}

function createForecastCard(day) {
  const card = document.createElement("article");
  card.className = "forecast-card";
  card.innerHTML = `
    <div class="weather-symbol" aria-hidden="true">${day.icon}</div>
    <div>
      <strong>${day.label}</strong>
      <p>${day.description}</p>
    </div>
    <div class="forecast-range">
      <strong>${day.max}</strong>
      <p>${day.min}</p>
    </div>
  `;
  return card;
}

function createDomBindings() {
  if (typeof document === "undefined") {
    return null;
  }

  return {
    form: document.querySelector("#weather-form"),
    cityInput: document.querySelector("#city-input"),
    locationButton: document.querySelector("#location-button"),
    statusPanel: document.querySelector("#weather-status"),
    results: document.querySelector("#weather-results"),
    locationLabel: document.querySelector("#weather-location-label"),
    location: document.querySelector("#weather-location"),
    icon: document.querySelector("#weather-icon"),
    temperature: document.querySelector("#weather-temperature"),
    description: document.querySelector("#weather-description"),
    feelsLike: document.querySelector("#weather-feels-like"),
    humidity: document.querySelector("#weather-humidity"),
    wind: document.querySelector("#weather-wind"),
    updated: document.querySelector("#weather-updated"),
    forecastList: document.querySelector("#forecast-list")
  };
}

function setStatus(dom, message, variant = "idle") {
  dom.statusPanel.className = `panel status-panel${variant === "idle" ? "" : ` ${variant}`}`;
  dom.statusPanel.innerHTML = `<p>${message}</p>`;
}

function renderWeather(dom, current, forecast) {
  dom.locationLabel.textContent = current.timezone;
  dom.location.textContent = current.locationName;
  dom.icon.textContent = current.icon;
  dom.temperature.textContent = current.temperature;
  dom.description.textContent = current.description;
  dom.feelsLike.textContent = current.feelsLike;
  dom.humidity.textContent = current.humidity;
  dom.wind.textContent = current.windSpeed;
  dom.updated.textContent = "Powered by Open-Meteo";
  dom.forecastList.replaceChildren(...forecast.map(createForecastCard));
  dom.results.classList.remove("hidden");
}

async function loadWeather(dom, loader) {
  setStatus(dom, "Loading weather details…", "loading");
  dom.results.classList.add("hidden");

  try {
    const { locationName, forecastPayload } = await loader();
    const current = buildCurrentWeatherViewModel(locationName, forecastPayload);
    const forecast = buildForecastViewModel(forecastPayload);
    renderWeather(dom, current, forecast);
    setStatus(dom, `Showing weather for ${locationName}.`);
  } catch (error) {
    setStatus(dom, error.message || "Something went wrong while loading weather data.", "error");
  }
}

function initWeatherDashboard() {
  const dom = createDomBindings();

  if (!dom?.form || !dom.cityInput || !dom.locationButton) {
    return;
  }

  dom.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = dom.cityInput.value.trim();

    if (!query) {
      setStatus(dom, "Enter a city name to search for weather updates.", "error");
      dom.results.classList.add("hidden");
      return;
    }

    await loadWeather(dom, async () => {
      const city = await findCity(query);
      const forecastPayload = await fetchWeatherByCoordinates(city.latitude, city.longitude);
      return {
        locationName: formatLocationName(city),
        forecastPayload
      };
    });
  });

  dom.locationButton.addEventListener("click", async () => {
    if (!navigator.geolocation) {
      setStatus(dom, "Geolocation is not supported by this browser.", "error");
      return;
    }

    await loadWeather(dom, () =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            try {
              const [locationName, forecastPayload] = await Promise.all([
                reverseGeocode(coords.latitude, coords.longitude),
                fetchWeatherByCoordinates(coords.latitude, coords.longitude)
              ]);
              resolve({ locationName, forecastPayload });
            } catch (error) {
              reject(error);
            }
          },
          () => reject(new Error("Location access was denied. Search for a city instead.")),
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
      })
    );
  });
}

if (typeof document !== "undefined") {
  initWeatherDashboard();
}
