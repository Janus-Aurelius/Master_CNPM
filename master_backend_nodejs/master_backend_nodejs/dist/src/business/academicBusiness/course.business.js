"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.listCourses = exports.validateAndAddCourse = void 0;
var courseService = __importStar(require("../../services/courseService/courseService"));
var validation_error_1 = require("../../utils/errors/validation.error");
var validateCreditValue = function (credits) {
    return Number.isInteger(credits) && credits > 0 && credits <= 6;
};
var validateTimeFormat = function (time) {
    var timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};
var validateSchedule = function (schedule) {
    if (!schedule)
        return false;
    var day = schedule.day, session = schedule.session, fromTo = schedule.fromTo, room = schedule.room;
    if (!day || !session || !fromTo || !room)
        return false;
    var validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    if (!validDays.includes(day))
        return false;
    var _a = fromTo.split('-').map(function (t) { return t.trim(); }), startTime = _a[0], endTime = _a[1];
    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime))
        return false;
    // Check if end time is after start time
    var start = new Date("2000-01-01T".concat(startTime));
    var end = new Date("2000-01-01T".concat(endTime));
    if (end <= start)
        return false;
    return true;
};
var validateAndAddCourse = function (course) { return __awaiter(void 0, void 0, void 0, function () {
    var errors;
    return __generator(this, function (_a) {
        errors = [];
        if (!validateCreditValue(course.credits)) {
            errors.push('Course credits must be between 1 and 6');
        }
        if (!validateSchedule(course.schedule)) {
            errors.push('Invalid schedule format');
        }
        if (errors.length > 0) {
            throw new validation_error_1.ValidationError(errors.join(', '));
        }
        return [2 /*return*/, courseService.addCourse(course)];
    });
}); };
exports.validateAndAddCourse = validateAndAddCourse;
var listCourses = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, courseService.getCourses()];
    });
}); };
exports.listCourses = listCourses;
var getCourseById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, courseService.getCourses()];
            case 1:
                courses = _a.sent();
                return [2 /*return*/, courses.find(function (course) { return course.id === id; }) || null];
        }
    });
}); };
exports.getCourseById = getCourseById;
var createCourse = function (courseData) { return __awaiter(void 0, void 0, void 0, function () {
    var newCourse;
    return __generator(this, function (_a) {
        newCourse = __assign(__assign({}, courseData), { id: Date.now() // Temporary ID generation
         });
        return [2 /*return*/, (0, exports.validateAndAddCourse)(newCourse)];
    });
}); };
exports.createCourse = createCourse;
var updateCourse = function (id, courseData) { return __awaiter(void 0, void 0, void 0, function () {
    var existingCourse, updatedCourse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getCourseById)(id)];
            case 1:
                existingCourse = _a.sent();
                if (!existingCourse) {
                    return [2 /*return*/, null];
                }
                updatedCourse = __assign(__assign(__assign({}, existingCourse), courseData), { id: id // Keep original ID
                 });
                if (updatedCourse.credits <= 0) {
                    throw new Error("Course credits must be positive");
                }
                return [2 /*return*/, updatedCourse];
        }
    });
}); };
exports.updateCourse = updateCourse;
var deleteCourse = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var course;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getCourseById)(id)];
            case 1:
                course = _a.sent();
                return [2 /*return*/, course !== null];
        }
    });
}); };
exports.deleteCourse = deleteCourse;
