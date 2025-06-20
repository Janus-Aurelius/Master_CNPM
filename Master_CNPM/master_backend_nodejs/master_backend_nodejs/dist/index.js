"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
var admin_routes_1 = __importDefault(require("./src/routes/admin/admin.routes"));
var academic_routes_1 = __importDefault(require("./src/routes/academic/academic.routes"));
var financial_routes_1 = __importDefault(require("./src/routes/financial/financial.routes"));
var student_routes_1 = __importDefault(require("./src/routes/student/student.routes"));
var socketHandler_1 = require("./src/socket/socketHandler");
var errorHandler_1 = require("./src/middleware/errorHandler");
var maintenance_1 = require("./src/middleware/maintenance");
// Load environment variables
dotenv_1.default.config();
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', maintenance_1.maintenanceMode, auth_routes_1.default);
app.use('/api/admin', maintenance_1.maintenanceMode, admin_routes_1.default);
app.use('/api/academic', maintenance_1.maintenanceMode, academic_routes_1.default);
app.use('/api/financial', maintenance_1.maintenanceMode, financial_routes_1.default);
app.use('/api/student', maintenance_1.maintenanceMode, student_routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// Socket.io setup
(0, socketHandler_1.setupSocketHandlers)(io);
// Start server
var PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
