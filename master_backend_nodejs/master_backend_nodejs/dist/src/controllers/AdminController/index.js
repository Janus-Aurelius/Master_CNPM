"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceController = exports.UserController = void 0;
var userController_1 = require("./userController");
Object.defineProperty(exports, "UserController", { enumerable: true, get: function () { return userController_1.UserController; } });
var maintenanceController_1 = __importDefault(require("./maintenanceController"));
exports.maintenanceController = maintenanceController_1.default;
