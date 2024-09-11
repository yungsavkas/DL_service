import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VideoUploadPage from "../../pages/video-upload";
import Home from "../../pages/home";
import ApiPage from "../../pages/API";
import HistoryPage from "../../pages/history";
import Analytics from "../../pages/analytics";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<VideoUploadPage />} />
            <Route path="/integration" element={<ApiPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<Analytics />} />
        </Routes>
    );
};

export default AppRoutes;
