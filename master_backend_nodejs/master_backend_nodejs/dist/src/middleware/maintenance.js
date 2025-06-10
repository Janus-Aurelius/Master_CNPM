"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceMode = exports.checkMaintenance = void 0;
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
var maintenanceMode = function (req, res, next) {
    var isMaintenance = process.env.MAINTENANCE_MODE === 'true';
    if (isMaintenance) {
        res.status(503).json({
            success: false,
            message: 'Hệ thống đang trong quá trình bảo trì. Vui lòng thử lại sau.'
        });
        return;
    }
    next();
};
exports.maintenanceMode = maintenanceMode;
