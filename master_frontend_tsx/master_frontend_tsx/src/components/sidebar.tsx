import { ReactNode } from 'react';
import styled from "styled-components";

const StyledSideBar = styled.aside`
    width: 240px;
    min-height: 100vh;
    background: white;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
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
        <StyledSideBar>
            <SideBarContent>
                {children}
            </SideBarContent>
        </StyledSideBar>
    );
};