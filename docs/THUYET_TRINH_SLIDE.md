# KỊCH BẢN THUYẾT TRÌNH CHÍNH (TRANG 01 → TRANG 15)

> **Người trình bày:** Trần Đức Anh (Team Ekila LMS) | **Ngày:** 15/11/2026 | **Thời lượng:** 40–45 phút trình bày & demo  
> **Slide trình chiếu:** `http://localhost:3011/` ([`../slides/index.html`](../slides/index.html))  
> **Tài liệu liên kết nhanh:**  
> - [Cẩm nang Phản biện Q&A (12 câu hỏi thực tế)](PHAN_BIEN_QA.md)  
> - [Kế hoạch chuẩn bị 3 ngày & Timeline 60 phút](KE_HOACH_VA_KICH_BAN_60P.md)  
> - [Hướng dẫn mô phỏng & tích hợp OpenFGA vào Ekila LMS](HUONG_DAN_MO_PHONG_OPENFGA_EKILA_LMS.md)  
> - [Prompt chuẩn của bài Seminar](PROMPT_CHUAN_SEMINAR.md)

---

## MỞ ĐẦU (TRANG 01 – TRANG 02)

### Trang 01 — Trang bìa & Bố cục (`00:00 – 01:30`)
- **Mục tiêu:** Chào hỏi cởi mở, giới thiệu chủ đề và 3 phần của buổi Tech Talk.
- **Lời nói:**
  > "Chào các anh chị Mentor, Tech Lead và mọi người. Mình là Đức Anh đến từ team Ekila LMS. Trong tuần này chúng ta đã cùng nghe về *Keycloak SSO* và *RBAC trong Microservices*. Hôm nay mình xin phép chia sẻ mảnh ghép tiếp theo: **Zero Trust & Phân quyền thế hệ mới theo mô hình Google Zanzibar / ReBAC**, và đặt nó lên chính bài toán thực tế của hệ thống **Ekila Academy LMS**. Bài nói gồm 3 phần: Lý thuyết cốt lõi, Thực tế tại Ekila LMS kèm Demo trực tiếp trên OpenFGA, và Đánh giá Trade-off trước khi sang phần Q&A."

