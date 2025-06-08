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
exports.academicRequestService = void 0;
var databaseService_1 = require("../database/databaseService");
// Mock data for academic requests
var requests = [
    {
        id: '1',
        studentId: 'SV001',
        type: 'course_registration',
        status: 'approved',
        description: 'Đăng ký thêm môn học Mạng máy tính ngoài thời gian đăng ký chính thức',
        createdAt: new Date('2025-05-20'),
        updatedAt: new Date('2025-05-22'),
        response: 'Phê duyệt đăng ký môn học',
        actionBy: 'academic_001'
    },
    {
        id: '2',
        studentId: 'SV001',
        type: 'grade_review',
        status: 'pending',
        description: 'Đề nghị xem xét lại điểm cuối kỳ môn Cơ sở dữ liệu',
        createdAt: new Date('2025-06-01'),
        updatedAt: new Date('2025-06-01')
    },
    {
        id: '3',
        studentId: 'SV001',
        type: 'academic_leave',
        status: 'rejected',
        description: 'Xin nghỉ học 2 tuần vì lý do cá nhân',
        createdAt: new Date('2025-04-15'),
        updatedAt: new Date('2025-04-16'),
        response: 'Thời gian nghỉ quá dài, vui lòng điều chỉnh thời gian nghỉ',
        actionBy: 'academic_002'
    },
    {
        id: '4',
        studentId: 'SV002',
        type: 'course_registration',
        status: 'approved',
        description: 'Đăng ký môn Trí tuệ nhân tạo',
        createdAt: new Date('2025-05-19'),
        updatedAt: new Date('2025-05-21'),
        response: 'Đã phê duyệt',
        actionBy: 'academic_001'
    }
];
exports.academicRequestService = {
    createRequest: function (requestData) {
        return __awaiter(this, void 0, void 0, function () {
            var requestId, insertedRequest, newRequest, error_1, newRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        requestId = "REQ_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 6));
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                INSERT INTO academic_requests (\n                    id, student_id, type, status, description, created_at, updated_at\n                ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())\n                RETURNING *\n            ", [requestId, requestData.studentId, requestData.type, requestData.status, requestData.description])];
                    case 1:
                        insertedRequest = _a.sent();
                        newRequest = {
                            id: requestId,
                            studentId: requestData.studentId,
                            type: requestData.type,
                            status: requestData.status,
                            description: requestData.description,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            response: requestData.response,
                            actionBy: requestData.actionBy
                        };
                        // Fallback to in-memory storage
                        requests.push(newRequest);
                        return [2 /*return*/, newRequest];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error creating academic request:', error_1);
                        newRequest = __assign(__assign({}, requestData), { id: Math.random().toString(36).substr(2, 9), createdAt: new Date(), updatedAt: new Date() });
                        requests.push(newRequest);
                        return [2 /*return*/, newRequest];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getStudentRequests: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var dbRequests, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT * FROM academic_requests \n                WHERE student_id = $1 \n                ORDER BY created_at DESC\n            ", [studentId])];
                    case 1:
                        dbRequests = _a.sent();
                        if (dbRequests && dbRequests.length > 0) {
                            return [2 /*return*/, dbRequests.map(function (req) { return ({
                                    id: req.id,
                                    studentId: req.student_id,
                                    type: req.type,
                                    status: req.status,
                                    description: req.description,
                                    createdAt: req.created_at,
                                    updatedAt: req.updated_at,
                                    response: req.response,
                                    actionBy: req.action_by
                                }); })];
                        }
                        // Fallback to in-memory data
                        return [2 /*return*/, requests.filter(function (req) { return req.studentId === studentId; })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting student requests:', error_2);
                        return [2 /*return*/, requests.filter(function (req) { return req.studentId === studentId; })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    updateRequestStatus: function (requestId, status, actionBy, response) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedRequest, request, error_3, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                UPDATE academic_requests \n                SET status = $1, action_by = $2, response = $3, updated_at = NOW()\n                WHERE id = $4\n                RETURNING *\n            ", [status, actionBy, response, requestId])];
                    case 1:
                        updatedRequest = _a.sent();
                        if (updatedRequest) {
                            return [2 /*return*/, {
                                    id: updatedRequest.id,
                                    studentId: updatedRequest.student_id,
                                    type: updatedRequest.type,
                                    status: updatedRequest.status,
                                    description: updatedRequest.description,
                                    createdAt: updatedRequest.created_at,
                                    updatedAt: updatedRequest.updated_at,
                                    response: updatedRequest.response,
                                    actionBy: updatedRequest.action_by
                                }];
                        }
                        request = requests.find(function (req) { return req.id === requestId; });
                        if (request) {
                            request.status = status;
                            request.actionBy = actionBy;
                            request.response = response;
                            request.updatedAt = new Date();
                            return [2 /*return*/, request];
                        }
                        return [2 /*return*/, null];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error updating request status:', error_3);
                        request = requests.find(function (req) { return req.id === requestId; });
                        if (request) {
                            request.status = status;
                            request.updatedAt = new Date();
                            request.actionBy = actionBy;
                            if (response) {
                                request.response = response;
                            }
                            return [2 /*return*/, request];
                        }
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getRequestHistory: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var dbRequests, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT * FROM academic_requests \n                WHERE student_id = $1 \n                AND status IN ('approved', 'rejected')\n                ORDER BY updated_at DESC\n                LIMIT 20\n            ", [studentId])];
                    case 1:
                        dbRequests = _a.sent();
                        if (dbRequests && dbRequests.length > 0) {
                            return [2 /*return*/, dbRequests.map(function (req) { return ({
                                    id: req.id,
                                    studentId: req.student_id,
                                    type: req.type,
                                    status: req.status,
                                    description: req.description,
                                    createdAt: req.created_at,
                                    updatedAt: req.updated_at,
                                    response: req.response,
                                    actionBy: req.action_by
                                }); })];
                        }
                        // Fallback to in-memory data
                        return [2 /*return*/, requests
                                .filter(function (req) { return req.studentId === studentId; })
                                .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting request history:', error_4);
                        return [2 /*return*/, requests
                                .filter(function (req) { return req.studentId === studentId; })
                                .sort(function (a, b) { return b.createdAt.getTime() - a.createdAt.getTime(); })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
