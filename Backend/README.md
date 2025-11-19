# Backend Email Service

Backend sử dụng Node.js, Express và Nodemailer để gửi email qua Gmail.

## Cấu hình

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Gmail
Để sử dụng Gmail gửi email, bạn cần:

1. **Bật 2-Step Verification** cho Gmail của bạn
2. **Tạo App Password**:
   - Vào https://myaccount.google.com/security
   - Chọn "2-Step Verification"
   - Cuộn xuống "App passwords"
   - Tạo app password mới cho "Mail"
   - Copy mật khẩu 16 ký tự

3. **Cập nhật file `.env`**:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
PORT=3001
```

## Chạy server

```bash
npm start
```

Server sẽ chạy tại `http://localhost:3001`

## API Endpoints

### 1. Test API
```
GET http://localhost:3001/
```

### 2. Gửi email thông thường
```
POST http://localhost:3001/api/send-email
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Test Email",
  "html": "<h1>Hello</h1><p>This is a test email</p>",
  "text": "Hello, this is a test email"
}
```

### 3. Gửi cảnh báo lũ lụt
```
POST http://localhost:3001/api/send-flood-alert
Content-Type: application/json

{
  "to": "recipient@example.com",
  "alertData": {
    "district": "Hải Châu",
    "level": "Cao",
    "rainfall": "150",
    "time": "17/11/2025 10:30"
  }
}
```

### 4. Gửi cập nhật thời tiết
```
POST http://localhost:3001/api/send-weather-update
Content-Type: application/json

{
  "to": "recipient@example.com",
  "weatherData": {
    "location": "Đà Nẵng",
    "temperature": "28",
    "humidity": "75",
    "rainChance": "60",
    "windSpeed": "15",
    "date": "17/11/2025",
    "description": "Có mưa rào và dông vài nơi"
  }
}
```

## Test với curl hoặc Postman

### Ví dụ với curl:
```bash
curl -X POST http://localhost:3001/api/send-flood-alert -H "Content-Type: application/json" -d "{\"to\":\"test@example.com\",\"alertData\":{\"district\":\"Hải Châu\",\"level\":\"Cao\",\"rainfall\":\"150\"}}"
```

## Tích hợp với Frontend

Từ React frontend, gọi API như sau:

```javascript
// Gửi cảnh báo lũ lụt
const sendFloodAlert = async (email, alertData) => {
  try {
    const response = await fetch('http://localhost:3001/api/send-flood-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        alertData: alertData
      })
    });
    
    const result = await response.json();
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
```

## Lưu ý bảo mật

- **KHÔNG commit file `.env`** lên Git
- Sử dụng App Password, không dùng mật khẩu Gmail thật
- Trong production, nên sử dụng dịch vụ email chuyên nghiệp như SendGrid, AWS SES
