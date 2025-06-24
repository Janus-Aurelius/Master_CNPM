-- Clear all tables (using DELETE to avoid foreign key constraint issues)
DELETE FROM ACADEMIC_SETTINGS;
DELETE FROM CT_PHIEUDANGKY;
DELETE FROM PHIEUTHUHP;
DELETE FROM PHANQUYEN;
DELETE FROM NGUOIDUNG;
DELETE FROM PHIEUDANGKY;
DELETE FROM SINHVIEN;
DELETE FROM DANHSACHMONHOCMO;
DELETE FROM CHUONGTRINHHOC;
DELETE FROM MONHOC;
DELETE FROM CHUCNANG;
DELETE FROM NHOMNGUOIDUNG;
DELETE FROM LOAIMON;
DELETE FROM HOCKYNAMHOC;
DELETE FROM HUYEN;
DELETE FROM DOITUONGUUTIEN;
DELETE FROM NGANHHOC;
DELETE FROM TINH;
DELETE FROM KHOA;
DELETE FROM REGISTRATION_LOG;


INSERT INTO TINH (MaTinh, TenTinh) VALUES
  ('02', 'Thành phố Hồ Chí Minh'),  -- Mã tỉnh HCM là 02 :contentReference[oaicite:6]{index=6}
  ('03', 'Thành phố Hà Nội'),
  ('04', 'Thành phố Đà Nẵng'),
  ('05', 'Thành phố Hải Phòng'),
  ('06', 'Thành phố Cần Thơ'),
  ('07', 'Tỉnh An Giang'),
  ('08', 'Tỉnh Bà Rịa - Vũng Tàu'),
  ('09', 'Tỉnh Bắc Giang'),
  ('10', 'Tỉnh Bắc Kạn'),
  ('11', 'Tỉnh Bắc Ninh'),
  ('12', 'Tỉnh Bến Tre'),
  ('13', 'Tỉnh Bình Định'),
  ('14', 'Tỉnh Bình Dương'),
  ('15', 'Tỉnh Bình Phước'),
  ('16', 'Tỉnh Bình Thuận'),
  ('17', 'Tỉnh Cà Mau');

INSERT INTO HUYEN (MaHuyen, TenHuyen, MaTinh) VALUES
  ('001', 'Quận 1', '02'),
  ('002', 'Thành phố Thủ Đức', '02'),
  ('003', 'Quận 3', '02'),
  -- Hà Nội
  ('004', 'Quận Ba Đình', '03'),
  ('005', 'Quận Hoàn Kiếm', '03'),
  ('006', 'Quận Cầu Giấy', '03'),
  -- Đà Nẵng
  ('007', 'Quận Hải Châu', '04'),
  ('008', 'Quận Thanh Khê', '04'),
  ('009', 'Quận Liên Chiểu', '04'),
  -- Hải Phòng
  ('010', 'Quận Hồng Bàng', '05'),
  ('011', 'Quận Lê Chân', '05'),
  ('012', 'Quận Ngô Quyền', '05'),
  -- Cần Thơ
  ('013', 'Quận Ninh Kiều', '06'),
  ('014', 'Quận Bình Thủy', '06'),
  ('015', 'Quận Cái Răng', '06'),
  -- An Giang
  ('016', 'Thành phố Long Xuyên', '07'),
  ('017', 'Thành phố Châu Đốc', '07'),
  ('018', 'Huyện An Phú', '07'),
  -- Bà Rịa - Vũng Tàu
  ('019', 'Thành phố Vũng Tàu', '08'),
  ('020', 'Thành phố Bà Rịa', '08'),
  ('021', 'Huyện Châu Đức', '08'),
  -- Bắc Giang
  ('022', 'Thành phố Bắc Giang', '09'),
  ('023', 'Huyện Việt Yên', '09'),
  ('024', 'Huyện Tân Yên', '09'),
  -- Bắc Kạn
  ('025', 'Thành phố Bắc Kạn', '10'),
  ('026', 'Huyện Pác Nặm', '10'),
  ('027', 'Huyện Ba Bể', '10'),
  -- Bắc Ninh
  ('028', 'Thành phố Bắc Ninh', '11'),
  ('029', 'Thành phố Từ Sơn', '11'),
  ('030', 'Huyện Yên Phong', '11'),
  -- Bến Tre
  ('031', 'Thành phố Bến Tre', '12'),
  ('032', 'Huyện Châu Thành', '12'),
  ('033', 'Huyện Chợ Lách', '12'),
  -- Bình Định
  ('034', 'Thành phố Quy Nhơn', '13'),
  ('035', 'Huyện An Lão', '13'),
  ('036', 'Huyện Hoài Nhơn', '13'),
  -- Bình Dương
  ('037', 'Thành phố Thủ Dầu Một', '14'),
  ('038', 'Thành phố Thuận An', '14'),
  ('039', 'Thành phố Dĩ An', '14'),
  -- Bình Phước
  ('040', 'Thành phố Đồng Xoài', '15'),
  ('041', 'Thị xã Bình Long', '15'),
  ('042', 'Huyện Bù Đăng', '15'),
  -- Bình Thuận
  ('043', 'Thành phố Phan Thiết', '16'),
  ('044', 'Thị xã La Gi', '16'),
  ('045', 'Huyện Tuy Phong', '16'),
  -- Cà Mau
  ('046', 'Thành phố Cà Mau', '17'),
  ('047', 'Huyện Đầm Dơi', '17'),
  ('048', 'Huyện Thới Bình', '17');

INSERT INTO DOITUONGUUTIEN (MaDoiTuong, TenDoiTuong, MucGiamHocPhi) VALUES
  ('UT01', 'Sinh viên dân tộc thiểu số', 0.70),  -- Giảm 70% :contentReference[oaicite:8]{index=8}
  ('UT02', 'Sinh viên hộ cận nghèo',    0.40),  -- Giảm 50% :contentReference[oaicite:9]{index=9}
  ('UT03', 'Con liệt sĩ, thương binh', 1.00),   -- Miễn 100%
  ('UT04', 'Sinh viên có hoàn cảnh khó khăn', 0.60),  -- Giảm 30%
  ('UT05', 'Sinh viên thường', 0.00);           -- Không ưu tiên
INSERT INTO KHOA (MaKhoa, TenKhoa) VALUES
  ('KTPM', 'Công nghệ phần mềm'),
  ('HTTT', 'Hệ thống thông tin'),
  ('KHMT', 'Khoa học máy tính'),
  ('KTMT', 'Kỹ thuật máy tính'),
  ('TTMT', 'Truyền thông & Mạng máy tính'),
  ('ATTT', 'An toàn thông tin');

INSERT INTO NGANHHOC (MaNganh, TenNganh, MaKhoa) VALUES
  ('CNTT',  'Công nghệ thông tin',        'HTTT'),
  ('HTTT',  'Hệ thống thông tin',         'HTTT'),
  ('KHMT',  'Khoa học máy tính',          'KHMT'),
  ('KTPM',  'Kỹ thuật phần mềm',          'KTPM'),
  ('KTMT',  'Kỹ thuật máy tính',          'KTMT'),
  ('TTMT',  'Truyền thông & Mạng máy tính','TTMT'),
  ('ATTT',  'An toàn thông tin',          'ATTT'),
  ('TMDT',  'Thương mại điện tử',         'HTTT'),
  ('KHLDL', 'Khoa học dữ liệu',           'KHMT'),
  ('TTNT',  'Trí tuệ nhân tạo',           'KHMT'),
  ('VMC',   'Thiết kế vi mạch',           'KTMT'),
  ('CNTT_Nhat','Công nghệ thông tin Việt–Nhật','HTTT');
  




INSERT INTO LOAIMON (MaLoaiMon, TenLoaiMon, SoTietMotTC) VALUES
  ('LT', 'Lý thuyết',   15),
  ('TH', 'Thực hành',    30);

INSERT INTO MONHOC (MaMonHoc, TenMonHoc, MaLoaiMon, SoTiet) VALUES
  ('BCH058', 'Kỹ năng truyền thông giao tiếp', 'LT', 30),
  ('BUS1125', 'Khởi nghiệp kinh doanh', 'LT', 30),
  ('LTU101', 'Anh văn cơ bản 1', 'LT', 45),
  ('LTU102', 'Anh văn cơ bản 2', 'LT', 45),
  ('LTU201', 'Anh văn chuyên ngành 1', 'LT', 45),
  ('LTU202', 'Anh văn chuyên ngành 2', 'LT', 45),
  ('LTU301', 'Anh văn thương mại', 'LT', 45),
  ('LTU302', 'Anh văn kỹ thuật', 'LT', 45),
  ('SS003', 'Tư tưởng Hồ Chí Minh', 'LT', 30),
  ('SS004', 'Kỹ năng nghề nghiệp', 'LT', 30),
  ('SS006', 'Pháp luật đại cương', 'LT', 30),
  ('SS007', 'Triết học Mác–Lênin', 'LT', 45),
  ('SS008', 'Kinh tế chính trị Mác–Lênin', 'LT', 30),
  ('SS009', 'Chủ nghĩa xã hội khoa học', 'LT', 30),
  ('SS010', 'Lịch sử Đảng Cộng sản Việt Nam', 'LT', 30),
  ('TLH025', 'Tâm lý học nhân cách', 'LT', 30),
  ('CE103', 'Vi xử lý-vi điều khiển', 'LT', 45),
  ('CE118', 'Thiết kế luận lý số', 'LT', 45),
  ('CE122', 'Phân tích mạch kỹ thuật', 'LT', 45),
  ('CE126', 'Vật lý bán dẫn và ứng dụng', 'LT', 45),
  ('EE105', 'Mạch điện', 'LT', 45),
  ('EE208', 'Hệ thống điện một chiều', 'LT', 30),
  ('EE214', 'Điện tử tương tự', 'LT', 45),
  ('EE216', 'Kỹ thuật số nâng cao', 'LT', 30),
  ('IT101', 'Nhập môn Tin học', 'LT', 30),
  ('IT103', 'Giải tích cao cấp', 'LT', 45),
  ('IT201', 'Cấu trúc dữ liệu và giải thuật', 'LT', 45),
  ('IT202', 'Lập trình hướng đối tượng', 'LT', 45),
  ('IT203', 'Mạng máy tính', 'LT', 45),
  ('IT204', 'Cơ sở dữ liệu', 'LT', 45),
  ('IT205', 'Công nghệ web', 'LT', 45),
  ('IT301', 'Kỹ thuật lập trình', 'LT', 45),
  ('CE201', 'Đồ án 1', 'TH', 30),
  ('CE206', 'Đồ án 2', 'TH', 30),
  ('CE213', 'Thiết kế hệ thống số với HDL', 'LT', 30),
  ('CE222', 'Thiết kế vi mạch số', 'LT', 30),
  ('CE232', 'Thiết kế hệ thống nhúng không dây', 'LT', 45),
  ('CE320', 'Logic mờ cho ứng dụng hệ thống nhúng', 'LT', 30),
  ('CE340', 'Trí tuệ nhân tạo cho hệ thống nhúng', 'LT', 30),
  ('CE408', 'Đồ án chuyên ngành Thiết kế vi mạch và phần cứng', 'TH', 30),
  ('CE410', 'Kỹ thuật hệ thống máy tính', 'LT', 30),
  ('CE422', 'Mạng máy tính II', 'LT', 30),
  ('CE426', 'Các phương tiện truyền thông không dây', 'LT', 30),
  ('CE430', 'Công nghệ Web nâng cao', 'LT', 30),
  ('CE434', 'Phát triển ứng dụng di động', 'LT', 30),
  ('CE440', 'Hệ thống nhúng và IoT', 'LT', 30),
  ('CE444', 'Lập trình song song và phân tán', 'LT', 30),
  ('CE450', 'Thị giác máy tính', 'LT', 30),
  ('CE458', 'Đồ án 3', 'TH', 30),
  ('CE462', 'An toàn hệ thống thông tin', 'LT', 30),
  ('CE470', 'Học sâu cho hệ thống nhúng', 'LT', 30),
  ('CE476', 'Thuật toán tiến hóa', 'LT', 30),
  ('CE480', 'Kỹ thuật xử lý ảnh', 'LT', 30),
  ('CE482', 'Xác suất thống kê cho kỹ sư', 'LT', 30),
  ('CE488', 'Khóa luận tốt nghiệp chuyên ngành', 'TH', 30),
  ('EE308', 'Hệ thống điện xoay chiều', 'LT', 30),
  ('EE312', 'Động cơ điện và điều khiển', 'LT', 30),
  ('EE318', 'Điều khiển tự động', 'LT', 30),
  ('EE322', 'Đồ án kỹ thuật điện', 'TH', 30),
  ('EE324', 'Hệ thống điện thông minh', 'LT', 30),
  ('EE332', 'Điều khiển số và vi xử lý', 'LT', 30),
  ('EE362', 'Thị trường điện và kinh tế điện', 'LT', 30),
  ('EE402', 'Đồ án chuyên ngành Kỹ thuật điện', 'TH', 30),
  ('EE408', 'Hệ thống điện lực cao áp', 'LT', 30),
  ('EE412', 'Hệ thống năng lượng tái tạo', 'LT', 30),
  ('EE422', 'Kỹ thuật điện tử công suất', 'LT', 30),
  ('EE430', 'Mạch tích hợp chuyên dụng', 'LT', 30),
  ('EE442', 'Thu phát vô tuyến', 'LT', 30),
  ('EE448', 'Xử lý tín hiệu số', 'LT', 30),
  ('EE462', 'Hệ thống điều khiển tiên tiến', 'LT', 30),
  ('EE468', 'Thuật toán tối ưu cho hệ thống điện', 'LT', 30),
  ('EE480', 'Đồ án thiết kế mạch tích hợp', 'TH', 30),
  ('EE488', 'Khóa luận tốt nghiệp chuyên ngành', 'TH', 30),
  ('IT213', 'Cơ sở dữ liệu nâng cao', 'LT', 30),
  ('IT303', 'Đồ án Mạng và Bảo mật', 'TH', 30),
  ('IT305', 'Quản lý dự án phần mềm', 'LT', 30),
  ('IT401', 'Phân tích và thiết kế hệ thống', 'LT', 30),
  ('IT403', 'Kiến trúc máy tính', 'LT', 30),
  ('IT405', 'Học máy cơ bản', 'LT', 30),
  ('IT407', 'Phát triển ứng dụng Web', 'LT', 30),
  ('IT409', 'Phát triển ứng dụng Android', 'LT', 30),
  ('IT411', 'Kiểm thử phần mềm nâng cao', 'LT', 30),
  ('IT413', 'Trí tuệ nhân tạo', 'LT', 30),
  ('IT415', 'An ninh mạng', 'LT', 30),
  ('IT417', 'Xử lý ngôn ngữ tự nhiên', 'LT', 30),
  ('IT419', 'Thị giác máy tính', 'LT', 30),
  ('IT421', 'Lập trình song song', 'LT', 30),
  ('IT423', 'Hệ thống phân tán', 'LT', 30),
  ('IT425', 'Kiến trúc hướng dịch vụ', 'LT', 30),
  ('IT427', 'Phân tích dữ liệu lớn', 'LT', 30),
  ('IT429', 'Học sâu nâng cao', 'LT', 30),
  ('IT431', 'Internet vạn vật', 'LT', 30),
  ('IT433', 'Lập trình hệ thống nhúng', 'LT', 30),
  ('IT435', 'Thiết kế giao diện người dùng', 'LT', 30),
  ('IT437', 'Phát triển game di động', 'LT', 30),
  ('IT439', 'Giao diện tự nhiên', 'LT', 30),
  ('IT441', 'Hệ thống khuyến nghị', 'LT', 30),
  ('IT443', 'Phân tích dữ liệu', 'LT', 30),
  ('IT445', 'Đồ án 1', 'TH', 30),
  ('IT447', 'Đồ án 2', 'TH', 30),
  ('IT449', 'Khóa luận tốt nghiệp', 'TH', 30),
  ('MKT101', 'Marketing căn bản', 'LT', 30),
  ('MKT201', 'Marketing nâng cao', 'LT', 30),
  ('MKT301', 'Chiến lược marketing', 'LT', 30),
  ('MKP101', 'Nghiên cứu thị trường', 'LT', 30),
  ('MKP201', 'Quản trị thương hiệu', 'LT', 30),
  ('MKP301', 'Quảng cáo và tiếp thị số', 'LT', 30),
  ('MKP401', 'Marketing quốc tế', 'LT', 30),
  ('QC101', 'Quản trị chất lượng', 'LT', 30),
  ('QC201', 'Phân tích và cải tiến chất lượng', 'LT', 30),
  ('QC301', 'Quản lý rủi ro chất lượng', 'LT', 30),
  ('QC401', 'Đảm bảo chất lượng phần mềm', 'LT', 30),
  ('QC501', 'Kiểm thử phần mềm tự động', 'LT', 30),
  ('SE101', 'Nhập môn Kỹ thuật phần mềm', 'LT', 30),
  ('SE201', 'Thiết kế phần mềm hướng đối tượng', 'LT', 30),
  ('SE203', 'Kiến trúc phần mềm', 'LT', 30),
  ('SE301', 'Bảo mật phần mềm', 'LT', 30),
  ('SE303', 'Kiểm thử phần mềm', 'LT', 30),
  ('SE305', 'Quản lý cấu hình phần mềm', 'LT', 30),
  ('SE307', 'Đồ án 1', 'TH', 30),
  ('SE309', 'Đồ án 2', 'TH', 30),
  ('SE311', 'Xây dựng phần mềm hướng dịch vụ', 'LT', 30),
  ('SE313', 'Phát triển Agile', 'LT', 30),
  ('SE315', 'Phân tích yêu cầu', 'LT', 30),
  ('SE317', 'Kiến trúc hướng sự kiện', 'LT', 30),
  ('SE319', 'Kiến trúc microservices', 'LT', 30),
  ('SE321', 'Bảo mật API', 'LT', 30),
  ('SE323', 'Quản trị dữ liệu lớn', 'LT', 30),
  ('SE325', 'Đồ án số 3', 'TH', 30),
  ('SE327', 'Thiết kế giao diện người dùng nâng cao', 'LT', 30),
  ('SE329', 'Triết lý thiết kế phần mềm', 'LT', 30),
  ('SE331', 'Kho dữ liệu và BI', 'LT', 30),
  ('SE333', 'Phân tích và tối ưu mã nguồn', 'LT', 30),
  ('SE335', 'An toàn phần mềm', 'LT', 30),
  ('SE337', 'Kiến trúc serverless', 'LT', 30),
  ('SE339', 'Thực tập tốt nghiệp', 'TH', 30),
  ('SE341', 'Đồ án tốt nghiệp tại doanh nghiệp', 'TH', 30),
  ('GD001', 'Tiếng Anh cơ bản 1', 'LT', 45),
  ('CS101', 'Cấu trúc dữ liệu', 'LT', 45),
  ('CS102', 'Cơ sở dữ liệu', 'LT', 45),
  ('GD002', 'Giáo dục thể chất 1', 'LT', 30),
  ('DS101', 'Khai phá dữ liệu', 'LT', 45),
  ('CN201', 'Lập trình hướng đối tượng', 'LT', 45),
  ('AI001', 'Giới thiệu Trí tuệ nhân tạo 1', 'LT', 15),
  ('AI002', 'Giới thiệu Trí tuệ nhân tạo 2', 'LT', 75),
  ('AI301', 'Học sâu nâng cao', 'LT', 60),
  ('AI302', 'Thị giác máy tính nâng cao', 'LT', 45);
  
