import { ProgramService, Program } from '../../services/courseService/program.service';
import { Database } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database.error';
import { ValidationError } from '../../utils/errors/validation.error';
import * as XLSX from 'xlsx';

export class ProgramBusiness {
    static async getAllPrograms() {
        try {
            return await ProgramService.getAllPrograms();
        } catch (error) {
            console.error('Error in ProgramBusiness.getAllPrograms:', error);
            throw error;
        }
    }

    static async getProgramById(id: number) {
        try {
            return await ProgramService.getProgramById(id);
        } catch (error) {
            console.error('Error in ProgramBusiness.getProgramById:', error);
            throw error;
        }
    }

    static async createProgram(programData: Omit<Program, 'id'>) {
        try {
            const errors = this.validateProgramData(programData);
            if (errors.length > 0) {
                throw new ValidationError(`Invalid program data: ${errors.join(', ')}`);
            }
            return await ProgramService.createProgram(programData);
        } catch (error) {
            console.error('Error in ProgramBusiness.createProgram:', error);
            throw error;
        }
    }

    static async updateProgram(maNganh: string, maMonHoc: string, maHocKy: string, programData: Partial<Program>) {
        try {
            const errors = this.validateProgramData({ ...programData, maNganh, maMonHoc, maHocKy });
            if (errors.length > 0) {
                throw new ValidationError(`Invalid program data: ${errors.join(', ')}`);
            }
            return await ProgramService.updateProgram(
                maNganh,
                maMonHoc,
                maHocKy,
                programData
            );
        } catch (error) {
            console.error('Error in ProgramBusiness.updateProgram:', error);
            throw error;
        }
    }

    static async deleteProgram(maNganh: string, maMonHoc: string, maHocKy: string): Promise<void> {
        try {
            await ProgramService.deleteProgram(maNganh, maMonHoc, maHocKy);
        } catch (error) {
            console.error('Error in ProgramBusiness.deleteProgram:', error);
            throw error;
        }
    }

    static async getProgramsByNganh(maNganh: string) {
        try {
            return await ProgramService.getProgramsByNganh(maNganh);
        } catch (error) {
            console.error('Error in ProgramBusiness.getProgramsByNganh:', error);
            throw error;
        }
    }

    static async getProgramsByHocKy(maHocKy: string) {
        try {
            return await ProgramService.getProgramsByHocKy(maHocKy);
        } catch (error) {
            console.error('Error in ProgramBusiness.getProgramsByHocKy:', error);
            throw error;
        }
    }

    static validateProgramData(programData: Partial<Program>): string[] {
        const errors: string[] = [];
        
        if (!programData.maNganh) errors.push('Mã ngành là bắt buộc');
        if (!programData.maMonHoc) errors.push('Mã môn học là bắt buộc');
        if (!programData.maHocKy) errors.push('Mã học kỳ là bắt buộc');

        return errors;
    }

    static async processExcelData(file: Express.Multer.File): Promise<Program[]> {
        try {
            const workbook = XLSX.read(file.buffer);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            const programs: Program[] = [];
            for (const row of data) {
                const program = this.mapExcelRowToProgram(row);
                const errors = this.validateProgramData(program);
                if (errors.length > 0) {
                    throw new ValidationError(`Invalid program data: ${errors.join(', ')}`);
                }
                programs.push(await this.createProgram(program));
            }
            return programs;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error('Error processing Excel file');
        }
    }

    private static mapExcelRowToProgram(row: any): Omit<Program, 'id'> {
        return {
            maNganh: row['Mã ngành'],
            maMonHoc: row['Mã môn học'],
            maHocKy: row['Mã học kỳ'],
            ghiChu: row['Ghi chú'] || ''
        };
    }
} 