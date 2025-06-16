import * as activityLogService from '../../services/adminService/activitylogService';
import { AppError } from '../../middleware/errorHandler';

export const activitylogManager = {
    getActivityLogs: async (page: number, size: number) => {
        if (page < 1) throw new AppError(400, 'Page must be >= 1');
        return await activityLogService.getActivityLogs(page, size);
    }
};