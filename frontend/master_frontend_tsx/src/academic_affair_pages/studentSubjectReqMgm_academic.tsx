import { useState } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import {Stack, Typography, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, TextField, MenuItem, Select,FormControl,InputLabel,Collapse,Box,IconButton,Chip,InputAdornment} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FilterListIcon from "@mui/icons-material/FilterList";

interface StudentSubjectReqMgmAcademicProps {
    user: User | null;
    onLogout: () => void;
}

enum RequestType {
    ADD = "Thêm học phần",
    DELETE = "Xóa học phần"
}

enum RequestStatus {
    PENDING = "Chờ xử lý",
    APPROVED = "Đã duyệt",
    REJECTED = "Từ chối"
}

interface Request {
    id: number;
    studentId: string;
    studentName: string;
    type: RequestType;
    subjectCode: string;
    subjectName: string;
    requestDate: string;
    reason: string;
    status: RequestStatus;
}

export default function StudentSubjectReqMgmAcademic({ onLogout }: StudentSubjectReqMgmAcademicProps) {
    // Sample data
    const sampleRequests: Request[] = [
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
            status: RequestStatus.PENDING
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
            status: RequestStatus.APPROVED
        },
        {
            id: 4,
            studentId: "SV004",
            studentName: "Phạm Thị D",
            type: RequestType.DELETE,
            subjectCode: "EN101",
            subjectName: "Tiếng Anh cơ bản",
            requestDate: "12/06/2023",
            reason: "Đã có chứng chỉ TOEIC 650",
            status: RequestStatus.REJECTED
        },
        {
            id: 5,
            studentId: "SV005",
            studentName: "Hoàng Văn E",
            type: RequestType.ADD,
            subjectCode: "CS202",
            subjectName: "Cấu trúc dữ liệu và giải thuật",
            requestDate: "11/06/2023",
            reason: "Muốn học trước để chuẩn bị cho kỳ thực tập",
            status: RequestStatus.PENDING
        }
    ];

    const [requests, setRequests] = useState<Request[]>(sampleRequests);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [openRows, setOpenRows] = useState<number[]>([]);

    // Toggle row expansion
    const handleRowToggle = (requestId: number) => {
        setOpenRows(prev =>
            prev.includes(requestId)
                ? prev.filter(id => id !== requestId)
                : [...prev, requestId]
        );
    };

    // Handle request approval
    const handleApprove = (requestId: number) => {
        setRequests(prev =>
            prev.map(req =>
                req.id === requestId
                    ? {...req, status: RequestStatus.APPROVED}
                    : req
            )
        );
    };

    // Handle request rejection
    const handleReject = (requestId: number) => {
        setRequests(prev =>
            prev.map(req =>
                req.id === requestId
                    ? {...req, status: RequestStatus.REJECTED}
                    : req
            )
        );
    };

    // Filter requests based on search and filters
    const filteredRequests = requests.filter(request => {
        const matchesSearch =
            request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' || request.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Get status color
    const getStatusColor = (status: RequestStatus) => {
        switch(status) {
            case RequestStatus.APPROVED: return "success";
            case RequestStatus.REJECTED: return "error";
            default: return "warning";
        }
    };

    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <Stack spacing={2} sx={{ p: 3 }}>
                {/* Header section */}
                <div className="flex justify-between items-center p-2">
                    <Typography variant="h4" className="font-semibold">
                        Quản lý cứu xét
                    </Typography>
                </div>

                {/* Search and filter section */}
                <Paper
                    className="p-4 shadow-md"
                    sx={{
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderTopRightRadius: '16px',
                        borderBottomRightRadius: '16px',
                    }}
                >
                    <div className="flex flex-wrap gap-4 items-center">
                        <TextField
                            placeholder="Tìm kiếm theo tên, mã SV, học phần..."
                            variant="outlined"
                            size="small"
                            className="flex-grow"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <div className="flex gap-4">
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel id="type-filter-label">Loại yêu cầu</InputLabel>
                                <Select
                                    labelId="type-filter-label"
                                    value={typeFilter}
                                    label="Loại yêu cầu"
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    <MenuItem value={RequestType.ADD}>{RequestType.ADD}</MenuItem>
                                    <MenuItem value={RequestType.DELETE}>{RequestType.DELETE}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel id="status-filter-label">Trạng thái</InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    value={statusFilter}
                                    label="Trạng thái"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    <MenuItem value={RequestStatus.PENDING}>{RequestStatus.PENDING}</MenuItem>
                                    <MenuItem value={RequestStatus.APPROVED}>{RequestStatus.APPROVED}</MenuItem>
                                    <MenuItem value={RequestStatus.REJECTED}>{RequestStatus.REJECTED}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </Paper>

                {/* Requests table */}
                <TableContainer component={Paper} className="shadow-md">
                    <Table sx={{ minWidth: 650 }} aria-label="request table">
                        <TableHead className="bg-gray-100">
                            <TableRow>
                                <TableCell width="50px"></TableCell>
                                <TableCell className="font-semibold">Mã SV</TableCell>
                                <TableCell className="font-semibold">Tên sinh viên</TableCell>
                                <TableCell className="font-semibold">Loại yêu cầu</TableCell>
                                <TableCell className="font-semibold">Mã học phần</TableCell>
                                <TableCell className="font-semibold">Tên học phần</TableCell>
                                <TableCell className="font-semibold">Ngày yêu cầu</TableCell>
                                <TableCell className="font-semibold">Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRequests.map((request) => (
                                <>
                                    <TableRow
                                        key={request.id}
                                        hover
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleRowToggle(request.id)}
                                    >
                                        <TableCell>
                                            <IconButton size="small">
                                                {openRows.includes(request.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{request.studentId}</TableCell>
                                        <TableCell>{request.studentName}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.type}
                                                color={request.type === RequestType.ADD ? "primary" : "default"}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>{request.subjectCode}</TableCell>
                                        <TableCell>{request.subjectName}</TableCell>
                                        <TableCell>{request.requestDate}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={request.status}
                                                color={getStatusColor(request.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}>
                                            <Collapse in={openRows.includes(request.id)} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2, backgroundColor: '#f9fafb', p: 2, borderRadius: 1 }}>
                                                    <Typography variant="subtitle1" gutterBottom component="div" fontWeight="bold">
                                                        Lý do yêu cầu:
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom component="div" sx={{ mb: 2 }}>
                                                        {request.reason}
                                                    </Typography>
                                                    {request.status === RequestStatus.PENDING && (
                                                        <div className="flex gap-2 justify-end mt-2">
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleReject(request.id);
                                                                }}
                                                            >
                                                                Từ chối
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleApprove(request.id);
                                                                }}
                                                            >
                                                                Duyệt yêu cầu
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ))}
                            {filteredRequests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Không tìm thấy yêu cầu nào
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </ThemeLayout>
    );
}