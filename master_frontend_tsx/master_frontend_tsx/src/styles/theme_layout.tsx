// File: src/styles/theme_layout.tsx
import { ReactNode } from "react";
import styled from "styled-components";
import { SideBar } from "../components/sidebar";
import { MainBgColor } from "../components/main_bg_for_data";
import { AcademicSidebarContent } from "../components/layout/sidebar_content/academic_affair_sidebar";
import { StudentSidebarContent } from "../components/layout/sidebar_content/student_sidebar";
import { FinancialDeptSidebarContent } from "../components/layout/sidebar_content/financial_depm_sidebar";
import { AdminSidebarContent } from "../components/layout/sidebar_content/admin_sidebar";

const ThemeContainer = styled.div`
    display: flex;
    min-height: 100vh;
    width: 100%;
`;

interface ThemeLayoutProps {
    children: ReactNode;
    role: "student" | "academic" | "financial" | "admin";
    onLogout: () => void;
}

export const ThemeLayout = ({ children, role,onLogout }: ThemeLayoutProps) => {
    const getSidebarContent = () => {
        switch (role) {
            case "student":
                return <StudentSidebarContent onLogout={onLogout} />;
            case "academic":
                return <AcademicSidebarContent onLogout={onLogout} />;
            case "financial":
                return <FinancialDeptSidebarContent onLogout={onLogout} />;
            case "admin":
                return <AdminSidebarContent onLogout={onLogout}/>;
            default:
                return null;
        }
    };

    return (
        <ThemeContainer>
            <SideBar>
                {getSidebarContent()}
            </SideBar>
            <MainBgColor>
                {children}
            </MainBgColor>
        </ThemeContainer>
    );
};