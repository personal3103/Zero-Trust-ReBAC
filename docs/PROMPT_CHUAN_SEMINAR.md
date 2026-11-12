# PROMPT CHUẨN CHO BÀI THUYẾT TRÌNH EKILA LMS — ZERO TRUST & REBAC (OPENFGA)

> Tài liệu này lưu lại phiên bản Prompt đã được tinh chỉnh sát với kiến trúc thực tế của hệ thống **Ekila Academy LMS (B2C)**, phục vụ tái tạo hoặc mở rộng nội dung thuyết trình khi cần.

```markdown
Hãy đóng vai một Senior Security & Distributed Systems Architect kiêm Technical Presentation Designer. Nhiệm vụ của bạn là thiết kế một **Bộ Slide Thuyết Trình HTML tương tác** (tách module HTML/CSS/JS sạch sẽ) kèm tài liệu hướng dẫn mô phỏng OpenFGA phục vụ buổi Tech Talk nội bộ dài 60 phút.

### 1. BỐI CẢNH, MỤC TIÊU & NGUYÊN TẮC THIẾT KẾ
- **Chủ đề:** Zero Trust & Phân quyền thế hệ mới (Zanzibar / ReBAC) — Tư duy kiến trúc và Góc nhìn áp dụng cho hệ thống Ekila LMS
- **Người trình bày:** Trần Đức Anh – Thực tập sinh Backend / Security (Phụ trách mảng Auth, Identity, Session, Notification và Hạ tầng triển khai của Team Ekila LMS).
- **Thời lượng & Tính chất buổi họp:** Tech Talk nội bộ dài 60 phút (**35–45 phút trình bày + demo**, **15–20 phút Q&A & thảo luận mở**). Không khí chia sẻ cởi mở giữa đồng nghiệp từ nhiều team (LMS, Ekiosk, Menu Việt, F&B) cùng Mentor/Tech Lead.
- **Bối cảnh chuỗi Seminar:** Trong tuần có các bài trình bày về *RBAC trong Microservices* và *Keycloak SSO*. Bài này giúp định hình ranh giới giữa **Xác thực (AuthN)** và **Phân quyền (AuthZ)**, chỉ ra giới hạn của RBAC khi mở rộng và cách ReBAC (Zanzibar/OpenFGA) giải quyết bài toán đó.
- **Nguyên tắc nội dung (BẮT BUỘC TUÂN THỦ):**
  1. **Tách bạch 2 Phần rõ ràng:** **Phần I (Nền tảng Lý thuyết cốt lõi)** và **Phần II (Thực tế tại dự án Ekila LMS & Demo)**, kèm **Phần III (Trade-off & Q&A)**.
  2. **Đúng 100% phạm vi B2C và đúng quyền thực tế của dự án:**
     - Chỉ nói về mô hình **B2C** hiện có. **Tuyệt đối không đưa B2B, Multi-tenancy, `Organization` hay `ORG_ADMIN` vào phần LMS hay Demo** vì dự án chưa triển khai.
     - **Tuyệt đối không tự bịa vai trò không có thật** (như Trợ giảng / `TA` chấm bài — trong dự án việc chấm Quiz trắc nghiệm là **do hệ thống tự động chấm**).
     - Các vai trò thực tế: `STUDENT`, `INSTRUCTOR`, `CONTENT_ADMIN`, `SYSTEM_ADMIN` (cùng nhóm dịch vụ nội bộ):
       - `INSTRUCTOR`: soạn khóa học, bài giảng, ngân hàng câu hỏi cho khóa của mình (không tự xuất bản khóa học).
       - `CONTENT_ADMIN`: duyệt xuất bản khóa học, quản lý danh mục/coupon/ngân hàng câu hỏi và xem báo cáo (chỉ đọc đơn hàng, không được hủy đơn/hoàn tiền, không được làm/nộp bài thi hộ học viên).
       - `STUDENT`: học và làm Quiz ở khóa đã ghi danh (hệ thống tự chấm), chỉ xem/hủy đơn hàng và nộp/xem kết quả lượt thi của chính mình (ẩn `403 -> 404` chống IDOR).
       - `SYSTEM_ADMIN`: quản trị hệ thống, tài khoản, audit log, hủy đơn/hoàn tiền (vẫn không được làm/nộp bài thi hộ học viên).
  3. **Mức độ chi tiết khi nói về dự án:** Trình bày ở **cấp độ kiến trúc, luồng xử lý, vai trò và bài toán nghiệp vụ** để mọi team đều hiểu. **Không trích dẫn tên class, tên hàm hay chi tiết cài đặt mã nguồn Java/TypeScript nội bộ**.

### 2. YÊU CẦU GIAO DIỆN & TÍNH NĂNG
- Thiết kế UI theo chuẩn **Minimalism / API Developer Console**: nền tối phẳng (`#020617`), thẻ viền mảnh (`#1e293b`), độ tương phản cao, **không dùng gradient màu sặc sỡ**, **không dùng emoji làm icon** (100% SVG icons chuẩn).
- Chuyển động mượt mà (staggered reveal theo nhịp khi chuyển slide, luồng dữ liệu SVG động, tôn trọng `prefers-reduced-motion`).
- Tích hợp sẵn **Khung mô phỏng OpenFGA ReBAC** ngay trong Slide Demo (chạy thuật toán duyệt đồ thị thực tế, vẽ đồ thị SVG động, có nút mô phỏng Outbox VietQR, tab `ListObjects`) để tránh phải chuyển tab trình duyệt khi đang thuyết trình.
- Tích hợp sẵn **Speaker Notes Drawer** và **Q&A Playbook Modal** (12 câu hỏi phản biện & thảo luận).
```
