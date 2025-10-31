
import { RawMaterial, Supplier, StockInflow, StockOutflow, Category } from './types';

export const UNITS_OF_MEASURE = ['kg', 'unidades', 'metros', 'litros', 'cajas', 'mm', 'micrones'];

export const sampleCategories: Category[] = [
    { id: 'cat-1', name: 'Metales' },
    { id: 'cat-2', name: 'Plásticos' },
    { id: 'cat-3', name: 'Maderas' },
    { id: 'cat-4', name: 'Químicos' },
    { id: 'cat-5', name: 'Telas' },
    { id: 'cat-6', name: 'Componentes Electrónicos' },
    { id: 'cat-7', name: 'Bobinas' },
];

// --- SAMPLE DATA ---

const supplier1Id = 'supp-1';
const supplier2Id = 'supp-2';
const supplier3Id = 'supp-3';

export const sampleSuppliers: Supplier[] = [
  { id: supplier1Id, name: 'Aceros del Sur S.A.', cuit: '30-12345678-9', address: 'Av. Industrial 123', phone: '11-4567-8901', email: 'ventas@acerosdelsur.com', contact: 'Juan Perez', notes: 'Entrega los martes.' },
  { id: supplier2Id, name: 'Plásticos ABC', cuit: '30-98765432-1', address: 'Calle Falsa 456', phone: '11-2345-6789', email: 'contacto@plasticosabc.com', contact: 'Maria Gomez', notes: 'Pedido mínimo 100kg.' },
  { id: supplier3Id, name: 'Maderera El Bosque', cuit: '30-55555555-5', address: 'Ruta 8 Km 50', phone: '11-8765-4321', email: 'info@elbosque.com', contact: 'Carlos Rodriguez', notes: 'Madera de pino y roble.' },
];

const rm1Id = 'rm-1';
const rm2Id = 'rm-2';
const rm3Id = 'rm-3';
const rm4Id = 'rm-4';
const rm5Id = 'rm-5';

export const sampleRawMaterials: RawMaterial[] = [
  { id: rm1Id, sku: 'AC-001', name: 'Plancha de Acero Inoxidable', description: 'Plancha 2mm 1x2mts', category: 'Metales', unit: 'unidades', cost: 150.75, minStock: 10, supplierId: supplier1Id },
  { id: rm2Id, name: 'Polietileno de Alta Densidad (PEAD)', sku: 'PL-001', description: 'Granulado blanco', category: 'Plásticos', unit: 'kg', cost: 25.50, minStock: 500, supplierId: supplier2Id },
  { id: rm3Id, name: 'Tirante de Pino', sku: 'MA-001', description: '2x4 pulgadas x 3mts', category: 'Maderas', unit: 'unidades', cost: 45.20, minStock: 100, supplierId: supplier3Id },
  { id: rm4Id, name: 'Tornillos Autorroscantes', sku: 'AC-002', description: 'Cabeza Phillips 1 pulgada', category: 'Metales', unit: 'cajas', cost: 12.00, minStock: 20, supplierId: supplier1Id },
  { id: rm5Id, name: 'Bobina de Acero Galvanizado', sku: 'BO-001', description: 'Para estampado', category: 'Bobinas', unit: 'kg', cost: 35.80, minStock: 1000, supplierId: supplier1Id, width: 1500, thickness: 0.5 },
];

export const sampleInflows: StockInflow[] = [
  { id: 'in-1', date: '2023-10-01', rawMaterialId: rm1Id, quantity: 50, supplierId: supplier1Id, invoiceNumber: 'FC-001-1234', notes: '' },
  { id: 'in-2', date: '2023-10-02', rawMaterialId: rm2Id, quantity: 1000, supplierId: supplier2Id, invoiceNumber: 'FC-002-5678', notes: 'Control de calidad OK' },
  { id: 'in-3', date: '2023-10-03', rawMaterialId: rm3Id, quantity: 200, supplierId: supplier3Id, invoiceNumber: 'FC-003-9012', notes: '' },
  { id: 'in-4', date: '2023-10-05', rawMaterialId: rm4Id, quantity: 50, supplierId: supplier1Id, invoiceNumber: 'FC-001-1250', notes: '' },
  { id: 'in-5', date: '2023-10-06', rawMaterialId: rm5Id, quantity: 5000, supplierId: supplier1Id, invoiceNumber: 'FC-001-1260', notes: '' },
];

export const sampleOutflows: StockOutflow[] = [
  { id: 'out-1', date: '2023-10-10', rawMaterialId: rm1Id, quantity: 15, workOrder: 'OT-2023-001', responsible: 'Operario A', notes: 'Producción Lote 1' },
  { id: 'out-2', date: '2023-10-11', rawMaterialId: rm2Id, quantity: 250, workOrder: 'OT-2023-001', responsible: 'Operario B', notes: '' },
  { id: 'out-3', date: '2023-10-12', rawMaterialId: rm3Id, quantity: 80, workOrder: 'OT-2023-002', responsible: 'Operario A', notes: 'Producción Lote 2' },
  { id: 'out-4', date: '2023-10-15', rawMaterialId: rm1Id, quantity: 5, workOrder: 'OT-2023-003', responsible: 'Operario C', notes: 'Mantenimiento' },
  { id: 'out-5', date: '2023-10-16', rawMaterialId: rm4Id, quantity: 10, workOrder: 'OT-2023-002', responsible: 'Operario B', notes: '' },
  { id: 'out-6', date: '2023-10-17', rawMaterialId: rm5Id, quantity: 1200, workOrder: 'OT-2023-004', responsible: 'Operario C', notes: '' },
];
