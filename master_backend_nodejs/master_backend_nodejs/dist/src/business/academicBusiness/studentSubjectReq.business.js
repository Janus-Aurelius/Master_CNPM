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
exports.StudentSubjectReqBusiness = void 0;
var studentSubjectReq_1 = require("../../models/academic_related/studentSubjectReq");
var validation_error_1 = require("../../utils/errors/validation.error");
var studentSubjectReq_service_1 = require("../../services/courseService/studentSubjectReq.service");
var StudentSubjectReqBusiness = /** @class */ (function () {
    function StudentSubjectReqBusiness() {
    }
    StudentSubjectReqBusiness.getAllRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, studentSubjectReq_service_1.StudentSubjectReqService.getAllRequests()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StudentSubjectReqBusiness.getRequestById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, studentSubjectReq_service_1.StudentSubjectReqService.getRequestById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StudentSubjectReqBusiness.createRequest = function (requestData) {
        return __awaiter(this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errors = this.validateRequestData(requestData);
                        if (errors.length > 0) {
                            throw new validation_error_1.ValidationError(errors.join(', '));
                        }
                        return [4 /*yield*/, studentSubjectReq_service_1.StudentSubjectReqService.createRequest(requestData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StudentSubjectReqBusiness.updateRequestStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRequestById(id)];
                    case 1:
                        request = _a.sent();
                        if (!request) {
                            throw new validation_error_1.ValidationError('Request not found');
                        }
                        if (request.status !== studentSubjectReq_1.RequestStatus.PENDING) {
                            throw new validation_error_1.ValidationError('Can only update status of pending requests');
                        }
                        return [4 /*yield*/, studentSubjectReq_service_1.StudentSubjectReqService.updateRequestStatus(id, status)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StudentSubjectReqBusiness.getRequestsByStudentId = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!studentId) {
                            throw new validation_error_1.ValidationError('Student ID is required');
                        }
                        return [4 /*yield*/, studentSubjectReq_service_1.StudentSubjectReqService.getRequestsByStudentId(studentId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StudentSubjectReqBusiness.getRequestsByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, studentSubjectReq_service_1.StudentSubjectReqService.getRequestsByStatus(status)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StudentSubjectReqBusiness.validateRequestData = function (requestData) {
        var errors = [];
        if (!requestData.studentId)
            errors.push('Student ID is required');
        if (!requestData.studentName)
            errors.push('Student name is required');
        if (!requestData.type || !Object.values(studentSubjectReq_1.RequestType).includes(requestData.type)) {
            errors.push('Valid request type is required');
        }
        if (!requestData.subjectCode)
            errors.push('Subject code is required');
        if (!requestData.subjectName)
            errors.push('Subject name is required');
        if (!requestData.requestDate)
            errors.push('Request date is required');
        if (!requestData.reason)
            errors.push('Reason is required');
        if (!requestData.status || !Object.values(studentSubjectReq_1.RequestStatus).includes(requestData.status)) {
            errors.push('Valid status is required');
        }
        return errors;
    };
    return StudentSubjectReqBusiness;
}());
exports.StudentSubjectReqBusiness = StudentSubjectReqBusiness;
