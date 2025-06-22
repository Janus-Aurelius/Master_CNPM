"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var semester_controller_1 = require("../../controllers/academicController/semester.controller");
var auth_1 = require("../../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// Routes for semester management
router.get('/', semester_controller_1.semesterController.getAllSemesters);
router.get('/current', semester_controller_1.semesterController.getCurrentSemester);
router.get('/search', semester_controller_1.semesterController.searchSemesters);
router.get('/year/:year', semester_controller_1.semesterController.getSemestersByYear);
router.get('/:id', semester_controller_1.semesterController.getSemesterById);
// Routes that require academic role
router.post('/', (0, auth_1.authorizeRoles)(['academic', 'admin']), semester_controller_1.semesterController.createSemester);
router.put('/:id', (0, auth_1.authorizeRoles)(['academic', 'admin']), semester_controller_1.semesterController.updateSemester);
router.put('/:id/status', (0, auth_1.authorizeRoles)(['academic', 'admin']), semester_controller_1.semesterController.updateSemesterStatus);
router.delete('/:id', (0, auth_1.authorizeRoles)(['academic', 'admin']), semester_controller_1.semesterController.deleteSemester);
exports.default = router;
