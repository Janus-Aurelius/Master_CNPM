"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var subject_business_1 = require("../business/academicBusiness/subject.business");
var globals_1 = require("@jest/globals");
// Define mock data first
var initialMockSubjects = [
    {
        id: 1,
        subjectCode: 'SE101',
        name: 'Introduction to Software Engineering',
        credits: 3,
        description: 'Basic concepts of software engineering',
        prerequisiteSubjects: [],
        type: 'Required',
        department: 'Computer Science',
        lecturer: 'Dr. Smith',
        schedule: {
            day: 'Monday',
            session: 'Morning',
            fromTo: '8:00-11:00',
            room: 'A101'
        },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        subjectCode: 'SE102',
        name: 'Object-Oriented Programming',
        credits: 4,
        description: 'Advanced OOP concepts',
        prerequisiteSubjects: ['SE101'],
        type: 'Required',
        department: 'Computer Science',
        lecturer: 'Dr. Johnson',
        schedule: {
            day: 'Tuesday',
            session: 'Afternoon',
            fromTo: '13:00-16:00',
            room: 'B202'
        },
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
// Create a mutable copy for tests
var mockSubjects = __spreadArray([], initialMockSubjects, true);
// Mock Database
globals_1.jest.mock('../config/database', function () {
    var mockQuery = function (query, params) {
        // Get all subjects
        if (query.includes('SELECT * FROM subjects ORDER BY subject_code')) {
            return Promise.resolve(__spreadArray([], mockSubjects, true));
        }
        // Get subject by ID
        if (query.includes('SELECT * FROM subjects WHERE id =')) {
            var id_1 = params === null || params === void 0 ? void 0 : params[0];
            var subject = mockSubjects.find(function (s) { return s.id === id_1; });
            return Promise.resolve(subject ? [subject] : []);
        }
        // Create subject
        if (query.includes('INSERT INTO subjects')) {
            var newSubject = {
                id: mockSubjects.length + 1,
                subjectCode: params === null || params === void 0 ? void 0 : params[0],
                name: params === null || params === void 0 ? void 0 : params[1],
                credits: params === null || params === void 0 ? void 0 : params[2],
                description: params === null || params === void 0 ? void 0 : params[3],
                prerequisiteSubjects: JSON.parse((params === null || params === void 0 ? void 0 : params[4]) || '[]'),
                type: params === null || params === void 0 ? void 0 : params[5],
                department: params === null || params === void 0 ? void 0 : params[6],
                lecturer: params === null || params === void 0 ? void 0 : params[7],
                schedule: JSON.parse((params === null || params === void 0 ? void 0 : params[8]) || '{}'),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockSubjects.push(newSubject);
            return Promise.resolve([newSubject]);
        }
        // Update subject
        if (query.includes('UPDATE subjects')) {
            var id_2 = params === null || params === void 0 ? void 0 : params[7];
            var index = mockSubjects.findIndex(function (s) { return s.id === id_2; });
            if (index !== -1) {
                // Only update the fields that are provided
                mockSubjects[index] = __assign(__assign({}, mockSubjects[index]), { subjectCode: (params === null || params === void 0 ? void 0 : params[0]) || mockSubjects[index].subjectCode, name: (params === null || params === void 0 ? void 0 : params[1]) || mockSubjects[index].name, credits: (params === null || params === void 0 ? void 0 : params[2]) || mockSubjects[index].credits, description: (params === null || params === void 0 ? void 0 : params[3]) || mockSubjects[index].description, prerequisiteSubjects: (params === null || params === void 0 ? void 0 : params[4]) ? JSON.parse(params[4]) : mockSubjects[index].prerequisiteSubjects, type: (params === null || params === void 0 ? void 0 : params[5]) || mockSubjects[index].type, department: (params === null || params === void 0 ? void 0 : params[6]) || mockSubjects[index].department, updatedAt: new Date() });
                return Promise.resolve([mockSubjects[index]]);
            }
            return Promise.resolve([]);
        }
        // Delete subject
        if (query.includes('DELETE FROM subjects WHERE id =')) {
            var id_3 = params === null || params === void 0 ? void 0 : params[0];
            var index = mockSubjects.findIndex(function (s) { return s.id === id_3; });
            if (index !== -1) {
                mockSubjects.splice(index, 1);
            }
            return Promise.resolve([]);
        }
        // Check schedule conflicts
        if (query.includes("SELECT * FROM subjects") &&
            query.includes("WHERE schedule->>'day' = $1") &&
            query.includes("AND schedule->>'session' = $2") &&
            query.includes("AND schedule->>'room' = $3")) {
            var day_1 = params === null || params === void 0 ? void 0 : params[0];
            var session_1 = params === null || params === void 0 ? void 0 : params[1];
            var room_1 = params === null || params === void 0 ? void 0 : params[2];
            var matchingSubjects = mockSubjects.filter(function (s) {
                return s.schedule.day === day_1 &&
                    s.schedule.session === session_1 &&
                    s.schedule.room === room_1;
            });
            return Promise.resolve(matchingSubjects);
        }
        return Promise.resolve([]);
    };
    return {
        Database: {
            query: globals_1.jest.fn(mockQuery)
        }
    };
});
(0, globals_1.describe)('Subject Management Tests', function () {
    (0, globals_1.beforeEach)(function () {
        // Reset mock data before each test
        mockSubjects = __spreadArray([], initialMockSubjects, true);
    });
    (0, globals_1.test)('Get all subjects', function () { return __awaiter(void 0, void 0, void 0, function () {
        var subjects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, subject_business_1.SubjectBusiness.getAllSubjects()];
                case 1:
                    subjects = _a.sent();
                    (0, globals_1.expect)(subjects).toHaveLength(2);
                    (0, globals_1.expect)(subjects[0].subjectCode).toBe('SE101');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('Get subject by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
        var subject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, subject_business_1.SubjectBusiness.getSubjectById(1)];
                case 1:
                    subject = _a.sent();
                    (0, globals_1.expect)(subject).toBeDefined();
                    (0, globals_1.expect)(subject === null || subject === void 0 ? void 0 : subject.name).toBe('Introduction to Software Engineering');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('Create new subject', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newSubject, created;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newSubject = {
                        subjectCode: 'SE103',
                        name: 'Database Systems',
                        credits: 3,
                        description: 'Introduction to databases',
                        prerequisiteSubjects: ['SE101'],
                        type: 'Required',
                        department: 'Computer Science',
                        lecturer: 'Dr. Brown',
                        schedule: {
                            day: 'Wednesday',
                            session: 'Morning',
                            fromTo: '8:00-11:00',
                            room: 'C303'
                        }
                    };
                    return [4 /*yield*/, subject_business_1.SubjectBusiness.createSubject(newSubject)];
                case 1:
                    created = _a.sent();
                    (0, globals_1.expect)(created.subjectCode).toBe('SE103');
                    (0, globals_1.expect)(mockSubjects).toHaveLength(3);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('Update subject', function () { return __awaiter(void 0, void 0, void 0, function () {
        var updateData, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateData = {
                        name: 'Updated SE101',
                        credits: 4
                    };
                    return [4 /*yield*/, subject_business_1.SubjectBusiness.updateSubject(1, updateData)];
                case 1:
                    updated = _a.sent();
                    (0, globals_1.expect)(updated.name).toBe('Updated SE101');
                    (0, globals_1.expect)(updated.credits).toBe(4);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('Delete subject', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, subject_business_1.SubjectBusiness.deleteSubject(1)];
                case 1:
                    _a.sent();
                    (0, globals_1.expect)(mockSubjects).toHaveLength(1);
                    (0, globals_1.expect)(mockSubjects[0].id).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('Validate subject data', function () {
        var invalidData = {
            subjectCode: '',
            name: 'Test Subject'
        };
        var errors = subject_business_1.SubjectBusiness.validateSubjectData(invalidData);
        (0, globals_1.expect)(errors).toContain('Subject code is required');
    });
    (0, globals_1.test)('Check schedule conflicts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var conflictingSubject, conflicts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    conflictingSubject = {
                        schedule: {
                            day: 'Monday',
                            session: 'Morning',
                            fromTo: '8:00-11:00',
                            room: 'A101'
                        }
                    };
                    return [4 /*yield*/, subject_business_1.SubjectBusiness.checkScheduleConflicts(conflictingSubject)];
                case 1:
                    conflicts = _a.sent();
                    (0, globals_1.expect)(conflicts).toHaveLength(1);
                    (0, globals_1.expect)(conflicts[0]).toContain('Schedule conflict');
                    return [2 /*return*/];
            }
        });
    }); });
});
