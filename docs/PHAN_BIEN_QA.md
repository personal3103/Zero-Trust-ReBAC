# CẨM NANG PHẢN BIỆN Q&A (12 CÂU HỎI THỰC TẾ)

> **Liên kết nhanh:** [← Quay lại Kịch bản Thuyết trình chính (Trang 01–15)](THUYET_TRINH_SLIDE.md) | [Kế hoạch 60 phút](KE_HOACH_VA_KICH_BAN_60P.md) | [Hướng dẫn OpenFGA](HUONG_DAN_MO_PHONG_OPENFGA_EKILA_LMS.md)

---

## Mẹo phản biện 3 bước khi gặp câu hỏi bất ngờ
1. **Chốt đúng tầng câu hỏi:** *"Câu hỏi này nằm ở tầng AuthN / AuthZ hay tầng vận hành dữ liệu..."*
2. **Nói thẳng Trade-off:** Không thần thánh hóa công nghệ; luôn nêu rõ *được gì — mất gì*.
3. **Kéo về bối cảnh Ekila LMS:** Gắn câu trả lời vào ví dụ thật (*Assessment gọi chéo Catalog*, *Outbox VietQR*, *ẩn lỗi 403 → 404*).

---

## Nhóm 1: Kiến trúc & Ranh giới công nghệ

**Câu 1: Bài này khác gì với RBAC trong Microservices và Keycloak SSO? Nếu sau này dùng Keycloak thì có thay thế luôn OpenFGA không?**
- **Trả lời:** Không thay thế được vì làm 2 việc khác nhau:
  - Keycloak lo **AuthN** (xác thực danh tính, SSO, cấp JWT) và tối đa chỉ nên giữ Role/Group tổng quát. Keycloak không lưu và không duyệt được đồ thị sở hữu hàng chục nghìn khóa học, lượt thi Quiz hay đơn hàng VietQR.
  - OpenFGA là **PDP cho AuthZ mịn**, đứng phía sau để trả lời *User X có quyền trên đúng bản ghi Y hay không*.

**Câu 2: Tại sao không nhét danh sách `courseId` đã mua của học viên vào JWT Token để khỏi phải gọi OpenFGA?**
- **Trả lời:** Có 3 vấn đề lớn:
  1. **Phình Token (Token Bloat):** Học viên mua nhiều khóa học thì JWT quá nặng, gửi kèm mọi HTTP request.
  2. **Dữ liệu cũ (Stale Claims):** Vừa thanh toán VietQR xong hoặc vừa bị hoàn tiền/thu hồi quyền, JWT cũ chưa hết hạn vẫn giữ quyền sai lệch.
  3. **Không hỗ trợ kế thừa nhiều tầng:** Không biểu diễn được quan hệ `course -> quiz -> quiz_attempt`.

**Câu 3: Ekila LMS đang là B2C và dùng RBAC 4 vai trò + guard sở hữu vẫn chạy ổn, khi nào mới thực sự cần ReBAC?**
- **Trả lời:**
  - **Chưa cần vội** nếu quyền chỉ phụ thuộc 1 cột `user_id` trong cùng 1 bảng của 1 service.
  - **Nên dùng ReBAC** khi có: (1) gọi chéo qua mạng giữa các service tách DB chỉ để hỏi quyền (như *Assessment → Catalog*); (2) cần cộng tác nhiều người/vai trò trên cùng tài nguyên; hoặc (3) cần kiểm toán tập trung toàn bộ quyền ở một nơi.

---

## Nhóm 2: Hiệu năng & Khả năng mở rộng

**Câu 4: Mọi API request đều phải gọi thêm 1 bước sang OpenFGA thì Latency tăng lên xử lý thế nào?**
- **Trả lời:**
  - Gọi qua **gRPC** trong mạng nội bộ thì độ trễ p95 của OpenFGA thường chỉ **2–8 ms** (các public endpoint ở Gateway không cần gọi OpenFGA).
  - Kết hợp connection pooling gRPC và cache TTL ngắn cho các quan hệ ít thay đổi.

**Câu 5: Với API lấy danh sách có phân trang (10.000 khóa học/đơn hàng), làm sao lọc quyền bằng ReBAC mà không bị N+1 query?**
- **Trả lời:** Tuyệt đối không chạy vòng lặp gọi `Check()` 10.000 lần. Có 3 cách:
  1. **`ListObjects` API:** Hỏi OpenFGA tập ID user được phép xem rồi truyền vào `WHERE id IN (...) LIMIT 20` ở PostgreSQL.
  2. **Pre-filter + `BatchCheck`:** Nếu danh sách lọc sẵn theo `user_id` hoặc trạng thái ở DB trước, sau khi phân trang 20 dòng thì gọi **1 lần `BatchCheck`** cho đúng 20 ID đó.
  3. **Read-Model đồng bộ:** Với tập dữ liệu cực lớn, đồng bộ quyền tính sẵn sang index tìm kiếm.

