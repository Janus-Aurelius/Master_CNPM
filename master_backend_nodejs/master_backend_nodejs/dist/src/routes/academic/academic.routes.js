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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/academic.routes.ts
var express_1 = require("express");
var subject_controller_1 = require("../../controllers/academicController/subject.controller");
var dashboard_controller_1 = require("../../controllers/academicController/dashboard.controller");
var courseController = __importStar(require("../../controllers/academicController/course.controller"));
var auth_1 = require("../../middleware/auth");
var subjectValidation_1 = require("../../middleware/subjectValidation");
var program_controller_1 = require("../../controllers/academicController/program.controller");
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
router.get('/dashboard/requests', function (req, res) {
    dashboard_controller_1.AcademicDashboardController.getStudentRequests(req, res).catch(function (err) {
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
router.get('/studentSubjectReq', function (req, res) {
    res.json({ data: 'Academic affairs deparment student subject request management' });
});
router.get('/openCourseMgm', function (req, res) {
    res.json({ data: 'Academic affairs deparment open courses management' });
});
// Subject Management Routes
router.get('/subjectMgm', function (req, res) {
    subject_controller_1.SubjectController.getAllSubjects(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.get('/subjectMgm/:id', function (req, res) {
    subject_controller_1.SubjectController.getSubjectById(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.post('/subjectMgm', subjectValidation_1.validateSubjectData, function (req, res) {
    subject_controller_1.SubjectController.createSubject(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.put('/subjectMgm/:id', subjectValidation_1.validateSubjectData, function (req, res) {
    subject_controller_1.SubjectController.updateSubject(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
router.delete('/subjectMgm/:id', function (req, res) {
    subject_controller_1.SubjectController.deleteSubject(req, res).catch(function (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});
exports.default = router;
