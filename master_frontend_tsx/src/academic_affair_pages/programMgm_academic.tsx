import {ThemeLayout} from "../styles/theme_layout.tsx";
import {User} from "../types";
import { useState } from "react";
import { Button, Card, CardContent,Dialog,DialogActions,DialogTitle,IconButton,Grid,TextField,Typography,DialogContent} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Stack from "@mui/joy/Stack";



interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

interface ProgramSchedule{
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    department: string;
    totalCredits: number;
    type: string;
}

export default function ProgramMgmAcademic({ onLogout }: AcademicPageProps) {
    const [programs, setPrograms] = useState<ProgramSchedule[]>([
        { id:1, name: "Kỹ thuật phần mềm", startDate: "2023-09-01", endDate: "2027-06-30", department: "Công nghệ thông tin", totalCredits: 145, type:"Chuyên ngành" },
        { id: 2, name: "Khoa học máy tính", startDate: "2023-09-01", endDate: "2027-06-30", department: "Công nghệ thông tin", totalCredits: 150, type: "Chuyên ngành" },
        { id: 3, name: "Hệ thống thông tin", startDate: "2023-09-01", endDate: "2027-06-30", department: "Công nghệ thông tin", totalCredits: 140, type:"Cơ sở ngành" }
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProgram, setCurrentProgram] = useState<ProgramSchedule>({
        id: 0,
        name: "",
        startDate: "",
        endDate: "",
        department: "",
        totalCredits: 0,
        type:""
    });
    const [isEditing, setIsEditing] = useState(false);
    const handleOpenDialog = (edit: boolean = false, program?: ProgramSchedule) => {
        setIsEditing(edit);
        if (edit && program) {
            setCurrentProgram(program);
        } else {
            setCurrentProgram({
                id: programs.length + 1,
                name: "",
                startDate: "",
                endDate: "",
                department: "",
                totalCredits: 0,
                type:""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveProgram = () => {
        if (isEditing) {
            setPrograms(programs.map(p => p.id === currentProgram.id ? currentProgram : p));
        } else {
            setPrograms([...programs, currentProgram]);
        }
        handleCloseDialog();
    };

    const handleDeleteProgram = (id: number) => {
        setPrograms(programs.filter(p => p.id !== id));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentProgram({
            ...currentProgram,
            [name]: name === "totalCredits" ? Number(value) : value
        });
    };



    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <Stack spacing={2} sx={{ p: 3 }}>
                {/* Header section - separated from content */}
                <div className="flex justify-between items-center p-2">
                    <Typography variant="h4" className="font-semibold">
                        Danh sách các chương trình đào tạo
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog(false)}
                        className="bg-blue-500"
                    >
                        Thêm chương trình
                    </Button>
                </div>

                {/* Content grid - in its own container */}
                <div className="bg-transparent rounded-lg p-4">
                    <Grid container spacing={2} alignItems="stretch">
                        {programs.map((program) => (
                            <Grid item xs={12} md={6} lg={4} key={program.id} style={{ display: 'flex' }}>
                                <Card className="h-full w-full hover:shadow-lg transition-shadow">
                                    <CardContent>
                                        {/* Card content remains the same */}
                                        <div className="flex justify-between">
                                            <Typography variant="h6" className="font-bold text-blue-700">{program.name}</Typography>
                                            <div>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(true, program)}
                                                    className="text-blue-500"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteProgram(program.id)}
                                                    className="text-red-500"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </div>
                                        </div>
                                        <Typography variant="body2" className="mt-1">
                                            <strong>Khoa:</strong> {program.department}
                                        </Typography>
                                        <Typography variant="body2" className="mt-1">
                                            <strong>Loại:</strong> {program.type}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-600 mt-1">
                                            <strong>Thời gian:</strong> {program.startDate} đến {program.endDate}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-600 mt-1">
                                            <strong>Tổng tín chỉ:</strong> {program.totalCredits}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Stack>

            {/* Dialog for adding/editing programs */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? "Chỉnh sửa chương trình" : "Thêm chương trình mới"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Tên chương trình"
                        fullWidth
                        variant="outlined"
                        value={currentProgram.name}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <TextField
                        margin="dense"
                        name="department"
                        label="Khoa"
                        fullWidth
                        variant="outlined"
                        value={currentProgram.department}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <TextField
                        margin="dense"
                        name="startDate"
                        label="Ngày bắt đầu"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={currentProgram.startDate}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <TextField
                        margin="dense"
                        name="endDate"
                        label="Ngày kết thúc"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={currentProgram.endDate}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <TextField
                        margin="dense"
                        name="totalCredits"
                        label="Tổng tín chỉ"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={currentProgram.totalCredits}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="error">
                        Hủy
                    </Button>
                    <Button onClick={handleSaveProgram} color="primary" variant="contained" className="bg-blue-500">
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeLayout>
    );
}