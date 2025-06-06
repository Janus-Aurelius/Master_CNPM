"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSubjectData = void 0;
var validateSubjectData = function (req, res, next) {
    var _a = req.body, subjectCode = _a.subjectCode, name = _a.name, credits = _a.credits, type = _a.type, department = _a.department, lecturer = _a.lecturer, schedule = _a.schedule;
    var errors = [];
    if (!subjectCode)
        errors.push('Subject code is required');
    if (!name)
        errors.push('Subject name is required');
    if (!credits)
        errors.push('Credits is required');
    if (!type)
        errors.push('Type is required');
    if (!department)
        errors.push('Department is required');
    if (!lecturer)
        errors.push('Lecturer is required');
    if (!schedule) {
        errors.push('Schedule is required');
    }
    else {
        if (!schedule.day)
            errors.push('Day is required');
        if (!schedule.session)
            errors.push('Session is required');
        if (!schedule.fromTo)
            errors.push('Time is required');
        if (!schedule.room)
            errors.push('Room is required');
    }
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
        return;
    }
    next();
};
exports.validateSubjectData = validateSubjectData;
