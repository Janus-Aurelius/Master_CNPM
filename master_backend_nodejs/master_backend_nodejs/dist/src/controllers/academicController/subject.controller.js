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
exports.SubjectController = void 0;
var subject_business_1 = require("../../business/academicBusiness/subject.business");
var SubjectController = /** @class */ (function () {
    function SubjectController() {
    }
    SubjectController.getAllSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, subject_business_1.SubjectBusiness.getAllSubjects()];
                    case 1:
                        subjects = _a.sent();
                        res.status(200).json({ success: true, data: subjects });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({ success: false, message: 'Error fetching subjects', error: error_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SubjectController.getSubjectById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var subjectId, subject, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        subjectId = req.params.subjectId;
                        return [4 /*yield*/, subject_business_1.SubjectBusiness.getSubjectById(subjectId)];
                    case 1:
                        subject = _a.sent();
                        if (!subject) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Subject not found' })];
                        }
                        res.status(200).json({ success: true, data: subject });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(500).json({ success: false, message: 'Error fetching subject', error: error_2 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SubjectController.createSubject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var subjectData, errors, conflicts, newSubject, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        subjectData = req.body;
                        errors = subject_business_1.SubjectBusiness.validateSubjectData(subjectData);
                        if (errors.length > 0) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Validation failed',
                                    errors: errors
                                })];
                        }
                        return [4 /*yield*/, subject_business_1.SubjectBusiness.checkScheduleConflicts(subjectData)];
                    case 1:
                        conflicts = _a.sent();
                        if (conflicts.length > 0) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Schedule conflicts found',
                                    conflicts: conflicts
                                })];
                        }
                        return [4 /*yield*/, subject_business_1.SubjectBusiness.createSubject(subjectData)];
                    case 2:
                        newSubject = _a.sent();
                        res.status(201).json({ success: true, data: newSubject });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error creating subject:', error_3);
                        res.status(500).json({
                            success: false,
                            message: 'Error creating subject',
                            error: error_3 instanceof Error ? error_3.message : 'Unknown error'
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SubjectController.updateSubject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var subjectId, subjectData, updatedSubject, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        subjectId = req.params.subjectId;
                        subjectData = req.body;
                        return [4 /*yield*/, subject_business_1.SubjectBusiness.updateSubject(subjectId, subjectData)];
                    case 1:
                        updatedSubject = _a.sent();
                        res.status(200).json({ success: true, data: updatedSubject });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(500).json({ success: false, message: 'Error updating subject', error: error_4 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SubjectController.deleteSubject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var subjectId, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        subjectId = req.params.subjectId;
                        return [4 /*yield*/, subject_business_1.SubjectBusiness.deleteSubject(subjectId)];
                    case 1:
                        _a.sent();
                        res.status(200).json({ success: true, message: 'Subject deleted successfully' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(500).json({ success: false, message: 'Error deleting subject', error: error_5 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SubjectController;
}());
exports.SubjectController = SubjectController;
