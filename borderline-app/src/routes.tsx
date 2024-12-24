import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Redeem from './pages/Redeem';

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/redeem" element={<Redeem />} />
    </Routes>
  </Router>
);

export default AppRoutes;
