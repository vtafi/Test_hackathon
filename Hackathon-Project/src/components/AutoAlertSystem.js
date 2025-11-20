/**
 * Auto Alert System Component
 * Tự động check alerts mỗi N phút và gửi email cho user
 */
import React, { useState, useEffect, useCallback } from 'react';
import { usePersonalizedAlert } from '../hooks/usePersonalizedAlert';
import { useFirebaseSensors } from '../hooks/useFirebaseSensors';
import { aiAlertApi } from '../api';
import authService from '../services/authService';
import './AutoAlertSystem.css';

const AutoAlertSystem = () => {
  const [user, setUser] = useState(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [checkInterval, setCheckInterval] = useState(15); // 15 minutes default
  const [waterLevelThreshold, setWaterLevelThreshold] = useState(50); // 50cm default
  const [riskLevelThreshold, setRiskLevelThreshold] = useState(1); // 1 = warning and above
  const [lastCheck, setLastCheck] = useState(null);
  const [nextCheck, setNextCheck] = useState(null);
  const [alertHistory, setAlertHistory] = useState([]);
  const [stats, setStats] = useState({
    totalChecks: 0,
    alertsSent: 0,
    alertsSkipped: 0,
    lastAlertTime: null,
  });

  const { 
    checkLocationsAndAlert, 
    locations 
  } = usePersonalizedAlert(user?.uid);

  const { 
    sensors, 
    dangerousSensors 
  } = useFirebaseSensors(isAutoEnabled, 5000);

  // Get current user
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Auto check function
  const performAutoCheck = useCallback(async () => {
    if (!user || !isAutoEnabled) return;

    console.log('🔄 Auto checking alerts...');
    console.log(`⚙️ Settings: Water Level >= ${waterLevelThreshold}cm, Risk Level >= ${riskLevelThreshold}`);
    
    const checkTime = new Date();
    setLastCheck(checkTime);
    
    try {
      // 1. Check user locations with custom risk threshold
      const locationResult = await checkLocationsAndAlert(
        riskLevelThreshold, // Use user's custom threshold
        true // sendEmail = true
      );

      // 2. Check sensors với ngưỡng mức nước tùy chỉnh
      let sensorAlerts = [];
      let skippedSensors = 0;
      
      if (dangerousSensors.length > 0) {
        for (const sensor of dangerousSensors) {
          // Check nếu mức nước vượt ngưỡng người dùng đặt
          const waterLevel = sensor.water_level_cm || 0;
          
          if (waterLevel >= waterLevelThreshold) {
            try {
              console.log(`⚠️ Sensor ${sensor.id}: ${waterLevel}cm >= ${waterLevelThreshold}cm → Sending alert`);
              
              const alertResult = await aiAlertApi.generateAlertFromSensor(
                sensor,
                user.email
              );
              
              sensorAlerts.push({
                type: 'sensor',
                sensor: sensor.id,
                waterLevel: waterLevel,
                result: alertResult,
              });
            } catch (err) {
              console.error('Error generating sensor alert:', err);
            }
          } else {
            console.log(`✅ Sensor ${sensor.id}: ${waterLevel}cm < ${waterLevelThreshold}cm → Skipped`);
            skippedSensors++;
          }
        }
      }

      // Update stats
      const totalAlerts = (locationResult.alerts?.length || 0) + sensorAlerts.length;
      
      setStats(prev => ({
        totalChecks: prev.totalChecks + 1,
        alertsSent: prev.alertsSent + totalAlerts,
        alertsSkipped: prev.alertsSkipped + skippedSensors,
        lastAlertTime: totalAlerts > 0 ? checkTime : prev.lastAlertTime,
      }));

      // Add to history
      const historyItem = {
        time: checkTime,
        locationAlerts: locationResult.alerts?.length || 0,
        sensorAlerts: sensorAlerts.length,
        skippedSensors: skippedSensors,
        totalAlerts: totalAlerts,
        thresholds: {
          waterLevel: waterLevelThreshold,
          riskLevel: riskLevelThreshold,
        },
        success: true,
      };
      
      setAlertHistory(prev => [historyItem, ...prev].slice(0, 10));

      console.log(`✅ Auto check completed: ${totalAlerts} alerts sent, ${skippedSensors} skipped`);
    } catch (error) {
      console.error('❌ Auto check failed:', error);
      
      setAlertHistory(prev => [{
        time: checkTime,
        error: error.message,
        success: false,
      }, ...prev].slice(0, 10));
    }
  }, [user, isAutoEnabled, checkLocationsAndAlert, dangerousSensors, waterLevelThreshold, riskLevelThreshold]);

  // Setup auto check interval
  useEffect(() => {
    if (!isAutoEnabled || !user) {
      setNextCheck(null);
      return;
    }

    // Initial check
    performAutoCheck();

    // Setup interval
    const intervalMs = checkInterval * 60 * 1000; // Convert minutes to ms
    const intervalId = setInterval(() => {
      performAutoCheck();
    }, intervalMs);

    // Update next check time
    const updateNextCheck = setInterval(() => {
      if (lastCheck) {
        const next = new Date(lastCheck.getTime() + intervalMs);
        setNextCheck(next);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(updateNextCheck);
    };
  }, [isAutoEnabled, user, checkInterval, performAutoCheck, lastCheck]);

  const toggleAutoAlert = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này!');
      return;
    }
    
    if (!isAutoEnabled && locations.length === 0) {
      alert('Bạn chưa có địa điểm nào! Vui lòng thêm địa điểm trong trang Personalized Alerts.');
      return;
    }

    setIsAutoEnabled(!isAutoEnabled);
  };

  const formatTimeRemaining = () => {
    if (!nextCheck || !lastCheck) return '--:--';
    
    const now = new Date();
    const remaining = Math.max(0, nextCheck - now);
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="auto-alert-system">
      {/* Hero Section - Auto Alert */}
      <div className="auto-alert-header">
        <div className="header-left">
          <div className="header-icon">
            🤖
          </div>
          <div className="header-content">
            <h2>Hệ thống Cảnh báo Tự động</h2>
            <p>Robot sẽ tự động quét dữ liệu và gửi email khi đạt ngưỡng.</p>
          </div>
        </div>
        
        <div className="toggle-container">
          <span className={`toggle-status ${isAutoEnabled ? 'active' : ''}`}>
            {isAutoEnabled ? 'Đang hoạt động' : 'Đã tạm dừng'}
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isAutoEnabled}
              onChange={toggleAutoAlert}
              disabled={!user}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* User Info - Compact */}
      {!user && (
        <div className="login-required">
          <p>⚠️ Vui lòng đăng nhập để sử dụng tính năng tự động</p>
        </div>
      )}

      {/* Content Grid */}
      {user && (
        <div className="compact-settings-grid">
          {/* User Profile Card */}
          <div className="info-card-compact">
            <div style={{display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '24px'}}>
              <h3>Hồ sơ người dùng</h3>
            </div>
            
            <div className="user-profile-center">
              <div className="user-avatar-wrapper">
                <div className="user-avatar">
                  👤
                </div>
              </div>
              <h4 className="user-name">
                {user.displayName || user.email.split('@')[0]}
              </h4>
              <span className="user-email">
                {user.email}
              </span>
            </div>

            <div className="user-stats">
              <div className="user-stat-item">
                <span className="user-stat-value">{locations.length}</span>
                <span className="user-stat-label">Địa điểm</span>
              </div>
              <div className="user-stat-item">
                <span className="user-stat-value">{isAutoEnabled ? 'Active' : 'Inactive'}</span>
                <span className="user-stat-label">Trạng thái</span>
              </div>
            </div>
          </div>

          {/* Settings Form Card */}
          <div className="settings-card-compact">
            <h3>
              <i className="fas fa-sliders" style={{color: '#4f46e5'}}></i>
              Thiết lập thông số
            </h3>
            
            <form>
              {/* Frequency */}
              <div className="setting-row">
                <label className="setting-label">Tần suất kiểm tra</label>
                <select
                  className="glass-select"
                  value={checkInterval}
                  onChange={(e) => setCheckInterval(parseInt(e.target.value))}
                  disabled={isAutoEnabled}
                >
                  <option value="1">Mỗi 1 phút</option>
                  <option value="5">Mỗi 5 phút</option>
                  <option value="10">Mỗi 10 phút</option>
                  <option value="15">Mỗi 15 phút</option>
                  <option value="30">Mỗi 30 phút</option>
                  <option value="60">Mỗi 1 giờ</option>
                </select>
              </div>

              {/* Water Level Threshold */}
              <div className="setting-row">
                <label className="setting-label">Ngưỡng nước kích hoạt (cm)</label>
                <div className="input-with-icon">
                  <i className="fas fa-water input-icon-left"></i>
                  <input
                    type="number"
                    className="glass-input"
                    value={waterLevelThreshold}
                    onChange={(e) => setWaterLevelThreshold(parseInt(e.target.value) || 0)}
                    disabled={isAutoEnabled}
                    min="0"
                    max="200"
                  />
                  <span className="input-unit">cm</span>
                </div>
              </div>

              {/* Alert Level */}
              <div className="setting-row">
                <label className="setting-label">Mức độ cảnh báo</label>
                <div className="radio-group">
                  <div className="radio-option">
                    <input
                      type="radio"
                      name="level"
                      id="level-low"
                      value="1"
                      checked={riskLevelThreshold === 1}
                      onChange={(e) => setRiskLevelThreshold(parseInt(e.target.value))}
                      disabled={isAutoEnabled}
                    />
                    <label htmlFor="level-low" className="radio-label level-low">
                      Cảnh báo+
                    </label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      name="level"
                      id="level-medium"
                      value="2"
                      checked={riskLevelThreshold === 2}
                      onChange={(e) => setRiskLevelThreshold(parseInt(e.target.value))}
                      disabled={isAutoEnabled}
                    />
                    <label htmlFor="level-medium" className="radio-label">
                      Nguy hiểm+
                    </label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      name="level"
                      id="level-high"
                      value="3"
                      checked={riskLevelThreshold === 3}
                      onChange={(e) => setRiskLevelThreshold(parseInt(e.target.value))}
                      disabled={isAutoEnabled}
                    />
                    <label htmlFor="level-high" className="radio-label level-high">
                      Khẩn cấp
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compact Stats - Only show if active */}
      {isAutoEnabled && (
        <div className="compact-stats">
          <div className="stat-item-compact">
            <span className="stat-icon-small">🔍</span>
            <span className="stat-number">{stats.totalChecks}</span>
            <span className="stat-text">lần check</span>
          </div>
          <div className="stat-item-compact">
            <span className="stat-icon-small">📧</span>
            <span className="stat-number">{stats.alertsSent}</span>
            <span className="stat-text">email</span>
          </div>
          <div className="stat-item-compact">
            <span className="stat-icon-small">⏭️</span>
            <span className="stat-number">{stats.alertsSkipped}</span>
            <span className="stat-text">bỏ qua</span>
          </div>
          <div className="stat-item-compact">
            <span className="stat-icon-small">⚠️</span>
            <span className="stat-number danger">{dangerousSensors.length}</span>
            <span className="stat-text">cảnh báo</span>
          </div>
        </div>
      )}

      {/* Compact History - Show only last 3 */}
      {alertHistory.length > 0 && isAutoEnabled && (
        <div className="compact-history">
          <h4>📜 Lịch sử gần đây</h4>
          <div className="history-compact-list">
            {alertHistory.slice(0, 3).map((item, index) => (
              <div key={index} className={`history-compact-item ${item.success ? 'success' : 'error'}`}>
                <span className="history-time-compact">
                  {item.time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {item.success ? (
                  <>
                    <span className="history-badge">📧 {item.totalAlerts}</span>
                    {item.skippedSensors > 0 && (
                      <span className="history-badge skip">⏭️ {item.skippedSensors}</span>
                    )}
                  </>
                ) : (
                  <span className="history-error-compact">❌ Lỗi</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Sensors - Compact */}
      {isAutoEnabled && sensors && (
        <div className="sensors-compact">
          <h4>🌊 Sensors (Real-time)</h4>
          <div className="sensors-compact-grid">
            {sensors.SENSOR_ROAD && (
              <div className={`sensor-compact ${
                sensors.SENSOR_ROAD.flood_status === 'DANGER' ? 'danger' : 'safe'
              }`}>
                <span className="sensor-icon">🚗</span>
                <div className="sensor-info">
                  <div className="sensor-name-small">ROAD</div>
                  <div className="sensor-value">{sensors.SENSOR_ROAD.water_level_cm}cm</div>
                </div>
              </div>
            )}
            
            {sensors.SENSOR_SEWER && (
              <div className={`sensor-compact ${
                sensors.SENSOR_SEWER.flood_status === 'DANGER' ? 'danger' : 'safe'
              }`}>
                <span className="sensor-icon">🚰</span>
                <div className="sensor-info">
                  <div className="sensor-name-small">SEWER</div>
                  <div className="sensor-value">{sensors.SENSOR_SEWER.water_level_cm}cm</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoAlertSystem;

