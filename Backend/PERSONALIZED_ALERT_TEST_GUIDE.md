# 🧪 Test Personalized Alert - Người dùng gần sensors

## 🎯 Mục đích

Test hệ thống cảnh báo CÁ NHÂN HÓA với fake user có địa điểm **GẦN sensors** (trong bán kính 20-30m).

---

## 📋 Kịch bản Test

```
┌─────────────────────────────────────────────────────────┐
│                    FAKE USER                             │
│  Name: Nguyễn Văn Test                                   │
│  Email: test.user.near.sensor@example.com               │
│                                                          │
│  Locations:                                              │
│  1. 🏠 Nhà (residential)                                 │
│     - Cách SENSOR_ROAD: ~25m                            │
│     - Alert radius: 50m                                  │
│     - Priority: high                                     │
│                                                          │
│  2. 🏢 Công ty (office)                                  │
│     - Cách SENSOR_SEWER: ~20m                           │
│     - Alert radius: 30m                                  │
│     - Priority: high                                     │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              SENSOR_ROAD (Cảm biến đường)               │
│  📍 Lat: 16.0125, Lon: 108.2442                         │
│  💧 Water level: 85cm (HIGH)                            │
│  🚨 Status: DANGER                                      │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓ Trong bán kính 50m?
                         ↓
              ✅ CÓ! (Distance: ~25m)
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                 PHÂN TÍCH & CẢNH BÁO                    │
│  1. Tính khoảng cách: User location → Sensor           │
│  2. So sánh với alertRadius                             │
│  3. Nếu distance <= alertRadius:                        │
│     → Tạo cảnh báo bằng AI                              │
│     → Gửi email cá nhân hóa                             │
│     → Lưu log vào Firebase                              │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  EMAIL NHẬN ĐƯỢC                         │
│  Subject: 🚨 Cảnh báo: Ngập gần Nhà của bạn!           │
│                                                          │
│  Kính gửi Nguyễn Văn Test,                             │
│                                                          │
│  Hệ thống phát hiện ngập lụt tại khu vực SENSOR_ROAD,  │
│  cách Nhà của bạn chỉ 25m!                              │
│                                                          │
│  💧 Mực nước: 85cm                                      │
│  🚨 Mức độ: NGUY HIỂM                                   │
│                                                          │
│  Khuyến nghị:                                            │
│  - Di chuyển xe, đồ đạc lên cao                         │
│  - Chuẩn bị sơ tán nếu cần                              │
│  - Theo dõi tình hình                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Cách chạy Test

### **Bước 1: Tạo Fake User**

```bash
cd Backend
node src/scripts/createFakeUserNearSensor.js
```

**Output mẫu:**
```
🚀 Bắt đầu tạo fake user...

✅ Đã tạo user profile: fake_user_test_001
   Tên: Nguyễn Văn Test
   Email: test.user.near.sensor@example.com

📍 Đã tạo location: Nhà
   Type: residential 🏠
   Address: Gần SENSOR_ROAD, Đà Nẵng
   Coords: 16.012725, 108.244200
   Alert Radius: 50m
   Priority: high

📍 Đã tạo location: Công ty
   Type: office 🏢
   Address: Gần SENSOR_SEWER, Đà Nẵng
   Coords: 16.054480, 108.202100
   Alert Radius: 30m
   Priority: high

📏 KHOẢNG CÁCH THỰC TẾ:

🏠 "Nhà" → SENSOR_ROAD:
   Khoảng cách: 24.95m
   Alert radius: 50m
   → ✅ SẼ CẢNH BÁO

🏢 "Công ty" → SENSOR_SEWER:
   Khoảng cách: 19.87m
   Alert radius: 30m
   → ✅ SẼ CẢNH BÁO

🎉 Hoàn thành!
```

---

### **Bước 2: Test Personalized Alert**

```bash
# Test không gửi email (chỉ xem kết quả)
node src/scripts/testPersonalizedAlertForUser.js fake_user_test_001

# Test và GỬI EMAIL thật
node src/scripts/testPersonalizedAlertForUser.js fake_user_test_001 --send-email
```

**Output mẫu:**
```
🧪 TEST PERSONALIZED ALERT

============================================================
User ID: fake_user_test_001

📋 BƯỚC 1: Lấy thông tin user...

✅ User: Nguyễn Văn Test (test.user.near.sensor@example.com)

📋 BƯỚC 2: Lấy danh sách locations...

✅ Tìm thấy 2 locations:

   1. 🏠 Nhà
      📍 16.012725, 108.244200
      📏 Alert radius: 50m
      ⚡ Priority: high

   2. 🏢 Công ty
      📍 16.054480, 108.202100
      📏 Alert radius: 30m
      ⚡ Priority: high

