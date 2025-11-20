/**
 * Telegram Routes
 * Routes cho Telegram Bot và QR Code
 */

const express = require('express');
const router = express.Router();
const { getTelegramQRInfo, getBotInfo } = require('../controllers/telegramQRController');

/**
 * @route GET /api/telegram/qr-info
 * @desc Lấy thông tin để tạo QR code
 * @access Public
 */
router.get('/qr-info', getTelegramQRInfo);

/**
 * @route GET /api/telegram/info
 * @desc Lấy thông tin chi tiết về bot
 * @access Public
 */
router.get('/info', getBotInfo);

module.exports = router;
