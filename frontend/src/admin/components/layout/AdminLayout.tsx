import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminLayout() {
  return (
    <div className="admin-root">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
