import React, { useState } from 'react';
import {
    Search,
    Plus,
    Warehouse,
    Layers
} from 'lucide-react';

export const InventoryList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 font-sans w-full">
            {/* Top Toolbar */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 w-full">
                <div className="flex items-center gap-6 flex-1">
                    <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-sm font-bold border border-orange-100 dark:border-orange-900/30 shadow-sm whitespace-nowrap">
                        Gestión De Depósitos
                    </span>

                    <div className="relative flex-1 max-w-2xl ml-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar ubicación de producto..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 dark:focus:border-orange-800 transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-slate-500 shadow-inner dark:shadow-none text-gray-900 dark:text-slate-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-6">
                    <button className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 border-2 border-dashed border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all font-black text-sm shadow-sm active:scale-95 whitespace-nowrap">
                        <Plus size={20} /> Nuevo Depósito
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-12 w-full">
                <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 mb-10 tracking-tight">Mis Depósitos</h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
                    {/* Left Card: Small Empty State */}
                    <div className="lg:col-span-4 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center transition-all hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 group cursor-pointer min-h-[450px]">
                        <div className="w-24 h-24 mb-8 text-gray-200 dark:text-slate-600 group-hover:text-orange-300 dark:group-hover:text-orange-700 transition-all duration-500 transform group-hover:scale-110">
                            <Warehouse size={96} strokeWidth={1} />
                        </div>
                        <p className="text-gray-400 dark:text-slate-500 font-bold tracking-tight text-lg uppercase opacity-60">No hay depósitos activos.</p>
                    </div>

                    {/* Right Card: Large Empty State */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center shadow-2xl shadow-gray-100/30 dark:shadow-black/30 transition-all hover:scale-[1.005] group cursor-pointer min-h-[450px]">
                        <div className="w-28 h-28 mb-8 text-gray-200 dark:text-slate-600 group-hover:text-orange-400 dark:group-hover:text-orange-500 transition-all duration-500 transform group-hover:rotate-3">
                            <Layers size={112} strokeWidth={1} />
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-3xl max-w-lg font-black leading-tight tracking-tighter">
                            Seleccione o cree un depósito para gestionar su estructura.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
