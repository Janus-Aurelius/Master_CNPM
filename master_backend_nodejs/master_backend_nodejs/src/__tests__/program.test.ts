import { ProgramService, Program } from '../services/courseService/program.service';
import { ProgramBusiness } from '../business/academicBusiness/program.business';
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
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockPrograms: Program[] = [
        {
            id: 1,
            maNganh: 'CNTT',
            maMonHoc: 'CS101',
            maHocKy: 'HK1',
            ghiChu: 'Môn học bắt buộc'
        },
        {
            id: 2,
            maNganh: 'CNTT',
            maMonHoc: 'CS102',
            maHocKy: 'HK1',
            ghiChu: 'Môn học tự chọn'
        }
    ];

    const newProgramData: Omit<Program, 'id'> = {
        maNganh: 'CNTT',
        maMonHoc: 'CS103',
        maHocKy: 'HK1',
        ghiChu: 'Môn học mới'
    };

    describe('getAllPrograms', () => {
        it('should return all programs', async () => {
            (Database.query as jest.Mock).mockResolvedValue(mockPrograms);
            const result = await ProgramBusiness.getAllPrograms();
            expect(result).toEqual(mockPrograms);
            expect(Database.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
        });

        it('should throw error when database fails', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(ProgramBusiness.getAllPrograms()).rejects.toThrow(DatabaseError);
        });
    });

    describe('getProgramById', () => {
        it('should return program by id', async () => {
            (Database.query as jest.Mock).mockResolvedValue([mockPrograms[0]]);
            const result = await ProgramBusiness.getProgramById(1);
            expect(result).toEqual(mockPrograms[0]);
            expect(Database.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
        });

        it('should return null for non-existent program', async () => {
            (Database.query as jest.Mock).mockResolvedValue([]);
            const result = await ProgramBusiness.getProgramById(999);
            expect(result).toBeNull();
        });
    });

    describe('createProgram', () => {
        it('should create a new program', async () => {
            const expectedProgram = { id: 3, ...newProgramData };
            (Database.query as jest.Mock).mockResolvedValue([expectedProgram]);

            const result = await ProgramBusiness.createProgram(newProgramData);
            expect(result).toEqual(expectedProgram);
            expect(Database.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO chuongtrinhhoc'),
                [
                    newProgramData.maNganh,
                    newProgramData.maMonHoc,
                    newProgramData.maHocKy,
                    newProgramData.ghiChu
                ]
            );
        });

        it('should throw validation error for invalid data', async () => {
            const invalidData = {
                maNganh: '',
                maMonHoc: '',
                maHocKy: ''
            };

            await expect(ProgramBusiness.createProgram(invalidData)).rejects.toThrow(ValidationError);
        });
    });

    describe('updateProgram', () => {
        const updateData: Partial<Program> = {
            maNganh: 'CNTT',
            maMonHoc: 'CS101',
            maHocKy: 'HK1',
            ghiChu: 'Cập nhật ghi chú'
        };

        it('should update an existing program', async () => {
            (Database.query as jest.Mock)
                .mockResolvedValueOnce([mockPrograms[0]]) // for getProgramById
                .mockResolvedValueOnce([{ ...mockPrograms[0], ...updateData }]); // for update

            const result = await ProgramBusiness.updateProgram(
                updateData.maNganh!,
                updateData.maMonHoc!,
                updateData.maHocKy!,
                updateData
            );
            expect(result).toEqual({ ...mockPrograms[0], ...updateData });
            expect(Database.query).toHaveBeenCalledTimes(2);
        });

        it('should throw error for non-existent program', async () => {
            (Database.query as jest.Mock).mockResolvedValue([]); // for getProgramById
            await expect(ProgramBusiness.updateProgram(
                updateData.maNganh!,
                updateData.maMonHoc!,
                updateData.maHocKy!,
                updateData
            ))
                .rejects.toThrow('Program not found');
        });
    });

    describe('deleteProgram', () => {
        it('should delete an existing program', async () => {
            (Database.query as jest.Mock).mockResolvedValue([{ maNganh: 'CNTT', maMonHoc: 'CS101', maHocKy: 'HK1' }]);
            await expect(ProgramBusiness.deleteProgram('CNTT', 'CS101', 'HK1')).resolves.not.toThrow();
            expect(Database.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM chuongtrinhhoc'),
                ['CNTT', 'CS101', 'HK1']
            );
        });

        it('should throw error when database fails', async () => {
            (Database.query as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(ProgramBusiness.deleteProgram('CNTT', 'CS101', 'HK1')).rejects.toThrow(DatabaseError);
        });
    });

    describe('processExcelData', () => {
        const mockFile = {
            buffer: Buffer.from('mock data'),
            originalname: 'test.xlsx'
        } as Express.Multer.File;

        it('should process valid Excel data', async () => {
            const mockExcelData = [
                {
                    'Mã ngành': 'CNTT',
                    'Mã môn học': 'CS101',
                    'Mã học kỳ': 'HK1',
                    'Ghi chú': 'Môn học bắt buộc'
                }
            ];

            const expectedProgram = {
                id: 1,
                maNganh: 'CNTT',
                maMonHoc: 'CS101',
                maHocKy: 'HK1',
                ghiChu: 'Môn học bắt buộc'
            };

            jest.spyOn(ProgramBusiness, 'createProgram').mockResolvedValue(expectedProgram);

            const result = await ProgramBusiness.processExcelData(mockFile);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(expectedProgram);
        });

        it('should throw validation error for invalid Excel data', async () => {
            const mockExcelData = [
                {
                    'Mã ngành': '',
                    'Mã môn học': '',
                    'Mã học kỳ': ''
                }
            ];

            jest.spyOn(ProgramBusiness, 'validateProgramData').mockReturnValue(
                ['Mã ngành là bắt buộc', 'Mã môn học là bắt buộc', 'Mã học kỳ là bắt buộc']
            );

            await expect(ProgramBusiness.processExcelData(mockFile))
                .rejects.toThrow(ValidationError);
        });
    });
}); 