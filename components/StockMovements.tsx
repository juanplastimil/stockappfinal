import React, { useState, useMemo, FC } from 'react';
import { StockInflow, StockOutflow, RawMaterial, Supplier } from '../types';
import { PlusIcon, PencilIcon } from './icons/Icons';
import Modal from './ui/Modal';

// Inflow Form
interface InflowFormProps {
    rawMaterials: RawMaterial[];
    suppliers: Supplier[];
    onSave: (inflow: StockInflow) => void;
    onCancel: () => void;
    movementToEdit?: StockInflow | null;
}

const InflowForm: FC<InflowFormProps> = ({ rawMaterials, suppliers, onSave, onCancel, movementToEdit }) => {
    const [formData, setFormData] = useState<Omit<StockInflow, 'id'>>(() => movementToEdit
        ? { ...movementToEdit }
        : { date: new Date().toISOString().split('T')[0], rawMaterialId: '', quantity: 0, supplierId: '', invoiceNumber: '', notes: '' }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.rawMaterialId) newErrors.rawMaterialId = 'Seleccione una materia prima.';
        if (!formData.supplierId) newErrors.supplierId = 'Seleccione un proveedor.';
        if (formData.quantity <= 0) newErrors.quantity = 'La cantidad debe ser mayor a cero.';
        // invoiceNumber is now optional
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: movementToEdit?.id || `in-${Date.now()}` });
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? parseFloat(value) : value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Materia Prima</label>
                <select name="rawMaterialId" value={formData.rawMaterialId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Seleccione...</option>
                    {rawMaterials.map(rm => <option key={rm.id} value={rm.id}>{rm.name} ({rm.sku})</option>)}
                </select>
                {errors.rawMaterialId && <p className="text-red-500 text-xs mt-1">{errors.rawMaterialId}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proveedor</label>
                <select name="supplierId" value={formData.supplierId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Seleccione...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {errors.supplierId && <p className="text-red-500 text-xs mt-1">{errors.supplierId}</p>}
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">N° Remito/Factura (Opcional)</label>
                <input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                {errors.invoiceNumber && <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Guardar Ingreso</button>
            </div>
        </form>
    )
};


// Outflow Form
interface OutflowFormProps {
    rawMaterials: RawMaterial[];
    onSave: (outflow: StockOutflow) => void;
    onCancel: () => void;
    movementToEdit?: StockOutflow | null;
}

const OutflowForm: FC<OutflowFormProps> = ({ rawMaterials, onSave, onCancel, movementToEdit }) => {
    const [formData, setFormData] = useState<Omit<StockOutflow, 'id'>>(() => movementToEdit
        ? { ...movementToEdit }
        : { date: new Date().toISOString().split('T')[0], rawMaterialId: '', quantity: 0, workOrder: '', responsible: '', notes: '' }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.rawMaterialId) newErrors.rawMaterialId = 'Seleccione una materia prima.';
        if (formData.quantity <= 0) newErrors.quantity = 'La cantidad debe ser mayor a cero.';
        if (!formData.workOrder) newErrors.workOrder = 'El N° de OT es obligatorio.';
        if (!formData.responsible) newErrors.responsible = 'El responsable es requerido.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: movementToEdit?.id || `out-${Date.now()}` });
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? parseFloat(value) : value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Materia Prima</label>
                <select name="rawMaterialId" value={formData.rawMaterialId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Seleccione...</option>
                    {rawMaterials.map(rm => <option key={rm.id} value={rm.id}>{rm.name} ({rm.sku})</option>)}
                </select>
                {errors.rawMaterialId && <p className="text-red-500 text-xs mt-1">{errors.rawMaterialId}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">N° OT (Orden de Trabajo)</label>
                    <input type="text" name="workOrder" value={formData.workOrder} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    {errors.workOrder && <p className="text-red-500 text-xs mt-1">{errors.workOrder}</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Responsable</label>
                    <input type="text" name="responsible" value={formData.responsible} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
                    {errors.responsible && <p className="text-red-500 text-xs mt-1">{errors.responsible}</p>}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Guardar Egreso</button>
            </div>
        </form>
    )
};


interface StockMovementsProps {
  inflows: StockInflow[];
  setInflows: React.Dispatch<React.SetStateAction<StockInflow[]>>;
  outflows: StockOutflow[];
  setOutflows: React.Dispatch<React.SetStateAction<StockOutflow[]>>;
  rawMaterials: RawMaterial[];
  suppliers: Supplier[];
}

const StockMovements: React.FC<StockMovementsProps> = ({ inflows, setInflows, outflows, setOutflows, rawMaterials, suppliers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'inflow' | 'outflow'>('inflow');
  const [selectedMovement, setSelectedMovement] = useState<(StockInflow | StockOutflow) | null>(null);
  const [filters, setFilters] = useState({
      type: 'all', // all, inflow, outflow
      searchTerm: '', // for OT, invoice, responsible
      materialId: '',
      startDate: '',
      endDate: '',
  });
  
  const materialMap = useMemo(() => new Map(rawMaterials.map(m => [m.id, m])), [rawMaterials]);
  const supplierMap = useMemo(() => new Map(suppliers.map(s => [s.id, s])), [suppliers]);

  const combinedMovements = useMemo(() => {
    const allMovements = [
        ...inflows.map(i => ({...i, type: 'Ingreso' as const})),
        ...outflows.map(o => ({...o, type: 'Egreso' as const}))
    ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allMovements.filter(mov => {
        if(filters.type !== 'all' && mov.type !== filters.type) return false;
        if(filters.materialId && mov.rawMaterialId !== filters.materialId) return false;
        if (filters.startDate && mov.date < filters.startDate) return false;
        if (filters.endDate && mov.date > filters.endDate) return false;

        if(filters.searchTerm){
            const term = filters.searchTerm.toLowerCase();
            if (mov.type === 'Ingreso') {
                const inflow = mov as StockInflow & { type: string };
                return inflow.invoiceNumber.toLowerCase().includes(term);
            } else {
                const outflow = mov as StockOutflow & { type: string };
                return outflow.workOrder.toLowerCase().includes(term) || outflow.responsible.toLowerCase().includes(term);
            }
        }
        return true;
    });

  }, [inflows, outflows, filters]);


  const handleSaveInflow = (inflow: StockInflow) => {
    const isEditing = inflows.some(i => i.id === inflow.id);
    if (isEditing) {
        setInflows(prev => prev.map(i => i.id === inflow.id ? inflow : i));
    } else {
        setInflows(prev => [inflow, ...prev]);
    }
    setIsModalOpen(false);
    setSelectedMovement(null);
  };
  
  const handleSaveOutflow = (outflow: StockOutflow) => {
    const isEditing = outflows.some(o => o.id === outflow.id);
    if (isEditing) {
        setOutflows(prev => prev.map(o => o.id === outflow.id ? outflow : o));
    } else {
        setOutflows(prev => [outflow, ...prev]);
    }
    setIsModalOpen(false);
    setSelectedMovement(null);
  };
  
  const handleEdit = (movement: (StockInflow | StockOutflow) & { type: 'Ingreso' | 'Egreso' }) => {
    setSelectedMovement(movement);
    setModalType(movement.type === 'Ingreso' ? 'inflow' : 'outflow');
    setIsModalOpen(true);
  };
  
  const openModal = (type: 'inflow' | 'outflow') => {
      setSelectedMovement(null);
      setModalType(type);
      setIsModalOpen(true);
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
             <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="all">Todos los Movimientos</option>
                    <option value="Ingreso">Solo Ingresos</option>
                    <option value="Egreso">Solo Egresos</option>
                </select>
                <select name="materialId" value={filters.materialId} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Todas las Materias Primas</option>
                    {rawMaterials.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
                </select>
                <input type="text" name="searchTerm" placeholder="Buscar OT, Remito..." value={filters.searchTerm} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div className="w-full md:w-auto flex gap-2">
                 <button onClick={() => openModal('inflow')} className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    <PlusIcon /><span className="ml-2">Ingreso</span>
                </button>
                 <button onClick={() => openModal('outflow')} className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                    <PlusIcon /><span className="ml-2">Egreso</span>
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3">Tipo</th>
                        <th className="px-6 py-3">Materia Prima</th>
                        <th className="px-6 py-3">Cantidad</th>
                        <th className="px-6 py-3">Referencia</th>
                        <th className="px-6 py-3">Detalle</th>
                        <th className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {combinedMovements.map(mov => {
                        const material = materialMap.get(mov.rawMaterialId);
                        const isIngreso = mov.type === 'Ingreso';
                        const ref = isIngreso ? (mov as StockInflow).invoiceNumber : (mov as StockOutflow).workOrder;
                        const detail = isIngreso ? supplierMap.get((mov as StockInflow).supplierId)?.name : (mov as StockOutflow).responsible;

                        return (
                             <tr key={`${mov.type}-${mov.id}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{new Date(mov.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isIngreso ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {mov.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">{material?.name}</td>
                                <td className={`px-6 py-4 font-bold ${isIngreso ? 'text-green-600' : 'text-red-600'}`}>{isIngreso ? '+' : '-'}{mov.quantity.toLocaleString()} {material?.unit}</td>
                                <td className="px-6 py-4">{ref}</td>
                                <td className="px-6 py-4">{detail}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleEdit(mov)} className="text-blue-600 hover:text-blue-800">
                                        <PencilIcon />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
             </table>
        </div>
        
        {isModalOpen && (
             <Modal title={selectedMovement ? `Editar ${modalType === 'inflow' ? 'Ingreso' : 'Egreso'}` : `Registrar ${modalType === 'inflow' ? 'Ingreso' : 'Egreso'} de Stock`} onClose={() => setIsModalOpen(false)}>
                 {modalType === 'inflow' ? (
                     <InflowForm 
                        rawMaterials={rawMaterials} 
                        suppliers={suppliers} 
                        onSave={handleSaveInflow} 
                        onCancel={() => {setIsModalOpen(false); setSelectedMovement(null);}}
                        movementToEdit={selectedMovement as StockInflow | null}
                     />
                 ) : (
                     <OutflowForm 
                        rawMaterials={rawMaterials} 
                        onSave={handleSaveOutflow} 
                        onCancel={() => {setIsModalOpen(false); setSelectedMovement(null);}}
                        movementToEdit={selectedMovement as StockOutflow | null}
                     />
                 )}
            </Modal>
        )}
    </div>
  );
};

export default StockMovements;
