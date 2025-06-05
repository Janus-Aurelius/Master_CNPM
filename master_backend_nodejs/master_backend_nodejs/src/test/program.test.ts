import { Program } from '../models/academic_related/program';
import { ProgramBusiness } from '../business/academic/program.business';
import { Database } from '../config/database';
import { DatabaseError } from '../utils/errors/database.error';
import { ValidationError } from '../utils/errors/validation.error';

// Mock XLSX module before importing
jest.mock('xlsx', () => ({
    read: jest.fn().mockReturnValue({
        SheetNames: ['Sheet1'],
        Sheets: {
            Sheet1: {}
        }
    }),
    utils: {
        sheet_to_json: jest.fn().mockReturnValue([])
    }
}));

// Now import XLSX after mocking
import * as XLSX from 'xlsx';

// Mock the Database class
jest.mock('../config/database');

describe('ProgramBusiness', () => {
    // Mock data
    const mockPrograms: Program[] = [
        {
            id: '1',
            name_year: 'Kỹ thuật phần mềm 2023',
            department: 'Công nghệ phần mềm',
            major: 'Kỹ thuật phần mềm',
            courseList: ['INT1234', 'INT2345', 'INT3456'],
            totalCredit: 145,
            status: 'active' as 'active'
        },
        {
            id: '2',
            name_year: 'Khoa học máy tính 2023',
            department: 'Khoa học máy tính',
            major: 'Khoa học máy tính',
            courseList: ['CSC1234', 'CSC2345', 'CSC3456'],
            totalCredit: 140,
            status: 'active' as 'active'
        }
    ];

    const newProgramData = {
        name_year: 'An toàn thông tin 2023',
        department: 'An toàn thông tin',
        major: 'An toàn thông tin',
        courseList: ['SEC1234', 'SEC2345'],
        totalCredit: 135,
        status: 'active' as 'active'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllPrograms', () => {
        it('should return all programs', async () => {
            (Database.query as jest.Mock).mockResolvedValue(mockPrograms);
            const result = await ProgramBusiness.getAllPrograms();
            expect(result).toEqual(mockPrograms);
            expect(Database.query).toHaveBeenCalledWith('SELECT * FROM programs ORDER BY id');
        });

        it('should handle database error', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(ProgramBusiness.getAllPrograms()).rejects.toThrow(DatabaseError);
        });
    });

    describe('getProgramById', () => {
        it('should return program by id', async () => {
            (Database.query as jest.Mock).mockResolvedValue([mockPrograms[0]]);
            const result = await ProgramBusiness.getProgramById('1');
            expect(result).toEqual(mockPrograms[0]);
            expect(Database.query).toHaveBeenCalledWith('SELECT * FROM programs WHERE id = $1', ['1']);
        });

        it('should return null for non-existent program', async () => {
            (Database.query as jest.Mock).mockResolvedValue([]);
            const result = await ProgramBusiness.getProgramById('999');
            expect(result).toBeNull();
        });
    });

    describe('createProgram', () => {
        it('should create a new program', async () => {
            const expectedProgram = { id: '3', ...newProgramData };
            (Database.query as jest.Mock).mockResolvedValue([expectedProgram]);
            
            const result = await ProgramBusiness.createProgram(newProgramData);
            expect(result).toEqual(expectedProgram);
            expect(Database.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO programs'),
                expect.arrayContaining([
                    newProgramData.name_year,
                    newProgramData.department,
                    newProgramData.major,
                    JSON.stringify(newProgramData.courseList),
                    newProgramData.totalCredit,
                    newProgramData.status
                ])
            );
        });

        it('should validate required fields', async () => {
            const invalidData = {
                name_year: '',
                department: 'Test',
                major: '',
                courseList: [],
                totalCredit: 0,
                status: 'invalid' as any
            };
            
            await expect(ProgramBusiness.createProgram(invalidData)).rejects.toThrow(ValidationError);
        });
    });

    describe('updateProgram', () => {
        const updateData = {
            totalCredit: 150,
            status: 'inactive' as 'inactive'
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should update an existing program', async () => {
            (Database.query as jest.Mock)
                .mockResolvedValueOnce([mockPrograms[0]]) // for getProgramById
                .mockResolvedValueOnce([{ ...mockPrograms[0], ...updateData }]); // for update
                
            const result = await ProgramBusiness.updateProgram('1', updateData);
            expect(result.totalCredit).toBe(150);
            expect(result.status).toBe('inactive');
            expect(Database.query).toHaveBeenCalledTimes(2);
        });

        it('should throw error for non-existent program', async () => {
            // Mock getProgramById to return empty array (program not found)
            (Database.query as jest.Mock).mockResolvedValueOnce([]);
            
            // This will cause ValidationError in the business logic
            await expect(ProgramBusiness.updateProgram('999', updateData))
                .rejects.toThrow('Program not found');
        });
    });

    describe('deleteProgram', () => {
        it('should delete an existing program', async () => {
            (Database.query as jest.Mock).mockResolvedValue({ rowCount: 1 });
            await expect(ProgramBusiness.deleteProgram('1')).resolves.not.toThrow();
            expect(Database.query).toHaveBeenCalledWith('DELETE FROM programs WHERE id = $1', ['1']);
        });

        it('should handle database error during deletion', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(ProgramBusiness.deleteProgram('1')).rejects.toThrow(DatabaseError);
        });
    });

    describe('processExcelData', () => {
        const mockFile = {
            buffer: Buffer.from('dummy excel data'),
            originalname: 'test.xlsx',
            mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            fieldname: 'file',
            encoding: '7bit',
            size: 100,
            destination: 'uploads/',
            filename: 'test.xlsx',
            path: 'uploads/test.xlsx'
        } as Express.Multer.File;

        const mockExcelData = [
            {
                'Program Name and Year': 'Trí tuệ nhân tạo 2023',
                'Department': 'Khoa học máy tính',
                'Major': 'Trí tuệ nhân tạo',
                'Course List': 'AI1234,AI2345,AI3456',
                'Total Credits': '135',
                'Status': 'Active'
            }
        ];

        const expectedProgram = {
            id: '4',
            name_year: 'Trí tuệ nhân tạo 2023',
            department: 'Khoa học máy tính',
            major: 'Trí tuệ nhân tạo',
            courseList: ['AI1234', 'AI2345', 'AI3456'],
            totalCredit: 135,
            status: 'active' as 'active'
        };

        beforeEach(() => {
            // Update the mock values for each test
            (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockExcelData);
            jest.spyOn(ProgramBusiness, 'createProgram').mockResolvedValue(expectedProgram);
        });

        it('should process valid Excel data', async () => {
            const result = await ProgramBusiness.processExcelData(mockFile);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(expectedProgram);
        });

        it('should handle invalid Excel data', async () => {
            const invalidExcelData = [{
                'Program Name and Year': '',
                'Department': '',
                'Major': '',
                'Course List': '',
                'Total Credits': 'invalid',
                'Status': 'invalid'
            }];

            // Override the mock for this test
            (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(invalidExcelData);
            
            // Mock validateProgramData to return errors
            jest.spyOn(ProgramBusiness, 'validateProgramData').mockReturnValue(
                ['Program name and year is required', 'Department is required']
            );
            
            await expect(ProgramBusiness.processExcelData(mockFile))
                .rejects.toThrow(ValidationError);
        });
    });
}); 