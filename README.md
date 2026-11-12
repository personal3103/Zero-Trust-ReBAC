# Ekila LMS Tech Talk — Zero Trust & Phân quyền thế hệ mới (Zanzibar / ReBAC)

> **Người trình bày:** Trần Đức Anh (Backend / Security — Team Ekila LMS)  
> **Ngày thuyết trình:** 15/11/2026 | **Thời lượng:** 60 phút (35–45p Trình bày & Demo + 15–20p Q&A)  
> **Phạm vi dự án:** 100% mô hình **B2C** đúng theo đặc tả & quyền thực tế trong hệ thống (`STUDENT`, `INSTRUCTOR`, `CONTENT_ADMIN`, `SYSTEM_ADMIN`; Quiz trắc nghiệm do hệ thống tự động chấm; chưa triển khai B2B).

---

## Cấu trúc Project

```text
seminar-zero-trust-rebac/
├── README.md                                      # Tài liệu tổng quan & hướng dẫn sử dụng nhanh
├── docs/
│   ├── THUYET_TRINH_SLIDE.md                      # File MD CHÍNH để thuyết trình khớp Trang 01–15
│   ├── PHAN_BIEN_QA.md                            # 12 câu hỏi Q&A & mẹo phản biện (liên kết từ file chính)
│   ├── KE_HOACH_VA_KICH_BAN_60P.md                # Lộ trình chuẩn bị 12/11 -> 15/11 & timeline 60 phút
│   ├── HUONG_DAN_MO_PHONG_OPENFGA_EKILA_LMS.md    # Hướng dẫn ánh xạ quyền B2C, PEP-PDP & Demo
│   └── PROMPT_CHUAN_SEMINAR.md                    # Prompt chuẩn đã tối ưu theo dự án Ekila LMS
├── openfga/
│   ├── docker-compose.yml                         # Chạy OpenFGA + PostgreSQL tách biệt port Ekila LMS
│   ├── ekila-lms-model.fga                        # Authorization Model (OpenFGA DSL Schema 1.1)
│   ├── tuples.json                                # Bộ 15 Relation Tuples mẫu (JSON chuẩn API)
│   ├── ekila-lms.fga.yaml                         # Bộ Assertion Test chạy với `fga model test`
│   └── seed-openfga.ps1                           # Script PowerShell nạp Store/Model/Tuples & test API
└── slides/
    ├── index.html                                 # 15 Slides thuyết trình (Docx-style + OpenFGA Playground iframe)
    ├── styles.css                                 # Giao diện Editorial Document (0 emoji, 0 gradient)
    ├── app.js                                     # Điều hướng trang, mục lục & tự động nối Store Docker :8090
    └── openfga-local.html                         # Console dự phòng offline kết nối trực tiếp Docker :8090
```

---

## 1. Mở Slide thuyết trình (Khuyên dùng qua Docker `localhost:3011`)

Khi đã chạy Docker Compose ở mục 2, mở trình duyệt tới:
- **`http://localhost:3011/`** — Chạy bộ Slide ở đúng ngữ cảnh `localhost` để **Trang 13** nhúng trực tiếp giao diện **OpenFGA Playground** với dữ liệu `ekila-lms-b2c` (7 types, 15 tuples) ngay bên trong slide, không bị trình duyệt chặn Private Network Access như khi mở từ `file:///`.

### Phím tắt trình chiếu
- `←` / `→` hoặc `Space`: Chuyển trang
- `M`: Bật / tắt **Mục lục tài liệu** bên trái
- `F`: Bật / tắt chế độ Toàn màn hình (Fullscreen)

> **Kịch bản nói chính:** [`docs/THUYET_TRINH_SLIDE.md`](docs/THUYET_TRINH_SLIDE.md) — **Phản biện Q&A:** [`docs/PHAN_BIEN_QA.md`](docs/PHAN_BIEN_QA.md)

---

## 2. Chạy OpenFGA Server thật bằng Docker (Nếu muốn kiểm chứng độc lập)

Docker Compose đã được cấu hình dùng port **`8090` (HTTP)**, **`8091` (gRPC)** và **`3010` (Playground)** để **không xung đột** với `api-gateway` (`:8080`) và `identity-service` (`:8081`) của Ekila LMS.

```powershell
cd "f:\OJT\LMS\tài liệu\seminar-zero-trust-rebac\openfga"

# 1. Khởi chạy PostgreSQL + OpenFGA Migrate + OpenFGA Server
docker compose up -d

# 2. Chạy script tự động tạo Store, nạp Model DSL, nạp 15 Tuples và gọi Check / ListObjects
.\seed-openfga.ps1
```

- **OpenFGA Playground cục bộ:** `http://localhost:3010/playground`
- **Tắt Docker khi xong:** `docker compose down -v`
