import React, { useState } from 'react';
import {
    ShoppingBag,
    Globe,
    Store,
    Link as LinkIcon,
    Zap,
    Bike,
    Truck,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Settings,
    Unlink,
    Power,
    RefreshCw,
    Clock,
    Box,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';

interface Channel {
    id: string;
    platform: string;
    status: string;
    externalId: string;
    title: string;
    permalink: string;
    priceOverride?: number;
    bufferStock: number;
    autoPauseEnabled?: boolean;
    maxVisibleStock?: number;
    maxVisibleEnabled?: boolean;
    lastSync: string;
    shippingType: string;
}

interface SyncChannelCardProps {
    channel: Channel;
    generalPrice: number;
    onUpdate?: (id: string, updatedChannel: Channel) => void;
}

export const SyncChannelCard: React.FC<SyncChannelCardProps> = ({ channel, generalPrice, onUpdate }) => {
    const [expanded, setExpanded] = useState(false);
    const [localChannel, setLocalChannel] = useState({
        ...channel,
        maxVisibleStock: channel.maxVisibleStock || 0,
        maxVisibleEnabled: channel.maxVisibleEnabled || false
    });

    const getPlatformConfig = (platform: string) => {
        switch (platform) {
            case 'MercadoLibre': return { icon: ShoppingBag, color: 'text-yellow-600', bg: 'bg-yellow-50' };
            case 'WooCommerce': return { icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' };
            case 'Fravega': return { icon: Store, color: 'text-indigo-600', bg: 'bg-indigo-50' };
            default: return { icon: LinkIcon, color: 'text-gray-600', bg: 'bg-gray-50' };
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active': return { label: 'Activa', color: 'bg-green-100 text-green-700 border-green-200', border: 'border-l-green-500' };
            case 'paused': return { label: 'Pausada', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', border: 'border-l-yellow-500' };
            case 'auto_paused': return { label: 'Pausado (Auto)', color: 'bg-orange-100 text-orange-700 border-orange-200', border: 'border-l-orange-500' };
            case 'closed': return { label: 'Finalizada', color: 'bg-red-100 text-red-700 border-red-200', border: 'border-l-red-500' };
            case 'error': return { label: 'Error Sync', color: 'bg-orange-100 text-orange-700 border-orange-200', border: 'border-l-orange-500' };
            default: return { label: 'Desc.', color: 'bg-gray-100 text-gray-700', border: 'border-l-gray-300' };
        }
    };

    const ShippingBadge = ({ type }: { type: string }) => {
        if (!type) return null;
        switch (type) {
            case 'full':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 flex items-center gap-1 border border-green-200">
                    <Zap size={10} fill="currentColor" /> FULL
                </span>;
            case 'flex':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1 border border-yellow-200">
                    <Bike size={10} /> FLEX
                </span>;
            case 'me2':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 flex items-center gap-1 border border-blue-200">
                    <Truck size={10} /> ENVÍOS
                </span>;
            default:
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 flex items-center gap-1 border border-gray-200">
                    <Truck size={10} /> {type.toUpperCase()}
                </span>;
        }
    };

    const config = getPlatformConfig(localChannel.platform);
    const statusConfig = getStatusConfig(localChannel.status);
    const PlatformIcon = config.icon;

    const handleTogglePause = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = localChannel.status === 'active' ? 'paused' : 'active';
        const updated = { ...localChannel, status: newStatus };
        setLocalChannel(updated);
        onUpdate && onUpdate(localChannel.id, updated);
    };

    const handleBufferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const newVal = rawValue === '' ? 0 : parseInt(rawValue, 10);
        const updated = { ...localChannel, bufferStock: newVal };
        setLocalChannel(updated);
        onUpdate && onUpdate(localChannel.id, updated);
    };

    const handleToggleAutoPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = { ...localChannel, autoPauseEnabled: !localChannel.autoPauseEnabled };
        setLocalChannel(updated);
        onUpdate && onUpdate(localChannel.id, updated);
    };

    const handleMaxVisibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const newVal = rawValue === '' ? 0 : parseInt(rawValue, 10);
        const updated = { ...localChannel, maxVisibleStock: newVal };
        setLocalChannel(updated);
        onUpdate && onUpdate(localChannel.id, updated);
    };

    const handleToggleMaxVisible = (e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = { ...localChannel, maxVisibleEnabled: !localChannel.maxVisibleEnabled };
        setLocalChannel(updated);
        onUpdate && onUpdate(localChannel.id, updated);
    };

    const handleForceSync = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Trigger sync logic
    };

    return (
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4 transition-all ${statusConfig.border} border-l-[6px]`}>
            {/* Header / Clickable Area */}
            <div
                className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${config.bg} shadow-sm`}>
                        <PlatformIcon size={24} className={config.color} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                            {localChannel.platform}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1.5 ${statusConfig.color} border shadow-xs`}>
                                {localChannel.status === 'active' && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                                {statusConfig.label}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono tracking-tight uppercase">
                                {localChannel.externalId}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href={localChannel.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={20} />
                    </a>
                    <div className="p-1 text-gray-400">
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {/* Accordion Content */}
            {expanded && (
                <div className="px-6 pb-6 pt-2 animate-slide-in">
                    <div className="flex flex-col gap-5">
                        {/* Title Section */}
                        <div>
                            <div className="flex justify-between items-center mb-2.5">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">{`Título en ${localChannel.platform}`}</label>
                                <ShippingBadge type={localChannel.shippingType} />
                            </div>
                            <p className="text-sm font-semibold text-gray-800 leading-relaxed px-1">
                                {localChannel.title}
                            </p>
                        </div>

                        {/* Price Row */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Settings size={16} className="text-blue-500" />
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">Venta y Precio</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Precio en Plataforma</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                                        <input
                                            type="text"
                                            value={localChannel.priceOverride || generalPrice}
                                            disabled
                                            className="w-full pl-7 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 text-gray-600 rounded-lg font-bold shadow-inner cursor-default"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 hidden sm:block">
                                    <p className="text-xs text-gray-400 leading-relaxed pt-5">Este es el precio final que ven tus clientes en la plataforma después de sincronizar.</p>
                                </div>
                            </div>
                        </div>

                        {/* Automation Rules Row */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Box size={16} className="text-orange-500" />
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">Reglas de Stock / Automatización</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Auto-Pause Block */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pausa Automática</label>
                                        <button
                                            onClick={handleToggleAutoPause}
                                            className="focus:outline-none transition-colors cursor-pointer leading-none"
                                        >
                                            {localChannel.autoPauseEnabled ?
                                                <ToggleRight size={28} className="text-blue-600" /> :
                                                <ToggleLeft size={28} className="text-slate-600" />
                                            }
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={localChannel.bufferStock.toString()}
                                            onChange={handleBufferChange}
                                            disabled={!localChannel.autoPauseEnabled}
                                            className={`w-full pl-3 pr-12 py-2.5 text-sm border transition-all rounded-lg font-bold shadow-inner outline-none ${localChannel.autoPauseEnabled
                                                    ? 'bg-gray-50/50 border-gray-200 text-gray-700 focus:border-blue-400'
                                                    : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                                                }`}
                                        />
                                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest ${localChannel.autoPauseEnabled ? 'text-gray-400' : 'text-gray-200'}`}>MIN.</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium px-1">Pausa la publicación si el stock baja de este nivel.</p>
                                </div>

                                {/* Max Visible Block */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tope Visible</label>
                                        <button
                                            onClick={handleToggleMaxVisible}
                                            className="focus:outline-none transition-colors cursor-pointer leading-none"
                                        >
                                            {localChannel.maxVisibleEnabled ?
                                                <ToggleRight size={28} className="text-blue-600" /> :
                                                <ToggleLeft size={28} className="text-slate-600" />
                                            }
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={localChannel.maxVisibleStock?.toString() || "0"}
                                            onChange={handleMaxVisibleChange}
                                            disabled={!localChannel.maxVisibleEnabled}
                                            className={`w-full pl-3 pr-12 py-2.5 text-sm border transition-all rounded-lg font-bold shadow-inner outline-none ${localChannel.maxVisibleEnabled
                                                    ? 'bg-gray-50/50 border-gray-200 text-gray-700 focus:border-blue-400'
                                                    : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                                                }`}
                                        />
                                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest ${localChannel.maxVisibleEnabled ? 'text-gray-400' : 'text-gray-200'}`}>MÁX.</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium px-1">Muestra esta cantidad aunque tengas más en stock.</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions BAR */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                <Clock size={16} className="text-gray-300" />
                                <span>Sync: {localChannel.lastSync}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                    <RefreshCw size={20} strokeWidth={2.5} />
                                </button>

                                <button
                                    onClick={handleTogglePause}
                                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black transition-all border-2 ${localChannel.status === 'active'
                                        ? 'border-yellow-400/30 text-yellow-700 bg-yellow-400/5 hover:bg-yellow-400/10 active:scale-95'
                                        : 'border-green-400/30 text-green-700 bg-green-400/5 hover:bg-green-400/10 active:scale-95'
                                        }`}
                                >
                                    <Power size={18} strokeWidth={2.5} />
                                    {localChannel.status === 'active' ? 'Pausar' : 'Activar'}
                                </button>

                                <button
                                    onClick={handleForceSync}
                                    className="flex items-center gap-2.5 px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                >
                                    <RefreshCw size={18} strokeWidth={2.5} />
                                    Forzar Sync
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
