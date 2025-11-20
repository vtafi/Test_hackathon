# 🏗️ Backend Refactor Summary

## 📅 Refactored Date: November 20, 2025

## 🎯 Mục Đích
Tái cấu trúc Backend theo kiến trúc MVC (Model-View-Controller) rõ ràng hơn, dễ bảo trì và mở rộng.

---

## 📂 Cấu Trúc Mới

```
Backend/
├── src/
│   ├── index.js                    # 🚀 Entrypoint chính
│   │
│   ├── configs/                    # ⚙️ Configuration
│   │   ├── index.js               # Config loader & validation
│   │   └── firebase.js            # Firebase config (legacy)
│   │
│   ├── controllers/                # 🎮 Controllers (xử lý request/response)
│   │   ├── alertController.js     # Email & AI alert handlers
│   │   └── firebaseController.js  # Firebase data handlers
│   │
│   ├── routes/                     # 🛣️ API Routes
│   │   ├── index.js               # Route aggregator
│   │   ├── alertRoutes.js         # /api/send-email, /api/generate-flood-alert
│   │   └── firebaseRoutes.js      # /api/firebase/sensors
│   │
│   ├── services/                   # 🧠 Business Logic
│   │   ├── weatherService.js      # OpenWeather API integration
│   │   ├── floodPredictionService.js  # Flood prediction algorithms
│   │   └── personalizedAlertService.js  # User-specific alerts
│   │
│   ├── integrations/               # 🔌 Third-party Integrations
│   │   ├── firebaseClient.js      # Firebase Admin wrapper (NEW)
│   │   ├── geminiClient.js        # Gemini AI wrapper (NEW)
│   │   ├── openWeatherClient.js   # OpenWeather API wrapper (NEW)
│   │   ├── firebaseAdmin.js       # Legacy Firebase integration
│   │   ├── firebaseRealtimeManager.js  # Realtime DB manager
│   │   ├── firestoreManager.js    # Firestore manager
│   │   ├── simpleFirebase.js      # Simple Firebase helper
│   │   ├── telegramAlertTrigger.js     # Telegram alert sender
│   │   ├── telegramAlertTriggerSimple.js
│   │   ├── telegramBotListener.js      # Telegram bot listener
│   │   ├── telegramBotListenerSimple.js
│   │   └── telegramFirebaseConfig.js   # Telegram Firebase config
│   │
│   ├── email/                      # 📧 Email System
│   │   ├── emailService.js        # Nodemailer wrapper (NEW)
│   │   ├── templates.js           # Email templates (NEW)
│   │   └── emailService.js.old    # Legacy email service
│   │
│   ├── iot/                        # 🔧 IoT Listeners
│   │   └── iotListener.js         # Firebase IoT sensor listener (NEW)
│   │
│   ├── utils/                      # 🛠️ Utilities
│   │   ├── middleware.js          # Express middleware (NEW)
│   │   └── firebaseHelper.js      # Firebase helper functions (NEW)
│   │
│   ├── scripts/                    # 📜 Scripts & Tests
│   │   ├── checkSetup.js          # Environment setup checker
│   │   ├── mockFloodAlert.js      # Mock flood alert generator
│   │   ├── sendDirectAlert.js     # Direct alert sender
│   │   └── testAlert.js           # Alert testing script
│   │
│   └── legacy/                     # 🗄️ Legacy Files (for reference)
│       └── server.js              # Old server entry point
│
├── docs/                           # 📚 Documentation
│   ├── FIREBASE_SETUP_GUIDE.md
│   ├── IOT_GUIDE.md
│   ├── PERSONALIZED_ALERT_API.md
│   ├── POSTMAN_GUIDE.md
│   ├── QUICK_TEST.md
│   ├── TELEGRAM_BOT_DEPLOYMENT_GUIDE.md
│   ├── TELEGRAM_BOT_QUICK_REF.md
│   ├── WEATHER_ANALYSIS_GUIDE.md
│   ├── DOWNLOAD_KEY_NOW.txt
│   ├── GET_FIREBASE_KEY.txt
│   ├── Personalized_Alert_API.postman_collection.json
│   ├── Postman_Collection.json
│   └── test-api.http
│
├── .env                            # 🔐 Environment variables
├── .env.example                    # 📝 Environment template
├── .gitignore                      # 🚫 Git ignore rules
├── package.json                    # 📦 Dependencies
├── README.md                       # 📖 Main documentation
└── REFACTOR_SUMMARY.md             # 📋 This file

```

---

## 🔄 Migration Guide

### **Thay Đổi Chính**

#### 1. **Entry Point**
```bash
# Trước
node server.js

# Sau
node src/index.js
# hoặc
npm start
```

#### 2. **Import Paths**
```javascript
// Trước (root level)
const emailService = require('./emailService');

// Sau (trong src/)
const emailService = require('../email/emailService');
```

#### 3. **Package.json Scripts**
```json
{
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "setup": "node src/scripts/checkSetup.js"
  }
}
```

---

## 🆕 New Features

