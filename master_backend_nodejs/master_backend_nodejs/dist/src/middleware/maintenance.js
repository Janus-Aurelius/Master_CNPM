"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMaintenance = void 0;
var adminBussiness_1 = require("../business/adminBussiness");
var checkMaintenance = function (req, res, next) {
    if (adminBussiness_1.maintenanceManager.isInMaintenanceMode()) {
        var clientIP = req.ip || req.connection.remoteAddress || '';
        // Cho phép admin truy cập trong chế độ bảo trì
        if (req.user && req.user.role === 'admin') {
            return next();
        }
        // Cho phép các IP được cấu hình truy cập
        if (adminBussiness_1.maintenanceManager.isIPAllowed(clientIP)) {
            return next();
        }
        return res.status(503).json({
            success: false,
            message: adminBussiness_1.maintenanceManager.getMaintenanceMessage()
        });
    }
    next();
};
exports.checkMaintenance = checkMaintenance;
