const express = require("express");
const alertController = require("../controllers/alertController");
const personalizedAlertController = require("../controllers/personalizedAlertController");

const router = express.Router();

// Email routes
router.post(
  "/send-email",
  alertController.sendCustomEmail.bind(alertController)
);
router.post(
  "/send-test-email",
  alertController.sendTestEmail.bind(alertController)
);
router.post(
  "/send-flood-alert",
  alertController.sendFloodAlert.bind(alertController)
);
router.post(
  "/send-weather-update",
  alertController.sendWeatherUpdate.bind(alertController)
);

// AI alert generation
router.post(
  "/generate-flood-alert",
  alertController.generateFloodAlert.bind(alertController)
);

// Firebase + Alert
router.post(
  "/check-firebase-and-alert",
  alertController.checkFirebaseAndAlert.bind(alertController)
);
router.post(
  "/check-iot-data",
  alertController.checkIoTData.bind(alertController)
);

// ==========================================
// 🎯 PERSONALIZED ALERTS - User Locations
// ==========================================
router.post(
  "/check-user-locations-alert",
  personalizedAlertController.checkUserLocationsAlert.bind(
    personalizedAlertController
  )
);

router.get(
  "/user-locations/:userId",
  personalizedAlertController.getUserLocations.bind(
    personalizedAlertController
  )
);

router.post(
  "/analyze-weather-alert",
  personalizedAlertController.analyzeWeatherAlert.bind(
    personalizedAlertController
  )
);

module.exports = router;
