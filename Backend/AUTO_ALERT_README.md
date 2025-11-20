# 📧 Tính năng: Cảnh báo tự động định kỳ (Auto Alert)

## 🎯 Mô tả

Cho phép người dùng **tự thiết lập khoảng thời gian check** (ví dụ: 5 phút, 10 phút) và **tự động nhận email cảnh báo** khi dữ liệu sensor vượt ngưỡng mà họ đã cấu hình.

---

## ✨ Tính năng chính

✅ **User tự cấu hình:**
- Ngưỡng cảnh báo (threshold: 0-100%)
- Khoảng thời gian check (checkInterval: milliseconds)
- Email nhận cảnh báo
- Danh sách sensors cần theo dõi

✅ **Tự động giám sát:**
- Background service chạy liên tục
- Check dữ liệu định kỳ theo interval đã set
- Không cần IoT device tự gửi, backend tự động lấy

✅ **Gửi email thông minh:**
- Cảnh báo được tạo bằng AI (Gemini)
- Chỉ gửi khi vượt ngưỡng
- Lưu log lịch sử đầy đủ

✅ **Quản lý linh hoạt:**
- Bật/tắt bất cứ lúc nào
- Thay đổi cấu hình realtime
- Scheduler tự động restart khi update

---

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────────────────────┐
│                  USER SETTINGS                       │
│  (Firebase: userSettings/{userId}/alertSettings)     │
│  - enabled: true/false                               │
│  - threshold: 75%                                    │
│  - checkInterval: 300000ms (5 phút)                  │
│  - email: user@example.com                           │
│  - sensorIds: ["SENSOR_ROAD", "SENSOR_SEWER"]       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              SCHEDULER SERVICE                       │
│  - Khởi động khi server start                        │
│  - Tạo interval cho mỗi user có enabled=true        │
│  - Interval riêng biệt theo checkInterval của user   │
└─────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────────────────────┐
        │   Mỗi checkInterval (5 phút)   │
        └───────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              CHECK SENSOR DATA                       │
│  1. Đọc dữ liệu từ Firebase (iotData hoặc sensors)  │
│  2. Tính current_percent                             │
│  3. So sánh với threshold                            │
└─────────────────────────────────────────────────────┘
                        ↓
                  Vượt ngưỡng?
                   ↓ YES     ↓ NO
    ┌──────────────┘         └──────────────┐
    ↓                                        ↓
┌─────────────────────┐            ┌───────────────┐
│  SEND ALERT         │            │  Skip         │
│  - Gemini AI        │            └───────────────┘
│  - Email Service    │
│  - Save Log         │
└─────────────────────┘
```

---

## 📂 Cấu trúc Backend

### **New Files:**

```
Backend/
├── src/
│   ├── services/
│   │   ├── alertSettingsService.js    ✨ NEW - Quản lý settings
│   │   └── schedulerService.js        ✨ NEW - Auto check định kỳ
│   ├── controllers/
│   │   └── alertSettingsController.js ✨ NEW - API controller
│   └── routes/
│       └── alertRoutes.js             🔧 UPDATED - Thêm routes mới
├── docs/
│   ├── AUTO_ALERT_GUIDE.md            ✨ NEW - Hướng dẫn chi tiết
│   └── Auto_Alert_Settings_API.postman_collection.json ✨ NEW
├── QUICK_START_AUTO_ALERT.md          ✨ NEW - Quick start
└── AUTO_ALERT_README.md               ✨ NEW - File này
```

---

## 🚀 API Endpoints mới

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/alert-settings/:userId` | Lấy cấu hình |
| `PUT` | `/api/alert-settings/:userId` | Cập nhật cấu hình |
| `POST` | `/api/alert-settings/:userId/toggle` | Bật/tắt |
| `DELETE` | `/api/alert-settings/:userId` | Xóa cấu hình |
| `GET` | `/api/alert-settings/:userId/logs` | Lịch sử cảnh báo |
| `POST` | `/api/alert-settings/:userId/test` | Test ngay |
| `GET` | `/api/scheduler/status` | Trạng thái scheduler |

---

## 🎬 Demo nhanh

### 1. Cấu hình (check mỗi 5 phút, ngưỡng 75%)
```bash
curl -X PUT http://localhost:3000/api/alert-settings/user123 \
  -H "Content-Type: application/json" \
  -d '{
    "threshold": 75,
    "checkInterval": 300000,
    "email": "user@example.com",
    "sensorIds": ["SENSOR_ROAD"]
  }'
```

### 2. Bật auto alert
```bash
curl -X POST http://localhost:3000/api/alert-settings/user123/toggle \
  -d '{"enabled": true}'
```

### 3. Test ngay không đợi 5 phút
```bash
curl -X POST http://localhost:3000/api/alert-settings/user123/test
```

---

## 📊 Firebase Database Structure

```json
userSettings/
  {userId}/
    alertSettings/
      enabled: true
      threshold: 75
      checkInterval: 300000
      email: "user@example.com"
      sensorIds: ["SENSOR_ROAD", "SENSOR_SEWER"]
      lastChecked: 1700000000000
      lastAlertSent: 1700000000000
      createdAt: 1700000000000
      updatedAt: 1700000000000
    
    alertLogs/
      -NxYz123/
        sensorId: "SENSOR_ROAD"
        sensorData: { ... }
        alert: { subject: "...", htmlBody: "..." }
        sentAt: 1700000000000
```

---

## ⚙️ Scheduler Logic

### Khởi động (Server Start)
```javascript
// src/index.js
schedulerService.start()
  → Lấy tất cả users có enabled: true
  → Tạo setInterval() cho mỗi user
```

