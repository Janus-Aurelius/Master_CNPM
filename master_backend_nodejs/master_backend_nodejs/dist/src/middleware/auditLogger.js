"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = void 0;
var auditlogService_1 = require("../services/AdminService/auditlogService");
function mapAction(method, path) {
    // Quản lý học phần
    if (method === 'POST' && path.startsWith('/api/academic/courseMgm'))
        return 'Thêm học phần';
    if (method === 'PUT' && path.startsWith('/api/academic/courseMgm'))
        return 'Cập nhật học phần';
    if (method === 'DELETE' && path.startsWith('/api/academic/courseMgm'))
        return 'Xóa học phần';
    // Quản lý chương trình đào tạo
    if (method === 'POST' && path.startsWith('/api/academic/programsMgm'))
        return 'Thêm chương trình đào tạo';
    if (method === 'PUT' && path.startsWith('/api/academic/programsMgm'))
        return 'Cập nhật chương trình đào tạo';
    if (method === 'DELETE' && path.startsWith('/api/academic/programsMgm'))
        return 'Xóa chương trình đào tạo';
    // Quản lý user (admin)
    if (method === 'PUT' && path.startsWith('/api/admin/users/'))
        return 'Cập nhật người dùng';
    if (method === 'PATCH' && path.startsWith('/api/admin/users/'))
        return 'Đổi trạng thái người dùng';
    // Quản lý yêu cầu đăng ký môn học
    if (method === 'POST' && path.startsWith('/api/academic/studentSubjectReq'))
        return 'Gửi yêu cầu đăng ký môn học';
    if (method === 'PATCH' && path.startsWith('/api/academic/studentSubjectReq'))
        return 'Cập nhật trạng thái đăng ký môn học';
    // Quản lý tài chính
    if (method === 'POST' && path.startsWith('/api/financial/tuition-settings'))
        return 'Thêm thiết lập học phí';
    if (method === 'PUT' && path.startsWith('/api/financial/tuition-settings'))
        return 'Cập nhật thiết lập học phí';
    if (method === 'DELETE' && path.startsWith('/api/financial/tuition-settings'))
        return 'Xóa thiết lập học phí';
    if (method === 'POST' && path.startsWith('/api/financial/receipts'))
        return 'Tạo phiếu thu';
    // ... mapping thêm nếu cần ...
    return null; // Không log các hành động không quan trọng
}
var auditLogger = function (req, res, next) {
    var _a;
    // Không log đăng nhập
    if (req.path === '/login' && req.method === 'POST') {
        return next();
    }
    // Không log cho admin (nếu muốn)
    var userRole = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || 'anonymous';
    if (userRole === 'admin') {
        return next();
    }
    // Lưu lại thông tin để log sau khi response kết thúc
    var actionType = mapAction(req.method, req.path);
    if (!actionType) {
        return next(); // Không log các hành động không quan trọng
    }
    console.log('Method:', req.method, 'Path:', req.path);
    // Ghi log sau khi response gửi xong để lấy status code
    res.on('finish', function () {
        var _a;
        var status = res.statusCode < 400 ? 'thành công' : 'thất bại';
        auditlogService_1.auditlogService.createAuditLog({
            user_id: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous',
            action_type: actionType,
            status: status,
            created_at: new Date().toISOString(),
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        }).catch(console.error);
    });
    next();
};
exports.auditLogger = auditLogger;
