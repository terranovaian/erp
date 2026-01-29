
import React, { useState } from 'react';

// Interfaces (Normally would be in a types file)
interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    stock: number;
    unit: string;
    location: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const DUMMY_PRODUCTS: Product[] = [
    { id: '1', sku: 'SKU-001', name: 'Tubería PVC 1/2"', category: 'Plomería', stock: 500, unit: 'm', location: 'A-01-02', status: 'In Stock' },
    { id: '2', sku: 'SKU-002', name: 'Cemento Portland 50kg', category: 'Construcción', stock: 45, unit: 'bolsa', location: 'B-05-01', status: 'Low Stock' },
    { id: '3', sku: 'SKU-003', name: 'Ladrillo Hueco 12x18x33', category: 'Construcción', stock: 1200, unit: 'un', location: 'C-02-00', status: 'In Stock' },
    { id: '4', sku: 'SKU-004', name: 'Llave de Paso Esférica', category: 'Plomería', stock: 0, unit: 'un', location: 'A-01-05', status: 'Out of Stock' },
    { id: '5', sku: 'SKU-005', name: 'Cable Unipolar 2.5mm', category: 'Electricidad', stock: 300, unit: 'rollos', location: 'D-10-02', status: 'In Stock' },
];

export const InventoryList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = DUMMY_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Listado de Inventario</h1>
                    <p className="text-gray-600 mt-2">Gestión y visualización de stock actual.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium shadow-sm transition-colors">
                        Exportar CSV
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md shadow-blue-200 transition-colors">
                        + Nuevo Producto
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-shadow"
                            placeholder="Buscar por nombre o SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Add more filters here if needed */}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold text-xs">
                                                IMG
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{product.category}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{product.location}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <span className="text-gray-900">{product.stock}</span>
                                        <span className="text-gray-500 ml-1">{product.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : ''}
                                            ${product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' : ''}
                                        `}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                                        <button className="text-gray-400 hover:text-gray-600">...</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-sm text-gray-700">Mostrando <span className="font-medium">{filteredProducts.length}</span> resultados</span>
                    <div className="flex-1 flex justify-end gap-2">
                        <button disabled className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-400 cursor-not-allowed">Anterior</button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
