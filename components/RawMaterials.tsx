
import React, { useState, useMemo, FC, useCallback } from 'react';
import { RawMaterial, Supplier, StockInflow, StockOutflow, Category } from '../types';
import { UNITS_OF_MEASURE } from '../constants';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from './icons/Icons';
import Modal from './ui/Modal';

// Separate Form component to avoid re-renders of the list
interface MaterialFormProps {
    material: RawMaterial | null;
    suppliers: Supplier[];
    categories: Category[];
    onSave: (material: RawMaterial) => void;
    onCancel: () => void;
}

const MaterialForm: FC<MaterialFormProps> = ({ material, suppliers, categories, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<RawMaterial, 'id'>>(() => material 
        ? { ...material } 
        : { sku: '', name: '', description: '', category: categories[0]?.name || '', unit: UNITS_OF_MEASURE[0], cost: 0, minStock: 0, supplierId: suppliers[0]?.id || '', width: undefined, thickness: undefined }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.sku) newErrors.sku = 'El SKU es requerido.';
        if (!formData.name) newErrors.name = 'El nombre es requerido.';
        if (formData.cost <= 0) newErrors.cost = 'El costo debe ser mayor a cero.';
        if (!formData.supplierId) newErrors.supplierId = 'Debe seleccionar un proveedor.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const materialToSave: RawMaterial = { ...formData, id: material?.id || `rm-${Date.now()}` };
            if (formData.category !== 'Bobinas') {
                delete materialToSave.width;
                delete materialToSave.thickness;
            }
            onSave(materialToSave);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number = value;
        if (['cost', 'minStock', 'width', 'thickness'].includes(name)) {
            parsedValue = value === '' ? '' : parseFloat(value);
        }
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                    <select name="supplierId" value={formData.supplierId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                        <option value="">Seleccione un proveedor</option>
                        {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                    </select>
                    {errors.supplierId && <p className="text-red-500 text-xs mt-1">{errors.supplierId}</p>}
                </div>
            </div>
             {formData.category === 'Bobinas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md dark:border-gray-600">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ancho (mm)</label>
                        <input type="number" name="width" value={formData.width || ''} onChange={handleChange} step="any" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Espesor (mm)</label>
                        <input type="number" name="thickness" value={formData.thickness || ''} onChange={handleChange} step="any" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                </div>
            )}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Costo por Unidad</label>
                    <input type="number" name="cost" value={formData.cost} onChange={handleChange} step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidad de Medida</label>
                    <select name="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                        {UNITS_OF_MEASURE.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Mínimo</label>
                    <input type="number" name="minStock" value={formData.minStock} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Guardar</button>
            </div>
        </form>
    );
};


interface HistoryModalProps {
    material: RawMaterial;
    inflows: StockInflow[];
    outflows: StockOutflow[];
    onClose: () => void;
}

const HistoryModal: FC<HistoryModalProps> = ({ material, inflows, outflows, onClose }) => {
    const movements = useMemo(() => {
        const materialInflows = inflows
            .filter(i => i.rawMaterialId === material.id)
            .map(i => ({ ...i, type: 'Ingreso' }));
        const materialOutflows = outflows
            .filter(o => o.rawMaterialId === material.id)
            .map(o => ({ ...o, type: 'Egreso' }));

        return [...materialInflows, ...materialOutflows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [material, inflows, outflows]);

    return (
        <Modal title={`Historial de Movimientos: ${material.name}`} onClose={onClose}>
            <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Cantidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Ref.</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {movements.map(mov => (
                            <tr key={`${mov.type}-${mov.id}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(mov.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mov.type === 'Ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {mov.type}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${mov.type === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                                    {mov.type === 'Ingreso' ? '+' : '-'}{mov.quantity} {material.unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {mov.type === 'Ingreso' ? (mov as StockInflow).invoiceNumber : (mov as StockOutflow).workOrder}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {movements.length === 0 && <p className="text-center py-4 text-gray-500">No hay movimientos para este producto.</p>}
            </div>
             <div className="flex justify-end pt-4">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Cerrar</button>
            </div>
        </Modal>
    )
}

const formatMaterialName = (material: RawMaterial) => {
    if (material.category === 'Bobinas' && material.width && material.thickness) {
        return `${material.name} (${material.width}mm x ${material.thickness}mm)`;
    }
    return material.name;
};


interface RawMaterialsProps {
  rawMaterials: RawMaterial[];
  setRawMaterials: React.Dispatch<React.SetStateAction<RawMaterial[]>>;
  suppliers: Supplier[];
  stockData: Map<string, number>;
  inflows: StockInflow[];
  outflows: StockOutflow[];
  categories: Category[];
}

const RawMaterials: React.FC<RawMaterialsProps> = ({ rawMaterials, setRawMaterials, suppliers, stockData, inflows, outflows, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = (material: RawMaterial) => {
    if (selectedMaterial) {
      setRawMaterials(prev => prev.map(m => m.id === material.id ? material : m));
    } else {
      setRawMaterials(prev => [...prev, material]);
    }
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta materia prima?')) {
      setRawMaterials(prev => prev.filter(m => m.id !== id));
    }
  };
  
  const openHistoryModal = (material: RawMaterial) => {
      setSelectedMaterial(material);
      setIsHistoryModalOpen(true);
  }

  const filteredMaterials = useMemo(() => 
    rawMaterials.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [rawMaterials, searchTerm]);
    
    const getSupplierName = useCallback((supplierId: string) => {
        return suppliers.find(s => s.id === supplierId)?.name || 'N/A';
    }, [suppliers]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre, SKU o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={() => { setSelectedMaterial(null); setIsModalOpen(true); }} className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <PlusIcon />
          <span className="ml-2">Nueva Materia Prima</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">SKU</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Categoría</th>
              <th scope="col" className="px-6 py-3">Stock Actual</th>
              <th scope="col" className="px-6 py-3">Costo</th>
              <th scope="col" className="px-6 py-3">Proveedor</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map(material => {
                const stock = stockData.get(material.id) || 0;
                const isLowStock = stock <= material.minStock;
                return (
                    <tr key={material.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4">{material.sku}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{formatMaterialName(material)}</td>
                      <td className="px-6 py-4">{material.category}</td>
                      <td className={`px-6 py-4 font-bold ${isLowStock ? 'text-red-500' : 'text-green-500'}`}>{stock.toLocaleString()} {material.unit}</td>
                      <td className="px-6 py-4">{material.cost.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                      <td className="px-6 py-4">{getSupplierName(material.supplierId)}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button onClick={() => openHistoryModal(material)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><EyeIcon /></button>
                        <button onClick={() => { setSelectedMaterial(material); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><PencilIcon /></button>
                        <button onClick={() => handleDelete(material.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                      </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={selectedMaterial ? 'Editar Materia Prima' : 'Nueva Materia Prima'} onClose={() => setIsModalOpen(false)}>
            <MaterialForm 
                material={selectedMaterial}
                suppliers={suppliers}
                categories={categories}
                onSave={handleSave}
                onCancel={() => { setIsModalOpen(false); setSelectedMaterial(null); }}
            />
        </Modal>
      )}

      {isHistoryModalOpen && selectedMaterial && (
          <HistoryModal
              material={selectedMaterial}
              inflows={inflows}
              outflows={outflows}
              onClose={() => { setIsHistoryModalOpen(false); setSelectedMaterial(null); }}
          />
      )}
    </div>
  );
};

export default RawMaterials;
