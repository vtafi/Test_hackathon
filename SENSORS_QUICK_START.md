# 🚀 Quick Start: Hiển thị Sensors trên Web

## ⚡ 3 bước để xem dữ liệu sensors

### 1️⃣ Đảm bảo Backend đang chạy
```bash
cd Backend
npm start
```

Backend phải chạy tại: `http://localhost:3000`

---

### 2️⃣ Đảm bảo Frontend đang chạy
```bash
cd Hackathon-Project
npm start
```

Frontend phải chạy tại: `http://localhost:3000` (nếu khác port, React sẽ thông báo)

---

### 3️⃣ Truy cập trang Sensors

**Cách 1: Click trên Navigation**
- Mở app → Click tab **"📊 Sensors"** ở góc trên bên phải

**Cách 2: Truy cập trực tiếp**
- Mở browser → `http://localhost:3000/sensors`

---

## 📊 Bạn sẽ thấy:

```
┌─────────────────────────────────────────────┐
│  📊 Giám sát Sensors                        │
├─────────────────────────────────────────────┤
│  🛣️ SENSOR_ROAD          🚰 SENSOR_SEWER   │
│  ┌──────────────┐        ┌──────────────┐  │
│  │ ⚠️ WARNING   │        │ ✅ SAFE      │  │
│  │ 💧 14 cm     │        │ 💧 34 cm     │  │
│  │ ██████▒▒▒▒▒▒ │        │ █████████▒▒▒ │  │
│  │ 📍 Location  │        │ 📍 Location  │  │
│  │ ⏰ Time      │        │ ⏰ Time      │  │
│  └──────────────┘        └──────────────┘  │
└─────────────────────────────────────────────┘
```

**Tự động cập nhật mỗi 5 giây!** ⏱️

---

## 🎛️ Điều khiển

- **🔄 Auto Refresh** → Toggle để bật/tắt tự động cập nhật
- **🔄 Làm mới** → Click để cập nhật thủ công ngay lập tức

---

## 🎨 Màu sắc

| Trạng thái | Màu | Ý nghĩa |
|------------|-----|---------|
| ✅ SAFE | Xanh lá | An toàn |
| ⚠️ WARNING | Vàng | Cảnh báo |
| 🚨 DANGER | Đỏ | Nguy hiểm |
| 🔴 CRITICAL | Đỏ đậm | Nghiêm trọng |

---

## 📱 Responsive

- **Desktop:** Hiển thị 2 cột
- **Mobile:** Hiển thị 1 cột (tự động)
- **Tablet:** Tự động điều chỉnh

---

## 🔧 Test Backend API

Kiểm tra xem Backend có hoạt động không:

```bash
# Test API
curl http://localhost:3000/api/firebase/sensors

# Kết quả mong đợi:
{
  "success": true,
  "data": {
    "SENSOR_ROAD": { ... },
    "SENSOR_SEWER": { ... }
  }
}
```

---

## 🐛 Nếu có lỗi

### Không hiển thị dữ liệu?
```bash
# Kiểm tra Backend
curl http://localhost:3000

# Kiểm tra Firebase API
curl http://localhost:3000/api/firebase/sensors
```

### Loading mãi?
1. Mở Console (F12)
2. Xem tab Network
3. Kiểm tra request có fail không
4. Restart Backend và Frontend

### Màu sắc không đúng?
- Kiểm tra `flood_status` trong Firebase
- Phải là: SAFE, WARNING, DANGER, hoặc CRITICAL (viết hoa)

---

## 📚 Files đã tạo

```
✨ Frontend:
├── src/components/SensorsDashboard.js    (Component chính)
├── src/components/SensorsDashboard.css   (Styles)
├── src/pages/SensorsPage.js              (Page wrapper)
└── src/pages/SensorsPage.css             (Page styles)

🔧 Updated:
├── src/App.js                            (Thêm route /sensors)
└── src/components/TopNavigation.js       (Thêm tab Sensors)
```

---

## 🎯 Dữ liệu hiển thị

Mỗi sensor card hiển thị:
- 📛 Tên sensor (SENSOR_ROAD / SENSOR_SEWER)
- 🚦 Trạng thái ngập (SAFE/WARNING/DANGER/CRITICAL)
- 💧 Mực nước (cm và %)
- 📊 Progress bar
- 📍 Tọa độ GPS
- ⏰ Thời gian cập nhật
- 🔑 Device ID

---

## 🚀 Next Steps

1. ✅ Xem dữ liệu real-time → **DONE!**
2. [ ] Tích hợp với auto alert system
3. [ ] Thêm charts/graphs
4. [ ] Export data

---

## 📖 Tài liệu đầy đủ

Xem: `Hackathon-Project/SENSORS_DISPLAY_GUIDE.md`

---

**✅ Xong! Giờ bạn có thể xem 2 sensors SENSOR_ROAD và SENSOR_SEWER trên web!** 🎉


