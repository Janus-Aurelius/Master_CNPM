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
exports.grades = exports.gradeService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.gradeService = {
    getStudentGrades: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var grades_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    student_id as \"studentId\",\n                    subject_id as \"subjectId\",\n                    midterm_grade as \"midtermGrade\",\n                    final_grade as \"finalGrade\",\n                    total_grade as \"totalGrade\",\n                    letter_grade as \"letterGrade\"\n                FROM grades\n                WHERE student_id = $1\n                ORDER BY subject_id\n            ", [studentId])];
                    case 1:
                        grades_1 = _a.sent();
                        return [2 /*return*/, grades_1];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting student grades:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getSubjectDetails: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var grade, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    student_id as \"studentId\",\n                    subject_id as \"subjectId\",\n                    midterm_grade as \"midtermGrade\",\n                    final_grade as \"finalGrade\",\n                    total_grade as \"totalGrade\",\n                    letter_grade as \"letterGrade\"\n                FROM grades\n                WHERE student_id = $1 AND subject_id = $2\n            ", [studentId, subjectId])];
                    case 1:
                        grade = _a.sent();
                        return [2 /*return*/, grade || null];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting subject details:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    updateGrade: function (gradeData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingGrade, updatedGrade, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getSubjectDetails(gradeData.studentId, gradeData.subjectId)];
                    case 1:
                        existingGrade = _a.sent();
                        if (!existingGrade) return [3 /*break*/, 3];
                        // Update existing grade
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    UPDATE grades \n                    SET \n                        midterm_grade = $1,\n                        final_grade = $2,\n                        total_grade = $3,\n                        letter_grade = $4,\n                        updated_at = NOW()\n                    WHERE student_id = $5 AND subject_id = $6\n                ", [
                                gradeData.midtermGrade,
                                gradeData.finalGrade,
                                gradeData.totalGrade,
                                gradeData.letterGrade,
                                gradeData.studentId,
                                gradeData.subjectId
                            ])];
                    case 2:
                        // Update existing grade
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: 
                    // Insert new grade
                    return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    INSERT INTO grades (\n                        student_id,\n                        subject_id,\n                        midterm_grade,\n                        final_grade,\n                        total_grade,\n                        letter_grade,\n                        created_at,\n                        updated_at\n                    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())\n                ", [
                            gradeData.studentId,
                            gradeData.subjectId,
                            gradeData.midtermGrade,
                            gradeData.finalGrade,
                            gradeData.totalGrade,
                            gradeData.letterGrade
                        ])];
                    case 4:
                        // Insert new grade
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.getSubjectDetails(gradeData.studentId, gradeData.subjectId)];
                    case 6:
                        updatedGrade = _a.sent();
                        if (!updatedGrade) {
                            throw new Error('Failed to get updated grade');
                        }
                        return [2 /*return*/, updatedGrade];
                    case 7:
                        error_3 = _a.sent();
                        console.error('Error updating grade:', error_3);
                        throw error_3;
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
};
exports.grades = [];
