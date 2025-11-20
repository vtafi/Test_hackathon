const express = require("express");
const config = require("./configs");
const routes = require("./routes");
const {
  corsMiddleware,
  errorHandler,
  requestLogger,
} = require("./utils/middleware");
const firebaseClient = require("./integrations/firebaseClient");
const iotListener = require("./iot/iotListener");

// Validate environment variables
config.validateEnv();

const app = express();

// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(requestLogger);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🌊 Flood Alert API is running!",
    version: "2.0.0",
    endpoints: {
      health: "GET /",
      testEmail: "POST /api/send-test-email",
      floodAlert: "POST /api/send-flood-alert",
      generateAIAlert: "POST /api/generate-flood-alert",
      checkFirebase: "POST /api/check-firebase-and-alert",
      checkIoT: "POST /api/check-iot-data",
      sensors: "GET /api/firebase/sensors",
      // Personalized Alerts
      checkUserLocations: "POST /api/check-user-locations-alert",
      getUserLocations: "GET /api/user-locations/:userId",
      analyzeWeather: "POST /api/analyze-weather-alert",
    },
  });
});

// Mount API routes
app.use(routes);

// Error handler
app.use(errorHandler);

// ==========================================
// 🔥 FIREBASE INITIALIZATION
// ==========================================
// Luôn khởi tạo Firebase nếu có cấu hình (cho API endpoints)
if (config.firebaseServiceAccountKey && config.firebaseDatabaseURL) {
  try {
    firebaseClient.initialize();
    
    // Nếu bật listener, start listening
    if (config.enableFirebaseListener) {
      iotListener.start(config.alertEmailRecipients);
      console.log("🔥 Firebase IoT Listener đã bật");
    }
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error.message);
    console.log(
      "💡 Tip: Kiểm tra FIREBASE_SERVICE_ACCOUNT_KEY và FIREBASE_DATABASE_URL trong .env"
    );
  }
} else {
  console.log(
    "ℹ️ Firebase chưa cấu hình. Các API Firebase sẽ không hoạt động."
  );
}

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/\n`);
});

module.exports = app;
