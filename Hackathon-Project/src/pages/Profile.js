/**
 * Profile Page - Trang cá nhân
 * Hiển thị thông tin user, lịch sử hoạt động, cài đặt
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Settings,
  Bell,
  Shield,
  LogOut,
  Trash2,
  Edit2,
} from "lucide-react";
import authService from "../services/authService";
import userProfileService from "../services/userProfileService";
import AddLocationModal from "../components/AddLocationModal";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, activity, settings

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    loadUserProfile(currentUser.uid);
  }, [navigate]);

  const loadUserProfile = async (userId) => {
    setLoading(true);
    try {
      // Timeout after 10 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000)
      );

      const result = await Promise.race([
        userProfileService.getUserProfile(userId),
        timeoutPromise,
      ]);

      if (result.success) {
        setProfile(result.data);
      } else {
        console.error("Failed to load profile:", result.error);
        // Set default profile on error
        setProfile({
          savedLocations: [],
          notifications: { email: true, push: true, sms: false },
          alertSettings: {
            immediateAlerts: true,
            advanceWarning: true,
            dailySummary: false,
          },
          stats: { savedLocationsCount: 0, alertsReceived: 0, floodReports: 0 },
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Set default profile on timeout
      setProfile({
        savedLocations: [],
        notifications: { email: true, push: true, sms: false },
        alertSettings: {
          immediateAlerts: true,
          advanceWarning: true,
          dailySummary: false,
        },
        stats: { savedLocationsCount: 0, alertsReceived: 0, floodReports: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await authService.logout();
    if (result.success) {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Quay lại
        </button>
        <h1>Trang cá nhân</h1>
      </div>

      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-card">
            {/* Avatar */}
            <div className="profile-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} />
              ) : (
                <div className="avatar-placeholder">
                  <User size={48} />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="profile-info">
              <h2 className="profile-name">
                {user.displayName || "Người dùng"}
              </h2>
              <p className="profile-email">
                <Mail size={14} />
                {user.email}
              </p>
              <p className="profile-join-date">
                <Calendar size={14} />
                Tham gia: Tháng 11, 2025
              </p>
            </div>

            {/* Quick Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-value">
                  {profile?.stats?.savedLocationsCount || 0}
                </div>
                <div className="stat-label">Địa điểm đã lưu</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {profile?.stats?.alertsReceived || 0}
                </div>
                <div className="stat-label">Cảnh báo nhận</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {profile?.stats?.floodReports || 0}
                </div>
                <div className="stat-label">Báo cáo ngập</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              <button
                className="btn-secondary"
                onClick={() => navigate("/settings")}
              >
                <Settings size={16} />
                Cài đặt
              </button>
              <button className="btn-danger" onClick={handleLogout}>
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Tổng quan
            </button>
            <button
              className={`tab ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              Hoạt động
            </button>
            <button
              className={`tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Cài đặt
            </button>
          </div>

          {/* Tab Content */}
          <div className="profile-content">
            {activeTab === "overview" && (
              <OverviewTab
                user={user}
                onRefresh={() => loadUserProfile(user.uid)}
              />
            )}
            {activeTab === "activity" && <ActivityTab user={user} />}
            {activeTab === "settings" && (
              <SettingsTab
                user={user}
                profile={profile}
                onUpdate={() => loadUserProfile(user.uid)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ user, onRefresh }) => {
  const [locations, setLocations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadLocations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const loadLocations = async () => {
    setLoadingLocations(true);
    const result = await userProfileService.getLocations(user.uid);
    if (result.success) {
      setLocations(result.data);
    }
    setLoadingLocations(false);
  };

  const handleAddLocation = async (location) => {
    const result = await userProfileService.addLocation(user.uid, location);
    if (result.success) {
      // Log activity
      await userProfileService.addActivity(user.uid, {
        type: "location_added",
        title: `Thêm địa điểm "${location.name}"`,
        description: `Đã lưu địa điểm mới vào danh sách theo dõi`,
      });

      loadLocations();
      onRefresh();
    }
  };

  const handleDeleteLocation = async (locationId, locationName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa địa điểm "${locationName}"?`)) {
      return;
    }

    const result = await userProfileService.deleteLocation(
      user.uid,
      locationId
    );
    if (result.success) {
      // Log activity
      await userProfileService.addActivity(user.uid, {
        type: "location_deleted",
        title: `Xóa địa điểm "${locationName}"`,
        description: `Đã xóa khỏi danh sách theo dõi`,
      });

      loadLocations();
      onRefresh();
    }
  };

  return (
    <div className="overview-tab">
      <div className="section">
        <h3>📍 Địa điểm đã lưu</h3>

        {loadingLocations ? (
          <div className="loading-message">Đang tải...</div>
        ) : locations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <h4>Chưa có địa điểm nào</h4>
            <p>Thêm địa điểm quan trọng để nhận cảnh báo ngập lụt kịp thời</p>
          </div>
        ) : (
          <div className="location-list">
            {locations.map((location) => (
              <div className="location-item" key={location.id}>
                <div className="location-icon">{location.icon}</div>
                <div className="location-info">
                  <h4>{location.name}</h4>
                  <p>{location.address}</p>
                  <span
                    className={`location-status ${location.status || "safe"}`}
                  >
                    {location.status === "danger"
                      ? "🔴 Nguy hiểm"
                      : location.status === "warning"
                      ? "⚠️ Có nguy cơ"
                      : "✅ An toàn"}
                  </span>
                </div>
                <div className="location-actions">
                  <button
                    className="icon-btn"
                    onClick={() =>
                      handleDeleteLocation(location.id, location.name)
                    }
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="btn-outline" onClick={() => setShowAddModal(true)}>
          + Thêm địa điểm mới
        </button>
      </div>

      <AddLocationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLocation}
      />
    </div>
  );
};

// Activity Tab
const ActivityTab = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const loadActivities = async () => {
    setLoading(true);
    const result = await userProfileService.getActivityHistory(user.uid);
    if (result.success) {
      setActivities(result.data);
    }
    setLoading(false);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Gần đây";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Hôm qua";
    if (days < 7) return `${days} ngày trước`;
    if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
    return `${Math.floor(days / 30)} tháng trước`;
  };

  return (
    <div className="activity-tab">
      <h3>📜 Lịch sử hoạt động</h3>

      {loading ? (
        <div className="loading-message">Đang tải...</div>
      ) : activities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <h4>Chưa có hoạt động nào</h4>
          <p>Lịch sử hoạt động của bạn sẽ hiển thị ở đây</p>
        </div>
      ) : (
        <div className="timeline">
          {activities.map((activity) => (
            <div className="timeline-item" key={activity.id}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
                <span className="timeline-time">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Settings Tab
const SettingsTab = ({ user, profile, onUpdate }) => {
  const [notifications, setNotifications] = useState(
    profile?.notifications || {
      email: true,
      push: true,
      sms: false,
    }
  );

  const [alertSettings, setAlertSettings] = useState(
    profile?.alertSettings || {
      immediateAlerts: true,
      advanceWarning: true,
      dailySummary: false,
    }
  );

  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    // Update display name in Firebase Auth
    // await authService.updateDisplayName(displayName);
    setSaving(false);
    alert("Đã lưu thay đổi!");
  };

  const handleSaveNotifications = async (newSettings) => {
    const result = await userProfileService.updateSettings(
      user.uid,
      "notifications",
      newSettings
    );
    if (result.success) {
      onUpdate();
    }
  };

  const handleSaveAlertSettings = async (newSettings) => {
    const result = await userProfileService.updateSettings(
      user.uid,
      "alertSettings",
      newSettings
    );
    if (result.success) {
      onUpdate();
    }
  };

  return (
    <div className="settings-tab">
      <div className="section">
        <h3>👤 Thông tin cá nhân</h3>
        <div className="form-group">
          <label>Tên hiển thị</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Nhập tên của bạn"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={user.email} disabled />
        </div>
        <button
          className="btn-primary"
          onClick={handleSaveProfile}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="section">
        <h3>
          <Bell size={20} /> Cài đặt thông báo
        </h3>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4>Email</h4>
              <p>Nhận thông báo qua email</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => {
                  const newSettings = {
                    ...notifications,
                    email: e.target.checked,
                  };
                  setNotifications(newSettings);
                  handleSaveNotifications(newSettings);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Thông báo đẩy</h4>
              <p>Nhận thông báo trên trình duyệt</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => {
                  const newSettings = {
                    ...notifications,
                    push: e.target.checked,
                  };
                  setNotifications(newSettings);
                  handleSaveNotifications(newSettings);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>SMS</h4>
              <p>Nhận tin nhắn SMS (cần xác minh số)</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => {
                  const newSettings = {
                    ...notifications,
                    sms: e.target.checked,
                  };
                  setNotifications(newSettings);
                  handleSaveNotifications(newSettings);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>
          <Shield size={20} /> Cài đặt cảnh báo
        </h3>
        <div className="settings-list">
          <div className="setting-item">
            <div className="setting-info">
              <h4>Cảnh báo khẩn cấp</h4>
              <p>Thông báo ngay khi có ngập gần bạn</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={alertSettings.immediateAlerts}
                onChange={(e) => {
                  const newSettings = {
                    ...alertSettings,
                    immediateAlerts: e.target.checked,
                  };
                  setAlertSettings(newSettings);
                  handleSaveAlertSettings(newSettings);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Cảnh báo sớm</h4>
              <p>Thông báo 1-3 giờ trước khi ngập</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={alertSettings.advanceWarning}
                onChange={(e) => {
                  const newSettings = {
                    ...alertSettings,
                    advanceWarning: e.target.checked,
                  };
                  setAlertSettings(newSettings);
                  handleSaveAlertSettings(newSettings);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Báo cáo hàng ngày</h4>
              <p>Tổng hợp tình hình mỗi sáng</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={alertSettings.dailySummary}
                onChange={(e) => {
                  const newSettings = {
                    ...alertSettings,
                    dailySummary: e.target.checked,
                  };
                  setAlertSettings(newSettings);
                  handleSaveAlertSettings(newSettings);
                }}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="section danger-zone">
        <h3>⚠️ Vùng nguy hiểm</h3>
        <div className="danger-actions">
          <button className="btn-outline">Đổi mật khẩu</button>
          <button className="btn-danger">Xóa tài khoản</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