📋 BƯỚC 3: Phân tích nguy cơ ngập cho từng location...

============================================================

🔍 Checking: 🏠 Nhà
   Tọa độ: 16.012725, 108.244200
   Bán kính cảnh báo: 50m

   ✅ CÓ NGUY CƠ NGẬP!

   Khu vực ngập #1:
      📍 SENSOR_ROAD
      📏 Khoảng cách: 25m
      💧 Mực nước: 85cm
      🚨 Trạng thái: DANGER

📋 BƯỚC 4: Tạo cảnh báo bằng AI...

✅ AI đã tạo cảnh báo:

   📧 Subject: 🚨 Cảnh báo ngập lụt gần Nhà của Nguyễn Văn Test

   📄 Body:
------------------------------------------------------------
<p>Kính gửi <b>Nguyễn Văn Test</b>,</p>

<p>Hệ thống phát hiện <b style="color:red">ngập lụt nguy hiểm</b> 
tại khu vực <b>SENSOR_ROAD</b>, cách <b>Nhà</b> của bạn chỉ 
<b>25 mét</b>!</p>

<p><b>Thông tin chi tiết:</b></p>
<ul>
  <li>💧 Mực nước: <b style="color:red">85cm</b></li>
  <li>🚨 Mức độ: <b>NGUY HIỂM</b></li>
  <li>📏 Khoảng cách: 25m từ Nhà</li>
  <li>⏰ Thời gian: [timestamp]</li>
</ul>

<p><b style="color:red">🚨 Khuyến nghị KHẨN CẤP:</b></p>
<ul>
  <li>Di chuyển xe và đồ đạc quý giá lên cao ngay lập tức</li>
  <li>Đóng cửa, tắt điện nếu nước tràn vào</li>
  <li>Chuẩn bị sơ tán nếu tình hình xấu hơn</li>
  <li>Không đi qua vùng ngập</li>
  <li>Giữ liên lạc với gia đình</li>
</ul>
...
------------------------------------------------------------

💾 Đã lưu log cảnh báo vào Firebase

------------------------------------------------------------

🔍 Checking: 🏢 Công ty
   [Similar output for second location]

============================================================
🎉 Test hoàn tất!
```

---

## 📊 Logic Cảnh báo

### **1. Tính khoảng cách**
```javascript
// Haversine formula - tính khoảng cách giữa 2 điểm GPS
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * PI / 180;
  const dLon = (lon2 - lon1) * PI / 180;
  
  const a = sin(dLat/2)^2 + 
            cos(lat1) * cos(lat2) * 
            sin(dLon/2)^2;
            
  const c = 2 * atan2(sqrt(a), sqrt(1-a));
  return R * c; // km
}
```

### **2. Điều kiện cảnh báo**
```javascript
if (distanceMeters <= location.alertRadius) {
  // ✅ TRIGGER ALERT
  // - distanceMeters: khoảng cách thực tế (m)
  // - alertRadius: bán kính user đã set (m)
}
```

### **3. Ví dụ cụ thể**

| Location | Sensor | Distance | Alert Radius | Kết quả |
|----------|--------|----------|--------------|---------|
| 🏠 Nhà | SENSOR_ROAD | 25m | 50m | ✅ Alert (25 ≤ 50) |
| 🏢 Công ty | SENSOR_SEWER | 20m | 30m | ✅ Alert (20 ≤ 30) |
| 🏫 Trường | SENSOR_ROAD | 100m | 50m | ❌ No alert (100 > 50) |

---

## 🎨 Cá nhân hóa Alert

### **Thông tin được cá nhân hóa:**

1. **Tên người dùng:** "Kính gửi Nguyễn Văn Test"
2. **Tên địa điểm:** "gần **Nhà** của bạn" (không phải "gần một địa điểm")
3. **Loại địa điểm:** Khuyến nghị khác nhau cho Nhà/Công ty/Trường
4. **Khoảng cách cụ thể:** "cách 25m" (không phải "gần đó")
5. **Mức độ ưu tiên:** High priority → email ngay, Low priority → có thể gộp

### **Ví dụ khác biệt:**

**🏠 Nhà (residential):**
```
Khuyến nghị:
- Di chuyển xe, đồ đạc lên cao
- Đóng cửa, tắt điện
- Chuẩn bị sơ tán
```

**🏢 Công ty (office):**
```
Khuyến nghị:
- Thông báo nhân viên
- Bảo vệ thiết bị văn phòng
- Chọn lộ trình di chuyển thay thế
- Cân nhắc làm việc từ xa
```

**🏫 Trường (school):**
```
Khuyến nghị:
- Không đưa trẻ đến trường
- Chọn đường đi khác
- Theo dõi thông báo từ nhà trường
```

---

## 📁 Cấu trúc Firebase sau khi test

```
userProfiles/
  fake_user_test_001/
    name: "Nguyễn Văn Test"
    email: "test.user.near.sensor@example.com"
    
    locations/
      loc_001/
        name: "Nhà"
        type: "residential"
        coords: {lat: 16.012725, lon: 108.244200}
        alertRadius: 50
        priority: "high"
      
      loc_002/
        name: "Công ty"
        type: "office"
        coords: {lat: 16.054480, lon: 108.202100}
        alertRadius: 30
        priority: "high"
    
    personalizedAlerts/
      -NxYz123/
        locationId: "loc_001"
        locationName: "Nhà"
        floodAreaId: "SENSOR_ROAD"
        floodRisk: 2
        distance: 25
        emailSent: true
        createdAt: [timestamp]
    
    activities/
      -NxYz456/
        type: "alert_received"
        title: "Cảnh báo ngập tại SENSOR_ROAD"
        description: "Cảnh báo cho địa điểm Nhà - Cách 25m"
        timestamp: [timestamp]
