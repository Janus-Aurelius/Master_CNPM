import { ThemeLayout } from "../styles/theme_layout";
import Box from "@mui/material/Box";
import { TimetableGrid, TimetableSubject } from "../components/layout/datagrid/TimetableGrid";
import { StudentPageProps } from "../types";
import UserInfo from "../components/UserInfo";
import { useEffect, useState } from "react";
import { dashboardApi, convertToTimetableSubject } from "../api_clients/student/dashboardApi";

const DashboardStudent = ({ user, onLogout }: StudentPageProps) => {
    const [subjects, setSubjects] = useState<TimetableSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !user.id) return;
        setLoading(true);
        setError(null);        // Sử dụng dashboardApi mới để lấy thời khóa biểu
        dashboardApi.getStudentTimetable()
            .then((timetableData) => {
                console.log('📅 Raw timetable data:', timetableData);
                
                // Convert timetable entries to TimetableSubject format
                const timetableSubjects: TimetableSubject[] = timetableData.map(entry => 
                    convertToTimetableSubject(entry)
                );
                
                console.log('📅 Converted timetable subjects:', timetableSubjects);
                setSubjects(timetableSubjects);
            })
            .catch((err) => {
                console.error('❌ Error loading timetable:', err);
                setError(err.message || 'Lỗi khi tải thời khóa biểu');
            })
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <UserInfo user={user} />
            <Box sx={{ padding: "0", position: "relative" }}>
                <TimetableGrid subjects={subjects} />
                {loading && <div style={{textAlign: 'center', marginTop: 16}}>Đang tải thời khóa biểu...</div>}
                {error && <div style={{color: 'red', textAlign: 'center', marginTop: 16}}>{error}</div>}
            </Box>
        </ThemeLayout>
    );
};

export default DashboardStudent;