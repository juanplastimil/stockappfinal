
import React, { useState, useMemo } from 'react';
import { RawMaterial, Supplier, StockInflow, StockOutflow, Filters, Category } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BoxIcon, ArrowDownIcon, ExclamationTriangleIcon } from './icons/Icons';

interface DashboardProps {
  rawMaterials: RawMaterial[];
  suppliers: Supplier[];
  inflows: StockInflow[];
  outflows: StockOutflow[];
  stockData: Map<string, number>;
  categories: Category[];
}

const Card: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center transition-all duration-300">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const initialFilters: Omit<Filters, 'materialId'> = {
    searchTerm: '',
    category: null,
    width: '',
    thickness: '',
};

const Dashboard: React.FC<DashboardProps> = ({ rawMaterials, stockData, categories }) => {
    const [filters, setFilters] = useState<Filters>({ ...initialFilters, materialId: null });
    
    const filteredMaterials = useMemo(() => {
        const dimensionRegex = /(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/;
        const dimensionMatch = filters.searchTerm.match(dimensionRegex);

        return rawMaterials.filter(rm => {
            if (filters.category && rm.category !== filters.category) return false;
            if (filters.materialId && rm.id !== filters.materialId) return false;
            if (filters.width && rm.width !== parseFloat(filters.width)) return false;
            if (filters.thickness && rm.thickness !== parseFloat(filters.thickness)) return false;

            if (dimensionMatch) {
                const [, width, thickness] = dimensionMatch;
                return rm.category === 'Bobinas' && rm.width === parseFloat(width) && rm.thickness === parseFloat(thickness);
            }
            
            if (filters.searchTerm && !dimensionMatch) {
                const term = filters.searchTerm.toLowerCase();
                return rm.name.toLowerCase().includes(term) || rm.sku.toLowerCase().includes(term);
            }
            
            return true;
        });
    }, [rawMaterials, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value === 'all' ? null : value }));
    };
    
    const handleChartClick = (type: 'category' | 'material', value: string | null) => {
        if (type === 'category') {
            setFilters(prev => ({ ...prev, category: prev.category === value ? null : value, materialId: null }));
        }
        if (type === 'material') {
            const materialClicked = rawMaterials.find(rm => rm.name === value);
            if(materialClicked) {
                 setFilters(prev => ({ ...prev, materialId: prev.materialId === materialClicked.id ? null : materialClicked.id }));
            }
        }
    };

    const totalInventoryValue = filteredMaterials.reduce((acc, rm) => {
        const stock = stockData.get(rm.id) || 0;
        return acc + (stock * rm.cost);
    }, 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    const lowStockItems = filteredMaterials.filter(rm => (stockData.get(rm.id) || 0) <= rm.minStock).length;
  
    const stockByCategory = rawMaterials.reduce((acc, rm) => {
        const stockValue = (stockData.get(rm.id) || 0) * rm.cost;
        acc[rm.category] = (acc[rm.category] || 0) + stockValue;
        return acc;
    }, {} as Record<string, number>);

    const chartDataByCategory = Object.entries(stockByCategory).map(([name, value]) => ({ name, value }));
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d', '#4b0082'];

  return (
    <div className="space-y-6">
        {/* FILTERS PANEL */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Buscar</label>
                    <input type="text" name="searchTerm" placeholder="SKU, nombre, 1500x0.5..." value={filters.searchTerm} onChange={handleFilterChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Categoría</label>
                    <select name="category" value={filters.category || 'all'} onChange={handleFilterChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none">
                        <option value="all">Todas</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Ancho</label>
                        <input type="number" name="width" placeholder="mm" value={filters.width} onChange={handleFilterChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Espesor</label>
                        <input type="number" name="thickness" placeholder="mm" value={filters.thickness} onChange={handleFilterChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
                <button onClick={() => setFilters({ ...initialFilters, materialId: null })} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors h-10">Limpiar Filtros</button>
            </div>
        </div>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Valor Total del Inventario" value={totalInventoryValue} icon={<BoxIcon className="h-6 w-6 text-white" />} color="bg-blue-500" />
        <Card title="Productos Filtrados" value={filteredMaterials.length.toString()} icon={<ArrowDownIcon className="h-6 w-6 text-white" />} color="bg-green-500" />
        <Card title="Items con Stock Bajo" value={lowStockItems.toString()} icon={<ExclamationTriangleIcon className="h-6 w-6 text-white" />} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stock por Categoría (Valorizado)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartDataByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                onClick={(data) => handleChartClick('category', data.name)}
                className="cursor-pointer"
              >
                {chartDataByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={filters.category === entry.name || !filters.category ? 1 : 0.3} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stock Actual por Producto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredMaterials.map(rm => ({ name: rm.name, stock: stockData.get(rm.id) || 0 }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#8884d8" name="Stock Actual" className="cursor-pointer" onClick={(data) => handleChartClick('material', data.name)} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Productos con Stock Bajo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Producto</th>
                <th scope="col" className="px-6 py-3">Stock Actual</th>
                <th scope="col" className="px-6 py-3">Stock Mínimo</th>
                <th scope="col" className="px-6 py-3">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.filter(rm => (stockData.get(rm.id) || 0) <= rm.minStock).map(rm => {
                  const currentStock = stockData.get(rm.id) || 0;
                  return (
                    <tr key={rm.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{rm.name}</td>
                      <td className="px-6 py-4 font-bold text-red-500">{currentStock} {rm.unit}</td>
                      <td className="px-6 py-4">{rm.minStock} {rm.unit}</td>
                      <td className="px-6 py-4 font-bold text-red-500">{currentStock - rm.minStock}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
