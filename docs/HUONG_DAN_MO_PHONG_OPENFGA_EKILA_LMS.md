# HƯỚNG DẪN MÔ PHỎNG & TRIỂN KHAI OPENFGA (REBAC) CHO EKILA ACADEMY LMS (B2C)

> **Tài liệu bổ trợ Tech Talk 60 phút** — Ngày trình bày: **15/11/2026**  
> **Người trình bày:** Trần Đức Anh (Backend / Security — Ekila LMS)  
> **Phạm vi thực tế:** 100% mô hình **B2C** đúng theo đặc tả & kiến trúc hiện tại của dự án (`STUDENT`, `INSTRUCTOR`, `CONTENT_ADMIN`, `SYSTEM_ADMIN`; hệ thống tự động chấm Quiz; chưa triển khai B2B).

---

## 1. MỤC TIÊU TÀI LIỆU

Tài liệu này giúp bạn:
1. Hiểu chính xác cách ánh xạ **ma trận phân quyền B2C hiện tại** của Ekila LMS sang mô hình **OpenFGA (Zanzibar / ReBAC)** mà không làm sai lệch bất kỳ quy tắc nghiệp vụ nào đang chạy trong hệ thống.
2. Nắm rõ từng file trong thư mục `../openfga/` (`ekila-lms-model.fga`, `tuples.json`, `ekila-lms.fga.yaml`, `docker-compose.yml`, `seed-openfga.ps1`) để mô phỏng cả **trên Slide** lẫn **trên OpenFGA Server thật**.
3. Nắm rõ **kiến trúc tích hợp PEP (LMS Microservice) ↔ PDP (OpenFGA)** và **chiến lược đồng bộ từ luồng Outbox VietQR** để trả lời chắc chắn các câu hỏi kỹ thuật từ Tech Lead & Mentor.

---

## 2. ĐỐI CHIẾU QUYỀN THỰC TẾ CỦA DỰ ÁN SANG OPENFGA

| Tài nguyên | `STUDENT` (Học viên) | `INSTRUCTOR` (Giảng viên) | `CONTENT_ADMIN` (QT Nội dung) | `SYSTEM_ADMIN` (QT Hệ thống) |
| :--- | :--- | :--- | :--- | :--- |
| **Course** | Xem khóa công khai / học khóa đã ghi danh | Tạo, sửa khóa học **của chính mình** (không tự xuất bản) | Duyệt xuất bản, chỉnh sửa mọi khóa học | Toàn quyền mọi khóa học |
| **Lesson** | Xem & ghi nhận tiến độ trên khóa **đã ghi danh** (hoặc bài `preview`) | Xem & soạn bài giảng trong khóa **của chính mình** | Xem & quản lý nội dung toàn hệ thống | Toàn quyền |
| **Quiz & Question Bank** | Làm bài Quiz thuộc khóa **đã ghi danh** | Quản lý câu hỏi & Quiz của khóa **của chính mình** *(hiện Assessment phải gọi sang Catalog)* | Quản lý ngân hàng câu hỏi toàn hệ thống | Toàn quyền |
| **Quiz Attempt** *(Hệ thống tự chấm)* | Lưu nháp, nộp bài & xem kết quả **lượt thi của chính mình** | Xem báo cáo kết quả khóa mình (không làm/nộp hộ) | Xem báo cáo kết quả toàn hệ thống (không làm/nộp hộ) | Xem báo cáo toàn hệ thống (không làm/nộp hộ) |
| **Order (VietQR)** | Tạo, thanh toán, xem & hủy **đơn của chính mình** | Không có quyền đơn hàng | Chỉ xem (`read-only`), **không được hủy** (`403`) | Xem, hủy đơn & hoàn tiền |

> **Lưu ý bảo mật chống IDOR:** Khi user đã đăng nhập truy cập vào đối tượng không thuộc quyền sở hữu (bài thi người khác, đơn hàng người khác, khóa nháp giảng viên khác), PEP trả về **HTTP 404 Not Found** thay vì `403 Forbidden` để che giấu sự tồn tại của tài nguyên.

---

## 3. GIẢI THÍCH CÁC ĐIỂM THIẾT KẾ TRONG `openfga/ekila-lms-model.fga`

