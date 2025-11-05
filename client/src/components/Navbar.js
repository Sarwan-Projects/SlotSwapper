import React from 'react';
import { NavLink } from 'react-router-dom';
import NotificationBell from './NotificationBell';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">SlotSwapper</div>
        
        <div className="navbar-links">
          <NavLink to="/dashboard" className="nav-link">
            My Calendar
          </NavLink>
          <NavLink to="/marketplace" className="nav-link">
            Marketplace
          </NavLink>
          <NavLink to="/requests" className="nav-link">
            Requests
          </NavLink>
          
          <NotificationBell />
          
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
