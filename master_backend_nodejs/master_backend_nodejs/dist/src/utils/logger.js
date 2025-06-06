"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
// src/utils/logger.ts
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.info = function (message, meta) {
        console.log("[INFO] ".concat(new Date().toISOString(), ": ").concat(message), meta || '');
    };
    Logger.error = function (message, error) {
        console.error("[ERROR] ".concat(new Date().toISOString(), ": ").concat(message), error || '');
    };
    Logger.warn = function (message, meta) {
        console.warn("[WARN] ".concat(new Date().toISOString(), ": ").concat(message), meta || '');
    };
    Logger.debug = function (message, meta) {
        console.debug("[DEBUG] ".concat(new Date().toISOString(), ": ").concat(message), meta || '');
    };
    return Logger;
}());
exports.Logger = Logger;
