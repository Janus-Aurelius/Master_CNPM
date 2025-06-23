-- ======================================================
-- DROP existing tables (in reverse-dependency order)
-- ======================================================
DROP TABLE IF EXISTS HOCPHI_THEOHK;
DROP TABLE IF EXISTS ACADEMIC_SETTINGS;
DROP TABLE IF EXISTS PHIEUTHUHP;
DROP TABLE IF EXISTS CT_PHIEUDANGKY;
DROP TABLE IF EXISTS PHIEUDANGKY;
DROP TABLE IF EXISTS SINHVIEN;
DROP TABLE IF EXISTS DANHSACHMONHOCMO;
DROP TABLE IF EXISTS CHUONGTRINHHOC;
DROP TABLE IF EXISTS HOCKYNAMHOC;
DROP TABLE IF EXISTS MONHOC;
DROP TABLE IF EXISTS LOAIMON;
DROP TABLE IF EXISTS NGANHHOC;
DROP TABLE IF EXISTS KHOA;
DROP TABLE IF EXISTS DOITUONGUUTIEN;
DROP TABLE IF EXISTS HUYEN;
DROP TABLE IF EXISTS TINH;
DROP TABLE IF EXISTS NGUOIDUNG;
DROP TABLE IF EXISTS PHANQUYEN;
DROP TABLE IF EXISTS NHOMNGUOIDUNG;
DROP TABLE IF EXISTS CHUCNANG;
DROP TABLE IF EXISTS REGISTRATION_LOG;
-- ======================================================
-- Core geographic and support tables
-- ======================================================
CREATE TABLE TINH (
    MaTinh VARCHAR PRIMARY KEY,
    TenTinh VARCHAR
);

CREATE TABLE HUYEN (
    MaHuyen VARCHAR PRIMARY KEY,
    TenHuyen VARCHAR,
    MaTinh VARCHAR NOT NULL,
    FOREIGN KEY (MaTinh) REFERENCES TINH(MaTinh)
);

CREATE TABLE DOITUONGUUTIEN (
    MaDoiTuong VARCHAR PRIMARY KEY,
    TenDoiTuong VARCHAR,
    MucGiamHocPhi DECIMAL
);

-- ======================================================
-- Academic structure
-- ======================================================
CREATE TABLE KHOA (
    MaKhoa VARCHAR PRIMARY KEY,
    TenKhoa VARCHAR
);

CREATE TABLE NGANHHOC (
    MaNganh VARCHAR PRIMARY KEY,
    TenNganh VARCHAR,
    MaKhoa VARCHAR NOT NULL,
    FOREIGN KEY (MaKhoa) REFERENCES KHOA(MaKhoa)
);

CREATE TABLE LOAIMON (
    MaLoaiMon VARCHAR PRIMARY KEY,
    TenLoaiMon VARCHAR,
    SoTietMotTC INT,
);

CREATE TABLE MONHOC (
    MaMonHoc    VARCHAR PRIMARY KEY,
    TenMonHoc   VARCHAR,
    MaLoaiMon   VARCHAR NOT NULL,
    SoTiet      INT      NOT NULL,
    FOREIGN KEY (MaLoaiMon) REFERENCES LOAIMON(MaLoaiMon)
);

CREATE TABLE HOCKYNAMHOC (
    MaHocKy VARCHAR PRIMARY KEY,
    HocKyThu INT,
    ThoiGianBatDau DATE,
    ThoiGianKetThuc DATE,
    TrangThaiHocKy VARCHAR,
    NamHoc INT,
    ThoiHanDongHP DATE
);
CREATE TABLE HOCPHI_THEOHK (
    MaHocKy VARCHAR NOT NULL,
    MaLoaiMon VARCHAR NOT NULL,
    SoTienMotTC DECIMAL NOT NULL,
    PRIMARY KEY (MaHocKy, MaLoaiMon),
    FOREIGN KEY (MaHocKy) REFERENCES HOCKYNAMHOC(MaHocKy),
    FOREIGN KEY (MaLoaiMon) REFERENCES LOAIMON(MaLoaiMon)
);
-- ======================================================
-- Curriculum and offerings
-- ======================================================
CREATE TABLE CHUONGTRINHHOC (
    MaNganh VARCHAR NOT NULL,
    MaMonHoc VARCHAR NOT NULL,
    MaHocKy VARCHAR NOT NULL,
    GhiChu VARCHAR,
    PRIMARY KEY (MaNganh, MaMonHoc, MaHocKy),
    FOREIGN KEY (MaNganh) REFERENCES NGANHHOC(MaNganh),
    FOREIGN KEY (MaMonHoc) REFERENCES MONHOC(MaMonHoc),
    FOREIGN KEY (MaHocKy) REFERENCES HOCKYNAMHOC(MaHocKy)
);

CREATE TABLE DANHSACHMONHOCMO (
    MaHocKy VARCHAR NOT NULL,
    MaMonHoc VARCHAR NOT NULL,
    SiSoToiThieu INT,
    SiSoToiDa INT,
    SoSVDaDangKy INT DEFAULT 0,
    Thu INT,
    TietBatDau INT,
    TietKetThuc INT,
    PRIMARY KEY (MaHocKy, MaMonHoc),
    FOREIGN KEY (MaHocKy) REFERENCES HOCKYNAMHOC(MaHocKy),
    FOREIGN KEY (MaMonHoc) REFERENCES MONHOC(MaMonHoc)
);

