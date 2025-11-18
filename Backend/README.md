# 🌊 Backend - Hệ Thống Cảnh Báo Ngập Lụt với AI

Backend API cho hệ thống cảnh báo thời tiết và ngập lụt, tích hợp **Gemini AI** để tạo email cảnh báo thông minh và **Firebase** để lắng nghe dữ liệu IoT realtime.

---

## ✨ Tính Năng

### 1. 📧 Email Service

- Gửi email thông thường
- Gửi email test nhanh
- Gửi cảnh báo lũ lụt (template có sẵn)
- Gửi cập nhật thời tiết

### 2. 🤖 Gemini AI Integration

- **API Endpoint:** `/api/generate-flood-alert`
- Nhận dữ liệu cảm biến (mức ngập, vị trí, thời gian)
- AI phân tích và tạo email cảnh báo tự động
- Ngôn ngữ tự nhiên, cấu trúc rõ ràng

### 3. 🔥 Firebase IoT Listener (Tự động)

- Lắng nghe dữ liệu từ Firebase Realtime Database hoặc Firestore
- Khi phát hiện ngập lụt nguy hiểm (≥80%), tự động:
  - Gọi Gemini AI tạo cảnh báo
  - Gửi email cho danh sách người dùng
  - Lưu log vào Firebase

---

## 🚀 Cài Đặt

### 1. Clone và Cài Dependencies

```bash
cd Backend
npm install
```

### 2. Cấu Hình Environment Variables

```bash
cp .env.example .env
```

Sau đó mở `.env` và điền thông tin:

#### **A. Email Configuration (Gmail)**

1. Bật 2-Step Verification: https://myaccount.google.com/security
2. Tạo App Password: https://myaccount.google.com/apppasswords
3. Điền vào `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM="Hệ thống Cảnh báo <your-email@gmail.com>"
```

#### **B. Gemini AI Configuration**

1. Lấy API Key: https://aistudio.google.com/app/apikey
2. Điền vào `.env`:

```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
```

#### **C. Firebase Configuration (IoT Listener)**

1. Vào Firebase Console: https://console.firebase.google.com
2. Chọn project: `hackathon-weather-634bf`
3. **Project Settings > Service Accounts > Generate new private key**
4. Tải file JSON và đặt vào thư mục Backend (ví dụ: `serviceAccountKey.json`)
5. Điền vào `.env`:

```env
ENABLE_FIREBASE_LISTENER=true
FIREBASE_DB_TYPE=realtime
FIREBASE_DATABASE_URL=https://hackathon-weather-634bf-default-rtdb.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
ALERT_EMAIL_RECIPIENTS=admin@example.com,user@example.com
```

---

## 🏃 Chạy Server

```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3001**

---

## 📡 API Endpoints

### 1. Test API

```bash
GET http://localhost:3001/
```

### 2. Gửi Email Thông Thường

```bash
POST http://localhost:3001/api/send-email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Test Email",
  "html": "<h1>Hello World</h1>",
  "text": "Hello World"
}
```

### 3. Gửi Email Test Nhanh

```bash
POST http://localhost:3001/api/send-test-email
Content-Type: application/json

{
  "to": "user@example.com"
}
```

### 4. 🤖 **Tạo Cảnh Báo Bằng Gemini AI** (Endpoint Mới)

```bash
POST http://localhost:3001/api/generate-flood-alert
Content-Type: application/json

{
  "current_percent": 85,
  "previous_percent": 50,
  "location": "Cống Phan Đình Phùng, Đà Nẵng",
  "timestamp": "2025-11-19T01:42:00",
  "to": "admin@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "AI alert generated and email sent successfully",
  "alert": {
    "subject": "⚠️ CẢNH BÁO KHẨN CẤP: NGẬP LỤT CAO TẠI CỐNG PHAN ĐÌNH PHÙNG",
    "htmlBody": "<b>Mức ngập hiện tại: 85%</b><br>Tốc độ tăng: Nhanh...<ul><li>Di dời tài sản</li><li>Tránh khu vực</li></ul>"
  },
  "emailResult": {
    "success": true,
    "messageId": "xxx"
  }
}
```

### 5. Gửi Cảnh Báo Lũ Lụt (Template Có Sẵn)

```bash
POST http://localhost:3001/api/send-flood-alert
Content-Type: application/json

