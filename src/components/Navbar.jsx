import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api';

const Navbar = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    sessionStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark navbar-hr">
      <div className="container d-flex justify-content-between align-items-center">

        {/* Brand */}
        <div>
          <span className="text-white fw-bold fs-5">Hyderabad Runners</span>
          <div className="navbar-subtitle text-white">Excel Import System</div>
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">

          {/* Admin name — plain text */}
          <span className="text-white" style={{ fontSize: 14, opacity: 0.85 }}>
            <i className="bi bi-person-circle me-1"></i>
            {username || 'Admin'}
          </span>

          {/* Logout — simple button */}
          <button
            className="btn btn-sm btn-outline-light"
            style={{ fontSize: 13, padding: '5px 14px', borderRadius: 8 }}
            onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
