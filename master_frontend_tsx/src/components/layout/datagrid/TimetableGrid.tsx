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
        'Tiết 9\n(15:30 - 16:15)',
        'Tiết 10\n(16:15 - 17:00)',
    ];

    const days = ['', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
            }}
        >
            <Sheet
                variant="plain"
                sx={{
                    textAlign: 'left',
                    borderRadius: '16px',
                    padding: '20px',
                    fontSize: '18px',
                    fontFamily: '"Varela Round", sans-serif',
                    fontWeight: 450,
                    backgroundColor: 'rgb(250, 250, 250)',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    color: 'rgb(39, 89, 217)',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    flexGrow: 1,
                    minHeight: '500px',
                    maxHeight: 'calc(100vh - 100px)',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    marginTop: '30px',
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: 'Montserrat, sans-serif',
                        fontStyle: 'normal',
                        color: 'rgba(33, 33, 33, 0.8)',
                        marginBottom: '14px',
                        marginTop: '0px',
                        textAlign: 'center',
                        fontSize: '30px',
                    }}
                >
                    Thời khóa biểu
                </Typography>
                <Box
                    sx={{
                        overflow: 'auto', 
                        flexGrow: 1,
                        width: '100%',
 
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
                            backgroundColor: '#6ebab6',
                            padding: '10px 6px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: '#FFFFFF',
                            borderRight: '1px solid #cccccc',
                        },
                        '& tbody td': {
                            textAlign: 'center',
                            padding: '10px',
                            fontSize: '14px',
                            color: '#4a4a4a',
                            backgroundColor: '#FFFFFF',
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
                                            fontFamily: '"Varela Round", sans-serif',
                                            fontWeight: 600,
                                            fontSize: '18px',
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
                        {timeSlots.map((timeSlot, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                }}
                            >
                                <td>
                                    <Typography
                                        level="body-md"
                                        sx={{
                                            fontWeight: 'normal',
                                            color: '#2f4f4f',
                                            whiteSpace: 'pre-line',
                                            fontFamily: '"Varela Round", sans-serif',
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
                                                backgroundColor: '#FFFFFF',
                                                fontFamily: '"Varela Round", sans-serif',
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
                </Box>
            </Sheet>
        </Box>
    );
}