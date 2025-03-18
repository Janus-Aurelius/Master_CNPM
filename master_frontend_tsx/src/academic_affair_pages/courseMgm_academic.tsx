import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface Subject {
    id: number;
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
    room?: string;
    credits?: number;
}

interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

export default function CourseMgmAcademic({ onLogout }: AcademicPageProps) {
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: 1, name: 'Kỹ thuật lập trình', lecturer: 'TS. Nguyễn Văn A', day: 'Thứ Hai', session: '1', fromTo: '08:00-10:00', room: 'H1-101', credits: 3 },
        { id: 2, name: 'Cấu trúc dữ liệu', lecturer: 'PGS. Trần Thị B', day: 'Thứ Ba', session: '2', fromTo: '10:00-12:00', room: 'H2-202', credits: 4 },
        { id: 3, name: 'Cơ sở dữ liệu', lecturer: 'TS. Lê Văn C', day: 'Thứ Tư', session: '3', fromTo: '12:00-14:00', room: 'H3-303', credits: 3 },
        { id: 4, name: 'Phân tích thiết kế hệ thống', lecturer: 'TS. Phạm Thị D', day: 'Thứ Năm', session: '4', fromTo: '14:00-16:00', room: 'H4-404', credits: 4 },
        { id: 5, name: 'Lập trình web', lecturer: 'TS. Hoàng Văn E', day: 'Thứ Sáu', session: '5', fromTo: '16:00-18:00', room: 'H5-505', credits: 3 },
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [currentSubject, setCurrentSubject] = useState<Subject>({
        id: 0,
        name: '',
        lecturer: '',
        day: '',
        session: '',
        fromTo: '',
        room: '',
        credits: 0
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleOpenDialog = (edit: boolean = false, subject?: Subject) => {
        setIsEditing(edit);
        if (edit && subject) {
            setCurrentSubject(subject);
        } else {
            setCurrentSubject({
                id: subjects.length + 1,
                name: '',
                lecturer: '',
                day: '',
                session: '',
                fromTo: '',
                room: '',
                credits: 0
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveSubject = () => {
        if (isEditing) {
            setSubjects(subjects.map(s => s.id === currentSubject.id ? currentSubject : s));
        } else {
            setSubjects([...subjects, currentSubject]);
        }
        handleCloseDialog();
    };

    const handleDeleteSubject = (id: number) => {
        setSubjects(subjects.filter(s => s.id !== id));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentSubject({
            ...currentSubject,
            [name]: name === "credits" ? Number(value) : value
        });
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setCurrentSubject({
            ...currentSubject,
            [name]: value
        });
    };

    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <Stack spacing={2} sx={{ p: 3 }}>
                {/* Header section */}
                <div className="flex justify-between items-center p-2">
                    <Typography variant="h4" className="font-semibold">
                        Quản lý học phần
                    </Typography>
                    <div className="flex gap-4 p-2">
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<UploadFileIcon />}
                            className="border-blue-500 text-blue-500"
                        >
                            Nhập file
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog(false)}
                            className="bg-blue-500"
                        >
                            Thêm học phần
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <TableContainer component={Paper} className="shadow-md">
                    <Table sx={{ minWidth: 650 }} aria-label="subject table">
                        <TableHead className="bg-gray-100">
                            <TableRow>
                                <TableCell className="font-semibold">Tên học phần</TableCell>
                                <TableCell className="font-semibold">Giảng viên</TableCell>
                                <TableCell className="font-semibold">Ngày</TableCell>
                                <TableCell className="font-semibold">Ca học</TableCell>
                                <TableCell className="font-semibold">Thời gian</TableCell>
                                <TableCell className="font-semibold">Phòng</TableCell>
                                <TableCell className="font-semibold">Số tín chỉ</TableCell>
                                <TableCell className="font-semibold" align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((subject) => (
                                <TableRow key={subject.id} hover className="hover:bg-gray-50">
                                    <TableCell component="th" scope="row">
                                        {subject.name}
                                    </TableCell>
                                    <TableCell>{subject.lecturer}</TableCell>
                                    <TableCell>{subject.day}</TableCell>
                                    <TableCell>{subject.session}</TableCell>
                                    <TableCell>{subject.fromTo}</TableCell>
                                    <TableCell>{subject.room}</TableCell>
                                    <TableCell>{subject.credits}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(true, subject)}
                                            className="text-blue-500"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteSubject(subject.id)}
                                            className="text-red-500"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>

            {/* Dialog for adding/editing subjects */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? "Chỉnh sửa học phần" : "Thêm học phần mới"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Tên học phần"
                        fullWidth
                        variant="outlined"
                        value={currentSubject.name}
                        onChange={handleInputChange}
                        className="mb-3 mt-2"
                    />
                    <TextField
                        margin="dense"
                        name="lecturer"
                        label="Giảng viên"
                        fullWidth
                        variant="outlined"
                        value={currentSubject.lecturer}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <FormControl fullWidth margin="dense" className="mb-3">
                        <InputLabel id="day-select-label">Ngày</InputLabel>
                        <Select
                            labelId="day-select-label"
                            name="day"
                            value={currentSubject.day}
                            label="Ngày"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="Thứ Hai">Thứ Hai</MenuItem>
                            <MenuItem value="Thứ Ba">Thứ Ba</MenuItem>
                            <MenuItem value="Thứ Tư">Thứ Tư</MenuItem>
                            <MenuItem value="Thứ Năm">Thứ Năm</MenuItem>
                            <MenuItem value="Thứ Sáu">Thứ Sáu</MenuItem>
                            <MenuItem value="Thứ Bảy">Thứ Bảy</MenuItem>
                            <MenuItem value="Chủ Nhật">Chủ Nhật</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense" className="mb-3">
                        <InputLabel id="session-select-label">Ca học</InputLabel>
                        <Select
                            labelId="session-select-label"
                            name="session"
                            value={currentSubject.session}
                            label="Ca học"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="1">Ca 1</MenuItem>
                            <MenuItem value="2">Ca 2</MenuItem>
                            <MenuItem value="3">Ca 3</MenuItem>
                            <MenuItem value="4">Ca 4</MenuItem>
                            <MenuItem value="5">Ca 5</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        name="fromTo"
                        label="Thời gian"
                        fullWidth
                        variant="outlined"
                        value={currentSubject.fromTo}
                        onChange={handleInputChange}
                        className="mb-3"
                        placeholder="Ví dụ: 08:00-10:00"
                    />
                    <TextField
                        margin="dense"
                        name="room"
                        label="Phòng"
                        fullWidth
                        variant="outlined"
                        value={currentSubject.room}
                        onChange={handleInputChange}
                        className="mb-3"
                    />
                    <TextField
                        margin="dense"
                        name="credits"
                        label="Số tín chỉ"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={currentSubject.credits}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="error">
                        Hủy
                    </Button>
                    <Button onClick={handleSaveSubject} color="primary" variant="contained" className="bg-blue-500">
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeLayout>
    );
}