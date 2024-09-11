import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '../../../app/routes';
import Navbar from "../../../app/layout/Navbar";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
        <Navbar/>
      <AppRoutes />
    </BrowserRouter>
  );
};