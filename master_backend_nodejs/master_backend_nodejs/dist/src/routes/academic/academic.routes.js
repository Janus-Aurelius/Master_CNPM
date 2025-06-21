"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/academic.routes.ts
var express_1 = require("express");
var dashboard_controller_1 = require("../../controllers/academicController/dashboard.controller");
var courseController = __importStar(require("../../controllers/academicController/course.controller"));
var student_controller_1 = require("../../controllers/academicController/student.controller");
var auth_1 = require("../../middleware/auth");
var program_controller_1 = require("../../controllers/academicController/program.controller");
var student_routes_1 = __importDefault(require("./student.routes"));
var course_routes_1 = __importDefault(require("./course.routes"));
var openCourse_routes_1 = __importDefault(require("./openCourse.routes"));
var router = (0, express_1.Router)();
// Protect all routes
router.use(auth_1.authenticateToken, (0, auth_1.authorizeRoles)(['academic']));
// Dashboard Routes
router.get('/dashboard', function (req, res) {
    dashboard_controller_1.AcademicDashboardController.getDashboardOverview(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.get('/dashboard/stats', function (req, res) {
    dashboard_controller_1.AcademicDashboardController.getQuickStats(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.get('/dashboard/activities', function (req, res) {
    dashboard_controller_1.AcademicDashboardController.getRecentActivities(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
// Course Management Routes
router.get('/courseMgm', courseController.getCoursesHandler);
router.get('/courseMgm/:id', courseController.getCourseByIdHandler);
router.post('/courseMgm', courseController.createCourseHandler);
router.put('/courseMgm/:id', courseController.updateCourseHandler);
router.delete('/courseMgm/:id', courseController.deleteCourseHandler);
router.get('/programsMgm', program_controller_1.ProgramController.getAllPrograms);
router.post('/programsMgm', program_controller_1.ProgramController.createProgram);
router.put('/programsMgm/:maNganh/:maMonHoc/:maHocKy', program_controller_1.ProgramController.updateProgram);
router.delete('/programsMgm/:maNganh/:maMonHoc/:maHocKy', program_controller_1.ProgramController.deleteProgram);
router.get('/programsMgm/nganh/:maNganh', program_controller_1.ProgramController.getProgramsByNganh);
router.get('/programsMgm/hocky/:maHocKy', program_controller_1.ProgramController.getProgramsByHocKy);
router.get('/programsMgm/validate-semester/:maHocKy', program_controller_1.ProgramController.validateSemester);
router.get('/openCourseMgm', function (req, res) {
    res.json({ data: 'Academic affairs deparment open courses management' });
});
// Legacy subject routes have been removed - use course management instead
// Academic Structure Routes - for dropdown data
router.get('/faculties', function (req, res) {
    student_controller_1.studentController.getFaculties(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.get('/majors', function (req, res) {
    student_controller_1.studentController.getMajors(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.get('/majors/faculty/:facultyId', function (req, res) {
    student_controller_1.studentController.getMajorsByFaculty(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.get('/provinces', function (req, res) {
    student_controller_1.studentController.getProvinces(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.get('/priority-groups', function (req, res) {
    student_controller_1.studentController.getPriorityGroups(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
// Course Types (already in course controller)
router.get('/course-types', courseController.getCourseTypesHandler);
// Combined form data endpoints
router.get('/student-form-data', function (req, res) {
    student_controller_1.studentController.getStudentFormData(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.get('/course-form-data', courseController.getCourseFormData);
// Mount student routes at /api/students
router.use('/students', student_routes_1.default);
// Mount course routes at /api/academic/courses
router.use('/courses', course_routes_1.default);
// Mount open course routes at /api/academic/open-courses
router.use('/open-courses', openCourse_routes_1.default);
exports.default = router;