{
  "to": "user@example.com",
  "alertData": {
    "district": "Hải Châu, Đà Nẵng",
    "level": "Cao",
    "rainfall": "150",
    "time": "2025-11-19 14:30"
  }
}
```

---

## 🔥 Firebase IoT Integration

### Cấu Trúc Dữ Liệu (Firebase Realtime Database)

```json
{
  "sensors": {
    "flood": {
      "sensor_001": {
        "location": "Cống Phan Đình Phùng",
        "current_percent": 85,
        "previous_percent": 50,
        "timestamp": "2025-11-19T01:42:00"
      },
      "sensor_002": {
        "location": "Cầu Rồng",
        "current_percent": 65,
        "previous_percent": 60,
        "timestamp": "2025-11-19T01:43:00"
      }
    }
  }
}
```

### Cấu Trúc Dữ Liệu (Firestore)

**Collection:** `flood_sensors`

**Document ID:** `sensor_001`

```json
{
  "location": "Cống Phan Đình Phùng",
  "current_percent": 85,
  "previous_percent": 50,
  "timestamp": "2025-11-19T01:42:00"
}
```

### Khi IoT Device Gửi Dữ Liệu

```javascript
// ESP32/Arduino code (ví dụ)
firebase.setFloat("/sensors/flood/sensor_001/current_percent", waterLevel);
firebase.setString("/sensors/flood/sensor_001/location", "Cống ABC");
firebase.setString("/sensors/flood/sensor_001/timestamp", getCurrentTime());
```

**Backend sẽ tự động:**

1. ✅ Phát hiện `current_percent >= 80%`
2. ✅ Gọi Gemini AI tạo email cảnh báo
3. ✅ Gửi email cho tất cả người dùng trong `ALERT_EMAIL_RECIPIENTS`
4. ✅ Lưu log vào Firebase `/alerts/`

---

## 🧪 Test API với Postman/cURL

### Test Gemini AI Alert

```bash
curl -X POST http://localhost:3001/api/generate-flood-alert \
  -H "Content-Type: application/json" \
  -d '{
    "current_percent": 90,
    "previous_percent": 60,
    "location": "Cống Phan Đình Phùng",
    "timestamp": "2025-11-19T02:00:00",
    "to": "your-email@gmail.com"
  }'
```

---

## 📂 Cấu Trúc Thư Mục

```
Backend/
├── server.js              # Main Express server + API routes
├── emailService.js        # Email functions (Nodemailer)
├── firebaseAdmin.js       # Firebase IoT Listener + Gemini AI
├── package.json           # Dependencies
├── .env                   # Environment variables (KHÔNG commit!)
├── .env.example           # Template .env
├── README.md              # Hướng dẫn này
└── serviceAccountKey.json # Firebase Service Account (KHÔNG commit!)
```

---

## 🔐 Bảo Mật

**QUAN TRỌNG:** Đừng commit những file này lên Git!

- `.env`
- `serviceAccountKey.json`

Thêm vào `.gitignore`:

```
.env
serviceAccountKey.json
node_modules/
```

---

## 🐛 Troubleshooting

### 1. Lỗi "Invalid login: 535-5.7.8"

→ Chưa bật App Password cho Gmail. Làm theo hướng dẫn phần "Email Configuration"

### 2. Lỗi "GEMINI_API_KEY not configured"

→ Chưa thêm `GEMINI_API_KEY` vào `.env`

### 3. Lỗi "Firebase Admin initialization failed"

→ Kiểm tra:

- `FIREBASE_DATABASE_URL` đúng chưa
- File `serviceAccountKey.json` có tồn tại không
- Firebase project có bật Realtime Database/Firestore chưa

### 4. Firebase Listener không hoạt động

→ Đảm bảo `ENABLE_FIREBASE_LISTENER=true` trong `.env`

---

## 📞 Support

- **Project:** Hackathon Weather Alert System
- **Email:** [Your Team Email]
- **Firebase Project:** hackathon-weather-634bf

---

## 🎯 Next Steps

1. ✅ Cấu hình `.env`
2. ✅ Test API endpoints
3. ✅ Kết nối IoT devices với Firebase
4. ✅ Kiểm tra Firebase Listener
5. ✅ Deploy lên production (Railway, Render, Google Cloud Run)

---

**Made with ❤️ by Hackathon WAI Team**
