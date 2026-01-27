import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    History,
    DollarSign,
    TrendingUp,
    ShoppingCart,
    Truck,
    Box,
    ChevronDown,
    ChevronRight,
    X,
    Plug,
    Wrench,
    BarChart3,
    Barcode,
    Calculator,
    FileText,
    UserCog,
    Warehouse,
    Layers,
    ArrowLeftRight,
    type LucideIcon
} from 'lucide-react';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    currentPath: string;
}

// Helper para obtener el estado inicial desde localStorage
const getInitialExpandedState = (key: string, defaultValue: boolean): boolean => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
};

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, currentPath }) => {
    const [inventoryExpanded, setInventoryExpanded] = useState(() =>
        getInitialExpandedState('sidebar_inventory_expanded', true)
    );
    const [depositoExpanded, setDepositoExpanded] = useState(() =>
        getInitialExpandedState('sidebar_deposito_expanded', false)
    );
    const [herramientasExpanded, setHerramientasExpanded] = useState(() =>
        getInitialExpandedState('sidebar_herramientas_expanded', false)
    );

    // Persistir estados en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('sidebar_inventory_expanded', JSON.stringify(inventoryExpanded));
    }, [inventoryExpanded]);

    useEffect(() => {
        localStorage.setItem('sidebar_deposito_expanded', JSON.stringify(depositoExpanded));
    }, [depositoExpanded]);

    useEffect(() => {
        localStorage.setItem('sidebar_herramientas_expanded', JSON.stringify(herramientasExpanded));
    }, [herramientasExpanded]);

    const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
    const isExactActive = (path: string) => currentPath === path;

    const NavItem = ({ href, label, icon: Icon, isSubItem = false }: { href: string, label: string, icon: LucideIcon, isSubItem?: boolean }) => (
        <a href={href}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1
            ${isExactActive(href)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${isSubItem ? 'pl-10' : ''}`}
        >
            <Icon size={isSubItem ? 16 : 20} className={isExactActive(href) ? 'text-blue-600' : 'text-gray-400'} />
            {label}
        </a>
    );

    return (
        <aside className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 absolute md:relative z-50 h-full ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'} flex flex-col`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between h-16">
                <div className={`flex items-center gap-2 ${!sidebarOpen && 'md:justify-center w-full'}`}>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                        ERP
                    </div>
                    {sidebarOpen && <span className="font-bold text-lg tracking-tight text-gray-800">MiSistema</span>}
                </div>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">
                    <X size={20} />
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                {/* Categoría Ventas */}
                <div className="mb-2">
                    <a href="/ventas" className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isActive('/ventas') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                            <ShoppingCart size={20} className={isActive('/ventas') ? 'text-blue-600' : 'text-gray-400'} />
                            {sidebarOpen && <span className="text-sm">Ventas</span>}
                        </div>
                    </a>
                </div>

                {/* Categoría GESTIÓN DE DEPÓSITO (Expandible) */}
                <div className="mb-2">
                    <button onClick={() => { setSidebarOpen(true); setDepositoExpanded(!depositoExpanded); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isActive('/deposito') ? 'text-blue-700 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Warehouse size={20} className={isActive('/deposito') ? 'text-blue-600' : 'text-orange-600'} />
                            {sidebarOpen && <span className="text-sm font-medium">Gestión de Depósito</span>}
                        </div>
                        {sidebarOpen && (depositoExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {/* Sub Items de Gestión de Depósito */}
                    {(depositoExpanded || !sidebarOpen) && (
                        <div className={`mt-1 space-y-1 ${!sidebarOpen && 'hidden md:block'}`}>
                            <NavItem href="/deposito/listado" label="Depósitos" icon={Layers} isSubItem={sidebarOpen} />
                            <NavItem href="/deposito/productos" label="Productos" icon={Box} isSubItem={sidebarOpen} />
                            <NavItem href="/deposito/movimientos" label="Movimientos" icon={ArrowLeftRight} isSubItem={sidebarOpen} />
                        </div>
                    )}
                </div>

                {/* Categoría INVENTARIO (Expandible) */}
                <div className="mb-2">
                    <button onClick={() => { setSidebarOpen(true); setInventoryExpanded(!inventoryExpanded); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isActive('/inventario') ? 'text-blue-700 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Box size={20} className={isActive('/inventario') ? 'text-blue-600' : 'text-blue-600'} />
                            {sidebarOpen && <span className="text-sm font-medium">Inventario</span>}
                        </div>
                        {sidebarOpen && (inventoryExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {/* Sub Items de Inventario */}
                    {(inventoryExpanded || !sidebarOpen) && (
                        <div className={`mt-1 space-y-1 ${!sidebarOpen && 'hidden md:block'}`}>
                            <NavItem href="/inventario/tablero" label="Tablero Principal" icon={LayoutDashboard} isSubItem={sidebarOpen} />
                            <NavItem href="/inventario/control" label="Control de Stock" icon={Package} isSubItem={sidebarOpen} />
                            <NavItem href="/inventario/historial" label="Historial de Stock" icon={History} isSubItem={sidebarOpen} />
                            <NavItem href="/inventario/valorizacion" label="Valorización" icon={DollarSign} isSubItem={sidebarOpen} />
                            <NavItem href="/inventario/rotacion" label="Análisis Rotación" icon={TrendingUp} isSubItem={sidebarOpen} />
                        </div>
                    )}
                </div>

                {/* Categoría INTEGRACIONES */}
                <div className="mb-2">
                    <a href="/integraciones" className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isActive('/integraciones') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                            <Plug size={20} className={isActive('/integraciones') ? 'text-blue-600' : 'text-gray-400'} />
                            {sidebarOpen && <span className="text-sm">Integraciones</span>}
                        </div>
                    </a>
                </div>

                {/* Categoría HERRAMIENTAS (Expandible) */}
                <div className="mb-2">
                    <button onClick={() => { setSidebarOpen(true); setHerramientasExpanded(!herramientasExpanded); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isActive('/herramientas') ? 'text-blue-700 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Wrench size={20} className={isActive('/herramientas') ? 'text-blue-600' : 'text-purple-600'} />
                            {sidebarOpen && <span className="text-sm font-medium">Herramientas</span>}
                        </div>
                        {sidebarOpen && (herramientasExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {/* Sub Items de Herramientas */}
                    {(herramientasExpanded || !sidebarOpen) && (
                        <div className={`mt-1 space-y-1 ${!sidebarOpen && 'hidden md:block'}`}>
                            <NavItem href="/herramientas/metricas" label="Métricas Generales" icon={BarChart3} isSubItem={sidebarOpen} />
                            <NavItem href="/herramientas/ean" label="Generador EAN" icon={Barcode} isSubItem={sidebarOpen} />
                            <NavItem href="/herramientas/calculadora" label="Calculadora Ganancia" icon={Calculator} isSubItem={sidebarOpen} />
                            <NavItem href="/herramientas/tareas" label="Tareas" icon={FileText} isSubItem={sidebarOpen} />
                            <NavItem href="/herramientas/usuarios" label="Gestión Usuarios" icon={UserCog} isSubItem={sidebarOpen} />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 mt-auto">
                <button className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-800 w-full px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        A
                    </div>
                    {sidebarOpen && <div>
                        <p className="font-medium">Admin User</p>
                        <p className="text-xs">admin@empresa.com</p>
                    </div>}
                </button>
            </div>
        </aside>
    );
};