INSERT INTO HOCKYNAMHOC 
  (MaHocKy, HocKyThu, ThoiGianBatDau, ThoiGianKetThuc, TrangThaiHocKy, NamHoc, ThoiHanDongHP) VALUES
  -- Năm học 2023
  ('HK1_2023', 1, '2023-08-01','2023-12-15','Đóng',2023,'2023-09-15'),
  ('HK2_2023', 2, '2024-01-15','2024-05-30','Đóng',2023,'2024-02-15'),
  -- Năm học 2024
  ('HK1_2024', 1, '2024-08-01','2024-12-15','Đang diễn ra',2024,'2024-09-15'),
  ('HK2_2024', 2, '2025-01-15','2025-05-30','Đóng',2024,'2025-02-15'),
  -- Năm học 2025
  ('HK1_2025', 1, '2025-08-01','2025-12-15','Đóng',2025,'2025-09-15'),
  ('HK2_2025', 2, '2026-01-15','2026-05-30','Đóng',2025,'2026-02-15'),
  -- Năm học 2026
  ('HK1_2026', 1, '2026-08-01','2026-12-15','Đóng',2026,'2026-09-15'),
  ('HK2_2026', 2, '2027-01-15','2027-05-30','Đóng',2026,'2027-02-15'),
  -- Năm học 2027
  ('HK1_2027', 1, '2027-08-01','2027-12-15','Đóng',2027,'2027-09-15'),
  ('HK2_2027', 2, '2028-01-15','2028-05-30','Đóng',2027,'2028-02-15');


INSERT INTO HOCPHI_THEOHK (MaHocKy, MaLoaiMon, SoTienMotTC) VALUES
  ('HK1_2023', 'LT', 500000),
  ('HK1_2023', 'TH', 400000),
  ('HK2_2023', 'LT', 500000),
  ('HK2_2023', 'TH', 400000),
  ('HK1_2024', 'LT', 500000),
  ('HK1_2024', 'TH', 400000),
  ('HK2_2024', 'LT', 500000),
  ('HK2_2024', 'TH', 400000),
  ('HK1_2025', 'LT', 500000),
  ('HK1_2025', 'TH', 400000),
  ('HK2_2025', 'LT', 500000),
  ('HK2_2025', 'TH', 400000),
  ('HK1_2026', 'LT', 500000),
  ('HK1_2026', 'TH', 400000),
  ('HK2_2026', 'LT', 500000),
  ('HK2_2026', 'TH', 400000),
  ('HK1_2027', 'LT', 500000),
  ('HK1_2027', 'TH', 400000),
  ('HK2_2027', 'LT', 500000),
  ('HK2_2027', 'TH', 400000);

-- Các môn của ngành CNTT kỳ 1
INSERT INTO CHUONGTRINHHOC (MaNganh, MaMonHoc, MaHocKy, GhiChu) VALUES
  -- Học kì 1 năm học 2023
  ('CNTT','GD001','HK1_2023',''),    -- Giáo dục thể chất (có trong DANHSACHMONHOCMO)
  ('CNTT','CS101','HK1_2023',''),    -- Cấu trúc dữ liệu (có trong DANHSACHMONHOCMO)
  ('CNTT','CS102','HK1_2023',''),    -- Cơ sở dữ liệu (có trong DANHSACHMONHOCMO)
  ('CNTT','GD002','HK1_2023',''),    -- Giáo dục quốc phòng (có trong DANHSACHMONHOCMO)
  ('CNTT','DS101','HK1_2023',''),    -- Khai phá dữ liệu (có trong DANHSACHMONHOCMO)
  ('CNTT','CN201','HK1_2023',''),    -- Lập trình hướng đối tượng (có trong DANHSACHMONHOCMO)
  ('HTTT', 'IT101', 'HK1_2023', ''),  -- Tin học cơ bản (có trong DANHSACHMONHOCMO)
  ('HTTT', 'IT201', 'HK1_2023', ''),  -- Lập trình nâng cao (có trong DANHSACHMONHOCMO)
  ('HTTT', 'SE101', 'HK1_2023', ''),  -- Công nghệ phần mềm (có trong DANHSACHMONHOCMO)
  ('HTTT', 'MKT101', 'HK1_2023', ''), -- Marketing cơ bản (có trong DANHSACHMONHOCMO)
  ('HTTT', 'BUS1125', 'HK1_2023', ''),-- Quản trị kinh doanh (có trong DANHSACHMONHOCMO)
  ('HTTT', 'EE442', 'HK1_2023',''),
  ('HTTT', 'MKP301', 'HK1_2023',''),
  --Học kì 2 năm học 2023
  ('CNTT','GD001','HK2_2023',''),
  ('CNTT','CS101','HK2_2023',''),
  ('CNTT','CS102','HK2_2023',''),
  ('HTTT', 'IT101', 'HK2_2023', ''),    -- Tin học cơ bản (có trong DANHSACHMONHOCMO)
  ('HTTT', 'IT201', 'HK2_2023', ''),    -- Lập trình nâng cao (có trong DANHSACHMONHOCMO)
  ('HTTT', 'SE101', 'HK2_2023', ''),    -- Công nghệ phần mềm (có trong DANHSACHMONHOCMO)
  ('HTTT', 'MKT101', 'HK2_2023', ''),   -- Marketing cơ bản (có trong DANHSACHMONHOCMO)
  ('HTTT', 'BUS1125', 'HK2_2023', ''),  -- Quản trị kinh doanh (có trong DANHSACHMONHOCMO)
  ('HTTT', 'EE442', 'HK2_2023',''),
  ('HTTT', 'MKP301', 'HK2_2023',''),
  -- Học kì 1 năm học 2024
  ('CNTT','GD001','HK1_2024',''),    -- Giáo dục thể chất (có trong DANHSACHMONHOCMO)
  ('CNTT','CS101','HK1_2024',''),    -- Cấu trúc dữ liệu (có trong DANHSACHMONHOCMO)
  ('CNTT','CS102','HK1_2024',''),    -- Cơ sở dữ liệu (có trong DANHSACHMONHOCMO)
  ('CNTT','GD002','HK1_2024',''),    -- Giáo dục quốc phòng (có trong DANHSACHMONHOCMO)
  ('CNTT','DS101','HK1_2024',''),    -- Khai phá dữ liệu (có trong DANHSACHMONHOCMO)
  ('CNTT','CN201','HK1_2024',''),    -- Lập trình hướng đối tượng (có trong DANHSACHMONHOCMO)
  ('HTTT', 'IT101', 'HK1_2024', ''),  -- Tin học cơ bản (có trong DANHSACHMONHOCMO)
  ('HTTT', 'IT201', 'HK1_2024', ''),  -- Lập trình nâng cao (có trong DANHSACHMONHOCMO)
  ('HTTT', 'SE101', 'HK1_2024', ''),  -- Công nghệ phần mềm (có trong DANHSACHMONHOCMO)
  ('HTTT', 'MKT101', 'HK1_2024', ''), -- Marketing cơ bản (có trong DANHSACHMONHOCMO)
  ('HTTT', 'BUS1125', 'HK1_2024', ''),-- Quản trị kinh doanh (có trong DANHSACHMONHOCMO)
  ('HTTT', 'EE442', 'HK1_2024',''),
  ('HTTT', 'MKP301', 'HK1_2024',''),
  -- Học kì 2 năm học 2024
  ('CNTT','GD001','HK2_2024',''),
  ('CNTT','CS101','HK2_2024',''),
  ('CNTT','CS102','HK2_2024',''),
  ('HTTT', 'IT101', 'HK2_2024', ''),    -- Tin học cơ bản (có trong DANHSACHMONHOCMO)
  ('HTTT', 'IT201', 'HK2_2024', ''),    -- Lập trình nâng cao (có trong DANHSACHMONHOCMO)
  ('HTTT', 'SE101', 'HK2_2024', ''),    -- Công nghệ phần mềm (có trong DANHSACHMONHOCMO)
  ('HTTT', 'MKT101', 'HK2_2024', ''),   -- Marketing cơ bản (có trong DANHSACHMONHOCMO)
  ('HTTT', 'BUS1125', 'HK2_2024', ''),  -- Quản trị kinh doanh (có trong DANHSACHMONHOCMO)
  ('HTTT', 'EE442', 'HK2_2024',''),
  ('HTTT', 'MKP301', 'HK2_2024','');

-- Mở thêm môn tự chọn
INSERT INTO DANHSACHMONHOCMO (MaHocKy, MaMonHoc, SiSoToiThieu, SiSoToiDa, SoSVDaDangKy, Thu, TietBatDau, TietKetThuc) VALUES  -- Thêm môn học mở cho HK1_2024
  -- Thêm môn học mở cho HK1_2023
  ('HK1_2023','GD002', 30, 80, 0, 2, 1, 3),
  ('HK1_2023','BCH058', 30, 80, 0, 4, 1, 4),
  ('HK1_2023','BUS1125', 30, 50, 0, 5, 6, 9),
  ('HK1_2023','LTU101', 30, 80, 0, 6, 9, 10),
  ('HK1_2023','SS003', 30, 50, 0, 7, 4, 5),
  ('HK1_2023','IT101', 30, 80, 0, 2, 1, 5),
  ('HK1_2023','MKT101', 30, 50, 0, 3, 6, 10),
  ('HK1_2023','SE101', 30, 80, 0, 4, 1, 3),
  ('HK1_2023','QC101', 30, 50, 0, 5, 6, 8),
  ('HK1_2023','LTU201', 30, 80, 0, 2, 9, 10),
  ('HK1_2023','SS006', 30, 50, 0, 3, 1, 4),
  ('HK1_2023','IT201', 30, 80, 0, 4, 6, 9),
  ('HK1_2023','CE118', 30, 50, 0, 5, 4, 5),
  ('HK1_2023','EE214', 30, 80, 0, 6, 1, 5),
  ('HK1_2023','AI001', 30, 50, 0, 7, 6, 10),

  -- Thêm môn học mở cho HK2_2023
  ('HK2_2023','GD001', 30, 80, 0, 2, 1, 3),
  ('HK2_2023','GD002', 30, 80, 0, 2, 4, 6),
  ('HK2_2023','BCH058', 30, 80, 0, 3, 1, 4),
  ('HK2_2023','LTU101', 30, 80, 0, 3, 9, 10),
  ('HK2_2023','IT101', 30, 80, 0, 3, 1, 4),
  ('HK2_2023','CS101', 30, 50, 0, 4, 6, 8),
  ('HK2_2023','LTU202', 30, 80, 0, 2, 1, 3),
  ('HK2_2023','SS007', 30, 50, 0, 3, 6, 8),
  ('HK2_2023','IT301', 30, 80, 0, 4, 9, 10),
  ('HK2_2023','CE213', 30, 50, 0, 5, 1, 4),
  ('HK2_2023','EE216', 30, 80, 0, 6, 6, 9),
  ('HK2_2023','AI002', 30, 50, 0, 7, 4, 5),
  -- Thêm môn học mở cho HK1_2024
  ('HK1_2024','GD001', 30, 80, 0, 2, 1, 3),
  ('HK1_2024','LTU101', 30, 80, 0, 3, 9, 10),
  ('HK1_2024','GD002', 30, 80, 0, 2, 4, 6),
  ('HK1_2024','IT101', 30, 80, 0, 3, 1, 4),
  ('HK1_2024','CS101', 30, 50, 0, 4, 6, 8),
  ('HK1_2024','CS102', 30, 80, 0, 5, 1, 3),
  ('HK1_2024','TLH025', 30, 80, 0, 5, 6, 9),
  -- Thêm môn học có trùng lịch để test chức năng kiểm tra xung đột
  ('HK1_2024','IT201', 30, 50, 0, 3, 1, 3),  -- Trùng với IT101 (Thứ 3, tiết 1-4 vs 1-3)
  ('HK1_2024','IT202', 30, 50, 0, 3, 2, 5),  -- Trùng với IT101 (Thứ 3, tiết 1-4 vs 2-5)
  ('HK1_2024','IT203', 30, 50, 0, 4, 6, 9),  -- Trùng với CS101 (Thứ 4, tiết 6-8 vs 6-9)
  ('HK1_2024','IT204', 30, 50, 0, 5, 1, 2),  -- Trùng với CS102 (Thứ 5, tiết 1-3 vs 1-2)
  ('HK1_2024','IT205', 30, 50, 0, 5, 7, 8),  -- Trùng với TLH025 (Thứ 5, tiết 6-9 vs 7-8)

  -- Môn học mở cho HK2_2024
  ('HK2_2024','DS101', 30, 50, 0, 3, 6, 8),
  ('HK2_2024','LTU102', 30, 80, 0, 6, 9, 10),
  ('HK2_2024','SS004', 30, 50, 0, 7, 1, 4),
  ('HK2_2024','IT103', 30, 80, 0, 2, 6, 9),
  ('HK2_2024','CE103', 30, 50, 0, 3, 4, 5),
  ('HK2_2024','EE105', 30, 80, 0, 4, 1, 5),
  ('HK2_2024','MKT201', 30, 50, 0, 5, 6, 10),
  ('HK2_2024','SE201', 30, 80, 0, 6, 1, 3),
  ('HK2_2024','QC201', 30, 50, 0, 7, 6, 8);

