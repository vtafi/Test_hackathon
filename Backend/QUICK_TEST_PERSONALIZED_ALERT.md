# 🚀 Quick Test: Cảnh báo người dùng gần sensor

## ⚡ 2 lệnh để test ngay

### **1. Tạo fake user (chạy 1 lần)**
```bash
cd Backend
node src/scripts/createFakeUserNearSensor.js
```

### **2. Test cảnh báo**
```bash
# Xem kết quả (không gửi email)
node src/scripts/testPersonalizedAlertForUser.js fake_user_test_001

# Gửi email thật
node src/scripts/testPersonalizedAlertForUser.js fake_user_test_001 --send-email
```

---

## 📊 Fake User được tạo

```
👤 Nguyễn Văn Test
📧 test.user.near.sensor@example.com

📍 Location 1: 🏠 Nhà
   - Gần SENSOR_ROAD: ~25m
   - Alert radius: 50m
   → ✅ SẼ CẢNH BÁO

📍 Location 2: 🏢 Công ty
   - Gần SENSOR_SEWER: ~20m
   - Alert radius: 30m
   → ✅ SẼ CẢNH BÁO
```

---

## 🎯 Logic cảnh báo

```javascript
if (distance <= alertRadius) {
  // ✅ GỬI CẢNH BÁO
}

// Ví dụ:
// - Nhà cách SENSOR_ROAD 25m
// - Alert radius: 50m
// - 25 ≤ 50 → ✅ CẢNH BÁO
```

---

## 📧 Email nhận được

```
Subject: 🚨 Cảnh báo ngập gần Nhà của Nguyễn Văn Test

Kính gửi Nguyễn Văn Test,

Hệ thống phát hiện ngập lụt tại SENSOR_ROAD,
cách Nhà của bạn chỉ 25m!

💧 Mực nước: 85cm
🚨 Mức độ: NGUY HIỂM
📏 Khoảng cách: 25m

Khuyến nghị:
- Di chuyển xe, đồ đạc lên cao
- Chuẩn bị sơ tán nếu cần
- Không đi qua vùng ngập
```

---

## 🔧 Tùy chỉnh bán kính

Sửa file `createFakeUserNearSensor.js`:

```javascript
alertRadius: 30, // Thay đổi: 20, 30, 50, 100... (meters)
```

Sau đó chạy lại script tạo user.

---

## 🎨 Test với bán kính khác nhau

| Alert Radius | Distance | Kết quả |
|--------------|----------|---------|
| 50m | 25m | ✅ Cảnh báo |
| 30m | 25m | ✅ Cảnh báo |
| 20m | 25m | ❌ KHÔNG cảnh báo |
| 10m | 25m | ❌ KHÔNG cảnh báo |

---

## 📚 Tài liệu đầy đủ

Xem: `PERSONALIZED_ALERT_TEST_GUIDE.md`

---

**✅ Test ngay với 2 lệnh trên!** 🎉


