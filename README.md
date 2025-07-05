# 📚 Ứng Dụng Học Từ Vựng Tiếng Anh với AI

Ứng dụng học từ vựng tiếng Anh hiện đại với tích hợp trí tuệ nhân tạo Google Gemini để tự động tạo từ vựng thông minh.

## ✨ Tính Năng Chính

- 🎯 **Học từ vựng** với flashcard tương tác
- 🧠 **Kiểm tra kiến thức** với quiz đa dạng
- ➕ **Thêm từ mới** thủ công hoặc tự động
- 🤖 **AI tự động tạo từ** với Google Gemini
- 🎵 **Phát âm giọng Mỹ/Anh** tích hợp
- 💾 **Lưu trữ tự động** với localStorage
- 📊 **Thống kê chi tiết** theo level và danh mục

## 🚀 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn
- Trình duyệt web hiện đại

### Bước 1: Cài đặt dependencies
```bash
# Di chuyển vào thư mục project
cd study-english

# Cài đặt các package cần thiết
npm install
```

### Bước 2: Chạy ứng dụng
```bash
# Chạy ở chế độ development
npm start

# Hoặc
npm run dev
```

Ứng dụng sẽ mở tại: http://localhost:3000

### Bước 3: Build cho production (tùy chọn)
```bash
# Tạo build cho production
npm run build
```

## 🔑 Cấu Hình API Gemini

### Lấy API Key miễn phí:
1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Đăng nhập với tài khoản Google
3. Tạo API key mới
4. Copy API key vào ứng dụng (tab "AI Tạo từ" > "Cài đặt API")

### Bảo mật API Key:
- API key được lưu trữ an toàn trong localStorage
- Không chia sẻ API key với người khác
- Có thể tạo key mới nếu cần thiết

## 💡 Cách Sử Dụng

### 1. Học Từ Vựng
- Duyệt qua các từ vựng với flashcard
- Nghe phát âm giọng Mỹ/Anh
- Xem định nghĩa và ví dụ chi tiết
- Đánh dấu từ yêu thích

### 2. Kiểm Tra Kiến Thức
- Chọn chế độ: Nghĩa từ hoặc Từ tiếng Anh
- Nhập câu trả lời
- Xem kết quả và thống kê

### 3. Thêm Từ Mới
- Thêm từ thủ công với đầy đủ thông tin
- Tự động kiểm tra trùng lặp
- Phân loại theo level và danh mục

### 4. AI Tự Động Tạo Từ
- Nhập yêu cầu bằng tiếng Việt
- AI tạo 10-15 từ vựng phù hợp
- Tự động tránh trùng lặp với từ đã có

**Ví dụ yêu cầu AI:**
- "Từ vựng về môi trường cùng level với từ greenwash"
- "Từ vựng kinh doanh level B2-C1"
- "Phrasal verbs cho IELTS"
- "Từ vựng khoa học level advanced"

### 5. Quản Lý Từ Vựng
- Tìm kiếm và lọc từ vựng
- Chỉnh sửa thông tin từ
- Xóa từ không cần thiết
- Xem thống kê chi tiết

## 💾 Database & Storage

### Dual Storage System
Ứng dụng hỗ trợ **2 hệ thống lưu trữ linh hoạt**:

| Feature | Local Storage | Firebase Firestore |
|---------|---------------|-------------------|
| **Setup** | 🟢 Không cần | 🟡 Cần cấu hình |
| **Sync** | Chỉ thiết bị này | 🔄 Multi-device |
| **Offline** | ✅ | ✅ |
| **Backup** | Export/Import | Tự động |

### Quick Start
- **Mặc định**: Tự động sử dụng Local Storage 
- **Nâng cao**: Setup Firestore cho cloud sync
- **Migration**: Chuyển đổi dễ dàng trong Database Manager

