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
var express_1 = require("express");
var openCourse_controller_1 = require("../../controllers/academicController/openCourse.controller");
var courseController = __importStar(require("../../controllers/academicController/course.controller"));
var semester_controller_1 = require("../../controllers/academicController/semester.controller");
var router = (0, express_1.Router)();
// Get all open courses
router.get('/', openCourse_controller_1.OpenCourseController.getAllCourses);
// Get available courses for dropdown (public endpoint)
router.get('/available-courses', courseController.getCoursesHandler);
// Get available semesters for dropdown (public endpoint)
router.get('/available-semesters', semester_controller_1.semesterController.getAllSemesters);
// Get course by semesterId and courseId
router.get('/:semesterId/:courseId', openCourse_controller_1.OpenCourseController.getCourseById);
// Create new course
router.post('/', openCourse_controller_1.OpenCourseController.createCourse);
// Update course
router.put('/:semesterId/:courseId', openCourse_controller_1.OpenCourseController.updateCourse);
// Delete course
router.delete('/:semesterId/:courseId', openCourse_controller_1.OpenCourseController.deleteCourse);
// Get courses by status
router.get('/status/:status', openCourse_controller_1.OpenCourseController.getCoursesByStatus);
// Get courses by semester
router.get('/semester', openCourse_controller_1.OpenCourseController.getCoursesBySemester);
// Update course status
router.patch('/:semesterId/:courseId/status', openCourse_controller_1.OpenCourseController.updateCourseStatus);
exports.default = router;
