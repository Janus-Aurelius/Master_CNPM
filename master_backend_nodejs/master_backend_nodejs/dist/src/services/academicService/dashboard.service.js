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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicDashboardService = void 0;
// src/services/academicService/dashboard.service.ts
var databaseService_1 = require("../database/databaseService");
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
            var totalSubjects, totalOpenCourses, totalPrograms, pendingRequests, recentActivities, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count FROM subjects\n            ")];
                    case 1:
                        totalSubjects = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count FROM open_courses \n                WHERE status = 'open'\n            ")];
                    case 2:
                        totalOpenCourses = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count FROM programs\n            ")];
                    case 3:
                        totalPrograms = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count FROM student_subject_requests \n                WHERE status = 'pending'\n            ")];
                    case 4:
                        pendingRequests = _a.sent();
                        return [4 /*yield*/, this.getRecentActivities(5)];
                    case 5:
                        recentActivities = _a.sent();
                        return [2 /*return*/, {
                                totalSubjects: (totalSubjects === null || totalSubjects === void 0 ? void 0 : totalSubjects.count) || 0,
                                totalOpenCourses: (totalOpenCourses === null || totalOpenCourses === void 0 ? void 0 : totalOpenCourses.count) || 0,
                                totalPrograms: (totalPrograms === null || totalPrograms === void 0 ? void 0 : totalPrograms.count) || 0,
                                pendingRequests: (pendingRequests === null || pendingRequests === void 0 ? void 0 : pendingRequests.count) || 0,
                                recentActivities: recentActivities
                            }];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error fetching dashboard stats:', error_1);
                        // Fallback to mock data
                        return [2 /*return*/, mockStats];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    getSubjectStatistics: function () {
        return __awaiter(this, void 0, void 0, function () {
            var byDepartment, byCredits, totalCreditsResult, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    COALESCE(department, 'General') as department,\n                    COUNT(*) as count\n                FROM subjects \n                GROUP BY department\n                ORDER BY count DESC\n            ")];
                    case 1:
                        byDepartment = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    credits,\n                    COUNT(*) as count\n                FROM subjects \n                GROUP BY credits\n                ORDER BY credits\n            ")];
                    case 2:
                        byCredits = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT SUM(credits) as total FROM subjects\n            ")];
                    case 3:
                        totalCreditsResult = _a.sent();
                        return [2 /*return*/, {
                                byDepartment: byDepartment || [],
                                byCredits: byCredits || [],
                                totalCreditsOffered: (totalCreditsResult === null || totalCreditsResult === void 0 ? void 0 : totalCreditsResult.total) || 0
                            }];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error fetching subject statistics:', error_2);
                        return [2 /*return*/, mockSubjectStats];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    getCourseStatistics: function () {
        return __awaiter(this, void 0, void 0, function () {
            var bySemester, byStatus, totalEnrollmentsResult, enrollmentRate, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    semester,\n                    COUNT(*) as count\n                FROM open_courses \n                GROUP BY semester\n                ORDER BY semester DESC\n                LIMIT 10\n            ")];
                    case 1:
                        bySemester = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    status,\n                    COUNT(*) as count\n                FROM open_courses \n                GROUP BY status\n            ")];
                    case 2:
                        byStatus = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as total FROM enrollments\n            ")];
                    case 3:
                        totalEnrollmentsResult = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    AVG(CASE \n                        WHEN oc.max_students > 0 \n                        THEN (oc.current_students::float / oc.max_students * 100)\n                        ELSE 0 \n                    END) as rate\n                FROM open_courses oc\n                WHERE oc.max_students > 0\n            ")];
                    case 4:
                        enrollmentRate = _a.sent();
                        return [2 /*return*/, {
                                bySemester: bySemester || [],
                                byStatus: byStatus || [],
                                totalEnrollments: (totalEnrollmentsResult === null || totalEnrollmentsResult === void 0 ? void 0 : totalEnrollmentsResult.total) || 0,
                                averageEnrollmentRate: Math.round((enrollmentRate === null || enrollmentRate === void 0 ? void 0 : enrollmentRate.rate) || 0)
                            }];
                    case 5:
                        error_3 = _a.sent();
                        console.error('Error fetching course statistics:', error_3);
                        return [2 /*return*/, mockCourseStats];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    getRecentActivities: function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var activities, recentSubjects, recentCourses, recentRequests, error_4;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        activities = [];
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    'subject_created' as type,\n                    'M\u00F4n h\u1ECDc \"' || subject_name || '\" \u0111\u00E3 \u0111\u01B0\u1EE3c t\u1EA1o' as description,\n                    created_at as timestamp,\n                    'System' as user\n                FROM subjects \n                WHERE created_at >= NOW() - INTERVAL '7 days'\n                ORDER BY created_at DESC\n                LIMIT 3\n            ")];
                    case 1:
                        recentSubjects = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    'course_opened' as type,\n                    'L\u1EDBp h\u1ECDc ph\u1EA7n ' || subject_code || ' \u0111\u00E3 \u0111\u01B0\u1EE3c m\u1EDF cho ' || semester as description,\n                    created_at as timestamp,\n                    COALESCE(lecturer, 'System') as user\n                FROM open_courses \n                WHERE created_at >= NOW() - INTERVAL '7 days'\n                ORDER BY created_at DESC\n                LIMIT 3\n            ")];
                    case 2:
                        recentCourses = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    'request_submitted' as type,\n                    'Y\u00EAu c\u1EA7u ' || request_type || ' t\u1EEB sinh vi\u00EAn ' || student_id as description,\n                    created_at as timestamp,\n                    student_id as user\n                FROM student_subject_requests \n                WHERE created_at >= NOW() - INTERVAL '7 days'\n                ORDER BY created_at DESC\n                LIMIT 3\n            ")];
                    case 3:
                        recentRequests = _a.sent();
                        // Combine and sort activities
                        activities.push.apply(activities, __spreadArray(__spreadArray(__spreadArray([], recentSubjects, false), recentCourses, false), recentRequests, false));
                        activities.sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); });
                        return [2 /*return*/, activities.slice(0, limit).map(function (activity, index) { return ({
                                id: (index + 1).toString(),
                                type: activity.type,
                                description: activity.description,
                                timestamp: new Date(activity.timestamp).toISOString(),
                                user: activity.user
                            }); })];
                    case 4:
                        error_4 = _a.sent();
                        console.error('Error fetching recent activities:', error_4);
                        return [2 /*return*/, mockStats.recentActivities.slice(0, limit)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    getPendingRequestsCount: function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count \n                FROM student_subject_requests \n                WHERE status = 'pending'\n            ")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.count) || 0];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error fetching pending requests count:', error_5);
                        return [2 /*return*/, mockStats.pendingRequests];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
