#include <WiFi.h>
#include <WiFiManager.h>      // <<< Cung cấp Auto Pop-up và Quét mạng >>>
#include <Preferences.h>      
#include "esp_sleep.h"        // Giữ lại để dùng cho ESP.restart()

// ===================================
// 1. KHAI BÁO CẤU HÌNH VÀ BIẾN TOÀN CỤC
// ===================================
String DEVICE_ID = "DEFAULT_SENSOR"; 
float DEVICE_LATITUDE = 16.0125;
float DEVICE_LONGITUDE = 108.2442;

#define AP_SSID "WIFI_CONFIG_SENSOR" 
#define AP_PASSWORD "12345678" 

// ĐỐI TƯỢNG TOÀN CỤC
WiFiManager wm;
Preferences preferences;

// KHAI BÁO CÁC TRƯỜNG TÙY CHỈNH (WiFiManagerParameters)
WiFiManagerParameter custom_name("name", "Ten Thiet Bi", DEVICE_ID.c_str(), 40);
WiFiManagerParameter custom_lat("lat", "Vi do (Latitude)", String(DEVICE_LATITUDE, 6).c_str(), 15);
WiFiManagerParameter custom_lon("lon", "Kinh do (Longitude)", String(DEVICE_LONGITUDE, 6).c_str(), 15);


// ===================================
// 2. HÀM CALLBACK (Lưu dữ liệu tùy chỉnh sau khi nhấn nút Save)
// ===================================
void saveConfigCallback() {
    Serial.println("WiFiManager config saved. Updating custom fields...");
    
    // Đọc giá trị từ form
    String newName = custom_name.getValue();
    float newLat = String(custom_lat.getValue()).toFloat();
    float newLon = String(custom_lon.getValue()).toFloat();

    // Lưu vào bộ nhớ Preferences
    preferences.begin("sensor-config", false);
    preferences.putString("device_name", newName);
    preferences.putFloat("latitude", newLat);
    preferences.putFloat("longitude", newLon);
    preferences.end();
    
    // Cập nhật biến toàn cục
    DEVICE_ID = newName;
    DEVICE_LATITUDE = newLat;
    DEVICE_LONGITUDE = newLon;
    
    // Tự khởi động lại để kết nối với tên/vị trí mới
    ESP.restart(); 
}


// ===================================
// 3. SETUP (Logic Tự động Kết nối)
// ===================================
void setup() {
    Serial.begin(115200);
    Serial.println("\nStarting AUTOMATIC WiFi Provisioning...");

    // 1. TẢI CẤU HÌNH ĐÃ LƯU VÀO BIẾN TOÀN CỤC
    preferences.begin("sensor-config", true); 
    String ssid = preferences.getString("ssid", ""); 
    String pass = preferences.getString("pass", "");

    // Cập nhật các biến toàn cục và gán vào tham số custom
    DEVICE_ID = preferences.getString("device_name", "DEFAULT_SENSOR"); 
    DEVICE_LATITUDE = preferences.getFloat("latitude", 16.0125); 
    DEVICE_LONGITUDE = preferences.getFloat("longitude", 108.2442);
    preferences.end();

    // 2. CẤU HÌNH WIFI MANAGER
    
    // Thêm các trường tùy chỉnh vào Portal
    wm.addParameter(&custom_name);
    wm.addParameter(&custom_lat);
    wm.addParameter(&custom_lon);

    // Đăng ký hàm callback để lưu dữ liệu khi người dùng nhấn nút Save
    wm.setSaveConfigCallback(saveConfigCallback);

    // 3. THỬ KẾT NỐI TỰ ĐỘNG
    if (!wm.autoConnect(AP_SSID, AP_PASSWORD)) {
        // ... (Logic thất bại giữ nguyên) ...
        ESP.restart(); 
    } 

    // Nếu kết nối thành công:
    Serial.println("✅ Connected to WiFi successfully!");
    Serial.print("Sensor Name: ");
    Serial.println(DEVICE_ID);
    
    // ... (CHÈN LOGIC FIREBASE/NTP CỦA BẠN VÀO ĐÂY) ...
}

// ===================================
// 4. LOOP (Logic Tối giản)
// ===================================
void loop() {
    // Không cần server.handleClient() hay delay lớn
    if (WiFi.status() == WL_CONNECTED) {
        // --- CHÈN LOGIC CHÍNH CỦA DỰ ÁN BẠN NẰM Ở ĐÂY ---
        // (Gửi dữ liệu Firebase và Deep Sleep)
        delay(2000); 
    } else {
        // Nếu Wi-Fi bị ngắt, chip sẽ tự động kết nối lại hoặc reset
        delay(2000); 
    }
}