
import React from 'react';
import { Page } from '../../types';
import { Bars3Icon } from '../icons/Icons';

interface HeaderProps {
  toggleSidebar: () => void;
  activePage: Page;
}

const pageTitles: Record<Page, string> = {
    dashboard: "Dashboard",
    materials: "Gestión de Materia Prima",
    suppliers: "Gestión de Proveedores",
    movements: "Movimientos de Stock",
    categories: "Gestión de Categorías",
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, activePage }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden">
          <Bars3Icon />
        </button>
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200 ml-4 lg:ml-0">{pageTitles[activePage]}</h1>
      </div>
    </header>
  );
};

export default Header;
