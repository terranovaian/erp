import React, { useMemo } from 'react';
import {
    LayoutDashboard,
    Package,
    Wallet,
    AlertOctagon,
    ArrowUpRight,
    ArrowDownRight,
    Box,
    AlertTriangle
} from 'lucide-react';

interface DashboardViewProps {
    products: any[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ products }) => {
    const stats = useMemo(() => {
        const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
        const totalValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
        const lowStock = products.filter(p => p.stock <= p.minStock).length;
        const activeProducts = products.filter(p => p.stock > 0).length;

        return { totalStock, totalValue, lowStock, activeProducts };
    }, [products]);

    const StatCard = ({ title, value, subtext, icon: Icon, color, trend }: any) => (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div className="flex items-center text-xs">
                <span className={`font-bold flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ?
                        <ArrowUpRight size={14} className="mr-1" /> :
                        <ArrowDownRight size={14} className="mr-1" />}
                    {subtext}
                </span>
                <span className="text-gray-400 dark:text-slate-500 ml-1">vs mes pasado</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Tablero Principal</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Valor de Inventario" value={`$${stats.totalValue.toLocaleString()}`}
                    subtext="+12%" icon={Wallet} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" trend="up" />
                <StatCard title="Total Unidades" value={stats.totalStock} subtext="+5%" icon={Box}
                    color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" trend="up" />
                <StatCard title="Productos Activos" value={stats.activeProducts} subtext="-2" icon={Package}
                    color="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" trend="down" />
                <StatCard title="Stock Crítico" value={stats.lowStock} subtext={stats.lowStock > 0 ? "Acción requerida" : "Todo bien"}
                    icon={AlertOctagon}
                    color="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    trend={stats.lowStock > 0 ? "down" : "up"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-slate-100">Top Productos (Valorizados)</h3>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Ver reporte</button>
                    </div>
                    <div className="space-y-4">
                        {products.slice(0, 4).map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-bold text-gray-500 dark:text-slate-400 text-xs">
                                        #{idx + 1}</div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-slate-200 text-sm">{p.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">{p.stock} unidades</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-slate-200 text-sm">${(p.stock * p.cost).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-6">Estado de Almacén</h3>
                    <div className="relative pt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-slate-400">Ocupación (A-01)</span>
                            <span className="font-bold text-gray-900 dark:text-slate-200">85%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 mb-6">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>

                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-slate-400">Ocupación (B-04)</span>
                            <span className="font-bold text-gray-900 dark:text-slate-200">42%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 mb-6">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                        </div>

                        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                            <div className="flex gap-2 text-yellow-800 dark:text-yellow-500 font-bold text-sm items-center mb-1">
                                <AlertTriangle size={16} /> Atención
                            </div>
                            <p className="text-xs text-yellow-700 dark:text-yellow-600">El depósito C-01 está alcanzando su capacidad máxima. Se recomienda revisión.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
