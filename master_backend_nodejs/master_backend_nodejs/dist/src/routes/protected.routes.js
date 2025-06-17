"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/protected.routes.ts
var express_1 = require("express");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// A protected endpoint for admin, academic, and financial roles
router.get('/dashboard', auth_1.authenticateToken, (0, auth_1.authorizeRoles)(['admin', 'academic', 'financial']), function (req, res) {
    res.json({ message: 'Welcome to the protected dashboard!' });
});
exports.default = router;
