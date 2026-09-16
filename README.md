# PrivateLifeTracker

A **100% Private & Secure** personal tracking application. All your data stays encrypted on your device. No cloud sharing. No third-party access. Complete control.

## 🔒 Security Features

- **End-to-End Encryption**: AES-256 encryption for all data
- **Local Storage First**: Data stored locally on your device
- **Zero External APIs**: No data leaves your device without your consent
- **No Location Tracking**: Complete privacy
- **Self-Hosted Option**: Run your own backend if needed
- **Open Source**: Full transparency on how your data is handled

## 📊 Features

### Tracking Capabilities
- **Health Metrics**: Steps, calories, sleep, heart rate, weight
- **Productivity**: Tasks, time tracking, focus sessions, habits
- **Finances**: Income, expenses, budgets, investments
- **Mood & Mental Health**: Daily mood, stress levels, notes
- **Fitness**: Workouts, exercises, progress tracking
- **Custom Metrics**: Add your own tracking categories

### Dashboard & Analytics
- Real-time visualizations
- Trends and insights
- Monthly/yearly reports
- Custom date ranges
- Data export (CSV, JSON)

### Weather Dashboard
- Search for a city and load current weather with a 5-day outlook
- Use browser geolocation to check local conditions without creating an account
- Powered by the privacy-friendly Open-Meteo API with no API key required
- Displays temperature, feels-like temperature, humidity, wind speed, and weather conditions

### Privacy Controls
- Encryption settings
- Backup management
- Data deletion options
- Access logs
- Device management

## 🏗️ Architecture

```
PrivateLifeTracker/
├── frontend/          # React + TypeScript (Vite)
├── backend/           # Node.js/Express (Optional, self-hosted)
├── encryption/        # Crypto utilities
├── docs/              # Security & setup documentation
└── tests/             # Unit & integration tests
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nirajmallik143-hub/PrivateLifeTracker.git
cd PrivateLifeTracker

# Serve the static dashboard locally
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Weather Dashboard Notes

- No environment variables are required.
- Weather data is fetched directly in the browser from Open-Meteo only when you search for a city or choose to use geolocation.
- Search terms are not persisted by the app and no analytics or third-party tracking is included.

## 📱 Supported Platforms

- ✅ Web (Any modern browser)
- ✅ Desktop (Electron - coming soon)
- ✅ Mobile (React Native - coming soon)

## 🔐 Data Privacy

Your data:
- Is encrypted using AES-256 encryption
- Never leaves your device (unless you choose self-hosted backend)
- Is never sold, shared, or analyzed by third parties
- Can be deleted completely at any time
- Remains under your complete control

## 📚 Documentation

- [Security Architecture](./docs/SECURITY.md)
- [Setup Guide](./docs/SETUP.md)
- [API Documentation](./docs/API.md)
- [Encryption Details](./docs/ENCRYPTION.md)

## 🛠️ Development

```bash
# Run the weather dashboard tests
node --test tests/weather.test.mjs
```

## 📄 License

MIT - Free to use and modify

## ⚠️ Disclaimer

This is your personal application. While we follow security best practices, ensure you:
- Keep your encryption keys safe
- Regularly back up your data
- Keep dependencies updated
- Run security audits periodically

---

**Built with privacy in mind. Your data, your control.** 🔒
