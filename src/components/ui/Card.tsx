import React from 'react';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full ${className}`}>
        {title && (
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">{title}</h3>
            </div>
        )}
        <div className="px-6 py-4">
            {children}
        </div>
    </div>
);
