"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var financialConfigService_1 = require("../../services/financialService/financialConfigService");
// Import individual functions from financialManager
var financialBusiness = __importStar(require("../../business/financialBusiness/financialManager"));
var FinancialController = /** @class */ (function () {
    function FinancialController() {
    }
    // === PRIORITY OBJECT MANAGEMENT ===
    FinancialController.prototype.getAllPriorityObjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var priorityObjects, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, financialConfigService_1.priorityObjectService.getAllPriorityObjects()];
                    case 1:
                        priorityObjects = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: priorityObjects
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting priority objects:', error_1);
                        res.status(500).json({
                            success: false,
                            message: error_1.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.getPriorityObjectById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, priorityObject, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, financialConfigService_1.priorityObjectService.getPriorityObjectById(id)];
                    case 1:
                        priorityObject = _a.sent();
                        if (!priorityObject) {
                            res.status(404).json({
                                success: false,
                                message: 'Priority object not found'
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            success: true,
                            data: priorityObject
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting priority object:', error_2);
                        res.status(500).json({
                            success: false,
                            message: error_2.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.createPriorityObject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, priorityName, discountAmount, newPriorityObject, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, priorityName = _a.priorityName, discountAmount = _a.discountAmount;
                        if (!priorityName || discountAmount === undefined) {
                            res.status(400).json({
                                success: false,
                                message: 'Priority name and discount amount are required'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, financialConfigService_1.priorityObjectService.createPriorityObject({
                                priorityName: priorityName,
                                discountAmount: parseFloat(discountAmount)
                            })];
                    case 1:
                        newPriorityObject = _b.sent();
                        res.status(201).json({
                            success: true,
                            data: newPriorityObject,
                            message: 'Priority object created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Error creating priority object:', error_3);
                        res.status(500).json({
                            success: false,
                            message: error_3.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.updatePriorityObject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, priorityName, discountAmount, updateData, updatedPriorityObject, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.body, priorityName = _a.priorityName, discountAmount = _a.discountAmount;
                        updateData = {};
                        if (priorityName !== undefined)
                            updateData.priorityName = priorityName;
                        if (discountAmount !== undefined)
                            updateData.discountAmount = parseFloat(discountAmount);
                        return [4 /*yield*/, financialConfigService_1.priorityObjectService.updatePriorityObject(id, updateData)];
                    case 1:
                        updatedPriorityObject = _b.sent();
                        if (!updatedPriorityObject) {
                            res.status(404).json({
                                success: false,
                                message: 'Priority object not found'
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            success: true,
                            data: updatedPriorityObject,
                            message: 'Priority object updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        console.error('Error updating priority object:', error_4);
                        res.status(500).json({
                            success: false,
                            message: error_4.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.deletePriorityObject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, deleted, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, financialConfigService_1.priorityObjectService.deletePriorityObject(id)];
                    case 1:
                        deleted = _a.sent();
                        if (!deleted) {
                            res.status(404).json({
                                success: false,
                                message: 'Priority object not found'
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            success: true,
                            message: 'Priority object deleted successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error deleting priority object:', error_5);
                        res.status(500).json({
                            success: false,
                            message: error_5.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // === COURSE TYPE MANAGEMENT ===
    FinancialController.prototype.getAllCourseTypes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var courseTypes, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, financialConfigService_1.courseTypeService.getAllCourseTypes()];
                    case 1:
                        courseTypes = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: courseTypes
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error getting course types:', error_6);
                        res.status(500).json({
                            success: false,
                            message: error_6.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.getCourseTypeById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, courseType, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, financialConfigService_1.courseTypeService.getCourseTypeById(id)];
                    case 1:
                        courseType = _a.sent();
                        if (!courseType) {
                            res.status(404).json({
                                success: false,
                                message: 'Course type not found'
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            success: true,
                            data: courseType
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error getting course type:', error_7);
                        res.status(500).json({
                            success: false,
                            message: error_7.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.createCourseType = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, courseTypeName, hoursPerCredit, pricePerCredit, newCourseType, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, courseTypeName = _a.courseTypeName, hoursPerCredit = _a.hoursPerCredit, pricePerCredit = _a.pricePerCredit;
                        if (!courseTypeName || !hoursPerCredit || !pricePerCredit) {
                            res.status(400).json({
                                success: false,
                                message: 'Course type name, hours per credit, and price per credit are required'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, financialConfigService_1.courseTypeService.createCourseType({
                                courseTypeName: courseTypeName,
                                hoursPerCredit: parseInt(hoursPerCredit),
                                pricePerCredit: parseFloat(pricePerCredit)
                            })];
                    case 1:
                        newCourseType = _b.sent();
                        res.status(201).json({
                            success: true,
                            data: newCourseType,
                            message: 'Course type created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _b.sent();
                        console.error('Error creating course type:', error_8);
                        res.status(500).json({
                            success: false,
                            message: error_8.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.updateCourseType = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, courseTypeName, hoursPerCredit, pricePerCredit, updateData, updatedCourseType, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        _a = req.body, courseTypeName = _a.courseTypeName, hoursPerCredit = _a.hoursPerCredit, pricePerCredit = _a.pricePerCredit;
                        updateData = {};
                        if (courseTypeName !== undefined)
                            updateData.courseTypeName = courseTypeName;
                        if (hoursPerCredit !== undefined)
                            updateData.hoursPerCredit = parseInt(hoursPerCredit);
                        if (pricePerCredit !== undefined)
                            updateData.pricePerCredit = parseFloat(pricePerCredit);
                        return [4 /*yield*/, financialConfigService_1.courseTypeService.updateCourseType(id, updateData)];
                    case 1:
                        updatedCourseType = _b.sent();
                        if (!updatedCourseType) {
                            res.status(404).json({
                                success: false,
                                message: 'Course type not found'
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            success: true,
                            data: updatedCourseType,
                            message: 'Course type updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _b.sent();
                        console.error('Error updating course type:', error_9);
                        res.status(500).json({
                            success: false,
                            message: error_9.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.deleteCourseType = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, deleted, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, financialConfigService_1.courseTypeService.deleteCourseType(id)];
                    case 1:
                        deleted = _a.sent();
                        if (!deleted) {
                            res.status(404).json({
                                success: false,
                                message: 'Course type not found'
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            success: true,
                            message: 'Course type deleted successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error deleting course type:', error_10);
                        res.status(500).json({
                            success: false,
                            message: error_10.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.getCoursesUsingType = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, courses, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, financialConfigService_1.courseTypeService.getCoursesUsingType(id)];
                    case 1:
                        courses = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: courses
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        console.error('Error getting courses using type:', error_11);
                        res.status(500).json({
                            success: false,
                            message: error_11.message || 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // === DASHBOARD & OVERVIEW ===
    FinancialController.prototype.getDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var dashboardData, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, financialBusiness.getDashboardData()];
                    case 1:
                        dashboardData = _a.sent();
                        res.status(200).json(dashboardData);
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        console.error('Error getting dashboard data:', error_12);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // === PAYMENT STATUS MANAGEMENT ===
    FinancialController.prototype.getAllPaymentStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semester, faculty, course, paymentStatusData, error_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, semester = _a.semester, faculty = _a.faculty, course = _a.course;
                        return [4 /*yield*/, financialBusiness.getAllPaymentStatus({
                                semester: semester,
                                faculty: faculty,
                                course: course
                            })];
                    case 1:
                        paymentStatusData = _b.sent();
                        res.status(200).json(paymentStatusData);
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _b.sent();
                        console.error('Error getting payment status data:', error_13);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.getStudentPaymentStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, paymentStatus, error_14;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = undefined;
                        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'student') {
                            studentId = req.user.studentId;
                        }
                        else {
                            studentId = req.params.studentId;
                        }
                        if (!studentId) {
                            res.status(400).json({ message: 'Missing studentId' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, financialBusiness.getStudentPaymentStatus(studentId)];
                    case 1:
                        paymentStatus = _b.sent();
                        if (!paymentStatus) {
                            res.status(404).json({ message: 'Student payment information not found' });
                            return [2 /*return*/];
                        }
                        res.status(200).json(paymentStatus);
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _b.sent();
                        console.error('Error getting student payment status:', error_14);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.updatePaymentStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, paymentData, updated, error_15;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = undefined;
                        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'student') {
                            studentId = req.user.studentId;
                        }
                        else {
                            studentId = req.params.studentId;
                        }
                        if (!studentId) {
                            res.status(400).json({ message: 'Missing studentId' });
                            return [2 /*return*/];
                        }
                        paymentData = {
                            studentId: studentId,
                            amount: req.body.amount,
                            paymentMethod: req.body.paymentMethod,
                            receiptNumber: req.body.receiptNumber,
                            paymentDate: new Date(req.body.paymentDate),
                            notes: req.body.notes,
                            semester: req.body.semester,
                            status: req.body.status
                        };
                        return [4 /*yield*/, financialBusiness.updatePaymentStatus(studentId, paymentData)];
                    case 1:
                        updated = _b.sent();
                        if (!updated) {
                            res.status(404).json({ message: 'Payment record not found' });
                            return [2 /*return*/];
                        }
                        res.status(200).json({ message: 'Payment status updated successfully', data: updated });
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _b.sent();
                        console.error('Error updating payment status:', error_15);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // === TUITION MANAGEMENT ===
    FinancialController.prototype.getTuitionSettings = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var semester, tuitionSettings, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        semester = req.query.semester;
                        return [4 /*yield*/, financialBusiness.getTuitionSettings(semester)];
                    case 1:
                        tuitionSettings = _a.sent();
                        res.status(200).json(tuitionSettings);
                        return [3 /*break*/, 3];
                    case 2:
                        error_16 = _a.sent();
                        console.error('Error getting tuition settings:', error_16);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.createTuitionSetting = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semester, settings, result, error_17;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, semester = _a.semester, settings = _a.settings;
                        return [4 /*yield*/, financialBusiness.updateTuitionSettings(semester, settings)];
                    case 1:
                        result = _b.sent();
                        res.status(201).json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_17 = _b.sent();
                        console.error('Error creating tuition setting:', error_17);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.updateTuitionSetting = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, settings, result, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        settings = req.body.settings;
                        return [4 /*yield*/, financialBusiness.updateTuitionSettings(id, settings)];
                    case 1:
                        result = _a.sent();
                        res.status(200).json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_18 = _a.sent();
                        console.error('Error updating tuition setting:', error_18);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.deleteTuitionSetting = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, financialBusiness.deleteTuitionSetting(id)];
                    case 1:
                        _a.sent();
                        res.status(204).send();
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        console.error('Error deleting tuition setting:', error_19);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // === PAYMENT RECEIPTS ===
    FinancialController.prototype.getAllReceipts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentId, semester, receipts, error_20;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, studentId = _a.studentId, semester = _a.semester;
                        return [4 /*yield*/, financialBusiness.getAllReceipts(studentId, semester)];
                    case 1:
                        receipts = _b.sent();
                        res.status(200).json(receipts);
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _b.sent();
                        console.error('Error getting receipts:', error_20);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.getReceiptById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, receipt, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, financialBusiness.getReceiptById(id)];
                    case 1:
                        receipt = _a.sent();
                        if (!receipt) {
                            res.status(404).json({ message: 'Receipt not found' });
                            return [2 /*return*/];
                        }
                        res.status(200).json(receipt);
                        return [3 /*break*/, 3];
                    case 2:
                        error_21 = _a.sent();
                        console.error('Error getting receipt:', error_21);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.createReceipt = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var receiptData, receipt, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        receiptData = req.body;
                        return [4 /*yield*/, financialBusiness.createReceipt(receiptData)];
                    case 1:
                        receipt = _a.sent();
                        res.status(201).json(receipt);
                        return [3 /*break*/, 3];
                    case 2:
                        error_22 = _a.sent();
                        console.error('Error creating receipt:', error_22);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // === PAYMENT AUDIT ===
    FinancialController.prototype.getAuditLogs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, startDate, endDate, logs, error_23;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, financialBusiness.getPaymentAuditTrail(startDate, endDate)];
                    case 1:
                        logs = _b.sent();
                        res.status(200).json(logs);
                        return [3 /*break*/, 3];
                    case 2:
                        error_23 = _b.sent();
                        console.error('Error getting audit logs:', error_23);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialController.prototype.getStudentAuditLogs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, semester, logs, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentId = req.params.studentId;
                        semester = req.query.semester;
                        return [4 /*yield*/, financialBusiness.getPaymentAuditTrail(studentId, semester)];
                    case 1:
                        logs = _a.sent();
                        res.status(200).json(logs);
                        return [3 /*break*/, 3];
                    case 2:
                        error_24 = _a.sent();
                        console.error('Error getting student audit logs:', error_24);
                        res.status(500).json({ message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // === REPORTS ===
    FinancialController.prototype.getUnpaidTuitionReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semester, year, financialService, report, error_25;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.query, semester = _a.semester, year = _a.year;
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/financialService/financialService')); })];
                    case 1:
                        financialService = _b.sent();
                        return [4 /*yield*/, financialService.financialService.getUnpaidTuitionReport(String(semester), String(year))];
                    case 2:
                        report = _b.sent();
                        res.status(200).json({ success: true, data: report });
                        return [3 /*break*/, 4];
                    case 3:
                        error_25 = _b.sent();
                        res.status(500).json({ success: false, message: error_25.message || 'Internal server error' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return FinancialController;
}());
exports.default = new FinancialController();
