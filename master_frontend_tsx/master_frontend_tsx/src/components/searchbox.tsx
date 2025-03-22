// File: src/components/searchbox.tsx
import {useState, ChangeEvent, KeyboardEvent } from "react";
import { Box, TextField } from "@mui/material";

interface SearchBoxProps {
    onSearch?: (searchText: string) => void;
    placeholder?: string;
}

const SearchBox = ({ onSearch, placeholder = "Search..." }: SearchBoxProps) => {
    const [searchText, setSearchText] = useState("");

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleClick = () => {
        if (onSearch) {
            onSearch(searchText);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleClick();
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
            <TextField
                variant="outlined"
                fullWidth
                placeholder={placeholder}
                value={searchText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
            />
        </Box>
    );
};

export default SearchBox;