"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var course_controller_1 = require("../../controllers/academicController/course.controller");
var router = express_1.default.Router();
// Course routes
router.get('/', function (req, res, next) { return (0, course_controller_1.getCoursesHandler)(req, res, next); });
router.get('/:id', function (req, res, next) { return (0, course_controller_1.getCourseByIdHandler)(req, res, next); });
router.post('/', function (req, res, next) { return (0, course_controller_1.createCourseHandler)(req, res, next); });
router.put('/:id', function (req, res, next) { return (0, course_controller_1.updateCourseHandler)(req, res, next); });
router.delete('/:id', function (req, res, next) { return (0, course_controller_1.deleteCourseHandler)(req, res, next); });
exports.default = router;
