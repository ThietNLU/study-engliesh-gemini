# Study English (AI Vocabulary App)

Ứng dụng web học từ vựng tiếng Anh tích hợp AI Gemini để tự động tạo danh sách từ theo yêu cầu người học. Dữ liệu được lưu cục bộ (localStorage) + tùy chọn Firebase (Firestore/Auth) cho mở rộng về sau.

## 🚀 Chức năng chính
- Thêm từ vựng thủ công (English / Vietnamese / IPA US-UK / ví dụ / định nghĩa / cấp độ / phân loại)
- Sinh từ vựng tự động bằng Gemini AI theo prompt người dùng, tránh trùng lặp từ đã có
- Quản lý & chỉnh sửa từ: tìm kiếm, sửa, xóa, gắn yêu thích (favorite)
- Đánh dấu yêu thích bằng Set tối ưu
- Thống kê nhanh: tổng số từ, phân bố theo category & level
- Từ điển (Dictionary Mode) dùng AI để tra cứu / giải thích nhanh
- Lưu & tự khởi tạo dữ liệu mẫu lần đầu dùng (seed `initialVocabulary`)
- Thông báo (toast) & hộp thoại xác nhận hành động
- Tổ chức code module hóa theo feature + Zustand store

## 🧱 Kiến trúc & Công nghệ
| Layer | Chi tiết |
|-------|---------|
| UI | React 18, chức năng theo `mode` (home, add, ai, manage, dictionary) |
| State | Zustand stores: `dataStore`, `uiStore` (đã lược bỏ learning/flashcard) |
| AI | `geminiService` gọi Gemini (cần API Key) + lọc từ trùng |
| Lưu trữ cục bộ | `storageService` + namespace (vocabulary, favorites, settings, migration) |
| Firebase (chuẩn bị) | `firebase.js` cấu hình sẵn – có thể thay bằng project riêng |
| Styling | TailwindCSS 3 + gradient nền |
| Tooling | ESLint + Prettier + Husky + lint-staged |

## � Cấu trúc thư mục chính
```
src/
	app/          # App root
	features/
		ai/         # AIMode + geminiService
		vocab/      # Add/Manage + hooks + initialVocabulary seed
		dictionary/ # DictionaryMode (AI tra cứu)
		flashcard/  # (đã gỡ bỏ)
		quiz/       # (đã gỡ bỏ)
	shared/
		stores/     # Zustand stores
		services/   # storage + safeStorage
		ui/         # Header, Footer, Toast, Dialog, ...
		config/     # firebase config
		utils/      # helper & migration utils
```

## 🔑 Yêu cầu môi trường
- Node.js >= 18
- NPM >= 9
- (Tùy chọn) Firebase project nếu muốn đồng bộ backend
- API Key Gemini để sinh từ vựng / tra cứu nâng cao

## 📦 Cài đặt & Chạy
```bash
npm install
npm run start        # Chạy dev
npm run build        # Build production
npm run deploy       # Build + Firebase deploy (cần cấu hình firebase.json & login)
```

## 🤖 Cấu hình API Key Gemini
Trong ứng dụng: vào AI Mode -> nhập API Key -> lưu. Key lưu trong storage an toàn (safeStorage nếu hỗ trợ, fallback localStorage) qua `storageService.settings`.

## 🧠 Sinh từ vựng bằng AI
`geminiService.generateVocabulary(prompt, existingWords, apiKey)`:
1. Gửi prompt người dùng
2. Nhận danh sách đề xuất
3. Lọc bỏ từ trùng (case-insensitive)
4. Chuẩn hoá đối tượng từ vựng

## �️ Lưu trữ nội bộ
- Lần đầu: kiểm tra migration flag -> nếu mới, nạp `initialVocabulary`
- CRUD qua `storageService.vocabulary`
- Favorites: Set<ID> để toggle nhanh

## 🧪 Scripts tiện ích
| Lệnh | Mục đích |
|------|----------|
| `npm run lint` | Kiểm tra lint |
| `npm run lint:fix` | Sửa tự động |
| `npm run format` | Format mã nguồn |
| `npm run format:check` | Kiểm tra định dạng |

## 🔐 Firebase
File `src/shared/config/firebase.js` chứa config mẫu – thay bằng config của bạn nếu triển khai thực. Khuyên chuyển sang `.env` khi public.

## 🛡️ Bảo mật
- Không commit API Key thật
- Dùng `.env.local` với `REACT_APP_GEMINI_KEY=...`
- Có thể mã hoá nhẹ trước khi lưu (tùy chọn)

## 📈 Mở rộng tương lai
-- (Tùy chọn tương lai) Có thể bổ sung lại Flashcard / Quiz nếu cần
- Đồng bộ Firestore đa thiết bị
- Export / Import (JSON/CSV)
- Dark mode & i18n
- Analytics tiến độ học

## ❓ Khắc phục sự cố
| Vấn đề | Cách xử lý |
|--------|-----------|
| Không sinh được từ | Kiểm tra API Key & mạng; xem console log |
| Dữ liệu biến mất | Kiểm tra localStorage / clearAllData đã gọi chưa |
| Build fail | `npm install` lại + `npm run lint:fix` |

## 📜 License
MIT

---
Made with ❤️ để hỗ trợ học từ vựng hiệu quả hơn bằng AI.

