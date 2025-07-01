"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.dashboardService = { getStudentOverview: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, enrollmentStats, gpa, availableOpenCourses, recentPayments, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    s.MaSoSinhVien as \"studentId\",\n                    s.HoTen as \"name\",\n                    s.Email as \"email\",\n                    s.SoDienThoai as \"phone\",\n                    s.DiaChi as \"address\",\n                    s.NgaySinh as \"dateOfBirth\",\n                    '2024' as \"enrollmentYear\",\n                    s.MaNganh as \"major\",\n                    '' as \"faculty\",\n                    '' as \"program\",\n                    'active' as \"status\",\n                    -- L\u1EA5y th\u00F4ng tin ng\u00E0nh t\u1EEB mapping\n                    CASE \n                        WHEN s.MaNganh = 'CNPM' THEN 'C\u00F4ng ngh\u1EC7 ph\u1EA7n m\u1EC1m'\n                        WHEN s.MaNganh = 'KHMT' THEN 'Khoa h\u1ECDc m\u00E1y t\u00EDnh' \n                        WHEN s.MaNganh = 'HTTT' THEN 'H\u1EC7 th\u1ED1ng th\u00F4ng tin'\n                        WHEN s.MaNganh = 'CNTT' THEN 'C\u00F4ng ngh\u1EC7 th\u00F4ng tin'\n                        WHEN s.MaNganh = 'TMDT' THEN 'Th\u01B0\u01A1ng m\u1EA1i \u0111i\u1EC7n t\u1EED'\n                        WHEN s.MaNganh = 'KTPM' THEN 'K\u1EF9 thu\u1EADt ph\u1EA7n m\u1EC1m'\n                        WHEN s.MaNganh = 'VMC' THEN 'Vi\u1EC5n th\u00F4ng Multimedia'\n                        WHEN s.MaNganh = 'CNTT_Nhat' THEN 'C\u00F4ng ngh\u1EC7 th\u00F4ng tin (ti\u1EBFng Nh\u1EADt)'\n                        ELSE s.MaNganh\n                    END as \"majorName\"\n                FROM SINHVIEN s\n                WHERE s.MaSoSinhVien = $1\n            ", [studentId])];
                    case 1:
                        student = _a.sent();
                        if (!student)
                            return [2 /*return*/, null]; // Get enrolled courses count and total credits từ bảng CT_PHIEUDANGKY
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    COUNT(*) as enrolled_count,\n                    SUM(m.SoTiet / lm.SoTietMotTC) as total_credits\n                FROM CT_PHIEUDANGKY ct\n                JOIN MONHOC m ON ct.MaMonHoc = m.MaMonHoc\n                JOIN LOAIMON lm ON m.MaLoaiMon = lm.MaLoaiMon\n                WHERE ct.MaSoSinhVien = $1\n            ", [studentId])];
                    case 2:
                        enrollmentStats = _a.sent();
                        gpa = { gpa: 0 };
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    oc.id,\n                    s.id as \"courseId\",\n                    s.name as \"courseName\",\n                    s.lecturer,\n                    s.credits,\n                    oc.max_students as \"maxStudents\",\n                    oc.current_students as \"currentStudents\",\n                    oc.semester,\n                    oc.is_registration_open as \"isRegistrationOpen\"\n                FROM open_courses oc\n                JOIN subjects s ON oc.course_id = s.id\n                WHERE oc.is_registration_open = true\n                AND oc.current_students < oc.max_students\n                AND s.id NOT IN (\n                    SELECT course_id FROM enrollments \n                    WHERE student_id = $1 AND is_enrolled = true\n                )\n                ORDER BY s.name\n                LIMIT 10\n            ", [studentId])];
                    case 3:
                        availableOpenCourses = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    id,\n                    student_id as \"studentId\",\n                    amount,\n                    payment_date as \"paymentDate\",\n                    status,\n                    payment_method as \"paymentMethod\"\n                FROM payments\n                WHERE student_id = $1\n                ORDER BY payment_date DESC\n                LIMIT 5\n            ", [studentId])];
                    case 4:
                        recentPayments = _a.sent();
                        return [2 /*return*/, {
                                student: {
                                    studentId: student.studentId,
                                    fullName: student.name,
                                    dateOfBirth: student.dateOfBirth,
                                    gender: student.gender,
                                    hometown: student.hometown,
                                    districtId: student.districtId,
                                    priorityObjectId: student.priorityObjectId,
                                    majorId: student.major, email: student.email,
                                    phone: student.phone
                                },
                                enrolledCourses: (enrollmentStats === null || enrollmentStats === void 0 ? void 0 : enrollmentStats.enrolled_count) || 0,
                                totalCredits: (enrollmentStats === null || enrollmentStats === void 0 ? void 0 : enrollmentStats.total_credits) || 0, gpa: (gpa === null || gpa === void 0 ? void 0 : gpa.gpa) || 0,
                                availableOpenCourses: availableOpenCourses,
                                recentPayments: recentPayments
                            }];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error getting student overview:', error_1);
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    }, // Lấy thời khóa biểu sinh viên từ CT_PHIEUDANGKY và DANHSACHMONHOCMO
    getStudentTimetable: function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var actualSemester, _a, timetableData, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = semester;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, databaseService_1.DatabaseService.getCurrentSemester()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        actualSemester = _a;
                        console.log("\uD83D\uDD35 [DashboardService] Getting timetable for student ".concat(studentId, " in semester ").concat(actualSemester)); // Lấy thời khóa biểu từ các bảng CT_PHIEUDANGKY, DANHSACHMONHOCMO, MONHOC
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    ct.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    (mh.SoTiet / lm.SoTietMotTC) as \"credits\",\n                    ds.Thu as \"dayOfWeek\",\n                    ds.TietBatDau as \"startPeriod\",\n                    ds.TietKetThuc as \"endPeriod\"\n                FROM CT_PHIEUDANGKY ct\n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy\n                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                JOIN DANHSACHMONHOCMO ds ON ct.MaMonHoc = ds.MaMonHoc AND ct.MaHocKy = ds.MaHocKy\n                WHERE pd.MaSoSinhVien = $1 AND ct.MaHocKy = $2\n                ORDER BY ds.Thu, ds.TietBatDau\n            ", [studentId, actualSemester])];
                    case 3:
                        timetableData = _b.sent();
                        console.log("\u2705 [DashboardService] Found ".concat(timetableData.length, " courses in timetable"));
                        console.log("\uD83D\uDCCB [DashboardService] Timetable data:", timetableData);
                        return [2 /*return*/, timetableData];
                    case 4:
                        error_2 = _b.sent();
                        console.error('❌ [DashboardService] Error getting student timetable:', error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, updateStudentOverview: function (overview) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedOverview, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Update student info
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE students \n                SET \n                    name = $1,\n                    email = $2,\n                    phone = $3,\n                    updated_at = NOW()\n                WHERE student_id = $4\n            ", [
                                overview.student.fullName,
                                overview.student.email,
                                overview.student.phone,
                                overview.student.studentId
                            ])];
                    case 1:
                        // Update student info
                        _a.sent();
                        return [4 /*yield*/, this.getStudentOverview(overview.student.studentId)];
                    case 2:
                        updatedOverview = _a.sent();
                        if (!updatedOverview) {
                            throw new Error('Failed to get updated overview');
                        }
                        return [2 /*return*/, updatedOverview];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error updating student overview:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
