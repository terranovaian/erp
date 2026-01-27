import React from 'react';

interface StatusBadgeProps {
    stock: number;
    min: number;
    available: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ stock, min, available }) => {
    if (available <= 0) return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-500 border border-gray-200">Agotado</span>;
    if (available <= min) return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-600 border border-red-200">Crítico</span>;
    if (available <= min * 1.5) return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700 border border-yellow-200">Bajo</span>;
    return <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700 border border-green-200">Activo</span>;
};
