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
exports.studentService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.studentService = { getStudentInfo: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    student_id as \"studentId\",\n                    full_name as \"fullName\",\n                    date_of_birth as \"dateOfBirth\",\n                    gender,\n                    hometown,\n                    district_id as \"districtId\",\n                    priority_object_id as \"priorityObjectId\",\n                    major_id as \"majorId\",\n                    email,\n                    phone,\n                    status\n                FROM students \n                WHERE student_id = $1\n            ", [studentId])];
                    case 1:
                        student = _a.sent();
                        if (!student)
                            return [2 /*return*/, null];
                        return [2 /*return*/, {
                                studentId: student.studentId,
                                fullName: student.fullName,
                                dateOfBirth: student.dateOfBirth,
                                gender: student.gender, hometown: student.hometown,
                                districtId: student.districtId,
                                priorityObjectId: student.priorityObjectId,
                                majorId: student.majorId,
                                email: student.email,
                                phone: student.phone
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting student info:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, updateStudentInfo: function (studentId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingStudent, updateData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getStudentInfo(studentId)];
                    case 1:
                        existingStudent = _a.sent();
                        if (!existingStudent)
                            return [2 /*return*/, null];
                        updateData = {};
                        if (data.fullName)
                            updateData.full_name = data.fullName;
                        if (data.email)
                            updateData.email = data.email;
                        if (data.phone)
                            updateData.phone = data.phone;
                        if (data.gender)
                            updateData.gender = data.gender;
                        if (data.hometown)
                            updateData.hometown = data.hometown;
                        if (data.districtId)
                            updateData.district_id = data.districtId;
                        if (data.priorityObjectId)
                            updateData.priority_object_id = data.priorityObjectId;
                        if (data.majorId)
                            updateData.major_id = data.majorId;
                        updateData.updated_at = new Date();
                        // Update student
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE students \n                SET ".concat(Object.keys(updateData).map(function (key, index) { return "".concat(key, " = $").concat(index + 1); }).join(', '), "\n                WHERE student_id = $").concat(Object.keys(updateData).length + 1, "\n            "), __spreadArray(__spreadArray([], Object.values(updateData), true), [studentId], false))];
                    case 2:
                        // Update student
                        _a.sent();
                        // Return updated student
                        return [2 /*return*/, this.getStudentInfo(studentId)];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error updating student info:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, createStudent: function (studentData) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, createdStudent, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        studentId = "SV".concat(Date.now().toString().slice(-6));
                        // Insert student
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO students (\n                    student_id,\n                    full_name,\n                    date_of_birth,\n                    gender,\n                    hometown,\n                    district_id,\n                    priority_object_id,\n                    major_id,\n                    email,\n                    phone,\n                    status,\n                    created_at,\n                    updated_at\n                ) VALUES (\n                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()\n                )\n            ", [
                                studentId,
                                studentData.fullName,
                                studentData.dateOfBirth,
                                studentData.gender,
                                studentData.hometown,
                                studentData.districtId,
                                studentData.priorityObjectId, studentData.majorId,
                                studentData.email,
                                studentData.phone
                            ])];
                    case 1:
                        // Insert student
                        _a.sent();
                        return [4 /*yield*/, this.getStudentInfo(studentId)];
                    case 2:
                        createdStudent = _a.sent();
                        if (!createdStudent) {
                            throw new Error('Failed to get created student');
                        }
                        return [2 /*return*/, createdStudent];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error creating student:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, deleteStudent: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingStudent, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getStudentInfo(studentId)];
                    case 1:
                        existingStudent = _a.sent();
                        if (!existingStudent)
                            return [2 /*return*/, false];
                        // Delete student
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                DELETE FROM students \n                WHERE student_id = $1\n            ", [studentId])];
                    case 2:
                        // Delete student
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error deleting student:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, getAllStudents: function () {
        return __awaiter(this, void 0, void 0, function () {
            var students, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    student_id as \"studentId\",\n                    full_name as \"fullName\",\n                    date_of_birth as \"dateOfBirth\",\n                    gender,\n                    hometown,\n                    district_id as \"districtId\",\n                    priority_object_id as \"priorityObjectId\",\n                    major_id as \"majorId\",\n                    email,\n                    phone,\n                    status\n                FROM students\n            ")];
                    case 1:
                        students = _a.sent();
                        return [2 /*return*/, students.map(function (student) { return ({
                                studentId: student.studentId,
                                fullName: student.fullName,
                                dateOfBirth: student.dateOfBirth,
                                gender: student.gender,
                                hometown: student.hometown,
                                districtId: student.districtId,
                                priorityObjectId: student.priorityObjectId,
                                majorId: student.majorId,
                                email: student.email,
                                phone: student.phone,
                                status: student.status
                            }); })];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting all students:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
