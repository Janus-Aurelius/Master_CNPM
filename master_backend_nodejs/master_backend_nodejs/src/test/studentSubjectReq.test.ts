import { StudentSubjectReq, RequestType, RequestStatus } from '../models/academic_related/studentSubjectReq';
import { StudentSubjectReqBusiness } from '../business/academic/studentSubjectReq.business';
import { Database } from '../config/database';
import { ValidationError } from '../utils/errors/validation.error';

// Mock the Database class
jest.mock('../config/database');

describe('StudentSubjectReqBusiness', () => {
    // Mock data
    const mockRequests: StudentSubjectReq[] = [
        {
            id: 1,
            studentId: "SV001",
            studentName: "Nguyễn Văn A",
            type: RequestType.ADD,
            subjectCode: "CS101",
            subjectName: "Nhập môn lập trình",
            requestDate: "15/06/2023",
            reason: "Lớp học trước bị trùng lịch với môn bắt buộc khác",
            status: RequestStatus.PENDING
        },
        {
            id: 2,
            studentId: "SV002",
            studentName: "Trần Thị B",
            type: RequestType.DELETE,
            subjectCode: "MA101",
            subjectName: "Đại số tuyến tính",
            requestDate: "14/06/2023",
            reason: "Đã học và đạt môn này ở học kỳ trước",
            status: RequestStatus.APPROVED
        },
        {
            id: 3,
            studentId: "SV003",
            studentName: "Lê Văn C",
            type: RequestType.ADD,
            subjectCode: "PH202",
            subjectName: "Vật lý đại cương",
            requestDate: "13/06/2023",
            reason: "Cần đủ số tín chỉ tối thiểu cho học kỳ",
            status: RequestStatus.REJECTED
        }
    ];

    const newRequestData = {
        studentId: "SV004",
        studentName: "Phạm Thị D",
        type: RequestType.ADD,
        subjectCode: "CS102",
        subjectName: "Cấu trúc dữ liệu",
        requestDate: "12/06/2023",
        reason: "Muốn học sớm để có kiến thức nền tảng tốt",
        status: RequestStatus.PENDING
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset mock data for each test
        (Database.query as jest.Mock).mockReset();
    });

    describe('getAllRequests', () => {
        it('should return all requests ordered by request date', async () => {
            (Database.query as jest.Mock).mockResolvedValue(mockRequests);
            const result = await StudentSubjectReqBusiness.getAllRequests();
            expect(result).toEqual(mockRequests);
            expect(Database.query).toHaveBeenCalledWith(
                'SELECT * FROM student_subject_requests ORDER BY request_date DESC'
            );
        });

        it('should handle database error', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(StudentSubjectReqBusiness.getAllRequests()).rejects.toThrow();
        });
    });

    describe('getRequestById', () => {
        it('should return request by id', async () => {
            (Database.query as jest.Mock).mockResolvedValue([mockRequests[0]]);
            const result = await StudentSubjectReqBusiness.getRequestById(1);
            expect(result).toEqual(mockRequests[0]);
            expect(Database.query).toHaveBeenCalledWith(
                'SELECT * FROM student_subject_requests WHERE id = $1',
                [1]
            );
        });

        it('should return null for non-existent request', async () => {
            (Database.query as jest.Mock).mockResolvedValue([]);
            const result = await StudentSubjectReqBusiness.getRequestById(999);
            expect(result).toBeNull();
        });

        it('should handle database error', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(StudentSubjectReqBusiness.getRequestById(1)).rejects.toThrow();
        });
    });

    describe('createRequest', () => {
        it('should create a new request successfully', async () => {
            const expectedRequest = { id: 4, ...newRequestData };
            (Database.query as jest.Mock).mockResolvedValue([expectedRequest]);
            
            const result = await StudentSubjectReqBusiness.createRequest(newRequestData);
            expect(result).toEqual(expectedRequest);
            expect(Database.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO student_subject_requests'),
                expect.arrayContaining([
                    newRequestData.studentId,
                    newRequestData.studentName,
                    newRequestData.type,
                    newRequestData.subjectCode,
                    newRequestData.subjectName,
                    newRequestData.requestDate,
                    newRequestData.reason,
                    newRequestData.status
                ])
            );
        });

        it('should validate required fields', async () => {
            const invalidData = {
                studentId: '',
                studentName: '',
                type: 'INVALID' as any,
                subjectCode: '',
                subjectName: '',
                requestDate: '',
                reason: '',
                status: 'INVALID' as any
            };
            
            await expect(StudentSubjectReqBusiness.createRequest(invalidData))
                .rejects.toThrow(ValidationError);
        });

        it('should handle database error during creation', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(StudentSubjectReqBusiness.createRequest(newRequestData))
                .rejects.toThrow();
        });
    });

    describe('updateRequestStatus', () => {
        it('should update status of pending request to approved', async () => {
            const updatedRequest = { ...mockRequests[0], status: RequestStatus.APPROVED };
            (Database.query as jest.Mock)
                .mockResolvedValueOnce([mockRequests[0]]) // for getRequestById
                .mockResolvedValueOnce([updatedRequest]); // for update
            
            const result = await StudentSubjectReqBusiness.updateRequestStatus(1, RequestStatus.APPROVED);
            expect(result.status).toBe(RequestStatus.APPROVED);
        });

        it('should update status of pending request to rejected', async () => {
            const updatedRequest = { ...mockRequests[0], status: RequestStatus.REJECTED };
            (Database.query as jest.Mock)
                .mockResolvedValueOnce([mockRequests[0]]) // for getRequestById
                .mockResolvedValueOnce([updatedRequest]); // for update
            
            const result = await StudentSubjectReqBusiness.updateRequestStatus(1, RequestStatus.REJECTED);
            expect(result.status).toBe(RequestStatus.REJECTED);
        });

        it('should not update non-pending request', async () => {
            (Database.query as jest.Mock).mockResolvedValueOnce([mockRequests[1]]); // APPROVED request
            
            await expect(StudentSubjectReqBusiness.updateRequestStatus(2, RequestStatus.REJECTED))
                .rejects.toThrow('Can only update status of pending requests');
        });

        it('should throw error for non-existent request', async () => {
            (Database.query as jest.Mock).mockResolvedValueOnce([]);
            
            await expect(StudentSubjectReqBusiness.updateRequestStatus(999, RequestStatus.APPROVED))
                .rejects.toThrow('Request not found');
        });

        it('should handle database error during update', async () => {
            (Database.query as jest.Mock)
                .mockResolvedValueOnce([mockRequests[0]]) // for getRequestById
                .mockRejectedValueOnce(new Error('Database error')); // for update
            
            await expect(StudentSubjectReqBusiness.updateRequestStatus(1, RequestStatus.APPROVED))
                .rejects.toThrow();
        });
    });

    describe('getRequestsByStudentId', () => {
        it('should return requests for specific student', async () => {
            const studentRequests = mockRequests.filter(r => r.studentId === 'SV001');
            (Database.query as jest.Mock).mockResolvedValue(studentRequests);
            
            const result = await StudentSubjectReqBusiness.getRequestsByStudentId('SV001');
            expect(result).toEqual(studentRequests);
            expect(Database.query).toHaveBeenCalledWith(
                'SELECT * FROM student_subject_requests WHERE student_id = $1 ORDER BY request_date DESC',
                ['SV001']
            );
        });

        it('should validate student ID', async () => {
            await expect(StudentSubjectReqBusiness.getRequestsByStudentId(''))
                .rejects.toThrow('Student ID is required');
        });

        it('should handle database error', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(StudentSubjectReqBusiness.getRequestsByStudentId('SV001'))
                .rejects.toThrow();
        });
    });

    describe('getRequestsByStatus', () => {
        it('should return requests with pending status', async () => {
            const pendingRequests = mockRequests.filter(r => r.status === RequestStatus.PENDING);
            (Database.query as jest.Mock).mockResolvedValue(pendingRequests);
            
            const result = await StudentSubjectReqBusiness.getRequestsByStatus(RequestStatus.PENDING);
            expect(result).toEqual(pendingRequests);
            expect(Database.query).toHaveBeenCalledWith(
                'SELECT * FROM student_subject_requests WHERE status = $1 ORDER BY request_date DESC',
                [RequestStatus.PENDING]
            );
        });

        it('should return requests with approved status', async () => {
            const approvedRequests = mockRequests.filter(r => r.status === RequestStatus.APPROVED);
            (Database.query as jest.Mock).mockResolvedValue(approvedRequests);
            
            const result = await StudentSubjectReqBusiness.getRequestsByStatus(RequestStatus.APPROVED);
            expect(result).toEqual(approvedRequests);
        });

        it('should return requests with rejected status', async () => {
            const rejectedRequests = mockRequests.filter(r => r.status === RequestStatus.REJECTED);
            (Database.query as jest.Mock).mockResolvedValue(rejectedRequests);
            
            const result = await StudentSubjectReqBusiness.getRequestsByStatus(RequestStatus.REJECTED);
            expect(result).toEqual(rejectedRequests);
        });

        it('should handle database error', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(StudentSubjectReqBusiness.getRequestsByStatus(RequestStatus.PENDING))
                .rejects.toThrow();
        });
    });
}); 