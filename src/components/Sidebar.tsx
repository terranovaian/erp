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
    Menu,
    type LucideIcon
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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

    const NavItem = ({ href, label, icon: Icon, isSubItem = false, activeColor = 'blue', sidebarOpen = true }: { href: string, label: string, icon: LucideIcon, isSubItem?: boolean, activeColor?: 'blue' | 'orange', sidebarOpen?: boolean }) => {
        const activeStyles = activeColor === 'orange'
            ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-medium'
            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium';
        const iconActiveColor = activeColor === 'orange' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400';

        return (
            <a href={href}
                title={!sidebarOpen ? label : ''}
                className={`w-full flex items-center rounded-lg text-sm transition-all mb-1
                ${isExactActive(href)
                        ? activeStyles
                        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    } ${sidebarOpen ? 'px-3 py-2 gap-3' : 'justify-center py-2 px-0'} 
                    ${isSubItem && sidebarOpen ? 'pl-10' : ''}`}
            >
                <Icon size={isSubItem ? 16 : 20} className={isExactActive(href) ? iconActiveColor : 'text-gray-400'} />
                {sidebarOpen && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>}
            </a>
        );
    };

    return (
        <aside className={`bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex-shrink-0 transition-all duration-300 absolute md:relative z-50 h-full ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'} flex flex-col`}>
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between h-16">
                <div className={`flex items-center gap-2 ${!sidebarOpen && 'md:justify-center w-full'}`}>
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-200">
                        D
                    </div>
                    {sidebarOpen && (
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-none tracking-tight text-gray-800 dark:text-gray-100">Depósito <span className="text-orange-600 dark:text-orange-500">Pro</span></span>
                        </div>
                    )}
                </div>
                {sidebarOpen && (
                    <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors">
                        <Menu size={20} />
                    </button>
                )}
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                {/* Categoría Ventas */}
                <div className="mb-2">
                    <a href="/ventas"
                        title={!sidebarOpen ? 'Ventas' : ''}
                        className={`w-full flex items-center rounded-lg transition-all ${isActive('/ventas') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'} ${sidebarOpen ? 'px-3 py-2 gap-3' : 'justify-center py-2 px-0'}`}>
                        <ShoppingCart size={20} className={isActive('/ventas') ? 'text-blue-600' : 'text-gray-400'} />
                        {sidebarOpen && <span className="text-sm">Ventas</span>}
                    </a>
                </div>

                {/* Categoría GESTIÓN DE DEPÓSITO (Expandible) */}
                <div className="mb-2">
                    <button
                        onClick={() => setDepositoExpanded(!depositoExpanded)}
                        title={!sidebarOpen ? 'Gestión de Depósito' : ''}
                        className={`w-full flex items-center justify-between rounded-lg transition-all ${isActive('/deposito') ? 'text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'} ${sidebarOpen ? 'px-3 py-2' : 'justify-center py-2 px-0'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Warehouse size={20} className={isActive('/deposito') ? 'text-blue-600' : 'text-orange-600'} />
                            {sidebarOpen && <span className="text-sm font-medium">Gestión de Depósito</span>}
                        </div>
                        {sidebarOpen && (depositoExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {/* Sub Items de Gestión de Depósito */}
                    {depositoExpanded && (
                        <div className={`mt-1 space-y-1 ${!sidebarOpen && 'flex flex-col items-center'}`}>
                            <NavItem href="/deposito/listado" label="Depósitos" icon={Layers} isSubItem={sidebarOpen} activeColor="orange" sidebarOpen={sidebarOpen} />
                            <NavItem href="/deposito/productos" label="Productos" icon={Box} isSubItem={sidebarOpen} activeColor="orange" sidebarOpen={sidebarOpen} />
                            <NavItem href="/deposito/movimientos" label="Movimientos" icon={ArrowLeftRight} isSubItem={sidebarOpen} activeColor="orange" sidebarOpen={sidebarOpen} />
                        </div>
                    )}
                </div>

                {/* Categoría INVENTARIO (Expandible) */}
                <div className="mb-2">
                    <button
                        onClick={() => setInventoryExpanded(!inventoryExpanded)}
                        title={!sidebarOpen ? 'Inventario' : ''}
                        className={`w-full flex items-center justify-between rounded-lg transition-all ${isActive('/inventario') ? 'text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'} ${sidebarOpen ? 'px-3 py-2' : 'justify-center py-2 px-0'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Box size={20} className={isActive('/inventario') ? 'text-blue-600' : 'text-blue-600'} />
                            {sidebarOpen && <span className="text-sm font-medium">Inventario</span>}
                        </div>
                        {sidebarOpen && (inventoryExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {/* Sub Items de Inventario */}
                    {inventoryExpanded && (
                        <div className={`mt-1 space-y-1 ${!sidebarOpen && 'flex flex-col items-center'}`}>
                            <NavItem href="/inventario/tablero" label="Tablero Principal" icon={LayoutDashboard} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                            <NavItem href="/inventario/control" label="Control de Stock" icon={Package} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                            <NavItem href="/inventario/historial" label="Historial de Stock" icon={History} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                            <NavItem href="/inventario/valorizacion" label="Valorización" icon={DollarSign} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                            <NavItem href="/inventario/rotacion" label="Análisis Rotación" icon={TrendingUp} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                        </div>
                    )}
                </div>

                {/* Categoría INTEGRACIONES */}
                <div className="mb-2">
                    <a href="/integraciones"
                        title={!sidebarOpen ? 'Integraciones' : ''}
                        className={`w-full flex items-center rounded-lg transition-all ${isActive('/integraciones') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'} ${sidebarOpen ? 'px-3 py-2 gap-3' : 'justify-center py-2 px-0'}`}>
                        <Plug size={20} className={isActive('/integraciones') ? 'text-blue-600' : 'text-gray-400'} />
                        {sidebarOpen && <span className="text-sm">Integraciones</span>}
                    </a>
                </div>

                {/* Categoría HERRAMIENTAS (Expandible) */}
                <div className="mb-2">
                    <button
                        onClick={() => setHerramientasExpanded(!herramientasExpanded)}
                        title={!sidebarOpen ? 'Herramientas' : ''}
                        className={`w-full flex items-center justify-between rounded-lg transition-all ${isActive('/herramientas') ? 'text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'} ${sidebarOpen ? 'px-3 py-2' : 'justify-center py-2 px-0'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Wrench size={20} className={isActive('/herramientas') ? 'text-blue-600' : 'text-purple-600'} />
                            {sidebarOpen && <span className="text-sm font-medium">Herramientas</span>}
                        </div>
                        {sidebarOpen && (herramientasExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {/* Sub Items de Herramientas */}
                    {herramientasExpanded && (
                        <div className={`mt-1 space-y-1 ${!sidebarOpen && 'flex flex-col items-center'}`}>
                            <NavItem href="/herramientas/metricas" label="Métricas Generales" icon={BarChart3} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                            <NavItem href="/herramientas/ean" label="Generador EAN" icon={Barcode} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                            <NavItem href="/herramientas/calculadora" label="Calculadora Ganancia" icon={Calculator} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                            <NavItem href="/herramientas/tareas" label="Tareas" icon={FileText} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                            <NavItem href="/herramientas/usuarios" label="Gestión Usuarios" icon={UserCog} isSubItem={sidebarOpen} sidebarOpen={sidebarOpen} />
                        </div>
                    )}
                </div>
            </div>

            <div className={`p-4 border-t border-gray-100 dark:border-slate-800 mt-auto ${!sidebarOpen && 'flex justify-center flex-col items-center gap-4'}`}>
                <div className={`flex ${!sidebarOpen ? 'justify-center' : 'justify-between'} items-center mb-2`}>
                    {sidebarOpen && <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tema</span>}
                    <ThemeToggle />
                </div>
                <div className={`w-full h-px bg-gray-100 dark:bg-slate-800 mb-2 ${!sidebarOpen ? 'hidden' : ''}`} />
                <button className={`flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 w-full rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${sidebarOpen ? 'px-2 py-2' : 'justify-center py-2 px-0'}`}>
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center font-bold text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex-shrink-0">
                        A
                    </div>
                    {sidebarOpen && <div className="text-left">
                        <p className="font-bold text-gray-800 dark:text-slate-200 leading-tight">Admin User</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">admin@empresa.com</p>
                    </div>}
                </button>
            </div>
        </aside>
    );
};
