import React from 'react';

const DUMMY_MOVEMENTS = [
    { id: 1, type: 'IN', product: 'Cemento Portland 50kg', quantity: 50, date: '2023-10-25 10:30', user: 'Juan Pérez' },
    { id: 2, type: 'OUT', product: 'Ladrillo Hueco 12x18x33', quantity: 200, date: '2023-10-25 11:15', user: 'Maria Gomez' },
    { id: 3, type: 'IN', product: 'Tubería PVC 1/2"', quantity: 100, date: '2023-10-24 16:45', user: 'Juan Pérez' },
    { id: 4, type: 'OUT', product: 'Cable Unipolar 2.5mm', quantity: 20, date: '2023-10-24 09:12', user: 'Carlos Ruiz' },
];

export const StockMovements: React.FC = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Movimientos de Stock</h1>
                <p className="text-gray-600 mt-2">Historial de entradas y salidas de mercancía.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flow-root">
                    <ul role="list" className="-mb-8">
                        {DUMMY_MOVEMENTS.map((movement, eventIdx) => (
                            <li key={movement.id}>
                                <div className="relative pb-8">
                                    {eventIdx !== DUMMY_MOVEMENTS.length - 1 ? (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white 
                                                ${movement.type === 'IN' ? 'bg-green-500' : 'bg-blue-500'}
                                            `}>
                                                {movement.type === 'IN' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-medium text-gray-900">{movement.type === 'IN' ? 'Entrada' : 'Salida'}</span> de <span className="font-medium text-gray-900">{movement.product}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">Operado por {movement.user}</p>
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                <time dateTime={movement.date}>{movement.date}</time>
                                                <div className={`font-bold mt-1 ${movement.type === 'IN' ? 'text-green-600' : 'text-blue-600'}`}>
                                                    {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
