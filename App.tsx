
import React, { useState, useMemo } from 'react';
import { useSessionStorage } from './hooks/useSessionStorage';
import { RawMaterial, Supplier, StockInflow, StockOutflow, Page, Category } from './types';
import { sampleRawMaterials, sampleSuppliers, sampleInflows, sampleOutflows, sampleCategories } from './constants';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import RawMaterials from './components/RawMaterials';
import Suppliers from './components/Suppliers';
import StockMovements from './components/StockMovements';
import Categories from './components/Categories';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [rawMaterials, setRawMaterials] = useSessionStorage<RawMaterial[]>('rawMaterials', sampleRawMaterials);
  const [suppliers, setSuppliers] = useSessionStorage<Supplier[]>('suppliers', sampleSuppliers);
  const [inflows, setInflows] = useSessionStorage<StockInflow[]>('inflows', sampleInflows);
  const [outflows, setOutflows] = useSessionStorage<StockOutflow[]>('outflows', sampleOutflows);
  const [categories, setCategories] = useSessionStorage<Category[]>('categories', sampleCategories);

  const stockData = useMemo(() => {
    const stockMap = new Map<string, number>();
    rawMaterials.forEach(rm => stockMap.set(rm.id, 0));
    inflows.forEach(inflow => {
        stockMap.set(inflow.rawMaterialId, (stockMap.get(inflow.rawMaterialId) || 0) + inflow.quantity);
    });
    outflows.forEach(outflow => {
        stockMap.set(outflow.rawMaterialId, (stockMap.get(outflow.rawMaterialId) || 0) - outflow.quantity);
    });
    return stockMap;
  }, [rawMaterials, inflows, outflows]);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard 
                  rawMaterials={rawMaterials} 
                  suppliers={suppliers}
                  inflows={inflows}
                  outflows={outflows}
                  stockData={stockData} 
                  categories={categories}
                />;
      case 'materials':
        return <RawMaterials 
                  rawMaterials={rawMaterials} 
                  setRawMaterials={setRawMaterials}
                  suppliers={suppliers} 
                  stockData={stockData}
                  inflows={inflows}
                  outflows={outflows}
                  categories={categories}
                />;
      case 'suppliers':
        return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} />;
      case 'movements':
        return <StockMovements
                  inflows={inflows}
                  setInflows={setInflows}
                  outflows={outflows}
                  setOutflows={setOutflows}
                  rawMaterials={rawMaterials}
                  suppliers={suppliers}
               />;
      case 'categories':
        return <Categories 
                  categories={categories} 
                  setCategories={setCategories} 
                  rawMaterials={rawMaterials}
                />;
      default:
        return <Dashboard 
                rawMaterials={rawMaterials} 
                suppliers={suppliers}
                inflows={inflows}
                outflows={outflows}
                stockData={stockData}
                categories={categories}
              />;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderContent()}
    </Layout>
  );
};

export default App;
