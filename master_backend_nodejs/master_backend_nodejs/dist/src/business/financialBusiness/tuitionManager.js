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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTuitionRecordsForSemester = exports.calculateTuitionForMultipleStudents = exports.adjustTuition = exports.deleteTuitionRecord = exports.getTuitionRecord = exports.updateTuitionRecord = exports.createTuitionRecord = exports.calculateTuitionForStudent = void 0;
var databaseService_1 = require("../../services/database/databaseService");
var errorHandler_1 = require("../../middleware/errorHandler");
// Utility function to get current semester
var getCurrentSemester = function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; // JavaScript months are 0-indexed
    if (month >= 1 && month <= 5) {
        return "Spring ".concat(year);
    }
    else if (month >= 6 && month <= 8) {
        return "Summer ".concat(year);
    }
    else {
        return "Fall ".concat(year);
    }
};
// Tuition Calculation Functions
var calculateTuitionForStudent = function (studentId, semester, courseList) { return __awaiter(void 0, void 0, void 0, function () {
    var student, totalTuition, courses, enrolled, discountAmount, discountPercentage, finalAmount, additionalFees, additionalFeesAmount, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (!studentId || !semester) {
                    throw new errorHandler_1.AppError(400, 'Student ID and semester are required');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT s.*, dt.discount_percentage, dt.discount_amount, dt.priority_name\n            FROM students s\n            LEFT JOIN doituonguutien dt ON s.priority_object_id = dt.priority_object_id\n            WHERE s.student_id = $1\n        ", [studentId])];
            case 1:
                student = _a.sent();
                if (!student) {
                    throw new errorHandler_1.AppError(404, 'Student not found');
                }
                totalTuition = 0;
                courses = [];
                if (!(courseList && courseList.length > 0)) return [3 /*break*/, 2];
                // Use provided course list
                courses = courseList;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    c.course_code,\n                    c.course_name,\n                    c.credits,\n                    lm.credit_price,\n                    lm.type_name as fee_type\n                FROM enrollments e\n                JOIN courses c ON e.course_code = c.course_code\n                LEFT JOIN loaimon lm ON c.course_type_id = lm.course_type_id\n                WHERE e.student_id = $1 AND e.semester = $2\n            ", [studentId, semester])];
            case 3:
                enrolled = _a.sent();
                courses = enrolled.map(function (course) { return ({
                    courseCode: course.course_code,
                    courseName: course.course_name,
                    credits: course.credits,
                    creditPrice: parseFloat(course.credit_price || 0),
                    feeType: course.fee_type || 'REGULAR',
                    amount: course.credits * parseFloat(course.credit_price || 0)
                }); });
                _a.label = 4;
            case 4:
                // Calculate total tuition from courses
                totalTuition = courses.reduce(function (total, course) { return total + course.amount; }, 0);
                discountAmount = 0;
                discountPercentage = 0;
                if (student.discount_percentage) {
                    discountPercentage = parseFloat(student.discount_percentage);
                    discountAmount = totalTuition * (discountPercentage / 100);
                }
                else if (student.discount_amount) {
                    discountAmount = parseFloat(student.discount_amount);
                    discountPercentage = (discountAmount / totalTuition) * 100;
                }
                finalAmount = totalTuition - discountAmount;
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT fee_type, amount, description\n            FROM semester_fees\n            WHERE semester = $1 AND is_active = true\n        ", [semester])];
            case 5:
                additionalFees = _a.sent();
                additionalFeesAmount = additionalFees.reduce(function (total, fee) { return total + parseFloat(fee.amount); }, 0);
                result = {
                    studentId: studentId,
                    semester: semester,
                    baseTuition: totalTuition,
                    discountAmount: discountAmount,
                    discountPercentage: discountPercentage,
                    additionalFees: additionalFeesAmount,
                    totalAmount: finalAmount + additionalFeesAmount,
                    courses: courses,
                    priorityObject: student.priority_name || null,
                    calculatedAt: new Date(),
                    breakdown: {
                        courseFees: totalTuition,
                        discounts: discountAmount,
                        additionalCharges: additionalFeesAmount,
                        netAmount: finalAmount + additionalFeesAmount
                    },
                    feeStructure: additionalFees.map(function (fee) { return ({
                        type: fee.fee_type,
                        amount: parseFloat(fee.amount),
                        description: fee.description
                    }); })
                };
                return [2 /*return*/, result];
            case 6:
                error_1 = _a.sent();
                if (error_1 instanceof errorHandler_1.AppError)
                    throw error_1;
                console.error('Error calculating tuition:', error_1);
                throw new errorHandler_1.AppError(500, 'Error calculating tuition for student');
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.calculateTuitionForStudent = calculateTuitionForStudent;
var createTuitionRecord = function (tuitionData) { return __awaiter(void 0, void 0, void 0, function () {
    var existing, tuitionRecord, recordId, _i, _a, course, error_2, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 13, , 14]);
                // Start transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('BEGIN')];
            case 1:
                // Start transaction
                _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 10, , 12]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT id FROM tuition_records \n                WHERE student_id = $1 AND semester = $2\n            ", [tuitionData.studentId, tuitionData.semester])];
            case 3:
                existing = _b.sent();
                if (existing) {
                    throw new errorHandler_1.AppError(409, 'Tuition record already exists for this semester');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO tuition_records (\n                    student_id,\n                    semester,\n                    total_amount,\n                    paid_amount,\n                    outstanding_amount,\n                    discount_amount,\n                    discount_percentage,\n                    additional_fees,\n                    payment_status,\n                    due_date,\n                    created_at\n                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())\n                RETURNING *\n            ", [
                        tuitionData.studentId,
                        tuitionData.semester,
                        tuitionData.totalAmount,
                        0, // paid_amount starts at 0
                        tuitionData.totalAmount, // outstanding_amount equals total initially
                        tuitionData.discountAmount || 0,
                        tuitionData.discountPercentage || 0,
                        tuitionData.additionalFees || 0,
                        'PENDING',
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
                    ])];
            case 4:
                tuitionRecord = _b.sent();
                recordId = tuitionRecord[0].id;
                if (!(tuitionData.courses && tuitionData.courses.length > 0)) return [3 /*break*/, 8];
                _i = 0, _a = tuitionData.courses;
                _b.label = 5;
            case 5:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                course = _a[_i];
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                        INSERT INTO tuition_course_items (\n                            tuition_record_id,\n                            course_code,\n                            course_name,\n                            credits,\n                            fee_type,\n                            amount,\n                            paid_amount,\n                            status,\n                            created_at\n                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())\n                    ", [
                        recordId,
                        course.courseCode,
                        course.courseName,
                        course.credits,
                        course.feeType,
                        course.amount,
                        0, // paid_amount starts at 0
                        'PENDING'
                    ])];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8: 
            // Commit transaction
            return [4 /*yield*/, databaseService_1.DatabaseService.query('COMMIT')];
            case 9:
                // Commit transaction
                _b.sent();
                return [2 /*return*/, {
                        success: true,
                        tuitionRecordId: recordId,
                        message: 'Tuition record created successfully',
                        data: tuitionRecord[0]
                    }];
            case 10:
                error_2 = _b.sent();
                // Rollback on error
                return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
            case 11:
                // Rollback on error
                _b.sent();
                throw error_2;
            case 12: return [3 /*break*/, 14];
            case 13:
                error_3 = _b.sent();
                if (error_3 instanceof errorHandler_1.AppError)
                    throw error_3;
                console.error('Error creating tuition record:', error_3);
                throw new errorHandler_1.AppError(500, 'Error creating tuition record');
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.createTuitionRecord = createTuitionRecord;
var updateTuitionRecord = function (studentId, semester, updateData) { return __awaiter(void 0, void 0, void 0, function () {
    var existing, updateFields, updateValues, paramIndex, _i, _a, course, error_4, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 15, , 16]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT * FROM tuition_records \n            WHERE student_id = $1 AND semester = $2\n        ", [studentId, semester])];
            case 1:
                existing = _b.sent();
                if (!existing) {
                    throw new errorHandler_1.AppError(404, 'Tuition record not found');
                }
                // Start transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('BEGIN')];
            case 2:
                // Start transaction
                _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 12, , 14]);
                updateFields = [];
                updateValues = [];
                paramIndex = 1;
                if (updateData.totalAmount !== undefined) {
                    updateFields.push("total_amount = $".concat(paramIndex));
                    updateValues.push(updateData.totalAmount);
                    paramIndex++;
                }
                if (updateData.discountAmount !== undefined) {
                    updateFields.push("discount_amount = $".concat(paramIndex));
                    updateValues.push(updateData.discountAmount);
                    paramIndex++;
                }
                if (updateData.discountPercentage !== undefined) {
                    updateFields.push("discount_percentage = $".concat(paramIndex));
                    updateValues.push(updateData.discountPercentage);
                    paramIndex++;
                }
                if (updateData.additionalFees !== undefined) {
                    updateFields.push("additional_fees = $".concat(paramIndex));
                    updateValues.push(updateData.additionalFees);
                    paramIndex++;
                }
                if (!(updateFields.length > 0)) return [3 /*break*/, 5];
                updateFields.push("updated_at = NOW()");
                updateValues.push(studentId, semester);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    UPDATE tuition_records \n                    SET ".concat(updateFields.join(', '), "\n                    WHERE student_id = $").concat(paramIndex, " AND semester = $").concat(paramIndex + 1, "\n                "), updateValues)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                if (!(updateData.courses && updateData.courses.length > 0)) return [3 /*break*/, 10];
                // Delete existing course items
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    DELETE FROM tuition_course_items \n                    WHERE tuition_record_id = $1\n                ", [existing.id])];
            case 6:
                // Delete existing course items
                _b.sent();
                _i = 0, _a = updateData.courses;
                _b.label = 7;
            case 7:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                course = _a[_i];
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                        INSERT INTO tuition_course_items (\n                            tuition_record_id,\n                            course_code,\n                            course_name,\n                            credits,\n                            fee_type,\n                            amount,\n                            paid_amount,\n                            status,\n                            created_at\n                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())\n                    ", [
                        existing.id,
                        course.courseCode,
                        course.courseName,
                        course.credits,
                        course.feeType,
                        course.amount,
                        0, // Reset paid amount
                        'PENDING'
                    ])];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10: 
            // Commit transaction
            return [4 /*yield*/, databaseService_1.DatabaseService.query('COMMIT')];
            case 11:
                // Commit transaction
                _b.sent();
                return [2 /*return*/, {
                        success: true,
                        message: 'Tuition record updated successfully'
                    }];
            case 12:
                error_4 = _b.sent();
                // Rollback on error
                return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
            case 13:
                // Rollback on error
                _b.sent();
                throw error_4;
            case 14: return [3 /*break*/, 16];
            case 15:
                error_5 = _b.sent();
                if (error_5 instanceof errorHandler_1.AppError)
                    throw error_5;
                console.error('Error updating tuition record:', error_5);
                throw new errorHandler_1.AppError(500, 'Error updating tuition record');
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.updateTuitionRecord = updateTuitionRecord;
var getTuitionRecord = function (studentId, semester) { return __awaiter(void 0, void 0, void 0, function () {
    var currentSemester, record, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                currentSemester = semester || getCurrentSemester();
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                tr.*,\n                s.full_name as student_name,\n                s.faculty,\n                s.program,\n                dt.priority_name,\n                COALESCE(\n                    JSON_AGG(\n                        JSON_BUILD_OBJECT(\n                            'id', tci.id,\n                            'course_code', tci.course_code,\n                            'course_name', tci.course_name,\n                            'credits', tci.credits,\n                            'fee_type', tci.fee_type,\n                            'amount', tci.amount,\n                            'paid_amount', tci.paid_amount,\n                            'status', tci.status\n                        )\n                    ) FILTER (WHERE tci.id IS NOT NULL), \n                    '[]'::json\n                ) as courses\n            FROM tuition_records tr\n            JOIN students s ON tr.student_id = s.student_id\n            LEFT JOIN doituonguutien dt ON s.priority_object_id = dt.priority_object_id\n            LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id\n            WHERE tr.student_id = $1 AND tr.semester = $2\n            GROUP BY tr.id, s.full_name, s.faculty, s.program, dt.priority_name\n        ", [studentId, currentSemester])];
            case 1:
                record = _a.sent();
                if (!record) {
                    throw new errorHandler_1.AppError(404, 'Tuition record not found');
                }
                return [2 /*return*/, __assign(__assign({}, record), { total_amount: parseFloat(record.total_amount), paid_amount: parseFloat(record.paid_amount), outstanding_amount: parseFloat(record.outstanding_amount), discount_amount: parseFloat(record.discount_amount || 0), additional_fees: parseFloat(record.additional_fees || 0), courses: typeof record.courses === 'string' ? JSON.parse(record.courses) : record.courses })];
            case 2:
                error_6 = _a.sent();
                if (error_6 instanceof errorHandler_1.AppError)
                    throw error_6;
                console.error('Error getting tuition record:', error_6);
                throw new errorHandler_1.AppError(500, 'Error retrieving tuition record');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTuitionRecord = getTuitionRecord;
var deleteTuitionRecord = function (studentId, semester) { return __awaiter(void 0, void 0, void 0, function () {
    var record, error_7, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT * FROM tuition_records \n            WHERE student_id = $1 AND semester = $2\n        ", [studentId, semester])];
            case 1:
                record = _a.sent();
                if (!record) {
                    throw new errorHandler_1.AppError(404, 'Tuition record not found');
                }
                if (parseFloat(record.paid_amount) > 0) {
                    throw new errorHandler_1.AppError(400, 'Cannot delete tuition record with existing payments');
                }
                // Start transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('BEGIN')];
            case 2:
                // Start transaction
                _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 7, , 9]);
                // Delete course items first
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                DELETE FROM tuition_course_items \n                WHERE tuition_record_id = $1\n            ", [record.id])];
            case 4:
                // Delete course items first
                _a.sent();
                // Delete main record
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                DELETE FROM tuition_records \n                WHERE student_id = $1 AND semester = $2\n            ", [studentId, semester])];
            case 5:
                // Delete main record
                _a.sent();
                // Commit transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('COMMIT')];
            case 6:
                // Commit transaction
                _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: 'Tuition record deleted successfully'
                    }];
            case 7:
                error_7 = _a.sent();
                // Rollback on error
                return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
            case 8:
                // Rollback on error
                _a.sent();
                throw error_7;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_8 = _a.sent();
                if (error_8 instanceof errorHandler_1.AppError)
                    throw error_8;
                console.error('Error deleting tuition record:', error_8);
                throw new errorHandler_1.AppError(500, 'Error deleting tuition record');
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.deleteTuitionRecord = deleteTuitionRecord;
// Tuition Adjustment Functions
var adjustTuition = function (studentId, semester, adjustmentData) { return __awaiter(void 0, void 0, void 0, function () {
    var record, currentTotal, currentPaid, newTotal, newOutstanding, error_9, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT * FROM tuition_records \n            WHERE student_id = $1 AND semester = $2\n        ", [studentId, semester])];
            case 1:
                record = _a.sent();
                if (!record) {
                    throw new errorHandler_1.AppError(404, 'Tuition record not found');
                }
                currentTotal = parseFloat(record.total_amount);
                currentPaid = parseFloat(record.paid_amount);
                newTotal = void 0;
                if (adjustmentData.type === 'DISCOUNT') {
                    newTotal = currentTotal - Math.abs(adjustmentData.amount);
                }
                else if (adjustmentData.type === 'SURCHARGE') {
                    newTotal = currentTotal + Math.abs(adjustmentData.amount);
                }
                else { // CORRECTION
                    newTotal = adjustmentData.amount; // Direct correction to total
                }
                if (newTotal < 0) {
                    throw new errorHandler_1.AppError(400, 'Adjusted tuition cannot be negative');
                }
                newOutstanding = Math.max(0, newTotal - currentPaid);
                // Start transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('BEGIN')];
            case 2:
                // Start transaction
                _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 7, , 9]);
                // Update tuition record
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE tuition_records \n                SET \n                    total_amount = $1,\n                    outstanding_amount = $2,\n                    updated_at = NOW()\n                WHERE student_id = $3 AND semester = $4\n            ", [newTotal, newOutstanding, studentId, semester])];
            case 4:
                // Update tuition record
                _a.sent();
                // Create adjustment log
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO tuition_adjustments (\n                    tuition_record_id,\n                    student_id,\n                    adjustment_type,\n                    amount,\n                    previous_total,\n                    new_total,\n                    reason,\n                    performed_by,\n                    created_at\n                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())\n            ", [
                        record.id,
                        studentId,
                        adjustmentData.type,
                        adjustmentData.amount,
                        currentTotal,
                        newTotal,
                        adjustmentData.reason,
                        adjustmentData.performedBy
                    ])];
            case 5:
                // Create adjustment log
                _a.sent();
                // Commit transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('COMMIT')];
            case 6:
                // Commit transaction
                _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: 'Tuition adjusted successfully',
                        adjustment: {
                            type: adjustmentData.type,
                            amount: adjustmentData.amount,
                            previousTotal: currentTotal,
                            newTotal: newTotal,
                            reason: adjustmentData.reason
                        }
                    }];
            case 7:
                error_9 = _a.sent();
                // Rollback on error
                return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
            case 8:
                // Rollback on error
                _a.sent();
                throw error_9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_10 = _a.sent();
                if (error_10 instanceof errorHandler_1.AppError)
                    throw error_10;
                console.error('Error adjusting tuition:', error_10);
                throw new errorHandler_1.AppError(500, 'Error adjusting tuition');
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.adjustTuition = adjustTuition;
// Bulk operations
var calculateTuitionForMultipleStudents = function (studentIds, semester) { return __awaiter(void 0, void 0, void 0, function () {
    var results, _i, studentIds_1, studentId, calculation, error_11, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                results = [];
                _i = 0, studentIds_1 = studentIds;
                _a.label = 1;
            case 1:
                if (!(_i < studentIds_1.length)) return [3 /*break*/, 6];
                studentId = studentIds_1[_i];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, exports.calculateTuitionForStudent)(studentId, semester)];
            case 3:
                calculation = _a.sent();
                results.push({
                    studentId: studentId,
                    success: true,
                    data: calculation
                });
                return [3 /*break*/, 5];
            case 4:
                error_11 = _a.sent();
                results.push({
                    studentId: studentId,
                    success: false,
                    error: error_11 instanceof Error ? error_11.message : 'Unknown error'
                });
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, results];
            case 7:
                error_12 = _a.sent();
                console.error('Error calculating tuition for multiple students:', error_12);
                throw new errorHandler_1.AppError(500, 'Error calculating tuition for multiple students');
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.calculateTuitionForMultipleStudents = calculateTuitionForMultipleStudents;
var createTuitionRecordsForSemester = function (semester, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var whereConditions, queryParams, paramIndex, students, results, successCount, errorCount, _i, students_1, student, calculation, error_13, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                whereConditions = ['1 = 1'];
                queryParams = [];
                paramIndex = 1;
                if (filters === null || filters === void 0 ? void 0 : filters.faculty) {
                    whereConditions.push("faculty = $".concat(paramIndex));
                    queryParams.push(filters.faculty);
                    paramIndex++;
                }
                if (filters === null || filters === void 0 ? void 0 : filters.program) {
                    whereConditions.push("program = $".concat(paramIndex));
                    queryParams.push(filters.program);
                    paramIndex++;
                }
                if (filters === null || filters === void 0 ? void 0 : filters.year) {
                    whereConditions.push("student_year = $".concat(paramIndex));
                    queryParams.push(filters.year);
                    paramIndex++;
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT student_id FROM students \n            WHERE ".concat(whereConditions.join(' AND '), " \n            AND status = 'ACTIVE'\n        "), queryParams)];
            case 1:
                students = _a.sent();
                results = [];
                successCount = 0;
                errorCount = 0;
                _i = 0, students_1 = students;
                _a.label = 2;
            case 2:
                if (!(_i < students_1.length)) return [3 /*break*/, 8];
                student = students_1[_i];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, (0, exports.calculateTuitionForStudent)(student.student_id, semester)];
            case 4:
                calculation = _a.sent();
                return [4 /*yield*/, (0, exports.createTuitionRecord)(calculation)];
            case 5:
                _a.sent();
                results.push({
                    studentId: student.student_id,
                    success: true
                });
                successCount++;
                return [3 /*break*/, 7];
            case 6:
                error_13 = _a.sent();
                results.push({
                    studentId: student.student_id,
                    success: false,
                    error: error_13 instanceof Error ? error_13.message : 'Unknown error'
                });
                errorCount++;
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8: return [2 /*return*/, {
                    success: true,
                    summary: {
                        totalStudents: students.length,
                        successCount: successCount,
                        errorCount: errorCount
                    },
                    details: results
                }];
            case 9:
                error_14 = _a.sent();
                console.error('Error creating tuition records for semester:', error_14);
                throw new errorHandler_1.AppError(500, 'Error creating tuition records for semester');
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.createTuitionRecordsForSemester = createTuitionRecordsForSemester;
exports.default = {
    calculateTuitionForStudent: exports.calculateTuitionForStudent,
    createTuitionRecord: exports.createTuitionRecord,
    updateTuitionRecord: exports.updateTuitionRecord,
    getTuitionRecord: exports.getTuitionRecord,
    deleteTuitionRecord: exports.deleteTuitionRecord,
    adjustTuition: exports.adjustTuition,
    calculateTuitionForMultipleStudents: exports.calculateTuitionForMultipleStudents,
    createTuitionRecordsForSemester: exports.createTuitionRecordsForSemester
};
