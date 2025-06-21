// File: src/components/layout/datagrid/subjects_grid.tsx
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";

// Define the subject interface
interface Subject {
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
}

// Define the component props interface
interface SubjectsGridProps {
    subjects?: Subject[];
    handleEvent?: (subject: Subject) => void;
    enrollText?: string;
    sx?: SxProps<Theme>;
    [key: string]: unknown; // for other props
}

const SubjectsGrid = ({
                          subjects = [],
                          handleEvent = () => {},
                          enrollText = "Enroll",
                          sx,
                          ...otherProps
                      }: SubjectsGridProps) => {
    return (        <Box
            sx={{
                maxHeight: "400px",
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "1fr",
                rowGap: "8px",
                '&::-webkit-scrollbar': {
                    width: '6px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '6px'
                },
                ...sx,
            }}
            {...otherProps}
        >
            {subjects && subjects.length > 0 ? (
                subjects.map((subject, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(6, 1fr)",
                            alignItems: "center",
                            padding: "8px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: 1,
                        }}
                    >
                        <Typography variant="body1" sx={{ gridColumn: "span 1" }}>
                            {subject.name}
                        </Typography>
                        <Typography variant="body1" sx={{ gridColumn: "span 1" }}>
                            {subject.lecturer}
                        </Typography>
                        <Typography variant="body1" sx={{ gridColumn: "span 1" }}>
                            {subject.day}
                        </Typography>
                        <Typography variant="body1" sx={{ gridColumn: "span 1" }}>
                            {subject.session}
                        </Typography>
                        <Typography variant="body1" sx={{ gridColumn: "span 1" }}>
                            {subject.fromTo}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => handleEvent(subject)}
                            sx={{ gridColumn: "span 1" }}
                        >
                            {enrollText}
                        </Button>
                    </Box>
                ))
            ) : (
                <Typography sx={{ p: 2, textAlign: "center", color: 'darkgrey' }}>No subjects available</Typography>
            )}
        </Box>
    );
};

export default SubjectsGrid;