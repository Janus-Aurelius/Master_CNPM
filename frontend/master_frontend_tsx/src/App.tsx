import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import { User } from "./types";
import LoginForm from "./login_page/login_form";
import { useNavigate } from 'react-router-dom';

//Student
import StudentPage from "./student_pages/dashboard_student";
import SubjectRegistrationForm from "./student_pages/subject_registration_form";
import { AcademicAffairDeptReqMgm } from "./student_pages/academic_affair_dept_reg_mgm";
import { EnrolledSubject } from "./student_pages/enrolled_subject";
import TuitionCollecting  from "./student_pages/tuition_collecting";
//Academic affair depmt
import AcademicPage from "./academic_affair_pages/dashboard_academic";
import ProgramMgmAcademic from "./academic_affair_pages/programMgm_academic.tsx";
import CourseMgmAcademic from "./academic_affair_pages/courseMgm_academic.tsx";
import OpenCourseMgmAcademic from "./academic_affair_pages/openCourseMgm_academic.tsx";
import StudentMgmAcademic from "./academic_affair_pages/studentMgm_academic.tsx";
//Financial
import FinancialPage from "./financial_dpm_pages/dashboard_financial.tsx";
import PaymentStatusMgm from "./financial_dpm_pages/paymentStatusMgm_financial.tsx";
import TuitionAdjustment from "./financial_dpm_pages/tuitionAdjustment_financial.tsx";
//Admin
import AdminPage from "./admin_pages/dashboard_admin.tsx";
import UserManagement from "./admin_pages/userManagement_admin.tsx";
import SystemConfigAndMaintenance from "./admin_pages/systemConfigAndMaintenance_admin.tsx";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

interface UserData {
    id: string;
    username: string;
    role: string;
    studentId?: string;
}

export default function App() {
    console.log('App component loaded');
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setIsAuthChecked(true);
    }, []);

    const handleLogin = (userData: UserData) => {
        const userWithIndex = userData as User;
        setUser(userWithIndex);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Xóa token khi logout
        navigate("/login");
    };

    // Protected route component
    const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
        console.log('ProtectedRoute', { user, allowedRoles });
        if (!user) {
            return <Navigate to="/login" replace />;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return <>{children}</>;
    };

    if (!isAuthChecked) {
        // Or a spinner/loading indicator
        return <div>Loading...</div>;
    }

    console.log('App render, user:', user);
    console.log('Academic ProtectedRoute');

    return (
// reroute the flow to login first then to the respective role
            <Routes>
                <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />

                <Route path="/student/*" element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <Routes>
                            <Route index element={<StudentPage user={user} onLogout={handleLogout} />} />
                            <Route path="subjects" element={<SubjectRegistrationForm user={user} onLogout={handleLogout} />} />
                            <Route path="academicReqMgm" element={<AcademicAffairDeptReqMgm onLogout={handleLogout}/>} />
                            <Route path="enrolledSubjects" element={
                                <EnrolledSubject
                                    user={user} // Pass the user prop
                                    handleUnenroll={(subject) => {
                                        console.log("Unenrolling from", subject);
                                        // Add your unenroll logic here
                                    }}
                                    onLogout={handleLogout}
                                />
                            } />
                            <Route path="tuition" element={<TuitionCollecting user={user} onLogout={handleLogout} />} />
                            {/* Add more student routes here */}
                        </Routes>
                    </ProtectedRoute>
                } />

                <Route path="/academic/*" element={
                    <ProtectedRoute allowedRoles={['academic']}>
                        <Routes>
                            <Route index element={<AcademicPage user={user} onLogout={handleLogout} />} />
                            <Route path="dashboard" element={<AcademicPage user={user} onLogout={handleLogout} />} />
                            <Route path="programsMgm" element={<ProgramMgmAcademic user={user} onLogout={handleLogout} />} />
                            <Route path="subjectMgm" element={<CourseMgmAcademic user={user} onLogout={handleLogout} />} />
                            <Route path="openCourseMgm" element={<OpenCourseMgmAcademic user={user} onLogout={handleLogout} />} />
                            <Route path="studentMgm" element={<StudentMgmAcademic user={user} onLogout={handleLogout} />} />
                        </Routes>
                    </ProtectedRoute>
                } />

                <Route path="/financial/*" element={
                    <ProtectedRoute allowedRoles={['financial']}>
                        <Routes>
                        <Route index element={<FinancialPage user={user} onLogout={handleLogout} />} />
                        <Route path="dashboard" element={<FinancialPage user={user} onLogout={handleLogout} />} />
                        <Route path="paymentstatus" element={<PaymentStatusMgm user={user} onLogout={handleLogout} />} />
                        <Route path="tuitionAdjustment" element={<TuitionAdjustment user={user} onLogout={handleLogout} />} />
                        </Routes>
                    </ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <Routes>
                            <Route index element={<AdminPage user={user} onLogout={handleLogout} />} />
                            <Route path="dashboard" element={<AdminPage user={user} onLogout={handleLogout} />} />
                            <Route path="userManagement" element={<UserManagement user={user} onLogout={handleLogout} />} />
                            <Route path="config" element={<SystemConfigAndMaintenance user={user} onLogout={handleLogout} />} />
                        </Routes>
                    </ProtectedRoute>
                } />


                <Route path="/unauthorized" element={<div>You are not authorized to view this page</div>} />

                {/* Default redirect to login if no match */}
                <Route path="*" element={<Navigate to={user ? `/${user.role}` : "/login"} replace />} />
            </Routes>

    );
}