INSERT INTO SINHVIEN (MaSoSinhVien, HoTen, NgaySinh, GioiTinh, QueQuan, MaHuyen, MaDoiTuongUT, MaNganh, Email, SoDienThoai, DiaChi) VALUES
  ('SV0001', 'Hoàng Thị Khánh', '2000-12-12', 'Nam', 'Tỉnh Nghệ An', '015', 'UT02', 'HTTT', 'SV0001@gm.uit.edu.vn', '0123456789', '123 Đường Lê Lợi, Phường Bến Nghé'),
  ('SV0002', 'Hoàng Văn Cường', '2001-10-23', 'Nữ', 'Tỉnh Thanh Hóa', '028', 'UT01', 'KHMT', 'SV0002@gm.uit.edu.vn', '0987654321', '45 Đường Nguyễn Huệ, Phường Đông Khê'),
  ('SV0003', 'Phạm Ngọc Hà', '2004-06-09', 'Nam', 'Tỉnh Quảng Nam', '007', 'UT02', 'KTPM', 'SV0003@gm.uit.edu.vn', '0345678912', '67 Đường Trần Phú, Xã Hòa Phú'),
  ('SV0004', 'Vũ Văn Hoa', '2004-10-16', 'Nam', 'Tỉnh Đồng Nai', '032', 'UT01', 'VMC', 'SV0004@gm.uit.edu.vn', '0456789123', '89 Đường Lý Thường Kiệt, Phường Tân Phong'),
  ('SV0005', 'Nguyễn Thị Mai', '2003-01-05', 'Nữ', 'Tỉnh Bình Dương', '037', 'UT02', 'CNTT_Nhat', 'SV0005@gm.uit.edu.vn', '0567891234', '12 Đường Hai Bà Trưng, Phường Hiệp Thành'),
  ('SV0006', 'Phan Thanh Cường', '2001-04-29', 'Nữ', 'Tỉnh Long An', '019', 'UT02', 'CNTT', 'SV0006@gm.uit.edu.vn', '0678912345', '34 Đường Võ Văn Tần, Xã Tân Hưng'),
  ('SV0007', 'Huỳnh Quang Linh', '2000-08-06', 'Nữ', 'Tỉnh Tiền Giang', '021', 'UT02', 'TTMT', 'SV0007@gm.uit.edu.vn', '0789123456', '56 Đường Điện Biên Phủ, Phường Mỹ Tho'),
  ('SV0008', 'Phan Ngọc Khánh', '2000-04-10', 'Nữ', 'Tỉnh Khánh Hòa', '043', 'UT01', 'ATTT', 'SV0008@gm.uit.edu.vn', '0891234567', '78 Đường Lê Duẩn, Phường Vĩnh Hải'),
  ('SV0009', 'Vũ Minh Hùng', '2002-04-05', 'Nữ', 'Tỉnh Bà Rịa Vũng Tàu', '020', 'UT01', 'ATTT', 'SV0009@gm.uit.edu.vn', '0912345678', '90 Đường Thùy Vân, Phường Thắng Tam'),
  ('SV0010', 'Vũ Huy Dũng', '2002-05-02', 'Nữ', 'Tỉnh Tây Ninh', '025', 'UT01', 'ATTT', 'SV0010@gm.uit.edu.vn', '0234567891', '11 Đường Cách Mạng Tháng 8, Phường 1'),
  ('SV0011', 'Trần Mai Hoa', '2004-09-05', 'Nam', 'Tỉnh An Giang', '016', 'UT01', 'HTTT', 'SV0011@gm.uit.edu.vn', '0356789124', '22 Đường Lê Hồng Phong, Phường Mỹ Bình'),
  ('SV0012', 'Đặng Quang Hùng', '2001-08-15', 'Nữ', 'Tỉnh Cần Thơ', '013', 'UT01', 'ATTT', 'SV0012@gm.uit.edu.vn', '0467891235', '33 Đường 30 Tháng 4, Phường Xuân Khánh'),
  ('SV0013', 'Phạm Huy Hùng', '2004-09-25', 'Nam', 'Tỉnh Kiên Giang', '047', 'UT02', 'KTPM', 'SV0013@gm.uit.edu.vn', '0578912346', '44 Đường Nguyễn Trãi, Phường Vĩnh Thanh'),
  ('SV0014', 'Huỳnh Hữu Hùng', '2001-12-14', 'Nữ', 'Tỉnh Sóc Trăng', '046', 'UT02', 'TTNT', 'SV0014@gm.uit.edu.vn', '0689123457', '55 Đường Trần Hưng Đạo, Phường 5'),
  ('SV0015', 'Nguyễn Ngọc Khánh', '2001-11-28', 'Nam', 'Tỉnh Hậu Giang', '014', 'UT01', 'CNTT_Nhat', 'SV0015@gm.uit.edu.vn', '0791234568', '66 Đường Ngô Quyền, Phường 1'),
  ('SV0016', 'Phan Quang Linh', '2004-07-16', 'Nam', 'Tỉnh Đồng Tháp', '031', 'UT01', 'TTMT', 'SV0016@gm.uit.edu.vn', '0812345679', '77 Đường Phạm Ngũ Lão, Phường 1'),
  ('SV0017', 'Huỳnh Ngọc Cường', '2000-08-07', 'Nữ', 'Tỉnh Vĩnh Long', '033', 'UT02', 'KHLDL', 'SV0017@gm.uit.edu.vn', '0923456781', '88 Đường Hoàng Thái Hiếu, Phường 1'),
  ('SV0018', 'Hoàng Ngọc Long', '2002-08-23', 'Nữ', 'Tỉnh Trà Vinh', '035', 'UT01', 'TMDT', 'SV0018@gm.uit.edu.vn', '0134567892', '99 Đường Lê Lợi, Phường 8'),
  ('SV0019', 'Nguyễn Anh Long', '2001-08-23', 'Nam', 'Tỉnh Bến Tre', '032', 'UT02', 'KTPM', 'SV0019@gm.uit.edu.vn', '0245678913', '101 Đường Đồng Khởi, Phường 1'),
  ('SV0020', 'Nguyễn Thanh Hoa', '2000-07-20', 'Nữ', 'Tỉnh Cà Mau', '048', 'UT01', 'TMDT', 'SV0020@gm.uit.edu.vn', '0367891245', '12 Đường Phan Bội Châu, Phường 5'),
  ('SV0021', 'Đặng Minh Cường', '2001-10-09', 'Nam', 'Tỉnh Hà Tĩnh', '011', 'UT02', 'ATTT', 'SV0021@gm.uit.edu.vn', '0478912356', '23 Đường Quang Trung, Phường Hà Huy Tập'),
  ('SV0022', 'Vũ Anh Dũng', '2000-08-02', 'Nam', 'Tỉnh Quảng Bình', '009', 'UT01', 'TTNT', 'SV0022@gm.uit.edu.vn', '0589123467', '34 Đường Lý Tự Trọng, Phường Đồng Phú'),
  ('SV0023', 'Huỳnh Quang Hùng', '2001-10-14', 'Nam', 'Tỉnh Quảng Trị', '008', 'UT01', 'KHLDL', 'SV0023@gm.uit.edu.vn', '0691234578', '45 Đường Hùng Vương, Phường 1'),
  ('SV0024', 'Hoàng Minh Hoa', '2004-07-26', 'Nữ', 'Tỉnh Thừa Thiên Huế', '006', 'UT01', 'CNTT', 'SV0024@gm.uit.edu.vn', '0712345689', '56 Đường Lê Lợi, Phường Vĩnh Ninh'),
  ('SV0025', 'Nguyễn Ngọc Khánh', '2003-05-20', 'Nữ', 'Tỉnh Quảng Nam', '007', 'UT02', 'TTMT', 'SV0025@gm.uit.edu.vn', '0823456791', '67 Đường Phan Châu Trinh, Phường Minh An'),
  ('SV0026', 'Phan Minh Hà', '2002-05-02', 'Nam', 'Tỉnh Quảng Ngãi', '036', 'UT01', 'KTPM', 'SV0026@gm.uit.edu.vn', '0934567812', '78 Đường Quang Trung, Phường Lý Thường Kiệt'),
  ('SV0027', 'Trần Thị Long', '2003-08-28', 'Nữ', 'Tỉnh Bình Định', '034', 'UT02', 'HTTT', 'SV0027@gm.uit.edu.vn', '0145678923', '89 Đường Trần Hưng Đạo, Phường Quang Trung'),
  ('SV0028', 'Lê Huy Hà', '2004-11-25', 'Nữ', 'Tỉnh Phú Yên', '044', 'UT01', 'KHMT', 'SV0028@gm.uit.edu.vn', '0256789134', '90 Đường Lê Thánh Tôn, Phường 7'),
  ('SV0029', 'Võ Huy Hà', '2003-11-12', 'Nam', 'Tỉnh Khánh Hòa', '043', 'UT01', 'TMDT', 'SV0029@gm.uit.edu.vn', '0378912456', '11 Đường Yersin, Phường Vĩnh Phước'),
  ('SV0030', 'Phạm Thanh Bình', '2000-08-29', 'Nam', 'Tỉnh Ninh Thuận', '045', 'UT01', 'KHLDL', 'SV0030@gm.uit.edu.vn', '0489123567', '22 Đường 16 Tháng 4, Phường Mỹ Bình'),
  ('SV0031', 'Phạm Hữu Bình', '2003-04-14', 'Nam', 'Tỉnh Bình Thuận', '043', 'UT02', 'TTMT', 'SV0031@gm.uit.edu.vn', '0591234678', '33 Đường Nguyễn Tất Thành, Phường Phú Trinh'),
  ('SV0032', 'Phan Huy Cường', '2005-12-05', 'Nữ', 'Tỉnh Kon Tum', '041', 'UT01', 'TMDT', 'SV0032@gm.uit.edu.vn', '0612345789', '44 Đường Lý Thường Kiệt, Phường Quyết Thắng'),
  ('SV0033', 'Hoàng Văn Cường', '2000-10-07', 'Nữ', 'Tỉnh Gia Lai', '040', 'UT02', 'CNTT', 'SV0033@gm.uit.edu.vn', '0723456891', '55 Đường Phạm Văn Đồng, Phường Diên Hồng'),
  ('SV0034', 'Phan Ngọc Cường', '2005-08-01', 'Nữ', 'Tỉnh Đắk Lắk', '042', 'UT02', 'CNTT_Nhat', 'SV0034@gm.uit.edu.vn', '0834567912', '66 Đường Y Wang, Phường Tân Lập'),
  ('SV0035', 'Huỳnh Ngọc Hùng', '2001-02-21', 'Nam', 'Tỉnh Đắk Nông', '027', 'UT01', 'CNTT_Nhat', 'SV0035@gm.uit.edu.vn', '0945678123', '77 Đường Nguyễn Du, Phường Nghĩa Đức'),
  ('SV0036', 'Võ Minh Long', '2001-11-07', 'Nữ', 'Tỉnh Lâm Đồng', '026', 'UT02', 'HTTT', 'SV0036@gm.uit.edu.vn', '0156789234', '88 Đường 3 Tháng 2, Phường 1'),
  ('SV0037', 'Vũ Minh Mai', '2000-10-09', 'Nam', 'Tỉnh Bình Phước', '040', 'UT02', 'TTMT', 'SV0037@gm.uit.edu.vn', '0267891345', '99 Đường Lê Duẩn, Phường Tân Xuân'),
  ('SV0038', 'Phan Ngọc Mai', '2001-09-19', 'Nam', 'Tỉnh Bình Dương', '038', 'UT01', 'ATTT', 'SV0038@gm.uit.edu.vn', '0389124567', '10 Đường Đại lộ Bình Dương, Phường Phú Hòa'),
  ('SV0039', 'Vũ Quang Long', '2002-05-26', 'Nữ', 'Tỉnh Đồng Nai', '019', 'UT01', 'CNTT', 'SV0039@gm.uit.edu.vn', '0491235678', '21 Đường Võ Thị Sáu, Phường Quyết Thắng'),
  ('SV0040', 'Vũ Hữu Hà', '2004-10-31', 'Nam', 'Tỉnh Hà Nội', '004', 'UT02', 'KTMT', 'SV0040@gm.uit.edu.vn', '0512346789', '32 Đường Hoàng Diệu, Phường Liễu Giai'),
  ('SV0041', 'Phan Huy Khánh', '2002-04-21', 'Nam', 'Tỉnh Hà Nội', '005', 'UT02', 'KHLDL', 'SV0041@gm.uit.edu.vn', '0623457891', '43 Đường Hàng Bài, Phường Hàng Bài'),
  ('SV0042', 'Đặng Anh An', '2003-03-25', 'Nữ', 'Tỉnh Vĩnh Phúc', '006', 'UT02', 'TTNT', 'SV0042@gm.uit.edu.vn', '0734568912', '54 Đường Mê Linh, Phường Liên Bảo'),
  ('SV0043', 'Đặng Ngọc Hùng', '2001-04-13', 'Nam', 'Tỉnh Hà Nam', '022', 'UT01', 'CNTT', 'SV0043@gm.uit.edu.vn', '0845679123', '65 Đường Trần Phú, Phường Quang Trung'),
  ('SV0044', 'Nguyễn Quang Hoa', '2003-01-13', 'Nam', 'Tỉnh Hưng Yên', '023', 'UT02', 'CNTT_Nhat', 'SV0044@gm.uit.edu.vn', '0956781234', '76 Đường Lê Lợi, Phường Lê Lợi'),
  ('SV0045', 'Võ Huy Hùng', '2000-10-18', 'Nữ', 'Tỉnh Thái Bình', '024', 'UT01', 'CNTT', 'SV0045@gm.uit.edu.vn', '0167892345', '87 Đường Lý Bôn, Phường Trần Hưng Đạo'),
  ('SV0046', 'Hoàng Ngọc Khánh', '2004-03-20', 'Nữ', 'Tỉnh Hải Dương', '028', 'UT02', 'VMC', 'SV0046@gm.uit.edu.vn', '0278913456', '98 Đường Nguyễn Lương Bằng, Phường Lê Thanh Nghị'),
  ('SV0047', 'Phan Minh An', '2005-04-08', 'Nữ', 'Tỉnh Hải Phòng', '010', 'UT02', 'KHMT', 'SV0047@gm.uit.edu.vn', '0391234567', '109 Đường Lạch Tray, Phường Đằng Giang'),
  ('SV0048', 'Phan Huy Cường', '2005-02-11', 'Nữ', 'Tỉnh Quảng Ninh', '012', 'UT01', 'KHMT', 'SV0048@gm.uit.edu.vn', '0412345678', '111 Đường Hạ Long, Phường Bãi Cháy'),
  ('SV0049', 'Hoàng Mai Hùng', '2000-03-09', 'Nam', 'Tỉnh Lạng Sơn', '029', 'UT02', 'KHLDL', 'SV0049@gm.uit.edu.vn', '0523456789', '122 Đường Lê Lợi, Phường Chi Lăng'),  ('SV0050', 'Hoàng Hữu Linh', '2002-10-02', 'Nam', 'Tỉnh Cao Bằng', '030', 'UT02', 'HTTT', 'SV0050@gm.uit.edu.vn', '0634567891', '133 Đường Nguyễn Huệ, Phường Đề Thám'),
  ('SV0051', 'Huỳnh Quang Linh', '2000-09-10', 'Nam', 'Tỉnh Bắc Kạn', '025', 'UT02', 'KHMT', 'SV0051@gm.uit.edu.vn', '0745678912', '144 Đường Trần Phú, Phường Ngọc Xuân'),
  ('SV0052', 'Trần Anh Dũng', '2000-08-25', 'Nam', 'Tỉnh Thái Nguyên', '026', 'UT02', 'TTNT', 'SV0052@gm.uit.edu.vn', '0856789123', '155 Đường Lương Ngọc Quyến, Phường Hoàng Văn Thụ'),
  ('SV0053', 'Nguyễn Mai Linh', '2001-06-02', 'Nam', 'Tỉnh Tuyên Quang', '027', 'UT01', 'KHLDL', 'SV0053@gm.uit.edu.vn', '0967891234', '166 Đường Nguyễn Trai, Phường Phan Thiết'),
  ('SV0054', 'Võ Văn Long', '2000-05-21', 'Nam', 'Tỉnh Lào Cai', '029', 'UT01', 'CNTT', 'SV0054@gm.uit.edu.vn', '0178912345', '177 Đường Cầu Mây, Phường Bình Minh'),
  ('SV0055', 'Lê Thị Hà', '2001-04-02', 'Nam', 'Tỉnh Điện Biên', '030', 'UT01', 'CNTT', 'SV0055@gm.uit.edu.vn', '0289123456', '188 Đường 7 Tháng 5, Phường Him Lam'),
  ('SV0056', 'Võ Huy Linh', '2003-11-09', 'Nữ', 'Tỉnh Lai Châu', '031', 'UT01', 'TTMT', 'SV0056@gm.uit.edu.vn', '0391234567', '199 Đường Trần Hưng Đạo, Phường Đông Phong'),
  ('SV0057', 'Võ Ngọc Mai', '2001-12-11', 'Nam', 'Tỉnh Sơn La', '032', 'UT02', 'KTMT', 'SV0057@gm.uit.edu.vn', '0412345678', '200 Đường Tô Hiến Thành, Phường Chiềng Lề'),
  ('SV0058', 'Lê Văn Linh', '2002-10-28', 'Nam', 'Tỉnh Hòa Bình', '033', 'UT02', 'CNTT_Nhat', 'SV0058@gm.uit.edu.vn', '0523456789', '211 Đường Trần Nhân Tông, Phường Phương Lâm'),
  ('SV0059', 'Huỳnh Anh Long', '2000-11-07', 'Nam', 'Tỉnh Hà Giang', '025', 'UT02', 'HTTT', 'SV0059@gm.uit.edu.vn', '0634567891', '222 Đường Lý Thái Tổ, Phường Nguyễn Trãi'),
  ('SV0060', 'Nguyễn Văn Long', '2000-05-14', 'Nam', 'Tỉnh Yên Bái', '026', 'UT01', 'KHMT', 'SV0060@gm.uit.edu.vn', '0745678912', '233 Đường Điện Biên, Phường Đồng Tâm'),
  ('SV0061', 'Hoàng Ngọc Linh', '2004-06-15', 'Nam', 'Tỉnh Phú Thọ', '028', 'UT02', 'KTPM', 'SV0061@gm.uit.edu.vn', '0856789123', '244 Đường Lê Hồng Phong, Phường Gia Cẩm'),
  ('SV0062', 'Huỳnh Mai An', '2002-06-23', 'Nữ', 'Tỉnh Bắc Giang', '022', 'UT01', 'KTMT', 'SV0062@gm.uit.edu.vn', '0967891234', '255 Đường Xuân Thủy, Phường Hoàng Văn Thụ'),
  ('SV0063', 'Hoàng Thanh Khánh', '2001-11-17', 'Nam', 'Tỉnh Bắc Ninh', '028', 'UT01', 'HTTT', 'SV0063@gm.uit.edu.vn', '0178912345', '266 Đường Võ Nguyên Giáp, Phường Suối Hoa'),
  ('SV0064', 'Võ Mai Dũng', '2003-08-24', 'Nam', 'Tỉnh Hải Dương', '029', 'UT01', 'VMC', 'SV0064@gm.uit.edu.vn', '0289123456', '277 Đường Nguyễn Bỉnh Khiêm, Phường Lê Thanh Nghị'),
  ('SV0065', 'Phan Quang Dũng', '2005-11-01', 'Nam', 'Tỉnh Hưng Yên', '023', 'UT02', 'VMC', 'SV0065@gm.uit.edu.vn', '0391234567', '288 Đường Phạm Hùng, Phường An Tảo'),
  ('SV0066', 'Phan Quang Mai', '2000-03-24', 'Nữ', 'Tỉnh Hà Nam', '022', 'UT01', 'HTTT', 'SV0066@gm.uit.edu.vn', '0412345678', '299 Đường Lê Lai, Phường Lam Hạ'),
  ('SV0067', 'Nguyễn Minh Bình', '2005-04-17', 'Nữ', 'Tỉnh Nam Định', '024', 'UT02', 'CNTT_Nhat', 'SV0067@gm.uit.edu.vn', '0523456789', '300 Đường Trường Chinh, Phường Vị Hoàng'),
  ('SV0068', 'Huỳnh Quang Khánh', '2002-08-19', 'Nam', 'Tỉnh Thái Bình', '024', 'UT01', 'VMC', 'SV0068@gm.uit.edu.vn', '0634567891', '311 Đường Lý Thường Kiệt, Phường Trần Hưng Đạo'),
  ('SV0069', 'Phạm Minh Mai', '2004-07-06', 'Nam', 'Tỉnh Ninh Bình', '023', 'UT02', 'KHMT', 'SV0069@gm.uit.edu.vn', '0745678912', '322 Đường Tràng An, Phường Đông Thành'),
  ('SV0070', 'Lê Văn Mai', '2003-08-30', 'Nam', 'Tỉnh Thanh Hóa', '025', 'UT01', 'HTTT', 'SV0070@gm.uit.edu.vn', '0856789123', '333 Đường Hàm Nghi, Phường Ba Đình'),
  ('SV0071', 'Nguyễn Anh Linh', '2000-02-25', 'Nữ', 'Tỉnh Nghệ An', '026', 'UT02', 'CNTT_Nhat', 'SV0071@gm.uit.edu.vn', '0967891234', '344 Đường Quang Trung, Phường Vinh'),
  ('SV0072', 'Lê Huy Hà', '2002-08-30', 'Nữ', 'Tỉnh Hà Tĩnh', '011', 'UT01', 'TTMT', 'SV0072@gm.uit.edu.vn', '0178912345', '355 Đường Phan Đình Phùng, Phường Nam Hà'),
  ('SV0073', 'Phạm Văn Linh', '2004-05-06', 'Nữ', 'Tỉnh Quảng Bình', '009', 'UT01', 'TMDT', 'SV0073@gm.uit.edu.vn', '0289123456', '366 Đường Võ Nguyên Giáp, Phường Đồng Phú'),
  ('SV0074', 'Lê Anh Linh', '2000-11-19', 'Nữ', 'Tỉnh Quảng Trị', '008', 'UT02', 'KHMT', 'SV0074@gm.uit.edu.vn', '0391234567', '377 Đường Hùng Vương, Phường 1'),
  ('SV0075', 'Đặng Mai An', '2005-11-16', 'Nam', 'Tỉnh Thừa Thiên Huế', '006', 'UT02', 'CNTT_Nhat', 'SV0075@gm.uit.edu.vn', '0412345678', '388 Đường Lê Lợi, Phường Vĩnh Ninh'),
  ('SV0076', 'Đặng Minh Dũng', '2003-04-06', 'Nữ', 'Tỉnh Đà Nẵng', '007', 'UT01', 'CNTT_Nhat', 'SV0076@gm.uit.edu.vn', '0523456789', '399 Đường Bạch Đằng, Phường Hải Châu 1'),
  ('SV0077', 'Đặng Anh Long', '2000-04-25', 'Nữ', 'Tỉnh Quảng Nam', '007', 'UT01', 'HTTT', 'SV0077@gm.uit.edu.vn', '0634567891', '400 Đường Trần Hưng Đạo, Phường Minh An'),
  ('SV0078', 'Trần Ngọc Hùng', '2003-11-14', 'Nam', 'Tỉnh Quảng Ngãi', '036', 'UT02', 'TMDT', 'SV0078@gm.uit.edu.vn', '0745678912', '411 Đường Phan Bội Châu, Phường Lý Thường Kiệt'),
  ('SV0079', 'Lê Hữu Cường', '2001-07-17', 'Nữ', 'Tỉnh Bình Định', '034', 'UT02', 'CNTT', 'SV0079@gm.uit.edu.vn', '0856789123', '422 Đường An Dương Vương, Phường Quang Trung'),
  ('SV0080', 'Huỳnh Minh Hùng', '2003-10-09', 'Nam', 'Tỉnh Phú Yên', '044', 'UT01', 'TTMT', 'SV0080@gm.uit.edu.vn', '0967891234', '433 Đường Ngô Gia Tự, Phường 7'),
  ('SV0081', 'Hoàng Thanh Hùng', '2005-10-02', 'Nam', 'Tỉnh Khánh Hòa', '043', 'UT01', 'CNTT', 'SV0081@gm.uit.edu.vn', '0178912345', '444 Đường Pasteur, Phường Vĩnh Phước'),
  ('SV0082', 'Trần Quang Hà', '2003-11-26', 'Nữ', 'Tỉnh Ninh Thuận', '045', 'UT01', 'KHLDL', 'SV0082@gm.uit.edu.vn', '0289123456', '455 Đường 16 Tháng 4, Phường Mỹ Bình'),
  ('SV0083', 'Đặng Quang Hùng', '2000-04-22', 'Nam', 'Tỉnh Bình Thuận', '043', 'UT02', 'TTMT', 'SV0083@gm.uit.edu.vn', '0391234567', '466 Đường Nguyễn Tất Thành, Phường Phú Trinh'),
  ('SV0084', 'Huỳnh Quang Hoa', '2001-04-01', 'Nữ', 'Tỉnh Kon Tum', '041', 'UT02', 'TMDT', 'SV0084@gm.uit.edu.vn', '0412345678', '477 Đường Nguyễn Huệ, Phường Quyết Thắng'),
  ('SV0085', 'Phan Huy Bình', '2001-11-14', 'Nữ', 'Tỉnh Gia Lai', '040', 'UT02', 'CNTT_Nhat', 'SV0085@gm.uit.edu.vn', '0523456789', '488 Đường Lê Duẩn, Phường Diên Hồng'),
  ('SV0086', 'Hoàng Mai Hà', '2005-04-10', 'Nữ', 'Tỉnh Đắk Lắk', '042', 'UT02', 'HTTT', 'SV0086@gm.uit.edu.vn', '0634567891', '499 Đường Y Jút, Phường Tân Lập'),
  ('SV0087', 'Đặng Văn Linh', '2001-09-06', 'Nữ', 'Tỉnh Đắk Nông', '027', 'UT01', 'TMDT', 'SV0087@gm.uit.edu.vn', '0745678912', '500 Đường Nguyễn Du, Phường Nghĩa Đức'),
  ('SV0088', 'Vũ Huy An', '2002-04-14', 'Nam', 'Tỉnh Lâm Đồng', '026', 'UT01', 'CNTT', 'SV0088@gm.uit.edu.vn', '0856789123', '511 Đường 3 Tháng 2, Phường 1'),
  ('SV0089', 'Vũ Văn An', '2002-02-25', 'Nữ', 'Tỉnh Bình Phước', '040', 'UT02', 'HTTT', 'SV0089@gm.uit.edu.vn', '0967891234', '522 Đường Lê Duẩn, Phường Tân Xuân'),
  ('SV0090', 'Vũ Mai Bình', '2001-11-07', 'Nam', 'Tỉnh Tây Ninh', '025', 'UT02', 'HTTT', 'SV0090@gm.uit.edu.vn', '0178912345', '533 Đường Cách Mạng Tháng 8, Phường 1'),
  ('SV0091', 'Nguyễn Văn Cường', '2004-10-11', 'Nữ', 'Tỉnh Bình Dương', '038', 'UT02', 'VMC', 'SV0091@gm.uit.edu.vn', '0289123456', '544 Đường Thống Nhất, Phường Phú Hòa'),
  ('SV0092', 'Huỳnh Thị Linh', '2000-02-09', 'Nam', 'Tỉnh Đồng Nai', '019', 'UT01', 'CNTT_Nhat', 'SV0092@gm.uit.edu.vn', '0391234567', '555 Đường Võ Thị Sáu, Phường Quyết Thắng'),
  ('SV0093', 'Trần Thanh An', '2003-08-02', 'Nữ', 'Tỉnh Bà Rịa Vũng Tàu', '020', 'UT02', 'TTNT', 'SV0093@gm.uit.edu.vn', '0412345678', '566 Đường Thùy Vân, Phường Thắng Tam'),
  ('SV0094', 'Nguyễn Minh Bình', '2004-04-07', 'Nữ', 'Tỉnh Long An', '019', 'UT02', 'KHLDL', 'SV0094@gm.uit.edu.vn', '0523456789', '577 Đường Nguyễn Huệ, Xã Tân Hưng'),
  ('SV0095', 'Hoàng Mai Hà', '2001-04-05', 'Nữ', 'Tỉnh Tiền Giang', '021', 'UT01', 'CNTT_Nhat', 'SV0095@gm.uit.edu.vn', '0634567891', '588 Đường Ap Bắc, Phường Mỹ Tho'),
  ('SV0096', 'Phan Huy Long', '2000-07-30', 'Nam', 'Tỉnh An Giang', '016', 'UT01', 'CNTT_Nhat', 'SV0096@gm.uit.edu.vn', '0745678912', '599 Đường Tôn Đức Thắng, Phường Mỹ Bình'),
  ('SV0097', 'Huỳnh Văn Linh', '2003-08-30', 'Nam', 'Tỉnh Đồng Tháp', '031', 'UT01', 'HTTT', 'SV0097@gm.uit.edu.vn', '0856789123', '600 Đường Phạm Ngũ Lão, Phường 1'),
  ('SV0098', 'Vũ Huy Dũng', '2001-07-25', 'Nữ', 'Tỉnh Vĩnh Long', '033', 'UT01', 'HTTT', 'SV0098@gm.uit.edu.vn', '0967891234', '611 Đường Hoàng Thái Hiếu, Phường 1'),
  ('SV0099', 'Vũ Quang Hoa', '2001-12-23', 'Nam', 'Tỉnh Trà Vinh', '035', 'UT01', 'HTTT', 'SV0099@gm.uit.edu.vn', '0178912345', '622 Đường Lê Lợi, Phường 8'),
  ('SV0100', 'Phan Ngọc Bình', '2003-08-17', 'Nữ', 'Tỉnh Bến Tre', '032', 'UT01', 'CNTT_Nhat', 'SV0100@gm.uit.edu.vn', '0289123456', '633 Đường Đồng Khởi, Phường 1');

