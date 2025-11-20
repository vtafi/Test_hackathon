import React, { useState, useEffect, useCallback } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Activity, 
  Settings, 
  Clock, 
  Waves, 
  AlertTriangle, 
  Bot, 
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { usePersonalizedAlert } from '../hooks/usePersonalizedAlert';
import { useFirebaseSensors } from '../hooks/useFirebaseSensors';
import { aiAlertApi } from '../api';
import authService from '../services/authService';
import './AutoAlertSystem.css';

const AutoAlertSystem = ({ onBack }) => {
  // --- Existing Logic State ---
  const [user, setUser] = useState(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [checkInterval, setCheckInterval] = useState(15); // 15 minutes default
  const [waterLevelThreshold, setWaterLevelThreshold] = useState(50); // 50cm default
  const [riskLevelThreshold, setRiskLevelThreshold] = useState(1); // 1 = warning and above
  
  // Stats & Logic State (Hidden from UI but kept for functionality)
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
    
    const checkTime = new Date();
    setLastCheck(checkTime);
    
    try {
      // 1. Check user locations with custom risk threshold
      const locationResult = await checkLocationsAndAlert(
        riskLevelThreshold, 
        true 
      );

      // 2. Check sensors
      let sensorAlerts = [];
      let skippedSensors = 0;
      
      if (dangerousSensors.length > 0) {
        for (const sensor of dangerousSensors) {
          const waterLevel = sensor.water_level_cm || 0;
          
          if (waterLevel >= waterLevelThreshold) {
            try {
              await aiAlertApi.generateAlertFromSensor(
                sensor,
                user.email
              );
              
              sensorAlerts.push({
                type: 'sensor',
                sensor: sensor.id,
                waterLevel: waterLevel,
              });
            } catch (err) {
              console.error('Error generating sensor alert:', err);
            }
          } else {
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

      console.log(`✅ Auto check completed: ${totalAlerts} alerts sent`);
    } catch (error) {
      console.error('❌ Auto check failed:', error);
    }
  }, [user, isAutoEnabled, checkLocationsAndAlert, dangerousSensors, waterLevelThreshold, riskLevelThreshold]);

  // Setup auto check interval
  useEffect(() => {
    if (!isAutoEnabled || !user) {
      setNextCheck(null);
      return;
    }

    performAutoCheck();

    const intervalMs = checkInterval * 60 * 1000;
    const intervalId = setInterval(() => {
      performAutoCheck();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [isAutoEnabled, user, checkInterval, performAutoCheck]);

  // Handlers for UI
  const toggleSystem = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này!');
      return;
    }
    if (!isAutoEnabled && locations.length === 0) {
      alert('Bạn chưa có địa điểm nào! Vui lòng thêm địa điểm trong trang Cảnh báo khu vực.');
      return;
    }
    setIsAutoEnabled(!isAutoEnabled);
  };

  // Helper to map risk level to string for UI
  const getAlertLevelString = () => {
    if (riskLevelThreshold === 1) return 'warning';
    if (riskLevelThreshold === 2) return 'danger';
    if (riskLevelThreshold === 3) return 'emergency';
    return 'warning';
  };

  const handleAlertLevelChange = (level) => {
    if (level === 'warning') setRiskLevelThreshold(1);
    if (level === 'danger') setRiskLevelThreshold(2);
    if (level === 'emergency') setRiskLevelThreshold(3);
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center p-0 font-sans text-slate-800 selection:bg-indigo-200 selection:text-indigo-900">
      
      {/* --- MAIN CONTAINER --- */}
      <div className="w-full relative z-10">
        
        {/* Header Nav */}
        <div className="flex items-center justify-between mb-8">
             <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-xl hover:bg-white/30"
             >
                <ArrowLeft size={18} />
                <span>Quay lại</span>
             </button>
             <h1 className="hidden md:block text-xl font-bold text-indigo-900/80">Cấu hình hệ thống</h1>
        </div>

        {/* 1. SYSTEM STATUS CARD (Top) */}
        <div className="glass-panel w-full rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-indigo-200/40 hover:shadow-2xl">
          <div className="flex items-center gap-5 w-full md:w-auto">
            {/* Robot Icon Container */}
            <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isAutoEnabled ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30' : 'bg-slate-200'}`}>
               <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-[1px]"></div>
               <img 
                 src={`https://api.dicebear.com/7.x/bottts/svg?seed=${isAutoEnabled ? 'HappyBot' : 'SleepyBot'}`} 
                 alt="Robot" 
                 className="w-16 h-16 relative z-10 drop-shadow-md transition-transform duration-300 hover:scale-110"
               />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Hệ thống Cảnh báo Tự động</h2>
              <p className="text-slate-500 text-sm font-medium">Robot sẽ tự động quét dữ liệu và gửi email khi đạt ngưỡng.</p>
            </div>
          </div>
          {/* Toggle Switch */}
          <div className="flex items-center gap-4 bg-white/40 px-6 py-3 rounded-2xl border border-white/60 backdrop-blur-md shadow-sm">
            <span className={`text-sm font-bold transition-colors ${isAutoEnabled ? 'text-indigo-600' : 'text-slate-400'}`}>
              {isAutoEnabled ? 'Đang hoạt động' : 'Đã tạm dừng'}
            </span>
            <button 
              onClick={toggleSystem}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${isAutoEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isAutoEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* 2. USER PROFILE CARD (Left - 5 Cols) */}
          <div className="md:col-span-5 glass-panel rounded-3xl p-8 flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:scale-110"></div>
            
            <h3 className="text-lg font-bold text-slate-700 mb-8 flex items-center gap-2">
              <UserIcon size={20} className="text-indigo-500" /> Hồ sơ người dùng
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center mb-8">
              <div className="w-28 h-28 rounded-full p-1.5 bg-gradient-to-tr from-indigo-400 to-pink-400 mb-4 shadow-lg shadow-indigo-200">
                <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden">
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
                      <UserIcon size={48} className="text-slate-400" />
                    </div>
                  )}
                </div>
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-1">{user?.displayName || user?.email?.split('@')[0] || 'Guest'}</h4>
              <div className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium flex items-center gap-2">
                <Mail size={14} />
                {user?.email || 'No email'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/60">
               <div className="bg-white/50 rounded-2xl p-4 text-center border border-white/60 hover:bg-white/80 transition-colors">
                  <div className="text-3xl font-bold text-slate-800 mb-1">{locations.length}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                    <MapPin size={10} /> Địa điểm
                  </div>
               </div>
               <div className="bg-white/50 rounded-2xl p-4 text-center border border-white/60 hover:bg-white/80 transition-colors">
                  <div className={`text-lg font-bold mb-1 ${isAutoEnabled ? 'text-green-600' : 'text-slate-400'}`}>
                    {isAutoEnabled ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                    <Activity size={10} /> Trạng thái
                  </div>
               </div>
            </div>
          </div>

          {/* 3. SETTINGS CARD (Right - 7 Cols) */}
          <div className="md:col-span-7 glass-panel rounded-3xl p-8 h-full">
            <h3 className="text-lg font-bold text-slate-700 mb-8 flex items-center gap-2">
              <Settings size={20} className="text-indigo-500" /> Thiết lập thông số
            </h3>
            <div className="space-y-8">
              
              {/* Frequency Input */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Tần suất kiểm tra</label>
                <div className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all hover:bg-white/60" 
                     style={{
                       background: 'rgba(255, 255, 255, 0.4)',
                       border: '1px solid rgba(255, 255, 255, 0.5)'
                     }}>
                  <Clock size={18} className="text-indigo-500 flex-shrink-0" />
                  <select 
                    value={checkInterval}
                    onChange={(e) => setCheckInterval(Number(e.target.value))}
                    disabled={isAutoEnabled}
                    className="flex-1 bg-transparent text-slate-700 font-semibold appearance-none cursor-pointer outline-none border-none disabled:opacity-50"
                  >
                    <option value="1">Mỗi 1 phút</option>
                    <option value="5">Mỗi 5 phút</option>
                    <option value="15">Mỗi 15 phút</option>
                    <option value="30">Mỗi 30 phút</option>
                    <option value="60">Mỗi 1 giờ</option>
                  </select>
                  <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                </div>
              </div>

              {/* Water Level Input */}
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Ngưỡng nước kích hoạt (cm)</label>
                <div className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all hover:bg-white/60" 
                     style={{
                       background: 'rgba(255, 255, 255, 0.4)',
                       border: '1px solid rgba(255, 255, 255, 0.5)'
                     }}>
                  <Waves size={18} className="text-cyan-500 flex-shrink-0" />
                  <input 
                    type="number" 
                    value={waterLevelThreshold}
                    onChange={(e) => setWaterLevelThreshold(Number(e.target.value))}
                    disabled={isAutoEnabled}
                    className="flex-1 bg-transparent text-slate-700 font-bold placeholder-slate-400 outline-none border-none disabled:opacity-50"
                  />
                  <span className="text-sm font-bold text-slate-400 flex-shrink-0">cm</span>
                </div>
              </div>

              {/* Alert Level Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Mức độ cảnh báo</label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Level 1: Warning */}
                  <button 
                    onClick={() => handleAlertLevelChange("warning")}
                    disabled={isAutoEnabled}
                    className={`relative overflow-hidden py-3 px-2 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 disabled:opacity-50 ${
                      riskLevelThreshold === 1 
                        ? 'bg-yellow-100/80 border-yellow-400 text-yellow-700 shadow-sm' 
                        : 'bg-white/40 border-white/60 text-slate-500 hover:bg-white/60'
                    }`}
                  >
                    <span className="text-sm font-bold">Cảnh báo+</span>
                    {riskLevelThreshold === 1 && <div className="absolute bottom-0 w-full h-1 bg-yellow-400"></div>}
                  </button>

                  {/* Level 2: Danger */}
                  <button 
                    onClick={() => handleAlertLevelChange("danger")}
                    disabled={isAutoEnabled}
                    className={`relative overflow-hidden py-3 px-2 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 disabled:opacity-50 ${
                      riskLevelThreshold === 2 
                        ? 'bg-orange-100/80 border-orange-400 text-orange-700 shadow-sm' 
                        : 'bg-white/40 border-white/60 text-slate-500 hover:bg-white/60'
                    }`}
                  >
                    <span className="text-sm font-bold">Nguy hiểm+</span>
                    {riskLevelThreshold === 2 && <div className="absolute bottom-0 w-full h-1 bg-orange-400"></div>}
                  </button>

                  {/* Level 3: Emergency */}
                  <button 
                    onClick={() => handleAlertLevelChange("emergency")}
                    disabled={isAutoEnabled}
                    className={`relative overflow-hidden py-3 px-2 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 disabled:opacity-50 ${
                      riskLevelThreshold === 3 
                        ? 'bg-red-100/80 border-red-400 text-red-700 shadow-sm' 
                        : 'bg-white/40 border-white/60 text-slate-500 hover:bg-white/60'
                    }`}
                  >
                    <span className="text-sm font-bold">Khẩn cấp</span>
                    {riskLevelThreshold === 3 && <div className="absolute bottom-0 w-full h-1 bg-red-400"></div>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CSS IN JS (For specific glass effects) --- */}
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
        }
        .glass-input {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.5);
          outline: none;
        }
        .glass-input:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.1);
        }
      `}</style>
    </div>
  );
};

export default AutoAlertSystem;
