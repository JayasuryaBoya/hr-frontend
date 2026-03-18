import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage  from './pages/LoginPage';
import ImportPage from './pages/ImportPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"       element={<Navigate to="/login" replace />} />
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/import" element={<ImportPage />} />
      <Route path="*"       element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
