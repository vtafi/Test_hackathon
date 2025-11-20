/**
 * Sensors Dashboard - Hiển thị dữ liệu 2 sensors SENSOR_ROAD và SENSOR_SEWER
 */
import React, { useState, useEffect } from 'react';
import { firebaseApi } from '../api';
import './SensorsDashboard.css';

const SensorsDashboard = () => {
  const [sensors, setSensors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false); // ✅ TẮT auto-refresh mặc định

  // Fetch dữ liệu sensors
  const fetchSensors = async () => {
    try {
      setLoading(true);
      const result = await firebaseApi.getAllSensors();
      setSensors(result.data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message || 'Lỗi khi lấy dữ liệu sensors');
      console.error('Error fetching sensors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh mỗi 5 giây
  useEffect(() => {
    console.log('🔍 SensorsDashboard: Component mounted');
    fetchSensors();

    if (autoRefresh) {
      console.log('🔄 SensorsDashboard: Auto-refresh enabled (mỗi 5s)');
      const interval = setInterval(fetchSensors, 5000);
      return () => {
        console.log('🛑 SensorsDashboard: Stopping auto-refresh');
        clearInterval(interval);
      };
    }
  }, [autoRefresh]);

  // Render 1 sensor card
  const renderSensorCard = (sensorId, sensorData) => {
    if (!sensorData) return null;

    const { flood_status, water_level_cm, latitude, longitude, timestamp } = sensorData;

    // Xác định màu và icon theo trạng thái
    const getStatusStyle = (status) => {
      const styles = {
        SAFE: { color: '#4caf50', icon: '✅', bg: '#e8f5e9' },
        WARNING: { color: '#ff9800', icon: '⚠️', bg: '#fff3e0' },
        DANGER: { color: '#f44336', icon: '🚨', bg: '#ffebee' },
        CRITICAL: { color: '#b71c1c', icon: '🔴', bg: '#ffcdd2' },
      };
      return styles[status] || { color: '#9e9e9e', icon: '❓', bg: '#f5f5f5' };
    };

    const statusStyle = getStatusStyle(flood_status);

    // Convert timestamp to readable format
    const formatTime = (ts) => {
      if (!ts) return 'N/A';
      const date = new Date(parseInt(ts));
      return date.toLocaleString('vi-VN');
    };

    // Tính phần trăm (giả sử max = 100cm)
    const percentage = Math.min(100, Math.round((water_level_cm / 100) * 100));

    return (
      <div className="sensor-card" style={{ borderLeft: `4px solid ${statusStyle.color}` }}>
        <div className="sensor-header">
          <h3>
            {sensorId === 'SENSOR_ROAD' ? '🛣️ Cảm biến đường' : '🚰 Cảm biến cống'}
          </h3>
          <div 
            className="sensor-status"
            style={{ 
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}
          >
            {statusStyle.icon} {flood_status}
          </div>
        </div>

        <div className="sensor-body">
          {/* Mực nước */}
          <div className="sensor-metric">
            <div className="metric-label">💧 Mực nước</div>
            <div className="metric-value">
              {water_level_cm} cm
              <span className="metric-percentage">({percentage}%)</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: statusStyle.color
                }}
              />
            </div>
          </div>

          {/* Vị trí */}
          <div className="sensor-metric">
            <div className="metric-label">📍 Vị trí</div>
            <div className="metric-value-small">
              Lat: {latitude?.toFixed(4)}, Lon: {longitude?.toFixed(4)}
            </div>
          </div>

          {/* Thời gian */}
          <div className="sensor-metric">
            <div className="metric-label">⏰ Cập nhật</div>
            <div className="metric-value-small">{formatTime(timestamp)}</div>
          </div>

          {/* ID thiết bị */}
          <div className="sensor-metric">
            <div className="metric-label">🔑 Device ID</div>
            <div className="metric-value-small">{sensorData.device_id || sensorId}</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !sensors) {
    return (
      <div className="sensors-dashboard loading">
        <div className="spinner">⏳</div>
        <p>Đang tải dữ liệu sensors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sensors-dashboard error">
        <div className="error-icon">❌</div>
        <h3>Lỗi khi tải dữ liệu</h3>
        <p>{error}</p>
        <button onClick={fetchSensors} className="retry-button">
          🔄 Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="sensors-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>📊 Giám sát Sensors</h1>
          <p className="last-update">
            Cập nhật lần cuối: {lastUpdate?.toLocaleTimeString('vi-VN')}
          </p>
        </div>
        
        <div className="header-right">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">
              {autoRefresh ? '🔄 Auto Refresh (5s)' : '⏸️ Paused'}
            </span>
          </label>

          <button onClick={fetchSensors} className="refresh-button" disabled={loading}>
            {loading ? '⏳' : '🔄'} Làm mới
          </button>
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="sensors-grid">
        {renderSensorCard('SENSOR_ROAD', sensors?.SENSOR_ROAD)}
        {renderSensorCard('SENSOR_SEWER', sensors?.SENSOR_SEWER)}
      </div>

      {/* Thống kê tổng quan */}
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="summary-icon">🔢</div>
          <div className="summary-content">
            <div className="summary-label">Tổng số sensors</div>
            <div className="summary-value">2</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">⚠️</div>
          <div className="summary-content">
            <div className="summary-label">Sensors cảnh báo</div>
            <div className="summary-value">
              {[sensors?.SENSOR_ROAD, sensors?.SENSOR_SEWER].filter(
                s => s?.flood_status === 'WARNING' || s?.flood_status === 'DANGER'
              ).length}
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">🚨</div>
          <div className="summary-content">
            <div className="summary-label">Sensors nguy hiểm</div>
            <div className="summary-value">
              {[sensors?.SENSOR_ROAD, sensors?.SENSOR_SEWER].filter(
                s => s?.flood_status === 'DANGER' || s?.flood_status === 'CRITICAL'
              ).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorsDashboard;


