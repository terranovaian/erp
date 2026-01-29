import React, { useState, useMemo } from 'react';
import {
    Search, Filter, ArrowRight, Bot, User, ShoppingBag,
    History, Download, Calendar as CalendarIcon, ChevronDown,
    ChevronRight, ChevronLeft, AlertTriangle, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';

// --- TIPOS ---
export type LogType = 'sale' | 'manual' | 'auto_rule' | 'entry' | 'error' | 'sync';
export type ActorType = 'user' | 'system' | 'platform';

export interface StockLog {
    id: string;
    date: string; // Formato: dd/mm/aaaa HH:mm:ss
    type: LogType;
    prod: string;
    sku: string;
    old: number;
    new: number;
    actor: string;
    actorType: ActorType;
    reason: string;
}

// --- DATA MOCK FINAL DEFINITIVA ---
const MOCK_LOGS: StockLog[] = [
    { id: '1', date: '25/01/2026 14:30:45', type: 'error', prod: 'Bolso XL Arena', sku: 'BOLS-001', old: 12, new: 12, actor: 'MercadoLibre', actorType: 'platform', reason: 'Error API: Token de acceso vencido (Re-autenticación necesaria)' },
    { id: '2', date: '25/01/2026 14:28:12', type: 'sale', prod: 'Botella 1L Azul', sku: 'BOT-05', old: 50, new: 49, actor: 'WooCommerce', actorType: 'platform', reason: 'Venta procesada Orden #WOO-9988' },
    { id: '3', date: '25/01/2026 12:00:33', type: 'entry', prod: 'Pack Toallas', sku: 'TOA-PACK', old: 0, new: 100, actor: 'Recepción', actorType: 'user', reason: 'Ingreso mercadería OC #4055' },
    { id: '4', date: '25/01/2026 11:45:10', type: 'manual', prod: 'Mochila Urbana', sku: 'MOCH-01', old: 10, new: 8, actor: 'Juan Pérez', actorType: 'user', reason: 'Ajuste: Rotura detectada en depósito' },
    { id: '5', date: '25/01/2026 09:30:00', type: 'auto_rule', prod: 'Silla Playera', sku: 'SILLA-P', old: 4, new: 4, actor: 'Bot de Stock', actorType: 'system', reason: 'Pausa Preventiva activada (Stock de Seguridad < 6)' },
    { id: '6', date: '24/01/2026 18:30:45', type: 'sale', prod: 'Sombrilla 2m', sku: 'SOMB-ALU', old: 15, new: 13, actor: 'TiendaNube', actorType: 'platform', reason: 'Venta Tienda #TN-2231' },
    { id: '7', date: '24/01/2026 17:15:00', type: 'error', prod: 'Lona Tropical', sku: 'LONA-02', old: 20, new: 20, actor: 'MercadoLibre', actorType: 'platform', reason: 'Fallo de Sync: Publicación finalizada en origen' },
    { id: '8', date: '24/01/2026 15:20:12', type: 'sync', prod: 'Catálogo Verano', sku: 'ALL-V', old: 200, new: 200, actor: 'Sistema', actorType: 'system', reason: 'Sincronización masiva de stock exitosa' },
    { id: '9', date: '24/01/2026 10:05:01', type: 'error', prod: 'Termo Acero', sku: 'TER-100', old: 50, new: 50, actor: 'Sistema', actorType: 'system', reason: 'Bloqueo: Intento de actualización de stock negativo rechazado' },
    { id: '10', date: '23/01/2026 16:40:11', type: 'sale', prod: 'Botella 1L Azul', sku: 'BOT-05', old: 55, new: 50, actor: 'Local Central', actorType: 'user', reason: 'Venta mostrador - Factura A-992' },
    { id: '11', date: '23/01/2026 14:12:05', type: 'entry', prod: 'Protector Solar', sku: 'CRM-50', old: 5, new: 50, actor: 'Recepción', actorType: 'user', reason: 'Ingreso reposición urgente' },
    { id: '12', date: '22/01/2026 19:22:33', type: 'error', prod: 'Mazo Cartas', sku: 'CARD-01', old: 10, new: 10, actor: 'WooCommerce', actorType: 'platform', reason: 'Error de Red: Timeout excedido en el endpoint de stock' },
    { id: '13', date: '21/01/2026 11:30:00', type: 'auto_rule', prod: 'Heladerita 20L', sku: 'COOL-20', old: 2, new: 2, actor: 'Bot de Stock', actorType: 'system', reason: 'Pausa de Seguridad: Stock Crítico' },
    { id: '14', date: '20/01/2026 09:45:00', type: 'manual', prod: 'Lona Tropical', sku: 'LONA-02', old: 22, new: 20, actor: 'Juan Pérez', actorType: 'user', reason: 'Corrección: Error de carga previa' },
    { id: '15', date: '15/01/2026 18:00:10', type: 'sync', prod: 'Inventario Global', sku: 'GLOBAL', old: 0, new: 0, actor: 'Sistema', actorType: 'system', reason: 'Check de consistencia semanal finalizado' },
];

export const StockHistoryView: React.FC = () => {
    // --- ESTADOS ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // --- ESTADOS DEL SELECTOR DE FECHAS ---
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [dateMode, setDateMode] = useState<'list' | 'calendar'>('list');
    const [selectedLabel, setSelectedLabel] = useState('Últimos 30 días');
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // --- LÓGICA DE CALENDARIO ---
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const monthData = useMemo(() => getDaysInMonth(currentCalendarMonth), [currentCalendarMonth]);

    const handleMonthChange = (offset: number) => {
        setCurrentCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const handleDateClick = (day: number) => {
        const date = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (date < startDate) {
            setEndDate(startDate);
            setStartDate(date);
        } else {
            setEndDate(date);
        }
    };

    const applyCustomRange = () => {
        if (startDate) {
            const format = (d: Date) => d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
            setSelectedLabel(endDate ? `${format(startDate)} - ${format(endDate)}` : format(startDate));
            setIsDateOpen(false);
            setDateMode('list');
        }
    };

    // --- FILTRADO ---
    const filteredLogs = useMemo(() => {
        return MOCK_LOGS.filter(log => {
            const matchesSearch = log.prod.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.actor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || log.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [searchTerm, filterType]);

    // --- RENDERIZADO DEL DELTA (SUTIL Y ELEGANTE) ---
    const renderDelta = (oldS: number, newS: number) => {
        const diff = newS - oldS;
        if (diff === 0) return <span className="text-gray-300 text-xs">—</span>;

        const isPositive = diff > 0;
        // Estilo Badge Soft: Fondo muy suave, borde sutil, texto legible pero no neón
        const styles = isPositive
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';

        return (
            <div className="flex flex-col items-start gap-1 pl-4">
                {/* Badge Principal */}
                <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${styles}`}>
                    {isPositive ? '+' : ''}{diff}
                </span>

                {/* Detalle secundario (Transición) */}
                <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500 pl-0.5">
                    <span>{oldS}</span>
                    <ArrowRight size={10} className="text-gray-300 dark:text-slate-600" />
                    <span>{newS}</span>
                </div>
            </div>
        );
    };

    // --- RENDERIZADO DE ACTOR (PASTEL SOFT) ---
    const renderActor = (log: StockLog) => {
        let styles = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
        let Icon = User;

        if (log.actor.includes('MercadoLibre')) { styles = 'bg-[#fff9c4] dark:bg-yellow-900/30 border-[#f0e68c] dark:border-yellow-800 text-yellow-900 dark:text-yellow-300'; Icon = ShoppingBag; }
        else if (log.actor.includes('Woo')) { styles = 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300'; Icon = ShoppingBag; }
        else if (log.actor.includes('Fravega') || log.actor.includes('TiendaNube')) { styles = 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300'; Icon = ShoppingBag; }
        else if (log.actor.includes('Bot') || log.actor === 'Sistema') { styles = 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-300'; Icon = Bot; }

        return (
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border ${styles} w-[170px] transition-all hover:brightness-95 shadow-sm mx-auto cursor-default`}>
                <Icon size={15} strokeWidth={2.5} />
                <span className="text-xs font-bold truncate select-none flex-1 text-left" title={log.actor}>{log.actor}</span>
            </div>
        );
    };

    const renderBadge = (type: LogType) => {
        const styles = {
            sale: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
            manual: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            auto_rule: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
            entry: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
            error: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
            sync: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
        };
        const labels = { sale: 'Venta', manual: 'Manual', auto_rule: 'Auto', entry: 'Ingreso', error: 'Error', sync: 'Sync' };
        return (
            <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border ${styles[type] || 'bg-gray-100 dark:bg-slate-800'}`}>
                {labels[type]}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10 flex flex-col h-full bg-gray-50/30 dark:bg-slate-900/20">
            {/* Toolbar Principal - Diseño Compacto Enterprise */}
            <div className="flex flex-col xl:flex-row justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex-shrink-0 mx-1">
                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    {/* Búsqueda */}
                    {/* Búsqueda */}
                    <div className="relative flex-1 sm:w-72 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por producto, SKU o canal..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 dark:text-slate-200 transition-all shadow-inner dark:shadow-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Selector de Rango de Fechas Híbrido */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDateOpen(!isDateOpen)}
                            className="flex items-center gap-3 pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-200 font-bold hover:border-gray-300 dark:hover:border-slate-600 outline-none focus:border-blue-500 transition-all shadow-sm min-w-[260px]"
                        >
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={16} />
                            <div className="flex flex-col items-start leading-tight">
                                <span className="font-black text-gray-900 dark:text-slate-100">{selectedLabel}</span>
                                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">Auditoría Temporal</span>
                            </div>
                            <ChevronDown className={`ml-auto text-gray-400 dark:text-slate-500 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} size={14} />
                        </button>

                        {isDateOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => { setIsDateOpen(false); setDateMode('list'); }}></div>
                                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-zoom-in origin-top-left overflow-hidden min-w-[320px]">
                                    {dateMode === 'list' ? (
                                        <>
                                            <div className="px-4 py-3 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-gray-50/80 dark:bg-slate-800/80 mb-1 border-b border-gray-100 dark:border-slate-800 text-center">
                                                Seleccionar Período
                                            </div>
                                            <div className="max-h-[350px] overflow-y-auto">
                                                {['Hoy', 'Últimas 24 hs', 'Últimos 7 días', 'Últimos 30 días', 'Mes Actual'].map(label => (
                                                    <button
                                                        key={label}
                                                        onClick={() => { setSelectedLabel(label); setIsDateOpen(false); }}
                                                        className={`w-full text-left px-5 py-4 text-sm font-bold transition-all border-l-4 ${selectedLabel === label ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-600 dark:border-blue-500' : 'text-gray-600 dark:text-slate-300 border-transparent hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setDateMode('calendar')}
                                                    className="w-full text-left px-5 py-5 text-sm font-black text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 group transition-all"
                                                >
                                                    Elegir Rango Personalizado <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-5 w-[340px]">
                                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-slate-800">
                                                <button onClick={() => setDateMode('list')} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-950 dark:hover:text-slate-200 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors">
                                                    <ChevronLeft size={16} /> Volver
                                                </button>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleMonthChange(-1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-slate-500"><ChevronLeft size={16} /></button>
                                                    <span className="text-xs font-black text-gray-900 dark:text-slate-200 min-w-[100px] text-center capitalize tracking-tighter">
                                                        {currentCalendarMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <button onClick={() => handleMonthChange(1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-slate-500"><ChevronRight size={16} /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1.5 mb-3 text-center text-[10px] font-black text-gray-300 dark:text-slate-600 uppercase">
                                                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(d => <div key={d}>{d}</div>)}
                                            </div>
                                            <div className="grid grid-cols-7 gap-1.5">
                                                {Array.from({ length: monthData.firstDay }).map((_, i) => <div key={`pad-${i}`} />)}
                                                {Array.from({ length: monthData.days }).map((_, i) => {
                                                    const day = i + 1;
                                                    const date = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
                                                    const isSelected = (startDate && date.toDateString() === startDate.toDateString()) || (endDate && date.toDateString() === endDate.toDateString());
                                                    const isInRange = startDate && endDate && date > startDate && date < endDate;
                                                    return (
                                                        <button
                                                            key={day}
                                                            onClick={() => handleDateClick(day)}
                                                            className={`h-9 w-9 rounded-xl text-xs transition-all flex items-center justify-center font-bold ${isSelected ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-100 dark:shadow-blue-900/50 scale-110' : isInRange ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-gray-100 dark:border-slate-800">
                                                <button onClick={() => { setDateMode('list'); setIsDateOpen(false); }} className="text-xs font-black text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-200 transition-colors px-4 py-2">Cancelar</button>
                                                <button onClick={applyCustomRange} disabled={!startDate} className="bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-xl shadow-blue-100 dark:shadow-blue-900/50 hover:bg-blue-700 disabled:opacity-20 disabled:shadow-none transition-all active:scale-95">Aplicar Rango</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 pr-5 border-r border-gray-100 dark:border-slate-800 h-8">
                        <Filter size={14} className="text-gray-400 dark:text-slate-500" />
                        <select
                            className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-[0.15em] bg-transparent outline-none cursor-pointer hover:text-gray-900 dark:hover:text-slate-200 transition-colors"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all" className="dark:bg-slate-900">Filtro: Todo</option>
                            <option value="error" className="dark:bg-slate-900">Logs de Error</option>
                            <option value="sale" className="dark:bg-slate-900">Sólo Ventas</option>
                            <option value="auto_rule" className="dark:bg-slate-900">Bots / Automat.</option>
                            <option value="entry" className="dark:bg-slate-900">Ingresos Stock</option>
                            <option value="manual" className="dark:bg-slate-900">Ajustes Manuales</option>
                        </select>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gray-900 dark:bg-slate-800 text-white dark:text-slate-200 rounded-xl text-sm font-black hover:bg-black dark:hover:bg-slate-700 transition-all shadow-xl shadow-gray-100 dark:shadow-black/20 active:scale-95">
                        <Download size={16} strokeWidth={2.5} /> <span>Exportar</span>
                    </button>
                </div>
            </div>

            {/* Tabla de Auditoría - Contenedor con Alto Fijo y Scroll */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-240px)] min-h-[500px] flex-1 mt-2">
                <div className="overflow-auto custom-scrollbar flex-1 relative">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-gray-50/50 dark:bg-slate-900/50 whitespace-nowrap">Fecha Forense</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] text-center bg-gray-50/50 dark:bg-slate-900/50">Fuente Auditada</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-gray-50/50 dark:bg-slate-900/50">Producto / SKU</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-gray-50/50 dark:bg-slate-900/50">Evento</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] bg-gray-50/50 dark:bg-slate-900/50">Variación Stock</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right bg-gray-50/50 dark:bg-slate-900/50 pr-8">Detalle del Registro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/80 dark:divide-slate-800/80">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap text-[11px] font-mono font-black text-gray-500 dark:text-slate-400 tracking-tighter">
                                        {log.date}
                                    </td>
                                    <td className="px-6 py-5">
                                        {renderActor(log)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-gray-950 dark:text-slate-100 line-clamp-1">{log.prod}</div>
                                        <div className="text-[10px] font-mono font-black text-gray-400 dark:text-slate-500 tracking-wider flex items-center gap-1 mt-0.5 uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-slate-700" />
                                            {log.sku}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">{renderBadge(log.type)}</td>
                                    <td className="px-6 py-5">
                                        {renderDelta(log.old, log.new)}
                                    </td>
                                    <td className="px-6 py-5 text-right pr-8">
                                        <div
                                            className={`text-[11px] font-bold italic transition-colors max-w-[280px] ml-auto truncate cursor-help ${log.type === 'error' ? 'text-red-500' : 'text-gray-400 dark:text-slate-500 opacity-80 group-hover:opacity-100'}`}
                                            title={log.reason}
                                        >
                                            {log.type === 'error' && <AlertCircle size={10} className="inline mr-1 animate-pulse" />}
                                            {log.reason}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLogs.length === 0 && (
                    <div className="p-24 text-center bg-gray-50/30 dark:bg-slate-900/30 flex-1 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20">
                            <History size={48} className="text-gray-200 dark:text-slate-700 stroke-[1.5]" />
                        </div>
                        <p className="text-gray-900 dark:text-slate-100 font-black text-2xl mb-2 tracking-tight">Sin Evidencia Auditada</p>
                        <p className="text-gray-400 dark:text-slate-500 text-sm mb-10 max-w-sm mx-auto font-medium">No se detectaron movimientos de stock para los criterios seleccionados. Intenta ampliar el rango de fechas.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                            className="text-white text-[11px] font-black uppercase tracking-[0.2em] px-10 py-4 bg-blue-600 rounded-2xl transition-all shadow-2xl shadow-blue-100 dark:shadow-blue-900/50 hover:bg-blue-700 active:scale-95"
                        >
                            Resetear Auditoría
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