### Trang 02 — AuthN vs AuthZ (Chuỗi Seminar) (`01:30 – 03:30`)
- **Điểm chốt:** Phân tách rõ 3 câu hỏi: *Keycloak/Identity (AuthN)* ≠ *RBAC (AuthZ thô)* ≠ *Zero Trust & ReBAC (AuthZ mịn)*.
- **Lời nói:**
  > "Nhiều bạn mới làm hay gộp chung đăng nhập với phân quyền. Thực tế có 3 câu hỏi tách biệt nhau hoàn toàn:  
  > 1. **Keycloak SSO / Identity (AuthN)** chỉ trả lời: *Bạn có đúng là Trần Đức Anh không?* Nó cấp JWT hoặc cookie, nhưng token không biết bạn đã mua khóa học nào.  
  > 2. **RBAC (AuthZ thô)** trả lời: *Vai trò INSTRUCTOR có được gọi API sửa khóa học không?* Nó chặn rất tốt Học viên gọi nhầm API của Admin, nhưng không phân biệt được Giảng viên A đang sửa khóa của mình hay khóa của Giảng viên B.  
  > 3. **Zero Trust & ReBAC (AuthZ mịn)** mới trả lời câu hỏi ở tầng dữ liệu: *User X có quan hệ gì với đúng bản ghi Y tại thời điểm này?* — đây mới là lớp chặn đứng lỗ hổng **IDOR** (đứng #1 trong OWASP API Top 10)."

---

## PHẦN I — NỀN TẢNG LÝ THUYẾT (TRANG 03 – TRANG 07)

### Trang 03 — Castle-and-Moat & Lateral Movement (`03:30 – 06:30`)
- **Điểm chốt:** Chỉ vào sơ đồ di chuyển ngang bên trái slide để giải thích vì sao mạng nội bộ không còn mặc định an toàn.
- **Lời nói:**
  > "Ở mô hình bảo mật truyền thống kiểu lâu đài — hào nước (*Castle-and-Moat*), ta chỉ gác chặt ở cổng ngoài, còn vào tới mạng nội bộ là các service tin nhau mặc định.  
  > Nhưng trong Microservices, nhìn vào sơ đồ này: chỉ cần kẻ tấn công chiếm được 1 service phụ, hoặc làm giả header `X-User-Id`, chúng có thể **di chuyển ngang (Lateral Movement)** sang các service lõi như *Commerce* hay *Identity*. Vì vậy ranh giới bảo mật phải đặt trên **từng request và từng bước gọi nội bộ**, không thể đặt ở tường lửa mạng nữa."

### Trang 04 — Zero Trust & Mô hình PEP / PDP (`06:30 – 10:00`)
- **Điểm chốt:** Nhớ 3 trụ cột NIST SP 800-207 và cách tách Điểm thực thi (PEP) khỏi Điểm ra quyết định (PDP).
- **Lời nói:**
  > "Triết lý cốt lõi của Zero Trust là *'Never Trust, Always Verify'*, gồm 3 trụ cột theo chuẩn NIST SP 800-207: **Xác minh tường minh** mọi ngữ cảnh; **Quyền tối thiểu** trên đúng tài nguyên cần dùng; và **Giả định hệ thống đã bị xâm nhập** để cô lập dịch vụ và ghi log bất biến.  
  > Ở tầng ứng dụng, ta tách kiến trúc thành 2 lớp: **PEP (Điểm thực thi)** nằm tại Gateway hoặc từng Microservice để chặn/mở request, và **PDP (Điểm ra quyết định)** nằm tách riêng để chuyên trả lời `Allow` hay `Deny`."

### Trang 05 — Giới hạn RBAC & So sánh 4 mô hình (`10:00 – 13:30`)
- **Điểm chốt:** Nêu 2 bẫy kỹ thuật của RBAC qua bảng so sánh: *Role Explosion* và *Logic kiểm tra sở hữu rải rác*.
- **Lời nói:**
  > "Nhìn bảng so sánh ACL, RBAC, ABAC và ReBAC: RBAC rất gọn cho phân quyền menu và endpoint thô. Nhưng khi hệ thống cần kiểm tra tới từng bản ghi dữ liệu, RBAC gặp ngay 2 vấn đề:  
  > - **Role Explosion (Bùng nổ vai trò):** Nếu nhét ID khóa học vào Role (kiểu `INSTRUCTOR_COURSE_101`), 10.000 khóa học sẽ làm JWT phình to và không thể quản trị nổi.  
  > - **Logic kiểm tra sở hữu rải rác:** Developer phải tự viết logic kiểm tra sở hữu lặp đi lặp lại trong từng Service và từng câu truy vấn SQL — rất khó kiểm toán câu hỏi *'Hiện tại ai đang xem được tài nguyên X?'*."

### Trang 06 — ReBAC & Kiến trúc Google Zanzibar (`13:30 – 18:00`)
- **Điểm chốt:** Cú pháp `object#relation@user`, kế thừa `from`, *New Enemy & Zookie*, *Leopard & Request Hedging*.
- **Lời nói:**
  > "ReBAC đổi câu hỏi từ *'User mang Role gì?'* sang *'User có quan hệ gì với Tài nguyên này trên đồ thị?'*. Đây là kiến trúc của **Google Zanzibar** đứng sau Drive, YouTube, Calendar với độ trễ p95 dưới 10ms.  
  > Cốt lõi là **Relation Tuples** dạng `object#relation@user`. Trên đồ thị bên phải: ta chỉ cần nối Khánh `enrolled` vào `course:spring-boot`, không cần gán Khánh vào từng bài giảng hay từng bài quiz lẻ — engine tự suy diễn quyền từ cha xuống con qua toán tử `from`.  
  > Zanzibar còn nổi bật ở 2 kỹ thuật: **Consistency Token (Zookie)** chặn lỗi *New Enemy* (user vừa bị thu hồi quyền không thể đọc tài liệu mới tải lên do cache trễ) và *Leopard Indexing + Request Hedging* để giữ độ trễ ổn định."

### Trang 07 — OpenFGA vs SpiceDB vs Ory Keto (`18:00 – 20:30`)
- **Điểm chốt:** Chốt lý do chọn **OpenFGA** cho Ekila LMS.
- **Lời nói:**
  > "Hiện có 3 dự án mã nguồn mở lớn hiện thực hóa Zanzibar: **OpenFGA** (CNCF), **SpiceDB** và **Ory Keto**. Với hệ sinh thái Java Spring Boot + PostgreSQL 16 của Ekila LMS, **OpenFGA** là lựa chọn hợp lý nhất vì dùng chung được PostgreSQL, DSL sạch dễ review trong PR, có sẵn giao diện Playground và CLI test tự động bằng YAML (`fga model test`)."

---

## PHẦN II — THỰC TẾ EKILA LMS (B2C) & LIVE DEMO (TRANG 08 – TRANG 13)

### Trang 08 — Kiến trúc 6 Microservices Ekila LMS (`20:30 – 23:30`)
- **Điểm chốt:** Bức tranh tách DB của dự án và vị trí Identity Service tự xây so với Keycloak SSO.
- **Lời nói:**
  > "Bây giờ đi vào thực tế ngay trên dự án **Ekila Academy LMS (B2C)**. Hệ thống tách thành 6 Microservices chạy độc lập theo mô hình **Database-per-Service**: `Identity`, `Catalog`, `Learning`, `Assessment`, `Commerce`, và `Notification` cô lập hoàn toàn khỏi Gateway. Mỗi service giữ một PostgreSQL DB riêng, không JOIN chéo DB được.  
  > Ở phần AuthN, team mình tự xây **Identity Service** (đăng ký, xác minh email, khóa tạm khi sai mật khẩu, xoay vòng Refresh Token, Google OAuth2) chứ chưa dùng Keycloak. Tuy nhiên dù dùng Identity tự xây hay Keycloak thì tầng này cũng chỉ lo AuthN và vai trò tổng quát."

### Trang 09 — Nền tảng Zero Trust đã có (`23:30 – 26:00`)
- **Điểm chốt:** 4 chốt chặn bảo mật thực tế đã xây dựng trong dự án.
- **Lời nói:**
  > "Thực tế trong codebase hiện tại, team đã triển khai sẵn 4 chốt chặn rất sát tinh thần Zero Trust:  
  > 1. Tại **API Gateway**: xác thực JWT và **tước bỏ triệt để header giả mạo** từ client.  
  > 2. Ở giao tiếp nội bộ: ký **HMAC-SHA256 5 thành phần** (`Method`, `Path`, `UserId`, `Roles`, `Timestamp` ±60s) để chống lấy chữ ký từ API đọc gọi sang API ghi, ngăn di chuyển ngang.  
  > 3. Cô lập hoàn toàn Notification và áp dụng **che giấu tồn tại 403 → 404** chống dò quét IDOR.  
  > 4. Nhật ký kiểm toán IAM là **Append-only** chặn sửa/xóa dưới DB. Hướng nâng cấp tiếp theo là thêm Redis Nonce chống replay và mTLS nội bộ."

### Trang 10 — Phân quyền 3 lớp & Điểm nghẽn thực tế (`26:00 – 29:30`)
- **Điểm chốt:** 4 vai trò B2C thật, Quiz tự chấm, và điểm nghẽn thật **Assessment gọi chéo Catalog**.
- **Lời nói:**
  > "Hiện tại Ekila LMS kiểm soát quyền qua 3 lớp: RBAC tĩnh cho 4 vai trò B2C (`STUDENT`, `INSTRUCTOR`, `CONTENT_ADMIN`, `SYSTEM_ADMIN`), kiểm tra sở hữu từng đối tượng (chống IDOR trả 404), và lọc phạm vi query DB.  
  > Với B2C MVP hiện tại nó chạy ổn, nhưng có một điểm nghẽn có thật ngay trong hệ thống: khi Giảng viên quản lý ngân hàng câu hỏi ở **Assessment**, dịch vụ này buộc phải **gọi mạng sang Catalog** để kiểm tra Giảng viên đó có đúng là chủ khóa học không — nếu Catalog gián đoạn, Assessment phải trả lỗi `503`. Ngoài ra logic kiểm tra sở hữu đang nằm phân mảnh ở nhiều service."

### Trang 11 — Kiến trúc đích với OpenFGA (`29:30 – 32:00`)
- **Điểm chốt:** Bỏ gọi chéo Assessment→Catalog, đồng bộ qua Outbox VietQR, giữ nguyên `403 → 404` ở PEP.
- **Lời nói:**
  > "Nếu tách phần quyết định quyền sang **OpenFGA (PDP)** như sơ đồ này: `Catalog`, `Learning`, `Assessment`, `Commerce` đều đóng vai **PEP**, hỏi thẳng OpenFGA thay vì gọi chéo lẫn nhau.  
  > Có 2 điểm rất khớp với luồng hiện tại của dự án:  
  > - Khi `Commerce` xác nhận thanh toán VietQR thành công và dùng **Outbox Pattern** để ghi danh sang `Learning`, worker Outbox đồng thời đẩy Tuple `enrolled` vào OpenFGA.  
  > - Khi OpenFGA trả về `false`, PEP của từng service vẫn dịch thành **HTTP 404** cho tài nguyên cần ẩn (hoặc **403** cho hành động sai vai trò quản trị) — giữ nguyên 100% cơ chế chống IDOR hiện có."

### Trang 12 — OpenFGA DSL chuẩn quyền B2C (`32:00 – 35:00`)
- **Điểm chốt:** Giải thích nhanh 4 quy tắc chuẩn theo code thật (chi tiết kỹ thuật xem thêm ở [Hướng dẫn mô phỏng OpenFGA](HUONG_DAN_MO_PHONG_OPENFGA_EKILA_LMS.md)).
- **Lời nói:**
  > "Đây là file `ekila-lms-model.fga` ánh xạ chính xác ma trận quyền B2C của dự án:  
  > - Tách `can_edit` và `can_publish`: Giảng viên sửa khóa mình tạo được, nhưng chỉ `content_admin` hoặc `system_admin` mới duyệt xuất bản.  
  > - Với `quiz_attempt`: vì Quiz trắc nghiệm do **hệ thống tự động chấm**, chỉ chính chủ `owner` mới có quyền `can_draft_or_submit`; ngay cả Admin cũng bị chặn nộp bài hộ, nhưng Giảng viên và Admin vẫn xem được báo cáo kết quả qua kế thừa 3 tầng.  
  > - Với `order`: `content_admin` chỉ được xem (`can_view`), bị chặn hủy đơn (`can_cancel`).  
  > - Bài học thử dùng wildcard `user:*` ở `preview_viewer`."

### Trang 13 — Live Demo: OpenFGA Playground (Docker Local) (`35:00 – 41:00`)
- **Thao tác mở đầu:** Bấm nút **`Phóng to Iframe`** ngay trên thanh công cụ của Trang 13 để bung OpenFGA Playground toàn màn hình (Store `ekila-lms-b2c` đã nạp sẵn 15 Tuples từ Docker PostgreSQL).
- **4 bước thao tác trực tiếp khi nói:**
  1. **Giới thiệu giao diện thật:** Chỉ vào **Model DSL** bên trái, **Tuples (15)** ở góc dưới, và **Types Previewer** (đồ thị 7 types) bên phải.
  2. **Mở `Tuple Queries` ở đáy khung Playground để chạy 5 phép `Check`:**
     - `user:khanh` | `can_view` | `lesson:jwt-01` → **`true`** *(Học viên đã mua — kế thừa 2 tầng)*.
     - `user:an` | `can_view` | `lesson:jwt-01` → **`false`** *(Học viên chưa mua — PEP trả 404 chống IDOR)*.
     - `user:an` | `can_view` | `lesson:intro-preview` → **`true`** *(Bài học thử `user:*`)*.
     - `user:duy` | `can_manage_questions` | `quiz:quiz-auth` → **`true`** *(Assessment hỏi thẳng OpenFGA, không gọi Catalog)*.
     - `user:duy` | `can_publish` | `course:spring-boot` → **`false`** và `user:linh` | `can_cancel` | `order:ord-khanh-01` → **`false`**.
  3. **Live Mutation (Mô phỏng VietQR Outbox):**
     - Bấm **`Add Tuple`** → thêm `course:spring-boot` | `enrolled` | `user:an` → Lưu.
     - Chạy lại `user:an` | `can_view` | `lesson:jwt-01` → lập tức đổi thành **`true`**!
  4. Bấm **`Thu nhỏ (Esc)`** (hoặc phím **`Esc`**) để quay về khung slide và chuyển sang Trang 14.

---

## PHẦN III — TRADE-OFF & KẾT THÚC (TRANG 14 – TRANG 15)

### Trang 14 — Trade-off & Lộ trình Hybrid (`41:00 – 44:00`)
- **Điểm chốt:** Nêu thẳng chi phí/đánh đổi và đề xuất lộ trình 3 giai đoạn thay vì đập đi làm lại.
- **Lời nói:**
  > "Công nghệ nào cũng có đánh đổi: đưa OpenFGA vào tức là thêm 1 service cần chạy HA, thêm 1 hop mạng kiểm tra quyền, và phải giữ đồng bộ Tuple với DB nghiệp vụ.  
  > Do đó với quy mô B2C MVP hiện tại, mình đề xuất lộ trình **Hybrid 3 giai đoạn**: giữ RBAC hiện tại cho các API đơn giản trong 1 DB; thí điểm OpenFGA ở điểm đau gọi chéo `Assessment ↔ Catalog ↔ Learning` trước; rồi mới chuẩn hóa toàn bộ khi hệ thống phình to."

### Trang 15 — Tổng kết & Q&A (`44:00 – 45:00` → chuyển sang Q&A `45:00 – 60:00`)
- **Lời nói:**
  > "Tóm lại có 3 ý chính mình muốn chia sẻ hôm nay: AuthN khác AuthZ; Zero Trust thực chiến bắt đầu từ từng hop nội bộ; và ReBAC là giải pháp gọn gàng khi Microservices tách DB gặp cảnh phải gọi chéo nhau để hỏi quyền. Cảm ơn các anh chị Mentor, Tech Lead và mọi người đã lắng nghe — bây giờ mình mời mọi người đặt câu hỏi và góp ý phản biện!"
- **Chuyển sang tài liệu chuẩn bị Q&A:** [Mở Cẩm nang Phản biện Q&A (12 câu hỏi thực tế)](PHAN_BIEN_QA.md)