INSERT INTO PHIEUDANGKY
  (MaPhieuDangKy, NgayLap, MaSoSinhVien, MaHocKy) VALUES
  -- 100 phiếu đăng ký cho 100 sinh viên với HK1_2024 (bắt đầu 2024-08-01)
  ('PD001','2024-08-01','SV0001','HK1_2024'),
  ('PD002','2024-08-01','SV0002','HK1_2024'),
  ('PD003','2024-08-01','SV0003','HK1_2024'),
  ('PD004','2024-08-01','SV0004','HK1_2024'),
  ('PD005','2024-08-01','SV0005','HK1_2024'),  
  ('PD006','2024-08-01','SV0006','HK1_2024'),
  ('PD007','2024-08-01','SV0007','HK1_2024'),
  ('PD008','2024-08-01','SV0008','HK1_2024'),
  ('PD009','2024-08-01','SV0009','HK1_2024'),
  ('PD010','2024-08-01','SV0010','HK1_2024'),
  ('PD011','2024-08-01','SV0011','HK1_2024'),
  ('PD012','2024-08-01','SV0012','HK1_2024'),
  ('PD013','2024-08-01','SV0013','HK1_2024'),
  ('PD014','2024-08-01','SV0014','HK1_2024'),
  ('PD015','2024-08-01','SV0015','HK1_2024'),
  ('PD016','2024-08-01','SV0016','HK1_2024'),
  ('PD017','2024-08-01','SV0017','HK1_2024'),
  ('PD018','2024-08-01','SV0018','HK1_2024'),
  ('PD019','2024-08-01','SV0019','HK1_2024'),
  ('PD020','2024-08-01','SV0020','HK1_2024'),
  ('PD021','2024-08-01','SV0021','HK1_2024'),
  ('PD022','2024-08-01','SV0022','HK1_2024'),
  ('PD023','2024-08-01','SV0023','HK1_2024'),
  ('PD024','2024-08-01','SV0024','HK1_2024'),
  ('PD025','2024-08-01','SV0025','HK1_2024'),
  ('PD026','2024-08-01','SV0026','HK1_2024'),
  ('PD027','2024-08-01','SV0027','HK1_2024'),
  ('PD028','2024-08-01','SV0028','HK1_2024'),
  ('PD029','2024-08-01','SV0029','HK1_2024'),
  ('PD030','2024-08-01','SV0030','HK1_2024'),
  ('PD031','2024-08-01','SV0031','HK1_2024'),
  ('PD032','2024-08-01','SV0032','HK1_2024'),
  ('PD033','2024-08-01','SV0033','HK1_2024'),
  ('PD034','2024-08-01','SV0034','HK1_2024'),
  ('PD035','2024-08-01','SV0035','HK1_2024'),
  ('PD036','2024-08-01','SV0036','HK1_2024'),
  ('PD037','2024-08-01','SV0037','HK1_2024'),
  ('PD038','2024-08-01','SV0038','HK1_2024'),
  ('PD039','2024-08-01','SV0039','HK1_2024'),
  ('PD040','2024-08-01','SV0040','HK1_2024'),
  ('PD041','2024-08-01','SV0041','HK1_2024'),
  ('PD042','2024-08-01','SV0042','HK1_2024'),
  ('PD043','2024-08-01','SV0043','HK1_2024'),
  ('PD044','2024-08-01','SV0044','HK1_2024'),
  ('PD045','2024-08-01','SV0045','HK1_2024'),
  ('PD046','2024-08-01','SV0046','HK1_2024'),
  ('PD047','2024-08-01','SV0047','HK1_2024'),
  ('PD048','2024-08-01','SV0048','HK1_2024'),
  ('PD049','2024-08-01','SV0049','HK1_2024'),
  ('PD050','2024-08-01','SV0050','HK1_2024'),
  ('PD051','2024-08-01','SV0051','HK1_2024'),
  ('PD052','2024-08-01','SV0052','HK1_2024'),
  ('PD053','2024-08-01','SV0053','HK1_2024'),
  ('PD054','2024-08-01','SV0054','HK1_2024'),
  ('PD055','2024-08-01','SV0055','HK1_2024'),
  ('PD056','2024-08-01','SV0056','HK1_2024'),
  ('PD057','2024-08-01','SV0057','HK1_2024'),
  ('PD058','2024-08-01','SV0058','HK1_2024'),
  ('PD059','2024-08-01','SV0059','HK1_2024'),
  ('PD060','2024-08-01','SV0060','HK1_2024'),
  ('PD061','2024-08-01','SV0061','HK1_2024'),
  ('PD062','2024-08-01','SV0062','HK1_2024'),
  ('PD063','2024-08-01','SV0063','HK1_2024'),
  ('PD064','2024-08-01','SV0064','HK1_2024'),
  ('PD065','2024-08-01','SV0065','HK1_2024'),
  ('PD066','2024-08-01','SV0066','HK1_2024'),
  ('PD067','2024-08-01','SV0067','HK1_2024'),
  ('PD068','2024-08-01','SV0068','HK1_2024'),
  ('PD069','2024-08-01','SV0069','HK1_2024'),
  ('PD070','2024-08-01','SV0070','HK1_2024'),
  ('PD071','2024-08-01','SV0071','HK1_2024'),
  ('PD072','2024-08-01','SV0072','HK1_2024'),
  ('PD073','2024-08-01','SV0073','HK1_2024'),
  ('PD074','2024-08-01','SV0074','HK1_2024'),
  ('PD075','2024-08-01','SV0075','HK1_2024'),
  ('PD076','2024-08-01','SV0076','HK1_2024'),
  ('PD077','2024-08-01','SV0077','HK1_2024'),
  ('PD078','2024-08-01','SV0078','HK1_2024'),
  ('PD079','2024-08-01','SV0079','HK1_2024'),
  ('PD080','2024-08-01','SV0080','HK1_2024'),
  ('PD081','2024-08-01','SV0081','HK1_2024'),
  ('PD082','2024-08-01','SV0082','HK1_2024'),
  ('PD083','2024-08-01','SV0083','HK1_2024'),
  ('PD084','2024-08-01','SV0084','HK1_2024'),
  ('PD085','2024-08-01','SV0085','HK1_2024'),
  ('PD086','2024-08-01','SV0086','HK1_2024'),
  ('PD087','2024-08-01','SV0087','HK1_2024'),
  ('PD088','2024-08-01','SV0088','HK1_2024'),
  ('PD089','2024-08-01','SV0089','HK1_2024'),
  ('PD090','2024-08-01','SV0090','HK1_2024'),
  ('PD091','2024-08-01','SV0091','HK1_2024'),
  ('PD092','2024-08-01','SV0092','HK1_2024'),
  ('PD093','2024-08-01','SV0093','HK1_2024'),
  ('PD094','2024-08-01','SV0094','HK1_2024'),
  ('PD095','2024-08-01','SV0095','HK1_2024'),
  ('PD096','2024-08-01','SV0096','HK1_2024'),
  ('PD097','2024-08-01','SV0097','HK1_2024'),
  ('PD098','2024-08-01','SV0098','HK1_2024'),
  ('PD099','2024-08-01','SV0099','HK1_2024'),
  ('PD100','2024-08-01','SV0100','HK1_2024');
  

