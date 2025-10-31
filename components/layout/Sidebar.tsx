
import React from 'react';
import { Page } from '../../types';
import { CubeIcon, UsersIcon, ArrowsRightLeftIcon, ChartPieIcon, XMarkIcon, TagIcon } from '../icons/Icons';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <ChartPieIcon /> },
    { id: 'materials', label: 'Materia Prima', icon: <CubeIcon /> },
    { id: 'suppliers', label: 'Proveedores', icon: <UsersIcon /> },
    { id: 'categories', label: 'Categorías', icon: <TagIcon /> },
    { id: 'movements', label: 'Movimientos', icon: <ArrowsRightLeftIcon /> },
  ];

  const NavLink: React.FC<{ page: Page; label: string; icon: React.ReactNode }> = ({ page, label, icon }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setActivePage(page);
        setSidebarOpen(false);
      }}
      className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 transform rounded-lg ${
        activePage === page
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="mx-4">{label}</span>
    </a>
  );

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 px-4 py-5 overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <CubeIcon className="w-6 h-6 text-white"/>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">InventarioPro</span>
            </div>
            <button className="lg:hidden text-gray-500 dark:text-gray-400" onClick={() => setSidebarOpen(false)}>
                <XMarkIcon />
            </button>
        </div>
        
        <nav className="mt-8 space-y-2">
          {navItems.map(item => (
            <NavLink key={item.id} page={item.id as Page} label={item.label} icon={item.icon} />
          ))}
        </nav>
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
