"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var openCourse_controller_1 = require("../../controllers/academicController/openCourse.controller");
var router = (0, express_1.Router)();
// Get all courses
router.get('/', openCourse_controller_1.OpenCourseController.getAllCourses);
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
