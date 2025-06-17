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
var studentSubjectReq_1 = require("../models/academic_related/studentSubjectReq");
var studentSubjectReq_business_1 = require("../business/academicBusiness/studentSubjectReq.business");
var database_1 = require("../config/database");
var validation_error_1 = require("../utils/errors/validation.error");
// Mock the Database class
jest.mock('../config/database');
describe('StudentSubjectReqBusiness', function () {
    // Mock data
    var mockRequests = [
        {
            id: 1,
            studentId: "SV001",
            studentName: "Nguyễn Văn A",
            type: studentSubjectReq_1.RequestType.ADD,
            subjectCode: "CS101",
            subjectName: "Nhập môn lập trình",
            requestDate: "15/06/2023",
            reason: "Lớp học trước bị trùng lịch với môn bắt buộc khác",
            status: studentSubjectReq_1.RequestStatus.PENDING
        },
        {
            id: 2,
            studentId: "SV002",
            studentName: "Trần Thị B",
            type: studentSubjectReq_1.RequestType.DELETE,
            subjectCode: "MA101",
            subjectName: "Đại số tuyến tính",
            requestDate: "14/06/2023",
            reason: "Đã học và đạt môn này ở học kỳ trước",
            status: studentSubjectReq_1.RequestStatus.APPROVED
        },
        {
            id: 3,
            studentId: "SV003",
            studentName: "Lê Văn C",
            type: studentSubjectReq_1.RequestType.ADD,
            subjectCode: "PH202",
            subjectName: "Vật lý đại cương",
            requestDate: "13/06/2023",
            reason: "Cần đủ số tín chỉ tối thiểu cho học kỳ",
            status: studentSubjectReq_1.RequestStatus.REJECTED
        }
    ];
    var newRequestData = {
        studentId: "SV004",
        studentName: "Phạm Thị D",
        type: studentSubjectReq_1.RequestType.ADD,
        subjectCode: "CS102",
        subjectName: "Cấu trúc dữ liệu",
        requestDate: "12/06/2023",
        reason: "Muốn học sớm để có kiến thức nền tảng tốt",
        status: studentSubjectReq_1.RequestStatus.PENDING
    };
    beforeEach(function () {
        jest.clearAllMocks();
        // Reset mock data for each test
        database_1.Database.query.mockReset();
    });
    describe('getAllRequests', function () {
        it('should return all requests ordered by request date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValue(mockRequests);
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.getAllRequests()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockRequests);
                        expect(database_1.Database.query).toHaveBeenCalledWith('SELECT * FROM student_subject_requests ORDER BY request_date DESC');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.getAllRequests()).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRequestById', function () {
        it('should return request by id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValue([mockRequests[0]]);
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestById(1)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockRequests[0]);
                        expect(database_1.Database.query).toHaveBeenCalledWith('SELECT * FROM student_subject_requests WHERE id = $1', [1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null for non-existent request', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValue([]);
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestById(999)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestById(1)).rejects.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('createRequest', function () {
        it('should create a new request successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedRequest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedRequest = __assign({ id: 4 }, newRequestData);
                        database_1.Database.query.mockResolvedValue([expectedRequest]);
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.createRequest(newRequestData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(expectedRequest);
                        expect(database_1.Database.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO student_subject_requests'), expect.arrayContaining([
                            newRequestData.studentId,
                            newRequestData.studentName,
                            newRequestData.type,
                            newRequestData.subjectCode,
                            newRequestData.subjectName,
                            newRequestData.requestDate,
                            newRequestData.reason,
                            newRequestData.status
                        ]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidData = {
                            studentId: '',
                            studentName: '',
                            type: 'INVALID',
                            subjectCode: '',
                            subjectName: '',
                            requestDate: '',
                            reason: '',
                            status: 'INVALID'
                        };
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.createRequest(invalidData))
                                .rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database error during creation', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.createRequest(newRequestData))
                                .rejects.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateRequestStatus', function () {
        it('should update status of pending request to approved', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedRequest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedRequest = __assign(__assign({}, mockRequests[0]), { status: studentSubjectReq_1.RequestStatus.APPROVED });
                        database_1.Database.query
                            .mockResolvedValueOnce([mockRequests[0]]) // for getRequestById
                            .mockResolvedValueOnce([updatedRequest]); // for update
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.updateRequestStatus(1, studentSubjectReq_1.RequestStatus.APPROVED)];
                    case 1:
                        result = _a.sent();
                        expect(result.status).toBe(studentSubjectReq_1.RequestStatus.APPROVED);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update status of pending request to rejected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedRequest, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedRequest = __assign(__assign({}, mockRequests[0]), { status: studentSubjectReq_1.RequestStatus.REJECTED });
                        database_1.Database.query
                            .mockResolvedValueOnce([mockRequests[0]]) // for getRequestById
                            .mockResolvedValueOnce([updatedRequest]); // for update
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.updateRequestStatus(1, studentSubjectReq_1.RequestStatus.REJECTED)];
                    case 1:
                        result = _a.sent();
                        expect(result.status).toBe(studentSubjectReq_1.RequestStatus.REJECTED);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update non-pending request', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValueOnce([mockRequests[1]]); // APPROVED request
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.updateRequestStatus(2, studentSubjectReq_1.RequestStatus.REJECTED))
                                .rejects.toThrow('Can only update status of pending requests')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent request', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValueOnce([]);
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.updateRequestStatus(999, studentSubjectReq_1.RequestStatus.APPROVED))
                                .rejects.toThrow('Request not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database error during update', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query
                            .mockResolvedValueOnce([mockRequests[0]]) // for getRequestById
                            .mockRejectedValueOnce(new Error('Database error')); // for update
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.updateRequestStatus(1, studentSubjectReq_1.RequestStatus.APPROVED))
                                .rejects.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRequestsByStudentId', function () {
        it('should return requests for specific student', function () { return __awaiter(void 0, void 0, void 0, function () {
            var studentRequests, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        studentRequests = mockRequests.filter(function (r) { return r.studentId === 'SV001'; });
                        database_1.Database.query.mockResolvedValue(studentRequests);
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestsByStudentId('SV001')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(studentRequests);
                        expect(database_1.Database.query).toHaveBeenCalledWith('SELECT * FROM student_subject_requests WHERE student_id = $1 ORDER BY request_date DESC', ['SV001']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate student ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestsByStudentId(''))
                            .rejects.toThrow('Student ID is required')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestsByStudentId('SV001'))
                                .rejects.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRequestsByStatus', function () {
        it('should return requests with pending status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var pendingRequests, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pendingRequests = mockRequests.filter(function (r) { return r.status === studentSubjectReq_1.RequestStatus.PENDING; });
                        database_1.Database.query.mockResolvedValue(pendingRequests);
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestsByStatus(studentSubjectReq_1.RequestStatus.PENDING)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(pendingRequests);
                        expect(database_1.Database.query).toHaveBeenCalledWith('SELECT * FROM student_subject_requests WHERE status = $1 ORDER BY request_date DESC', [studentSubjectReq_1.RequestStatus.PENDING]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return requests with approved status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var approvedRequests, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        approvedRequests = mockRequests.filter(function (r) { return r.status === studentSubjectReq_1.RequestStatus.APPROVED; });
                        database_1.Database.query.mockResolvedValue(approvedRequests);
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestsByStatus(studentSubjectReq_1.RequestStatus.APPROVED)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(approvedRequests);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return requests with rejected status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rejectedRequests, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rejectedRequests = mockRequests.filter(function (r) { return r.status === studentSubjectReq_1.RequestStatus.REJECTED; });
                        database_1.Database.query.mockResolvedValue(rejectedRequests);
                        return [4 /*yield*/, studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestsByStatus(studentSubjectReq_1.RequestStatus.REJECTED)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(rejectedRequests);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database error', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(studentSubjectReq_business_1.StudentSubjectReqBusiness.getRequestsByStatus(studentSubjectReq_1.RequestStatus.PENDING))
                                .rejects.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
