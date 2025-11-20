/**
 * Telegram Bot Long Polling Service
 * Dịch vụ lắng nghe và đăng ký người dùng thông qua Long Polling
 */

require('dotenv').config();
const axios = require('axios');
const { saveTelegramUser, deactivateUser } = require('./firebaseRealtimeManager');

// Cấu hình Bot
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const POLLING_TIMEOUT = 60; // Timeout 60 giây

// Biến theo dõi offset
let updateOffset = 0;

/**
 * Gửi tin nhắn tới người dùng Telegram
 * @param {string} chatId - Telegram Chat ID
 * @param {string} message - Nội dung tin nhắn
 * @param {object} options - Tùy chọn bổ sung (parse_mode, reply_markup, etc.)
 */
async function sendMessage(chatId, message, options = {}) {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: options.parse_mode || 'Markdown',
      ...options
    });
    
    if (response.data.ok) {
      console.log(`✉️ Đã gửi tin nhắn tới ${chatId}`);
      return response.data.result;
    } else {
      console.error(`❌ Lỗi gửi tin nhắn tới ${chatId}:`, response.data.description);
      return null;
    }
  } catch (error) {
    console.error(`❌ Lỗi gửi tin nhắn tới ${chatId}:`, error.message);
    return null;
  }
}

/**
 * Xử lý lệnh /start
 * @param {object} message - Telegram message object
 */
async function handleStartCommand(message) {
  const chatId = message.chat.id;
  const username = message.from.username || 'Unknown';
  const firstName = message.from.first_name || '';
  const lastName = message.from.last_name || '';
  
  try {
    // Lưu người dùng vào Firestore
    const result = await saveTelegramUser(chatId, {
      username,
      first_name: firstName,
      last_name: lastName
    });
    
    // Tin nhắn chào mừng
    const welcomeMessage = `
🌊 *Chào mừng đến với Hệ thống Cảnh báo Ngập lụt Đà Nẵng!* 🌧️

Xin chào *${firstName}*! 👋

✅ Bạn đã đăng ký thành công nhận cảnh báo ngập lụt.

📍 *Những gì bạn sẽ nhận được:*
🔔 Cảnh báo ngập lụt khẩn cấp theo thời gian thực
🌊 Thông tin mực nước và khu vực nguy hiểm
⚠️ Khuyến nghị an toàn khi có ngập lụt

📱 Bạn sẽ nhận được thông báo tự động khi có cảnh báo ngập lụt trong khu vực.

🛡️ Hãy luôn cảnh giác và an toàn!
    `.trim();
    
    await sendMessage(chatId, welcomeMessage);
    
    console.log(`✅ Người dùng ${chatId} (${username}) đã ${result.isNew ? 'đăng ký mới' : 'kích hoạt lại'}`);
  } catch (error) {
    console.error(`❌ Lỗi xử lý lệnh /start cho ${chatId}:`, error.message);
    await sendMessage(
      chatId,
      '❌ Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.'
    );
  }
}

/**
 * Xử lý lệnh /stop
 * @param {object} message - Telegram message object
 */
async function handleStopCommand(message) {
  const chatId = message.chat.id;
  
  try {
    await deactivateUser(chatId);
    
    const goodbyeMessage = `
👋 *Tạm biệt!*

Bạn đã hủy đăng ký nhận cảnh báo ngập lụt.

Để đăng ký lại, sử dụng lệnh /start bất kỳ lúc nào.

🙏 Cảm ơn bạn đã sử dụng dịch vụ!
    `.trim();
    
    await sendMessage(chatId, goodbyeMessage);
    console.log(`✅ Người dùng ${chatId} đã hủy đăng ký`);
  } catch (error) {
    console.error(`❌ Lỗi xử lý lệnh /stop cho ${chatId}:`, error.message);
  }
}

/**
 * Xử lý lệnh /status
 * @param {object} message - Telegram message object
 */
