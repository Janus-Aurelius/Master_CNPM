# Cập nhật Quản lý Học phí theo Học kỳ

## Tổng quan

Hệ thống đã được cập nhật để hỗ trợ quản lý học phí theo từng học kỳ riêng biệt thay vì sử dụng giá cố định từ bảng `LOAIMON`. Điều này cho phép:

- Quản lý học phí độc lập cho từng học kỳ
- Không ảnh hưởng đến học phí của các học kỳ đã qua
- Linh hoạt trong việc điều chỉnh học phí theo thời gian

## Thay đổi Database Schema

### Bảng mới: `HOCPHI_THEOHK`

```sql
CREATE TABLE HOCPHI_THEOHK (
    MaHocKy VARCHAR NOT NULL,
    MaLoaiMon VARCHAR NOT NULL,
    SoTienMotTC DECIMAL NOT NULL,
    PRIMARY KEY (MaHocKy, MaLoaiMon),
    FOREIGN KEY (MaHocKy) REFERENCES HOCKYNAMHOC(MaHocKy),
    FOREIGN KEY (MaLoaiMon) REFERENCES LOAIMON(MaLoaiMon)
);
```

### Logic tính học phí mới

Thay vì lấy `SoTienMotTC` trực tiếp từ `LOAIMON`, hệ thống sẽ:

1. Tìm kiếm trong bảng `HOCPHI_THEOHK` với `MaHocKy` và `MaLoaiMon`
2. Nếu tìm thấy, sử dụng giá từ `HOCPHI_THEOHK`
3. Nếu không tìm thấy, fallback về giá từ `LOAIMON`

```sql
COALESCE(ht.SoTienMotTC, lm.SoTienMotTC) as pricePerCredit
```

## Các Service đã được cập nhật

### 1. FinancialConfigService
- `getCourseTypes()`: Lấy học phí theo current semester
- `updateCourseTypePrice()`: Cập nhật học phí cho current semester
- `getAllCourseTypesWithPricing()`: Lấy học phí cho semester cụ thể

### 2. TuitionService
- `getRegisteredCoursesWithFees()`: Tính học phí theo semester
- Sử dụng `HOCPHI_THEOHK` thay vì `LOAIMON`

### 3. PaymentService
- Cập nhật query tính tổng học phí
- Sử dụng semester-based pricing

### 4. RegistrationService
- Cập nhật tính học phí khi đăng ký môn học
- Sử dụng semester-based pricing

## API Endpoints mới

### GET `/api/financial/config/course-types/semester/:semesterId`
Lấy danh sách loại môn học với học phí cho semester cụ thể

### PUT `/api/financial/config/course-types/:courseTypeId/price`
Cập nhật học phí cho current semester

## Frontend Updates

### Trang Tuition Adjustment
- Hiển thị thông tin current semester
- Cập nhật học phí chỉ ảnh hưởng đến current semester
- Thông báo rõ ràng về phạm vi ảnh hưởng

### Financial API
- Thêm `getCurrentSemester()`
- Thêm `getCourseTypesForSemester()`

## Migration Script

Chạy script `scripts/migrate-tuition-data.sql` để:

1. Tạo dữ liệu ban đầu cho tất cả semester từ `LOAIMON`
2. Đảm bảo backward compatibility
3. Không ảnh hưởng đến dữ liệu hiện tại

## Lợi ích

1. **Tính linh hoạt**: Có thể điều chỉnh học phí theo từng học kỳ
2. **Tính ổn định**: Không ảnh hưởng đến học phí của các kỳ đã qua
3. **Tính minh bạch**: Rõ ràng về học phí của từng kỳ học
4. **Tính tương thích**: Vẫn hoạt động với dữ liệu cũ

## Hướng dẫn sử dụng

### Cho Financial Department
1. Vào trang "Quản lý học phí"
2. Xem thông tin current semester
3. Điều chỉnh học phí cho từng loại môn học
4. Học phí chỉ ảnh hưởng đến current semester

### Cho Developers
1. Sử dụng `DatabaseService.getCurrentSemester()` để lấy current semester
2. Sử dụng `FinancialConfigService.getAllCourseTypesWithPricing()` cho semester cụ thể
3. Luôn sử dụng `COALESCE(ht.SoTienMotTC, lm.SoTienMotTC)` trong queries

## Testing

1. Kiểm tra tính toán học phí cho các semester khác nhau
2. Kiểm tra cập nhật học phí chỉ ảnh hưởng đến current semester
3. Kiểm tra fallback về `LOAIMON` khi không có dữ liệu trong `HOCPHI_THEOHK` 