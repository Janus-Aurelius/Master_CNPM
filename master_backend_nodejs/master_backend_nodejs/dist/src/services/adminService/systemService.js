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
exports.securityService = void 0;
// src/services/AdminService/systemService.ts
var databaseService_1 = require("../database/databaseService");
exports.securityService = {
    getSecuritySettings: function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT setting_key, setting_value, setting_type\n            FROM system_settings\n            WHERE setting_key LIKE 'security_%'\n        ")];
                    case 1:
                        settings = _a.sent();
                        result = {};
                        settings.forEach(function (row) {
                            var key = row.setting_key.replace('security_', '');
                            var value = row.setting_value;
                            if (row.setting_type === 'number')
                                value = Number(value);
                            if (row.setting_type === 'boolean')
                                value = value === 'true';
                            if (row.setting_type === 'json')
                                value = JSON.parse(value);
                            result[key] = value;
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    },
    updateSecuritySettings: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _i, key, value, type;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = data;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 3];
                        key = _c;
                        value = data[key];
                        type = 'string';
                        if (typeof value === 'number')
                            type = 'number';
                        if (typeof value === 'boolean') {
                            type = 'boolean';
                            value = value ? 'true' : 'false';
                        }
                        if (Array.isArray(value)) {
                            type = 'json';
                            value = JSON.stringify(value);
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ($1, $2, $3, NOW())\n                ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, setting_type = $3, updated_at = NOW()\n            ", ["security_".concat(key), value, type])];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, { success: true }];
                }
            });
        });
    }
};
