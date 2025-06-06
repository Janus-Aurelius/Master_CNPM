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
exports.updateTuitionSettings = exports.getTuitionSettings = exports.updatePaymentStatus = exports.getStudentPaymentStatus = exports.getAllPaymentStatus = exports.getDashboard = void 0;
var financialBusiness = __importStar(require("../../business/financialBusiness/financialManager"));
// Dashboard
var getDashboard = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dashboardData, error_1;
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
                error_1 = _a.sent();
                console.error('Error getting dashboard data:', error_1);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDashboard = getDashboard;
// Payment Status Management
var getAllPaymentStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, semester, faculty, course, paymentStatusData, error_2;
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
                error_2 = _b.sent();
                console.error('Error getting payment status data:', error_2);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllPaymentStatus = getAllPaymentStatus;
var getStudentPaymentStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, paymentStatus, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentId = req.params.studentId;
                return [4 /*yield*/, financialBusiness.getStudentPaymentStatus(studentId)];
            case 1:
                paymentStatus = _a.sent();
                if (!paymentStatus) {
                    res.status(404).json({ message: 'Student payment information not found' });
                    return [2 /*return*/];
                }
                res.status(200).json(paymentStatus);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error getting student payment status:', error_3);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStudentPaymentStatus = getStudentPaymentStatus;
var updatePaymentStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, _a, paymentStatus, amountPaid, semester, updated, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                studentId = req.params.studentId;
                _a = req.body, paymentStatus = _a.paymentStatus, amountPaid = _a.amountPaid, semester = _a.semester;
                return [4 /*yield*/, financialBusiness.updatePaymentStatus(studentId, {
                        paymentStatus: paymentStatus,
                        amountPaid: amountPaid,
                        semester: semester
                    })];
            case 1:
                updated = _b.sent();
                if (!updated) {
                    res.status(404).json({ message: 'Payment record not found' });
                    return [2 /*return*/];
                }
                res.status(200).json({ message: 'Payment status updated successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('Error updating payment status:', error_4);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updatePaymentStatus = updatePaymentStatus;
// Tuition Adjustment
var getTuitionSettings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var semester, tuitionSettings, error_5;
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
                error_5 = _a.sent();
                console.error('Error getting tuition settings:', error_5);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTuitionSettings = getTuitionSettings;
var updateTuitionSettings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, semester, settings, updated, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, semester = _a.semester, settings = _a.settings;
                return [4 /*yield*/, financialBusiness.updateTuitionSettings(semester, settings)];
            case 1:
                updated = _b.sent();
                if (!updated) {
                    res.status(404).json({ message: 'Tuition settings not found' });
                    return [2 /*return*/];
                }
                res.status(200).json({ message: 'Tuition settings updated successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                console.error('Error updating tuition settings:', error_6);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateTuitionSettings = updateTuitionSettings;
var financialController = {
    getUnpaidTuitionReport: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semester, year, financialService, report, error_7;
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
                        error_7 = _b.sent();
                        res.status(500).json({ success: false, message: error_7.message || 'Internal server error' });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
exports.default = financialController;