### Runtime (Mỗi user có interval riêng)
```javascript
setInterval(async () => {
  // Check tất cả sensors của user
  for (sensorId of user.sensorIds) {
    const data = await getSensorData(sensorId);
    const percent = calculatePercent(data);
    
    if (percent >= user.threshold) {
      await sendAlertEmail(user.email);
    }
  }
}, user.checkInterval);
```

### Update Settings
```javascript
// Khi user update settings qua API
PUT /api/alert-settings/:userId
  → alertSettingsService.updateAlertSettings()
  → schedulerService.restartUserScheduler(userId)
     → clearInterval() old interval
     → setInterval() với config mới
```

---

## 🔄 Workflow tổng quan

1. **User setup lần đầu:**
   - Gọi API `PUT /api/alert-settings/:userId` với config
   - Gọi API `POST /api/alert-settings/:userId/toggle` với `enabled: true`

2. **Server khởi động:**
   - `schedulerService.start()` trong `src/index.js`
   - Tự động load tất cả users có `enabled: true`
   - Tạo interval timer cho từng user

3. **Runtime:**
   - Mỗi user có interval riêng chạy độc lập
   - Check → Compare → Alert (nếu cần) → Log

4. **User update:**
   - API tự động restart scheduler với config mới
   - Không cần restart server

5. **Graceful shutdown:**
   - Server tự động clear intervals khi nhận SIGTERM/SIGINT

---

## 💻 Tech Stack

- **Node.js + Express** - API server
- **Firebase Realtime Database** - Lưu settings và logs
- **node-schedule / setInterval** - Scheduler
- **Nodemailer** - Gửi email
- **Gemini AI** - Tạo nội dung cảnh báo

---

## 🎓 Ví dụ Frontend Integration

```javascript
// React component example
const AlertSettings = ({ userId }) => {
  const [settings, setSettings] = useState(null);
  const [enabled, setEnabled] = useState(false);

  // Load settings
  useEffect(() => {
    fetch(`/api/alert-settings/${userId}`)
      .then(res => res.json())
      .then(data => {
        setSettings(data.settings);
        setEnabled(data.settings.enabled);
      });
  }, [userId]);

  // Toggle on/off
  const handleToggle = async () => {
    const response = await fetch(`/api/alert-settings/${userId}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !enabled })
    });
    const result = await response.json();
    setEnabled(result.enabled);
  };

  // Update settings
  const handleUpdate = async (newSettings) => {
    await fetch(`/api/alert-settings/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
  };

  return (
    <div>
      <h2>Cảnh báo tự động</h2>
      <label>
        <input type="checkbox" checked={enabled} onChange={handleToggle} />
        Bật cảnh báo tự động
      </label>
      {/* Form để update threshold, interval, email, sensors */}
    </div>
  );
};
```

---

## 📝 Checklist triển khai

- [x] Backend: Tạo Alert Settings Service
- [x] Backend: Tạo Scheduler Service
- [x] Backend: Tạo API Controller
- [x] Backend: Thêm Routes
- [x] Backend: Khởi động Scheduler trong index.js
- [x] Docs: Tạo AUTO_ALERT_GUIDE.md
- [x] Docs: Tạo QUICK_START_AUTO_ALERT.md
- [x] Docs: Tạo Postman Collection
- [ ] Frontend: Tạo UI cấu hình alert settings
- [ ] Frontend: Tạo UI xem lịch sử logs
- [ ] Testing: Test với nhiều users
- [ ] Testing: Test với nhiều sensors
- [ ] Deploy: Production deployment

---

## 🐛 Known Issues & Future Improvements

### Hiện tại:
- ✅ Scheduler chạy in-memory (mất khi restart server)
- ✅ Không có rate limiting cho email
- ✅ Không có cooldown giữa các alerts

### Cải tiến tương lai:
- [ ] Persistent scheduler state
- [ ] Email rate limiting (max X emails/hour)
- [ ] Cooldown period (không spam email liên tục)
- [ ] SMS/Push notification thay vì chỉ email
- [ ] Alert conditions phức tạp hơn (AND/OR logic)
- [ ] Dashboard để xem real-time status
- [ ] Multi-language support

---

## 📚 Tài liệu

- [AUTO_ALERT_GUIDE.md](./docs/AUTO_ALERT_GUIDE.md) - Hướng dẫn đầy đủ
- [QUICK_START_AUTO_ALERT.md](./QUICK_START_AUTO_ALERT.md) - Bắt đầu nhanh
- [Postman Collection](./docs/Auto_Alert_Settings_API.postman_collection.json) - API testing

---

## 🤝 Support

Nếu có vấn đề:
1. Check console log của server
2. Gọi `GET /api/scheduler/status` để xem trạng thái
3. Gọi `POST /api/alert-settings/:userId/test` để test
4. Xem logs: `GET /api/alert-settings/:userId/logs`

---

## 🎉 Tổng kết

**Đã hoàn thành:**
✅ Backend service hoàn chỉnh
✅ API endpoints đầy đủ
✅ Tài liệu chi tiết
✅ Postman collection
✅ Auto restart khi update
✅ Graceful shutdown

**Người dùng giờ có thể:**
- Tự set khoảng thời gian check (5 phút, 10 phút, tùy ý)
- Tự set ngưỡng cảnh báo
- Nhận email tự động khi vượt ngưỡng
- Theo dõi lịch sử cảnh báo
- Bật/tắt linh hoạt

**Bước tiếp theo:**
- Phần IoT (ESP32) sẽ chỉ cần gửi dữ liệu lên Firebase
- Backend sẽ tự động check và gửi email
- User chỉ cần config một lần qua API/Frontend

---

**Made with ❤️ for automated flood alerts**


