"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var student_controller_1 = require("../../controllers/academicController/student.controller");
var router = (0, express_1.Router)();
router.get('/', student_controller_1.studentController.getStudents);
router.post('/', student_controller_1.studentController.createStudent);
router.put('/:id', student_controller_1.studentController.updateStudent);
router.delete('/:id', student_controller_1.studentController.deleteStudent);
router.get('/search', student_controller_1.studentController.searchStudents);
// GET /api/academic/students/form-data
router.get('/form-data', student_controller_1.studentController.getStudentFormData);
// GET /api/academic/students/bulk-registration
router.get('/bulk-registration', student_controller_1.studentController.getStudentsForBulkRegistration);
// POST /api/academic/students/bulk-registration
router.post('/bulk-registration', student_controller_1.studentController.createBulkRegistrations);
// GET /api/academic/students/registration-status
router.get('/registration-status', student_controller_1.studentController.checkRegistrationStatus);
// GET /api/academic/students/semesters
router.get('/semesters', student_controller_1.studentController.getSemesters);
exports.default = router;