**Câu 6: Nếu OpenFGA sập (Single Point of Failure), cả hệ thống tê liệt? Chọn Fail-open hay Fail-closed?**
- **Trả lời:**
  - Về bảo mật bắt buộc chọn **Fail-closed** (`503 Service Unavailable`, tuyệt đối không cho lọt quyền — giống cách *Assessment* hiện tại trả `503` khi *Catalog* lỗi).
  - Để chống sập: chạy OpenFGA dạng **stateless cluster ≥ 2–3 replicas** sau Load Balancer nối PostgreSQL HA + Circuit Breaker.

---

## Nhóm 3: Dữ liệu, Tính nhất quán & Bảo mật IDOR

**Câu 7: Làm sao đồng bộ Tuple từ `Commerce` / `Learning` / `Catalog` sang OpenFGA mà không bị lệch DB?**
- **Trả lời:** Tận dụng chính **Transactional Outbox Pattern** đang có giữa *Commerce → Learning*: khi xác nhận thanh toán VietQR, đơn hàng và bản ghi Outbox commit trong cùng transaction ACID; worker Outbox vừa ghi danh ở `Learning` vừa gọi OpenFGA ghi Tuple (idempotent, tự retry nếu lỗi tạm thời).

**Câu 8: Giải thích bài toán "New Enemy Problem" bằng tình huống cụ thể trong Ekila LMS và cách xử lý?**
- **Trả lời:**
  - *Tình huống:* Học viên A vừa bị hoàn tiền đơn hàng và thu hồi quyền khóa học; 1 giây sau giảng viên tải lên một đề thi mới. Nếu đọc nhầm cache quyền cũ, học viên A vẫn xem được đề mới.
  - *Giải pháp:* Truyền tham số **`consistency: HIGHER_CONSISTENCY`** hoặc lưu Consistency Token / Zookie sau các thao tác thu hồi quyền để ép OpenFGA đọc từ snapshot mới nhất.

**Câu 9: Dự án đang trả 404 thay vì 403 để chống dò quét IDOR. Dùng OpenFGA có giữ được không?**
- **Trả lời:** Giữ nguyên **100%**. OpenFGA (PDP) chỉ trả `allowed: true/false`. Lớp **PEP** trong microservice LMS vẫn tự quyết định HTTP status trả ra client: **404 Not Found** cho tài nguyên cần ẩn (lượt thi, tiến độ, đơn hàng của người khác), hoặc **403 Forbidden** cho hành động quản trị sai vai trò (như `CONTENT_ADMIN` bấm hủy đơn).

---

## Nhóm 4: Zero Trust nội bộ & Vận hành

**Câu 10: Giao tiếp tới OpenFGA được bảo vệ theo chuẩn Zero Trust thế nào?**
- **Trả lời:** Cô lập hoàn toàn khỏi Internet (tương tự `notification-service`), dùng Network Policy chỉ cho các business microservices gọi vào cổng gRPC/HTTP nội bộ, bật Pre-shared Key / OIDC token của OpenFGA và nâng cấp dần lên mTLS.

**Câu 11: Quy mô dự án thực tập / MVP B2C dựng thêm OpenFGA có quá nặng không?**
- **Trả lời:** Có chi phí vận hành nên không khuyến nghị thay toàn bộ ngay lập tức. Lộ trình hợp lý nhất là **Hybrid**: giữ RBAC hiện tại cho API đơn giản và chỉ thí điểm OpenFGA ở điểm đau gọi chéo giữa `Catalog — Learning — Assessment`.

**Câu 12: Khi nghiệp vụ B2C mở rộng (ví dụ thêm gói Combo nhiều khóa hoặc nhiều Giảng viên đồng sở hữu 1 khóa), nâng cấp Model và test thế nào?**
- **Trả lời:**
  - Mỗi Authorization Model trong OpenFGA có `authorization_model_id` bất biến theo phiên bản. Khi thêm quan hệ mới (như `co_instructor` hay `bundle`), ta bổ sung test case vào file `ekila-lms.fga.yaml` và chạy **`fga model test`** trong CI/CD để đảm bảo không làm vỡ quyền cũ.
  - Áp dụng chiến lược **Expand-and-Contract**: xuất bản model mới hỗ trợ cả quan hệ cũ và mới, backfill Tuples ở nền, rồi mới gỡ phần cũ mà không downtime.
