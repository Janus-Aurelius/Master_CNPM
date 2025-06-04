import { Request, Response } from 'express';
import { ProgramBusiness } from '../../business/academic/program.business';
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
    static async getAllPrograms(req: Request, res: Response) {
        try {
            const programs = await ProgramBusiness.getAllPrograms();
            res.status(200).json({ success: true, data: programs });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching programs', error });
        }
    }

    static async getProgramById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const program = await ProgramBusiness.getProgramById(id);
            if (!program) {
                return res.status(404).json({ success: false, message: 'Program not found' });
            }
            res.status(200).json({ success: true, data: program });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching program', error });
        }
    }

    static async createProgram(req: Request, res: Response) {
        try {
            const programData = req.body;
            const newProgram = await ProgramBusiness.createProgram(programData);
            res.status(201).json({ success: true, data: newProgram });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error creating program', error });
        }
    }

    static async updateProgram(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const programData = req.body;
            const updatedProgram = await ProgramBusiness.updateProgram(id, programData);
            res.status(200).json({ success: true, data: updatedProgram });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error updating program', error });
        }
    }

    static async deleteProgram(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ProgramBusiness.deleteProgram(id);
            res.status(200).json({ success: true, message: 'Program deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error deleting program', error });
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
} 