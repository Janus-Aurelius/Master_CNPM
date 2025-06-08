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
exports.DatabaseService = void 0;
// src/services/database/databaseService.ts
var database_1 = require("../../config/database");
var DatabaseService = /** @class */ (function () {
    function DatabaseService() {
    }
    /**
     * Execute a query with parameters
     */ DatabaseService.query = function (sql, params) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.Database.query(sql, params)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Database query error:', error_1);
                        errorMessage = error_1 instanceof Error ? error_1.message : 'Unknown database error';
                        throw new Error("Database query failed: ".concat(errorMessage));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Execute a query and return first row
     */
    DatabaseService.queryOne = function (sql, params) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query(sql, params)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0 ? result[0] : null];
                }
            });
        });
    };
    /**
     * Execute multiple queries in a transaction
     */
    DatabaseService.transaction = function (queries) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _i, queries_1, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        _i = 0, queries_1 = queries;
                        _a.label = 1;
                    case 1:
                        if (!(_i < queries_1.length)) return [3 /*break*/, 4];
                        query = queries_1[_i];
                        return [4 /*yield*/, this.query(query.sql, query.params)];
                    case 2:
                        result = _a.sent();
                        results.push(result);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Check if a record exists
     */
    DatabaseService.exists = function (table, conditions) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, values, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        whereClause = Object.keys(conditions)
                            .map(function (key, index) { return "".concat(key, " = $").concat(index + 1); })
                            .join(' AND ');
                        values = Object.values(conditions);
                        sql = "SELECT 1 FROM ".concat(table, " WHERE ").concat(whereClause, " LIMIT 1");
                        return [4 /*yield*/, this.query(sql, values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                }
            });
        });
    };
    /**
     * Insert a record and return the inserted record
     */
    DatabaseService.insert = function (table, data) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, values, placeholders, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = Object.keys(data);
                        values = Object.values(data);
                        placeholders = values.map(function (_, index) { return "$".concat(index + 1); }).join(', ');
                        sql = "\n            INSERT INTO ".concat(table, " (").concat(columns.join(', '), ") \n            VALUES (").concat(placeholders, ") \n            RETURNING *\n        ");
                        return [4 /*yield*/, this.query(sql, values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                }
            });
        });
    };
    /**
     * Update a record and return the updated record
     */
    DatabaseService.update = function (table, data, conditions) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, whereClause, values, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = Object.keys(data)
                            .map(function (key, index) { return "".concat(key, " = $").concat(index + 1); })
                            .join(', ');
                        whereClause = Object.keys(conditions)
                            .map(function (key, index) { return "".concat(key, " = $").concat(Object.keys(data).length + index + 1); })
                            .join(' AND ');
                        values = __spreadArray(__spreadArray([], Object.values(data), true), Object.values(conditions), true);
                        sql = "\n            UPDATE ".concat(table, " \n            SET ").concat(setClause, " \n            WHERE ").concat(whereClause, " \n            RETURNING *\n        ");
                        return [4 /*yield*/, this.query(sql, values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0 ? result[0] : null];
                }
            });
        });
    };
    /**
     * Delete records
     */
    DatabaseService.delete = function (table, conditions) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, values, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        whereClause = Object.keys(conditions)
                            .map(function (key, index) { return "".concat(key, " = $").concat(index + 1); })
                            .join(' AND ');
                        values = Object.values(conditions);
                        sql = "DELETE FROM ".concat(table, " WHERE ").concat(whereClause);
                        return [4 /*yield*/, this.query(sql, values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, Array.isArray(result) ? result.length : 0];
                }
            });
        });
    };
    /**
     * Get paginated results
     */
    DatabaseService.paginate = function (sql_1) {
        return __awaiter(this, arguments, void 0, function (sql, params, page, limit) {
            var countSql, countResult, total, offset, paginatedSql, data;
            if (params === void 0) { params = []; }
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        countSql = "SELECT COUNT(*) as count FROM (".concat(sql, ") as count_query");
                        return [4 /*yield*/, this.query(countSql, params)];
                    case 1:
                        countResult = _a.sent();
                        total = parseInt(countResult[0].count);
                        offset = (page - 1) * limit;
                        paginatedSql = "".concat(sql, " LIMIT $").concat(params.length + 1, " OFFSET $").concat(params.length + 2);
                        return [4 /*yield*/, this.query(paginatedSql, __spreadArray(__spreadArray([], params, true), [limit, offset], false))];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data,
                                total: total,
                                page: page,
                                limit: limit
                            }];
                }
            });
        });
    };
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
