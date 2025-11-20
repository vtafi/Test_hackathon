# 📱 Hướng Dẫn QR Code Telegram Bot

## 🎯 Tính năng

Người dùng có thể quét mã QR để truy cập trực tiếp vào Telegram Bot **@AquarouteAI_bot** mà không cần tìm kiếm tên bot.

---

## 🚀 Cách sử dụng

### **Trên Web App:**

1. **Đăng nhập** vào hệ thống
2. Click vào **Avatar** ở góc trên bên phải
3. Chọn **"QR Code Telegram Bot"** từ menu dropdown
4. Modal hiển thị QR Code sẽ xuất hiện

### **Trên điện thoại:**

1. Mở app **Telegram** trên điện thoại
2. Nhấn vào biểu tượng **tìm kiếm** 🔍
3. Nhấn vào biểu tượng **QR Code** 📷 (góc trên bên phải)
4. **Quét mã QR** từ màn hình web
5. Bot sẽ tự động mở trong Telegram
6. Nhấn **"START"** để bắt đầu nhận cảnh báo

---

## 📂 Cấu trúc Code

### **Backend API** (`Backend/`)

#### 1. **Controller** - `src/controllers/telegramQRController.js`
```javascript
// API endpoints:
// GET /api/telegram/qr-info - Lấy thông tin QR code
// GET /api/telegram/info - Lấy thông tin bot
```

**Chức năng:**
- Tạo deep link: `https://t.me/AquarouteAI_bot?start=<user_id>`
- Trả về thông tin bot: username, first_name, photo
- Generate QR data với format chuẩn

#### 2. **Routes** - `src/routes/telegramRoutes.js`
```javascript
router.get('/qr-info', getTelegramQRInfo);
router.get('/info', getBotInfo);
```

#### 3. **API Integration** - `src/routes/index.js`
```javascript
router.use('/telegram', telegramRoutes);
```

---

### **Frontend** (`Hackathon-Project/`)

#### 1. **API Client** - `src/api/telegramApi.js`
```javascript
export const getTelegramQRInfo = async (userId, email) => { ... }
export const getBotInfo = async () => { ... }
```

**Features:**
- Fetch QR info từ backend
- Fetch bot information
- Error handling

#### 2. **Component** - `src/components/TelegramQRCode.js`
```javascript
<TelegramQRCode showModal={true} onClose={() => {}} />
```

**Props:**
- `showModal`: Boolean - Hiển thị/ẩn modal
- `onClose`: Function - Callback khi đóng modal

**Features:**
- Hiển thị QR code với QRCodeSVG
- Hiển thị thông tin bot
- Copy link, download QR
- Loading & error states
- Responsive design

#### 3. **Navigation** - `src/components/TopNavigation.js`
```javascript
// Menu item
<button onClick={() => handleMenuClick('qrcode')}>
  <QrCode size={18} />
  <span>QR Code Telegram Bot</span>
</button>
```