-- ======================================================
-- Student and registration
-- ======================================================
CREATE TABLE SINHVIEN (
    MaSoSinhVien VARCHAR PRIMARY KEY,
    HoTen VARCHAR,
    NgaySinh DATE,
    GioiTinh VARCHAR,
    QueQuan VARCHAR,
    MaHuyen VARCHAR NOT NULL,
    MaDoiTuongUT VARCHAR NOT NULL,
    MaNganh VARCHAR NOT NULL,
    Email VARCHAR(100),
    SoDienThoai VARCHAR(20),
    DiaChi VARCHAR(255),
    FOREIGN KEY (MaHuyen) REFERENCES HUYEN(MaHuyen),
    FOREIGN KEY (MaDoiTuongUT) REFERENCES DOITUONGUUTIEN(MaDoiTuong),
    FOREIGN KEY (MaNganh) REFERENCES NGANHHOC(MaNganh)
);

CREATE TABLE PHIEUDANGKY (
    MaPhieuDangKy VARCHAR PRIMARY KEY,
    NgayLap DATE,
    MaSoSinhVien VARCHAR NOT NULL,
    MaHocKy VARCHAR NOT NULL,
    XacNhan boolean DEFAULT false,
    SoTienConLai DECIMAL DEFAULT 0,
    SoTinChiToiDa INT DEFAULT 30,
    FOREIGN KEY (MaSoSinhVien) REFERENCES SINHVIEN(MaSoSinhVien),
    FOREIGN KEY (MaHocKy) REFERENCES HOCKYNAMHOC(MaHocKy)
);

CREATE TABLE CT_PHIEUDANGKY (
    MaPhieuDangKy VARCHAR NOT NULL,
    MaHocKy VARCHAR NOT NULL,
    MaMonHoc VARCHAR NOT NULL,
    PRIMARY KEY (MaPhieuDangKy, MaHocKy, MaMonHoc),
    FOREIGN KEY (MaPhieuDangKy) REFERENCES PHIEUDANGKY(MaPhieuDangKy),
    FOREIGN KEY (MaHocKy, MaMonHoc) REFERENCES DANHSACHMONHOCMO(MaHocKy, MaMonHoc)
);

CREATE TABLE PHIEUTHUHP (
    MaPhieuThu VARCHAR PRIMARY KEY,
    NgayLap DATE,
    MaPhieuDangKy VARCHAR NOT NULL,
    SoTienDong DECIMAL,
    PhuongThuc VARCHAR(50) DEFAULT 'Chuyển Khoản',
    FOREIGN KEY (MaPhieuDangKy) REFERENCES PHIEUDANGKY(MaPhieuDangKy)
);


-- ======================================================
-- User & authorization
-- ======================================================
CREATE TABLE CHUCNANG (
    MaChucNang VARCHAR PRIMARY KEY,
    TenChucNang VARCHAR,
    TenManHinhDuocLoad VARCHAR
);

CREATE TABLE NHOMNGUOIDUNG (
    MaNhom VARCHAR PRIMARY KEY,
    TenNhom VARCHAR
);

CREATE TABLE PHANQUYEN (
    MaNhom VARCHAR NOT NULL,
    MaChucNang VARCHAR NOT NULL,
    PRIMARY KEY (MaNhom, MaChucNang),
    FOREIGN KEY (MaNhom) REFERENCES NHOMNGUOIDUNG(MaNhom),
    FOREIGN KEY (MaChucNang) REFERENCES CHUCNANG(MaChucNang)
);

CREATE TABLE NGUOIDUNG (
    TenDangNhap VARCHAR PRIMARY KEY,
    UserID VARCHAR,
    MatKhau VARCHAR,
    MaNhom VARCHAR NOT NULL,
    MaSoSinhVien VARCHAR,
    TrangThai VARCHAR DEFAULT 'active',
    FOREIGN KEY (MaNhom) REFERENCES NHOMNGUOIDUNG(MaNhom),
    FOREIGN KEY (MaSoSinhVien) REFERENCES SINHVIEN(MaSoSinhVien)
);

CREATE TABLE REGISTRATION_LOG (
    id SERIAL PRIMARY KEY,
    MaSoSinhVien VARCHAR(20) NOT NULL,
    TenSinhVien VARCHAR(100) NOT NULL,
    MaMonHoc VARCHAR(20) NOT NULL,
    TenMonHoc VARCHAR(100) NOT NULL,
    LoaiYeuCau VARCHAR(10) NOT NULL CHECK (LoaiYeuCau IN ('register', 'cancel')),
    ThoiGianYeuCau TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ACADEMIC_SETTINGS (
    id INTEGER PRIMARY KEY DEFAULT 1,
    current_semester VARCHAR NOT NULL,
    FOREIGN KEY (current_semester) REFERENCES HOCKYNAMHOC(MaHocKy),
    CONSTRAINT single_record_only CHECK (id = 1)
);
-- ======================================================
-- Audit & Activity Logs
-- ======================================================
CREATE TABLE AUDIT_LOGS (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'thất bại',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
    -- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for better query performance
CREATE INDEX idx_audit_logs_user_id ON AUDIT_LOGS(user_id);
CREATE INDEX idx_audit_logs_created_at ON AUDIT_LOGS(created_at);

CREATE TABLE system_settings (
    setting_key VARCHAR PRIMARY KEY,
    setting_value TEXT,
    setting_type VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ======================================================
-- all done
-- ======================================================