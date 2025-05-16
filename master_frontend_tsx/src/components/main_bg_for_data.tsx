// File: src/components/main_bg_for_data.tsx
import { ReactNode } from 'react';
import styled from "styled-components";

const StyledMainBg = styled.main`
    flex: 1;
    min-height: 100vh;
    background:#edf5fb;
    padding: 20px;
    position: relative;
    overflow: auto;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.2);
        border-radius: 6px;
    }
`;

const StyledMainContent = styled.div`
    width: 100%;
    height: 100%;
`;

interface MainBgColorProps {
    children: ReactNode;
}

export const MainBgColor = ({ children }: MainBgColorProps) => {
    return (
        <StyledMainBg>
            <StyledMainContent>
                {children}
            </StyledMainContent>
        </StyledMainBg>
    );
};