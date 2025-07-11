"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
/**
 * Custom error class with additional information about HTTP status codes
 */
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(statusCode, message) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.status = "".concat(statusCode).startsWith('4') ? 'fail' : 'error';
        _this.isOperational = true;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return AppError;
}(Error));
exports.AppError = AppError;
/**
 * Global error handler middleware
 * Handles both AppError instances (operational errors) and unexpected errors
 */
var errorHandler = function (err, req, res, next) {
    // Handle AppError instances
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        return;
    }
    // Handle standard errors with status property (backward compatibility)
    if (err.status && typeof err.status === 'number') {
        res.status(err.status).json({
            status: 'error',
            message: err.message || 'Error occurred'
        });
        return;
    }
    // Log all error stacks
    console.error('Error:', err.stack || err);
    // Default case: handle as 500 internal server error
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
