// src/routes/financial/configRoutes.ts
import { Router, Request, Response } from 'express';
import { financialConfigController } from '../../controllers/financialController/configController';
import { 
    validatePriorityObject, 
    validateCourseTypePrice, 
    validateBatchCourseTypePrice 
} from '../../middleware/validatePayment';

const router = Router();

// ===== PRIORITY OBJECTS ROUTES =====

// Get all priority objects
router.get('/priority-objects', async (req: Request, res: Response) => {
    await financialConfigController.getPriorityObjects(req, res);
});

// Create new priority object (with validation)
router.post('/priority-objects', 
    validatePriorityObject,
    async (req: Request, res: Response) => {
        await financialConfigController.createPriorityObject(req, res);
    }
);

// Update priority object (with validation)
router.put('/priority-objects/:priorityId', 
    async (req: Request, res: Response) => {
        await financialConfigController.updatePriorityObject(req, res);
    }
);

// Delete priority object
router.delete('/priority-objects/:priorityId', 
    async (req: Request, res: Response) => {
        await financialConfigController.deletePriorityObject(req, res);
    }
);

// ===== COURSE TYPES ROUTES =====

// Get all course types with pricing
router.get('/course-types', async (req: Request, res: Response) => {
    await financialConfigController.getCourseTypes(req, res);
});

// Update single course type price (with validation)
router.put('/course-types/:courseTypeId/price', 
    validateCourseTypePrice,
    async (req: Request, res: Response) => {
        await financialConfigController.updateCourseTypePrice(req, res);
    }
);

// Batch update course type prices (with validation)
router.put('/course-types/batch-price-update', 
    validateBatchCourseTypePrice,
    async (req: Request, res: Response) => {
        await financialConfigController.batchUpdateCourseTypePrices(req, res);
    }
);

// ===== SEMESTER CONFIGURATION ROUTES =====

// Get payment deadline from current semester
router.get('/payment-deadline', async (req: Request, res: Response) => {
    await financialConfigController.getPaymentDeadline(req, res);
});

// Get semester configuration
router.get('/semester', async (req: Request, res: Response) => {
    await financialConfigController.getSemesterConfig(req, res);
});

// Get configuration summary
router.get('/summary', async (req: Request, res: Response) => {
    await financialConfigController.getConfigSummary(req, res);
});

// Get current semester
router.get('/current-semester', async (req: Request, res: Response) => {
    await financialConfigController.getCurrentSemester(req, res);
});

export default router;
