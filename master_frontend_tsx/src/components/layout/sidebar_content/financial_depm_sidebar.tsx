import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/material/Divider";
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

interface FinancialDeptSidebarContentProps {
    onLogout: () => void;
}

export const FinancialDeptSidebarContent = ({ onLogout }: FinancialDeptSidebarContentProps) => {
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
                UIT - Phòng Tài Chính
            </Typography>

            <Stack spacing={2}>
                <NavItem to="/financial" sx={{ color: '#4d45ff' }}>
                    Trang chủ
                </NavItem>
                <NavItem to="/financial/paymentstatus" sx={{ color: '#4d45ff' }}>
                    Quản lý tình trạng thanh toán
                </NavItem>
                <NavItem to="/financial/tuitionAdjustment" sx={{ color: '#4d45ff' }}>
                    Quản lý học phí
                </NavItem>
            </Stack>
            <Divider sx={{ my: 2 }} />
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