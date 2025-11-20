# 🚀 Quick Start - Personalized Alerts API (Refactored)

## ✅ **Đã Hoàn Thành:**

### **1. Refactored Structure:**
```
Backend/
├── src/
│   ├── controllers/
│   │   └── personalizedAlertController.js  ✅ MỚI
│   ├── routes/
│   │   └── alertRoutes.js                  ✅ CẬP NHẬT
│   ├── services/
│   │   └── personalizedAlertService.js     ✅ CÓ SẴN
│   ├── integrations/
│   │   └── geminiClient.js                 ✅ THÊM METHOD
│   └── index.js                             ✅ CẬP NHẬT
```

### **2. API Endpoints Đã Mount:**

| Method | Endpoint | Controller |
|--------|----------|------------|
| POST | `/api/check-user-locations-alert` | personalizedAlertController |
| GET | `/api/user-locations/:userId` | personalizedAlertController |
| POST | `/api/analyze-weather-alert` | personalizedAlertController |

---

## 🔧 **Setup:**

### **Bước 1: Kiểm tra .env**

```bash
# Backend/.env
OPENWEATHER_API_KEY=your_key
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password
ALERT_EMAIL_RECIPIENTS=recipient@gmail.com
PORT=3001
```

### **Bước 2: Chuẩn bị Firestore**

**Tạo user document:**
```
Firestore Database
└── users/
    └── MgqmfPnodPRCjEhqyfycYavN2cK2/  (Document)
        ├── name: "Nguyễn Văn Minh"
        ├── email: "your-email@gmail.com"
        ├── notifications/
        │   ├── email: true
        │   └── push: true
        └── locations/  (Subcollection)
            └── -OeN97tUohTc0NKK8-Sd/
                ├── name: "nhà"
                ├── address: "nguyễn trí phương"
                ├── coords: {lat: 16.0678, lon: 108.2208}
                ├── alertRadius: 1000
                ├── priority: "high"
                └── status: "safe"
```

### **Bước 3: Start Server**

```powershell
cd Backend
npm start
```

**Expected output:**
```
✅ Gemini AI khởi tạo thành công
✅ Firebase Admin initialized successfully

🚀 Server đang chạy tại http://localhost:3001
📚 API Documentation: http://localhost:3001/
```

---

## 🧪 **Test API:**

### **Test 1: Health Check**

```bash
curl http://localhost:3001/
```

**Expected:**
```json
{
  "message": "🌊 Flood Alert API is running!",
  "version": "2.0.0",
  "endpoints": {
    "checkUserLocations": "POST /api/check-user-locations-alert",
    "getUserLocations": "GET /api/user-locations/:userId",
    "analyzeWeather": "POST /api/analyze-weather-alert"
  }
}
```

---