-- Thêm 100 phiếu đăng ký cho HK1_2023 (đồng bộ ngày với ngày bắt đầu học kỳ)
INSERT INTO PHIEUDANGKY (MaPhieuDangKy, NgayLap, MaSoSinhVien, MaHocKy, XacNhan) VALUES
  ('PD101','2023-08-01','SV0001','HK1_2023', true),
  ('PD102','2023-08-01','SV0002','HK1_2023', true),
  ('PD103','2023-08-01','SV0003','HK1_2023', true),
  ('PD104','2023-08-01','SV0004','HK1_2023', true),
  ('PD105','2023-08-01','SV0005','HK1_2023', true),
  ('PD106','2023-08-01','SV0006','HK1_2023', true),
  ('PD107','2023-08-01','SV0007','HK1_2023', true),
  ('PD108','2023-08-01','SV0008','HK1_2023', true),
  ('PD109','2023-08-01','SV0009','HK1_2023', true),
  ('PD110','2023-08-01','SV0010','HK1_2023', true),
  ('PD111','2023-08-01','SV0011','HK1_2023', true),
  ('PD112','2023-08-01','SV0012','HK1_2023', true),
  ('PD113','2023-08-01','SV0013','HK1_2023', true),
  ('PD114','2023-08-01','SV0014','HK1_2023', true),  
  ('PD115','2023-08-01','SV0015','HK1_2023', true),
  ('PD116','2023-08-01','SV0016','HK1_2023', true),
  ('PD117','2023-08-01','SV0017','HK1_2023', true),
  ('PD118','2023-08-01','SV0018','HK1_2023', true),
  ('PD119','2023-08-01','SV0019','HK1_2023', true),
  ('PD120','2023-08-01','SV0020','HK1_2023', true),
  ('PD121','2023-08-01','SV0021','HK1_2023', true),
  ('PD122','2023-08-01','SV0022','HK1_2023', true),
  ('PD123','2023-08-01','SV0023','HK1_2023', true),
  ('PD124','2023-08-01','SV0024','HK1_2023', true),
  ('PD125','2023-08-01','SV0025','HK1_2023', true),
  ('PD126','2023-08-01','SV0026','HK1_2023', true),
  ('PD127','2023-08-01','SV0027','HK1_2023', true),
  ('PD128','2023-08-01','SV0028','HK1_2023', true),
  ('PD129','2023-08-01','SV0029','HK1_2023', true),  
  ('PD130','2023-08-01','SV0030','HK1_2023', true),
  ('PD131','2023-08-01','SV0031','HK1_2023', true),
  ('PD132','2023-08-01','SV0032','HK1_2023', true),
  ('PD133','2023-08-01','SV0033','HK1_2023', true),
  ('PD134','2023-08-01','SV0034','HK1_2023', true),
  ('PD135','2023-08-01','SV0035','HK1_2023', true),
  ('PD136','2023-08-01','SV0036','HK1_2023', true),
  ('PD137','2023-08-01','SV0037','HK1_2023', true),
  ('PD138','2023-08-01','SV0038','HK1_2023', true),
  ('PD139','2023-08-01','SV0039','HK1_2023', true),
  ('PD140','2023-08-01','SV0040','HK1_2023', true),
  ('PD141','2023-08-01','SV0041','HK1_2023', true),
  ('PD142','2023-08-01','SV0042','HK1_2023', true),
  ('PD143','2023-08-01','SV0043','HK1_2023', true),
  ('PD144','2023-08-01','SV0044','HK1_2023', true),  
  ('PD145','2023-08-01','SV0045','HK1_2023', true),
  ('PD146','2023-08-01','SV0046','HK1_2023', true),
  ('PD147','2023-08-01','SV0047','HK1_2023', true),
  ('PD148','2023-08-01','SV0048','HK1_2023', true),
  ('PD149','2023-08-01','SV0049','HK1_2023', true),
  ('PD150','2023-08-01','SV0050','HK1_2023', true),
  ('PD151','2023-08-01','SV0051','HK1_2023', true),
  ('PD152','2023-08-01','SV0052','HK1_2023', true),
  ('PD153','2023-08-01','SV0053','HK1_2023', true),
  ('PD154','2023-08-01','SV0054','HK1_2023', true),
  ('PD155','2023-08-01','SV0055','HK1_2023', true),
  ('PD156','2023-08-01','SV0056','HK1_2023', true),
  ('PD157','2023-08-01','SV0057','HK1_2023', true),
  ('PD158','2023-08-01','SV0058','HK1_2023', true),
  ('PD159','2023-08-01','SV0059','HK1_2023', true),  
  ('PD160','2023-08-01','SV0060','HK1_2023', true),
  ('PD161','2023-08-01','SV0061','HK1_2023', true),
  ('PD162','2023-08-01','SV0062','HK1_2023', true),
  ('PD163','2023-08-01','SV0063','HK1_2023', true),
  ('PD164','2023-08-01','SV0064','HK1_2023', true),
  ('PD165','2023-08-01','SV0065','HK1_2023', true),
  ('PD166','2023-08-01','SV0066','HK1_2023', true),
  ('PD167','2023-08-01','SV0067','HK1_2023', true),
  ('PD168','2023-08-01','SV0068','HK1_2023', true),
  ('PD169','2023-08-01','SV0069','HK1_2023', true),
  ('PD170','2023-08-01','SV0070','HK1_2023', true),
  ('PD171','2023-08-01','SV0071','HK1_2023', true),
  ('PD172','2023-08-01','SV0072','HK1_2023', true),
  ('PD173','2023-08-01','SV0073','HK1_2023', true),
  ('PD174','2023-08-01','SV0074','HK1_2023', true),  
  ('PD175','2023-08-01','SV0075','HK1_2023', true),
  ('PD176','2023-08-01','SV0076','HK1_2023', true),
  ('PD177','2023-08-01','SV0077','HK1_2023', true),
  ('PD178','2023-08-01','SV0078','HK1_2023', true),
  ('PD179','2023-08-01','SV0079','HK1_2023', true),
  ('PD180','2023-08-01','SV0080','HK1_2023', true),
  ('PD181','2023-08-01','SV0081','HK1_2023', true),
  ('PD182','2023-08-01','SV0082','HK1_2023', true),
  ('PD183','2023-08-01','SV0083','HK1_2023', true),
  ('PD184','2023-08-01','SV0084','HK1_2023', true),
  ('PD185','2023-08-01','SV0085','HK1_2023', true),
  ('PD186','2023-08-01','SV0086','HK1_2023', true),
  ('PD187','2023-08-01','SV0087','HK1_2023', true),
  ('PD188','2023-08-01','SV0088','HK1_2023', true),
  ('PD189','2023-08-01','SV0089','HK1_2023', true),
  ('PD190','2023-08-01','SV0090','HK1_2023', true),
  ('PD191','2023-08-01','SV0091','HK1_2023', true),
  ('PD192','2023-08-01','SV0092','HK1_2023', true),
  ('PD193','2023-08-01','SV0093','HK1_2023', true),
  ('PD194','2023-08-01','SV0094','HK1_2023', true),
  ('PD195','2023-08-01','SV0095','HK1_2023', true),
  ('PD196','2023-08-01','SV0096','HK1_2023', true),
  ('PD197','2023-08-01','SV0097','HK1_2023', true),
  ('PD198','2023-08-01','SV0098','HK1_2023', true),
  ('PD199','2023-08-01','SV0099','HK1_2023', true),
  ('PD200','2023-08-01','SV0100','HK1_2023', true);

-- Thêm 100 phiếu đăng ký cho HK2_2023 (đồng bộ ngày với ngày bắt đầu học kỳ)
INSERT INTO PHIEUDANGKY (MaPhieuDangKy, NgayLap, MaSoSinhVien, MaHocKy, XacNhan) VALUES
  ('PD201','2024-01-15','SV0001','HK2_2023', true),
  ('PD202','2024-01-15','SV0002','HK2_2023', true),  
  ('PD203','2024-01-15','SV0003','HK2_2023', true),
  ('PD204','2024-01-15','SV0004','HK2_2023', true),
  ('PD205','2024-01-15','SV0005','HK2_2023', true),
  ('PD206','2024-01-15','SV0006','HK2_2023', true),
  ('PD207','2024-01-15','SV0007','HK2_2023', true),
  ('PD208','2024-01-15','SV0008','HK2_2023', true),
  ('PD209','2024-01-15','SV0009','HK2_2023', true),
  ('PD210','2024-01-15','SV0010','HK2_2023', true),
  ('PD211','2024-01-15','SV0011','HK2_2023', true),
  ('PD212','2024-01-15','SV0012','HK2_2023', true),
  ('PD213','2024-01-15','SV0013','HK2_2023', true),
  ('PD214','2024-01-15','SV0014','HK2_2023', true),
  ('PD215','2024-01-15','SV0015','HK2_2023', true),  
  ('PD216','2024-01-15','SV0016','HK2_2023', true),
  ('PD217','2024-01-15','SV0017','HK2_2023', true),
  ('PD218','2024-01-15','SV0018','HK2_2023', true),
  ('PD219','2024-01-15','SV0019','HK2_2023', true),
  ('PD220','2024-01-15','SV0020','HK2_2023', true),
  ('PD221','2024-01-15','SV0021','HK2_2023', true),
  ('PD222','2024-01-15','SV0022','HK2_2023', true),
  ('PD223','2024-01-15','SV0023','HK2_2023', true),
  ('PD224','2024-01-15','SV0024','HK2_2023', true),
  ('PD225','2024-01-15','SV0025','HK2_2023', true),
  ('PD226','2024-01-15','SV0026','HK2_2023', true),
  ('PD227','2024-01-15','SV0027','HK2_2023', true),
  ('PD228','2024-01-15','SV0028','HK2_2023', true),
  ('PD229','2024-01-15','SV0029','HK2_2023', true),
  ('PD230','2024-01-15','SV0030','HK2_2023', true),  
  ('PD231','2024-01-15','SV0031','HK2_2023', true),
  ('PD232','2024-01-15','SV0032','HK2_2023', true),
  ('PD233','2024-01-15','SV0033','HK2_2023', true),
  ('PD234','2024-01-15','SV0034','HK2_2023', true),
  ('PD235','2024-01-15','SV0035','HK2_2023', true),
  ('PD236','2024-01-15','SV0036','HK2_2023', true),
  ('PD237','2024-01-15','SV0037','HK2_2023', true),
  ('PD238','2024-01-15','SV0038','HK2_2023', true),
  ('PD239','2024-01-15','SV0039','HK2_2023', true),
  ('PD240','2024-01-15','SV0040','HK2_2023', true),
  ('PD241','2024-01-15','SV0041','HK2_2023', true),
  ('PD242','2024-01-15','SV0042','HK2_2023', true),
  ('PD243','2024-01-15','SV0043','HK2_2023', true),
  ('PD244','2024-01-15','SV0044','HK2_2023', true),
  ('PD245','2024-01-15','SV0045','HK2_2023', true),  
  ('PD246','2024-01-15','SV0046','HK2_2023', true),
  ('PD247','2024-01-15','SV0047','HK2_2023', true),
  ('PD248','2024-01-15','SV0048','HK2_2023', true),
  ('PD249','2024-01-15','SV0049','HK2_2023', true),
  ('PD250','2024-01-15','SV0050','HK2_2023', true),
  ('PD251','2024-01-15','SV0051','HK2_2023', true),
  ('PD252','2024-01-15','SV0052','HK2_2023', true),
  ('PD253','2024-01-15','SV0053','HK2_2023', true),
  ('PD254','2024-01-15','SV0054','HK2_2023', true),
  ('PD255','2024-01-15','SV0055','HK2_2023', true),
  ('PD256','2024-01-15','SV0056','HK2_2023', true),
  ('PD257','2024-01-15','SV0057','HK2_2023', true),
  ('PD258','2024-01-15','SV0058','HK2_2023', true),
  ('PD259','2024-01-15','SV0059','HK2_2023', true),
  ('PD260','2024-01-15','SV0060','HK2_2023', true),  
  ('PD261','2024-01-15','SV0061','HK2_2023', true),
  ('PD262','2024-01-15','SV0062','HK2_2023', true),
  ('PD263','2024-01-15','SV0063','HK2_2023', true),
  ('PD264','2024-01-15','SV0064','HK2_2023', true),
  ('PD265','2024-01-15','SV0065','HK2_2023', true),
  ('PD266','2024-01-15','SV0066','HK2_2023', true),
  ('PD267','2024-01-15','SV0067','HK2_2023', true),
  ('PD268','2024-01-15','SV0068','HK2_2023', true),
  ('PD269','2024-01-15','SV0069','HK2_2023', true),
  ('PD270','2024-01-15','SV0070','HK2_2023', true),
  ('PD271','2024-01-15','SV0071','HK2_2023', true),
  ('PD272','2024-01-15','SV0072','HK2_2023', true), 
  ('PD273','2024-01-15','SV0073','HK2_2023', true),
  ('PD274','2024-01-15','SV0074','HK2_2023', true),
  ('PD275','2024-01-15','SV0075','HK2_2023', true),
  ('PD276','2024-01-15','SV0076','HK2_2023', true),
  ('PD277','2024-01-15','SV0077','HK2_2023', true),
  ('PD278','2024-01-15','SV0078','HK2_2023', true),
  ('PD279','2024-01-15','SV0079','HK2_2023', true),
  ('PD280','2024-01-15','SV0080','HK2_2023', true),
  ('PD281','2024-01-15','SV0081','HK2_2023', true),
  ('PD282','2024-01-15','SV0082','HK2_2023', true),
  ('PD283','2024-01-15','SV0083','HK2_2023', true),
  ('PD284','2024-01-15','SV0084','HK2_2023', true),
  ('PD285','2024-01-15','SV0085','HK2_2023', true),
  ('PD286','2024-01-15','SV0086','HK2_2023', true),
  ('PD287','2024-01-15','SV0087','HK2_2023', true),
  ('PD288','2024-01-15','SV0088','HK2_2023', true),
  ('PD289','2024-01-15','SV0089','HK2_2023', true),
  ('PD290','2024-01-15','SV0090','HK2_2023', true),
  ('PD291','2024-01-15','SV0091','HK2_2023', true),
  ('PD292','2024-01-15','SV0092','HK2_2023', true),
  ('PD293','2024-01-15','SV0093','HK2_2023', true),
  ('PD294','2024-01-15','SV0094','HK2_2023', true),
  ('PD295','2024-01-15','SV0095','HK2_2023', true),
  ('PD296','2024-01-15','SV0096','HK2_2023', true),
  ('PD297','2024-01-15','SV0097','HK2_2023', true),
  ('PD298','2024-01-15','SV0098','HK2_2023', true),
  ('PD299','2024-01-15','SV0099','HK2_2023', true),
  ('PD300','2024-01-15','SV0100','HK2_2023', true);

