import React from 'react';

export const DepotDashboard: React.FC = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Depósito</h1>
                <p className="text-gray-600 mt-2">Visión general del estado del inventario y movimientos.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Metrica: Stock Total */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">+2.5%</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Items en Stock</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">12,450</p>
                </div>

                {/* Metrica: Movimientos Hoy */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-purple-500 bg-purple-50 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Movimientos Hoy</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">145</p>
                </div>

                {/* Metrica: Valor del Inventario */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Valor Total</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">$450,200</p>
                </div>

                {/* Metrica: Alertas de Stock */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">Atención</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Stock Bajo</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">12 Items</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Actividad Reciente Placeholder */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-50">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-4">
                                    IN
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900">Recepción de Mercadería #{1000 + item}</h4>
                                    <p className="text-xs text-gray-500">Hace {item * 15} minutos</p>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">+50 un.</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gráfico Placeholder */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm">Gráfico de distribución aquí</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
