import React from 'react';

interface ValuationViewProps {
    products: any[];
}

export const ValuationView: React.FC<ValuationViewProps> = ({ products }) => (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Valorización de Inventario</h2>
            <div className="text-sm bg-white dark:bg-slate-800 border dark:border-slate-700 px-3 py-1 rounded-lg dark:text-slate-300">Total Items:
                <strong className="dark:text-white ml-1">{products.length}</strong>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex-1 overflow-hidden">
            <div className="overflow-auto h-full">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-slate-900 text-xs text-gray-500 dark:text-slate-400 uppercase sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3">Producto</th>
                            <th className="px-4 py-3 text-right">Costo Unit.</th>
                            <th className="px-4 py-3 text-right">Precio Venta</th>
                            <th className="px-4 py-3 text-center">Margen</th>
                            <th className="px-4 py-3 text-center">Stock</th>
                            <th className="px-4 py-3 text-right">Valor Total (Costo)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                        {products.map(p => {
                            const margin = p.price - p.cost;
                            const marginPercent = ((margin / p.cost) * 100).toFixed(1);
                            const totalVal = p.cost * p.stock;
                            return (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-slate-100">{p.name}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-400">${p.cost}</td>
                                    <td className="px-4 py-3 text-right text-gray-600 dark:text-slate-400">${p.price}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">{marginPercent}%</span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-mono dark:text-slate-300">{p.stock}</td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-slate-100">
                                        ${totalVal.toLocaleString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
