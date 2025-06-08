"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
// Route imports
var auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
var course_routes_1 = __importDefault(require("./src/routes/academic/course.routes"));
var protected_routes_1 = __importDefault(require("./src/routes/protected.routes"));
var academic_routes_1 = __importDefault(require("./src/routes/academic/academic.routes"));
var financial_routes_1 = __importDefault(require("./src/routes/financial/financial.routes"));
var admin_routes_1 = __importDefault(require("./src/routes/admin/admin.routes"));
var student_routes_1 = __importDefault(require("./src/routes/student/student.routes"));
// Middleware imports
var auth_1 = require("./src/middleware/auth");
var errorHandler_1 = require("./src/middleware/errorHandler");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
// CORS Configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Basic Middleware
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Public Auth Routes
app.use('/auth', auth_routes_1.default);
// Course Routes (RESTful)
app.use('/api/courses', course_routes_1.default);
// Student Routes (protected)
app.use('/api/student', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(['student']), student_routes_1.default);
// Protected Routes
app.use('/api/dashboard', protected_routes_1.default);
app.use('/api/academic', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(['academic']), academic_routes_1.default);
app.use('/api/financial', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(['financial']), financial_routes_1.default);
app.use('/api/admin', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(['admin']), admin_routes_1.default);
// Root Route
app.get('/', function (req, res) {
    res.send('API is running. Try /api/courses to access courses.');
});
// Error Handling
app.use(errorHandler_1.errorHandler);
// Start Server
app.listen(PORT, function () {
    console.log("Server running on http://localhost:".concat(PORT));
});
