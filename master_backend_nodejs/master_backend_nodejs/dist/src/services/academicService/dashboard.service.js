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
exports.academicDashboardService = void 0;
// Mock data
var mockStats = {
    totalSubjects: 245,
    totalOpenCourses: 89,
    totalPrograms: 12,
    pendingRequests: 15,
    recentActivities: [
        {
            id: '1',
            type: 'subject_created',
            description: 'Môn học "Trí tuệ nhân tạo nâng cao" đã được tạo',
            timestamp: '2025-06-05T10:30:00Z',
            user: 'TS. Nguyễn Văn A'
        },
        {
            id: '2',
            type: 'course_opened',
            description: 'Lớp học phần IT001 đã được mở cho HK1 2025-2026',
            timestamp: '2025-06-05T09:15:00Z',
            user: 'PGS. Trần Thị B'
        },
        {
            id: '3',
            type: 'request_submitted',
            description: 'Yêu cầu thêm môn học từ sinh viên SV001',
            timestamp: '2025-06-05T08:45:00Z',
            user: 'Nguyễn Minh C'
        }
    ]
};
var mockSubjectStats = {
    byDepartment: [
        { department: 'Khoa học máy tính', count: 98 },
        { department: 'Công nghệ thông tin', count: 87 },
        { department: 'Toán học', count: 45 },
        { department: 'Vật lý', count: 15 }
    ],
    byCredits: [
        { credits: 2, count: 45 },
        { credits: 3, count: 125 },
        { credits: 4, count: 65 },
        { credits: 5, count: 10 }
    ],
    totalCreditsOffered: 735
};
var mockCourseStats = {
    bySemester: [
        { semester: 'HK1 2024-2025', count: 45 },
        { semester: 'HK2 2024-2025', count: 44 }
    ],
    byStatus: [
        { status: 'open', count: 67 },
        { status: 'closed', count: 15 },
        { status: 'cancelled', count: 7 }
    ],
    totalEnrollments: 2456,
    averageEnrollmentRate: 78.5
};
exports.academicDashboardService = {
    getDashboardStats: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement real database queries
                return [2 /*return*/, mockStats];
            });
        });
    },
    getSubjectStatistics: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement real database queries
                return [2 /*return*/, mockSubjectStats];
            });
        });
    },
    getCourseStatistics: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement real database queries
                return [2 /*return*/, mockCourseStats];
            });
        });
    },
    getRecentActivities: function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                // TODO: Implement real database queries
                return [2 /*return*/, mockStats.recentActivities.slice(0, limit)];
            });
        });
    },
    getPendingRequestsCount: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement real database queries
                return [2 /*return*/, mockStats.pendingRequests];
            });
        });
    }
};