1. **`type platform` làm gốc cho quyền cấp hệ thống (`system_admin`, `content_admin`):** Chỉ cần gắn 1 tuple `course#platform@platform:ekila` là toàn bộ quyền quản trị chảy xuống tự động, không cần gán từng admin vào hàng nghìn khóa học.
2. **Tách `can_edit` và `can_publish` trên `course`:** Giảng viên sửa được khóa mình tạo (`can_edit = true`), nhưng không tự xuất bản (`can_publish = false`); chỉ `content_admin` hoặc `system_admin` mới duyệt xuất bản.
3. **Tách `can_draft_or_submit` và `can_view_result` trên `quiz_attempt`:** Khớp đúng thực tế hệ thống tự chấm Quiz và ma trận IDOR: không Admin hay Giảng viên nào có thể lưu nháp/nộp bài thay học viên (`owner`-only), nhưng vẫn xem được báo cáo kết quả thông qua kế thừa 3 tầng `course -> quiz -> quiz_attempt` (dùng quan hệ trung gian `course_reporter` hợp lệ trong DSL 1.1).
4. **Dùng `user:*` cho `preview_viewer` trên `lesson`:** Cho phép cấu hình bài giảng học thử công khai mà không cần ghi danh.
5. **Tách `can_view` và `can_cancel` trên `order`:** `content_admin` xem được đơn hàng để đối soát nhưng bị chặn hủy đơn (`can_cancel = false`).

---

## 4. HƯỚNG DẪN CHẠY MÔ PHỎNG (2 CÁCH)

### Cách 1: Dùng khung Simulator tích hợp ngay trên Slide (`slides/index.html`)
- Mở `slides/index.html` trong trình duyệt, nhấn phím **`D`** để tới **Slide 14**.
- Chọn 1 trong 7 kịch bản có sẵn, xem đồ thị SVG duyệt quan hệ và thử bấm **`+ VietQR Outbox: user:an`** để mô phỏng thanh toán xong có quyền học ngay lập tức.

### Cách 2: Chạy OpenFGA Server thật bằng Docker Compose (`openfga/`)
> Docker được cấu hình chạy trên port **`8090` (HTTP)**, **`8091` (gRPC)** và **`3010` (Playground)** để không đụng port `8080` của Ekila API Gateway.

```powershell
cd "f:\OJT\LMS\tài liệu\seminar-zero-trust-rebac\openfga"

# 1. Khởi chạy PostgreSQL + OpenFGA Migrate + OpenFGA Server
docker compose up -d

# 2. Chạy script PowerShell tự động tạo Store, nạp Model, nạp 15 Tuples & test Check + ListObjects
.\seed-openfga.ps1
```

Nếu máy đã cài **OpenFGA CLI (`fga`)**, có thể chạy thêm bộ assertion test tự động:
```powershell
fga model test --tests ekila-lms.fga.yaml
```

---

## 5. KIẾN TRÚC TÍCH HỢP VÀO EKILA LMS (MỨC DESIGN PATTERN)

1. **API Gateway (AuthN + Edge Security):** Xác thực JWT, tước header giả mạo, ký **HMAC-SHA256 5-tuple** (`METHOD:PATH:USER_ID:ROLES:TIMESTAMP`) khi gọi nội bộ.
2. **Microservice nghiệp vụ đóng vai trò PEP:**
   - Thay vì *Assessment* gọi chéo sang *Catalog* để hỏi chủ sở hữu khóa học (dễ lỗi 503 khi Catalog nghẽn), PEP gọi OpenFGA `Check(userId, permission, objectId)`.
   - Khi `allowed == false`: PEP ném lỗi **HTTP 404** cho tài nguyên cần che giấu tồn tại (chống IDOR), hoặc **HTTP 403** cho hành động quản trị đặc thù (ví dụ `CONTENT_ADMIN` bấm hủy đơn).
3. **Đồng bộ từ luồng Outbox VietQR:**
   - Khi *Commerce* xác nhận thanh toán VietQR thành công và dùng **Transactional Outbox Pattern** để ghi danh sang *Learning*, worker đồng thời ghi Tuple `course:<id>#enrolled@user:<id>` vào OpenFGA (idempotent).
   - Khi hủy đơn/hoàn tiền → xóa Tuple tương ứng và dùng Consistency Token (`HIGHER_CONSISTENCY`) cho các thao tác nhạy cảm liền sau để chặn hiệu ứng *New Enemy*.
