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
exports.SubjectBusiness = void 0;
var database_1 = require("../../config/database");
var SubjectBusiness = /** @class */ (function () {
    function SubjectBusiness() {
    }
    SubjectBusiness.getAllSubjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'SELECT * FROM subjects ORDER BY subject_code';
                        return [4 /*yield*/, database_1.Database.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SubjectBusiness.getSubjectById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'SELECT * FROM subjects WHERE id = $1';
                        return [4 /*yield*/, database_1.Database.query(query, [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    SubjectBusiness.createSubject = function (subjectData) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            INSERT INTO subjects (\n                subject_code, name, credits, description, \n                prerequisite_subjects, type, department, \n                lecturer, schedule\n            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)\n            RETURNING *\n        ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                subjectData.subjectCode,
                                subjectData.name,
                                subjectData.credits,
                                subjectData.description,
                                JSON.stringify(subjectData.prerequisiteSubjects),
                                subjectData.type,
                                subjectData.department,
                                subjectData.lecturer,
                                JSON.stringify(subjectData.schedule)
                            ])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    SubjectBusiness.updateSubject = function (id, subjectData) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            UPDATE subjects \n            SET subject_code = $1, name = $2, credits = $3, \n                description = $4, prerequisite_subjects = $5, \n                type = $6, department = $7\n            WHERE id = $8\n            RETURNING *\n        ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                subjectData.subjectCode,
                                subjectData.name,
                                subjectData.credits,
                                subjectData.description,
                                JSON.stringify(subjectData.prerequisiteSubjects),
                                subjectData.type,
                                subjectData.department,
                                id
                            ])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    SubjectBusiness.deleteSubject = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = 'DELETE FROM subjects WHERE id = $1';
                        return [4 /*yield*/, database_1.Database.query(query, [id])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SubjectBusiness.validateSubjectData = function (subjectData) {
        var _a, _b, _c, _d;
        var errors = [];
        if (!subjectData.subjectCode)
            errors.push('Subject code is required');
        if (!subjectData.name)
            errors.push('Subject name is required');
        if (!subjectData.credits)
            errors.push('Credits is required');
        if (!subjectData.type)
            errors.push('Type is required');
        if (!subjectData.department)
            errors.push('Department is required');
        if (!subjectData.lecturer)
            errors.push('Lecturer is required');
        if (!((_a = subjectData.schedule) === null || _a === void 0 ? void 0 : _a.day))
            errors.push('Day is required');
        if (!((_b = subjectData.schedule) === null || _b === void 0 ? void 0 : _b.session))
            errors.push('Session is required');
        if (!((_c = subjectData.schedule) === null || _c === void 0 ? void 0 : _c.fromTo))
            errors.push('Time is required');
        if (!((_d = subjectData.schedule) === null || _d === void 0 ? void 0 : _d.room))
            errors.push('Room is required');
        return errors;
    };
    SubjectBusiness.checkScheduleConflicts = function (subjectData) {
        return __awaiter(this, void 0, void 0, function () {
            var conflicts, query, existingSubjects;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        conflicts = [];
                        query = "\n            SELECT * FROM subjects \n            WHERE schedule->>'day' = $1 \n            AND schedule->>'session' = $2 \n            AND schedule->>'room' = $3\n        ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                (_a = subjectData.schedule) === null || _a === void 0 ? void 0 : _a.day,
                                (_b = subjectData.schedule) === null || _b === void 0 ? void 0 : _b.session,
                                (_c = subjectData.schedule) === null || _c === void 0 ? void 0 : _c.room
                            ])];
                    case 1:
                        existingSubjects = _d.sent();
                        if (existingSubjects.length > 0) {
                            conflicts.push('Schedule conflict: Room already booked for this time slot');
                        }
                        return [2 /*return*/, conflicts];
                }
            });
        });
    };
    return SubjectBusiness;
}());
exports.SubjectBusiness = SubjectBusiness;
