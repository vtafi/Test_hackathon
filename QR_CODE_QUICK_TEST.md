# 🧪 Quick Test - QR Code Telegram Bot

## ✅ Test Checklist

### 1. **Backend API Test**

```bash
# Terminal 1 - Start Backend Server
cd Backend
npm start
# Đợi server khởi động tại http://localhost:4000
```

```bash
# Terminal 2 - Test API Endpoints
cd Backend

# Test 1: Get QR Info
curl http://localhost:4000/api/telegram/qr-info

# Test 2: Get Bot Info
curl http://localhost:4000/api/telegram/info
```

**Expected Output:**
```json
// QR Info Response
{
  "success": true,
  "data": {
    "qrLink": "https://t.me/AquarouteAI_bot?start=...",
    "botUsername": "AquarouteAI_bot",
    "userId": "...",
    "email": "..."
  }
}

// Bot Info Response
{
  "success": true,
  "data": {
    "id": 8207906803,
    "username": "AquarouteAI_bot",
    "first_name": "AQUA ROUTE"
  }
}
```

---

### 2. **Frontend Test**

```bash
# Terminal 3 - Start Frontend
cd Hackathon-Project
npm start
# Mở tự động tại http://localhost:3000
```

**Test Steps:**
1. ✅ Đăng nhập vào hệ thống
2. ✅ Click vào **Avatar** (góc trên phải)
3. ✅ Click **"QR Code Telegram Bot"** trong menu
4. ✅ Modal xuất hiện với QR code
5. ✅ Thông tin bot hiển thị: `@AquarouteAI_bot`
6. ✅ QR code render đúng
7. ✅ Test các button:
   - 📋 Copy Link
   - 💾 Download QR
   - 🔗 Open Bot
   - ❌ Close

---

### 3. **Mobile Test (Telegram App)**

**Preparation:**
- Cài đặt Telegram app trên điện thoại
- Mở QR modal trên web (bước 2)

**Test Flow:**
1. ✅ Mở **Telegram** app
2. ✅ Tap **Search icon** 🔍
3. ✅ Tap **QR Code icon** 📷 (góc trên phải)
4. ✅ Camera mở ra
5. ✅ **Quét QR code** từ màn hình web
6. ✅ Bot `@AquarouteAI_bot` tự động mở
7. ✅ Tap **"START"** hoặc `/start`
8. ✅ Nhận welcome message từ bot

---

### 4. **Integration Test**

**Test Full User Journey:**

```
User → Login → Avatar → QR Modal → Scan → Bot Opens → Start → Subscribe
```

**Steps:**
1. User đăng nhập với Firebase Auth
2. Click Avatar → QR Code menu
3. Modal hiển thị QR với user ID
4. User quét QR trên Telegram
5. Bot mở với deep link chứa user ID
6. User nhấn START
7. Bot lưu chat_id vào Firebase
8. User nhận welcome message
9. User được subscribe cho alerts

---

### 5. **Error Handling Test**

**Test 1: Backend Offline**
```bash
# Stop backend server
# Frontend should show error state với retry button
```

**Test 2: Invalid Response**
```javascript
// Backend trả về data không đúng format
// Frontend should show error message
```

**Test 3: Network Error**
```javascript
// Disconnect internet
// Should show network error với retry
```

---

### 6. **Visual Test**

**Desktop (1920x1080):**
- ✅ Modal center screen
- ✅ QR code size 256x256
- ✅ Text readable
- ✅ Buttons properly sized
- ✅ Animations smooth

**Tablet (768x1024):**
- ✅ Modal responsive
- ✅ QR code scaled
- ✅ Buttons touch-friendly
- ✅ No horizontal scroll

**Mobile (375x667):**
- ✅ Modal full width with margin
- ✅ QR code centered
- ✅ Buttons stack vertically
- ✅ Text wraps properly
- ✅ Close button accessible

---

### 7. **Performance Test**

