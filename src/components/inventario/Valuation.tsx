import React from 'react';

interface ValuationViewProps {
    products: any[];
}

export const ValuationView: React.FC<ValuationViewProps> = ({ products }) => (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Valorización de Inventario</h2>
            <div className="text-sm bg-white border px-3 py-1 rounded-lg">Total Items:
                <strong>{products.length}</strong>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden">
            <div className="overflow-auto h-full">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3">Producto</th>
                            <th className="px-4 py-3 text-right">Costo Unit.</th>
                            <th className="px-4 py-3 text-right">Precio Venta</th>
                            <th className="px-4 py-3 text-center">Margen</th>
                            <th className="px-4 py-3 text-center">Stock</th>
                            <th className="px-4 py-3 text-right">Valor Total (Costo)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {products.map(p => {
                            const margin = p.price - p.cost;
                            const marginPercent = ((margin / p.cost) * 100).toFixed(1);
                            const totalVal = p.cost * p.stock;
                            return (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">${p.cost}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">${p.price}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{marginPercent}%</span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-mono">{p.stock}</td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
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
