/**
 * Telegram QR Code API
 * API để lấy thông tin QR code của Telegram Bot
 */

import client from './client';

/**
 * Lấy thông tin QR code cho Telegram Bot
 */
export const getTelegramQRInfo = async () => {
  try {
    const response = await client.get('/api/telegram/qr-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching Telegram QR info:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết về bot
 */
export const getBotInfo = async () => {
  try {
    const response = await client.get('/api/telegram/info');
    return response.data;
  } catch (error) {
    console.error('Error fetching bot info:', error);
    throw error;
  }
};
