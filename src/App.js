import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClientList from './ClientList';
import DevicesPage from './DevicesPage';
import VaultsPage from './VaultsPage';

const App = () => {
  return (
    <Router>
      <div className="navbar">
        <Link to="/">Clients</Link>
        <Link to="/vaults">Vaults</Link>
      </div>
      <Routes>
        <Route path="/" element={<ClientList />} />
        <Route path="/client/:clientId" element={<DevicesPage />} />
        <Route path="/vaults" element={<VaultsPage />} /> {/* Vaults Route */}
      </Routes>
    </Router>
  );
};

export default App;
