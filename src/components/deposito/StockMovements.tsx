import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, User, MessageCircle } from 'lucide-react';

const DUMMY_MOVEMENTS = [
    { id: 1, type: 'IN', productName: 'Cemento Portland 50kg', quantity: 50, timestamp: '2023-10-25 10:30', user: 'Juan Pérez', reason: 'Re-stock semanal' },
    { id: 2, type: 'OUT', productName: 'Ladrillo Hueco 12x18x33', quantity: 200, timestamp: '2023-10-25 11:15', user: 'Maria Gomez', reason: 'Obra Calle 15' },
    { id: 3, type: 'IN', productName: 'Tubería PVC 1/2"', quantity: 100, timestamp: '2023-10-24 16:45', user: 'Juan Pérez', reason: 'Devolución proveedor' },
    { id: 4, type: 'OUT', productName: 'Cable Unipolar 2.5mm', quantity: 20, timestamp: '2023-10-24 09:12', user: 'Carlos Ruiz', reason: 'Venta mostrador' },
];

export const StockMovements: React.FC = () => {
    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">Movimientos de Stock</h1>
                    <p className="text-slate-500 mt-2 font-medium">Historial detallado de entradas y salidas de mercancía.</p>
                </header>

                <div className="relative border-l-2 border-slate-200 ml-5 pl-10 space-y-12">
                    {DUMMY_MOVEMENTS.map((mv) => (
                        <div key={mv.id} className="relative">
                            {/* Icon Circle */}
                            <div className={`absolute -left-[64px] top-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-4 border-slate-50 transition-transform hover:scale-110 z-10
                                ${mv.type === 'IN' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}
                            `}>
                                {mv.type === 'IN' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-8 rounded-full ${mv.type === 'IN' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                        <h3 className="text-xl font-black text-slate-800">{mv.productName}</h3>
                                    </div>
                                    <span className={`text-2xl font-black tracking-tighter tabular-nums ${mv.type === 'IN' ? 'text-emerald-600' : 'text-orange-600'}`}>
                                        {mv.type === 'IN' ? '+' : '-'}{mv.quantity} <span className="text-sm font-bold uppercase opacity-60">un.</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Clock size={16} />
                                        </div>
                                        <span className="text-sm font-bold">{mv.timestamp}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <User size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{mv.user}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 md:col-span-1">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                            <MessageCircle size={16} />
                                        </div>
                                        <span className="text-sm italic font-medium">"{mv.reason}"</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
