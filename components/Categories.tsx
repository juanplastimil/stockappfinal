
import React, { useState, FC } from 'react';
import { Category, RawMaterial } from '../types';
import { PencilIcon, TrashIcon, PlusIcon } from './icons/Icons';
import Modal from './ui/Modal';

// Category Form Component
interface CategoryFormProps {
    category: Category | null;
    onSave: (category: Omit<Category, 'id'>) => void;
    onCancel: () => void;
}

const CategoryForm: FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
    const [name, setName] = useState(category?.name || '');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('El nombre de la categoría no puede estar vacío.');
            return;
        }
        onSave({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Categoría</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError('');
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Guardar</button>
            </div>
        </form>
    );
};

interface CategoriesProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  rawMaterials: RawMaterial[];
}

const Categories: React.FC<CategoriesProps> = ({ categories, setCategories, rawMaterials }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleSave = (categoryData: Omit<Category, 'id'>) => {
    if (selectedCategory) {
      setCategories(prev => prev.map(c => c.id === selectedCategory.id ? { ...c, ...categoryData } : c));
    } else {
      setCategories(prev => [...prev, { id: `cat-${Date.now()}`, ...categoryData }]);
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = (categoryId: string) => {
    const categoryToDelete = categories.find(c => c.id === categoryId);
    if (!categoryToDelete) return;

    const isCategoryInUse = rawMaterials.some(rm => rm.category === categoryToDelete.name);
    
    if (isCategoryInUse) {
      alert('Error: No se puede eliminar la categoría porque está siendo utilizada por una o más materias primas.');
      return;
    }

    if (window.confirm(`¿Está seguro de que desea eliminar la categoría "${categoryToDelete.name}"?`)) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Lista de Categorías</h2>
        <button onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <PlusIcon />
          <span className="ml-2">Nueva Categoría</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{category.name}</td>
                <td className="px-6 py-4 flex space-x-2">
                  <button onClick={() => { setSelectedCategory(category); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><PencilIcon /></button>
                  <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800"><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'} onClose={() => setIsModalOpen(false)}>
            <CategoryForm
                category={selectedCategory}
                onSave={handleSave}
                onCancel={() => { setIsModalOpen(false); setSelectedCategory(null); }}
            />
        </Modal>
      )}
    </div>
  );
};

export default Categories;


export default Categories;
