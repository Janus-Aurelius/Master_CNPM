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
exports.testRole = testRole;
var axios_1 = __importStar(require("axios"));
function testRole(role) {
    return __awaiter(this, void 0, void 0, function () {
        var loginRes, token, redirectUrl, dashboardRes, error_1, adminRes, error_2, error_3;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _l.trys.push([0, 9, , 10]);
                    console.log("\n----- Testing ".concat(role.toUpperCase(), " role -----"));
                    return [4 /*yield*/, axios_1.default.post('http://localhost:3000/auth/login', {
                            email: "".concat(role, "@example.com"),
                            password: 'password'
                        })];
                case 1:
                    loginRes = _l.sent();
                    console.log("Logged in as ".concat(role));
                    token = loginRes.data.token;
                    if (!token) {
                        throw new Error('No token received in login response');
                    }
                    redirectUrl = loginRes.data.redirectUrl;
                    console.log("Redirect URL for ".concat(role, ": ").concat(redirectUrl));
                    _l.label = 2;
                case 2:
                    _l.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get("http://localhost:3000".concat(redirectUrl), { headers: { 'Authorization': "Bearer ".concat(token) } })];
                case 3:
                    dashboardRes = _l.sent();
                    console.log("".concat(role, " dashboard access: SUCCESS"));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _l.sent();
                    if (error_1 instanceof axios_1.AxiosError) {
                        console.error("".concat(role, " dashboard access: FAILED - ").concat((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status, " ").concat((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.statusText));
                        console.error((_c = error_1.response) === null || _c === void 0 ? void 0 : _c.data);
                    }
                    else {
                        console.error("".concat(role, " dashboard access: FAILED - ").concat(String(error_1)));
                    }
                    return [3 /*break*/, 5];
                case 5:
                    _l.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, axios_1.default.get('http://localhost:3000/api/admin/dashboard', { headers: { 'Authorization': "Bearer ".concat(token) } })];
                case 6:
                    adminRes = _l.sent();
                    console.log("Admin access as ".concat(role, ": SUCCESS"));
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _l.sent();
                    if (error_2 instanceof axios_1.AxiosError && ((_d = error_2.response) === null || _d === void 0 ? void 0 : _d.status) === 403) {
                        console.log("Admin access as ".concat(role, ": DENIED (expected for non-admin)"));
                    }
                    else if (error_2 instanceof axios_1.AxiosError) {
                        console.error("Admin access test failed: ".concat((_e = error_2.response) === null || _e === void 0 ? void 0 : _e.status, " ").concat((_f = error_2.response) === null || _f === void 0 ? void 0 : _f.statusText));
                        console.error((_g = error_2.response) === null || _g === void 0 ? void 0 : _g.data);
                    }
                    else {
                        console.error("Admin access test error: ".concat(String(error_2)));
                    }
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_3 = _l.sent();
                    if (error_3 instanceof axios_1.AxiosError) {
                        console.error("Error testing ".concat(role, ": ").concat((_h = error_3.response) === null || _h === void 0 ? void 0 : _h.status, " ").concat((_j = error_3.response) === null || _j === void 0 ? void 0 : _j.statusText));
                        console.error(((_k = error_3.response) === null || _k === void 0 ? void 0 : _k.data) || error_3.message);
                    }
                    else {
                        console.error("Error testing ".concat(role, ": ").concat(String(error_3)));
                    }
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Test all roles sequentially with async/await
function testAllRoles() {
    return __awaiter(this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, testRole('student')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testRole('academic')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, testRole('financial')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, testRole('admin')];
                case 4:
                    _a.sent();
                    console.log("\n----- All tests completed -----");
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    console.error("Test suite error:", error_4);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Run the tests
testAllRoles();
var BASE_URL = 'http://localhost:3000/api/admin';
// Test tạo user mới
function testCreateUser() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_5;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post("".concat(BASE_URL, "/users"), {
                            name: "Test User",
                            email: "test@example.com",
                            password: "test123",
                            role: "student",
                            phoneNumber: "0123456789",
                            address: "Test Address"
                        })];
                case 1:
                    response = _b.sent();
                    console.log('Create User Response:', response.data);
                    return [2 /*return*/, response.data.data.id];
                case 2:
                    error_5 = _b.sent();
                    if (error_5 instanceof axios_1.AxiosError) {
                        console.error('Create User Error:', ((_a = error_5.response) === null || _a === void 0 ? void 0 : _a.data) || error_5.message);
                    }
                    else {
                        console.error('Create User Error:', error_5);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Test lấy danh sách users
function testGetAllUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_6;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("".concat(BASE_URL, "/users"))];
                case 1:
                    response = _b.sent();
                    console.log('Get All Users Response:', response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _b.sent();
                    if (error_6 instanceof axios_1.AxiosError) {
                        console.error('Get All Users Error:', ((_a = error_6.response) === null || _a === void 0 ? void 0 : _a.data) || error_6.message);
                    }
                    else {
                        console.error('Get All Users Error:', error_6);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Test lấy user theo ID
function testGetUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_7;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("".concat(BASE_URL, "/users/").concat(id))];
                case 1:
                    response = _b.sent();
                    console.log('Get User By ID Response:', response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _b.sent();
                    if (error_7 instanceof axios_1.AxiosError) {
                        console.error('Get User By ID Error:', ((_a = error_7.response) === null || _a === void 0 ? void 0 : _a.data) || error_7.message);
                    }
                    else {
                        console.error('Get User By ID Error:', error_7);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Test cập nhật user
function testUpdateUser(id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_8;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.put("".concat(BASE_URL, "/users/").concat(id), {
                            name: "Updated Test User",
                            email: "updated@example.com",
                            phoneNumber: "0987654321"
                        })];
                case 1:
                    response = _b.sent();
                    console.log('Update User Response:', response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _b.sent();
                    if (error_8 instanceof axios_1.AxiosError) {
                        console.error('Update User Error:', ((_a = error_8.response) === null || _a === void 0 ? void 0 : _a.data) || error_8.message);
                    }
                    else {
                        console.error('Update User Error:', error_8);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Test xóa user
function testDeleteUser(id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_9;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(BASE_URL, "/users/").concat(id))];
                case 1:
                    response = _b.sent();
                    console.log('Delete User Response:', response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _b.sent();
                    if (error_9 instanceof axios_1.AxiosError) {
                        console.error('Delete User Error:', ((_a = error_9.response) === null || _a === void 0 ? void 0 : _a.data) || error_9.message);
                    }
                    else {
                        console.error('Delete User Error:', error_9);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Chạy các test
function runTests() {
    return __awaiter(this, void 0, void 0, function () {
        var userId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Starting Admin User Management Tests ===');
                    return [4 /*yield*/, testCreateUser()];
                case 1:
                    userId = _a.sent();
                    if (!userId) {
                        console.log('Failed to create user, stopping tests');
                        return [2 /*return*/];
                    }
                    // Test các chức năng khác
                    return [4 /*yield*/, testGetAllUsers()];
                case 2:
                    // Test các chức năng khác
                    _a.sent();
                    return [4 /*yield*/, testGetUserById(userId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, testUpdateUser(userId)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, testDeleteUser(userId)];
                case 5:
                    _a.sent();
                    console.log('=== Tests Completed ===');
                    return [2 /*return*/];
            }
        });
    });
}
// Chạy tests
runTests().catch(console.error);