```

---

## 🔧 Tùy chỉnh

### **Thay đổi bán kính cảnh báo:**

Trong `createFakeUserNearSensor.js`:
```javascript
alertRadius: 50, // Thay đổi thành 20, 30, 100... (meters)
```

### **Thay đổi khoảng cách:**

```javascript
coords: calculateNearbyCoords(SENSOR_ROAD.lat, SENSOR_ROAD.lon, 25),
//                                                                 ^^
//                                            Thay đổi: 10, 15, 20, 30...
```

### **Thay đổi mực nước sensor:**

Trong `testPersonalizedAlertForUser.js`:
```javascript
water_level_cm: 85, // Thay đổi để test các mức độ khác nhau
flood_status: "DANGER", // SAFE, WARNING, DANGER, CRITICAL
```

---

## 📊 Test Cases

### **Test Case 1: Trong bán kính**
- Distance: 25m
- Alert radius: 50m
- **Kết quả:** ✅ Gửi cảnh báo

### **Test Case 2: Đúng bằng bán kính**
- Distance: 50m
- Alert radius: 50m
- **Kết quả:** ✅ Gửi cảnh báo (50 ≤ 50)

### **Test Case 3: Ngoài bán kính**
- Distance: 51m
- Alert radius: 50m
- **Kết quả:** ❌ Không gửi

### **Test Case 4: Rất gần**
- Distance: 5m
- Alert radius: 50m
- **Kết quả:** ✅ Gửi cảnh báo (priority cao hơn)

### **Test Case 5: Multiple sensors**
- User có 2 locations
- Mỗi location gần 1 sensor khác nhau
- **Kết quả:** ✅ Gửi 2 emails riêng biệt

---

## 🐛 Troubleshooting

### **1. User không được tạo**
```bash
# Kiểm tra Firebase config
echo $FIREBASE_SERVICE_ACCOUNT_KEY
echo $FIREBASE_DATABASE_URL

# Test Firebase connection
node src/scripts/testFirebaseConnection.js
```

### **2. Không tính được khoảng cách**
- Check tọa độ có đúng format không (số thực, không phải string)
- Check lat/lon có hợp lệ không (-90 to 90, -180 to 180)

### **3. Không gửi email**
- Kiểm tra EMAIL_USER và EMAIL_PASS trong .env
- Dùng flag `--send-email` khi chạy script
- Check Gmail settings (App Password)

### **4. AI không tạo cảnh báo**
- Kiểm tra GEMINI_API_KEY trong .env
- Check console log xem có lỗi gì không
- Thử với mực nước cao hơn (>80cm)

---

## 📚 Files liên quan

- `createFakeUserNearSensor.js` - Tạo fake user
- `testPersonalizedAlertForUser.js` - Test alert
- `personalizedAlertService.js` - Service logic
- `floodPredictionService.js` - Distance calculation

---

## 🎯 Next Steps

- [ ] Test với nhiều users khác nhau
- [ ] Test với bán kính khác nhau (10m, 50m, 100m)
- [ ] Test với multiple sensors cùng lúc
- [ ] Thêm cooldown để tránh spam
- [ ] Tích hợp với scheduler service

---

**🎉 Hoàn tất! Bây giờ bạn có thể test personalized alert với user gần sensors!**