async function handleStatusCommand(message) {
  const chatId = message.chat.id;
  
  const statusMessage = `
📊 *Trạng thái Hệ thống*

✅ Bot đang hoạt động bình thường
🔔 Bạn đang nhận cảnh báo
🕐 Cập nhật: ${new Date().toLocaleString('vi-VN')}

📱 Sử dụng /help để xem danh sách lệnh
  `.trim();
  
  await sendMessage(chatId, statusMessage);
}

/**
 * Xử lý lệnh /help
 * @param {object} message - Telegram message object
 */
async function handleHelpCommand(message) {
  const chatId = message.chat.id;
  
  const helpMessage = `
📖 *Hướng dẫn Sử dụng*

*Các lệnh có sẵn:*
/start - Đăng ký nhận cảnh báo
/stop - Hủy đăng ký
/status - Kiểm tra trạng thái
/help - Hiển thị hướng dẫn

⚡ *Cảnh báo tự động:*
Bot sẽ tự động gửi cảnh báo khi phát hiện nguy cơ ngập lụt.

💡 *Mẹo:* Bật thông báo để không bỏ lỡ cảnh báo khẩn cấp!
  `.trim();
  
  await sendMessage(chatId, helpMessage);
}

/**
 * Xử lý tin nhắn từ người dùng
 * @param {object} message - Telegram message object
 */
async function handleMessage(message) {
  const text = message.text || '';
  
  if (text.startsWith('/start')) {
    await handleStartCommand(message);
  } else if (text.startsWith('/stop')) {
    await handleStopCommand(message);
  } else if (text.startsWith('/status')) {
    await handleStatusCommand(message);
  } else if (text.startsWith('/help')) {
    await handleHelpCommand(message);
  } else {
    // Tin nhắn thông thường
    const chatId = message.chat.id;
    await sendMessage(
      chatId,
      '👋 Xin chào! Sử dụng /help để xem danh sách lệnh.'
    );
  }
}

/**
 * Xử lý các updates từ Telegram
 * @param {Array} updates - Danh sách updates
 */
async function processUpdates(updates) {
  for (const update of updates) {
    try {
      // Cập nhật offset
      updateOffset = Math.max(updateOffset, update.update_id + 1);
      
      // Xử lý tin nhắn
      if (update.message) {
        await handleMessage(update.message);
      }
    } catch (error) {
      console.error('❌ Lỗi xử lý update:', error.message);
    }
  }
}

/**
 * Lấy updates từ Telegram sử dụng Long Polling
 */
async function getUpdates() {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`, {
      params: {
        offset: updateOffset,
        timeout: POLLING_TIMEOUT,
        allowed_updates: ['message']
      },
      timeout: (POLLING_TIMEOUT + 5) * 1000 // Thêm 5 giây buffer
    });
    
    if (response.data.ok && response.data.result.length > 0) {
      console.log(`📨 Nhận được ${response.data.result.length} updates mới`);
      await processUpdates(response.data.result);
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      // Timeout bình thường, không cần báo lỗi
      return;
    }
    console.error('❌ Lỗi lấy updates:', error.message);
    // Chờ 5 giây trước khi thử lại
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

/**
 * Khởi động Bot với Long Polling
 */
async function startBot() {
  console.log('🤖 Khởi động Telegram Bot (Long Polling)...');
  console.log('🔥 Sử dụng Firebase Realtime Database (REST API)');
  
  // Kiểm tra Bot Token
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getMe`);
    if (response.data.ok) {
      console.log(`✅ Bot đã kết nối: @${response.data.result.username}`);
    } else {
      console.error('❌ Bot Token không hợp lệ');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Không thể kết nối với Telegram API:', error.message);
    process.exit(1);
  }
  
  console.log('🔄 Bắt đầu Long Polling...');
  console.log('📡 Đang lắng nghe tin nhắn từ người dùng...\n');
  
  // Vòng lặp Long Polling vô tận
  while (true) {
    await getUpdates();
  }
}

// Xử lý tắt ứng dụng gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Đang dừng Bot...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Đang dừng Bot...');
  process.exit(0);
});

// Khởi động Bot
if (require.main === module) {
  startBot().catch(error => {
    console.error('❌ Lỗi nghiêm trọng:', error);
    process.exit(1);
  });
}

module.exports = {
  sendMessage,
  startBot
};
