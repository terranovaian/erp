import React, { useState } from 'react';

export const ProductManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'create' | 'edit'>('create');

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">Gestión de Productos</h1>
                <p className="text-gray-500 mt-1">Alta, baja y modificación del catálogo de productos.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar / List (Placeholder for selecting product to edit) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">Acciones Rápidas</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${activeTab === 'create' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold shadow-sm' : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50 text-gray-600'}`}
                        >
                            + Nuevo Producto
                        </button>

                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-50">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Últimos Añadidos</h4>
                        <ul className="space-y-1">
                            <li className="text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 cursor-pointer p-3 rounded-xl transition-all mb-1">• Tubería PVC 1/2"</li>
                            <li className="text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 cursor-pointer p-3 rounded-xl transition-all">• Cemento Portland</li>
                        </ul>
                    </div>
                </div>

                {/* Form Area */}
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 lg:col-span-2">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">
                        {activeTab === 'create' ? 'Registrar Nuevo Producto' : 'Editar Producto'}
                    </h2>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label htmlFor="sku" className="block text-sm font-bold text-gray-700 mb-2">SKU / Código</label>
                                <input type="text" id="sku" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all" placeholder="Ej: MAT-001" />
                            </div>
                            <div>
                                <label htmlFor="barcode" className="block text-sm font-bold text-gray-700 mb-2">Código de Barras</label>
                                <input type="text" id="barcode" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all" placeholder="Escanea o ingresa..." />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto</label>
                            <input type="text" id="name" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all" placeholder="Ej: Cemento de contacto" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                                <select id="category" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                                    <option>Construcción</option>
                                    <option>Plomería</option>
                                    <option>Electricidad</option>
                                    <option>Herramientas</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="unit" className="block text-sm font-bold text-gray-700 mb-2">Unidad de Medida</label>
                                <select id="unit" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer">
                                    <option>Unidad (un)</option>
                                    <option>Metros (m)</option>
                                    <option>Kilogramos (kg)</option>
                                    <option>Litros (l)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                            <textarea id="description" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all resize-none" placeholder="Detalles adicionales del producto..."></textarea>
                        </div>

                        <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-50 mt-8">
                            <button type="button" className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all active:scale-95">
                                Cancelar
                            </button>
                            <button type="submit" className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 hover:shadow-orange-300/50 transition-all active:scale-95">
                                {activeTab === 'create' ? 'Guardar Producto' : 'Actualizar Producto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
