import React, { useState } from 'react';

export const ProductManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'create' | 'edit'>('create');

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="text-gray-600 mt-2">Alta, baja y modificación del catálogo de productos.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar / List (Placeholder for selecting product to edit) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${activeTab === 'create' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                        >
                            + Nuevo Producto
                        </button>
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${activeTab === 'edit' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                        >
                            ✎ Editar Existente
                        </button>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Últimos Añadidos</h4>
                        <ul className="space-y-3">
                            <li className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors">• Tubería PVC 1/2"</li>
                            <li className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors">• Cemento Portland</li>
                        </ul>
                    </div>
                </div>

                {/* Form Area */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {activeTab === 'create' ? 'Registrar Nuevo Producto' : 'Editar Producto'}
                    </h2>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU / Código</label>
                                <input type="text" id="sku" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Ej: MAT-001" />
                            </div>
                            <div>
                                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                                <input type="text" id="barcode" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Escanea o ingresa..." />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                            <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Ej: Cemento de contacto" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <select id="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option>Construcción</option>
                                    <option>Plomería</option>
                                    <option>Electricidad</option>
                                    <option>Herramientas</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                                <select id="unit" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
                                    <option>Unidad (un)</option>
                                    <option>Metros (m)</option>
                                    <option>Kilogramos (kg)</option>
                                    <option>Litros (l)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea id="description" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Detalles adicionales del producto..."></textarea>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                            <button type="button" className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors">
                                {activeTab === 'create' ? 'Guardar Producto' : 'Actualizar Producto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
