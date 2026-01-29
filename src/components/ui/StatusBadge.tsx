import React from 'react';

interface StatusBadgeProps {
    stock: number;
    min: number;
    available: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ stock, min, available }) => {
    if (available <= 0) return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700">Agotado</span>;
    if (available <= min) return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">Crítico</span>;
    if (available <= min * 1.5) return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">Bajo</span>;
    return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">Activo</span>;
};
