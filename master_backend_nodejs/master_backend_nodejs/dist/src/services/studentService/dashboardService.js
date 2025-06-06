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
var subjectRegistrationService_1 = require("./subjectRegistrationService");
// Mock data for students
var students = [
    {
        studentId: 'SV001',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        address: 'Quận 1, TP.HCM',
        dateOfBirth: new Date('2003-01-15'),
        enrollmentYear: 2022,
        major: 'Công nghệ thông tin',
        faculty: 'Khoa học và Kỹ thuật Máy tính',
        program: 'Cử nhân',
        status: 'active',
        avatarUrl: 'https://example.com/avatar1.jpg',
        credits: {
            completed: 64,
            current: 8,
            required: 145
        }
    },
    {
        studentId: 'SV002',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0912345678',
        address: 'Quận 2, TP.HCM',
        dateOfBirth: new Date('2002-05-22'),
        enrollmentYear: 2021,
        major: 'Khoa học máy tính',
        faculty: 'Khoa học và Kỹ thuật Máy tính',
        program: 'Cử nhân',
        status: 'active',
        avatarUrl: 'https://example.com/avatar2.jpg',
        credits: {
            completed: 79,
            current: 12,
            required: 145
        }
    }
];
// Mock class data from subjects
var classes = subjectRegistrationService_1.subjects.map(function (subject) { return ({
    id: "C".concat(subject.id),
    subjectId: subject.id,
    subjectName: subject.name,
    lecturer: subject.lecturer,
    day: subject.schedule[0].day,
    time: "".concat(subject.schedule[0].session === '1' ? '7:30-9:30' :
        subject.schedule[0].session === '2' ? '9:30-11:30' :
            subject.schedule[0].session === '3' ? '13:30-15:30' : '15:30-17:30'),
    room: subject.schedule[0].room
}); });
// Mock data for student schedules
var schedules = [
    {
        student: students[0],
        semester: '2025-1',
        subjects: [
            {
                id: 'IT001',
                name: 'Nhập môn lập trình',
                credit: 4,
                schedule: [
                    { day: 'Thứ 2', time: '7:30-9:30', room: 'E3.1' },
                    { day: 'Thứ 4', time: '9:30-11:30', room: 'E3.1' }
                ],
                lecturer: 'TS. Nguyễn Văn A'
            },
            {
                id: 'IT002',
                name: 'Lập trình hướng đối tượng',
                credit: 4,
                schedule: [
                    { day: 'Thứ 3', time: '9:30-11:30', room: 'E2.5' },
                    { day: 'Thứ 5', time: '13:30-15:30', room: 'E2.5' }
                ],
                lecturer: 'PGS. TS. Trần Thị B'
            }
        ]
    },
    {
        student: students[1],
        semester: '2025-1',
        subjects: [
            {
                id: 'IT003',
                name: 'Cấu trúc dữ liệu và giải thuật',
                credit: 4,
                schedule: [
                    { day: 'Thứ 4', time: '13:30-15:30', room: 'E4.2' },
                    { day: 'Thứ 6', time: '15:30-17:30', room: 'E4.2' }
                ],
                lecturer: 'TS. Lê Văn C'
            }
        ]
    }
];
// Mock data for student overviews
var overviews = [
    {
        student: students[0],
        enrolledSubjects: 2,
        totalCredits: 8,
        gpa: 3.5,
        upcomingClasses: [
            classes[0],
            classes[1]
        ], recentPayments: [
            {
                id: 1001,
                studentId: 'SV001',
                courseId: 1,
                amount: 8000000,
                date: '2025-02-15',
                status: 'paid',
                paymentMethod: 'bank_transfer',
                transactionId: 'TXN-1001'
            }
        ]
    },
    {
        student: students[1],
        enrolledSubjects: 3,
        totalCredits: 10,
        gpa: 3.7,
        upcomingClasses: [
            classes[2]
        ], recentPayments: [
            {
                id: 1002,
                studentId: 'SV002',
                courseId: 2,
                amount: 10000000,
                date: '2025-02-10',
                status: 'paid',
                paymentMethod: 'credit_card',
                transactionId: 'TXN-1002'
            }
        ]
    }
];
exports.dashboardService = {
    getStudentOverview: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, overviews.find(function (overview) { return overview.student.studentId === studentId; }) || null];
            });
        });
    },
    getStudentSchedule: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, schedules.find(function (schedule) { return schedule.student.studentId === studentId; }) || null];
            });
        });
    },
    updateStudentOverview: function (overview) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                index = overviews.findIndex(function (o) { return o.student.studentId === overview.student.studentId; });
                if (index !== -1) {
                    overviews[index] = overview;
                }
                else {
                    overviews.push(overview);
                }
                return [2 /*return*/, overview];
            });
        });
    }
};
