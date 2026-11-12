# KẾ HOẠCH CHUẨN BỊ & TIMELINE 60 PHÚT (NGÀY 15/11/2026)

> **Người trình bày:** Trần Đức Anh (Team Ekila LMS)  
> **Chủ đề:** Zero Trust & Phân quyền thế hệ mới (Zanzibar / ReBAC) — Ekila Academy LMS  
> **Hình thức:** Internal Tech Talk / Knowledge Sharing (40–45p Trình bày & Demo + 15–20p Q&A)

---

## 1. LỊCH CHUẨN BỊ 3 NGÀY (12/11 → 15/11/2026)

| Ngày | Mục tiêu | Việc cần làm cụ thể |
| :--- | :--- | :--- |
| **12/11 (Tối)** | Chốt tài liệu & kiểm chứng Docker | • Kiểm tra Docker đang chạy đủ container (`docker compose up -d` trong `openfga/`) và Store `ekila-lms-b2c` đã có sẵn 15 Tuples.<br>• Mở `http://localhost:3011/` xem mượt toàn bộ **15 trang** và thử bấm **`Phóng to Iframe`** ở **Trang 13**. |
| **13/11** | Luyện nói lần 1 & căn giờ | • Mở `THUYET_TRINH_SLIDE.md` để tập nói từ **Trang 01 → Trang 15**.<br>• Tập thao tác Demo trên OpenFGA Playground (Trang 13): chạy 5 Check mẫu và thêm live tuple `enrolled` cho `user:an` (căn gọn 40–45 phút). |
| **14/11** | Luyện phản biện Q&A | • Mở `PHAN_BIEN_QA.md` để tự luyện trả lời thành tiếng **12 câu hỏi Q&A** (nhất là: *Khác gì Keycloak/RBAC?*, *Sao không nhét vào JWT?*, *Tránh N+1 phân trang?*, *Giữ 404 IDOR & đồng bộ Outbox VietQR?*). |
| **15/11 (Trước giờ G 15p)** | Sẵn sàng trình bày | • Đảm bảo `docker compose ps` trong `openfga/` đều `Up`.<br>• Mở sẵn `http://localhost:3011/` trên Chrome/Edge, bật Fullscreen (`F`) hoặc ẩn Mục lục (`M`) khi chia sẻ màn hình. |

---

## 2. TIMELINE CHI TIẾT BUỔI TECH TALK (60 PHÚT)

| Khung giờ | Thời lượng | Trang | Nội dung & Trọng tâm truyền đạt |
| :--- | :---: | :---: | :--- |
| `00:00 – 03:30` | 3.5p | **Trang 01–02** | **Mở đầu & Đặt vấn đề:** Nối tiếp bài *Keycloak SSO* và *RBAC trong Microservices*. Chốt 3 câu hỏi phân biệt `AuthN` / `RBAC` / `ReBAC`. |
| `03:30 – 10:00` | 6.5p | **Trang 03–04** | **Zero Trust Architecture:** Sự sụp đổ của Castle-and-Moat, kịch bản *Lateral Movement*, 3 trụ cột NIST SP 800-207 và mô hình **PEP – PDP**. |
| `10:00 – 13:30` | 3.5p | **Trang 05** | **Giới hạn của RBAC:** Bảng so sánh ACL vs RBAC vs ABAC vs ReBAC. Nhấn mạnh *Role Explosion* và logic kiểm tra sở hữu rải rác. |
| `13:30 – 20:30` | 7p | **Trang 06–07** | **ReBAC, Google Zanzibar & OpenFGA:** Đồ thị `object#relation@user`, kế thừa `from`, *New Enemy & Zookie*, *Leopard / Request Hedging*, và lý do chọn **OpenFGA**. |
| `20:30 – 29:30` | 9p | **Trang 08–10** | **Thực tế Ekila LMS (B2C):** 6 Microservices tách DB, Identity Service tự xây, 4 chốt chặn Zero Trust đã làm tốt, và **điểm nghẽn thật** (*Assessment* gọi chéo *Catalog* → lỗi `503`). |
| `29:30 – 35:00` | 5.5p | **Trang 11–12** | **Kiến trúc đích & OpenFGA DSL:** Tách PDP ra OpenFGA, đồng bộ qua Outbox VietQR, giữ nguyên `403 → 404` chống IDOR, và giải thích file `ekila-lms-model.fga`. |
| `35:00 – 41:00` | 6p | **Trang 13** | **Live Demo OpenFGA Playground (`Phóng to Iframe`):** Chạy `Check` trực tiếp trên Store `ekila-lms-b2c` (15 Tuples) và thêm live tuple `user:an` mô phỏng VietQR Outbox. |
| `41:00 – 45:00` | 4p | **Trang 14–15** | **Trade-off, Lộ trình Hybrid & Kết thúc:** Nêu rõ chi phí vận hành/độ trễ, đề xuất lộ trình Hybrid 3 giai đoạn và chuyển sang **Q&A**. |
| `45:00 – 60:00` | 15p | **Trang 15 (Q&A)** | **Q&A & Phản biện mở:** Tiếp nhận câu hỏi từ Mentor, Tech Lead và các team. |

---

## 3. LƯU Ý QUAN TRỌNG KHI TRÌNH BÀY

1. **Giữ đúng tầng kiến trúc:** Không đọc tên class/tên hàm nội bộ; nói ở cấp độ luồng request, dịch vụ và nghiệp vụ để mọi team đều hiểu.
2. **Đúng 100% sự thật của dự án:** Ekila LMS đang chạy mô hình **B2C** (chưa làm B2B); Quiz trắc nghiệm do **hệ thống tự động chấm** (`can_draft_or_submit` chỉ dành cho `owner`).
3. **Đánh giá khách quan Trade-off:** Luôn nhấn mạnh lộ trình **Hybrid** thay vì đề xuất đập đi làm lại toàn bộ ngay lập tức.
