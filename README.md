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

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

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
# Run tests
npm run test

# Lint code
npm run lint

# Type check
npm run type-check
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
