// File: src/components/layout/sidebar_content/student_sidebar.tsx
import styled from "styled-components";
import { Link } from "react-router-dom";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/joy/Stack";
import React from "react";

interface StyledNavItemProps {
    sx?: {
        color?: string;
    };
}

const StyledNavItem = styled.div<StyledNavItemProps>`
    text-align: center;
    border-radius: 20px;
    padding: 15px 0;
    font-size: 20px;
    font-family: Arial, serif;
    font-weight: 550;
    background-color: white;
    color: ${(props) => props.sx?.color || '#4d45ff'};
    transition: all 0.2s ease;

    &:hover {
        background-color: #4880FF;
        color: white;
    }
`;

interface NavItemProps {
    to: string;
    children: React.ReactNode;
    sx?: {
        color?: string;
    };
    onClick?: (e: React.MouseEvent) => void;
}

const NavItem = ({ to, children, sx, onClick }: NavItemProps) => (
    <Link to={to} style={{ textDecoration: 'none' }} onClick={onClick}>
        <StyledNavItem sx={sx}>{children}</StyledNavItem>
    </Link>
);
interface StudentSidebarContentProps {
    onLogout: () => void;
}

export const StudentSidebarContent = ({ onLogout }: StudentSidebarContentProps) => {
    return (
        <Stack
            spacing={3}
            sx={{
                p: 2,
                height: '100%'
            }}
        >
            <Typography
                component="h1"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '25px',
                    mb: 4,
                    color: '#4880FF',
                }}
            >
                UIT - ĐKHP
            </Typography>

            <Stack spacing={2}>
                <NavItem to="/student" sx={{ color: '#4d45ff' }}>
                    Trang chủ
                </NavItem>
                <NavItem to="/student/subjects" sx={{ color: '#4d45ff' }}>
                    Đăng ký học phần
                </NavItem>
                <NavItem to="/student/academicReqMgm" sx={{ color: '#4d45ff' }}>
                    Quản lý cứu xét
                </NavItem>
                <NavItem to="/student/enrolledSubjects" sx={{ color: '#4d45ff' }}>
                    Môn đã đăng ký
                </NavItem>

            </Stack>
            <Divider sx={{ my: 2 }} />
            <NavItem to="/student/tuition" sx={{ color: '#4d45ff' }}>
                Tình trạng học phí
            </NavItem>
            <NavItem
                sx={{ color: 'darkgrey' }}
                to="/login"
                onClick={(e) => {
                    e.preventDefault();
                    onLogout();
                }}
            >
                Đăng xuất
            </NavItem>
        </Stack>
    );
};