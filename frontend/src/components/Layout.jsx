import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from './Toast';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="app-container">
      {/* Toast notifications */}
      <Toast />

      {/* Navigation Sidebar Drawer */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Screen Layout Container */}
      <div className="main-content main-content-layout" style={{
        marginLeft: '260px',
        transition: 'margin-left 0.3s ease'
      }}>
        <Topbar toggleSidebar={toggleSidebar} />
        
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-content-layout {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
