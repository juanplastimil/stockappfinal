
export interface RawMaterial {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  cost: number;
  minStock: number;
  supplierId: string;
  // Campos personalizados para Bobinas
  width?: number;
  thickness?: number;
}

export interface Supplier {
  id: string;
  name: string;
  cuit: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  notes: string;
}

export interface StockInflow {
  id: string;
  date: string;
  rawMaterialId: string;
  quantity: number;
  supplierId: string;
  invoiceNumber: string;
  notes: string;
}

export interface StockOutflow {
  id: string;
  date: string;
  rawMaterialId: string;
  quantity: number;
  workOrder: string;
  responsible: string;
  notes: string;
}

export interface Category {
    id: string;
    name: string;
}

export type Page = 'dashboard' | 'materials' | 'suppliers' | 'movements' | 'categories';

export interface Filters {
    searchTerm: string;
    category: string | null;
    materialId: string | null;
    width: string;
    thickness: string;
}
