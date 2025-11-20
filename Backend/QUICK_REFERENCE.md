# 🚀 Quick Reference - Backend Refactored

## 📁 Cấu Trúc Mới (Nhanh)

```
Backend/
├── src/              # Source code chính
│   ├── index.js      # Entry point
│   ├── controllers/  # Request handlers
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── integrations/ # Firebase, Gemini, OpenWeather, Telegram
│   ├── email/        # Email service & templates
│   ├── iot/          # IoT listeners
│   ├── configs/      # Config files
│   ├── utils/        # Helpers
│   ├── scripts/      # Test/mock scripts
│   └── legacy/       # Old files (reference only)
├── docs/             # All documentation
├── .env              # Environment variables
└── package.json      # Dependencies
```

## ⚡ Commands

```bash
# Start server
npm start

# Dev mode (auto-reload)
npm run dev

# Check setup
npm run setup
```

## 🔧 Import Examples

### Từ Bên Ngoài Backend

```javascript
// Old
const emailService = require("./Backend/emailService");

// New
const { emailService } = require("./Backend");
// or
const emailService = require("./Backend/src/email/emailService");
```

### Trong Backend/src

```javascript
// Controller importing service
const emailService = require("../email/emailService");
const geminiClient = require("../integrations/geminiClient");

// Service importing integration
const firebaseClient = require("../integrations/firebaseClient");
```

## 📡 API Endpoints (Unchanged)

| Endpoint                        | Method | Description    |
| ------------------------------- | ------ | -------------- |
| `/`                             | GET    | Health check   |
| `/api/send-test-email`          | POST   | Test email     |
| `/api/generate-flood-alert`     | POST   | AI alert       |
| `/api/check-firebase-and-alert` | POST   | Check Firebase |
| `/api/firebase/sensors`         | GET    | Get sensors    |

## 🔑 Environment Variables

```env
PORT=3001
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
GEMINI_API_KEY=your-key
OPENWEATHER_API_KEY=your-key
FIREBASE_SERVICE_ACCOUNT_KEY={...}
FIREBASE_DATABASE_URL=https://...
ENABLE_FIREBASE_LISTENER=false
```

## 📚 Documentation Files

- `README.md` - Main docs
- `REFACTOR_SUMMARY.md` - Detailed refactor guide
- `docs/WEATHER_ANALYSIS_GUIDE.md` - Weather analysis
- `docs/FIREBASE_SETUP_GUIDE.md` - Firebase setup
- `docs/IOT_GUIDE.md` - IoT integration

## 🆘 Quick Troubleshooting

**Server won't start:**

```bash
# Check setup
npm run setup

# Verify .env
cat .env

# Install dependencies
npm install
```

**Import errors:**

- Ensure you're using correct relative paths
- Check if file exists in new location
- See `REFACTOR_SUMMARY.md` for file mapping

**Firebase errors:**

- Set `ENABLE_FIREBASE_LISTENER=false` if not using
- Check Firebase credentials in `.env`

## 🎯 What Changed?

| Old                | New                                  |
| ------------------ | ------------------------------------ |
| `server.js`        | `src/index.js`                       |
| `emailService.js`  | `src/email/emailService.js`          |
| `firebaseAdmin.js` | `src/integrations/firebaseClient.js` |
| Root files         | `src/` + `docs/`                     |

## ✅ Migration Checklist

- [x] Backup created (`Backend_backup_...`)
- [x] New structure created in `src/`
- [x] All files moved to appropriate folders
- [x] Documentation organized in `docs/`
- [x] `package.json` updated
- [x] `.env.example` created
- [x] README updated

## 🔗 Related Files

- `package.json` - See `"main": "src/index.js"`
- `.gitignore` - Updated ignore patterns
- `index.js` - Module exports

---

**Version:** 2.0.0  
**Date:** November 20, 2025