**Metrics:**
- ⏱️ Modal open time: < 500ms
- ⏱️ QR load time: < 1000ms
- ⏱️ API response time: < 300ms
- 📦 Bundle size: Check with DevTools
- 🎨 FPS: Smooth 60fps animations

**Chrome DevTools:**
```
F12 → Performance → Record → Open Modal → Stop
Check:
- Loading time
- Render time
- Network requests
```

---

### 8. **Accessibility Test**

- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Screen reader compatible
- ✅ High contrast mode
- ✅ Focus indicators
- ✅ ARIA labels

**Test with keyboard:**
```
Tab → Focus on buttons
Enter → Trigger action
Esc → Close modal
```

---

### 9. **Browser Compatibility**

Test trên các trình duyệt:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome
- ✅ Mobile Safari

---

### 10. **Security Test**

**Check:**
- ✅ No sensitive data in QR
- ✅ User ID encoded properly
- ✅ HTTPS in production
- ✅ CORS configured
- ✅ Bot token in env variable
- ✅ No console errors

---

## 🐛 Common Issues & Solutions

### Issue 1: QR không hiển thị
```bash
# Check console for errors
F12 → Console

# Check API response
curl http://localhost:4000/api/telegram/qr-info

# Solution: Ensure backend is running
cd Backend && npm start
```

### Issue 2: Copy link không hoạt động
```javascript
// Check browser permissions
navigator.clipboard.writeText(text)

// Solution: Use HTTPS or localhost
```

### Issue 3: Download QR lỗi
```javascript
// Check canvas rendering
const canvas = document.querySelector('canvas');
console.log(canvas);

// Solution: Wait for QR to fully render
```

### Issue 4: Telegram không mở bot
```
// Check deep link format
https://t.me/AquarouteAI_bot?start=<user_id>

// Solution: Verify bot username
@AquarouteAI_bot
```

---

## ✅ Success Criteria

Tất cả các điểm sau phải ✅:

- [ ] Backend API hoạt động
- [ ] Frontend modal hiển thị
- [ ] QR code render đúng
- [ ] Bot info hiển thị
- [ ] Copy link hoạt động
- [ ] Download QR hoạt động
- [ ] Open bot hoạt động
- [ ] Mobile scan thành công
- [ ] Bot mở trong Telegram
- [ ] Welcome message được gửi
- [ ] No console errors
- [ ] No network errors
- [ ] Responsive trên mọi devices
- [ ] Loading states hoạt động
- [ ] Error handling hoạt động

---

## 📊 Test Report Template

```markdown
## Test Report - QR Code Telegram Bot

**Date:** 2025-11-21
**Tester:** [Your Name]
**Branch:** feature/qr

### Backend API
- [ ] ✅ GET /api/telegram/qr-info
- [ ] ✅ GET /api/telegram/info
- [ ] ✅ Response format correct
- [ ] ✅ Error handling works

### Frontend UI
- [ ] ✅ Modal opens
- [ ] ✅ QR code displays
- [ ] ✅ Bot info displays
- [ ] ✅ Copy link works
- [ ] ✅ Download works
- [ ] ✅ Open bot works
- [ ] ✅ Close works

### Mobile Integration
- [ ] ✅ QR scan successful
- [ ] ✅ Bot opens in Telegram
- [ ] ✅ START command works
- [ ] ✅ Welcome message received

### Performance
- [ ] ✅ Load time < 1s
- [ ] ✅ Smooth animations
- [ ] ✅ No memory leaks

### Issues Found
- None / [List issues here]

### Conclusion
✅ PASS / ❌ FAIL
```

---

## 🚀 Quick Commands

```bash
# Full test suite
cd Backend && npm start &
cd Hackathon-Project && npm start &
curl http://localhost:4000/api/telegram/qr-info
curl http://localhost:4000/api/telegram/info

# Check processes
ps aux | grep node

# Kill all node processes
killall node

# Restart everything
npm start
```

---

**🎉 Happy Testing!**
