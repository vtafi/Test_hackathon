# 📏 Giải thích: Bán kính cảnh báo (Alert Radius)

## 🎯 Khái niệm

**Alert Radius** = Bán kính mà trong đó, nếu có sensor ngập thì user sẽ nhận cảnh báo.

---

## 📊 Diagram

```
                    SENSOR_ROAD
                   (Mực nước: 85cm)
                         🚨
                         │
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        │    Alert Radius = 50m           │
        │                │                │
        │                │                │
        │         25m    ↓                │
        │         ├──────┤                │
        │                🏠               │
        │            Nhà của User         │
        │                                 │
        └─────────────────────────────────┘
                Vùng cảnh báo

✅ Distance (25m) ≤ Alert Radius (50m)
   → GỬI CẢNH BÁO!
```

---

## 🔢 Ví dụ cụ thể

### **Ví dụ 1: TRONG bán kính → ✅ Cảnh báo**

```
Sensor:        🚨 SENSOR_ROAD (ngập 85cm)
User location: 🏠 Nhà (25m từ sensor)
Alert radius:  50m

Phân tích:
- Distance: 25m
- Alert radius: 50m
- 25 ≤ 50 → ✅ CẢNH BÁO

Email: "Ngập gần Nhà của bạn, cách 25m!"
```

---

### **Ví dụ 2: NGOÀI bán kính → ❌ Không cảnh báo**

```
Sensor:        🚨 SENSOR_ROAD (ngập 85cm)
User location: 🏫 Trường (60m từ sensor)
Alert radius:  50m

Phân tích:
- Distance: 60m
- Alert radius: 50m
- 60 > 50 → ❌ KHÔNG CẢNH BÁO

Lý do: Quá xa, user không bị ảnh hưởng
```

---

### **Ví dụ 3: ĐÚNG BẰNG bán kính → ✅ Cảnh báo**

```
Sensor:        🚨 SENSOR_ROAD (ngập 85cm)
User location: 🏢 Công ty (50m từ sensor)
Alert radius:  50m

Phân tích:
- Distance: 50m
- Alert radius: 50m
- 50 ≤ 50 → ✅ CẢNH BÁO

Note: Bằng đúng vẫn cảnh báo (<=, không phải <)
```

---

## 🎨 Visual: Multiple alert radius

```
                      SENSOR_ROAD 🚨
                           │
        ╔══════════════════╪══════════════════╗
        ║                  │                  ║
        ║   Alert Radius: 100m               ║
        ║                  │                  ║
        ║     ┌────────────┼──────────┐      ║
        ║     │            │          │      ║
        ║     │ Alert Radius: 50m     │      ║
        ║     │            │          │      ║
        ║     │     ┌──────┼─────┐    │      ║
        ║     │     │      │     │    │      ║
        ║     │     │ Alert: 20m│    │      ║
        ║     │     │   🏠  │    │    │      ║
        ║     │     │   25m │    │    │      ║
        ║     │     │      ↓     │    │      ║
        ║     │     └────────────┘    │      ║
        ║     │                       │      ║
        ║     └───────────────────────┘      ║
        ║                                    ║
        ╚════════════════════════════════════╝

Kết quả:
- Alert radius = 20m: ❌ KHÔNG (25 > 20)
- Alert radius = 50m: ✅ CÓ (25 ≤ 50)
- Alert radius = 100m: ✅ CÓ (25 ≤ 100)
```

---

## 🔧 Tùy chỉnh Alert Radius

### **Theo loại địa điểm:**

```javascript
🏠 Nhà (residential):
   alertRadius: 50m
   → Cảnh báo sớm, ưu tiên cao

🏢 Công ty (office):
   alertRadius: 100m
   → Cảnh báo để có thời gian chuẩn bị

🏫 Trường (school):
   alertRadius: 200m
   → Cảnh báo rộng để tránh đưa trẻ đến trường

⛽ Cửa hàng (store):
   alertRadius: 30m
   → Chỉ cảnh báo khi rất gần

🏥 Bệnh viện (hospital):
   alertRadius: 500m
   → Cảnh báo rất rộng (quan trọng)
```

---

## 📊 So sánh bán kính

