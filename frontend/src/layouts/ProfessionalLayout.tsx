import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfessionalNavbar from '../components/ProfessionalNavbar';
import ProfessionalFooter from '../components/ProfessionalFooter';

const ProfessionalLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col font-sans text-text-primary bg-background selection:bg-accent selection:text-background">
      <ProfessionalNavbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <ProfessionalFooter />
    </div>
  );
};

export default ProfessionalLayout;
