import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    currentPath: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPath }) => {
    // Cargar estado inicial desde localStorage
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sidebar_global_open');
            return stored !== null ? JSON.parse(stored) : true;
        }
        return true;
    });

    // Guardar estado en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('sidebar_global_open', JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentPath={currentPath}
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 relative">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
                    {!sidebarOpen ? (
                        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
                            <Menu size={20} />
                        </button>
                    ) : <div />}
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 hidden sm:inline">v2.4.0 (Beta)</span>
                        <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs border border-blue-200">
                            JD
                        </div>
                    </div>
                </header>

                {/* Content Scrollable Area */}
                <div className="flex-1 overflow-auto">
                    <div className="h-full w-full">
                        {children}
                    </div>
                </div>
            </main>

            {/* Overlay para móvil */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/20 z-40 md:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

