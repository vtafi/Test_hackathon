const express = require('express');
const { sendEmail, sendFloodAlert, sendWeatherUpdate } = require('./emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// CORS middleware (cho phép frontend gọi API)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'Email Service API is running!' });
});

// Route gửi email thông thường (có thể custom)
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject'
      });
    }

    const result = await sendEmail(to, subject, html, text);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Route gửi email test nhanh (chỉ cần email)
app.post('/api/send-test-email', async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: to'
      });
    }

    const subject = '🌤️ Test Email từ Hệ thống Cảnh báo Thời tiết';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">🌤️ Email Test Thành Công!</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <p style="font-size: 16px; color: #333;">Xin chào!</p>
          <p style="color: #666;">Đây là email test từ hệ thống cảnh báo thời tiết Đà Nẵng.</p>
          <p style="color: #666;">Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
          <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #1565c0;">✅ Hệ thống email đang hoạt động bình thường!</p>
          </div>
        </div>
      </div>
    `;

    const result = await sendEmail(to, subject, html);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Route gửi cảnh báo lũ lụt
app.post('/api/send-flood-alert', async (req, res) => {
  try {
    const { to, alertData } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: to'
      });
    }

    const result = await sendFloodAlert(to, alertData || {});
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Route gửi cập nhật thời tiết
app.post('/api/send-weather-update', async (req, res) => {
  try {
    const { to, weatherData } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: to'
      });
    }

    const result = await sendWeatherUpdate(to, weatherData || {});
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Email service is running on port ${PORT}`);
  console.log(`Test the API at http://localhost:${PORT}`);
});
