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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var express_1 = __importDefault(require("express"));
var admin_routes_1 = __importDefault(require("../routes/admin/admin.routes"));
var globals_1 = require("@jest/globals");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/admin', admin_routes_1.default);
// Mock token for testing
var secretKey = '1234567890';
var mockAdminToken = jsonwebtoken_1.default.sign({ id: 1, role: 'admin' }, secretKey, { expiresIn: '1h' });
(0, globals_1.describe)('Admin API Endpoints', function () {
    // Test User Management endpoints
    (0, globals_1.describe)('User Management', function () {
        var createdUserId;
        var mockUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'student',
            status: true
        };
        (0, globals_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/admin/users')
                            .set('Authorization', "Bearer ".concat(mockAdminToken))
                            .send(mockUser)];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(201);
                        createdUserId = res.body.data.id;
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should get all users', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/admin/users')
                            .set('Authorization', "Bearer ".concat(mockAdminToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(Array.isArray(res.body.data)).toBe(true);
                        (0, globals_1.expect)(res.body.data.length).toBeGreaterThan(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should get user by ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/api/admin/users/".concat(createdUserId))
                            .set('Authorization', "Bearer ".concat(mockAdminToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(res.body.data).toHaveProperty('id', createdUserId);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should update user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedUser, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedUser = __assign(__assign({}, mockUser), { name: 'Updated User' });
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .put("/api/admin/users/".concat(createdUserId))
                                .set('Authorization', "Bearer ".concat(mockAdminToken))
                                .send(updatedUser)];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(res.body.data).toHaveProperty('name', 'Updated User');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should change user status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .patch("/api/admin/users/".concat(createdUserId, "/status"))
                            .set('Authorization', "Bearer ".concat(mockAdminToken))
                            .send({ status: false })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(res.body.data).toHaveProperty('status', false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should delete user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .delete("/api/admin/users/".concat(createdUserId))
                            .set('Authorization', "Bearer ".concat(mockAdminToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test System Maintenance endpoints
    (0, globals_1.describe)('System Maintenance', function () {
        (0, globals_1.it)('should get maintenance status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/admin/maintenance/status')
                            .set('Authorization', "Bearer ".concat(mockAdminToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(res.body.data).toHaveProperty('isMaintenanceMode');
                        (0, globals_1.expect)(res.body.data).toHaveProperty('message');
                        (0, globals_1.expect)(res.body.data).toHaveProperty('allowedIPs');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should enable maintenance mode', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/admin/maintenance/enable')
                            .set('Authorization', "Bearer ".concat(mockAdminToken))
                            .send({ message: 'System under maintenance' })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should disable maintenance mode', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/admin/maintenance/disable')
                            .set('Authorization', "Bearer ".concat(mockAdminToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should update maintenance message', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .put('/api/admin/maintenance/message')
                            .set('Authorization', "Bearer ".concat(mockAdminToken))
                            .send({ message: 'New maintenance message' })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should add allowed IP', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/admin/maintenance/allowed-ips')
                            .set('Authorization', "Bearer ".concat(mockAdminToken))
                            .send({ ip: '192.168.1.1' })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should remove allowed IP', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .delete('/api/admin/maintenance/allowed-ips')
                            .set('Authorization', "Bearer ".concat(mockAdminToken))
                            .send({ ip: '192.168.1.1' })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should handle unauthorized access', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/admin/users')];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(401);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should handle invalid admin token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidToken, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidToken = jsonwebtoken_1.default.sign({ id: 'user001', role: 'student' }, secretKey, { expiresIn: '1h' });
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .get('/api/admin/users')
                                .set('Authorization', "Bearer ".concat(invalidToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(403);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
