import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';
import { TableRow } from "@mui/material";

export function TimetableGrid() {
    const timeSlots = [
        'Tiết 1\n(7:30 - 8:15)',
        'Tiết 2\n(8:15 - 9:00)',
        'Tiết 3\n(9:00 - 9:45)',
        'Tiết 4\n(10:00 - 10:45)',
        'Tiết 5\n(10:45 - 11:30)',
        'Tiết 6\n(13:00 - 13:45)',
        'Tiết 7\n(13:45 - 14:30)',
        'Tiết 8\n(14:30 - 15:15)',
        'Tiết 9\n(15:30 - 16:15',
        'Tiết 10\n(16:15 - 17:00)',
    ];

    const days = ['', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                overflowX: 'auto' // Thêm thanh cuộn ngang
            }}
        >
            <Sheet
            variant="outlined"
            sx={{
                '--Sheet-radius': '16px',
                width: '100%',
                minWidth: '800px',
                minHeight: '400px', 
                height: '100%',
                flexGrow: 1,
                borderRadius: 'var(--Sheet-radius)',
                background: '#ffe9c2',
                overflow: 'hidden',
            }}
        >
            <Table
                stickyHeader
                sx={{
                    width: '100%',
                    tableLayout: 'fixed',
                    '--Table-headerHeight': '50px',
                    '--Table-cellHeight': '50px',
                    '& thead th': {
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        padding: '10px 6px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#2f4f4f',
                        borderBottom: '2px solid #d1d9e6',
                    },
                    '& tbody td': {
                        textAlign: 'center',
                        padding: '10px',
                        fontSize: '14px',
                        color: '#4a4a4a',
                        borderBottom: '1px solid #e0e6ed',
                        backgroundColor: '#f5f7fa',
                    },
                    '& tr > *:first-child': {
                        position: 'sticky',
                        left: 0,
                        backgroundColor: '#f9fafc',
                        fontWeight: 'bold',
                        color: '#2f4f4f',
                        width: '140px',
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
                                        fontFamily: "Varela Round, sans-serif",
                                        fontWeight: 600,
                                        fontSize: '18px',
                                        color: '#5B2E01',
                                    }}
                                >
                                    {day}
                                </Typography>
                            </th>
                        ))}
                    </TableRow>
                </thead>
                <tbody>
                    {timeSlots.map((timeSlot, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                backgroundColor: timeSlot === 'More Info'
                                    ? 'rgba(240, 248, 255, 0.8)'
                                    : 'inherit',
                                '&:hover': {
                                    backgroundColor: 'rgba(240, 248, 255, 0.72)',
                                },
                            }}
                        >
                            <td>
                                <Typography
                                    level="body-md"
                                    sx={{
                                        fontWeight: timeSlot === 'More Info' ? 'bold' : 'normal',
                                        color: '#2f4f4f',
                                        whiteSpace: 'pre-line', 
                                        fontFamily: "Varela Round, sans-serif",
                                    }}
                                >
                                    {timeSlot}
                                </Typography>
                            </td>
                            {days.slice(1).map((_, dayIndex) => (
                                <td key={dayIndex}>
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s',
                                            backgroundColor: '#f5f7fa',
                                            fontFamily: "Varela Round, sans-serif",
                                            '&:hover': {
                                                backgroundColor: '#d9e6f2',
                                            },
                                        }}
                                    />
                                </td>
                            ))}
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </Sheet>
        </Box>
    );
}