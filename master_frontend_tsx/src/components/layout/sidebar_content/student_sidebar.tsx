import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/joy/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import BookOutlined from '@mui/icons-material/BookOutlined';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import ListAltOutlined from '@mui/icons-material/ListAltOutlined';
import MonetizationOnOutlined from '@mui/icons-material/MonetizationOnOutlined';
import ExitToAppOutlined from '@mui/icons-material/ExitToAppOutlined';

interface StyledNavItemProps {
    sx?: React.CSSProperties;
    isLogout?: boolean; // Added isLogout property
    selected?: boolean; // Added selected property for consistency
}

const StyledNavItem = styled.div<StyledNavItemProps>`
    text-align: left;
    border-radius: 15px;
    padding: 20px 13px;
    font-size: 18px;
    font-family: "Varela Round", sans-serif;
    font-weight: 600;
    font-style: normal;
    background-color: ${(props) => (props.isLogout ? 'transparent' : 'transparent')};
    color: ${(props) => 
        props.selected 
            ? '#2f6bff' 
            : props.isLogout 
                ? '#879db0' 
                : '#879db0'};
    transition: all 0.25s ease; 
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    width: 270px;
    margin-left: -40px;
    ${(props) => props.selected && `
        color:rgb(39, 89, 217);
        background-color: rgb(209, 220, 255);
        font-weight: 600;
    `}
    svg {
        font-size: 30px;;
        color: ${(props) => 
            props.selected 
                ? '#879db0' 
                : props.isLogout 
                    ? '#879db0' 
                    : '#879db0'} !important;
    }
    &:hover {
        ${(props) => props.isLogout 
            ? `
                color: red;
                background-color: transparent;
                svg {
                    color: red !important;
                }
            `
            : `
                background-color: rgb(48, 105, 250);
                color: white;
                svg {
                    color: white !important;
                }
            `
        }
    }
`;

interface NavItemProps {
    to: string;
    children: React.ReactNode;
    sx?: React.CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
    selected?: boolean;
    icon: React.ReactElement;
    isLogout?: boolean; 
}

const NavItem = ({ to, children, sx, onClick, selected, icon, isLogout }: NavItemProps) => (
    <Link to={to} style={{ textDecoration: 'none' }} onClick={onClick}>
        <StyledNavItem sx={sx} selected={selected} isLogout={isLogout}>
            {isLogout 
                ? <ExitToAppOutlined style={{ marginRight: '8px', color: 'darkgrey' }} />
                : React.isValidElement(icon) 
                    ? React.cloneElement(icon as React.ReactElement<any>, { style: { color: selected ? '#2f6bff' : '#5686ff' } }) 
                    : null}
            <span style={{ marginLeft: isLogout ? '0' : '8px' }}>{children}</span>
        </StyledNavItem>
    </Link>
);

interface StudentSidebarContentProps {
    onLogout: () => void;
}

export const StudentSidebarContent = ({ onLogout }: StudentSidebarContentProps) => {
    const location = useLocation();
    const [selectedPath, setSelectedPath] = useState(location.pathname);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        setSelectedPath(location.pathname);
    }, [location.pathname]);

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpenDialog(true);
    };

    const handleConfirmLogout = () => {
        setOpenDialog(false);
        onLogout();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Stack
            spacing={1}
            sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', 
            }}
        >
            {/* Top section with menu items */}
            <div>
                <Typography
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '31px',
                        mb: 4,
                        padding: '0px 0px',
                    }}
                >
                    <span style={{ color: '#4299e1' }}>UIT</span> 
                    <span style={{ color: '#b2f5ea' }}> - </span> 
                    <span style={{ color: '#38b2ac' }}>ĐKHP</span>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                <NavItem to="/student" sx={{ color: '#0173d3' }} selected={selectedPath === "/student"} icon={<HomeOutlined />}>
                    Trang chủ
                </NavItem>
                <NavItem to="/student/subjects" sx={{ color: '#0173d3' }} selected={selectedPath === "/student/subjects"} icon={<BookOutlined />}>
                    Đăng ký học phần
                </NavItem>
                <NavItem to="/student/academicReqMgm" sx={{ color: '#0173d3' }} selected={selectedPath === "/student/academicReqMgm"} icon={<AssignmentOutlined />}>
                    Quản lý cứu xét
                </NavItem>
                <NavItem to="/student/enrolledSubjects" sx={{ color: '#0173d3' }} selected={selectedPath === "/student/enrolledSubjects"} icon={<ListAltOutlined />}>
                    Môn đã đăng ký
                </NavItem>
                <NavItem to="/student/tuition" sx={{ color: '#0173d3' }} selected={selectedPath === "/student/tuition"} icon={<MonetizationOnOutlined />}>
                    Tình trạng học phí
                </NavItem>
                </Stack>
            </div>
            
            {/* Bottom section with logout button */}
            <div style={{ marginTop: "310px" }}>
                <NavItem 
                    sx={{ color: 'darkgrey', padding: '0px 0px' }}
                to="/login"
                onClick={handleLogoutClick}
                isLogout
                icon={<ExitToAppOutlined />}
            >
                Đăng xuất
                </NavItem>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '16px', 
                    },
                }}
                
            >
                <DialogTitle id="logout-dialog-title">Xác nhận đăng xuất</DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmLogout} color="error" variant="contained">
                        Đăng xuất
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};