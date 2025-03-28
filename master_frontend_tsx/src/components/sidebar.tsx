import { ReactNode } from 'react';
import styled from "styled-components";
import { Box } from '@mui/material';

const StyledSideBar = styled.aside`
    width: 270px;
    height: 100%;
    min-height: 600px;   
    max-height: calc(100vh - 32px); 
    background: #ffffff; 
    border-radius: 16px; 
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
    padding: 20px;
    margin: 16px; 
`;

const SideBarContent = styled.nav`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

interface SideBarProps {
    children: ReactNode;
}

export const SideBar = ({ children }: SideBarProps) => {
    return (
        <Box
            sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                minHeight: '100vh',
                overflow: 'hidden',
                backgroundColor: 'rgb(220, 239, 250)',
            }}
        >
            <StyledSideBar>
                <SideBarContent>
                    {children}
                </SideBarContent>
            </StyledSideBar>
        </Box>
    );
};