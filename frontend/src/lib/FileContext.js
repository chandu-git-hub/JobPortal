import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [uploadedFile, setUploadedFile] = useState(null);

    const fetchUploadedFiles = async () => {
        try {
            const response = await axios.get("/resume"); // Adjust the URL if needed
            if (response.data.length > 0) {
                setUploadedFile(response.data[0]); // Assuming you only deal with a single file
            }
        } catch (error) {
            console.error("Error fetching uploaded file:", error);
        }
    };

    useEffect(() => {
        fetchUploadedFiles();
    }, []);

    return (
        <FileContext.Provider value={{ uploadedFile, setUploadedFile }}>
            {children}
        </FileContext.Provider>
    );
};
