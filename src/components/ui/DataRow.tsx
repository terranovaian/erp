import React from 'react';

interface DataRowProps {
    label: string;
    children: React.ReactNode;
    isLast?: boolean;
}

export const DataRow: React.FC<DataRowProps> = ({ label, children, isLast = false }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center py-3 ${!isLast ? 'border-b border-gray-100 dark:border-slate-800' : ''}`}>
        <div className="w-full sm:w-48 flex-shrink-0 mb-2 sm:mb-0">
            <span className="text-sm font-bold text-gray-700 dark:text-slate-400">{label}</span>
        </div>
        <div className="flex-1 text-sm font-medium text-gray-900 dark:text-slate-200 w-full">
            {children}
        </div>
    </div>
);
