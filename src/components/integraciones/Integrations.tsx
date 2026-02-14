import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle2, AlertCircle, X, ShieldCheck, Zap, Globe, Fuel, ExternalLink, Cloud, ShoppingCart, ShoppingBag, Truck, CreditCard, Mail } from 'lucide-react';

const INITIAL_INTEGRATIONS = [
    { id: 'mercadolibre', name: 'Mercado Libre', category: 'Marketplace', status: 'disconnected', description: 'Sincroniza stock, precios y gestiona tus ventas de MeLi directamente.', logo: 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__small.png' },
    { id: 'tiendanube', name: 'Tienda Nube', category: 'E-commerce', status: 'disconnected', description: 'Conecta tu tienda online líder en LATAM.', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-Mh-pWk-7lq6-9x8z8-7-8' },
    { id: 'fravega', name: 'Frávega Marketplace', category: 'Marketplace', status: 'disconnected', description: 'Publica y gestiona tus productos en uno de los retailers más grandes.', logo: 'https://www.fravega.com/favicon.ico' },
    { id: 'shell', name: 'Shell Marketplace', category: 'Marketplace', status: 'disconnected', description: 'Integra tu catálogo con el ecosistema de beneficios Shell.', logo: 'https://www.shell.com.ar/etc.clientlibs/shell/clientlibs/clientlib-site/resources/resources/favicons/favicon-32x32.png' },
    { id: 'falabella', name: 'Falabella', category: 'Marketplace', status: 'connected', description: 'Integra tu catálogo con el marketplace líder de Latinoamérica.', lastSync: 'Hace 5 min', logo: 'https://falabella.scene7.com/is/content/Falabella/favicon.ico' },
    { id: 'amazon', name: 'Amazon', category: 'Marketplace', status: 'disconnected', description: 'Vende en Amazon globalmente. Gestión de FBA y FBM centralizada.', logo: 'https://www.amazon.com/favicon.ico' },
    { id: 'shopify', name: 'Shopify', category: 'E-commerce', status: 'disconnected', description: 'La plataforma de comercio global.', logo: 'https://cdn.shopify.com/shopifycloud/brochure/assets/favicon-32x32-1ad49912c96c561584c264f33ae99b21f35bc900f074744d2d473489fe4c1537.png' },
    { id: 'correoar', name: 'Correo Argentino', category: 'Logística', status: 'disconnected', description: 'Generación de etiquetas de envío y tracking automático.', logo: 'https://www.correoargentino.com.ar/sites/default/files/favicon.ico' },
    { id: 'andreani', name: 'Andreani', category: 'Logística', status: 'disconnected', description: 'Gestión logística integral para tus envíos.', logo: 'https://www.andreani.com/favicon.ico' },
    { id: 'oca', name: 'OCA', category: 'Logística', status: 'disconnected', description: 'Envíos de paquetería con cobertura nacional.', logo: 'https://www.oca.com.ar/favicon.ico' },
    { id: 'nexoflex', name: 'NexoFlex', category: 'Logística', status: 'disconnected', description: 'Logística inteligente con entrega en el día.', logo: 'https://nexoflex.com.ar/favicon.ico' },
    { id: 'moova', name: 'Moova', category: 'Logística', status: 'disconnected', description: 'Tecnología de última milla para envíos rápidos.', logo: 'https://moova.io/favicon.ico' },
];

export const IntegrationsView = () => {
    const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todas');
    const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
    const [credentials, setCredentials] = useState({ field1: '', field2: '' });

    // Load from localStorage on mount
    useEffect(() => {
        const savedIntegrations = localStorage.getItem('erp_integrations');
        if (savedIntegrations) {
            try {
                const parsed = JSON.parse(savedIntegrations);
                setIntegrations(prev => prev.map(p => {
                    const saved = parsed.find((s: any) => s.id === p.id);
                    return saved ? { ...p, ...saved } : p;
                }));
            } catch (e) {
                console.error('Error parsing integrations from localStorage', e);
            }
        }
    }, []);

    // Reset credentials when modal opens
    useEffect(() => {
        if (selectedIntegration) {
            setCredentials({ field1: '', field2: '' });
        }
    }, [selectedIntegration]);

    const filteredIntegrations = integrations.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeFilter === 'Todas' || i.category === activeFilter;
        return matchesSearch && matchesCategory;
    });

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newStatus = { 
            status: 'connected', 
            lastSync: 'Recién',
            // In a real app, we wouldn't store credentials in plain text in localStorage
            // This is for simulation purposes as requested
            storedCredentials: credentials 
        };

        const updatedIntegrations = integrations.map(i => 
            i.id === selectedIntegration.id ? { ...i, ...newStatus } : i
        );
        
        setIntegrations(updatedIntegrations);
        
        // Persist to localStorage
        // We only save the status and credentials for connected integrations
        const savedData = updatedIntegrations
            .filter(i => i.status === 'connected')
            .map(({ id, status, lastSync, storedCredentials }: any) => ({ id, status, lastSync, storedCredentials }));
            
        localStorage.setItem('erp_integrations', JSON.stringify(savedData));
        
        setSelectedIntegration(null);
    };

    const handleDisconnect = () => {
        const updatedIntegrations = integrations.map(i => 
            i.id === selectedIntegration.id ? { ...i, status: 'disconnected', lastSync: undefined, storedCredentials: undefined } : i
        );
        
        setIntegrations(updatedIntegrations);
        
        const savedData = updatedIntegrations
            .filter(i => i.status === 'connected')
            .map(({ id, status, lastSync, storedCredentials }: any) => ({ id, status, lastSync, storedCredentials }));
            
        localStorage.setItem('erp_integrations', JSON.stringify(savedData));
        
        setSelectedIntegration(null);
    };

    const getFormConfig = (id: string) => {
        if (id === 'tiendanube') {
            return {
                label1: 'ID de la Tienda',
                placeholder1: 'Ej: 1234567',
                label2: 'Token de Acceso',
                placeholder2: 'Ej: 8a7b6c...',
                type2: 'text'
            };
        }
        return {
            label1: 'Client ID',
            placeholder1: '',
            label2: 'Secret Key',
            placeholder2: '••••••••••••',
            type2: 'password'
        };
    };

    const formConfig = selectedIntegration ? getFormConfig(selectedIntegration.id) : null;

    const categories = ['Todas', 'Marketplace', 'E-commerce', 'Logística'];

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Tag Header */}
            <div className="flex">
                <span className="px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-orange-600 border border-orange-200 bg-orange-50">
                    Integraciones
                </span>
            </div>

            {/* Title & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Conecta tus Canales</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Centraliza la operación de tu negocio en un solo lugar.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all cursor-pointer"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {filteredIntegrations.map(integration => (
                    <div
                        key={integration.id}
                        className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all relative flex flex-col justify-between h-full"
                    >
                        {/* Header Status */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 flex items-center justify-center p-1">
                                {integration.logo ? (
                                    <img
                                        src={integration.logo}
                                        alt={integration.name}
                                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=' + integration.name.charAt(0);
                                        }}
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-400">
                                        {integration.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end">
                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${integration.status === 'connected'
                                        ? 'bg-green-50 text-green-600 border-green-100'
                                        : 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700'
                                    }`}>
                                    {integration.status === 'connected' ? (
                                        <>
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Conectado
                                        </>
                                    ) : 'Desconectado'}
                                </div>
                                {integration.status === 'connected' && integration.lastSync && (
                                    <span className="text-[10px] text-slate-400 mt-1 font-medium italic">
                                        Sinc. {integration.lastSync}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{integration.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed min-h-[40px]">
                                {integration.description}
                            </p>
                        </div>

                        {/* Action */}
                        <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-800">
                            <button
                                onClick={() => setSelectedIntegration(integration)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${integration.status === 'connected'
                                        ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                                        : 'bg-[#f06428] text-white hover:bg-[#d8531e] hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-none'
                                    }`}
                            >
                                {integration.status === 'connected' ? 'Configurar' : 'Conectar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Conexión */}
            {selectedIntegration && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-zoom-in">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-100 flex items-center justify-center">
                                    <img src={selectedIntegration.logo} alt="" className="object-contain" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedIntegration.name}</h2>
                                    <p className="text-slate-500 text-sm">{selectedIntegration.status === 'connected' ? 'Configurar conexión actual' : 'Conecta tu cuenta'}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedIntegration(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8">
                            {selectedIntegration.status === 'disconnected' ? (
                                <form onSubmit={handleConnect} className="space-y-6">
                                    <div className="space-y-4 text-left">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                                {formConfig?.label1}
                                            </label>
                                            <input 
                                                required 
                                                type="text" 
                                                value={credentials.field1}
                                                onChange={(e) => setCredentials(prev => ({ ...prev, field1: e.target.value }))}
                                                placeholder={formConfig?.placeholder1}
                                                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-mono" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                                {formConfig?.label2}
                                            </label>
                                            <input 
                                                required 
                                                type={formConfig?.type2} 
                                                value={credentials.field2}
                                                onChange={(e) => setCredentials(prev => ({ ...prev, field2: e.target.value }))}
                                                placeholder={formConfig?.placeholder2}
                                                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-mono" 
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-[#f06428]/5 p-4 rounded-xl border border-orange-100 flex gap-3">
                                        <ShieldCheck size={20} className="text-[#f06428]" />
                                        <p className="text-xs text-[#f06428] font-medium leading-relaxed text-left">
                                            Tus datos de acceso están encriptados y protegidos según normativas de seguridad bancaria.
                                        </p>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-[#f06428] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#d8531e] transition-all">
                                        Confirmar Conexión
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="text-green-600" size={32} />
                                            <div className="text-left">
                                                <p className="text-green-800 font-bold uppercase text-xs tracking-wider">Servicio Activo</p>
                                                <p className="text-green-600 text-[10px] font-medium mt-0.5">Sincronización en tiempo real habilitada</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wide">Pausar Sincronización</button>
                                        <button onClick={handleDisconnect} className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all">Desvincular Canal</button>
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
