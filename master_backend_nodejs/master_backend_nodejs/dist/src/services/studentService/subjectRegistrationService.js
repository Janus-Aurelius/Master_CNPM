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
exports.subjectRegistrationService = exports.subjects = void 0;
// Mock data for subjects
var subjects = [
    {
        id: 'IT001',
        name: 'Nhập môn lập trình',
        lecturer: 'TS. Nguyễn Văn A',
        credits: 4,
        maxStudents: 60,
        currentStudents: 45,
        schedule: [
            { day: 'Thứ 2', session: '1', room: 'E3.1' },
            { day: 'Thứ 4', session: '2', room: 'E3.1' }
        ]
    },
    {
        id: 'IT002',
        name: 'Lập trình hướng đối tượng',
        lecturer: 'PGS. TS. Trần Thị B',
        credits: 4,
        maxStudents: 60,
        currentStudents: 40,
        schedule: [
            { day: 'Thứ 3', session: '2', room: 'E2.5' },
            { day: 'Thứ 5', session: '3', room: 'E2.5' }
        ]
    },
    {
        id: 'IT003',
        name: 'Cấu trúc dữ liệu và giải thuật',
        lecturer: 'TS. Lê Văn C',
        credits: 4,
        maxStudents: 60,
        currentStudents: 50,
        schedule: [
            { day: 'Thứ 4', session: '3', room: 'E4.2' },
            { day: 'Thứ 6', session: '4', room: 'E4.2' }
        ]
    },
    {
        id: 'SE001',
        name: 'Nhập môn công nghệ phần mềm',
        lecturer: 'TS. Phạm Thị D',
        credits: 3,
        maxStudents: 60,
        currentStudents: 35,
        schedule: [
            { day: 'Thứ 5', session: '4', room: 'B1.2' }
        ]
    },
    {
        id: 'MA001',
        name: 'Giải tích 1',
        lecturer: 'GS. TS. Trần Văn E',
        credits: 4,
        maxStudents: 70,
        currentStudents: 60,
        schedule: [
            { day: 'Thứ 2', session: '3', room: 'C2.1' },
            { day: 'Thứ 4', session: '1', room: 'C2.1' }
        ]
    }
];
exports.subjects = subjects;
exports.subjectRegistrationService = {
    getAvailableSubjects: function (semester) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement database query
                return [2 /*return*/, subjects.filter(function (subject) { return subject.currentStudents < subject.maxStudents; })];
            });
        });
    },
    searchSubjects: function (query, semester) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement database query
                return [2 /*return*/, subjects.filter(function (subject) {
                        return subject.name.toLowerCase().includes(query.toLowerCase()) ||
                            subject.id.toLowerCase().includes(query.toLowerCase());
                    })];
            });
        });
    },
    registerSubject: function (studentId, subjectId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var subject;
            return __generator(this, function (_a) {
                subject = subjects.find(function (s) { return s.id === subjectId; });
                if (!subject) {
                    throw new Error('Subject not found');
                }
                if (subject.currentStudents >= subject.maxStudents) {
                    throw new Error('Subject is full');
                }
                // Increment current students
                subject.currentStudents += 1;
                return [2 /*return*/, true];
            });
        });
    }
};
