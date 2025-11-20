#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "esp_sleep.h"
#include <time.h>
#include <sstream>

// ===================================
// 1. THÔNG TIN CẤU HÌNH & ĐỊNH DANH ----- TRÊN MẶT ĐƯỜNG
// ===================================

// <<< TỌA ĐỘ CHÍNH XÁC CỦA X796+H9 NGŨ HÀNH SƠN >>> - ĐẠI HỌC FPT ĐÀ NẴNG
#define DEVICE_LATITUDE 16.0125
#define DEVICE_LONGITUDE 108.2442

#define DEVICE_ID "SENSOR_ROAD"  // <<< ĐỊNH DANH DUY NHẤT
#define WIFI_SSID "Zone Six 107TDN 3"
#define WIFI_PASSWORD "107trandainghia"
#define FIREBASE_HOST "fir-hackathon-98bf5-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "venFsykta6xSIrjTydKoAk6lV194DNzt9urC8kFH"
#define FIREBASE_PATH_WATER "/iotData/" DEVICE_ID

// ===================================
// 2. NGƯỠNG VÀ BIẾN TOÀN CỤC (ĐÃ ĐIỀU CHỈNH CHO MẶT ĐƯỜNG)
// ===================================
#define WARNING_LEVEL 10        // Cảnh báo khi Nước trên đường >= 10 cm
#define DANGER_LEVEL 25         // Nguy hiểm khi Nước trên đường >= 25 cm
#define SLEEP_TIME_US 60000000  // 60 giây ngủ (Cho mục đích test)
#define SEND_INTERVAL_MS 60000  // Gửi dữ liệu mỗi 60 giây (1 phút)

FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;
FirebaseData firebaseData;

// ===================================
// SETUP: Kết nối Wi-Fi và Firebase
// ===================================
void setup() {
  Serial.begin(115200);
  Serial.printf("\n--- Starting Monitoring: %s ---\n", DEVICE_ID);

  // Kết nối WiFi (Giữ nguyên logic của bạn)
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConnected to WiFi.");

  // CẤU HÌNH VÀ KẾT NỐI FIREBASE
  firebaseConfig.host = FIREBASE_HOST;
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);

  // === CẤU HÌNH THỜI GIAN NTP VÀ MÚI GIỜ ===

  // 1. Cấu hình NTP (UTC Offset = 7*3600 giây)
  // 0: Không dùng DST (Giờ mùa hè), 7*3600: Offset 7 giờ (Việt Nam)
  configTime(7 * 3600, 0, "pool.ntp.org", "time.nist.gov");

  // 2. Cấu hình múi giờ
  setenv("TZ", "GMT-7", 1);  // ĐÃ SỬA: dùng GMT-7
  tzset();

  Serial.print("Syncing time");
  while (time(nullptr) < 100000) {
    Serial.print(".");
    delay(100);
  }
  Serial.println("\nTime synced!");
  // ===========================================

  randomSeed(micros());
}

// ===================================
// LOOP: Fake dữ liệu ĐƯỜNG (Mực nước thấp) và Ngủ sâu
// ===================================
void loop() {

  long long currentTimestampMs;

  if (Firebase.ready()) {

    // ------------------------------------
    // 1. ĐỌC VÀ FORMAT THỜI GIAN
    // ------------------------------------
    time_t now = time(nullptr);
    struct tm timeinfo;

    // Chuyển đổi sang thời gian địa phương (local time)
    localtime_r(&now, &timeinfo);

    char timeString[20];
    // Format thời gian cho Serial Monitor
    strftime(timeString, sizeof(timeString), "%H:%M:%S", &timeinfo);

    Serial.printf("⏰ Current Local Time: %s\n", timeString);

    // ------------------------------------
    // 2. TÍNH TOÁN TIMESTAMP (KHẮC PHỤC LỖI TRÀN SỐ)
    // ------------------------------------
    // Sử dụng 1000LL và ép kiểu 64-bit để đảm bảo không bị tràn số
    currentTimestampMs = (long long)now * 1000LL;

    // 3. CHUYỂN ĐỔI SỐ 64 - BIT THÀNH CHUỖI(KHẮC PHỤC LỖI TRUYỀN DỮ LIỆU) 
    char ts_str[20];                              // Khai báo buffer 20 ký tự
    sprintf(ts_str, "%lld", currentTimestampMs);  // Gửi số 64-bit vào chuỗi

    // ------------------------------------
    // ------------------------------------
    // A. FAKE DỮ LIỆU ĐƯỜNG: Mực nước thấp (5cm - 35cm)
    // ------------------------------------
    // Giả lập mực nước trên đường thường thấp hơn
    int waterLevel = random(5, 36);
    String status;

    if (waterLevel >= DANGER_LEVEL) {
      status = "DANGER";
    } else if (waterLevel >= WARNING_LEVEL) {
      status = "WARNING";
    } else {
      status = "NORMAL";
    }

    Serial.printf("[%s] Level: %d cm, Status: %s\n", DEVICE_ID, waterLevel, status.c_str());

    // ------------------------------------
    // B. GỬI DỮ LIỆU LÊN FIREBASE
    // ------------------------------------

    FirebaseJson jsonWater;

    // 2. Thêm tất cả dữ liệu
    jsonWater.set("device_id", DEVICE_ID);
    jsonWater.set("water_level_cm", waterLevel);
    jsonWater.set("flood_status", status);
    jsonWater.set("latitude", DEVICE_LATITUDE);
    jsonWater.set("longitude", DEVICE_LONGITUDE);

    // Gửi TIMESTAMP DẠNG SỐ (64-bit đã tính toán chính xác)
    jsonWater.set("timestamp", ts_str); // Gửi chuỗi timestamp

    // Gửi dữ liệu (Giữ nguyên)
    if (Firebase.RTDB.setJSON(&firebaseData, FIREBASE_PATH_WATER, &jsonWater)) {
      Serial.println("✅ Water Data sent successfully (Numeric Timestamp).");
    } else {
      Serial.printf("❌ Firebase Error: %s\n", firebaseData.errorReason().c_str());
    }
  }

  // ⏰ THROTTLE: Chỉ gửi dữ liệu 1 lần mỗi phút
  delay(SEND_INTERVAL_MS);  // Chờ 60 giây (1 phút) trước khi gửi lần tiếp theo
  Serial.printf("⏰ Đã gửi dữ liệu, chờ %d giây trước lần tiếp theo...\n", SEND_INTERVAL_MS / 1000);
}