import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
