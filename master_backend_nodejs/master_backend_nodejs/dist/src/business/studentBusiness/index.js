"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tuitionManager = exports.registrationManager = exports.dashboardManager = void 0;
var dashboardManager_1 = require("./dashboardManager");
Object.defineProperty(exports, "dashboardManager", { enumerable: true, get: function () { return __importDefault(dashboardManager_1).default; } });
var registrationManager_1 = require("./registrationManager");
Object.defineProperty(exports, "registrationManager", { enumerable: true, get: function () { return __importDefault(registrationManager_1).default; } });
var tuitionManager_1 = require("./tuitionManager");
Object.defineProperty(exports, "tuitionManager", { enumerable: true, get: function () { return __importDefault(tuitionManager_1).default; } });