| Radius | Use case | Ví dụ |
|--------|----------|-------|
| 10-20m | Rất gần, khẩn cấp | Nhà, xe đang đỗ |
| 30-50m | Gần, cần hành động | Nhà, công ty |
| 100-200m | Trung bình, chuẩn bị | Trường, siêu thị |
| 500m+ | Rộng, cảnh báo sớm | Bệnh viện, sân bay |

---

## 🧮 Công thức tính khoảng cách

```javascript
// Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // km
}

// Sử dụng:
const distanceKm = calculateDistance(16.0125, 108.2442, 16.01272, 108.24420);
const distanceMeters = distanceKm * 1000; // 24.95m
```

---

## 🎯 Best Practices

### **1. Chọn radius phù hợp:**
```javascript
// ✅ GOOD: Dựa vào loại địa điểm
if (location.type === 'residential') {
  alertRadius = 50; // Nhà → 50m
} else if (location.type === 'office') {
  alertRadius = 100; // Công ty → 100m
}

// ❌ BAD: Dùng chung 1 radius cho tất cả
alertRadius = 100; // Không phân biệt
```

### **2. Tránh radius quá lớn:**
```javascript
// ❌ BAD: Quá lớn, spam alerts
alertRadius = 5000; // 5km - sẽ nhận rất nhiều cảnh báo

// ✅ GOOD: Vừa phải
alertRadius = 50; // 50m - chỉ khi thật sự gần
```

### **3. Priority + Radius:**
```javascript
// High priority → radius nhỏ hơn, cảnh báo chính xác hơn
if (location.priority === 'high') {
  alertRadius = 30;
}

// Low priority → radius lớn hơn, cảnh báo sớm hơn
if (location.priority === 'low') {
  alertRadius = 200;
}
```

---

## 📱 UI/UX cho User

### **Hiển thị radius trên map:**
```javascript
// Draw circle trên bản đồ
<Circle
  center={location.coords}
  radius={location.alertRadius}
  fillColor="rgba(255, 0, 0, 0.2)"
  strokeColor="#ff0000"
/>
```

### **Slider để user chọn:**
```jsx
<Slider
  min={10}
  max={500}
  step={10}
  value={alertRadius}
  onChange={(value) => setAlertRadius(value)}
/>

<p>Bán kính cảnh báo: {alertRadius}m</p>
```

---

## 🔍 Debug Tips

### **1. Check distance:**
```javascript
console.log(`Distance: ${distance}m`);
console.log(`Alert radius: ${alertRadius}m`);
console.log(`Will alert: ${distance <= alertRadius}`);
```

### **2. Visualize:**
- Vẽ circle trên map với radius
- Plot sensor và user location
- Check overlap

### **3. Test cases:**
```javascript
testCase(25, 50, true);   // distance=25m, radius=50m → alert
testCase(50, 50, true);   // distance=50m, radius=50m → alert
testCase(51, 50, false);  // distance=51m, radius=50m → no alert
testCase(5, 50, true);    // distance=5m, radius=50m → alert (urgent!)
```

---

## 🎓 Advanced: Dynamic Radius

### **Tự động điều chỉnh theo thời gian:**
```javascript
// Ban ngày: radius nhỏ hơn (user có thể di chuyển)
const hour = new Date().getHours();
if (hour >= 6 && hour <= 18) {
  alertRadius = 50;
} else {
  // Ban đêm: radius lớn hơn (user ngủ, cần cảnh báo sớm)
  alertRadius = 100;
}
```

### **Theo mức độ nguy hiểm:**
```javascript
// Mực nước càng cao → radius càng lớn
if (waterLevel > 80) {
  alertRadius = location.alertRadius * 2; // Gấp đôi radius
}
```

---

## 📚 Tài liệu liên quan

- [QUICK_TEST_PERSONALIZED_ALERT.md](./Backend/QUICK_TEST_PERSONALIZED_ALERT.md)
- [PERSONALIZED_ALERT_TEST_GUIDE.md](./Backend/PERSONALIZED_ALERT_TEST_GUIDE.md)

---

**💡 Tóm lại: Alert Radius = khoảng cách MÀ trong đó user muốn nhận cảnh báo!**


