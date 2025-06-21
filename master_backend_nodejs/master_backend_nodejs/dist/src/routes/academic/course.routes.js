"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var course_controller_1 = require("../../controllers/academicController/course.controller");
var router = express_1.default.Router();
// Course routes
router.get('/', course_controller_1.getCoursesHandler);
router.get('/:id', course_controller_1.getCourseByIdHandler);
router.post('/', course_controller_1.createCourseHandler);
router.put('/:id', course_controller_1.updateCourseHandler);
router.delete('/:id', course_controller_1.deleteCourseHandler);
exports.default = router;
