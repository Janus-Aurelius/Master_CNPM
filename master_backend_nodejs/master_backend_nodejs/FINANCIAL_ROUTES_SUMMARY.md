# Financial Module Routes Summary

## Routes Structure

### 1. Dashboard Routes (`/api/financial/dashboard`)
- `GET /overview` - Get dashboard overview statistics
- `GET /comparison` - Get semester comparison data  
- `GET /analytics` - Get payment analytics with filters
- `GET /export` - Export dashboard data

### 2. Payment Routes (`/api/financial/payment`)
- `GET /status` - Get payment status list for a semester
- `GET /history/:studentId` - Get payment history for a specific student
- `POST /confirm` - Confirm a payment (with validation)
- `GET /receipt/:paymentId` - Get payment receipt
- `GET /audit` - Get payment audit trail
- `GET /statistics` - Get payment statistics

### 3. Configuration Routes (`/api/financial/config`)

#### Priority Objects
- `GET /priority-objects` - Get all priority objects
- `POST /priority-objects` - Create new priority object (with validation)
- `PUT /priority-objects/:priorityId` - Update priority object
- `DELETE /priority-objects/:priorityId` - Delete priority object

#### Course Types  
- `GET /course-types` - Get all course types with pricing
- `PUT /course-types/:courseTypeId/price` - Update course type price (with validation)
- `PUT /course-types/batch-price-update` - Batch update course type prices (with validation)

#### Semester Configuration
- `GET /payment-deadline` - Get payment deadline from current semester
- `GET /semester` - Get semester configuration  
- `GET /summary` - Get configuration summary

### 4. Health Check
- `GET /health` - Health check endpoint for financial module

## Middleware Used

### Validation Middleware (from `validatePayment.ts`)
- `validatePayment` - For payment confirmation requests
- `validatePriorityObject` - For priority object creation
- `validateCourseTypePrice` - For single course type price updates
- `validateBatchCourseTypePrice` - For batch course type price updates

### Authentication Middleware
- `authenticateToken` - Applied to all financial routes for security

## Files Created/Updated

### Services
- `src/services/financialService/dashboardService.ts` (already existed)
- `src/services/financialService/paymentService.ts` 
- `src/services/financialService/configService.ts`

### Business Logic
- `src/business/financialBusiness/dashboardBusiness.ts`
- `src/business/financialBusiness/paymentBusiness.ts`
- `src/business/financialBusiness/configBusiness.ts`

### Controllers
- `src/controllers/financialController/dashboardController.ts`
- `src/controllers/financialController/paymentController.ts`
- `src/controllers/financialController/configController.ts`

### Routes
- `src/routes/financial/dashboardRoutes.ts`
- `src/routes/financial/paymentRoutes.ts`
- `src/routes/financial/configRoutes.ts`
- `src/routes/financial/financialIndex.ts`

### Middleware
- `src/middleware/validatePayment.ts` (updated with additional validations)

### Main Route Integration
- `src/routes/financial/financial.routes.ts` (updated to use new refactored routes)

## Key Features Implemented

1. **Separation of Concerns**: Clear separation between Service, Business, Controller, and Routes layers
2. **Input Validation**: Comprehensive validation for all user inputs
3. **Error Handling**: Consistent error handling across all layers
4. **Business Logic**: Validation of business rules (e.g., payment amounts, discount limits)
5. **Database Integration**: Uses existing DatabaseService for data access
6. **Interface Compliance**: All interfaces follow the established IPaymentData, IPriorityObject, etc.

## API Usage Examples

### Get Dashboard Overview
```
GET /api/financial/dashboard/overview?semesterId=HK2024_1
```

### Confirm Payment
```
POST /api/financial/payment/confirm
Content-Type: application/json

{
  "studentId": "SV001",
  "amount": 5000000,
  "paymentMethod": "bank_transfer",
  "semester": "HK2024_1",
  "paymentDate": "2024-01-15T10:00:00Z",
  "notes": "Payment via bank transfer"
}
```

### Create Priority Object
```
POST /api/financial/config/priority-objects
Content-Type: application/json

{
  "priorityId": "LIETS", 
  "priorityName": "Liệt sĩ",
  "discountAmount": 10000000
}
```

### Update Course Type Price
```
PUT /api/financial/config/course-types/LT/price
Content-Type: application/json

{
  "newPrice": 300000
}
```
