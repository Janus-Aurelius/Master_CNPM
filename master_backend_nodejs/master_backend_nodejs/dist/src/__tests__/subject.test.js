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
var subject_business_1 = require("../business/academicBusiness/subject.business");
var globals_1 = require("@jest/globals");
// Define mock data first
var initialMockSubjects = [
    {
        subjectId: 'SE101',
        subjectName: 'Introduction to Software Engineering',
        subjectTypeId: 'LT',
        totalHours: 45
    },
    {
        subjectId: 'SE102',
        subjectName: 'Object-Oriented Programming',
        subjectTypeId: 'TH',
        totalHours: 60
    }
];
// Create a mutable copy for tests
var mockSubjects = __spreadArray([], initialMockSubjects, true);
// Mock Database
globals_1.jest.mock('../config/database', function () {
    var mockQuery = function (query, params) {
        // Get all subjects
        if (query.includes('SELECT * FROM MONHOC')) {
            return Promise.resolve(__spreadArray([], mockSubjects, true));
        }
        // Get subject by ID
        if (query.includes('WHERE MaMonHoc =')) {
            var id_1 = params === null || params === void 0 ? void 0 : params[0];
            var subject = mockSubjects.find(function (s) { return s.subjectId === id_1; });
            return Promise.resolve(subject ? [subject] : []);
        }
        // Create subject
        if (query.includes('INSERT INTO MONHOC')) {
            var newSubject = {
                subjectId: params === null || params === void 0 ? void 0 : params[0],
                subjectName: params === null || params === void 0 ? void 0 : params[1],
                subjectTypeId: params === null || params === void 0 ? void 0 : params[2],
                totalHours: params === null || params === void 0 ? void 0 : params[3]
            };
            mockSubjects.push(newSubject);
            return Promise.resolve([newSubject]);
        }
        return Promise.resolve([]);
    };
    return {
        query: mockQuery
    };
});
(0, globals_1.describe)('SubjectBusiness', function () {
    (0, globals_1.beforeEach)(function () {
        mockSubjects = __spreadArray([], initialMockSubjects, true);
    });
    (0, globals_1.test)('getAllSubjects should return all subjects', function () { return __awaiter(void 0, void 0, void 0, function () {
        var subjects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, subject_business_1.SubjectBusiness.getAllSubjects()];
                case 1:
                    subjects = _a.sent();
                    (0, globals_1.expect)(subjects).toHaveLength(2);
                    (0, globals_1.expect)(subjects[0].subjectId).toBe('SE101');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('getSubjectById should return correct subject', function () { return __awaiter(void 0, void 0, void 0, function () {
        var subject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, subject_business_1.SubjectBusiness.getSubjectById('SE101')];
                case 1:
                    subject = _a.sent();
                    (0, globals_1.expect)(subject).toBeDefined();
                    (0, globals_1.expect)(subject === null || subject === void 0 ? void 0 : subject.subjectName).toBe('Introduction to Software Engineering');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('createSubject should add new subject', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newSubject, created;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newSubject = {
                        subjectId: 'SE103',
                        subjectName: 'Database Systems',
                        subjectTypeId: 'LT',
                        totalHours: 45
                    };
                    return [4 /*yield*/, subject_business_1.SubjectBusiness.createSubject(newSubject)];
                case 1:
                    created = _a.sent();
                    (0, globals_1.expect)(created.subjectId).toBe('SE103');
                    (0, globals_1.expect)(mockSubjects).toHaveLength(3);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('updateSubject should modify existing subject', function () { return __awaiter(void 0, void 0, void 0, function () {
        var updateData, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateData = {
                        subjectName: 'Updated Name',
                        totalHours: 60
                    };
                    return [4 /*yield*/, subject_business_1.SubjectBusiness.updateSubject('SE101', updateData)];
                case 1:
                    updated = _a.sent();
                    (0, globals_1.expect)(updated.subjectName).toBe('Updated Name');
                    (0, globals_1.expect)(updated.totalHours).toBe(60);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('deleteSubject should remove subject', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, subject_business_1.SubjectBusiness.deleteSubject('SE101')];
                case 1:
                    _a.sent();
                    (0, globals_1.expect)(mockSubjects).toHaveLength(1);
                    (0, globals_1.expect)(mockSubjects[0].subjectId).toBe('SE102');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, globals_1.test)('validateSubjectData should return errors for invalid data', function () {
        var invalidData = {
            subjectName: 'Test Subject'
        };
        var errors = subject_business_1.SubjectBusiness.validateSubjectData(invalidData);
        (0, globals_1.expect)(errors).toContain('Subject ID is required');
        (0, globals_1.expect)(errors).toContain('Subject type is required');
        (0, globals_1.expect)(errors).toContain('Total hours is required');
    });
});
