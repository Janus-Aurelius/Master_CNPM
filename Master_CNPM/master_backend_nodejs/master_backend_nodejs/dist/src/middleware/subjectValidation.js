"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSubjectData = void 0;
var validateSubjectData = function (req, res, next) {
    var _a = req.body, subjectId = _a.subjectId, subjectName = _a.subjectName, subjectTypeId = _a.subjectTypeId, totalHours = _a.totalHours;
    var errors = [];
    if (!subjectId)
        errors.push('Subject ID is required');
    if (!subjectName)
        errors.push('Subject name is required');
    if (!subjectTypeId)
        errors.push('Subject type is required');
    if (!totalHours)
        errors.push('Total hours is required');
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