📖 **Chi tiết setup**: Xem [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) và [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## 📁 Cấu Trúc Project

```
study-english/
├── public/
│   └── index.html          # Template HTML
├── src/
│   ├── components/         # React Components
│   │   ├── Header.js       # Header với accent selector
│   │   ├── ModeSelector.js # Navigation tabs
│   │   ├── StudyMode.js    # Flashcard học từ
│   │   ├── QuizMode.js     # Quiz kiểm tra
│   │   ├── AddWordMode.js  # Form thêm từ mới
│   │   ├── AIMode.js       # AI tạo từ vựng
│   │   ├── ManageMode.js   # Quản lý từ vựng
│   │   ├── Statistics.js   # Thống kê và báo cáo
│   │   ├── Footer.js       # Footer
│   │   └── EmptyState.js   # Trạng thái rỗng
│   ├── hooks/              # Custom React Hooks
│   │   ├── useVocabulary.js # Hook quản lý từ vựng
│   │   ├── useFavorites.js  # Hook quản lý yêu thích
│   │   └── useApiKey.js     # Hook quản lý API key
│   ├── services/           # External Services
│   │   └── geminiService.js # Gemini API service
│   ├── utils/              # Utility Functions
│   │   └── helpers.js       # Helper functions
│   ├── data/               # Static Data
│   │   └── initialVocabulary.js # Dữ liệu từ vựng ban đầu
│   ├── App.js              # Main App component
│   └── index.js            # Entry point
├── .vscode/
│   └── tasks.json          # VS Code tasks
├── package.json            # Dependencies và scripts
├── .gitignore              # Git ignore rules
├── install.bat             # Script cài đặt (Windows)
├── start.bat               # Script chạy app (Windows)
└── README.md               # Tài liệu này
```

## 🛠 Công Nghệ Sử Dụng

- **React 18** - Framework UI
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Google Gemini API** - AI tạo từ vựng
- **Web Speech API** - Phát âm text-to-speech
- **localStorage** - Lưu trữ dữ liệu local

## 🏗 Kiến Trúc Ứng Dụng

### **Component Architecture:**
- **Modular Design**: Mỗi tính năng là một component riêng biệt
- **Custom Hooks**: Logic tái sử dụng với React hooks
- **Service Layer**: API calls được tách riêng
- **Utility Functions**: Helper functions dùng chung

### **State Management:**
- **Local State**: useState cho UI state
- **Custom Hooks**: useVocabulary, useFavorites, useApiKey
- **localStorage**: Persistent storage

### **File Organization:**
- `components/`: UI components
- `hooks/`: Custom React hooks  
- `services/`: External API services
- `utils/`: Helper functions
- `data/`: Static data và constants

## 📊 Tính Năng Nâng Cao

### Hệ Thống Level CEFR
- **Beginner (A1-A2)**: Từ vựng cơ bản
- **Intermediate (B1-B2)**: Từ vựng trung cấp  
- **Advanced (C1-C2)**: Từ vựng nâng cao

### Phát Âm Đa Giọng
- **US (American)**: Giọng Mỹ chuẩn
- **UK (British)**: Giọng Anh chuẩn
- Phiên âm IPA chi tiết

### Lưu Trữ Thông Minh
- Tự động lưu sau mỗi thay đổi
- Khôi phục dữ liệu khi reload
- Backup local an toàn

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi npm install:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi react-scripts not found:
```bash
# Cài đặt react-scripts
npm install react-scripts --save
# Hoặc cài lại toàn bộ
npm install
```

### Lỗi AI tạo từ vựng:
1. **Kiểm tra API key:**
   - Vào tab "AI Tạo từ" > "Cài đặt API"
   - Click "Test API" để kiểm tra kết nối
   - Đảm bảo API key từ Google AI Studio hợp lệ

2. **Lỗi phổ biến:**
   - `API Error 400`: API key không đúng hoặc hết hạn
   - `API Error 403`: API key không có quyền truy cập
   - `API Error 429`: Đã vượt quá giới hạn request
   - `Network Error`: Kiểm tra kết nối internet

3. **Debug steps:**
   - Mở Developer Tools (F12)
   - Xem Console tab để thấy log chi tiết
   - Kiểm tra Network tab để xem request/response

### Lỗi không load được trang:
- Kiểm tra port 3000 có bị chiếm không
- Chạy lại `npm start`
- Clear browser cache
- Kiểm tra firewall/antivirus

### Lỗi component không hiển thị:
- Kiểm tra console browser có lỗi JavaScript không
- Đảm bảo tất cả dependencies đã được cài đặt
- Restart development server

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser (F12)
2. Đọc thông báo lỗi chi tiết
3. Kiểm tra kết nối mạng
4. Đảm bảo API key Gemini hợp lệ

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

🎉 **Chúc bạn học tiếng Anh hiệu quả với AI!** 🇬🇧🇺🇸
#   s t u d y - e n g l i s h  
 