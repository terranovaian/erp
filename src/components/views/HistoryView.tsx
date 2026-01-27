import React from 'react';

export const HistoryView: React.FC = () => {
    const movements = [
        { id: 1, date: '12/01/2026 10:30', type: 'Ingreso', prod: 'Bolso Playero XL', qty: 10, user: 'Admin' },
        { id: 2, date: '12/01/2026 11:15', type: 'Venta', prod: 'Botella Deportiva', qty: -2, user: 'Sistema' },
        { id: 3, date: '11/01/2026 09:00', type: 'Ajuste', prod: 'Gorra Visera', qty: -1, user: 'J.Doe' },
        { id: 4, date: '10/01/2026 16:45', type: 'Ingreso', prod: 'Protector Solar', qty: 50, user: 'Admin' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">Historial de Movimientos</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Producto</th>
                            <th className="px-6 py-3 text-right">Cantidad</th>
                            <th className="px-6 py-3">Usuario</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {movements.map(m => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 text-gray-500">{m.date}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.type === 'Ingreso'
                                        ? 'bg-green-100 text-green-700' : m.type === 'Venta'
                                            ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {m.type}
                                    </span>
                                </td>
                                <td className="px-6 py-3 font-medium">{m.prod}</td>
                                <td className={`px-6 py-3 text-right font-bold ${m.qty > 0 ? 'text-green-600' :
                                    'text-red-600'}`}>{m.qty > 0 ? `+${m.qty}` : m.qty}</td>
                                <td className="px-6 py-3 text-gray-500">{m.user}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