INSERT INTO CT_PHIEUDANGKY (MaPhieuDangKy, MaHocKy, MaMonHoc) VALUES
  -- Chi tiết đăng ký cho HK1_2024 (PD001-PD100)
  -- Chi tiết đăng ký cho HK1_2023 (PD101-PD200)
  ('PD101','HK1_2023','GD002'),
  ('PD101','HK1_2023','BCH058'),
  ('PD101','HK1_2023','BUS1125'),
  
  ('PD102','HK1_2023','LTU101'),
  ('PD102','HK1_2023','SS003'),
  ('PD102','HK1_2023','IT101'),
  
  ('PD103','HK1_2023','MKT101'),
  ('PD103','HK1_2023','SE101'),
  ('PD103','HK1_2023','QC101'),
  
  ('PD104','HK1_2023','LTU201'),
  ('PD104','HK1_2023','SS006'),
  ('PD104','HK1_2023','IT201'),
  
  ('PD105','HK1_2023','CE118'),
  ('PD105','HK1_2023','EE214'),
  ('PD105','HK1_2023','AI001'),
  
  ('PD106','HK1_2023','GD002'),
  ('PD106','HK1_2023','BCH058'),
  ('PD106','HK1_2023','BUS1125'),
  
  ('PD107','HK1_2023','LTU101'),
  ('PD107','HK1_2023','SS003'),
  ('PD107','HK1_2023','IT101'),
  
  ('PD108','HK1_2023','MKT101'),
  ('PD108','HK1_2023','SE101'),
  ('PD108','HK1_2023','QC101'),
  
  ('PD109','HK1_2023','LTU201'),
  ('PD109','HK1_2023','SS006'),
  ('PD109','HK1_2023','IT201'),
  
  ('PD110','HK1_2023','CE118'),
  ('PD110','HK1_2023','EE214'),
  ('PD110','HK1_2023','AI001'),
  
  ('PD111','HK1_2023','GD002'),
  ('PD111','HK1_2023','BCH058'),
  ('PD111','HK1_2023','BUS1125'),
  
  ('PD112','HK1_2023','LTU101'),
  ('PD112','HK1_2023','SS003'),
  ('PD112','HK1_2023','IT101'),
  
  ('PD113','HK1_2023','MKT101'),
  ('PD113','HK1_2023','SE101'),
  ('PD113','HK1_2023','QC101'),
  
  ('PD114','HK1_2023','LTU201'),
  ('PD114','HK1_2023','SS006'),
  ('PD114','HK1_2023','IT201'),
  
  ('PD115','HK1_2023','CE118'),
  ('PD115','HK1_2023','EE214'),
  ('PD115','HK1_2023','AI001'),
  
  ('PD116','HK1_2023','GD002'),
  ('PD116','HK1_2023','BCH058'),
  ('PD116','HK1_2023','BUS1125'),
  
  ('PD117','HK1_2023','LTU101'),
  ('PD117','HK1_2023','SS003'),
  ('PD117','HK1_2023','IT101'),
  
  ('PD118','HK1_2023','MKT101'),
  ('PD118','HK1_2023','SE101'),
  ('PD118','HK1_2023','QC101'),
  
  ('PD119','HK1_2023','LTU201'),
  ('PD119','HK1_2023','SS006'),
  ('PD119','HK1_2023','IT201'),
  
  ('PD120','HK1_2023','CE118'),
  ('PD120','HK1_2023','EE214'),
  ('PD120','HK1_2023','AI001'),
  
  ('PD121','HK1_2023','GD002'),
  ('PD121','HK1_2023','BCH058'),
  ('PD121','HK1_2023','BUS1125'),
  
  ('PD122','HK1_2023','LTU101'),
  ('PD122','HK1_2023','SS003'),
  ('PD122','HK1_2023','IT101'),
  
  ('PD123','HK1_2023','MKT101'),
  ('PD123','HK1_2023','SE101'),
  ('PD123','HK1_2023','QC101'),
  
  ('PD124','HK1_2023','LTU201'),
  ('PD124','HK1_2023','SS006'),
  ('PD124','HK1_2023','IT201'),
  
  ('PD125','HK1_2023','CE118'),
  ('PD125','HK1_2023','EE214'),
  ('PD125','HK1_2023','AI001'),
  
  ('PD126','HK1_2023','GD002'),
  ('PD126','HK1_2023','BCH058'),
  ('PD126','HK1_2023','BUS1125'),
  
  ('PD127','HK1_2023','LTU101'),
  ('PD127','HK1_2023','SS003'),
  ('PD127','HK1_2023','IT101'),
  
  ('PD128','HK1_2023','MKT101'),
  ('PD128','HK1_2023','SE101'),
  ('PD128','HK1_2023','QC101'),
  
  ('PD129','HK1_2023','LTU201'),
  ('PD129','HK1_2023','SS006'),
  ('PD129','HK1_2023','IT201'),
  
  ('PD130','HK1_2023','CE118'),
  ('PD130','HK1_2023','EE214'),
  ('PD130','HK1_2023','AI001'),
  
  ('PD131','HK1_2023','GD002'),
  ('PD131','HK1_2023','BCH058'),
  ('PD131','HK1_2023','BUS1125'),
  
  ('PD132','HK1_2023','LTU101'),
  ('PD132','HK1_2023','SS003'),
  ('PD132','HK1_2023','IT101'),
  
  ('PD133','HK1_2023','MKT101'),
  ('PD133','HK1_2023','SE101'),
  ('PD133','HK1_2023','QC101'),
  
  ('PD134','HK1_2023','LTU201'),
  ('PD134','HK1_2023','SS006'),
  ('PD134','HK1_2023','IT201'),
  
  ('PD135','HK1_2023','CE118'),
  ('PD135','HK1_2023','EE214'),
  ('PD135','HK1_2023','AI001'),
  
  ('PD136','HK1_2023','GD002'),
  ('PD136','HK1_2023','BCH058'),
  ('PD136','HK1_2023','BUS1125'),
  
  ('PD137','HK1_2023','LTU101'),
  ('PD137','HK1_2023','SS003'),
  ('PD137','HK1_2023','IT101'),
  
  ('PD138','HK1_2023','MKT101'),
  ('PD138','HK1_2023','SE101'),
  ('PD138','HK1_2023','QC101'),
  
  ('PD139','HK1_2023','LTU201'),
  ('PD139','HK1_2023','SS006'),
  ('PD139','HK1_2023','IT201'),
  
  ('PD140','HK1_2023','CE118'),
  ('PD140','HK1_2023','EE214'),
  ('PD140','HK1_2023','AI001'),
  
  ('PD141','HK1_2023','GD002'),
  ('PD141','HK1_2023','BCH058'),
  ('PD141','HK1_2023','BUS1125'),
  
  ('PD142','HK1_2023','LTU101'),
  ('PD142','HK1_2023','SS003'),
  ('PD142','HK1_2023','IT101'),
  
  ('PD143','HK1_2023','MKT101'),
  ('PD143','HK1_2023','SE101'),
  ('PD143','HK1_2023','QC101'),
  
  ('PD144','HK1_2023','LTU201'),
  ('PD144','HK1_2023','SS006'),
  ('PD144','HK1_2023','IT201'),
  
  ('PD145','HK1_2023','CE118'),
  ('PD145','HK1_2023','EE214'),
  ('PD145','HK1_2023','AI001'),
  
  ('PD146','HK1_2023','GD002'),
  ('PD146','HK1_2023','BCH058'),
  ('PD146','HK1_2023','BUS1125'),
  
  ('PD147','HK1_2023','LTU101'),
  ('PD147','HK1_2023','SS003'),
  ('PD147','HK1_2023','IT101'),
  
  ('PD148','HK1_2023','MKT101'),
  ('PD148','HK1_2023','SE101'),
  ('PD148','HK1_2023','QC101'),
  
  ('PD149','HK1_2023','LTU201'),
  ('PD149','HK1_2023','SS006'),
  ('PD149','HK1_2023','IT201'),
  
  ('PD150','HK1_2023','CE118'),
  ('PD150','HK1_2023','EE214'),
  ('PD150','HK1_2023','AI001'),
  
  ('PD151','HK1_2023','GD002'),
  ('PD151','HK1_2023','BCH058'),
  ('PD151','HK1_2023','BUS1125'),
  
  ('PD152','HK1_2023','LTU101'),
  ('PD152','HK1_2023','SS003'),
  ('PD152','HK1_2023','IT101'),
  
  ('PD153','HK1_2023','MKT101'),
  ('PD153','HK1_2023','SE101'),
  ('PD153','HK1_2023','QC101'),
  
  ('PD154','HK1_2023','LTU201'),
  ('PD154','HK1_2023','SS006'),
  ('PD154','HK1_2023','IT201'),
  
  ('PD155','HK1_2023','CE118'),
  ('PD155','HK1_2023','EE214'),
  ('PD155','HK1_2023','AI001'),
  
  ('PD156','HK1_2023','GD002'),
  ('PD156','HK1_2023','BCH058'),
  ('PD156','HK1_2023','BUS1125'),
  
  ('PD157','HK1_2023','LTU101'),
  ('PD157','HK1_2023','SS003'),
  ('PD157','HK1_2023','IT101'),
  
  ('PD158','HK1_2023','MKT101'),
  ('PD158','HK1_2023','SE101'),
  ('PD158','HK1_2023','QC101'),
  
  ('PD159','HK1_2023','LTU201'),
  ('PD159','HK1_2023','SS006'),
  ('PD159','HK1_2023','IT201'),
  
  ('PD160','HK1_2023','CE118'),
  ('PD160','HK1_2023','EE214'),
  ('PD160','HK1_2023','AI001'),
  
  ('PD161','HK1_2023','GD002'),
  ('PD161','HK1_2023','BCH058'),
  ('PD161','HK1_2023','BUS1125'),
  
  ('PD162','HK1_2023','LTU101'),
  ('PD162','HK1_2023','SS003'),
  ('PD162','HK1_2023','IT101'),
  
  ('PD163','HK1_2023','MKT101'),
  ('PD163','HK1_2023','SE101'),
  ('PD163','HK1_2023','QC101'),
  
  ('PD164','HK1_2023','LTU201'),
  ('PD164','HK1_2023','SS006'),
  ('PD164','HK1_2023','IT201'),
  
  ('PD165','HK1_2023','CE118'),
  ('PD165','HK1_2023','EE214'),
  ('PD165','HK1_2023','AI001'),
  
  ('PD166','HK1_2023','GD002'),
  ('PD166','HK1_2023','BCH058'),
  ('PD166','HK1_2023','BUS1125'),
  
  ('PD167','HK1_2023','LTU101'),
  ('PD167','HK1_2023','SS003'),
  ('PD167','HK1_2023','IT101'),
  
  ('PD168','HK1_2023','MKT101'),
  ('PD168','HK1_2023','SE101'),
  ('PD168','HK1_2023','QC101'),
  
  ('PD169','HK1_2023','LTU201'),
  ('PD169','HK1_2023','SS006'),
  ('PD169','HK1_2023','IT201'),
  
  ('PD170','HK1_2023','CE118'),
  ('PD170','HK1_2023','EE214'),
  ('PD170','HK1_2023','AI001'),
  
  ('PD171','HK1_2023','GD002'),
  ('PD171','HK1_2023','BCH058'),
  ('PD171','HK1_2023','BUS1125'),
  
  ('PD172','HK1_2023','LTU101'),
  ('PD172','HK1_2023','SS003'),
  ('PD172','HK1_2023','IT101'),
  
  ('PD173','HK1_2023','MKT101'),
  ('PD173','HK1_2023','SE101'),
  ('PD173','HK1_2023','QC101'),
  
  ('PD174','HK1_2023','LTU201'),
  ('PD174','HK1_2023','SS006'),
  ('PD174','HK1_2023','IT201'),
  
  ('PD175','HK1_2023','CE118'),
  ('PD175','HK1_2023','EE214'),
  ('PD175','HK1_2023','AI001'),
  
  ('PD176','HK1_2023','GD002'),
  ('PD176','HK1_2023','BCH058'),
  ('PD176','HK1_2023','BUS1125'),
  
  ('PD177','HK1_2023','LTU101'),
  ('PD177','HK1_2023','SS003'),
  ('PD177','HK1_2023','IT101'),
  
  ('PD178','HK1_2023','MKT101'),
  ('PD178','HK1_2023','SE101'),
  ('PD178','HK1_2023','QC101'),
  
  ('PD179','HK1_2023','LTU201'),
  ('PD179','HK1_2023','SS006'),
  ('PD179','HK1_2023','IT201'),
  
  ('PD180','HK1_2023','CE118'),
  ('PD180','HK1_2023','EE214'),
  ('PD180','HK1_2023','AI001'),
  
  ('PD181','HK1_2023','GD002'),
  ('PD181','HK1_2023','BCH058'),
  ('PD181','HK1_2023','BUS1125'),
  
  ('PD182','HK1_2023','LTU101'),
  ('PD182','HK1_2023','SS003'),
  ('PD182','HK1_2023','IT101'),
  
  ('PD183','HK1_2023','MKT101'),
  ('PD183','HK1_2023','SE101'),
  ('PD183','HK1_2023','QC101'),
  
  ('PD184','HK1_2023','LTU201'),
  ('PD184','HK1_2023','SS006'),
  ('PD184','HK1_2023','IT201'),
  
  ('PD185','HK1_2023','CE118'),
  ('PD185','HK1_2023','EE214'),
  ('PD185','HK1_2023','AI001'),
  
  ('PD186','HK1_2023','GD002'),
  ('PD186','HK1_2023','BCH058'),
  ('PD186','HK1_2023','BUS1125'),
  
  ('PD187','HK1_2023','LTU101'),
  ('PD187','HK1_2023','SS003'),
  ('PD187','HK1_2023','IT101'),
  
  ('PD188','HK1_2023','MKT101'),
  ('PD188','HK1_2023','SE101'),
  ('PD188','HK1_2023','QC101'),
  
  ('PD189','HK1_2023','LTU201'),
  ('PD189','HK1_2023','SS006'),
  ('PD189','HK1_2023','IT201'),
  
  ('PD190','HK1_2023','CE118'),
  ('PD190','HK1_2023','EE214'),
  ('PD190','HK1_2023','AI001'),
  
  ('PD191','HK1_2023','GD002'),
  ('PD191','HK1_2023','BCH058'),
  ('PD191','HK1_2023','BUS1125'),
  
  ('PD192','HK1_2023','LTU101'),
  ('PD192','HK1_2023','SS003'),
  ('PD192','HK1_2023','IT101'),
  
  ('PD193','HK1_2023','MKT101'),
  ('PD193','HK1_2023','SE101'),
  ('PD193','HK1_2023','QC101'),
  
  ('PD194','HK1_2023','LTU201'),
  ('PD194','HK1_2023','SS006'),
  ('PD194','HK1_2023','IT201'),
  
  ('PD195','HK1_2023','CE118'),
  ('PD195','HK1_2023','EE214'),
  ('PD195','HK1_2023','AI001'),
  
  ('PD196','HK1_2023','GD002'),
  ('PD196','HK1_2023','BCH058'),
  ('PD196','HK1_2023','BUS1125'),
  
  ('PD197','HK1_2023','LTU101'),
  ('PD197','HK1_2023','SS003'),
  ('PD197','HK1_2023','IT101'),
  
  ('PD198','HK1_2023','MKT101'),
  ('PD198','HK1_2023','SE101'),
  ('PD198','HK1_2023','QC101'),
  
  ('PD199','HK1_2023','LTU201'),
  ('PD199','HK1_2023','SS006'),
  ('PD199','HK1_2023','IT201'),
  
  ('PD200','HK1_2023','CE118'),
  ('PD200','HK1_2023','EE214'),
  ('PD200','HK1_2023','AI001'),

  -- Chi tiết đăng ký cho HK2_2023 (PD201-PD300)
  ('PD201','HK2_2023','GD001'),
  ('PD201','HK2_2023','GD002'),
  ('PD201','HK2_2023','BCH058'),
  
  ('PD202','HK2_2023','LTU101'),
  ('PD202','HK2_2023','IT101'),
  ('PD202','HK2_2023','CS101'),
  
  ('PD203','HK2_2023','LTU202'),
  ('PD203','HK2_2023','SS007'),
  ('PD203','HK2_2023','IT301'),
  
  ('PD204','HK2_2023','CE213'),
  ('PD204','HK2_2023','EE216'),
  ('PD204','HK2_2023','AI002'),
  
  ('PD205','HK2_2023','GD001'),
  ('PD205','HK2_2023','GD002'),
  ('PD205','HK2_2023','BCH058'),
  
  ('PD206','HK2_2023','LTU101'),
  ('PD206','HK2_2023','IT101'),
  ('PD206','HK2_2023','CS101'),
  
  ('PD207','HK2_2023','LTU202'),
  ('PD207','HK2_2023','SS007'),
  ('PD207','HK2_2023','IT301'),
  
  ('PD208','HK2_2023','CE213'),
  ('PD208','HK2_2023','EE216'),
  ('PD208','HK2_2023','AI002'),
  
  ('PD209','HK2_2023','GD001'),
  ('PD209','HK2_2023','GD002'),
   ('PD209','HK2_2023','BCH058'),
  
  ('PD210','HK2_2023','LTU101'),
  ('PD210','HK2_2023','IT101'),
  ('PD210','HK2_2023','CS101'),
  
  ('PD211','HK2_2023','LTU202'),
  ('PD211','HK2_2023','SS007'),
  ('PD211','HK2_2023','IT301'),
  
  ('PD212','HK2_2023','CE213'),
  ('PD212','HK2_2023','EE216'),
  ('PD212','HK2_2023','AI002'),
  
  ('PD213','HK2_2023','GD001'),
  ('PD213','HK2_2023','GD002'),
  ('PD213','HK2_2023','BCH058'),
  
  ('PD214','HK2_2023','LTU101'),
  ('PD214','HK2_2023','IT101'),
  ('PD214','HK2_2023','CS101'),
  
  ('PD215','HK2_2023','LTU202'),
  ('PD215','HK2_2023','SS007'),
  ('PD215','HK2_2023','IT301'),
  
  ('PD216','HK2_2023','CE213'),
  ('PD216','HK2_2023','EE216'),
  ('PD216','HK2_2023','AI002'),
  
  ('PD217','HK2_2023','GD001'),
  ('PD217','HK2_2023','GD002'),
  ('PD217','HK2_2023','BCH058'),
  
  ('PD218','HK2_2023','LTU101'),
  ('PD218','HK2_2023','IT101'),
  ('PD218','HK2_2023','CS101'),
  
  ('PD219','HK2_2023','LTU202'),
  ('PD219','HK2_2023','SS007'),
  ('PD219','HK2_2023','IT301'),
  
  ('PD220','HK2_2023','CE213'),
  ('PD220','HK2_2023','EE216'),
  ('PD220','HK2_2023','AI002'),
  
  ('PD221','HK2_2023','GD001'),
  ('PD221','HK2_2023','GD002'),
  ('PD221','HK2_2023','BCH058'),
  
  ('PD222','HK2_2023','LTU101'),
  ('PD222','HK2_2023','IT101'),
  ('PD222','HK2_2023','CS101'),
  
  ('PD223','HK2_2023','LTU202'),
  ('PD223','HK2_2023','SS007'),
  ('PD223','HK2_2023','IT301'),
  
  ('PD224','HK2_2023','CE213'),
  ('PD224','HK2_2023','EE216'),
  ('PD224','HK2_2023','AI002'),
  
  ('PD225','HK2_2023','GD001'),
  ('PD225','HK2_2023','GD002'),
  ('PD225','HK2_2023','BCH058'),
  
  ('PD226','HK2_2023','LTU101'),
  ('PD226','HK2_2023','IT101'),
  ('PD226','HK2_2023','CS101'),
  
  ('PD227','HK2_2023','LTU202'),
  ('PD227','HK2_2023','SS007'),
  ('PD227','HK2_2023','IT301'),
  
  ('PD228','HK2_2023','CE213'),
  ('PD228','HK2_2023','EE216'),
  ('PD228','HK2_2023','AI002'),
  
  ('PD229','HK2_2023','GD001'),
  ('PD229','HK2_2023','GD002'),
  ('PD229','HK2_2023','BCH058'),
  
  ('PD230','HK2_2023','LTU101'),
  ('PD230','HK2_2023','IT101'),
  ('PD230','HK2_2023','CS101'),
  
  ('PD231','HK2_2023','LTU202'),
  ('PD231','HK2_2023','SS007'),
  ('PD231','HK2_2023','IT301'),
  
  ('PD232','HK2_2023','CE213'),
  ('PD232','HK2_2023','EE216'),
  ('PD232','HK2_2023','AI002'),
  
  ('PD233','HK2_2023','GD001'),
  ('PD233','HK2_2023','GD002'),
  ('PD233','HK2_2023','BCH058'),
  
  ('PD234','HK2_2023','LTU101'),
  ('PD234','HK2_2023','IT101'),
  ('PD234','HK2_2023','CS101'),
  
  ('PD235','HK2_2023','LTU202'),
  ('PD235','HK2_2023','SS007'),
  ('PD235','HK2_2023','IT301'),
  
  ('PD236','HK2_2023','CE213'),
  ('PD236','HK2_2023','EE216'),
  ('PD236','HK2_2023','AI002'),
  
  ('PD237','HK2_2023','GD001'),
  ('PD237','HK2_2023','GD002'),
  ('PD237','HK2_2023','BCH058'),
  
  ('PD238','HK2_2023','LTU101'),
  ('PD238','HK2_2023','IT101'),
  ('PD238','HK2_2023','CS101'),
  
  ('PD239','HK2_2023','LTU202'),
  ('PD239','HK2_2023','SS007'),
  ('PD239','HK2_2023','IT301'),
  
  ('PD240','HK2_2023','CE213'),
  ('PD240','HK2_2023','EE216'),
  ('PD240','HK2_2023','AI002'),
  
  ('PD241','HK2_2023','GD001'),
  ('PD241','HK2_2023','GD002'),
  ('PD241','HK2_2023','BCH058'),
  
  ('PD242','HK2_2023','LTU101'),
  ('PD242','HK2_2023','IT101'),
  ('PD242','HK2_2023','CS101'),
  
  ('PD243','HK2_2023','LTU202'),
  ('PD243','HK2_2023','SS007'),
  ('PD243','HK2_2023','IT301'),
  
  ('PD244','HK2_2023','CE213'),
  ('PD244','HK2_2023','EE216'),
  ('PD244','HK2_2023','AI002'),
  
  ('PD245','HK2_2023','GD001'),
  ('PD245','HK2_2023','GD002'),
  ('PD245','HK2_2023','BCH058'),
  
  ('PD246','HK2_2023','LTU101'),
  ('PD246','HK2_2023','IT101'),
  ('PD246','HK2_2023','CS101'),
  
  ('PD247','HK2_2023','LTU202'),
  ('PD247','HK2_2023','SS007'),
  ('PD247','HK2_2023','IT301'),
  
  ('PD248','HK2_2023','CE213'),
  ('PD248','HK2_2023','EE216'),
  ('PD248','HK2_2023','AI002'),
  
  ('PD249','HK2_2023','GD001'),
  ('PD249','HK2_2023','GD002'),
  ('PD249','HK2_2023','BCH058'),
  
  ('PD250','HK2_2023','LTU101'),
  ('PD250','HK2_2023','IT101'),
  ('PD250','HK2_2023','CS101'),
  
  ('PD251','HK2_2023','LTU202'),
  ('PD251','HK2_2023','SS007'),
  ('PD251','HK2_2023','IT301'),
  
  ('PD252','HK2_2023','CE213'),
  ('PD252','HK2_2023','EE216'),
  ('PD252','HK2_2023','AI002'),
  
  ('PD253','HK2_2023','GD001'),
  ('PD253','HK2_2023','GD002'),
  ('PD253','HK2_2023','BCH058'),
  
  ('PD254','HK2_2023','LTU101'),
  ('PD254','HK2_2023','IT101'),
  ('PD254','HK2_2023','CS101'),
  
  ('PD255','HK2_2023','LTU202'),
  ('PD255','HK2_2023','SS007'),
  ('PD255','HK2_2023','IT301'),
  
  ('PD256','HK2_2023','CE213'),
  ('PD256','HK2_2023','EE216'),
  ('PD256','HK2_2023','AI002'),
  
  ('PD257','HK2_2023','GD001'),
  ('PD257','HK2_2023','GD002'),
  ('PD257','HK2_2023','BCH058'),
  
  ('PD258','HK2_2023','LTU101'),
  ('PD258','HK2_2023','IT101'),
  ('PD258','HK2_2023','CS101'),
  
  ('PD259','HK2_2023','LTU202'),
  ('PD259','HK2_2023','SS007'),
  ('PD259','HK2_2023','IT301'),
  
  ('PD260','HK2_2023','CE213'),
  ('PD260','HK2_2023','EE216'),
  ('PD260','HK2_2023','AI002'),
  
  ('PD261','HK2_2023','GD001'),
  ('PD261','HK2_2023','GD002'),
  ('PD261','HK2_2023','BCH058'),
  
  ('PD262','HK2_2023','LTU101'),
  ('PD262','HK2_2023','IT101'),
  ('PD262','HK2_2023','CS101'),
  
  ('PD263','HK2_2023','LTU202'),
  ('PD263','HK2_2023','SS007'),
  ('PD263','HK2_2023','IT301'),
  
  ('PD264','HK2_2023','CE213'),
  ('PD264','HK2_2023','EE216'),
  ('PD264','HK2_2023','AI002'),
  
  ('PD265','HK2_2023','GD001'),
  ('PD265','HK2_2023','GD002'),
  ('PD265','HK2_2023','BCH058'),
  
  ('PD266','HK2_2023','LTU101'),
  ('PD266','HK2_2023','IT101'),
  ('PD266','HK2_2023','CS101'),
  
  ('PD267','HK2_2023','LTU202'),
  ('PD267','HK2_2023','SS007'),
  ('PD267','HK2_2023','IT301'),
  
  ('PD268','HK2_2023','CE213'),
  ('PD268','HK2_2023','EE216'),
  ('PD268','HK2_2023','AI002'),
  
  ('PD269','HK2_2023','GD001'),
  ('PD269','HK2_2023','GD002'),
  ('PD269','HK2_2023','BCH058'),
  
  ('PD270','HK2_2023','LTU101'),
  ('PD270','HK2_2023','IT101'),
  ('PD270','HK2_2023','CS101'),
  
  ('PD271','HK2_2023','LTU202'),
  ('PD271','HK2_2023','SS007'),
  ('PD271','HK2_2023','IT301'),
  
  ('PD272','HK2_2023','CE213'),
  ('PD272','HK2_2023','EE216'),
  ('PD272','HK2_2023','AI002'),
  
  ('PD273','HK2_2023','GD001'),
  ('PD273','HK2_2023','GD002'),
  ('PD273','HK2_2023','BCH058'),
  
  ('PD274','HK2_2023','LTU101'),
  ('PD274','HK2_2023','IT101'),
  ('PD274','HK2_2023','CS101'),
  
  ('PD275','HK2_2023','LTU202'),
  ('PD275','HK2_2023','SS007'),
  ('PD275','HK2_2023','IT301'),
  
  ('PD276','HK2_2023','CE213'),
  ('PD276','HK2_2023','EE216'),
  ('PD276','HK2_2023','AI002'),
  
  ('PD277','HK2_2023','GD001'),
  ('PD277','HK2_2023','GD002'),
  ('PD277','HK2_2023','BCH058'),
  
  ('PD278','HK2_2023','LTU101'),
  ('PD278','HK2_2023','IT101'),
  ('PD278','HK2_2023','CS101'),
  
  ('PD279','HK2_2023','LTU202'),
  ('PD279','HK2_2023','SS007'),
  ('PD279','HK2_2023','IT301'),
  
  ('PD280','HK2_2023','CE213'),
  ('PD280','HK2_2023','EE216'),
  ('PD280','HK2_2023','AI002'),
  
  ('PD281','HK2_2023','GD001'),
  ('PD281','HK2_2023','GD002'),
  ('PD281','HK2_2023','BCH058'),
  
  ('PD282','HK2_2023','LTU101'),
  ('PD282','HK2_2023','IT101'),
  ('PD282','HK2_2023','CS101'),
  
  ('PD283','HK2_2023','LTU202'),
  ('PD283','HK2_2023','SS007'),
  ('PD283','HK2_2023','IT301'),
  
  ('PD284','HK2_2023','CE213'),
  ('PD284','HK2_2023','EE216'),
  ('PD284','HK2_2023','AI002'),
  
  ('PD285','HK2_2023','GD001'),
  ('PD285','HK2_2023','GD002'),
  ('PD285','HK2_2023','BCH058'),
  
  ('PD286','HK2_2023','LTU101'),
  ('PD286','HK2_2023','IT101'),
  ('PD286','HK2_2023','CS101'),
  
  ('PD287','HK2_2023','LTU202'),
  ('PD287','HK2_2023','SS007'),
  ('PD287','HK2_2023','IT301'),
  
  ('PD288','HK2_2023','CE213'),
  ('PD288','HK2_2023','EE216'),
  ('PD288','HK2_2023','AI002'),
  
  ('PD289','HK2_2023','GD001'),
  ('PD289','HK2_2023','GD002'),
  ('PD289','HK2_2023','BCH058'),
  
  ('PD290','HK2_2023','LTU101'),
  ('PD290','HK2_2023','IT101'),
  ('PD290','HK2_2023','CS101'),
  
  ('PD291','HK2_2023','LTU202'),
  ('PD291','HK2_2023','SS007'),
  ('PD291','HK2_2023','IT301'),
  
  ('PD292','HK2_2023','CE213'),
  ('PD292','HK2_2023','EE216'),
  ('PD292','HK2_2023','AI002'),
  
  ('PD293','HK2_2023','GD001'),
  ('PD293','HK2_2023','GD002'),
  ('PD293','HK2_2023','BCH058'),
  
  ('PD294','HK2_2023','LTU101'),
  ('PD294','HK2_2023','IT101'),
  ('PD294','HK2_2023','CS101'),
  
  ('PD295','HK2_2023','LTU202'),
  ('PD295','HK2_2023','SS007'),
  ('PD295','HK2_2023','IT301'),
  
  ('PD296','HK2_2023','CE213'),
  ('PD296','HK2_2023','EE216'),
  ('PD296','HK2_2023','AI002'),
  
  ('PD297','HK2_2023','GD001'),
  ('PD297','HK2_2023','GD002'),
  ('PD297','HK2_2023','BCH058'),
  
  ('PD298','HK2_2023','LTU101'),
  ('PD298','HK2_2023','IT101'),
  ('PD298','HK2_2023','CS101'),
  
  ('PD299','HK2_2023','LTU202'),
  ('PD299','HK2_2023','SS007'),
  ('PD299','HK2_2023','IT301'),
  
  ('PD300','HK2_2023','CE213'),
  ('PD300','HK2_2023','EE216'),
  ('PD300','HK2_2023','AI002');

