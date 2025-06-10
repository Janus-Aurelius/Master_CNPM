import { Request, Response } from 'express';
import { ProgramBusiness } from '../../business/academicBusiness/program.business';
import multer from 'multer';
import * as XLSX from 'xlsx';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed'));
        }
    }
}).single('file');

export class ProgramController {
    static async getAllPrograms(req: Request, res: Response): Promise<void> {
        try {
            const programs = await ProgramBusiness.getAllPrograms();
            console.log('Programs from database:', programs);
            res.json(programs);
        } catch (error) {
            console.error('Error in getAllPrograms:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    static async getProgramById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const program = await ProgramBusiness.getProgramById(Number(id));
            if (!program) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Program not found' 
                });
                return;
            }
            res.json(program);
        } catch (error) {
            console.error('Error in getProgramById:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    static async createProgram(req: Request, res: Response): Promise<void> {
        try {
            const program = await ProgramBusiness.createProgram(req.body);
            res.status(201).json(program);
        } catch (error) {
            console.error('Error in createProgram:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    static async updateProgram(req: Request, res: Response): Promise<void> {
        const { maNganh, maMonHoc, maHocKy } = req.params;
        const programData = req.body;
        try {
            const updated = await ProgramBusiness.updateProgram(maNganh, maMonHoc, maHocKy, programData);
            if (!updated) {
                res.status(404).json({ message: 'Program not found' });
                return;
            }
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update program' });
        }
    }

    static async deleteProgram(req: Request, res: Response): Promise<void> {
        try {
            const { maNganh, maMonHoc, maHocKy } = req.params;
            await ProgramBusiness.deleteProgram(maNganh, maMonHoc, maHocKy);
            res.json({ 
                success: true, 
                message: 'Program deleted successfully' 
            });
        } catch (error) {
            console.error('Error in deleteProgram:', error);
            if (error instanceof Error && error.message === 'Program not found') {
                res.status(404).json({ 
                    success: false, 
                    message: 'Program not found' 
                });
                return;
            }
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    static async uploadExcelFile(req: Request, res: Response) {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            try {
                const workbook = XLSX.readFile(req.file.path);
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);

                // Process the Excel data
                const processedData = await ProgramBusiness.processExcelData(req.file);
                res.status(200).json({ success: true, data: processedData });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Error processing Excel file', error });
            }
        });
    }

    static async getProgramsByNganh(req: Request, res: Response): Promise<void> {
        try {
            const { maNganh } = req.params;
            const programs = await ProgramBusiness.getProgramsByNganh(maNganh);
            res.json(programs);
        } catch (error) {
            console.error('Error in getProgramsByNganh:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    static async getProgramsByHocKy(req: Request, res: Response): Promise<void> {
        try {
            const { maHocKy } = req.params;
            const programs = await ProgramBusiness.getProgramsByHocKy(maHocKy);
            res.json(programs);
        } catch (error) {
            console.error('Error in getProgramsByHocKy:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }
} 