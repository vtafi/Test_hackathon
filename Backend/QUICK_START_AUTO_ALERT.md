# 🚀 Quick Start: Cảnh báo tự động định kỳ

## Giới thiệu

Tính năng cho phép người dùng **tự thiết lập khoảng thời gian check** (ví dụ 5 phút) và **tự động nhận email cảnh báo** khi mực nước vượt ngưỡng.

---

## ⚡ 3 bước để bắt đầu

### 1️⃣ Cấu hình Alert Settings

```bash
curl -X PUT http://localhost:3000/api/alert-settings/user123 \
  -H "Content-Type: application/json" \
  -d '{
    "threshold": 75,
    "checkInterval": 300000,
    "email": "your-email@example.com",
    "sensorIds": ["SENSOR_ROAD", "SENSOR_SEWER"]
  }'
```

**Giải thích:**
- `threshold: 75` → Cảnh báo khi mực nước ≥ 75%
- `checkInterval: 300000` → Check mỗi 5 phút (300000 milliseconds)
- `email` → Email nhận cảnh báo
- `sensorIds` → Danh sách sensors cần theo dõi

---

### 2️⃣ Bật cảnh báo tự động

```bash
curl -X POST http://localhost:3000/api/alert-settings/user123/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

✅ **Xong!** Hệ thống sẽ tự động:
- Check dữ liệu mỗi 5 phút
- Gửi email nếu vượt ngưỡng 75%

---

### 3️⃣ Test ngay lập tức

Không muốn đợi 5 phút? Test ngay:

```bash
curl -X POST http://localhost:3000/api/alert-settings/user123/test
```

---

## 📊 Kiểm tra trạng thái

### Xem settings hiện tại
```bash
curl http://localhost:3000/api/alert-settings/user123
```

### Xem lịch sử cảnh báo
```bash
curl http://localhost:3000/api/alert-settings/user123/logs?limit=10
```

### Kiểm tra Scheduler đang chạy
```bash
curl http://localhost:3000/api/scheduler/status
```

---

## ⏰ Các khoảng thời gian phổ biến

| Thời gian | Milliseconds | Use case |
|-----------|--------------|----------|
| 1 phút | `60000` | Giám sát khẩn cấp |
| 5 phút | `300000` | Giám sát thường xuyên (khuyến nghị) |
| 10 phút | `600000` | Tiết kiệm tài nguyên |
| 30 phút | `1800000` | Giám sát nhẹ |
| 1 giờ | `3600000` | Check định kỳ |

---

## 🔧 Thay đổi cấu hình

### Thay đổi ngưỡng cảnh báo
```bash
curl -X PUT http://localhost:3000/api/alert-settings/user123 \
  -H "Content-Type: application/json" \
  -d '{"threshold": 85}'
```

### Thay đổi khoảng thời gian check
```bash
# Đổi thành 10 phút
curl -X PUT http://localhost:3000/api/alert-settings/user123 \
  -H "Content-Type: application/json" \
  -d '{"checkInterval": 600000}'
```

### Thay đổi email
```bash
curl -X PUT http://localhost:3000/api/alert-settings/user123 \
  -H "Content-Type: application/json" \
  -d '{"email": "new-email@example.com"}'
```

### Thêm/bớt sensors
```bash
curl -X PUT http://localhost:3000/api/alert-settings/user123 \
  -H "Content-Type: application/json" \
  -d '{"sensorIds": ["SENSOR_ROAD", "SENSOR_SEWER", "SENSOR_3"]}'
```

**Lưu ý:** Mỗi lần update, scheduler sẽ tự động restart với cấu hình mới!

---

## ⏸️ Tắt cảnh báo tạm thời

```bash
curl -X POST http://localhost:3000/api/alert-settings/user123/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}'
```

Scheduler sẽ dừng ngay lập tức. Bật lại khi cần:

```bash
curl -X POST http://localhost:3000/api/alert-settings/user123/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

---

## 🗑️ Xóa cấu hình

```bash
curl -X DELETE http://localhost:3000/api/alert-settings/user123
```

---

## 📧 Ví dụ email nhận được

```
Subject: 🚨 Cảnh báo ngập lụt nguy hiểm tại Đường ABC

Kính gửi Anh/Chị,

Hệ thống đã phát hiện mức nước tại cảm biến SENSOR_ROAD đạt 85%, 
vượt ngưỡng cảnh báo 75% mà bạn đã thiết lập.

📍 Vị trí: Đường ABC, Quận XYZ
📊 Mức nước hiện tại: 85%
⏰ Thời gian: 20/11/2024 10:30:00

🚨 Khuyến nghị:
- Theo dõi tình hình
- Tránh di chuyển qua khu vực ngập
- Chuẩn bị phương án an toàn

---
Email này được gửi tự động từ hệ thống cảnh báo ngập lụt.
```

---

## 🐛 Troubleshooting

### 1. Không nhận được email?
- ✅ Kiểm tra settings: `GET /api/alert-settings/user123`
- ✅ Kiểm tra `enabled: true`
- ✅ Kiểm tra email đúng chưa
- ✅ Check spam folder
- ✅ Test ngay: `POST /api/alert-settings/user123/test`

### 2. Scheduler không chạy?
- ✅ Check status: `GET /api/scheduler/status`
- ✅ Xem console log của server
- ✅ Firebase đã khởi tạo chưa?

### 3. Check quá nhanh/chậm?
- ✅ Update `checkInterval` qua API
- ✅ Scheduler tự động restart với interval mới

---

## 📚 Tài liệu chi tiết

- [AUTO_ALERT_GUIDE.md](./docs/AUTO_ALERT_GUIDE.md) - Hướng dẫn đầy đủ
- [Auto_Alert_Settings_API.postman_collection.json](./docs/Auto_Alert_Settings_API.postman_collection.json) - Postman collection

---

## 🎯 Flow tổng quan

```
1. User cấu hình settings
   ↓
2. User bật enabled: true
   ↓
3. Scheduler Service khởi động interval timer
   ↓
4. Mỗi X phút (checkInterval):
   - Đọc dữ liệu sensor từ Firebase
   - So sánh với threshold
   - Nếu vượt ngưỡng → Tạo cảnh báo AI → Gửi email
   ↓
5. User nhận email
   ↓
6. Lặp lại bước 4
```

---

## 🔐 Backend Files

Các file liên quan:
- `src/services/alertSettingsService.js` - Quản lý settings
- `src/services/schedulerService.js` - Auto check định kỳ
- `src/controllers/alertSettingsController.js` - API controller
- `src/routes/alertRoutes.js` - Routes
- `src/index.js` - Khởi động scheduler

---

**✅ Hoàn tất! Giờ bạn có thể để hệ thống tự động giám sát và gửi cảnh báo!** 🎉


