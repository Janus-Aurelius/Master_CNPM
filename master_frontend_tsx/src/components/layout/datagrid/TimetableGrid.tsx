// File: src/components/layout/datagrid/TimetableGrid.tsx
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import  Table from '@mui/joy/Table';
import {TableRow} from "@mui/material";
export function TimetableGrid() {
    const timeSlots = [
        '8:00 - 9:00',
        '9:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '12:00 - 13:00',
        '13:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 17:00',
        'More Info'
    ];

    const days = ['Time Slot', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    return (
        <Sheet
            variant="outlined"
            sx={{
                '--Sheet-radius': '12px',
                width: '100%',
                height: '100%',
                borderRadius: 'var(--Sheet-radius)',
                boxShadow: 'sm',
            }}
        >
            <Table
                stickyHeader
                sx={{
                    width: '100%',
                    tableLayout: 'fixed',
                    '--Table-headerHeight': '60px',
                    '--Table-cellHeight': '60px',
                    '--TableCell-selectedBackground': 'var(--joy-palette-background-level2)',
                    '& thead th': {
                        textAlign: 'center',
                        backgroundColor: 'var(--joy-palette-background-level1)',
                        padding: '16px 8px',
                    },
                    '& tbody td': {
                        textAlign: 'center',
                        padding: '8px',
                    },
                    '& tr > *:first-child': {
                        position: 'sticky',
                        left: 0,
                        boxShadow: '1px 0 var(--joy-palette-divider)',
                        bgcolor: 'background.surface',
                        width: '120px',
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
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%'
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
                                ? 'var(--joy-palette-background-level1)'
                                : 'inherit',
                        }}
                    >
                        <td>
                            <Typography
                                level="body-md"
                                sx={{
                                    fontWeight: timeSlot === 'More Info' ? 'bold' : 'normal'
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
                                        borderRadius: 'md',
                                        transition: 'all 0.2s',
                                    }}
                                />
                            </td>
                        ))}
                    </TableRow>
                ))}
                </tbody>
            </Table>
        </Sheet>
    );
}