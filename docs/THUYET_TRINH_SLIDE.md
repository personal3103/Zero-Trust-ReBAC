# KỊCH BẢN THUYẾT TRÌNH CHI TIẾT THEO SLIDE (TRANG 01 → TRANG 15)

> **Người trình bày:** Trần Đức Anh (Team Ekila LMS) | **Ngày:** 15/11/2026 | **Thời lượng:** 40–45 phút trình bày & demo + 15–20 phút Q&A  
> **Link Slide Trực tuyến:** `https://personal3103.github.io/Zero-Trust-ReBAC/` ([`../slides/index.html`](../slides/index.html))  
>
> **Hệ thống tài liệu liên kết (chuyển nhanh theo mục đích):**  
> - [Cẩm nang Phản biện Q&A (12 câu hỏi kỹ thuật thường gặp)](PHAN_BIEN_QA.md)  
> - [Kế hoạch chuẩn bị 3 ngày & Timeline 60 phút](KE_HOACH_VA_KICH_BAN_60P.md)  
> - [Hướng dẫn mô phỏng & tích hợp OpenFGA vào Ekila LMS](HUONG_DAN_MO_PHONG_OPENFGA_EKILA_LMS.md)  
> - [Prompt chuẩn & Ràng buộc phạm vi B2C của Seminar](PROMPT_CHUAN_SEMINAR.md)

---

## Cách sử dụng tài liệu này khi thuyết trình
Mỗi trang gồm 3 phần bám sát đúng màn hình slide để bạn nói trôi chảy mà không cần học vẹt:
1. **Trên màn hình slide có gì:** Nhắc nhanh các khối/sơ đồ/bảng để bạn đưa tay chỉ đúng chỗ.
2. **Ý hiểu đơn giản (cho mọi thành viên cùng nắm):** Ví dụ đời thường giúp cả bạn Frontend, QA/Tester, BA lẫn Dev Backend đều hiểu ngay.
3. **Lời thuyết trình gợi ý:** Lời nói đầy đủ, giải thích rõ thuật ngữ, có câu chuyển mượt sang trang tiếp theo.

---

## MỞ ĐẦU (TRANG 01 – TRANG 02)

### Trang 01 — Trang bìa & Bố cục (`00:00 – 01:30`)
- **Trên màn hình slide:** Tên đề tài *Zero Trust & Phân quyền thế hệ mới (Google Zanzibar / ReBAC)*, phạm vi *Ekila Academy LMS (B2C)*, tên diễn giả và 3 thẻ tóm tắt: *Phần I. Lý thuyết cốt lõi*, *Phần II. Thực tế Ekila LMS*, *Phần III. Trade-off & Q&A*.
- **Lời thuyết trình gợi ý:**
  > "Chào các anh chị Mentor, Tech Lead và tất cả mọi người. Mình là Trần Đức Anh, thành viên team **Ekila LMS**.  
  > Trong chuỗi Tech Talk tuần này, chúng ta đã đi qua 2 chủ đề nền tảng là *Keycloak SSO* (giải quyết bài toán đăng nhập tập trung) và *RBAC trong Microservices* (phân quyền theo vai trò). Hôm nay mình xin phép chia sẻ mảnh ghép hoàn thiện bức tranh bảo mật đó: **Zero Trust & Phân quyền thế hệ mới theo mô hình Google Zanzibar / ReBAC**, gắn trực tiếp lên hệ thống **Ekila Academy LMS (B2C)** mà team mình đang phát triển.  
  > Bài chia sẻ dài khoảng 40–45 phút gồm 3 phần rõ ràng như trên màn hình:  
  > - **Phần I — Lý thuyết cốt lõi:** Vì sao tư duy tường lửa cũ không còn đủ, Zero Trust hoạt động thế nào, và vì sao Google phải tạo ra Zanzibar / ReBAC.  
  > - **Phần II — Thực tế Ekila LMS:** Đi thẳng vào kiến trúc 6 microservices của dự án, những lớp Zero Trust đã làm được, điểm nghẽn có thật khi tách DB và **Demo trực tiếp** trên OpenFGA với dữ liệu khóa học của Ekila.  
  > - **Phần III — Đánh giá Trade-off & Lộ trình Hybrid:** Nói thẳng chi phí, rủi ro, thời điểm nên áp dụng và dành 15–20 phút cuối để mọi người trao đổi, phản biện."

---

### Trang 02 — AuthN vs AuthZ: Kết nối chuỗi Seminar (`01:30 – 04:00`)
- **Trên màn hình slide:** 3 cột đặt cạnh nhau: *1. Keycloak SSO / Identity (AuthN)* → *2. RBAC Microservices (AuthZ Thô)* → *3. Zero Trust & ReBAC (AuthZ Mịn)*, kèm câu chốt *Key Takeaway*.
- **Ví dụ dễ hiểu cho cả phòng:**
  > Hãy tưởng tượng bạn tới rạp chiếu phim hoặc vào một tòa nhà công ty:  
  > - **AuthN (Đăng nhập):** Là quầy lễ tân kiểm tra CCCD/vé để xác nhận *"Bạn đúng là anh A"*.  
  > - **RBAC (AuthZ thô):** Là phân loại thẻ *"Khách xem phim"* được vào khu vực rạp, không được vào phòng máy chiếu. Nhưng nếu chỉ kiểm tra thẻ *"Khách xem phim"*, ai cũng cầm thẻ đó vào ngồi nhầm ghế hoặc vào nhầm phòng chiếu phim khác thì sao?  
  > - **ReBAC (AuthZ mịn):** Là người soát vé tại từng cửa phòng kiểm tra xem **đúng vé của bạn** có khớp với **đúng phòng 3, ghế G5, suất chiếu 20h** hay không.