### **1. Modular Integrations**
Tất cả third-party integrations được wrap trong `src/integrations/`:
- `firebaseClient.js` - Centralized Firebase operations
- `geminiClient.js` - AI alert generation
- `openWeatherClient.js` - Weather data fetching

### **2. MVC Architecture**
- **Controllers**: Xử lý HTTP requests/responses
- **Services**: Business logic
- **Routes**: API endpoint definitions

### **3. Centralized Config**
`src/configs/index.js` quản lý tất cả environment variables và validation.

### **4. Email Templates**
Email templates được tách riêng trong `src/email/templates.js`, dễ customize.

---

## 📡 API Endpoints (Unchanged)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check & API documentation |
| POST | `/api/send-email` | Send custom email |
| POST | `/api/send-test-email` | Send test email |
| POST | `/api/send-flood-alert` | Send flood alert |
| POST | `/api/send-weather-update` | Send weather update |
| POST | `/api/generate-flood-alert` | Generate AI flood alert |
| POST | `/api/check-firebase-and-alert` | Check Firebase & send alert |
| POST | `/api/check-iot-data` | Check IoT data |
| GET | `/api/firebase/sensors` | Get all sensors |
| GET | `/api/firebase/sensors/:id` | Get sensor by ID |

---

## 🚀 Quick Start

### **1. Cài đặt dependencies**
```bash
cd Backend
npm install
```

### **2. Cấu hình .env**
```env
PORT=3001
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@floodalert.com

GEMINI_API_KEY=your-gemini-key
OPENWEATHER_API_KEY=your-openweather-key

FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

ENABLE_FIREBASE_LISTENER=true
FIREBASE_DB_TYPE=realtime
ALERT_EMAIL_RECIPIENTS=admin@example.com,alert@example.com
```

### **3. Kiểm tra setup**
```bash
npm run setup
```

### **4. Start server**
```bash
npm start
# hoặc dev mode với nodemon
npm run dev
```

### **5. Test API**
```bash
curl http://localhost:3001/

# Test email
curl -X POST http://localhost:3001/api/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@gmail.com"}'
```

---

## 🔧 Development Tips

### **Thêm Route Mới**
1. Tạo controller trong `src/controllers/`
2. Tạo route trong `src/routes/`
3. Import và mount route trong `src/routes/index.js`

### **Thêm Integration Mới**
1. Tạo client wrapper trong `src/integrations/`
2. Export singleton instance
3. Sử dụng trong controllers/services

### **Tạo Email Template Mới**
1. Thêm static method trong `src/email/templates.js`
2. Thêm method wrapper trong `src/email/emailService.js`

---

## 📊 Benefits

✅ **Better Organization**: Code được chia theo chức năng rõ ràng  
✅ **Easier Testing**: Mỗi module có thể test độc lập  
✅ **Scalability**: Dễ thêm features mới  
✅ **Maintainability**: Dễ tìm và fix bugs  
✅ **Reusability**: Integration clients có thể reuse  
✅ **Type Safety**: Rõ ràng về input/output của mỗi function  

---

## ⚠️ Breaking Changes

### **Deprecated Files**
Các file sau không còn được sử dụng (giữ lại để tham khảo):
- `server.js` → `src/index.js`
- `emailService.js` → `src/email/emailService.js`
- `simpleFirebase.js` → `src/utils/firebaseHelper.js`
- `firebaseAdmin.js` → `src/integrations/firebaseClient.js`

### **Import Changes**
Nếu bạn có code bên ngoài Backend import các module, cần update:
```javascript
// Trước
const emailService = require('./Backend/emailService');

// Sau
const emailService = require('./Backend/src/email/emailService');
```

---

## 🐛 Troubleshooting

### **Error: Cannot find module '../email/emailService'**
→ Đảm bảo đang chạy từ root của Backend: `node src/index.js`

### **Error: EMAIL_USER chưa được cấu hình**
→ Kiểm tra file `.env` có đầy đủ biến môi trường

### **Firebase Listener failed**
→ Set `ENABLE_FIREBASE_LISTENER=false` nếu không cần tính năng này

---

## 📝 TODO - Future Improvements

- [ ] Add unit tests với Jest/Mocha
- [ ] Add TypeScript support
- [ ] Add request validation với Joi/Yup
- [ ] Add rate limiting
- [ ] Add API documentation với Swagger
- [ ] Add logging với Winston
- [ ] Add monitoring với PM2
- [ ] Dockerize application

---

## 👥 Contributors

Refactored by: GitHub Copilot  
Date: November 20, 2025  
Version: 2.0.0

---

## 📞 Support

Nếu gặp vấn đề, check:
1. `.env` file đã đúng chưa
2. `npm install` đã chạy chưa
3. Port 3001 có bị conflict không
4. Firebase credentials có hợp lệ không

For more help, xem các guide files:
- `WEATHER_ANALYSIS_GUIDE.md` - Chi tiết về phân tích thời tiết
- `FIREBASE_SETUP_GUIDE.md` - Setup Firebase
- `IOT_GUIDE.md` - IoT integration guide
