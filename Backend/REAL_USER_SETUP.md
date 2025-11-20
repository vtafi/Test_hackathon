# 🔐 Tạo Real User với Firebase Auth

## 👤 User Info

```
Email: tranviettai0852730323@gmail.com
Password: 20052004Loi
Name: Trần Viết Tài
```

---

## 🚀 Cách tạo user

### **Bước 1: Chạy script**

```bash
cd Backend
node src/scripts/createRealUserNearSensor.js
```

Script sẽ:

1. ✅ Tạo Firebase Authentication user (hoặc update nếu đã có)
2. ✅ Tạo user profile trong Database
3. ✅ Tạo 2 locations gần sensors:
   - 🏠 Nhà (cách SENSOR_ROAD ~25m)
   - 🏢 Công ty (cách SENSOR_SEWER ~20m)
4. ✅ Tạo alert settings (tự động check, mặc định tắt)

**Output:**

```
🚀 Bắt đầu tạo REAL user...

📋 BƯỚC 1: Tạo Firebase Authentication user...
✅ Đã tạo Firebase Auth user mới!
   UID: abc123xyz
   Email: tranviettai0852730323@gmail.com
   Name: Trần Viết Tài

📋 BƯỚC 2: Tạo user profile trong Database...
✅ Đã tạo user profile

📋 BƯỚC 3: Tạo locations gần sensors...
📍 Đã tạo location: Nhà
   Type: residential 🏠
   Coords: 16.012725, 108.244200
   Alert Radius: 50m

📍 Đã tạo location: Công ty
   Type: office 🏢
   Coords: 16.054480, 108.202100
   Alert Radius: 30m

📏 KHOẢNG CÁCH THỰC TẾ:
🏠 "Nhà" → SENSOR_ROAD:
   Khoảng cách: 24.95m
   → ✅ SẼ CẢNH BÁO

🏢 "Công ty" → SENSOR_SEWER:
   Khoảng cách: 19.87m
   → ✅ SẼ CẢNH BÁO

📋 BƯỚC 4: Tạo alert settings...
✅ Đã tạo alert settings (enabled: false)

🎉 HOÀN TẤT!
```

---

## 🌐 Đăng nhập vào Web

### **Frontend:**

```
URL: http://localhost:3000/login
Email: tranviettai0852730323@gmail.com
Password: 20052004Loi
```

Sau khi đăng nhập, bạn sẽ thấy:

- ✅ User profile với tên "Trần Viết Tài"
- ✅ 2 locations trong profile (Nhà, Công ty)
- ✅ Avatar và user info

---

## 🧪 Test Personalized Alert

### **Test 1: Xem locations và phân tích**

```bash
node src/scripts/testPersonalizedAlertForUser.js <UID>
```

Replace `<UID>` bằng UID từ output script trên.

**Output:**

```
🧪 TEST PERSONALIZED ALERT

📋 BƯỚC 1: Lấy thông tin user...
✅ User: Trần Viết Tài (tranviettai0852730323@gmail.com)

📋 BƯỚC 2: Lấy danh sách locations...
✅ Tìm thấy 2 locations

📋 BƯỚC 3: Phân tích nguy cơ ngập...
🔍 Checking: 🏠 Nhà
   ✅ CÓ NGUY CƠ NGẬP!
   Khu vực ngập: SENSOR_ROAD
   Khoảng cách: 25m

📋 BƯỚC 4: Tạo cảnh báo bằng AI...
✅ AI đã tạo cảnh báo:
   📧 Subject: 🚨 Cảnh báo ngập gần Nhà của Trần Viết Tài
```

---

### **Test 2: Gửi email thật**

```bash
node src/scripts/testPersonalizedAlertForUser.js <UID> --send-email
```

Email sẽ được gửi đến: `tranviettai0852730323@gmail.com`

---

## 📧 Email nhận được

```
Subject: 🚨 Cảnh báo ngập gần Nhà của Trần Viết Tài

Kính gửi Trần Viết Tài,

Hệ thống phát hiện ngập lụt nguy hiểm tại SENSOR_ROAD,
cách Nhà của bạn chỉ 25m!

💧 Mực nước: 85cm
🚨 Mức độ: NGUY HIỂM
📏 Khoảng cách: 25m từ Nhà

🚨 Khuyến nghị KHẨN CẤP:
- Di chuyển xe và đồ đạc quý giá lên cao ngay lập tức
- Đóng cửa, tắt điện nếu nước tràn vào
- Chuẩn bị sơ tán nếu tình hình xấu hơn
- Không đi qua vùng ngập
- Giữ liên lạc với gia đình

---
Email này được gửi tự động từ hệ thống cảnh báo ngập lụt.
```

---

## ⚙️ Bật Auto Alert (Optional)

### **Via API:**

```bash
# Cập nhật settings
curl -X PUT http://localhost:4000/api/alert-settings/<UID> \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "threshold": 75,
    "checkInterval": 300000,
    "email": "tranviettai0852730323@gmail.com",
    "sensorIds": ["SENSOR_ROAD", "SENSOR_SEWER"]
  }'

# Bật auto alert
curl -X POST http://localhost:4000/api/alert-settings/<UID>/toggle \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

Sau khi bật, hệ thống sẽ:

- ⏰ Tự động check mỗi 5 phút
- 📧 Gửi email khi mực nước vượt 75%
- 💾 Lưu log vào Firebase

---

## 🔍 Xem data trong Firebase

### **Authentication:**

```
Firebase Console > Authentication > Users
→ Tìm email: tranviettai0852730323@gmail.com
```

### **Database:**

```
Firebase Console > Realtime Database

userProfiles/
  <UID>/
    name: "Trần Viết Tài"
    email: "tranviettai0852730323@gmail.com"

    locations/
      loc_home/
        name: "Nhà"
        coords: {lat: 16.012725, lon: 108.244200}
        alertRadius: 50

      loc_office/
        name: "Công ty"
        coords: {lat: 16.054480, lon: 108.202100}
        alertRadius: 30

userSettings/
  <UID>/
    alertSettings/
      enabled: false
      threshold: 75
      email: "tranviettai0852730323@gmail.com"
```

---

## 🎯 Use Cases

### **1. Đăng nhập web**

- Login với email/password
- Xem profile
- Xem locations trên map

### **2. Nhận cảnh báo email**

- Test manual: `node ... --send-email`
- Hoặc bật auto alert để nhận tự động

### **3. Test personalized alert**

- Phân tích locations
- Kiểm tra khoảng cách với sensors
- Tạo email cá nhân hóa bằng AI

---

## 🐛 Troubleshooting

### **Lỗi: Email already exists**

```
→ User đã tồn tại, script sẽ update password
```

### **Không nhận được email**

```bash
# Check email settings
echo $EMAIL_USER
echo $EMAIL_PASS

# Test email service
curl -X POST http://localhost:4000/api/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "tranviettai0852730323@gmail.com"}'
```

### **Không login được**

```
1. Check Firebase Authentication có user không
2. Check password: 20052004Loi (case-sensitive)
3. Check frontend đang connect đúng Firebase project
```

---

## 📚 Files liên quan

- `createRealUserNearSensor.js` - Script tạo user
- `testPersonalizedAlertForUser.js` - Script test alert
- `PERSONALIZED_ALERT_TEST_GUIDE.md` - Hướng dẫn đầy đủ

---

**✅ Xong! User đã sẵn sàng để test!** 🎉

**Chạy ngay:**

```bash
node src/scripts/createRealUserNearSensor.js
```