- **Lời thuyết trình gợi ý:**
  > "Trước khi đi sâu vào kỹ thuật, mình muốn làm rõ một hiểu nhầm rất hay gặp: nhiều bạn nghĩ chỉ cần làm xong đăng nhập SSO và gắn Role là hệ thống đã an toàn. Thực tế có 3 tầng câu hỏi hoàn toàn khác nhau:  
  > - **Cột 1 — Identity / Keycloak SSO (AuthN):** Trả lời câu hỏi *'Bạn có đúng là Trần Đức Anh không?'*. Nó xử lý đăng nhập, Google OAuth2, khóa tạm khi sai mật khẩu, cấp phát JWT. Nhưng JWT này chỉ chứa danh tính và vai trò chung, **không hề biết bạn đã mua khóa học nào hay chưa**.  
  > - **Cột 2 — RBAC Microservices (AuthZ Thô):** Trả lời câu hỏi *'Vai trò INSTRUCTOR có được phép gọi API sửa khóa học không?'*. RBAC cực kỳ gọn để chặn Học viên gọi nhầm API của Admin. Nhưng giới hạn chí mạng của nó là: nếu Giảng viên Duy sửa `course_id` trên URL từ khóa của mình sang khóa của Giảng viên Minh, RBAC thấy Duy vẫn mang role `INSTRUCTOR` nên vẫn cho qua nếu ta không kiểm tra thêm!  
  > - **Cột 3 — Zero Trust & ReBAC (AuthZ Mịn):** Mới giải quyết câu hỏi ở từng bản ghi dữ liệu: *'User X có quan hệ gì với đúng khóa học Y, bài giảng Z tại thời điểm hiện tại không?'* — đồng thời không mặc định tin bất kỳ request nội bộ nào. Đây chính là lớp chặn đứng lỗ hổng **IDOR** (lỗi thay đổi ID để xem/sửa trộm dữ liệu người khác, đứng **#1 OWASP API Top 10**)."

---

## PHẦN I — NỀN TẢNG LÝ THUYẾT CỐT LÕI (TRANG 03 – TRANG 07)

### Trang 03 — Sự sụp đổ của Castle-and-Moat & Kịch bản Lateral Movement (`04:00 – 07:00`)
- **Trên màn hình slide:** Sơ đồ bên trái (*Attacker → API Gateway → Service phụ bị chiếm → di chuyển ngang sang Commerce / Identity*), bên phải liệt kê 3 nguyên nhân thất bại.
- **Ví dụ dễ hiểu:** Giống như một tòa lâu đài xây hào nước và tường thành thật cao ở cổng ngoài (*Castle-and-Moat*), nhưng bên trong mọi căn phòng đều mở toang không khóa cửa. Kẻ trộm chỉ cần trèo rào lọt qua một nhà kho phụ là đi thẳng vào kho bạc trung tâm.
- **Lời thuyết trình gợi ý:**
  > "Trước đây khi hệ thống chạy dạng nguyên khối (Monolith) trong một mạng công ty đóng kín, người ta hay dùng mô hình **Castle-and-Moat**: chỉ kiểm tra chặt ở API Gateway hoặc firewall ngoài cùng; một khi request đã lọt vào trong mạng nội bộ thì các service mặc định tin tưởng nhau.  
  > Nhìn vào sơ đồ bên trái, khi chuyển sang Microservices, hàng chục container giao tiếp với nhau liên tục, tư duy đó sụp đổ bởi 2 kịch bản thực tế:  
  > 1. **Header Spoofing (Giả mạo danh tính nội bộ):** Nhiều hệ thống cho Gateway đọc JWT xong rồi nhét `X-User-Id` vào header gửi xuống các service bên dưới. Nếu attacker gửi thẳng header giả đó qua một kẽ hở mạng hoặc Gateway quên lọc sạch header từ client, service phía sau sẽ tin sái cổ và thực thi dưới quyền Admin.  
  > 2. **Lateral Movement (Di chuyển ngang):** Giả sử một service phụ (ví dụ xử lý upload file hoặc webhook) dính lỗi SSRF hay RCE. Nếu các service lõi như *Commerce* hay *Identity* không kiểm tra chữ ký và quyền cho từng bước gọi nội bộ, kẻ tấn công từ service phụ sẽ gọi ngang sang để tạo đơn hàng miễn phí hoặc lấy token quản trị, gây sập dây chuyền.  
  > Vì vậy ở trang tiếp theo, chúng ta cần đổi tư duy: **ranh giới bảo mật không nằm ở bức tường mạng, mà nằm trên từng request**."

---

### Trang 04 — Zero Trust Architecture: 3 Trụ cột & Mô hình PEP / PDP (`07:00 – 10:30`)
- **Trên màn hình slide:** 3 thẻ trụ cột NIST SP 800-207 ở trên (*Verify Explicitly*, *Least Privilege*, *Assume Breach*) và sơ đồ luồng `Client + JWT → Gateway (AuthN) → Microservice (PEP) ⇄ AuthZ Engine (PDP)` ở dưới.
- **Ví dụ dễ hiểu:** PEP giống anh bảo vệ đứng ngay cửa phòng thu âm (**thực thi** mở/đóng cửa), còn PDP giống quyển sổ quy định + hệ thống tra cứu trung tâm (**ra quyết định** `Allow` hay `Deny`). Bảo vệ không tự nhớ hết luật trong đầu, mà hỏi hệ thống trung tâm rồi mới mở cửa hoặc từ chối.
- **Lời thuyết trình gợi ý:**
  > "Khẩu hiệu của Zero Trust theo chuẩn **NIST SP 800-207** là *'Never Trust, Always Verify'* — không tin mặc định ai, kể cả service nằm cùng một mạng Docker. Nó đứng trên **3 trụ cột**:  
  > - **Verify Explicitly (Xác minh tường minh):** Mỗi request đều phải kiểm tra đủ ngữ cảnh: JWT còn hạn không, chữ ký nội bộ giữa service có hợp lệ không, gọi từ endpoint nào.  
  > - **Least Privilege (Quyền tối thiểu):** Chỉ cấp quyền vừa khít với thứ người dùng được phép làm — chỉ xem đúng khóa đã mua, chỉ sửa đúng bài giảng thuộc khóa của mình.  
  > - **Assume Breach (Giả định đã bị xâm nhập):** Luôn thiết kế như thể hacker đã lọt được vào mạng nội bộ để cô lập dịch vụ nhạy cảm, giới hạn bán kính sát thương và ghi log bất biến phục vụ truy vết.  
  >  
  > Xuống sơ đồ phía dưới là kiến trúc tách vai kinh điển của Zero Trust ở tầng ứng dụng:  
  > - **PEP (Policy Enforcement Point — Điểm thực thi):** Nằm tại API Gateway hoặc trong từng Microservice. PEP nhận request đã qua AuthN, gửi câu hỏi sang PDP và thực thi kết quả — nếu bị từ chối thì chặn ngay hoặc trả lỗi `404` che giấu tài nguyên.  
  > - **PDP (Policy Decision Point — Điểm ra quyết định):** Là một AuthZ Engine độc lập (như OpenFGA) chỉ chuyên trả lời `Allow` hoặc `Deny`. Tách PEP và PDP giúp code nghiệp vụ của các microservice cực kỳ sạch, không phải tự viết lại logic phân quyền ở khắp nơi."

---

### Trang 05 — Giới hạn RBAC truyền thống & So sánh 4 mô hình (`10:30 – 14:00`)
- **Trên màn hình slide:** Bảng so sánh 4 cột **ACL vs RBAC vs ABAC vs ReBAC (Zanzibar)** theo 5 tiêu chí (*Đơn vị cốt lõi*, *Phân cấp & Kế thừa*, *Độ mịn theo dữ liệu*, *Kiểm toán "Ai có quyền gì?"*, *Phù hợp nhất cho*), cùng 2 hộp cảnh báo ở dưới (*Role Explosion* và *Logic kiểm tra sở hữu rải rác*).
- **Giải thích 4 mô hình thật dễ hiểu:**
  - **ACL:** Gắn thẳng danh sách tên người vào từng file (`File A: [An, Bình]`). Đơn giản nhưng khi có 1 triệu bài học thì sửa tay rất khổ.
  - **RBAC:** Gom quyền theo chức danh (`INSTRUCTOR`, `STUDENT`). Rất tốt cho menu/API, nhưng thô theo dữ liệu.
  - **ABAC:** Viết luật `IF ... ELSE ...` dựa theo thuộc tính (vd: chỉ truy cập từ IP văn phòng trong giờ hành chính). Mạnh về ngữ cảnh nhưng khi cây dữ liệu nhiều tầng, bộ rule `IF/ELSE` phình to rất khó kiểm soát.
  - **ReBAC:** Quyền sinh ra tự nhiên từ **mối quan hệ thực tế** giữa người và đồ vật (Bạn là *tác giả* của khóa học → khóa học có *bài giảng* → bạn nghiễm nhiên sửa được bài giảng).
- **Lời thuyết trình gợi ý:**
  > "Nhìn vào bảng so sánh trên slide, mỗi mô hình có một đất diễn riêng. Thực tế không có mô hình nào vứt bỏ mô hình nào — RBAC vẫn rất tốt để kiểm tra quyền thô theo API và hiển thị menu. Nhưng khi cố ép RBAC đi xuống kiểm tra chi tiết từng bản ghi trong Microservices, ta dính 2 cái bẫy rất đau:  
  > 1. **Role Explosion (Bùng nổ vai trò):** Nếu bạn thử nhét ID tài nguyên vào tên Role, ví dụ `INSTRUCTOR_COURSE_101`, `ENROLLED_COURSE_205`... Khi hệ thống có 10.000 khóa học và 50.000 học viên, danh sách Role trong JWT sẽ phình to đến mức tràn header HTTP và không thể quản trị được.  
  > 2. **Logic kiểm tra sở hữu rải rác:** Để vá lỗ hổng IDOR, developer đành viết tay `if (course.getInstructorId() != currentUserId)` rải khắp mọi Service và mọi câu query SQL. Đến lúc Tech Lead hoặc Auditor hỏi một câu đơn giản: *'Hiện tại những ai đang có quyền xem đề thi này?'*, hệ thống không trả lời nhanh được vì quy tắc nằm rải rác ở 4–5 chỗ code khác nhau."

---

### Trang 06 — Tư duy ReBAC & Kiến trúc Google Zanzibar (`14:00 – 18:30`)
- **Trên màn hình slide:** Bên trái là 3 dòng Relation Tuples mẫu + 2 khái niệm *New Enemy & Zookie* và *Leopard / Request Hedging*; bên phải là đồ thị 5 node minh họa `user:duy` (`instructor`), `user:khanh` (`enrolled`) nối vào `course:spring-boot`, kế thừa xuống `lesson:jwt-01` và `quiz:quiz-auth`.
- **Ví dụ dễ hiểu cho đồ thị bên phải:** Một khóa học có 50 video và 10 bài quiz. Với ACL cũ, khi học viên Khánh mua khóa, bạn phải chèn 60 dòng quyền vào 60 video/quiz; đến khi giảng viên thêm bài thứ 51, bạn lại phải chạy đi cập nhật cho hàng nghìn học viên. Với **ReBAC**, bạn chỉ cần nối **1 sợi dây duy nhất**: `Khánh --[enrolled]--> Khóa Spring Boot`. Vì các bài giảng đã nối `parent_course` về Khóa Spring Boot, hệ thống tự bắc cầu cho Khánh xem đủ cả 50 bài lẫn bài thứ 51 vừa thêm!
- **Lời thuyết trình gợi ý:**
  > "Năm 2019, Google công bố bài báo về **Zanzibar** — hệ thống phân quyền tập trung đứng sau Google Drive, YouTube, Calendar, Maps... xử lý hàng triệu lượt kiểm tra quyền mỗi giây với độ trễ p95 dưới 10 mili-giây.  
  > Tư duy cốt lõi của Zanzibar (ReBAC) cực kỳ trực quan, biểu diễn mọi quyền dưới dạng các bộ ba **Relation Tuple**: `object#relation@user`. Nhìn 3 dòng code và sơ đồ bên phải:  
  > - `course:spring-boot#instructor@user:duy` (Duy là giảng viên khóa Spring Boot)  
  > - `course:spring-boot#enrolled@user:khanh` (Khánh đã ghi danh khóa Spring Boot)  
  > - `lesson:jwt-01#parent_course@course:spring-boot` (Bài JWT thuộc khóa Spring Boot)  
  > Nhờ từ khóa kế thừa bắc cầu (`from`), chỉ cần nối 1 cạnh `enrolled` tới khóa học, OpenFGA sẽ tự suy diễn từ cha xuống toàn bộ `lesson` và `quiz` con.  
  >  
  > Ngoài mô hình đồ thị, Zanzibar giải quyết 2 bài toán hóc búa ở quy mô lớn mà mọi người hay thắc mắc:  
  > - **Bài toán New Enemy & Zookie (Consistency Token):** Ví dụ Khánh vừa bị hoàn tiền/thu hồi quyền học, nhưng ngay 1 giây sau giảng viên vừa up đề thi mới lên khóa. Nếu server dùng cache cũ chưa kịp xóa quyền của Khánh, Khánh có thể nhìn trộm đề mới vừa tạo (*New Enemy*). Zanzibar giải bằng **Zookie**: mỗi lần thay đổi dữ liệu sinh ra một mốc thời gian nhất quán; lần kiểm tra quyền tiếp theo bắt buộc đọc dữ liệu ít nhất từ mốc đó trở về sau.  
  > - **Hiệu năng < 10ms:** Họ dùng **Leopard Indexing** (tính trước tập nhóm lồng nhiều tầng) và **Request Hedging** (gửi song song tới replica khác nếu 1 replica phản hồi chậm để triệt tiêu độ trễ đuôi)."

---

### Trang 07 — Hệ sinh thái mã nguồn mở: OpenFGA vs SpiceDB vs Ory Keto (`18:30 – 21:00`)
- **Trên màn hình slide:** 3 thẻ so sánh **OpenFGA (Khuyên dùng)**, **SpiceDB (AuthZed)**, **Ory Keto**, và hộp chốt lựa chọn cho Ekila LMS.
- **Lời thuyết trình gợi ý:**
  > "Google Zanzibar chỉ là bản thiết kế nội bộ không mở mã nguồn, nhưng cộng đồng đã xây dựng 3 bản hiện thực hóa nổi bật nhất theo chuẩn này:  
  > 1. **OpenFGA** (dự án thuộc CNCF, do Auth0/Okta khởi xướng): Ngôn ngữ DSL rất sạch và dễ đọc — ngay cả người không code backend nhìn vào cũng hiểu ai được làm gì. Quan trọng nhất là chạy tốt trên **PostgreSQL**, có SDK cho Java/Node, và có sẵn công cụ test tự động bằng YAML (`fga model test`).  
  > 2. **SpiceDB** (của AuthZed): Kiến trúc bám rất sát bài báo gốc, nổi bật với cơ chế **ZedToken** xử lý bài toán *New Enemy* cực kỳ nghiêm ngặt và hợp với hệ thống lớn dùng CockroachDB phân tán.  
  > 3. **Ory Keto:** Phù hợp nhất nếu cả hệ thống của bạn đã dùng trọn bộ Ory Stack (Hydra, Kratos).  
  >  
  > Với team Ekila LMS đang chạy sẵn PostgreSQL 16 và cần đồ thị dễ hiểu để mọi thành viên cùng review trên PR, **OpenFGA** là lựa chọn cân bằng và ít ma sát nhất để chuyển sang Phần II — áp dụng lên chính dự án của chúng ta."

---

## PHẦN II — THỰC TẾ EKILA LMS (B2C) & LIVE DEMO (TRANG 08 – TRANG 13)

### Trang 08 — Bức tranh kiến trúc 6 Microservices Ekila LMS (`21:00 – 24:00`)
- **Trên màn hình slide:** Sơ đồ luồng `Next.js 16 (Web B2C) → Traefik Proxy → API Gateway (:8080)` chia xuống 5 service (`Identity`, `Catalog`, `Learning`, `Assessment`, `Commerce`), đường gọi chéo màu cam từ `Assessment → Catalog`, đường `Outbox` từ `Commerce`, và `Notification (:8086 — Cô lập)` không public qua Gateway; bên phải giải thích vị trí *Identity tự xây vs Keycloak*.
- **Lời thuyết trình gợi ý:**
  > "Bây giờ chúng ta đặt lý thuyết xuống đúng hệ thống **Ekila Academy LMS** — một nền tảng học trực tuyến **B2C** nơi học viên mua từng khóa học qua thanh toán VietQR, học video và làm Quiz trắc nghiệm tự chấm.  
  > Nhìn vào sơ đồ kiến trúc hiện tại của team: người dùng từ trình duyệt Next.js đi qua Traefik và vào **API Gateway (:8080)**. Đằng sau Gateway là **6 Microservices độc lập** theo đúng nguyên tắc **Database-per-Service**:  
  > - **Identity:** Quản lý tài khoản, xác minh email, đăng nhập, Google OAuth2, khóa tạm sau 5 lần nhập sai mật khẩu, xoay vòng Refresh Token.  
  > - **Catalog:** Quản lý khóa học, chương/bài giảng và video/tài liệu trên MinIO S3.  
  > - **Learning:** Ghi danh học viên và lưu tiến độ xem bài học.  
  > - **Assessment:** Ngân hàng câu hỏi, đề thi Quiz và lượt làm bài (**hệ thống tự động chấm điểm**).  
  > - **Commerce:** Giỏ hàng, đơn hàng và webhook thanh toán VietQR.  
  > - **Notification (:8086):** Cô lập hoàn toàn, **không mở route qua Gateway**, chỉ nhận lệnh nội bộ để gửi email.  
  >  
  > Ở đây mọi người chú ý 2 điểm: Thứ nhất, team mình tự xây **Identity Service** chứ chưa dùng Keycloak SSO — nhưng dù dùng loại nào thì nó cũng chỉ lo **AuthN**. Thứ hai, vì 6 service giữ **6 database PostgreSQL tách biệt**, không service nào được phép `JOIN` bảng sang DB của service khác. Chính điều này sẽ dẫn tới điểm nghẽn kiểm tra quyền mà mình trình bày ngay sau đây."

---

### Trang 09 — 4 Chốt chặn Zero Trust Ekila LMS đang vận hành (`24:00 – 27:00`)
- **Trên màn hình slide:** Sơ đồ luồng bảo vệ 4 bước (`Client + JWT → 1. Gateway Edge → 2. HMAC 5-Tuple → 3. Service + IDOR Shield → 4. Audit DB`) và 2 thẻ tóm tắt phía dưới.
- **Giải thích dễ hiểu về 403 → 404 và HMAC 5-Tuple:**
  - *Vì sao ẩn 403 thành 404?* Nếu hệ thống trả `403 Forbidden`, kẻ tấn công biết chắc *"À, ID bài thi/đơn hàng này có tồn tại trong DB, chỉ là mình không có quyền"* và tiếp tục dò quét. Trả `404 Not Found` khiến kẻ tấn công không biết bản ghi đó có tồn tại hay không.
  - *Vì sao HMAC phải ký đủ 5 thành phần?* Nếu chỉ ký `UserId`, hacker cướp được chữ ký từ một API `GET` xem danh sách rồi đem tái sử dụng cho API `DELETE` hoặc `POST` sẽ lọt. Ký cả `METHOD : PATH : USER_ID : ROLES : TIMESTAMP` (±60 giây) khóa chặt chữ ký vào đúng hành động và đúng thời điểm đó.
- **Lời thuyết trình gợi ý:**
  > "Trước khi nói về những gì cần nâng cấp, cần ghi nhận là dự án của chúng ta không bắt đầu từ con số 0. Nhìn vào sơ đồ chuỗi bảo vệ từ trái sang phải, team đã triển khai sẵn 4 chốt chặn rất sát tinh thần Zero Trust:  
  > 1. **Tước bỏ header giả mạo tại Gateway:** Gateway xác thực JWT và xóa sạch mọi header định danh mà client tự ý nhét vào trước khi chuyển request xuống service nội bộ.  
  > 2. **Chữ ký nội bộ HMAC-SHA256 (5-Tuple):** Mọi lời gọi từ Gateway vào microservices đều được ký trên 5 thành phần: `METHOD`, `PATH`, `USER_ID`, `ROLES` và `TIMESTAMP` trong cửa sổ ±60 giây. Điều này chặn triệt để kịch bản giả mạo `X-User-Id` hay lấy nhầm chữ ký từ API đọc sang API ghi.  
  > 3. **Cô lập Notification & Cơ chế 403 → 404:** Service gửi mail không lộ ra ngoài Internet; và với tài nguyên riêng tư của user khác, hệ thống chủ động trả **404 Not Found** thay vì 403 để chống dò ID.  
  > 4. **Audit Log Append-only:** Bảng nhật ký IAM chỉ cho phép ghi thêm, chặn sửa và xóa ngay ở tầng database. Hướng cải tiến tiếp theo của lớp này là bổ sung **Redis Nonce** để chặn gọi lại nhiều lần trong đúng cửa sổ 60s, và bật **mTLS** mã hóa kênh truyền giữa các container."

---

### Trang 10 — Phân quyền 3 lớp hiện tại & Điểm nghẽn thực tế (`27:00 – 30:30`)
- **Trên màn hình slide:** Sơ đồ bên trái thể hiện **3 lớp phòng thủ** (`Lớp 1 RBAC tĩnh` → `Lớp 2 Sở hữu IDOR` → `Lớp 3 Scope Query`) và khung đứt nét đỏ chỉ ra **Điểm nghẽn: Assessment gọi HTTP sang Catalog (`503`)**; bên phải tóm tắt 3 giới hạn khi B2C mở rộng.
- **Lời thuyết trình gợi ý:**
  > "Hiện tại, phân quyền bên trong Ekila LMS đang vận hành theo mô hình **3 lớp** khá chắc chắn cho giai đoạn MVP với đúng 4 vai trò B2C: Học viên (`STUDENT`), Giảng viên (`INSTRUCTOR`), Quản trị nội dung (`CONTENT_ADMIN`) và Quản trị hệ thống (`SYSTEM_ADMIN`):  
  > - **Lớp 1 (RBAC tĩnh theo API):** Khớp đúng ma trận nghiệp vụ — ví dụ Giảng viên được tạo/sửa khóa học, nhưng chỉ Content Admin hoặc System Admin mới có quyền duyệt xuất bản; Content Admin được xem đơn hàng hỗ trợ khách nhưng **không** được hủy đơn như System Admin.  
  > - **Lớp 2 (Kiểm tra sở hữu chống IDOR):** Mỗi service tự kiểm tra chủ sở hữu trước khi trả dữ liệu (khóa học, lượt làm Quiz tự chấm, đơn hàng VietQR) và trả 404 nếu sai chủ.  
  > - **Lớp 3 (Scope Query):** Lọc danh sách theo phạm vi cá nhân, khóa học hoặc toàn hệ thống.  
  >  
  > Tuy nhiên nhìn sang cột bên phải, khi vận hành thực tế đã lộ ra một **điểm nghẽn có thật**:  
  > Vì tách DB, dịch vụ **Assessment** (chứa câu hỏi & Quiz) không có bảng thông tin Giảng viên sở hữu khóa học (bảng đó nằm ở `catalog_db`). Do đó mỗi khi Giảng viên vào sửa ngân hàng câu hỏi, **Assessment buộc phải gọi HTTP sang Catalog** để hỏi *'Ông Duy này có đúng là tác giả khóa Spring Boot không?'*. Kết quả là 2 dịch vụ bị dính chùm (coupling): **nếu Catalog đang khởi động lại hoặc quá tải, trang quản lý câu hỏi ở Assessment lăn ra lỗi `503` theo!** Ngoài ra quy tắc sở hữu đang viết rải rác ở từng service, sau này muốn làm tính năng *nhiều giảng viên cùng soạn 1 khóa* hoặc *gói combo nhiều khóa* sẽ phải sửa code kiểm tra quyền ở nhiều nơi."

---

### Trang 11 — Kiến trúc đích: Tách OpenFGA (PDP) cho Ekila LMS (`30:30 – 33:00`)
- **Trên màn hình slide:** Sơ đồ mới: `API Gateway → [Catalog PEP / Assessment PEP / Commerce PEP] → OpenFGA (PDP) + PostgreSQL AuthZ Store → TRUE (200) / FALSE (404 giữ lá chắn chống IDOR)`, kèm mũi tên `Sync Tuple` từ `Commerce (Outbox)`. Bên dưới là 3 thẻ highlight: *1. Tách coupling*, *2. Outbox Sync*, *3. Bảo toàn 404*.
- **Lời thuyết trình gợi ý:**
  > "Đây là kiến trúc đích khi đưa **OpenFGA** vào đóng vai trò **PDP trung tâm**:  
  > 1. **Gỡ nút thắt gọi chéo:** Bây giờ `Catalog`, `Learning`, `Assessment` và `Commerce` đóng vai trò là các **PEP** độc lập. Khi Giảng viên sửa đề thi ở **Assessment**, Assessment không cần gọi sang Catalog nữa mà hỏi thẳng OpenFGA: `Check(user:duy, can_manage_questions, quiz:quiz-auth)`. Cho dù Catalog có đang nâng cấp hay bảo trì, Assessment vẫn kiểm tra quyền bình thường!  
  > 2. **Đồng bộ tự nhiên qua Outbox Pattern sẵn có:** Dự án đã dùng **Outbox Pattern** cho luồng thanh toán VietQR: khi khách chuyển khoản xong, `Commerce` cập nhật trạng thái đơn hàng thành công đồng thời phát sự kiện ghi danh sang `Learning`. Ta chỉ việc gắn thêm bước đẩy Tuple `course#enrolled@user` vào OpenFGA ngay trong luồng Outbox đó để đảm bảo nhất quán dữ liệu.  
  > 3. **Giữ nguyên 100% cơ chế chống IDOR:** Nhiều người lo dùng thư viện ngoài thì mất logic trả 404 của mình. Không hề: OpenFGA chỉ trả về `allowed: true` hoặc `allowed: false`; phần **PEP** trong service của ta vẫn toàn quyền dịch `allowed=false` thành HTTP **404** cho tài nguyên ẩn hoặc **403** cho thao tác sai vai trò quản trị."

---

### Trang 12 — Authorization Model (OpenFGA DSL) chuẩn quyền B2C (`33:00 – 36:00`)
- **Trên màn hình slide:** Toàn bộ file `ekila-lms-model.fga` (Schema 1.1) gồm 7 loại đối tượng: `user`, `platform`, `course`, `lesson`, `quiz`, `quiz_attempt`, `order` và hộp xanh tóm tắt 4 quy tắc then chốt bên dưới.
- **Hướng dẫn đọc nhanh để ai nhìn vào cũng hiểu DSL:**
  - `type ...`: tên đối tượng trong hệ thống (`course`, `lesson`, `quiz`...).
  - `define relation: [loại_nguồn]`: quan hệ trực tiếp được lưu thành dữ liệu trong DB.
  - `define quyền: A or B from C`: quyền tính toán tự động (hoặc là `A`, hoặc đi theo cạnh `C` lên đối tượng cha lấy quan hệ `B`).
- **Lời thuyết trình gợi ý:**
  > "Trang này là bản thiết kế phân quyền hoàn chỉnh (`schema 1.1`) viết bằng OpenFGA DSL, khớp 100% ma trận quyền B2C của Ekila LMS — chỉ khoảng 50 dòng nhưng bao quát toàn bộ quan hệ của hệ thống:  
  > - Cấp cao nhất là **`platform`** chứa `system_admin` và `content_admin`.  
  > - Dưới đó là **`course`**, gắn tới `platform`, có `instructor` và `enrolled`. Hãy nhìn cách DSL tách rạch ròi 2 quyền:  
  >   - `can_edit`: cho phép `instructor` hoặc `content_admin / system_admin from platform`.  
  >   - `can_publish`: **cố tình bỏ `instructor` ra ngoài**, chỉ cho phép 2 vai trò Admin duyệt xuất bản.  
  > - Với **`lesson`**: ngoài việc kế thừa `can_view_content from parent_course`, ta có `preview_viewer: [user:*]` — ký hiệu `user:*` cho phép **mọi học viên chưa mua** đều xem được các bài học thử miễn phí (`can_view`), nhưng **`can_track_progress` vẫn chặn** (chỉ ai `can_learn` mới lưu tiến độ).  
  > - Với **`quiz` và `quiz_attempt`**: vì Quiz của Ekila là trắc nghiệm **hệ thống tự động chấm điểm**, quyền `can_draft_or_submit` khóa cứng chỉ thuộc về `owner` (chính học viên đó nộp bài, Admin cũng không nộp thay được). Còn `can_view_result` mở cho `owner` hoặc đi ngược 3 cấp (`quiz_attempt → quiz → course`) để Giảng viên khóa đó xem báo cáo điểm.  
  > - Cuối cùng là **`order`**: `can_view` cho người mua + cả 2 Admin, nhưng **`can_cancel` loại trừ `content_admin`**, chỉ cho người mua hoặc `system_admin` hủy đơn."

---

### Trang 13 — Live Demo: OpenFGA Playground (`36:00 – 41:30`)
- **Trên màn hình slide:** Khung nhúng giao diện **OpenFGA Playground** với dữ liệu Store `ekila-lms-b2c` (7 Types, 15 Tuples) chạy thuật toán duyệt đồ thị ReBAC trực tiếp trên trình duyệt, kèm nút **`Phóng to Iframe`** và **`Mở tab riêng`**.
- **Trên giao diện OpenFGA gồm 4 vùng trực quan:**
  - **Trên trái — `AUTHORIZATION MODEL (7 TYPES)`:** Xem toàn bộ model `ekila-lms-model.fga` dạng **DSL** hoặc **JSON**.
  - **Dưới trái — `Tuples (15)` | `Assertions (19)` + `+ ADD TUPLE >`:** Danh sách 15 quan hệ có sẵn của `ekila-lms-b2c`, thêm/xóa tuple trực tiếp và chạy bộ 19 kiểm thử tự động.
  - **Trên phải — `TYPES PREVIEWER`:** Đồ thị phân cấp 7 types + các đường nối nét đứt giữa các relations phụ thuộc; hỗ trợ **cuộn chuột để zoom / kéo để di chuyển / nút `-`, `+`, `Fit`** và nút **ẩn/hiện bảng trái (`<` / `>`)** để bung rộng đồ thị.
  - **Dưới phải — `TUPLE QUERIES` (thu gọn/mở rộng được):** Truy vấn `is [user] related to [object] as [relation]`, bấm **`CHECK`** hoặc chọn nút tình huống nhanh để xem kết quả + đường đi duyệt đồ thị (`Traversal`).
- **Kịch bản thao tác demo từng bước (nên bấm `Phóng to Iframe` ngay khi vào Trang 13):**
  1. **Bấm `Phóng to Iframe`** để bung OpenFGA Playground toàn màn hình cho cả phòng dễ theo dõi (có thể bấm thanh **`<`** ở giữa hoặc **`ẨN BẢNG TRÁI`** + zoom đồ thị để mọi người nhìn rõ cấu trúc quan hệ).
  2. **Giới thiệu nhanh Store `ekila-lms-b2c` (15 Tuples sẵn):**
     - Chỉ vào **Model DSL** bên trái, danh sách **Tuples (15)** bên dưới (*Cường* `system_admin`, *Linh* `content_admin`, *Duy* giảng viên Spring Boot, *Minh* giảng viên Next.js, *Khánh* `enrolled` Spring Boot, *An* chưa mua khóa nào) và đồ thị **Types Previewer** bên phải.
     - Bấm sang tab **`Assertions (19)`** hoặc nút **`ASSERTIONS (19/19)`** trên góc phải để chứng minh toàn bộ 19 kịch bản bảo mật đều **PASS**. Quay lại tab **`Tuples (15)`**.
  3. **Chạy 5 tình huống `Check` tiêu biểu ở khung `TUPLE QUERIES`:**
     - **Case 1 (Khánh học JWT):** `user:khanh` | `lesson:jwt-01` | `can_view` → **`ALLOWED: true`** *(Chỉ vào dòng Traversal: đi từ `lesson:jwt-01` → `parent_course` → `course:spring-boot#enrolled` thấy `user:khanh`)*.
     - **Case 2 (An chưa mua bị chặn):** `user:an` | `lesson:jwt-01` | `can_view` → **`DENIED: false`** *(PEP trong service nhận `false` và trả HTTP 404 chống IDOR)*.
     - **Case 3 (An học Preview `user:*`):** `user:an` | `lesson:intro-preview` | `can_view` → **`ALLOWED: true`**; nhưng đổi sang `can_track_progress` thì vẫn **`DENIED: false`**.
     - **Case 4 (Gỡ nút thắt Assessment ↔ Catalog):** `user:duy` | `quiz:quiz-auth` | `can_manage_questions` → **`ALLOWED: true`** *(Assessment hỏi thẳng PDP, không gọi sang Catalog)*; bấm tiếp **`Duy sửa chéo`** (`user:duy` | `course:nextjs-pro` | `can_edit`) → **`DENIED: false`**.
     - **Case 5 (Ranh giới Admin & Đơn hàng):** `user:linh` | `order:ord-khanh-01` | `can_cancel` → **`DENIED: false`** *(Content Admin chỉ xem đơn, không được hủy)*.
  4. **Live Mutation — Mô phỏng thanh toán VietQR thành công:**
     - Nói: *"Giả sử ngay lúc này bạn An thanh toán VietQR xong, Outbox worker ghi thêm đúng 1 Tuple..."*
     - Bấm **`+ ADD TUPLE >`** ở góc phải bảng Tuples, nhập/giữ sẵn `user:an` | `enrolled` | `course:spring-boot` → bấm **`SAVE`**.
     - Bấm lại **`An chưa mua`** (`user:an` | `lesson:jwt-01` | `can_view`) → kết quả lập tức lật sang **`ALLOWED: true`**, node trên đồ thị sáng màu xanh! (Cuối cùng bấm **`RESET (15)`** nếu muốn khôi phục trạng thái ban đầu).
  5. Bấm **`Thu nhỏ (Esc)`** (hoặc phím `Esc`) để thu gọn về slide, chuyển sang Trang 14.

---

## PHẦN III — TRADE-OFF & KẾT THÚC (TRANG 14 – TRANG 15)

### Trang 14 — Đánh giá Trade-off & Lộ trình áp dụng thực tế (`41:30 – 44:00`)
- **Trên màn hình slide:** 2 hộp so sánh *Được gì khi dùng OpenFGA?* (xanh) vs *Đánh đổi (Chi phí & Rủi ro)* (đỏ), và 3 thẻ **Lộ trình Hybrid 3 giai đoạn** (*Giai đoạn 1 MVP* → *Giai đoạn 2 Thí điểm Hybrid* → *Giai đoạn 3 Chuẩn hóa PDP*).
- **Lời thuyết trình gợi ý:**
  > "Trong kỹ thuật không có viên đạn bạc — dùng OpenFGA có lợi ích rất rõ nhưng cũng đi kèm 3 cái giá phải trả mà team cần cân nhắc thẳng thắn:  
  > - **Độ phức tạp vận hành:** Thêm 1 service lõi trong kiến trúc đồng nghĩa với việc phải lo High Availability, monitoring, backup DB riêng cho AuthZ. Nếu OpenFGA chết mà cấu hình fail-closed thì API toàn hệ thống bị ảnh hưởng.  
  > - **Độ trễ mạng:** Thêm 1 network hop trên mỗi request (cần dùng gRPC, keep-alive và caching hợp lý để giữ dưới vài mili-giây).  
  > - **Đồng bộ dữ liệu:** Bắt buộc đảm bảo mọi giao dịch mua khóa học, hoàn tiền hay đổi giảng viên không bị lệch Tuple so với DB nghiệp vụ.  
  >  
  > Vì vậy mình **không** đề xuất đập hệ thống hiện tại đi viết lại hết ngay, mà nên đi theo **lộ trình Hybrid 3 giai đoạn**:  
  > - **Giai đoạn 1 (Hiện tại — MVP):** Giữ nguyên RBAC 4 vai trò + lớp chống IDOR trả 404 đang chạy ổn định; ưu tiên làm trước phần **Redis Nonce** chống replay HMAC và hoàn thiện bảo mật Gateway.  
  > - **Giai đoạn 2 (Thí điểm Hybrid):** Chỉ đưa OpenFGA vào đúng nơi đang đau nhất là cụm **Assessment ↔ Catalog ↔ Learning** (xóa lời gọi HTTP kiểm tra chéo từ Assessment sang Catalog) và móc đồng bộ Tuple vào worker **Outbox VietQR** sẵn có.  
  > - **Giai đoạn 3 (Chuẩn hóa PDP):** Khi hệ thống mở rộng thêm nhiều giảng viên đồng sở hữu, gói combo hay chia sẻ tài nguyên phức tạp, hợp nhất toàn bộ phân quyền đối tượng qua OpenFGA và bật `ListObjects` cho các API lọc danh sách lớn."

---

### Trang 15 — Tổng kết & Q&A (`44:00 – 45:00` → Phiên Q&A `45:00 – 60:00`)
- **Trên màn hình slide:** Màn hình kết thúc sạch sẽ với 3 thẻ nhắc nhớ (*1. Phân tách rạch ròi*, *2. Zero Trust thực chiến*, *3. Lộ trình Hybrid*) và lời mời đặt câu hỏi.
- **Lời thuyết trình gợi ý:**
  > "Để khép lại phần trình bày, mình xin tóm tắt lại 3 thông điệp cốt lõi:  
  > 1. **Phân tách đúng việc:** Identity/Keycloak lo **AuthN**, RBAC lo **quyền API thô**, và ReBAC (OpenFGA) lo **quan hệ tài nguyên mịn**.  
  > 2. **Zero Trust thực chiến:** Kết hợp chốt chặn Gateway + HMAC 5-Tuple nội bộ + PEP/PDP + ẩn lỗi `403 → 404` để chặn cả di chuyển ngang lẫn IDOR.  
  > 3. **Đi từng bước thực tế:** Chọn lộ trình Hybrid, thí điểm OpenFGA ngay ở điểm đau gọi chéo `Assessment ↔ Catalog` thay vì làm lại từ đầu.  
  >  
  > Cảm ơn các anh chị Mentor, Tech Lead và mọi người đã lắng nghe. Bây giờ mình xin mời mọi người đặt câu hỏi, góp ý hoặc phản biện để cả team cùng mổ xẻ sâu hơn!"

---

## LIÊN KẾT MỞ RỘNG KHI THUYẾT TRÌNH & PHẢN BIỆN
- **Khi vào phần Q&A (15–20 phút):** Mở [Cẩm nang Phản biện Q&A (`PHAN_BIEN_QA.md`)](PHAN_BIEN_QA.md) để tra nhanh 12 câu hỏi hóc búa (Keycloak vs OpenFGA, nhét `courseId` vào JWT, lọc 10.000 khóa học chống `N+1`, Fail-open vs Fail-closed, đồng bộ Outbox & *New Enemy*, giữ 404 IDOR, Redis Nonce, `ListObjects` với DB phân trang...).
- **Khi cần xem kịch bản tổng thể 60 phút & checklist chuẩn bị:** Mở [Kế hoạch & Kịch bản 60 phút (`KE_HOACH_VA_KICH_BAN_60P.md`)](KE_HOACH_VA_KICH_BAN_60P.md).
- **Khi cần hướng dẫn chạy Docker OpenFGA / tích hợp Java Spring Boot PEP:** Mở [Hướng dẫn mô phỏng & tích hợp OpenFGA (`HUONG_DAN_MO_PHONG_OPENFGA_EKILA_LMS.md`)](HUONG_DAN_MO_PHONG_OPENFGA_EKILA_LMS.md).
