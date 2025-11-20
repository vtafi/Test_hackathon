/**
 * Personalized Alert API Service
 * API calls cho tính năng cảnh báo cá nhân hóa dựa trên địa điểm của user
 */
import apiClient from './client';
import { API_ENDPOINTS } from './config';

/**
 * Kiểm tra tất cả địa điểm của user và gửi cảnh báo cá nhân hóa
 * @param {string} userId - Firebase User ID
 * @param {number} minRiskLevel - Mức độ rủi ro tối thiểu để gửi cảnh báo (0-3), default = 1
 * @param {boolean} sendEmail - Có gửi email không, default = true
 * @returns {Promise<Object>} - Response với analysis và alerts
 */
export const checkUserLocationsAndAlert = async (
  userId,
  minRiskLevel = 1,
  sendEmail = true
) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.CHECK_USER_LOCATIONS_ALERT,
      {
        userId,
        minRiskLevel,
        sendEmail,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error checking user locations:', error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả địa điểm của user
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} - { success, userId, count, locations: [...] }
 */
export const getUserLocations = async (userId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.GET_USER_LOCATIONS(userId)
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching locations for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Kiểm tra và gửi cảnh báo cho nhiều users
 * @param {Array<string>} userIds - Danh sách User IDs
 * @param {number} minRiskLevel - Mức độ rủi ro tối thiểu
 * @returns {Promise<Object>} - Kết quả tổng hợp
 */
export const checkMultipleUsersLocations = async (
  userIds,
  minRiskLevel = 1
) => {
  const promises = userIds.map((userId) =>
    checkUserLocationsAndAlert(userId, minRiskLevel, true)
  );

  const results = await Promise.allSettled(promises);

  return {
    totalUsers: userIds.length,
    successful: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
    results: results.map((r, index) => ({
      userId: userIds[index],
      status: r.status,
      data: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? r.reason.message : null,
    })),
  };
};

/**
 * Lấy thống kê về locations của user
 * @param {string} userId - Firebase User ID
 * @returns {Promise<Object>} - Statistics about user's locations
 */
export const getUserLocationStats = async (userId) => {
  try {
    const locationsData = await getUserLocations(userId);

    if (!locationsData.success) {
      throw new Error('Failed to fetch user locations');
    }

    const locations = locationsData.locations;
    const activeLocations = locations.filter((loc) => loc.is_active !== false);
    const dangerLocations = locations.filter(
      (loc) => loc.last_alert_status === 'danger' || loc.last_alert_status === 'critical'
    );

    return {
      total: locations.length,
      active: activeLocations.length,
      inactive: locations.length - activeLocations.length,
      inDanger: dangerLocations.length,
      locations: locations,
    };
  } catch (error) {
    console.error('Error getting user location stats:', error);
    throw error;
  }
};

/**
 * Kiểm tra 1 địa điểm cụ thể
 * @param {string} userId - User ID
 * @param {string} locationId - Location ID
 * @param {boolean} sendEmail - Có gửi email không
 */
export const checkSingleLocation = async (
  userId,
  locationId,
  sendEmail = true
) => {
  try {
    // Get all locations
    const locationsData = await getUserLocations(userId);

    if (!locationsData.success) {
      throw new Error('Failed to fetch user locations');
    }

    // Find the specific location
    const location = locationsData.locations.find((loc) => loc.id === locationId);

    if (!location) {
      throw new Error(`Location ${locationId} not found`);
    }

    // Check all locations but focus on this one
    const result = await checkUserLocationsAndAlert(userId, 0, sendEmail);

    // Filter to only this location
    const locationAlert = result.alerts?.find(
      (alert) => alert.locationName === location.name
    );

    return {
      success: true,
      location: location,
      alert: locationAlert || null,
      hasRisk: !!locationAlert,
    };
  } catch (error) {
    console.error('Error checking single location:', error);
    throw error;
  }
};

export default {
  checkUserLocationsAndAlert,
  getUserLocations,
  checkMultipleUsersLocations,
  getUserLocationStats,
  checkSingleLocation,
};