INSERT INTO PHIEUTHUHP (MaPhieuThu, NgayLap, MaPhieuDangKy, SoTienDong) VALUES
-- Phiếu thu cho HK1_2023 (PD101-PD200)
-- 50% sinh viên đóng 1 lần (50 sinh viên: SV0001-SV0050)
  ('PT001','2023-08-15','PD101',0),
  ('PT002','2023-08-15','PD102',0),
  ('PT003','2023-08-15','PD103',0),
  ('PT004','2023-08-15','PD104',0),
  ('PT005','2023-08-15','PD105',0),
  ('PT006','2023-08-15','PD106',0),
  ('PT007','2023-08-15','PD107',0),
  ('PT008','2023-08-15','PD108',0),
  ('PT009','2023-08-15','PD109',0),
  ('PT010','2023-08-15','PD110',0),
  ('PT011','2023-08-15','PD111',0),
  ('PT012','2023-08-15','PD112',0),
  ('PT013','2023-08-15','PD113',0),
  ('PT014','2023-08-15','PD114',0),
  ('PT015','2023-08-15','PD115',0),
  ('PT016','2023-08-15','PD116',0),
  ('PT017','2023-08-15','PD117',0),
  ('PT018','2023-08-15','PD118',0),
  ('PT019','2023-08-15','PD119',0),
  ('PT020','2023-08-15','PD120',0),
  ('PT021','2023-08-15','PD121',0),
  ('PT022','2023-08-15','PD122',0),
  ('PT023','2023-08-15','PD123',0),
  ('PT024','2023-08-15','PD124',0),
  ('PT025','2023-08-15','PD125',0),
  ('PT026','2023-08-15','PD126',0),
  ('PT027','2023-08-15','PD127',0),
  ('PT028','2023-08-15','PD128',0),
  ('PT029','2023-08-15','PD129',0),
  ('PT030','2023-08-15','PD130',0),
  ('PT031','2023-08-15','PD131',0),
  ('PT032','2023-08-15','PD132',0),
  ('PT033','2023-08-15','PD133',0),
  ('PT034','2023-08-15','PD134',0),
  ('PT035','2023-08-15','PD135',0),
  ('PT036','2023-08-15','PD136',0),
  ('PT037','2023-08-15','PD137',0),
  ('PT038','2023-08-15','PD138',0),
  ('PT039','2023-08-15','PD139',0),
  ('PT040','2023-08-15','PD140',0),
  ('PT041','2023-08-15','PD141',0),
  ('PT042','2023-08-15','PD142',0),
  ('PT043','2023-08-15','PD143',0),
  ('PT044','2023-08-15','PD144',0),
  ('PT045','2023-08-15','PD145',0),
  ('PT046','2023-08-15','PD146',0),
  ('PT047','2023-08-15','PD147',0),
  ('PT048','2023-08-15','PD148',0),
  ('PT049','2023-08-15','PD149',0),
  ('PT050','2023-08-15','PD150',0),
-- 15% sinh viên đóng 2 lần (15 sinh viên: SV0051-SV0065)
  ('PT051','2023-08-15','PD151',0),
  ('PT052','2023-09-15','PD151',0),
  ('PT053','2023-08-15','PD152',0),
  ('PT054','2023-09-15','PD152',0),
  ('PT055','2023-08-15','PD153',0),
  ('PT056','2023-09-15','PD153',0),
  ('PT057','2023-08-15','PD154',0),
  ('PT058','2023-09-15','PD154',0),
  ('PT059','2023-08-15','PD155',0),
  ('PT060','2023-09-15','PD155',0),
  ('PT061','2023-08-15','PD156',0),
  ('PT062','2023-09-15','PD156',0),
  ('PT063','2023-08-15','PD157',0),
  ('PT064','2023-09-15','PD157',0),
  ('PT065','2023-08-15','PD158',0),
  ('PT066','2023-09-15','PD158',0),
  ('PT067','2023-08-15','PD159',0),
  ('PT068','2023-09-15','PD159',0),
  ('PT069','2023-08-15','PD160',0),
  ('PT070','2023-09-15','PD160',0),
  ('PT071','2023-08-15','PD161',0),
  ('PT072','2023-09-15','PD161',0),
  ('PT073','2023-08-15','PD162',0),
  ('PT074','2023-09-15','PD162',0),
  ('PT075','2023-08-15','PD163',0),
  ('PT076','2023-09-15','PD163',0),
  ('PT077','2023-08-15','PD164',0),
  ('PT078','2023-09-15','PD164',0),
  ('PT079','2023-08-15','PD165',0),
  ('PT080','2023-09-15','PD165',0),
-- 15% sinh viên đóng 3 lần (15 sinh viên: SV0066-SV0080)
  ('PT081','2023-08-15','PD166',0),
  ('PT082','2023-09-15','PD166',0),
  ('PT083','2023-10-15','PD166',0),
  ('PT084','2023-08-15','PD167',0),
  ('PT085','2023-09-15','PD167',0),
  ('PT086','2023-10-15','PD167',0),
  ('PT087','2023-08-15','PD168',0),
  ('PT088','2023-09-15','PD168',0),
  ('PT089','2023-10-15','PD168',0),
  ('PT090','2023-08-15','PD169',0),
  ('PT091','2023-09-15','PD169',0),
  ('PT092','2023-10-15','PD169',0),
  ('PT093','2023-08-15','PD170',0),
  ('PT094','2023-09-15','PD170',0),
  ('PT095','2023-10-15','PD170',0),
  ('PT096','2023-08-15','PD171',0),
  ('PT097','2023-09-15','PD171',0),
  ('PT098','2023-10-15','PD171',0),
  ('PT099','2023-08-15','PD172',0),
  ('PT100','2023-09-15','PD172',0),
  ('PT101','2023-10-15','PD172',0),
  ('PT102','2023-08-15','PD173',0),
  ('PT103','2023-09-15','PD173',0),
  ('PT104','2023-10-15','PD173',0),
  ('PT105','2023-08-15','PD174',0),
  ('PT106','2023-09-15','PD174',0),
  ('PT107','2023-10-15','PD174',0),
  ('PT108','2023-08-15','PD175',0),
  ('PT109','2023-09-15','PD175',0),
  ('PT110','2023-10-15','PD175',0),
  ('PT111','2023-08-15','PD176',0),
  ('PT112','2023-09-15','PD176',0),
  ('PT113','2023-10-15','PD176',0),
  ('PT114','2023-08-15','PD177',0),
  ('PT115','2023-09-15','PD177',0),
  ('PT116','2023-10-15','PD177',0),
  ('PT117','2023-08-15','PD178',0),
  ('PT118','2023-09-15','PD178',0),
  ('PT119','2023-10-15','PD178',0),
  ('PT120','2023-08-15','PD179',0),
  ('PT121','2023-09-15','PD179',0),
  ('PT122','2023-10-15','PD179',0),
  ('PT123','2023-08-15','PD180',0),
  ('PT124','2023-09-15','PD180',0),
  ('PT125','2023-10-15','PD180',0),
-- 20% sinh viên chưa đóng (20 sinh viên: SV0081-SV0100) - không có phiếu thu