### **Test 2: Lấy Locations của User**

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/user-locations/MgqmfPnodPRCjEhqyfycYavN2cK2"
```

**Expected Response:**
```json
{
  "success": true,
  "userId": "MgqmfPnodPRCjEhqyfycYavN2cK2",
  "count": 1,
  "locations": [
    {
      "id": "-OeN97tUohTc0NKK8-Sd",
      "name": "nhà",
      "address": "nguyễn trí phương",
      "coords": { "lat": 16.0678, "lon": 108.2208 },
      "alertRadius": 1000,
      "priority": "high",
      "status": "safe"
    }
  ]
}
```

---

### **Test 3: Kiểm Tra + Gửi Cảnh Báo Cá Nhân Hóa**

```powershell
# PowerShell
$body = @{
    userId = "MgqmfPnodPRCjEhqyfycYavN2cK2"
    minRiskLevel = 1
    sendEmail = $true
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3001/api/check-user-locations-alert" `
  -Body $body `
  -ContentType "application/json"
```

**Expected Response (Có Cảnh Báo):**
```json
{
  "success": true,
  "message": "Đã tạo 1 cảnh báo cá nhân hóa",
  "analysis": {
    "userId": "MgqmfPnodPRCjEhqyfycYavN2cK2",
    "user": {
      "name": "Nguyễn Văn Minh",
      "email": "your-email@gmail.com"
    },
    "totalLocations": 1,
    "affectedLocations": 1
  },
  "alerts": [
    {
      "locationName": "nhà",
      "alert": {
        "subject": "🏠 Minh ơi - Cảnh báo ngập gần Nhà",
        "htmlBody": "<p>Xin chào <b>Minh</b>...</p>"
      },
      "emailSent": true,
      "distance": 120,
      "floodRisk": 2
    }
  ]
}
```

**Expected Response (An Toàn):**
```json
{
  "success": true,
  "message": "Tất cả địa điểm của bạn đều an toàn",
  "userId": "MgqmfPnodPRCjEhqyfycYavN2cK2",
  "totalLocations": 1,
  "affectedLocations": 0,
  "alerts": []
}
```

---

### **Test 4: Phân Tích Thời Tiết Theo Tọa Độ**

```powershell
$body = @{
    lat = 16.0678
    lon = 108.2208
    to = "your-email@gmail.com"
    minRiskLevel = 1
    includeAllAreas = $false
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3001/api/analyze-weather-alert" `
  -Body $body `
  -ContentType "application/json"
```

---

## 📊 **Console Logs Mong Đợi:**

```
🚀 Server đang chạy tại http://localhost:3001
📚 API Documentation: http://localhost:3001/

🔍 Đang phân tích địa điểm cho user: MgqmfPnodPRCjEhqyfycYavN2cK2
⚠️ Phát hiện 1/1 địa điểm có nguy cơ ngập
✅ AI tạo cảnh báo cho "nhà": 🏠 Minh ơi - Cảnh báo ngập gần Nhà
✅ Gemini AI tạo cảnh báo thời tiết: 🏠 Minh ơi - Cảnh báo ngập gần Nhà
```

---

## 🔥 **Firestore Updates:**

Sau khi gọi API thành công, check Firestore:

### **1. personalizedAlerts Collection:**
```
users/{userId}/personalizedAlerts/{alertId}
├── locationId: "-OeN97tUohTc0NKK8-Sd"
├── locationName: "nhà"
├── floodAreaName: "Đường Nguyễn Tri Phương"
├── floodRisk: 2
├── riskScore: 68
├── distance: 120
├── emailSent: true
└── createdAt: Timestamp
```

### **2. Updated Location Status:**
```
users/{userId}/locations/{locationId}
├── status: "danger"  ← UPDATED
├── lastAlertTime: "2025-11-20T..."  ← UPDATED
└── updatedAt: Timestamp
```

### **3. Updated Stats:**
```
users/{userId}/stats
├── alertsReceived: 1  ← +1
├── floodReports: 0
└── savedLocationsCount: 1
```

### **4. Activity Log:**
```
users/{userId}/activities/{activityId}
├── type: "alert_received"
├── title: "Cảnh báo ngập tại Đường Nguyễn Tri Phương"
└── timestamp: 1763489537116
```

---

## 🐛 **Troubleshooting:**

### **Lỗi 404 Not Found:**
```
❌ Cannot GET /api/user-locations/...
```
**Fix:** 
- Backend chưa chạy → `npm start`
- Routes chưa mount → Check `src/routes/alertRoutes.js`

---

### **Lỗi 500 "Không tìm thấy user":**
```json
{
  "success": false,
  "error": "Không tìm thấy user"
}
```
**Fix:**
- Tạo user trong Firestore: `users/{userId}` với fields `name`, `email`

---

### **Lỗi "GEMINI_API_KEY chưa được cấu hình":**
```json
{
  "success": false,
  "error": "GEMINI_API_KEY chưa được cấu hình trong backend"
}
```
**Fix:**
- Thêm `GEMINI_API_KEY` vào `Backend/.env`
- Restart server

---

### **Email không gửi được:**
```json
{
  "emailSent": false,
  "error": "Invalid login"
}
```
**Fix:**
- Check `EMAIL_USER` và `EMAIL_PASS` trong `.env`
- Dùng **App Password**, không phải password Gmail thường
- Tạo App Password: https://myaccount.google.com/apppasswords

---

## 📚 **Code Structure:**

### **Controller (MVC):**
```javascript
// src/controllers/personalizedAlertController.js
class PersonalizedAlertController {
  async checkUserLocationsAlert(req, res) {
    // 1. Get userId from request
    // 2. Call service to analyze
    // 3. Call Gemini AI
    // 4. Send emails
    // 5. Save logs
    // 6. Return response
  }
}
```

### **Service (Business Logic):**
```javascript
// src/services/personalizedAlertService.js
class PersonalizedAlertService {
  async analyzeUserLocations(userId, minRiskLevel) {
    // 1. Get user from Firestore
    // 2. Get all locations
    // 3. Check flood risk for each
    // 4. Return analysis
  }
}
```

### **Integration (External API):**
```javascript
// src/integrations/geminiClient.js
class GeminiClient {
  async generateStructuredContent(prompt, schema) {
    // Call Gemini AI with JSON schema
  }
}
```

---

## ✅ **Checklist:**

- [ ] Backend running (`npm start`)
- [ ] `.env` có đầy đủ keys
- [ ] User tồn tại trong Firestore
- [ ] Locations đã được thêm
- [ ] Test GET `/api/user-locations/:userId` → 200 OK
- [ ] Test POST `/api/check-user-locations-alert` → 200 OK
- [ ] Check email inbox → Nhận được email
- [ ] Check Firestore → Có logs mới

---

## 🎯 **Next Steps:**

1. ✅ Tích hợp vào Frontend (gọi API từ React)
2. ✅ Setup Cron job (kiểm tra định kỳ)
3. ✅ Add Telegram notifications
4. ✅ Add Push notifications (FCM)
5. ✅ Analytics & monitoring

---

**🚀 API đã sẵn sàng! Hãy test với Postman hoặc cURL!**

