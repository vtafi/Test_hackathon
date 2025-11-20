import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Settings, 
  LogOut, 
  Calendar, 
  Mail, 
  ShieldCheck, 
  Home, 
  Plus, 
  Trash2, 
  Activity, 
  Bell,
  ChevronRight,
  ArrowLeft,
  X,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Store,
  Dumbbell,
  Coffee,
  Users,
  MoreHorizontal
} from 'lucide-react';
import authService from "../services/authService";
import userProfileService from "../services/userProfileService";
import "./Profile.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('overview'); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('home');

  // Data states
  const [locations, setLocations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Form states for adding location
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [isAddingLoc, setIsAddingLoc] = useState(false);

  // Location Categories configuration
  const locationCategories = [
      { id: 'home', label: 'Nhà', icon: <Home size={20} /> },
      { id: 'work', label: 'Công ty', icon: <Briefcase size={20} /> },
      { id: 'school', label: 'Trường học', icon: <GraduationCap size={20} /> },
      { id: 'hospital', label: 'Bệnh viện', icon: <Stethoscope size={20} /> },
      { id: 'store', label: 'Cửa hàng', icon: <Store size={20} /> },
      { id: 'gym', label: 'Phòng Gym', icon: <Dumbbell size={20} /> },
      { id: 'cafe', label: 'Quán Cafe', icon: <Coffee size={20} /> },
      { id: 'family', label: 'Nhà người thân', icon: <Users size={20} /> },
      { id: 'other', label: 'Khác', icon: <MoreHorizontal size={20} /> },
  ];

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    loadUserProfile(currentUser.uid);
  }, [navigate]);

  useEffect(() => {
    if (user?.uid) {
      if (activeTab === 'overview') {
        loadLocations();
      } else if (activeTab === 'activity') {
        loadActivities();
      }
    }
  }, [user, activeTab]);

  const loadUserProfile = async (userId) => {
    setLoading(true);
    try {
      const result = await userProfileService.getUserProfile(userId);
      if (result.success) {
        setProfile(result.data);
      } else {
         // Default profile
         setProfile({ stats: { savedLocationsCount: 0, alertsReceived: 0, floodReports: 0 } });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    if (!user?.uid) return;
    setLoadingLocations(true);
    const result = await userProfileService.getLocations(user.uid);
    if (result.success) {
      setLocations(result.data);
    }
    setLoadingLocations(false);
  };

  const loadActivities = async () => {
    if (!user?.uid) return;
    setLoadingActivities(true);
    const result = await userProfileService.getActivityHistory(user.uid);
    if (result.success) {
      setActivities(result.data);
    }
    setLoadingActivities(false);
  };

  const handleLogout = async () => {
    const result = await authService.logout();
    if (result.success) {
      navigate("/login");
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocName || !newLocAddress) return;

    setIsAddingLoc(true);
    const cat = locationCategories.find(c => c.id === selectedCategory);
    
    const newLocation = {
      name: newLocName,
      address: newLocAddress,
      type: selectedCategory,
      // status will be determined by backend or default to safe
      status: 'safe', 
      coordinates: null // In a real app, we'd geocode the address
    };

    const result = await userProfileService.addLocation(user.uid, newLocation);
    if (result.success) {
      await userProfileService.addActivity(user.uid, {
        type: "location_added",
        title: `Thêm địa điểm "${newLocName}"`,
        description: `Đã lưu địa điểm mới vào danh sách theo dõi`,
      });
      
      loadLocations();
      loadUserProfile(user.uid); // Refresh stats
      setShowAddModal(false);
      setNewLocName('');
      setNewLocAddress('');
    }
    setIsAddingLoc(false);
  };

  const handleDeleteLocation = async (locationId, locationName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa địa điểm "${locationName}"?`)) return;

    const result = await userProfileService.deleteLocation(user.uid, locationId);
    if (result.success) {
      await userProfileService.addActivity(user.uid, {
        type: "location_deleted",
        title: `Xóa địa điểm "${locationName}"`,
        description: `Đã xóa khỏi danh sách theo dõi`,
      });
      loadLocations();
      loadUserProfile(user.uid);
    }
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
    return `${Math.floor(days / 30)} tháng trước`;
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EEF2FF]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 md:p-8 font-sans text-slate-700 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden bg-[#EEF2FF]">
      
      {/* --- LIGHT BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/30 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          <div className="absolute top-[40%] left-[40%] w-80 h-80 bg-pink-400/20 rounded-full blur-[80px] animate-pulse delay-500"></div>
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="w-full max-w-6xl relative z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 hover:bg-white text-slate-600 font-bold transition-all backdrop-blur-md shadow-sm border border-white/60"
            >
                <ArrowLeft size={18} /> Quay lại bản đồ
            </button>
            <h1 className="text-2xl font-bold text-indigo-900 hidden md:block">Trung tâm cá nhân</h1>
            <div className="w-[100px]"></div> 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- LEFT COLUMN: USER INFO --- */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden text-center group bg-white/40 border border-white/60">
                {/* Header Banner Gradient */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-100/50 to-transparent"></div>
                
                <div className="relative mx-auto w-32 h-32 mb-4">
                    <div className="absolute inset-0 bg-indigo-300 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    {user.photoURL ? (
                        <img 
                            src={user.photoURL} 
                            alt="User Avatar" 
                            className="relative w-full h-full rounded-full border-4 border-white shadow-xl object-cover bg-indigo-50"
                        />
                    ) : (
                        <div className="relative w-full h-full rounded-full border-4 border-white shadow-xl bg-indigo-50 flex items-center justify-center text-indigo-400">
                            <User size={48} />
                        </div>
                    )}
                    
                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-indigo-600 cursor-pointer hover:bg-indigo-50 border border-slate-100">
                        <Settings size={16} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.displayName || "Người dùng"}</h2>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
                    <Mail size={14} /> {user.email}
                </div>
                
                <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 font-medium bg-indigo-50 py-1.5 px-4 rounded-full inline-flex mb-8 mx-auto border border-indigo-100">
                    <Calendar size={12} /> Tham gia: Tháng 11, 2025
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-all">
                        <div className="text-xl font-bold text-indigo-600">{profile?.stats?.savedLocationsCount || 0}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Địa điểm</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-all">
                        <div className="text-xl font-bold text-orange-500">{profile?.stats?.alertsReceived || 0}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Cảnh báo</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-all">
                        <div className="text-xl font-bold text-blue-500">{profile?.stats?.floodReports || 0}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Báo cáo</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button className="w-full py-3 rounded-xl bg-white/70 border border-white/60 text-slate-600 font-bold text-sm hover:bg-white hover:text-indigo-600 hover:shadow-md transition-all flex items-center justify-center gap-2">
                        <Settings size={18} /> Cài đặt tài khoản
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} /> Đăng xuất
                    </button>
                </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: TABS & CONTENT --- */}
          <div className="lg:col-span-8">
             <div className="glass-panel rounded-3xl min-h-[600px] flex flex-col overflow-hidden bg-white/40 border border-white/60">
                
                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200/60 px-6 pt-6 bg-white/30 backdrop-blur-sm">
                    {['overview', 'activity', 'settings'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-6 text-sm font-bold relative transition-colors capitalize ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab === 'overview' ? 'Tổng quan' : tab === 'activity' ? 'Hoạt động' : 'Cài đặt'}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
                        </button>
                    ))}
                </div>

                <div className="p-6 md:p-8 flex-1">
                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Section Header */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <MapPin className="text-indigo-500" size={20} /> Địa điểm đã lưu
                                </h3>

                                {/* Content Container */}
                                <div className="mt-4 space-y-4">
                                    {loadingLocations ? (
                                        <div className="text-center py-10 text-slate-500">Đang tải địa điểm...</div>
                                    ) : (
                                        <>
                                            {/* Saved Location Items */}
                                            {locations.map((loc) => {
                                              const category = locationCategories.find(c => c.id === loc.type) || locationCategories[0];
                                              return (
                                                <div key={loc.id} className="group bg-white/60 border border-white/60 rounded-2xl p-4 flex items-center justify-between hover:bg-white hover:shadow-lg hover:scale-[1.01] transition-all duration-300 cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border border-white/50 ${loc.status === 'safe' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                            {category.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-lg">{loc.name}</h4>
                                                            <p className="text-sm text-slate-500">{loc.address}</p>
                                                            <div className="mt-2">
                                                                {loc.status === 'safe' ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 border border-green-200 text-green-700 text-[10px] font-bold uppercase">
                                                                        <ShieldCheck size={10} /> An toàn
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-bold uppercase">
                                                                        <Activity size={10} /> Cảnh báo
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                                        <button className="p-2.5 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                            <Settings size={20} />
                                                        </button>
                                                        <button 
                                                          onClick={() => handleDeleteLocation(loc.id, loc.name)}
                                                          className="p-2.5 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                              );
                                            })}

                                            {/* Add New Button */}
                                            <button 
                                                onClick={() => setShowAddModal(true)}
                                                className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 text-indigo-500 font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                    <Plus size={18} />
                                                </div>
                                                <span>Thêm địa điểm mới</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'activity' && (
                        <div className="h-full animate-in fade-in zoom-in-95 duration-300">
                             <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Activity className="text-indigo-500" size={20} /> Lịch sử hoạt động
                                </h3>
                            </div>
                            
                            {loadingActivities ? (
                                <div className="text-center py-10 text-slate-500">Đang tải hoạt động...</div>
                            ) : activities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                                    <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-4 border border-white/60 shadow-sm"><Activity size={32} /></div>
                                    <p>Chưa có hoạt động nào gần đây.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="relative pl-8 pb-4 border-l-2 border-indigo-100 last:border-0">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-indigo-100"></div>
                                            <div className="bg-white/60 border border-white/60 rounded-xl p-4 shadow-sm">
                                                <h4 className="font-bold text-slate-800">{activity.title}</h4>
                                                <p className="text-sm text-slate-600">{activity.description}</p>
                                                <span className="text-xs text-slate-400 mt-2 block">{formatTimestamp(activity.timestamp)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                                <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mb-4 border border-white/60 shadow-sm"><Settings size={32} /></div>
                                <p>Chức năng cài đặt đang được cập nhật giao diện.</p>
                            </div>
                         </div>
                    )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* === ADD LOCATION MODAL === */}
      {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity"
                onClick={() => setShowAddModal(false)}
              ></div>
              
              {/* Modal Content */}
              <div className="bg-white/80 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/60 p-0 relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
                  
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <MapPin className="text-indigo-600" size={20} /> Thêm địa điểm mới
                      </h3>
                      <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white/50 p-1 rounded-lg hover:bg-white">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                      <form className="space-y-5" onSubmit={handleAddLocation}>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Tên địa điểm <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                value={newLocName}
                                onChange={(e) => setNewLocName(e.target.value)}
                                placeholder="Ví dụ: Nhà riêng, Công ty..." 
                                className="glass-input w-full px-4 py-3 rounded-xl text-slate-700 font-semibold placeholder-slate-400 bg-white/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                              />
                          </div>
                          
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Địa chỉ <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                value={newLocAddress}
                                onChange={(e) => setNewLocAddress(e.target.value)}
                                placeholder="Nhập địa chỉ hoặc chọn trên bản đồ" 
                                className="glass-input w-full px-4 py-3 rounded-xl text-slate-700 font-medium placeholder-slate-400 bg-white/50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                              />
                          </div>

                          {/* Category Grid */}
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 tracking-wide">Loại địa điểm</label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                  {locationCategories.map((cat) => (
                                      <div 
                                          key={cat.id}
                                          onClick={() => setSelectedCategory(cat.id)}
                                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${selectedCategory === cat.id ? 'bg-indigo-50 border-indigo-500 shadow-md shadow-indigo-100 scale-105' : 'bg-white/50 border-transparent hover:bg-white hover:border-indigo-200 hover:shadow-sm'}`}
                                      >
                                          <div className={`p-2 rounded-full ${selectedCategory === cat.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                              {cat.icon}
                                          </div>
                                          <span className={`text-xs font-medium ${selectedCategory === cat.id ? 'text-indigo-700' : 'text-slate-500'}`}>{cat.label}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </form>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-slate-200/50 bg-white/50 flex justify-end gap-3">
                      <button 
                          onClick={() => setShowAddModal(false)}
                          className="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-white hover:text-slate-700 transition-colors"
                      >
                          Hủy
                      </button>
                      <button 
                          onClick={handleAddLocation}
                          disabled={isAddingLoc}
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all"
                      >
                          {isAddingLoc ? 'Đang lưu...' : 'Lưu địa điểm'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProfilePage;