#### 4. **Styling** - `src/components/TelegramQRCode.css`
- Modern glassmorphism design
- Telegram brand colors (#0088cc, #2AABEE)
- Smooth animations
- Mobile responsive

---

## 🔧 Dependencies

### **Backend:**
```json
{
  "qrcode": "^1.5.4",
  "axios": "^1.x.x"
}
```

### **Frontend:**
```json
{
  "qrcode.react": "^4.1.0",
  "lucide-react": "^0.546.0"
}
```

### **Cài đặt:**
```bash
# Backend
cd Backend
npm install qrcode

# Frontend
cd Hackathon-Project
npm install qrcode.react
```

---

## 🌐 API Endpoints

### 1. **Get QR Info**
```
GET http://localhost:4000/api/telegram/qr-info?userId=123&email=user@example.com
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrLink": "https://t.me/AquarouteAI_bot?start=Dz1ljDVXNRcp3q1wNBNDnoHGZBj1",
    "botUsername": "AquarouteAI_bot",
    "userId": "Dz1ljDVXNRcp3q1wNBNDnoHGZBj1",
    "email": "1fvhtkhoa@gmail.com"
  }
}
```

### 2. **Get Bot Info**
```
GET http://localhost:4000/api/telegram/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 8207906803,
    "is_bot": true,
    "first_name": "AQUA ROUTE",
    "username": "AquarouteAI_bot",
    "can_join_groups": true,
    "can_read_all_group_messages": false,
    "supports_inline_queries": false,
    "can_connect_to_business": false,
    "has_main_web_app": false
  }
}
```

---

## 🎨 UI/UX Features

### **Modal Design:**
- ✅ Modern glassmorphism effect
- ✅ Telegram brand colors
- ✅ Smooth fade-in animations
- ✅ Backdrop blur
- ✅ Mobile responsive

### **QR Code:**
- ✅ High resolution (256x256)
- ✅ Error correction level H
- ✅ Margin included
- ✅ SVG format (scalable)

### **Actions:**
- 📋 **Copy Link** - Copy deep link to clipboard
- 💾 **Download QR** - Download as PNG image
- 🔗 **Open Bot** - Open bot in web browser
- ❌ **Close** - Close modal

### **States:**
- 🔄 Loading state với spinner
- ❌ Error state với retry button
- ✅ Success state với actions
- 📋 Copied notification

---

## 🧪 Testing

### **Backend Test:**
```bash
# Terminal 1 - Start server
cd Backend
npm start

# Terminal 2 - Test API
curl http://localhost:4000/api/telegram/qr-info
curl http://localhost:4000/api/telegram/info
```

### **Frontend Test:**
```bash
cd Hackathon-Project
npm start
# Mở http://localhost:3000
# Login → Click Avatar → QR Code Telegram Bot
```

### **Mobile Test:**
1. Mở QR modal trên web
2. Mở Telegram trên điện thoại
3. Tìm kiếm → QR icon
4. Quét mã → Bot tự động mở
5. Nhấn START

---

## 🔐 Security

- ✅ User ID được encode trong deep link
- ✅ Email validation
- ✅ CORS configured properly
- ✅ Environment variables for bot token
- ✅ No sensitive data in QR code

---

## 🐛 Troubleshooting

### **Lỗi: QR không hiển thị**
```bash
# Kiểm tra API
curl http://localhost:4000/api/telegram/qr-info

# Kiểm tra console
# F12 → Console tab → Xem lỗi
```

### **Lỗi: Bot không mở**
- Kiểm tra bot username: `@AquarouteAI_bot`
- Kiểm tra deep link format: `https://t.me/AquarouteAI_bot?start=<id>`
- Telegram app phải được cài đặt

### **Lỗi: CORS**
```javascript
// Backend/src/index.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 📱 Deep Link Format

```
https://t.me/<bot_username>?start=<user_id>
```

**Example:**
```
https://t.me/AquarouteAI_bot?start=Dz1ljDVXNRcp3q1wNBNDnoHGZBj1
```

**Parameters:**
- `bot_username`: AquarouteAI_bot
- `user_id`: Firebase UID (encoded)

---

## 🎯 User Flow

```
1. User login → Get Firebase UID + Email
2. Click "QR Code Telegram Bot" button
3. Modal opens → Load QR info from API
4. Display QR code + bot info
5. User scans QR on phone
6. Telegram opens bot directly
7. User clicks START
8. Bot sends welcome message
9. User receives flood alerts
```

---

## 📊 Analytics

**Metrics to track:**
- QR modal opens
- QR code downloads
- Link copies
- Bot starts from QR
- Successful subscriptions

---

## 🚀 Future Enhancements

- [ ] Dynamic QR với user preferences
- [ ] QR expiration time
- [ ] Analytics integration
- [ ] Multiple bot support
- [ ] Custom QR design
- [ ] Share QR to social media
- [ ] Email QR to user
- [ ] Print-friendly QR page

---

## 📞 Support

**Bot Username:** [@AquarouteAI_bot](https://t.me/AquarouteAI_bot)

**Repository:** [Test_hackathon](https://github.com/vtafi/Test_hackathon)

**Branch:** `feature/qr`

---

## ✅ Checklist

- [x] Backend API endpoints
- [x] QR code generation
- [x] Bot info fetching
- [x] Frontend component
- [x] Modal UI/UX
- [x] Navigation integration
- [x] Styling & animations
- [x] Mobile responsive
- [x] Error handling
- [x] Loading states
- [x] Copy/Download features
- [x] Testing & validation
- [x] Documentation

---

**🎉 Hoàn thành! QR Code Telegram Bot đã sẵn sàng sử dụng!**
