-- ======================================================
-- DROP existing tables (in reverse-dependency order)
-- ======================================================
DROP TABLE IF EXISTS BAOCAOSINHVIENNOHP CASCADE;
DROP TABLE IF EXISTS PHIEUTHUHP CASCADE;
DROP TABLE IF EXISTS CT_PHIEUDANGKY CASCADE;
DROP TABLE IF EXISTS PHIEUDANGKY CASCADE;
DROP TABLE IF EXISTS SINHVIEN CASCADE;
DROP TABLE IF EXISTS DANHSACHMONHOCMO CASCADE;
DROP TABLE IF EXISTS CHUONGTRINHHOC CASCADE;
DROP TABLE IF EXISTS HOCKYNAMHOC CASCADE;
DROP TABLE IF EXISTS MONHOC CASCADE;
DROP TABLE IF EXISTS LOAIMON CASCADE;
DROP TABLE IF EXISTS NGANHHOC CASCADE;
DROP TABLE IF EXISTS KHOA CASCADE;
DROP TABLE IF EXISTS DOITUONGUUTIEN CASCADE;
DROP TABLE IF EXISTS HUYEN CASCADE;
DROP TABLE IF EXISTS TINH CASCADE;
DROP TABLE IF EXISTS NGUOIDUNG CASCADE;
DROP TABLE IF EXISTS PHANQUYEN CASCADE;
DROP TABLE IF EXISTS NHOMNGUOIDUNG CASCADE;
DROP TABLE IF EXISTS CHUCNANG CASCADE;

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
    KhuVucUuTien VARCHAR,
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
    SoTienMotTC DECIMAL
);

CREATE TABLE MONHOC (
    MaMonHoc VARCHAR PRIMARY KEY,
    TenMonHoc VARCHAR,
    MaLoaiMon VARCHAR NOT NULL,
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
    FOREIGN KEY (MaHuyen) REFERENCES HUYEN(MaHuyen),
    FOREIGN KEY (MaDoiTuongUT) REFERENCES DOITUONGUUTIEN(MaDoiTuong),
    FOREIGN KEY (MaNganh) REFERENCES NGANHHOC(MaNganh)
);

CREATE TABLE PHIEUDANGKY (
    MaPhieuDangKy VARCHAR PRIMARY KEY,
    NgayLap DATE,
    MaSoSinhVien VARCHAR NOT NULL,
    MaHocKy VARCHAR NOT NULL,
    SoTienDangKy DECIMAL,
    SoTienPhaiDong DECIMAL,
    SoTienDaDong DECIMAL,
    SoTienConLai DECIMAL,
    SoTinChiToiDa INT,
    FOREIGN KEY (MaSoSinhVien) REFERENCES SINHVIEN(MaSoSinhVien),
    FOREIGN KEY (MaHocKy) REFERENCES HOCKYNAMHOC(MaHocKy)
);

CREATE TABLE CT_PHIEUDANGKY (
    MaPhieuDangKy VARCHAR NOT NULL,
    MaMonHoc VARCHAR NOT NULL,
    PRIMARY KEY (MaPhieuDangKy, MaMonHoc),
    FOREIGN KEY (MaPhieuDangKy) REFERENCES PHIEUDANGKY(MaPhieuDangKy),
    FOREIGN KEY (MaMonHoc) REFERENCES MONHOC(MaMonHoc)
);

CREATE TABLE PHIEUTHUHP (
    MaPhieuThu VARCHAR PRIMARY KEY,
    NgayLap DATE,
    MaPhieuDangKy VARCHAR NOT NULL,
    SoTienDong DECIMAL,
    FOREIGN KEY (MaPhieuDangKy) REFERENCES PHIEUDANGKY(MaPhieuDangKy)
);

CREATE TABLE BAOCAOSINHVIENNOHP (
    MaHocKy VARCHAR NOT NULL,
    MaSoSinhVien VARCHAR NOT NULL,
    MaPhieuDangKy VARCHAR NOT NULL,
    PRIMARY KEY (MaHocKy, MaSoSinhVien, MaPhieuDangKy),
    FOREIGN KEY (MaHocKy) REFERENCES HOCKYNAMHOC(MaHocKy),
    FOREIGN KEY (MaSoSinhVien) REFERENCES SINHVIEN(MaSoSinhVien),
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
    FOREIGN KEY (MaNhom) REFERENCES NHOMNGUOIDUNG(MaNhom),
    FOREIGN KEY (MaSoSinhVien) REFERENCES SINHVIEN(MaSoSinhVien)
);

-- ======================================================
-- all done
-- ======================================================