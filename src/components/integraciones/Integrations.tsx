import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, AlertCircle, ChevronDown, Check, X, ShieldCheck, Zap, Globe, Fuel } from 'lucide-react';

const INITIAL_INTEGRATIONS = [
    { id: 'mercadolibre', name: 'Mercado Libre', initials: 'ME', logo: 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__small.png', category: 'marketplace', status: 'disconnected', description: 'Sincroniza stock y precios automáticamente.' },
    { id: 'tiendanube', name: 'Tienda Nube', initials: 'TI', logo: '', category: 'ecommerce', status: 'disconnected', description: 'Conecta tu tienda online para gestionar pedidos.' },
    { id: 'fravega', name: 'Frávega', initials: 'FR', logo: '', category: 'marketplace', status: 'disconnected', description: 'Publica productos en el marketplace de Frávega.' },
    { id: 'shell', name: 'Shell Box', initials: 'SH', logo: '', category: 'gas_station', status: 'connected', description: 'Gestión integrada de surtidores y ventas.' },
    { id: 'ypf', name: 'YPF Full', initials: 'YP', logo: '', category: 'gas_station', status: 'disconnected', description: 'Control de inventario de tienda y combustible.' },
    { id: 'axion', name: 'Axion Energy', initials: 'AX', logo: '', category: 'gas_station', status: 'disconnected', description: 'Integración de surtidores y fidelidad.' },
    { id: 'shopify', name: 'Shopify', initials: 'SP', logo: '', category: 'ecommerce', status: 'connected', description: 'E-commerce global líder sincronizado.' },
];

export const IntegrationsView = () => {
    const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

    // Filter logic
    const filteredIntegrations = integrations.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeFilter === 'all' || i.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        setIntegrations(prev => prev.map(i => i.id === selectedIntegration.id ? { ...i, status: 'connected' } : i));
        setSelectedIntegration(null);
    };

    const handleDisconnect = () => {
        setIntegrations(prev => prev.map(i => i.id === selectedIntegration.id ? { ...i, status: 'disconnected' } : i));
        setSelectedIntegration(null);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'marketplace': return <Globe size={18} />;
            case 'ecommerce': return <Zap size={18} />;
            case 'gas_station': return <Fuel size={18} />;
            default: return <Filter size={18} />;
        }
    };

    const categories = [
        { id: 'all', label: 'Todos' },
        { id: 'marketplace', label: 'Marketplaces' },
        { id: 'ecommerce', label: 'Ecommerce' },
        { id: 'gas_station', label: 'Estaciones' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Centro de Integraciones</h1>
                    <p className="text-gray-500 font-medium">Conecta tu negocio con los principales servicios del mercado.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeFilter === cat.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Metadata Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar integración por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                </div>
                <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 flex items-center gap-3 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Activas</span>
                        <span className="text-xl font-black text-blue-900 leading-none">
                            {integrations.filter(i => i.status === 'connected').length} Integraciones
                        </span>
                    </div>
                </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map(integration => (
                    <div
                        key={integration.id}
                        onClick={() => setSelectedIntegration(integration)}
                        className="group bg-white rounded-3xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer relative overflow-hidden"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${integration.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${integration.status === 'connected' ? 'text-green-600' : 'text-gray-400'}`}>
                                {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                            </span>
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border ${integration.status === 'connected' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'
                                }`}>
                                {integration.logo ? (
                                    <img src={integration.logo} alt={integration.name} className="w-10 object-contain" />
                                ) : (
                                    integration.initials
                                )}
                            </div>
                            <div className="flex-1 mt-1">
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors tracking-tight">{integration.name}</h3>
                                <div className="flex items-center gap-1 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                                    {getCategoryIcon(integration.category)}
                                    {integration.category.replace('_', ' ')}
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                            {integration.description}
                        </p>

                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <ShieldCheck size={14} className="text-blue-500" />
                                API Certificada
                            </div>
                            <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${integration.status === 'connected' ? 'bg-gray-50 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600' : 'bg-blue-600 text-white group-hover:shadow-lg group-hover:shadow-blue-100'
                                }`}>
                                {integration.status === 'connected' ? 'Configurar' : 'Conectar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Conexión */}
            {selectedIntegration && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border ${selectedIntegration.status === 'connected' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'
                                    }`}>
                                    {selectedIntegration.logo ? (
                                        <img src={selectedIntegration.logo} alt={selectedIntegration.name} className="w-12 object-contain" />
                                    ) : (
                                        selectedIntegration.initials
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedIntegration.name}</h2>
                                    <p className="text-gray-500 font-medium">Configuración de comunicación API</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedIntegration(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 pt-4">
                            {selectedIntegration.status === 'disconnected' ? (
                                <form onSubmit={handleConnect} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Client ID</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ej: ML_82371923"
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Client Secret</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="••••••••••••••••"
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 text-amber-800">
                                        <AlertCircle size={20} className="flex-shrink-0" />
                                        <p className="text-xs font-medium leading-relaxed">
                                            Al conectar, autorizas a <strong>MiSistema ERP</strong> a leer y modificar datos en tu cuenta de {selectedIntegration.name}.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedIntegration(null)}
                                            className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95"
                                        >
                                            Conectar Ahora
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl border border-green-200 flex items-center justify-center text-green-600">
                                                <CheckCircle2 size={28} />
                                            </div>
                                            <div>
                                                <p className="text-green-800 font-black text-sm uppercase tracking-wider leading-none">Conexión Activa</p>
                                                <p className="text-green-600 text-xs font-medium">Sincronizado hace 2 minutos</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                            <span className="text-sm font-bold text-gray-500">ID de Conexión</span>
                                            <span className="text-sm font-mono text-gray-900">CON_X902_ALPHA</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                            <span className="text-sm font-bold text-gray-500">Último Evento</span>
                                            <span className="text-sm font-medium text-gray-900 italic font-mono">STOCK_SYNC_SUCCESS</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 pt-2">
                                        <button
                                            onClick={() => setSelectedIntegration(null)}
                                            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
                                        >
                                            Guardar Cambios
                                        </button>
                                        <button
                                            onClick={handleDisconnect}
                                            className="w-full py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <AlertCircle size={18} />
                                            Desconectar Cuenta
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
