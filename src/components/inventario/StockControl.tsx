import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ListFilter,
    Columns,
    ChevronDown,
    GripVertical,
    Eye,
    EyeOff,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    Power,
    RefreshCw,
    Printer,
    Download,
    X,
    FileUp,
    Package,
    FileDown,
    FileSpreadsheet,
    FileText,
    Database,
    Image as ImageIcon,
    Truck,
    Edit,
    ToggleLeft,
    ToggleRight,
    Wand2,
    Bot,
    MoreVertical,
    PauseCircle,
    PlayCircle,
    History
} from 'lucide-react';
import { DEFAULT_COLUMN_CONFIG } from '../../data/mocks';
import { StatusBadge } from '../ui/StatusBadge';
import { ProductModal } from './ProductModal';
import { StockHistoryView } from './StockHistory';

interface StockControlViewProps {
    products: any[];
    onUpdateProduct: (id: string, product: any) => void;
    categories: string[];
    onAddCategory: (category: string) => void;
}

export const StockControlView: React.FC<StockControlViewProps> = ({ products, onUpdateProduct, categories, onAddCategory }) => {
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // NUEVO: Estado para configuración de columnas
    const [columns, setColumns] = useState(DEFAULT_COLUMN_CONFIG);
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    // Estados para Drag & Drop
    const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);

    // NUEVO: Estado para selección múltiple
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [showBulkAutomationModal, setShowBulkAutomationModal] = useState(false);
    const [activeBulkTab, setActiveBulkTab] = useState<'pause' | 'visibility'>('pause');
    const [bulkAutoPauseEnabled, setBulkAutoPauseEnabled] = useState(true);
    const [bulkThreshold, setBulkThreshold] = useState(5);
    const [bulkMaxVisibleEnabled, setBulkMaxVisibleEnabled] = useState(true);
    const [bulkMaxVisibleStock, setBulkMaxVisibleStock] = useState(10);
    const [showBulkActionsMenu, setShowBulkActionsMenu] = useState(false);

    const [activeFilters, setActiveFilters] = useState({
        category: '',
        status: '',
        linked: '',
        warehouse: '',
        sort: 'az'
    });

    // NUEVO: Estado para alternar entre Vista General e Historial
    const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

    const toggleColumn = (key: string) => {
        setColumns(prev => prev.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
        ));
    };

    // --- Handlers para Drag & Drop ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData('text/plain', position.toString());
        setDragItemIndex(position);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetPosition: number) => {
        e.preventDefault();
        const sourcePosition = parseInt(e.dataTransfer.getData('text/plain'));

        if (sourcePosition === targetPosition || isNaN(sourcePosition)) return;

        const newColumns = [...columns];
        const [movedItem] = newColumns.splice(sourcePosition, 1);
        newColumns.splice(targetPosition, 0, movedItem);

        setColumns(newColumns);
        setDragItemIndex(null);
    };

    // --- NUEVO: Handlers para Selección Múltiple ---
    const toggleSelectAll = (filteredProducts: any[]) => {
        if (selectedItems.size === filteredProducts.length) {
            setSelectedItems(new Set()); // Deseleccionar todo
        } else {
            const allIds = new Set(filteredProducts.map(p => p.id));
            setSelectedItems(allIds);
        }
    };

    const toggleSelectItem = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    // Helper para renderizar celdas dinámicamente
    const renderCell = (col: any, product: any) => {
        const available = product.stock - product.committed;

        switch (col.key) {
            case 'img':
                return (
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden mx-auto">
                        {product.imgUrl ? (
                            <img src={product.imgUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                            <ImageIcon size={18} className="text-gray-400 dark:text-slate-500" />
                        )}
                    </div>
                );
            case 'name':
                return (
                    <>
                        <div className="font-medium text-gray-900 dark:text-slate-100 truncate max-w-[150px] sm:max-w-[200px]"
                            title={product.name}>
                            {product.name}
                        </div>
                        <div className="md:hidden text-xs text-gray-500 dark:text-slate-400 font-mono mt-1">{product.id}</div>
                    </>
                );
            case 'sku':
                return (
                    <span className="font-mono text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-700">
                        {product.id}
                    </span>
                );
            case 'ean':
                return <span className="text-gray-500 dark:text-slate-400 font-mono text-xs">{product.ean || '-'}</span>;
            case 'brand':
                return <span className="text-gray-700 dark:text-slate-300 font-medium">{product.brand || '-'}</span>;
            case 'stock':
                return (
                    <div className="flex flex-col items-center">
                        <span className={`font-bold text-sm ${available < product.minStock ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-slate-200'}`}>
                            {available} u.
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap">
                            Físico: {product.stock}
                        </span>
                    </div>
                );
            case 'category':
                return product.category;
            case 'status':
                return <StatusBadge stock={product.stock} min={product.minStock} available={available} />;
            case 'location':
                return (
                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-slate-400">
                        <Truck size={14} className="text-gray-400 dark:text-slate-500" />
                        <span>{product.location}</span>
                    </div>
                );
            case 'actions':
                return (
                    <div className="flex items-center justify-center gap-1">
                        <button onClick={() => {
                            setActiveTab('history');
                            setSearch(product.id); // Pre-filtrar por SKU
                        }}
                            className="p-2 text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Ver Historial de este producto"
                        >
                            <History size={16} />
                        </button>
                        <button onClick={() => setSelectedProduct(product)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center"
                            title="Ver Ficha Completa"
                        >
                            <Edit size={18} />
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    const uniqueLocations = useMemo(() => [...new Set(products.map(p => p.location))], [products]);

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = activeFilters.category ? p.category === activeFilters.category : true;

        let matchesStatus = true;
        const available = p.stock - p.committed;
        if (activeFilters.status === 'out_of_stock') matchesStatus = available <= 0;
        if (activeFilters.status === 'low_stock') matchesStatus = available <= p.minStock && available > 0;
        if (activeFilters.status === 'active') matchesStatus = available > p.minStock;

        let matchesLinked = true;
        const isLinked = p.channels && p.channels.length > 0;
        if (activeFilters.linked === 'yes') matchesLinked = isLinked;
        if (activeFilters.linked === 'no') matchesLinked = !isLinked;

        const matchesWarehouse = activeFilters.warehouse ? p.location === activeFilters.warehouse : true;

        return matchesSearch && matchesCategory && matchesStatus && matchesLinked && matchesWarehouse;
    }).sort((a, b) => {
        switch (activeFilters.sort) {
            case 'az': return a.name.localeCompare(b.name);
            case 'za': return b.name.localeCompare(a.name);
            case 'sku_asc': return a.id.localeCompare(b.id, undefined, { numeric: true });
            case 'sku_desc': return b.id.localeCompare(a.id, undefined, { numeric: true });
            case 'cat_asc': return a.category.localeCompare(b.category);
            case 'cat_desc': return b.category.localeCompare(a.category);
            case 'stock_asc': return (a.stock - a.committed) - (b.stock - b.committed);
            case 'stock_desc': return (b.stock - b.committed) - (a.stock - a.committed);
            case 'price_asc': return a.price - b.price;
            case 'price_desc': return b.price - a.price;
            case 'newest': {
                const dateA = new Date(a.lastUpdated.split('/').reverse().join('-'));
                const dateB = new Date(b.lastUpdated.split('/').reverse().join('-'));
                // @ts-ignore
                return dateB - dateA;
            }
            case 'oldest': {
                const dateA = new Date(a.lastUpdated.split('/').reverse().join('-'));
                const dateB = new Date(b.lastUpdated.split('/').reverse().join('-'));
                // @ts-ignore
                return dateA - dateB;
            }
            default: return 0;
        }
    });

    const handleFilterChange = (key: string, value: string) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSort = (key: string) => {
        let newSort = '';
        if (key === 'name') newSort = activeFilters.sort === 'az' ? 'za' : 'az';
        else if (key === 'sku') newSort = activeFilters.sort === 'sku_asc' ? 'sku_desc' : 'sku_asc';
        else if (key === 'category') newSort = activeFilters.sort === 'cat_asc' ? 'cat_desc' : 'cat_asc';
        else if (key === 'stock') newSort = activeFilters.sort === 'stock_desc' ? 'stock_asc' : 'stock_desc';
        handleFilterChange('sort', newSort);
    };

    const handleApplyBulkRules = () => {
        let updatedCount = 0;

        selectedItems.forEach((id: any) => {
            const product = products.find(p => p.id === id);
            if (!product) return;

            const updatedChannels = (product.channels || []).map((ch: any) => {
                const updatedChannel = {
                    ...ch,
                    autoPauseEnabled: bulkAutoPauseEnabled,
                    bufferStock: bulkThreshold
                };

                if (bulkAutoPauseEnabled) {
                    const available = product.stock - product.committed;
                    if (available < bulkThreshold) {
                        if (ch.status === 'active' || ch.status === 'auto_paused') {
                            updatedChannel.status = 'auto_paused';
                        }
                    } else if (ch.status === 'auto_paused') {
                        updatedChannel.status = 'active';
                    }
                }

                return updatedChannel;
            });

            onUpdateProduct(id, {
                ...product,
                channels: updatedChannels,
                lastUpdated: new Date().toLocaleDateString('es-AR')
            });
            updatedCount++;
        });

        setSelectedItems(new Set());
        setShowBulkAutomationModal(false);
        alert(`Se han aplicado las reglas de protección a ${updatedCount} productos correctamente.`);
    };

    const handleApplyBulkVisibilityRules = () => {
        let updatedCount = 0;

        selectedItems.forEach((id: any) => {
            const product = products.find(p => p.id === id);
            if (!product) return;

            const updatedChannels = (product.channels || []).map((ch: any) => ({
                ...ch,
                maxVisibleEnabled: bulkMaxVisibleEnabled,
                maxVisibleStock: bulkMaxVisibleStock
            }));

            onUpdateProduct(id, {
                ...product,
                channels: updatedChannels,
                lastUpdated: new Date().toLocaleDateString('es-AR')
            });
            updatedCount++;
        });

        setSelectedItems(new Set());
        setShowBulkAutomationModal(false);
        alert(`Se han aplicado las reglas de visibilidad a ${updatedCount} productos correctamente.`);
    };

    const handleBulkStatusChange = (newStatus: 'active' | 'paused') => {
        let updatedCount = 0;
        selectedItems.forEach((id: any) => {
            const product = products.find(p => p.id === id);
            if (!product) return;
            const updatedChannels = (product.channels || []).map((ch: any) => ({
                ...ch,
                status: newStatus
            }));
            onUpdateProduct(id, { ...product, channels: updatedChannels });
            updatedCount++;
        });
        setSelectedItems(new Set());
        setShowBulkActionsMenu(false);
        alert(`Se han ${newStatus === 'active' ? 'activado' : 'pausado'} ${updatedCount} productos correctamente.`);
    };

    const handleBulkSync = () => {
        alert(`Sincronización forzada para ${selectedItems.size} productos iniciada.`);
        setSelectedItems(new Set());
        setShowBulkActionsMenu(false);
    };

    const SortableHeader = ({ label, sortKey, currentSort, onSort, className = "", children }: any) => {
        let isActive = false;
        let direction = null;

        if (sortKey === 'name') {
            isActive = currentSort === 'az' || currentSort === 'za';
            if (isActive) direction = currentSort === 'az' ? 'asc' : 'desc';
        } else if (sortKey === 'sku') {
            isActive = currentSort === 'sku_asc' || currentSort === 'sku_desc';
            if (isActive) direction = currentSort === 'sku_asc' ? 'asc' : 'desc';
        } else if (sortKey === 'category') {
            isActive = currentSort === 'cat_asc' || currentSort === 'cat_desc';
            if (isActive) direction = currentSort === 'cat_asc' ? 'asc' : 'desc';
        } else if (sortKey === 'stock') {
            isActive = currentSort === 'stock_asc' || currentSort === 'stock_desc';
            if (isActive) direction = currentSort === 'stock_asc' ? 'asc' : 'desc';
        }

        return (
            <th className={`px-3 py-4 bg-gray-50 dark:bg-slate-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group select-none ${className}`} onClick={() => onSort(sortKey)}
            >
                <div className={`flex items-center gap-1 ${isActive ? 'text-blue-700 dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-slate-400'} ${className.includes('text-center') ? 'justify-center' : ''}`}>
                    {label}
                    <div className="flex flex-col">
                        {isActive ? (
                            direction === 'asc' ?
                                <ArrowUp size={14} strokeWidth={2.5} /> :
                                <ArrowDown size={14} strokeWidth={2.5} />
                        ) : (
                            <ArrowUpDown size={14} className="text-gray-300 dark:text-slate-600 group-hover:text-gray-400 dark:group-hover:text-slate-500" />
                        )}
                    </div>
                </div>
            </th>
        );
    };

    const clearFilters = () => {
        setActiveFilters({ category: '', status: '', linked: '', warehouse: '', sort: 'az' });
        setSearch('');
    };

    const activeFilterCount = Object.entries(activeFilters)
        .filter(([key, value]) => key !== 'sort' && Boolean(value))
        .length;

    // Renderizado del Header de Tabla (Variable)
    const renderTableHeader = () => {
        if (selectedItems.size > 0) {
            // --- HEADER DE ACCIONES MASIVAS ---
            return (
                <div className="flex items-center justify-between px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 animate-fade-in sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                            {selectedItems.size} seleccionados
                        </span>
                        <div className="h-4 w-px bg-blue-200 dark:bg-blue-800"></div>

                        <div className="flex gap-1 items-center relative">
                            {/* --- BOTÓN DE MENÚ (3 PUNTITOS) --- */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowBulkActionsMenu(!showBulkActionsMenu)}
                                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${showBulkActionsMenu ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100' : 'text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
                                    title="Más Acciones Masivas"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {showBulkActionsMenu && (
                                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-zoom-in origin-top-left overflow-hidden">
                                        {/* SECCIÓN 1: ACCIONES MANUALES */}
                                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest bg-gray-50/50 dark:bg-slate-800/50">
                                            Acciones Manuales
                                        </div>
                                        <button
                                            onClick={() => handleBulkStatusChange('paused')}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-3 transition-colors group"
                                        >
                                            <PauseCircle size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-red-500" />
                                            <span>Pausar Selección</span>
                                        </button>
                                        <button
                                            onClick={() => handleBulkStatusChange('active')}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-3 transition-colors group"
                                        >
                                            <PlayCircle size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-green-500" />
                                            <span>Activar Selección</span>
                                        </button>
                                        <button
                                            onClick={handleBulkSync}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 transition-colors group"
                                        >
                                            <RefreshCw size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-blue-500" />
                                            <span>Forzar Sincronización</span>
                                        </button>

                                        {/* SECCIÓN 2: AUTOMATIZACIÓN */}
                                        <div className="border-t border-gray-100 dark:border-slate-800 my-1"></div>
                                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest bg-gray-50/50 dark:bg-slate-800/50">
                                            Automatización
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowBulkAutomationModal(true);
                                                setShowBulkActionsMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 transition-colors group"
                                        >
                                            <Wand2 size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-blue-500" />
                                            <span>Configurar Reglas Auto</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Salida de Información */}
                        <button
                            className="p-2 text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors flex items-center gap-2"
                            title="Imprimir Etiquetas">
                            <Printer size={18} /> <span className="text-sm font-medium hidden md:inline">Imprimir</span>
                        </button>
                        <button
                            className="p-2 text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors flex items-center gap-2"
                            title="Exportar Selección">
                            <Download size={18} /> <span className="text-sm font-medium hidden md:inline">Exportar</span>
                        </button>

                        <div className="h-4 w-px bg-blue-200 dark:bg-blue-800 mx-1"></div>
                        <button onClick={() => setSelectedItems(new Set())}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                            title="Cancelar Selección"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="space-y-6 h-full flex flex-col animate-fade-in" onClick={() => {
                if (showExportMenu) setShowExportMenu(false);
                if (showFilterMenu) setShowFilterMenu(false);
                if (showColumnMenu) setShowColumnMenu(false);
            }}>
                {/* Encabezado */}
                <div className="flex flex-col md:flex-row md:items-end justify-between flex-shrink-0 relative z-40 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Control de Stock</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-500 dark:text-slate-400">Gestión centralizada de productos e inventario.</p>
                            <div className="h-4 w-px bg-gray-300 dark:bg-slate-600 hidden sm:block"></div>
                            {/* TAB SELECTOR */}
                            <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-inner ml-1">
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'}`}
                                >
                                    <Package size={14} />
                                    Vista General
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-slate-600' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50'}`}
                                >
                                    <History size={14} />
                                    Auditoría de Stock
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botón Importar/Exportar con Dropdown */}
                    <div className="relative">
                        <button onClick={(e) => {
                            e.stopPropagation(); setShowExportMenu(!showExportMenu);
                            setShowFilterMenu(false); setShowColumnMenu(false);
                        }}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all shadow-sm border ${showExportMenu ? 'bg-blue-700 dark:bg-blue-900 border-blue-700 dark:border-blue-800 ring-2 ring-blue-100 dark:ring-blue-900/40 text-white' : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white border-transparent'}`}
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Importar/Exportar</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Menú Desplegable Personalizado */}
                        {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-zoom-in origin-top-right"
                                onClick={(e) => e.stopPropagation()}>

                                {/* --- GRUPO IMPORTAR --- */}
                                <div className="px-4 py-3 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                                    <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <FileUp size={14} className="text-blue-600 dark:text-blue-400" /> Importar (Entrada de datos)
                                    </span>
                                </div>

                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 transition-colors group">
                                    <Package size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    <span>Importar Productos</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 transition-colors group">
                                    <RefreshCw size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    <span>Actualización Masiva de Datos</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 transition-colors group">
                                    <FileDown size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    <span>Descargar Plantilla de Importación</span>
                                </button>

                                {/* --- GRUPO EXPORTAR --- */}
                                <div className="px-4 py-3 bg-gray-100 dark:bg-slate-800 border-y border-gray-200 dark:border-slate-700 mt-2">
                                    <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                        <Download size={14} className="text-green-600 dark:text-green-400" /> Exportar (Salida de datos)
                                    </span>
                                </div>

                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-3 transition-colors group">
                                    <FileSpreadsheet size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400" />
                                    <span>Exportar a Excel (.xlsx)</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-3 transition-colors group">
                                    <FileText size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400" />
                                    <span>Exportar a CSV</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 transition-colors group">
                                    <Filter size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    <span>Exportar Vista Actual</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 transition-colors group">
                                    <Database size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    <span>Exportar Todo el Inventario</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-3 transition-colors group">
                                    <Printer size={16} className="text-gray-400 dark:text-slate-500 group-hover:text-red-500" />
                                    <span>Exportar a PDF</span>
                                </button>

                            </div>
                        )}
                    </div>
                </div>

                {activeTab === 'inventory' ? (
                    <>
                        {/* Barra de Búsqueda y Filtros */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center flex-shrink-0 z-30">
                            {/* ... (anterior contenido de búsqueda y filtros) */}
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                                <input type="text" placeholder="Buscar por Nombre, SKU o Categoría..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-shadow bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                                    value={search} onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto relative">
                                <button onClick={(e) => {
                                    e.stopPropagation(); setShowFilterMenu(!showFilterMenu);
                                    setShowExportMenu(false); setShowColumnMenu(false);
                                }}
                                    className={`px-4 py-2 border rounded-lg flex items-center gap-2 text-sm flex-1 md:flex-none justify-center transition-colors ${activeFilterCount > 0 || showFilterMenu ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                                >
                                    <Filter size={16} />
                                    Filtros
                                    {activeFilterCount > 0 && <span className="bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">{activeFilterCount}</span>}
                                </button>

                                {/* Dropdown de Filtros Avanzados */}
                                {showFilterMenu && (
                                    <div className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 z-50 p-4 animate-zoom-in"
                                        onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                                                <ListFilter size={16} /> Filtrar Inventario
                                            </h3>
                                            {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium">Borrar todo</button>}
                                        </div>

                                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                            {/* Filtro: Categoría */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1.5">Categoría</label>
                                                <select
                                                    className="w-full text-sm border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                                    value={activeFilters.category} onChange={(e) => handleFilterChange('category', e.target.value)}
                                                >
                                                    <option value="">Todas las categorías</option>
                                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            </div>

                                            {/* Filtro: Estado */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1.5">Estado</label>
                                                <select
                                                    className="w-full text-sm border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                                    value={activeFilters.status} onChange={(e) => handleFilterChange('status', e.target.value)}
                                                >
                                                    <option value="">Todos</option>
                                                    <option value="active">Activo (Con Stock)</option>
                                                    <option value="low_stock">Bajo Stock (Crítico)</option>
                                                    <option value="out_of_stock">Sin Stock (Agotado)</option>
                                                </select>
                                            </div>

                                            {/* Filtro: Enlazado */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1.5">Integraciones</label>
                                                <select
                                                    className="w-full text-sm border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                                    value={activeFilters.linked} onChange={(e) => handleFilterChange('linked', e.target.value)}
                                                >
                                                    <option value="">Indiferente</option>
                                                    <option value="yes">Enlazado a Canales</option>
                                                    <option value="no">Sin Enlazar</option>
                                                </select>
                                            </div>

                                            {/* Filtro: Depósito */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase mb-1.5">Depósito</label>
                                                <select
                                                    className="w-full text-sm border-gray-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                                                    value={activeFilters.warehouse} onChange={(e) => handleFilterChange('warehouse', e.target.value)}
                                                >
                                                    <option value="">Todos los depósitos</option>
                                                    {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="relative">
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        setShowColumnMenu(!showColumnMenu); setShowFilterMenu(false);
                                        setShowExportMenu(false);
                                    }}
                                        className={`p-2 pl-3 pr-2 border rounded-lg flex items-center justify-center gap-1 transition-colors ${showColumnMenu ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}
                                        title="Configurar columnas"
                                    >
                                        <Columns size={18} />
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${showColumnMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Menú de Configuración de Columnas */}
                                    {showColumnMenu && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 z-50 p-4 animate-zoom-in"
                                            onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-slate-700 pb-2">
                                                <h3 className="font-bold text-gray-800 dark:text-slate-100 text-sm flex items-center gap-2">
                                                    <Columns size={14} /> Configurar Vista
                                                </h3>
                                                <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wider">Visible</span>
                                            </div>

                                            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                                                {columns.map((col, idx) => (
                                                    <div key={col.key} draggable onDragStart={(e) => handleDragStart(e, idx)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, idx)}
                                                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${col.visible ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500'} ${dragItemIndex === idx ? 'opacity-50 border border-dashed border-blue-300 bg-blue-50' : ''}`}
                                                        onClick={() => toggleColumn(col.key)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-gray-300 dark:text-slate-600 cursor-grab active:cursor-grabbing hover:text-blue-500">
                                                                <GripVertical size={14} />
                                                            </div>
                                                            <span className={`text-sm ${col.visible ? 'text-gray-700 dark:text-slate-300 font-medium' : 'text-gray-500 dark:text-slate-500'}`}>
                                                                {col.label}
                                                            </span>
                                                        </div>

                                                        {col.visible ? (
                                                            <Eye size={16} className="text-blue-600 dark:text-blue-400" />
                                                        ) : (
                                                            <EyeOff size={16} className="text-gray-300 dark:text-slate-600" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800">
                                                <button onClick={() => setColumns(DEFAULT_COLUMN_CONFIG)}
                                                    className="text-xs text-center w-full text-blue-600 hover:underline"
                                                >
                                                    Restaurar predeterminado
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* TABLA PRINCIPAL */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex-1 overflow-hidden flex flex-col relative">

                            {/* RENDER HEADER CONTEXTUAL */}
                            {renderTableHeader()}

                            <div className="overflow-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 dark:bg-slate-900 text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                                        <tr>
                                            {/* Checkbox Header */}
                                            <th className={`px-4 py-4 w-10 text-center ${selectedItems.size > 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/40' : 'bg-gray-50 dark:bg-slate-900'}`}>
                                                <input type="checkbox"
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    checked={filtered.length > 0 && selectedItems.size === filtered.length}
                                                    onChange={() => toggleSelectAll(filtered)}
                                                />
                                            </th>

                                            {columns.map((col) => {
                                                if (!col.visible) return null;

                                                if (col.sortable) {
                                                    return (
                                                        <SortableHeader key={col.key} label={col.label} sortKey={col.sortKey} currentSort={activeFilters.sort} onSort={handleSort}
                                                            className={`${col.className || ''} ${col.align === 'center' ? 'text-center' : ''} ${col.width || ''}`} />
                                                    );
                                                } else {
                                                    return (
                                                        <th key={col.key} className={`px-3 py-4 bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400 ${col.className || ''} ${col.align === 'center' ? 'text-center' : ''} ${col.width || ''}`}>
                                                            {col.label}
                                                        </th>
                                                    );
                                                }
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                                        {filtered.map(product => {
                                            const isSelected = selectedItems.has(product.id);
                                            return (
                                                <tr key={product.id} className={`transition-colors group ${isSelected ? 'bg-blue-50/60 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                                                    {/* Checkbox Row */}
                                                    <td className="px-4 py-3 text-center">
                                                        <input type="checkbox"
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                            checked={isSelected} onChange={() => toggleSelectItem(product.id)}
                                                        />
                                                    </td>

                                                    {columns.map(col => {
                                                        if (!col.visible) return null;
                                                        return (
                                                            <td key={col.key} className={`px-3 py-3 ${col.className || ''} ${col.align === 'center' ? 'text-center' : ''}`}>
                                                                {renderCell(col, product)}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex-shrink-0 border-t border-gray-100 dark:border-slate-800 p-4 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center text-sm text-gray-500 dark:text-slate-400">
                                <span>Mostrando {filtered.length} productos</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 border dark:border-slate-600 rounded bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>Anterior</button>
                                    <button className="px-3 py-1 border dark:border-slate-600 rounded bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <StockHistoryView />
                )}
            </div>

            {selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)}
                    onUpdate={onUpdateProduct}
                    categories={categories}
                    onAddCategory={onAddCategory}
                />
            )}

            {showBulkAutomationModal && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                                <Bot className="text-blue-600 dark:text-blue-400" size={20} /> Automatización Masiva
                            </h3>
                            <button onClick={() => setShowBulkAutomationModal(false)} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-0 space-y-0">
                            {/* TABS NAVIGATION */}
                            <div className="flex border-b border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30">
                                <button
                                    onClick={() => setActiveBulkTab('pause')}
                                    className={`flex-1 py-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${activeBulkTab === 'pause'
                                        ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                                        : 'border-transparent text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <Power size={16} /> Protección
                                </button>
                                <button
                                    onClick={() => setActiveBulkTab('visibility')}
                                    className={`flex-1 py-3 px-4 text-sm font-bold transition-all border-b-2 flex items-center justify-center gap-2 ${activeBulkTab === 'visibility'
                                        ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                                        : 'border-transparent text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
                                        }`}
                                >
                                    <Eye size={16} /> Visibilidad
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
                                    {activeBulkTab === 'pause'
                                        ? "Configura la protección de sobreventa para la selección."
                                        : "Configura el tope visual de stock para la selección."}
                                </p>

                                {activeBulkTab === 'pause' ? (
                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30 animate-slide-in">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                    <Power size={18} className="text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200">Pausa Automática</span>
                                                    <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium tracking-tight">Activa la regla en los productos</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setBulkAutoPauseEnabled(!bulkAutoPauseEnabled)}
                                                className="focus:outline-none transition-colors"
                                            >
                                                {bulkAutoPauseEnabled ? <ToggleRight size={32} className="text-blue-600 dark:text-blue-400" /> : <ToggleLeft size={32} className="text-gray-300 dark:text-slate-600" />}
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Pausar si stock físico menor a</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={bulkThreshold.toString()}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        setBulkThreshold(val === '' ? 0 : parseInt(val, 10));
                                                    }}
                                                    disabled={!bulkAutoPauseEnabled}
                                                    className={`w-full pl-4 pr-12 py-3 text-xl font-bold border rounded-xl shadow-inner transition-all outline-none ${bulkAutoPauseEnabled
                                                        ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900/50 text-gray-800 dark:text-slate-200 focus:border-blue-400'
                                                        : 'bg-gray-100 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed'
                                                        }`}
                                                />
                                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black tracking-widest ${bulkAutoPauseEnabled ? 'text-gray-400' : 'text-gray-200'}`}>UNID.</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-xl p-5 border border-orange-100 dark:border-orange-900/30 animate-slide-in">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                    <Eye size={18} className="text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200">Tope Visible</span>
                                                    <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium tracking-tight">Enmascaramiento de stock real</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setBulkMaxVisibleEnabled(!bulkMaxVisibleEnabled)}
                                                className="focus:outline-none transition-colors"
                                            >
                                                {bulkMaxVisibleEnabled ? <ToggleRight size={32} className="text-orange-600 dark:text-orange-400" /> : <ToggleLeft size={32} className="text-gray-300 dark:text-slate-600" />}
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest block">Mostrar como máximo</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={bulkMaxVisibleStock.toString()}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        setBulkMaxVisibleStock(val === '' ? 0 : parseInt(val, 10));
                                                    }}
                                                    disabled={!bulkMaxVisibleEnabled}
                                                    className={`w-full pl-4 pr-12 py-3 text-xl font-bold border rounded-xl shadow-inner transition-all outline-none ${bulkMaxVisibleEnabled
                                                        ? 'bg-white dark:bg-slate-800 border-orange-200 dark:border-orange-900/50 text-gray-800 dark:text-slate-200 focus:border-orange-400'
                                                        : 'bg-gray-100 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-gray-300 dark:text-slate-600 cursor-not-allowed'
                                                        }`}
                                                />
                                                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black tracking-widest ${bulkMaxVisibleEnabled ? 'text-gray-400' : 'text-gray-200'}`}>UNID.</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed px-1 pt-1">
                                                Si el stock real es mayor a este número, se mostrará este número. Si es menor, se muestra el real.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 flex gap-3 border-t border-gray-100 dark:border-slate-800">
                            <button
                                onClick={() => setShowBulkAutomationModal(false)}
                                className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={activeBulkTab === 'pause' ? handleApplyBulkRules : handleApplyBulkVisibilityRules}
                                className={`flex-[1.5] px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95 ${activeBulkTab === 'pause'
                                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                                    : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'
                                    }`}
                            >
                                Aplicar Reglas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