-- Phiếu thu cho HK2_2023 (PD201-PD300)
-- 50% sinh viên đóng 1 lần (50 sinh viên: SV0001-SV0050)
  ('PT201','2024-02-15','PD201',0),
  ('PT202','2024-02-15','PD202',0),
  ('PT203','2024-02-15','PD203',0),
  ('PT204','2024-02-15','PD204',0),
  ('PT205','2024-02-15','PD205',0),
  ('PT206','2024-02-15','PD206',0),
  ('PT207','2024-02-15','PD207',0),
  ('PT208','2024-02-15','PD208',0),
  ('PT209','2024-02-15','PD209',0),
  ('PT210','2024-02-15','PD210',0),
  ('PT211','2024-02-15','PD211',0),
  ('PT212','2024-02-15','PD212',0),
  ('PT213','2024-02-15','PD213',0),
  ('PT214','2024-02-15','PD214',0),
  ('PT215','2024-02-15','PD215',0),
  ('PT216','2024-02-15','PD216',0),
  ('PT217','2024-02-15','PD217',0),
  ('PT218','2024-02-15','PD218',0),
  ('PT219','2024-02-15','PD219',0),
  ('PT220','2024-02-15','PD220',0),
  ('PT221','2024-02-15','PD221',0),
  ('PT222','2024-02-15','PD222',0),
  ('PT223','2024-02-15','PD223',0),
  ('PT224','2024-02-15','PD224',0),
  ('PT225','2024-02-15','PD225',0),
  ('PT226','2024-02-15','PD226',0),
  ('PT227','2024-02-15','PD227',0),
  ('PT228','2024-02-15','PD228',0),
  ('PT229','2024-02-15','PD229',0),
  ('PT230','2024-02-15','PD230',0),
  ('PT231','2024-02-15','PD231',0),
  ('PT232','2024-02-15','PD232',0),
  ('PT233','2024-02-15','PD233',0),
  ('PT234','2024-02-15','PD234',0),
  ('PT235','2024-02-15','PD235',0),
  ('PT236','2024-02-15','PD236',0),
  ('PT237','2024-02-15','PD237',0),
  ('PT238','2024-02-15','PD238',0),
  ('PT239','2024-02-15','PD239',0),
  ('PT240','2024-02-15','PD240',0),
  ('PT241','2024-02-15','PD241',0),
  ('PT242','2024-02-15','PD242',0),
  ('PT243','2024-02-15','PD243',0),
  ('PT244','2024-02-15','PD244',0),
  ('PT245','2024-02-15','PD245',0),
  ('PT246','2024-02-15','PD246',0),
  ('PT247','2024-02-15','PD247',0),
  ('PT248','2024-02-15','PD248',0),
  ('PT249','2024-02-15','PD249',0),
  ('PT250','2024-02-15','PD250',0),
-- 15% sinh viên đóng 2 lần (15 sinh viên: SV0051-SV0065)
  ('PT251','2024-02-15','PD251',0),
  ('PT252','2024-03-15','PD251',0),
  ('PT253','2024-02-15','PD252',0),
  ('PT254','2024-03-15','PD252',0),
  ('PT255','2024-02-15','PD253',0),
  ('PT256','2024-03-15','PD253',0),
  ('PT257','2024-02-15','PD254',0),
  ('PT258','2024-03-15','PD254',0),
  ('PT259','2024-02-15','PD255',0),
  ('PT260','2024-03-15','PD255',0),
  ('PT261','2024-02-15','PD256',0),
  ('PT262','2024-03-15','PD256',0),
  ('PT263','2024-02-15','PD257',0),
  ('PT264','2024-03-15','PD257',0),
  ('PT265','2024-02-15','PD258',0),
  ('PT266','2024-03-15','PD258',0),
  ('PT267','2024-02-15','PD259',0),
  ('PT268','2024-03-15','PD259',0),
  ('PT269','2024-02-15','PD260',0),
  ('PT270','2024-03-15','PD260',0),
  ('PT271','2024-02-15','PD261',0),
  ('PT272','2024-03-15','PD261',0),
  ('PT273','2024-02-15','PD262',0),
  ('PT274','2024-03-15','PD262',0),
  ('PT275','2024-02-15','PD263',0),
  ('PT276','2024-03-15','PD263',0),
  ('PT277','2024-02-15','PD264',0),
  ('PT278','2024-03-15','PD264',0),
  ('PT279','2024-02-15','PD265',0),
  ('PT280','2024-03-15','PD265',0),
-- 15% sinh viên đóng 3 lần (15 sinh viên: SV0066-SV0080)
  ('PT281','2024-02-15','PD266',0),
  ('PT282','2024-03-15','PD266',0),
  ('PT283','2024-04-15','PD266',0),
  ('PT284','2024-02-15','PD267',0),
  ('PT285','2024-03-15','PD267',0),
  ('PT286','2024-04-15','PD267',0),
  ('PT287','2024-02-15','PD268',0),
  ('PT288','2024-03-15','PD268',0),
  ('PT289','2024-04-15','PD268',0),
  ('PT290','2024-02-15','PD269',0),
  ('PT291','2024-03-15','PD269',0),
  ('PT292','2024-04-15','PD269',0),
  ('PT293','2024-02-15','PD270',0),
  ('PT294','2024-03-15','PD270',0),
  ('PT295','2024-04-15','PD270',0),
  ('PT296','2024-02-15','PD271',0),
  ('PT297','2024-03-15','PD271',0),
  ('PT298','2024-04-15','PD271',0),
  ('PT299','2024-02-15','PD272',0),
  ('PT300','2024-03-15','PD272',0),
  ('PT301','2024-04-15','PD272',0),
  ('PT302','2024-02-15','PD273',0),
  ('PT303','2024-03-15','PD273',0),
  ('PT304','2024-04-15','PD273',0),
  ('PT305','2024-02-15','PD274',0),
  ('PT306','2024-03-15','PD274',0),
  ('PT307','2024-04-15','PD274',0),
  ('PT308','2024-02-15','PD275',0),
  ('PT309','2024-03-15','PD275',0),
  ('PT310','2024-04-15','PD275',0),
  ('PT311','2024-02-15','PD276',0),
  ('PT312','2024-03-15','PD276',0),
  ('PT313','2024-04-15','PD276',0),
  ('PT314','2024-02-15','PD277',0),
  ('PT315','2024-03-15','PD277',0),
  ('PT316','2024-04-15','PD277',0),
  ('PT317','2024-02-15','PD278',0),
  ('PT318','2024-03-15','PD278',0),
  ('PT319','2024-04-15','PD278',0),
  ('PT320','2024-02-15','PD279',0),
  ('PT321','2024-03-15','PD279',0),
  ('PT322','2024-04-15','PD279',0),
  ('PT323','2024-02-15','PD280',0),
  ('PT324','2024-03-15','PD280',0),
  ('PT325','2024-04-15','PD280',0);
-- 20% sinh viên chưa đóng (20 sinh viên: SV0081-SV0100) - không có phiếu thu

INSERT INTO ACADEMIC_SETTINGS (id, current_semester) VALUES (1, 'HK1_2024');



INSERT INTO CHUCNANG (MaChucNang, TenChucNang, TenManHinhDuocLoad) VALUES
  ('CN01','Quản lý sinh viên','StudentManagement'),
  ('CN02','Đăng ký học phần','CourseRegistration'),
  ('CN03','Quản lý người dùng','UserManagement'),
  ('CN04','Quản lý học phí','TuitionManagement'),
  ('CN05','Báo cáo tổng hợp','ReportDashboard');


INSERT INTO NHOMNGUOIDUNG (MaNhom, TenNhom) VALUES
  ('N1','Admin'),
  ('N2','Giảng viên'),
  ('N3','Sinh viên');
INSERT INTO NHOMNGUOIDUNG (MaNhom, TenNhom) VALUES
  ('N4','Kế toán');

-- Admin: toàn quyền CN01–CN05
INSERT INTO PHANQUYEN (MaNhom, MaChucNang) VALUES
  ('N1','CN01'),
  ('N1','CN02'),
  ('N1','CN03'),
  ('N1','CN04'),
  ('N1','CN05');

-- Giảng viên: quản lý sinh viên và xuất báo cáo
INSERT INTO PHANQUYEN (MaNhom, MaChucNang) VALUES
  ('N2','CN01'),
  ('N2','CN05');

-- Sinh viên: đăng ký học phần
INSERT INTO PHANQUYEN (MaNhom, MaChucNang) VALUES
  ('N3','CN02');

-- Kế toán: quản lý học phí và báo cáo
INSERT INTO PHANQUYEN (MaNhom, MaChucNang) VALUES
  ('N4','CN04'),
  ('N4','CN05');

INSERT INTO NGUOIDUNG (TenDangNhap, UserID, MatKhau, MaNhom, MaSoSinhVien, TrangThai) VALUES
  ('admin','U001','123', 'N1', NULL, 'active'),
  ('giangvien','U002','123', 'N2', NULL, 'active'),
  ('ketoan','U003','123','N4',NULL, 'active'),
  ('sv0001','U103','123','N3','SV0001', 'active'),
  ('sv0002','U004','123','N3','SV0002', 'active'),
  ('sv0003','U005','123','N3','SV0003', 'active'),
  ('sv0004','U006','123','N3','SV0004', 'active'),
  ('sv0005','U007','123','N3','SV0005', 'active'),
  ('sv0006','U008','123','N3','SV0006', 'active'),
  ('sv0007','U009','123','N3','SV0007', 'active'),
  ('sv0008','U010','123','N3','SV0008', 'active'),
  ('sv0009','U011','123','N3','SV0009', 'active'),
  ('sv0010','U012','123','N3','SV0010', 'active'),
  ('sv0011','U013','123','N3','SV0011', 'active'),
  ('sv0012','U014','123','N3','SV0012', 'active'),
  ('sv0013','U015','123','N3','SV0013', 'active'),
  ('sv0014','U016','123','N3','SV0014', 'active'),
  ('sv0015','U017','123','N3','SV0015', 'active'),
  ('sv0016','U018','123','N3','SV0016', 'active'),
  ('sv0017','U019','123','N3','SV0017', 'active'),
  ('sv0018','U020','123','N3','SV0018', 'active'),
  ('sv0019','U021','123','N3','SV0019', 'active'),
  ('sv0020','U022','123','N3','SV0020', 'active'),
  ('sv0021','U023','123','N3','SV0021', 'active'),
  ('sv0022','U024','123','N3','SV0022', 'active'),
  ('sv0023','U025','123','N3','SV0023', 'active'),
  ('sv0024','U026','123','N3','SV0024', 'active'),
  ('sv0025','U027','123','N3','SV0025', 'active'),
  ('sv0026','U028','123','N3','SV0026', 'active'),
  ('sv0027','U029','123','N3','SV0027', 'active'),
  ('sv0028','U030','123','N3','SV0028', 'active'),
  ('sv0029','U031','123','N3','SV0029', 'active'),
  ('sv0030','U032','123','N3','SV0030', 'active'),
  ('sv0031','U033','123','N3','SV0031', 'active'),
  ('sv0032','U034','123','N3','SV0032', 'active'),
  ('sv0033','U035','123','N3','SV0033', 'active'),
  ('sv0034','U036','123','N3','SV0034', 'active'),
  ('sv0035','U037','123','N3','SV0035', 'active'),
  ('sv0036','U038','123','N3','SV0036', 'active'),
  ('sv0037','U039','123','N3','SV0037', 'active'),
  ('sv0038','U040','123','N3','SV0038', 'active'),
  ('sv0039','U041','123','N3','SV0039', 'active'),
  ('sv0040','U042','123','N3','SV0040', 'active'),
  ('sv0041','U043','123','N3','SV0041', 'active'),
  ('sv0042','U044','123','N3','SV0042', 'active'),
  ('sv0043','U045','123','N3','SV0043', 'active'),
  ('sv0044','U046','123','N3','SV0044', 'active'),
  ('sv0045','U047','123','N3','SV0045', 'active'),
  ('sv0046','U048','123','N3','SV0046', 'active'),
  ('sv0047','U049','123','N3','SV0047', 'active'),
  ('sv0048','U050','123','N3','SV0048', 'active'),
  ('sv0049','U051','123','N3','SV0049', 'active'),
  ('sv0050','U052','123','N3','SV0050', 'active'),
  ('sv0051','U053','123','N3','SV0051', 'active'),
  ('sv0052','U054','123','N3','SV0052', 'active'),
  ('sv0053','U055','123','N3','SV0053', 'active'),
  ('sv0054','U056','123','N3','SV0054', 'active'),
  ('sv0055','U057','123','N3','SV0055', 'active'),
  ('sv0056','U058','123','N3','SV0056', 'active'),
  ('sv0057','U059','123','N3','SV0057', 'active'),
  ('sv0058','U060','123','N3','SV0058', 'active'),
  ('sv0059','U061','123','N3','SV0059', 'active'),
  ('sv0060','U062','123','N3','SV0060', 'active'),
  ('sv0061','U063','123','N3','SV0061', 'active'),
  ('sv0062','U064','123','N3','SV0062', 'active'),
  ('sv0063','U065','123','N3','SV0063', 'active'),
  ('sv0064','U066','123','N3','SV0064', 'active'),
  ('sv0065','U067','123','N3','SV0065', 'active'),
  ('sv0066','U068','123','N3','SV0066', 'active'),
  ('sv0067','U069','123','N3','SV0067', 'active'),
  ('sv0068','U070','123','N3','SV0068', 'active'),
  ('sv0069','U071','123','N3','SV0069', 'active'),
  ('sv0070','U072','123','N3','SV0070', 'active'),
  ('sv0071','U073','123','N3','SV0071', 'active'),
  ('sv0072','U074','123','N3','SV0072', 'active'),
  ('sv0073','U075','123','N3','SV0073', 'active'),
  ('sv0074','U076','123','N3','SV0074', 'active'),
  ('sv0075','U077','123','N3','SV0075', 'active'),
  ('sv0076','U078','123','N3','SV0076', 'active'),
  ('sv0077','U079','123','N3','SV0077', 'active'),
  ('sv0078','U080','123','N3','SV0078', 'active'),
  ('sv0079','U081','123','N3','SV0079', 'active'),
  ('sv0080','U082','123','N3','SV0080', 'active'),
  ('sv0081','U083','123','N3','SV0081', 'active'),
  ('sv0082','U084','123','N3','SV0082', 'active'),
  ('sv0083','U085','123','N3','SV0083', 'active'),
  ('sv0084','U086','123','N3','SV0084', 'active'),
  ('sv0085','U087','123','N3','SV0085', 'active'),
  ('sv0086','U088','123','N3','SV0086', 'active'),
  ('sv0087','U089','123','N3','SV0087', 'active'),
  ('sv0088','U090','123','N3','SV0088', 'active'),
  ('sv0089','U091','123','N3','SV0089', 'active'),
  ('sv0090','U092','123','N3','SV0090', 'active'),
  ('sv0091','U093','123','N3','SV0091', 'active'),
  ('sv0092','U094','123','N3','SV0092', 'active'),
  ('sv0093','U095','123','N3','SV0093', 'active'),
  ('sv0094','U096','123','N3','SV0094', 'active'),
  ('sv0095','U097','123','N3','SV0095', 'active'),
  ('sv0096','U098','123','N3','SV0096', 'active'),
  ('sv0097','U099','123','N3','SV0097', 'active'),
  ('sv0098','U100','123','N3','SV0098', 'active'),
  ('sv0099','U101','123','N3','SV0099', 'active'),
  ('sv0100','U102','123','N3','SV0100', 'active');



-- Cập nhật lại MaDoiTuongUT cho 100 sinh viên theo tỉ lệ yêu cầu
-- 10% sinh viên thuộc UT01 (SV0001-SV0010)
UPDATE SINHVIEN SET MaDoiTuongUT = 'UT01' WHERE MaSoSinhVien IN ('SV0001','SV0002','SV0003','SV0004','SV0005','SV0006','SV0007','SV0008','SV0009','SV0010');

-- 10% sinh viên thuộc UT02 (SV0011-SV0020)  
UPDATE SINHVIEN SET MaDoiTuongUT = 'UT02' WHERE MaSoSinhVien IN ('SV0011','SV0012','SV0013','SV0014','SV0015','SV0016','SV0017','SV0018','SV0019','SV0020');

-- 10% sinh viên thuộc UT03 (SV0021-SV0030)
UPDATE SINHVIEN SET MaDoiTuongUT = 'UT03' WHERE MaSoSinhVien IN ('SV0021','SV0022','SV0023','SV0024','SV0025','SV0026','SV0027','SV0028','SV0029','SV0030');

-- 10% sinh viên thuộc UT04 (SV0031-SV0040)
UPDATE SINHVIEN SET MaDoiTuongUT = 'UT04' WHERE MaSoSinhVien IN ('SV0031','SV0032','SV0033','SV0034','SV0035','SV0036','SV0037','SV0038','SV0039','SV0040');

-- 60% sinh viên thuộc UT05 (SV0041-SV0100)
UPDATE SINHVIEN SET MaDoiTuongUT = 'UT05' WHERE MaSoSinhVien IN ('SV0041','SV0042','SV0043','SV0044','SV0045','SV0046','SV0047','SV0048','SV0049','SV0050','SV0051','SV0052','SV0053','SV0054','SV0055','SV0056','SV0057','SV0058','SV0059','SV0060','SV0061','SV0062','SV0063','SV0064','SV0065','SV0066','SV0067','SV0068','SV0069','SV0070','SV0071','SV0072','SV0073','SV0074','SV0075','SV0076','SV0077','SV0078','SV0079','SV0080','SV0081','SV0082','SV0083','SV0084','SV0085','SV0086','SV0087','SV0088','SV0089','SV0090','SV0091','SV0092','SV0093','SV0094','SV0095','SV0096','SV0097','SV0098','SV0099','SV0100');