import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';
import { TableRow } from "@mui/material";
import { Card, CardContent, Chip } from '@mui/material';

// Component SubjectCard hiển thị thông tin môn học với thời gian
const SubjectCard = ({ subject }: { subject: TimetableSubject }) => {
    // Helper function để lấy thời gian từ fromTo
    const getTimeRange = (fromTo: string) => {
        const timeMap: Record<string, string> = {
            '1': '7:30-8:15',
            '2': '8:15-9:00', 
            '3': '9:00-9:45',
            '4': '10:00-10:45',
            '5': '10:45-11:30',
            '6': '13:00-13:45',
            '7': '13:45-14:30',
            '8': '14:30-15:15',
            '9': '15:30-16:15',
            '10': '16:15-17:00'
        };
        
        const match = fromTo.match(/(\d+)(?:-(\d+))?/);
        if (match) {
            const start = parseInt(match[1]);
            const end = match[2] ? parseInt(match[2]) : start;
            
            const startTime = timeMap[start.toString()]?.split('-')[0];
            const endTime = timeMap[end.toString()]?.split('-')[1];
            
            if (startTime && endTime) {
                return `${startTime} - ${endTime}`;
            }
        }
        return '';
    };    return (
        <Card
            sx={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                height: '100%',
                minHeight: '70px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                },
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                }
            }}
        >            <CardContent sx={{ 
                p: 1.5, 
                color: '#475569', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                '&:last-child': { pb: 1.5 }
            }}>
                {/* Mã môn học */}
                <Chip
                    label={subject.id}
                    size="small"
                    sx={{
                        backgroundColor: '#6366f1',
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        height: '20px',
                        mb: 0.8,
                        '& .MuiChip-label': {
                            px: 0.6,
                            fontFamily: '"Varela Round", sans-serif',
                            letterSpacing: '0.3px',
                        }
                    }}
                />

                {/* Tên môn học */}
                <Typography
                    sx={{
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                        color: '#334155',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: '"Varela Round", sans-serif',
                        textAlign: 'center',
                        mb: 0.5,
                    }}
                >
                    {subject.name}
                </Typography>

                {/* Thời gian học */}
                <Typography
                    sx={{
                        fontSize: '0.65rem',
                        color: '#64748b',
                        fontFamily: '"Varela Round", sans-serif',
                        fontWeight: '500',
                        letterSpacing: '0.2px',
                    }}
                >
                    {getTimeRange(subject.fromTo)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export interface TimetableSubject {
    id: string;
    name: string;
    day: string; // 'Thứ 2', 'Thứ 3', ...
    session: string; // '1', '2', ...
    fromTo: string; // 'Tiết 1-4'
    credits?: number;
}

interface TimetableGridProps {
    subjects: TimetableSubject[];
}

export function TimetableGrid({ subjects }: TimetableGridProps) {
    const timeSlots = [
        'Tiết 1\n(7:30 - 8:15)',
        'Tiết 2\n(8:15 - 9:00)',
        'Tiết 3\n(9:00 - 9:45)',
        'Tiết 4\n(10:00 - 10:45)',
        'Tiết 5\n(10:45 - 11:30)',
        'Tiết 6\n(13:00 - 13:45)',
        'Tiết 7\n(13:45 - 14:30)',
        'Tiết 8\n(14:30 - 15:15)',
        'Tiết 9\n(15:30 - 16:15)',
        'Tiết 10\n(16:15 - 17:00)',
    ];

    const days = ['', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    // Helper: chuyển 'Thứ 2' -> 1, 'Thứ 3' -> 2, ...
    const dayToIndex = (day: string) => {
        const map: Record<string, number> = {
            'Thứ 2': 1, 'Thứ Hai': 1,
            'Thứ 3': 2, 'Thứ Ba': 2,
            'Thứ 4': 3, 'Thứ Tư': 3,
            'Thứ 5': 4,
            'Thứ 6': 5,
            'Thứ 7': 6,
        };
        return map[day] ?? -1;
    };    // Helper: parse fromTo để lấy start và end period
    const parsePeriod = (fromTo: string) => {
        // Parse "Tiết 1-3" -> {start: 1, end: 3}
        const match = fromTo.match(/(\d+)-(\d+)/);
        if (match) {
            return { start: parseInt(match[1]), end: parseInt(match[2]) };
        }
        // Parse "Tiết 1" -> {start: 1, end: 1}  
        const singleMatch = fromTo.match(/(\d+)/);
        if (singleMatch) {
            const period = parseInt(singleMatch[1]);
            return { start: period, end: period };
        }
        return { start: 1, end: 1 };
    };

    // Tạo ma trận thời khóa biểu với spanning
    const grid: (TimetableSubject | null)[][] = Array.from({ length: 10 }, () => Array(7).fill(null));
    const spanInfo: { [key: string]: { rowSpan: number; isFirst: boolean } } = {};
    
    subjects.forEach(subj => {
        const dayIdx = dayToIndex(subj.day);
        const { start, end } = parsePeriod(subj.fromTo);
        const startIdx = start - 1; // Convert to 0-based index
        const endIdx = end - 1;
        
        if (dayIdx >= 1 && dayIdx <= 6 && startIdx >= 0 && startIdx < 10) {
            // Đặt subject vào ô đầu tiên
            grid[startIdx][dayIdx] = subj;
            
            // Tạo span info
            const spanKey = `${startIdx}-${dayIdx}`;
            spanInfo[spanKey] = {
                rowSpan: endIdx - startIdx + 1,
                isFirst: true
            };
            
            // Đánh dấu các ô tiếp theo là occupied
            for (let i = startIdx + 1; i <= endIdx && i < 10; i++) {
                grid[i][dayIdx] = subj; // Đặt cùng một subject
                spanInfo[`${i}-${dayIdx}`] = {
                    rowSpan: 0,
                    isFirst: false
                };
            }
        }
    });

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.25rem' }}>
            <Sheet
                variant="plain"
                sx={{
                    textAlign: 'left',
                    borderRadius: '1rem',
                    padding: '1.25rem',
                    fontSize: '1.125rem',
                    fontFamily: '"Varela Round", sans-serif',
                    fontWeight: 450,
                    backgroundColor: 'rgb(250, 250, 250)',
                    boxShadow: '0 0.125rem 0.3125rem rgba(0, 0, 0, 0.1)',
                    color: 'rgb(39, 89, 217)',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    flexGrow: 1,
                    minHeight: '31.25rem',
                    maxHeight: 'calc(100vh - 6.25rem)',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    marginRight: '0.625rem',
                    marginTop: '3.5rem',
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: 'Montserrat, sans-serif',
                        fontStyle: 'normal',
                        color: 'rgba(33, 33, 33, 0.8)',
                        marginBottom: '0.875rem',
                        marginTop: '0rem',
                        textAlign: 'center',
                        fontSize: '1.875rem',
                    }}
                >
                    Thời khóa biểu
                </Typography>
                <Box sx={{ overflow: 'auto', flexGrow: 1, width: '100%' }}>
                    <Table 
                        stickyHeader
                        sx={{
                            width: '100%',
                            tableLayout: 'fixed',
                            '--Table-headerHeight': '3.3rem', // 1.5x of 2.2rem
                            '--Table-cellHeight': '3.3rem',   // 1.5x of 2.2rem
                            '& thead th': {
                                textAlign: 'center',
                                backgroundColor: '#6ebab6',
                                padding: '0.45rem 0.3rem', // 1.5x of 0.3rem 0.2rem
                                fontWeight: 'bold',
                                fontSize: '1.425rem', // 1.5x of 0.95rem
                                color: '#FFFFFF',
                                borderRight: '0.0625rem solid #cccccc',
                            },                            '& tbody td': {
                                textAlign: 'center',
                                padding: '0.15rem', // 1.5x of 0.1rem
                                fontSize: '1.2rem', // 1.5x of 0.8rem
                                color: '#4a4a4a',
                                backgroundColor: '#FFFFFF',
                                verticalAlign: 'top',
                                height: '57px', // 1.5x of 38px
                                position: 'relative',
                            },
                            '& tr > *:first-child': {
                                position: 'sticky',
                                left: 0,
                                backgroundColor: '#f9fafc',
                                fontWeight: 'bold',
                                color: '#2f4f4f',
                                width: '11.25rem', // 1.5x of 7.5rem
                            },
                        }}
                    >
                        <thead>
                            <TableRow>
                                {days.map((day) => (
                                    <th key={day}>
                                        <Typography
                                            level="title-md"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%',
                                                fontFamily: '"Varela Round", sans-serif',
                                                fontWeight: 600,
                                                fontSize: '1.125rem',
                                                color: '#FFFFFF',
                                            }}
                                        >
                                            {day}
                                        </Typography>
                                    </th>
                                ))}
                            </TableRow>
                        </thead>
                        <tbody>
                            {timeSlots.map((timeSlot, rowIdx) => (
                                <TableRow key={rowIdx}>
                                    <td style={{ verticalAlign: 'middle', height: '57px' }}>
                                        <Typography
                                            level="body-md"
                                            sx={{
                                                fontWeight: 'normal',
                                                color: '#2f4f4f',
                                                whiteSpace: 'pre-line',
                                                fontFamily: '"Varela Round", sans-serif',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {timeSlot}
                                        </Typography>
                                    </td>
                                    {days.slice(1).map((_, colIdx) => {
                                        const spanKey = `${rowIdx}-${colIdx + 1}`;
                                        const span = spanInfo[spanKey];
                                        
                                        // Skip nếu không phải ô đầu tiên của span
                                        if (span && !span.isFirst) {
                                            return null;
                                        }
                                        
                                        return (
                                            <td 
                                                key={colIdx}
                                                rowSpan={span ? span.rowSpan : 1}
                                                style={{
                                                    verticalAlign: 'top',
                                                    padding: span && span.rowSpan > 1 ? '0.3rem' : '0.4rem'
                                                }}
                                            >
                                                {grid[rowIdx][colIdx + 1] && span?.isFirst ? (
                                                    <SubjectCard subject={grid[rowIdx][colIdx + 1]!} />
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </Box>
            </Sheet>
        </Box>
    );
}