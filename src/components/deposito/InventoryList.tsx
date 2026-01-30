import React, { useState } from 'react';
import {
    Search,
    Plus,
    Warehouse,
    Layers,
    MapPin,
    Edit2,
    Trash2,
    Map
} from 'lucide-react';
import { ArrowLeft, Box, Package } from 'lucide-react';
import { NewDepositoModal, NewDivisionModal, NewRackModal, NewPalletModal, NewBoxModal, AddProductModal, PalletContentModal, BoxContentModal } from './InventoryModals';
import { INITIAL_DEPOSITOS, INITIAL_PRODUCTS } from '../../data/mocks';

interface Producto {
    id: string;
    nombre: string;
    sku: string;
    cantidad: number;
}

interface Caja {
    id: string;
    nombre: string;
    productos: Producto[];
}

interface Pallet {
    id: string;
    nombre: string;
    cajas: Caja[];
    productosSueltos: Producto[];
}

interface Rack {
    id: string;
    nombre: string;
    descripcion?: string;
    pallets: Pallet[];
    productosSueltos: Producto[];
}

interface Division {
    id: string;
    nombre: string;
    descripcion?: string;
    racks: Rack[];
}

interface Deposito {
    id: string;
    nombre: string;
    ciudad: string;
    provincia: string;
    direccion: string;
    divisiones: Division[];
}

export const InventoryList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [depositos, setDepositos] = useState<Deposito[]>(INITIAL_DEPOSITOS);
    const [selectedDepositoId, setSelectedDepositoId] = useState<string | null>(INITIAL_DEPOSITOS[0]?.id || null);

    // Modal states
    const [isNewDepositoOpen, setIsNewDepositoOpen] = useState(false);
    const [isNewDivisionOpen, setIsNewDivisionOpen] = useState(false);
    const [isNewRackOpen, setIsNewRackOpen] = useState(false);
    const [activeDivisionId, setActiveDivisionId] = useState<string | null>(null);
    const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
    const [selectedPalletId, setSelectedPalletId] = useState<string | null>(null);
    const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

    // Pallet/Box modals
    const [isNewPalletOpen, setIsNewPalletOpen] = useState(false);
    const [isNewBoxOpen, setIsNewBoxOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [targetForProduct, setTargetForProduct] = useState<{ type: 'rack' | 'pallet' | 'box', id: string } | null>(null);

    const handleCreateDeposito = (data: any) => {
        const newDeposito: Deposito = {
            id: Date.now().toString(),
            nombre: data.nombre,
            ciudad: data.ciudad,
            provincia: data.provincia,
            direccion: data.direccion,
            divisiones: []
        };
        setDepositos([...depositos, newDeposito]);
        setSelectedDepositoId(newDeposito.id);
    };

    const handleCreateDivision = (data: any) => {
        if (!selectedDepositoId) return;

        setDepositos(prev => prev.map(dep => {
            if (dep.id === selectedDepositoId) {
                return {
                    ...dep,
                    divisiones: [...dep.divisiones, {
                        id: Date.now().toString(),
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        racks: []
                    }]
                };
            }
            return dep;
        }));
    };

    const handleCreateRack = (data: any) => {
        if (!selectedDepositoId || !activeDivisionId) return;

        setDepositos(prev => prev.map(dep => {
            if (dep.id === selectedDepositoId) {
                return {
                    ...dep,
                    divisiones: dep.divisiones.map(div => {
                        if (div.id === activeDivisionId) {
                            return {
                                ...div,
                                racks: [...div.racks, {
                                    id: Date.now().toString(),
                                    nombre: data.nombre,
                                    descripcion: data.descripcion,
                                    pallets: [],
                                    productosSueltos: []
                                }]
                            };
                        }
                        return div;
                    })
                };
            }
            return dep;
        }));
    };

    const handleCreatePallet = (nombre: string) => {
        if (!selectedDepositoId || !activeDivisionId || !selectedRackId) return;

        setDepositos(prev => prev.map(dep => {
            if (dep.id === selectedDepositoId) {
                return {
                    ...dep,
                    divisiones: dep.divisiones.map(div => {
                        if (div.id === activeDivisionId) {
                            return {
                                ...div,
                                racks: div.racks.map(rack => {
                                    if (rack.id === selectedRackId) {
                                        return {
                                            ...rack,
                                            pallets: [...rack.pallets, {
                                                id: Date.now().toString(),
                                                nombre,
                                                cajas: [],
                                                productosSueltos: []
                                            }]
                                        };
                                    }
                                    return rack;
                                })
                            };
                        }
                        return div;
                    })
                };
            }
            return dep;
        }));
    };

    const handleCreateBox = (nombre: string) => {
        if (!selectedDepositoId || !activeDivisionId || !selectedRackId || !selectedPalletId) return;

        setDepositos(prev => prev.map(dep => {
            if (dep.id === selectedDepositoId) {
                return {
                    ...dep,
                    divisiones: dep.divisiones.map(div => {
                        if (div.id === activeDivisionId) {
                            return {
                                ...div,
                                racks: div.racks.map(rack => {
                                    if (rack.id === selectedRackId) {
                                        return {
                                            ...rack,
                                            pallets: rack.pallets.map(pallet => {
                                                if (pallet.id === selectedPalletId) {
                                                    return {
                                                        ...pallet,
                                                        cajas: [...pallet.cajas, {
                                                            id: Date.now().toString(),
                                                            nombre,
                                                            productos: []
                                                        }]
                                                    };
                                                }
                                                return pallet;
                                            })
                                        };
                                    }
                                    return rack;
                                })
                            };
                        }
                        return div;
                    })
                };
            }
            return dep;
        }));
    };

    const handleAddProduct = (data: { id: string, nombre: string, sku: string, cantidad: number }) => {
        if (!selectedDepositoId || !activeDivisionId || !selectedRackId || !targetForProduct) return;

        setDepositos(prev => prev.map(dep => {
            if (dep.id === selectedDepositoId) {
                return {
                    ...dep,
                    divisiones: dep.divisiones.map(div => {
                        if (div.id === activeDivisionId) {
                            return {
                                ...div,
                                racks: div.racks.map(rack => {
                                    if (rack.id === selectedRackId) {
                                        if (targetForProduct.type === 'rack') {
                                            const existing = rack.productosSueltos.find(p => p.sku === data.sku);
                                            if (existing) {
                                                return {
                                                    ...rack,
                                                    productosSueltos: rack.productosSueltos.map(p =>
                                                        p.sku === data.sku ? { ...p, cantidad: p.cantidad + data.cantidad } : p
                                                    )
                                                };
                                            }
                                            return {
                                                ...rack,
                                                productosSueltos: [...rack.productosSueltos, { ...data }]
                                            };
                                        }

                                        return {
                                            ...rack,
                                            pallets: rack.pallets.map(pallet => {
                                                if (pallet.id === targetForProduct.id || (targetForProduct.type === 'box' && pallet.cajas.some(c => c.id === targetForProduct.id))) {
                                                    if (targetForProduct.type === 'pallet') {
                                                        const existing = pallet.productosSueltos.find(p => p.sku === data.sku);
                                                        if (existing) {
                                                            return {
                                                                ...pallet,
                                                                productosSueltos: pallet.productosSueltos.map(p =>
                                                                    p.sku === data.sku ? { ...p, cantidad: p.cantidad + data.cantidad } : p
                                                                )
                                                            };
                                                        }
                                                        return {
                                                            ...pallet,
                                                            productosSueltos: [...pallet.productosSueltos, { ...data }]
                                                        };
                                                    } else if (targetForProduct.type === 'box') {
                                                        return {
                                                            ...pallet,
                                                            cajas: pallet.cajas.map(caja => {
                                                                if (caja.id === targetForProduct.id) {
                                                                    const existing = caja.productos.find(p => p.sku === data.sku);
                                                                    if (existing) {
                                                                        return {
                                                                            ...caja,
                                                                            productos: caja.productos.map(p =>
                                                                                p.sku === data.sku ? { ...p, cantidad: p.cantidad + data.cantidad } : p
                                                                            )
                                                                        };
                                                                    }
                                                                    return {
                                                                        ...caja,
                                                                        productos: [...caja.productos, { ...data }]
                                                                    };
                                                                }
                                                                return caja;
                                                            })
                                                        };
                                                    }
                                                }
                                                return pallet;
                                            })
                                        };
                                    }
                                    return rack;
                                })
                            };
                        }
                        return div;
                    })
                };
            }
            return dep;
        }));
    };

    const selectedDeposito = depositos.find(d => d.id === selectedDepositoId);
    const selectedDivision = selectedDeposito?.divisiones.find(div => div.id === activeDivisionId);
    const selectedRack = selectedDivision?.racks.find(rack => rack.id === selectedRackId);
    const selectedPallet = selectedRack?.pallets.find(p => p.id === selectedPalletId);
    const selectedBox = selectedPallet?.cajas.find(c => c.id === selectedBoxId);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 font-sans w-full">
            {/* Top Toolbar */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10 w-full">
                <div className="flex items-center gap-6 flex-1">
                    <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-sm font-bold border border-orange-100 dark:border-orange-900/30 shadow-sm whitespace-nowrap">
                        Gestión De Depósitos
                    </span>

                    <div className="relative flex-1 max-w-2xl ml-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar ubicación de producto..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 dark:focus:border-orange-800 transition-all text-sm placeholder:text-gray-300 dark:placeholder:text-slate-500 shadow-inner dark:shadow-none text-gray-900 dark:text-slate-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-6">
                    <button
                        onClick={() => setIsNewDepositoOpen(true)}
                        className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 border-2 border-dashed border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all font-black text-sm shadow-sm active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={20} /> Nuevo Depósito
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full h-[calc(100vh-140px)]">

                    {/* Left Column: Depósitos List */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <h2 className="text-xl font-black text-gray-900 dark:text-slate-100 tracking-tight">Mis Depósitos</h2>

                        {depositos.length === 0 ? (
                            <div className="flex-1 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 cursor-pointer">
                                <div className="w-20 h-20 mb-6 text-gray-200 dark:text-slate-600">
                                    <Warehouse size={80} strokeWidth={1} />
                                </div>
                                <p className="text-gray-400 dark:text-slate-500 font-bold tracking-tight text-base uppercase opacity-60">No hay depósitos activos.</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {depositos.map(deposito => (
                                    <div
                                        key={deposito.id}
                                        onClick={() => setSelectedDepositoId(deposito.id)}
                                        className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${selectedDepositoId === deposito.id
                                            ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/50 shadow-lg shadow-orange-500/5'
                                            : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800/30'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedDepositoId === deposito.id
                                                ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400'
                                                : 'bg-gray-50 dark:bg-slate-700 text-gray-400 dark:text-slate-400 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/10 group-hover:text-orange-500'
                                                }`}>
                                                <Warehouse size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-bold text-lg mb-1 transition-colors ${selectedDepositoId === deposito.id ? 'text-orange-900 dark:text-orange-100' : 'text-gray-900 dark:text-slate-200'
                                                    }`}>
                                                    {deposito.nombre}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-slate-500">
                                                    <MapPin size={12} />
                                                    {deposito.ciudad}, {deposito.provincia}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedDepositoId === deposito.id && (
                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-full" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Detail & Divisions */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col shadow-2xl shadow-gray-100/30 dark:shadow-black/30 h-full overflow-hidden">
                        {!selectedDeposito ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                                <div className="w-24 h-24 mb-6 text-gray-200 dark:text-slate-700">
                                    <Layers size={96} strokeWidth={1} />
                                </div>
                                <p className="text-gray-500 dark:text-slate-500 text-2xl font-black leading-tight tracking-tighter max-w-md">
                                    Seleccione o cree un depósito para gestionar su estructura.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight mb-1">Gestión de Divisiones</h2>
                                        <p className="text-gray-400 dark:text-slate-500 text-sm font-medium">Agregue divisiones y racks a <span className="text-orange-500">{selectedDeposito.nombre}</span>.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsNewDivisionOpen(true)}
                                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <Plus size={18} /> Agregar División
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                    {selectedRackId ? (
                                        // --- RACK DETAIL VIEW ---
                                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-center gap-4 mb-8">
                                                <button
                                                    onClick={() => setSelectedRackId(null)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 hover:text-orange-500 transition-all"
                                                >
                                                    <ArrowLeft size={24} />
                                                </button>
                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tighter">{selectedRack?.nombre}</h3>
                                                    <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">
                                                        {selectedDeposito.nombre} <span className="mx-1 opacity-30">&gt;</span> {selectedDivision?.nombre}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50/50 dark:bg-slate-800/20 border border-gray-100 dark:border-slate-800 rounded-3xl p-6">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-2xl">
                                                            <Layers size={22} />
                                                        </div>
                                                        <h4 className="text-lg font-black text-gray-900 dark:text-slate-200 tracking-tight">Pallets en Rack</h4>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setIsNewPalletOpen(true)}
                                                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                                                        >
                                                            <Map size={14} /> Agregar Pallet
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setTargetForProduct({ type: 'rack', id: selectedRackId! });
                                                                setIsAddProductOpen(true);
                                                            }}
                                                            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/10 transition-all active:scale-95"
                                                        >
                                                            <Plus size={14} /> Asignar Producto (Suelto)
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {selectedRack?.pallets.length === 0 ? (
                                                        <div className="border border-dashed border-gray-200 dark:border-slate-800 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                                            <p className="text-gray-400 dark:text-slate-600 font-bold uppercase tracking-tight text-xs">No hay pallets en este rack.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                            {selectedRack?.pallets.map(pallet => (
                                                                <div
                                                                    key={pallet.id}
                                                                    onClick={() => {
                                                                        setSelectedPalletId(pallet.id);
                                                                    }}
                                                                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-orange-500 transition-all cursor-pointer group"
                                                                >
                                                                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl text-gray-400 group-hover:text-orange-500 transition-colors">
                                                                        <Layers size={32} />
                                                                    </div>
                                                                    <p className="font-black text-gray-900 dark:text-slate-200 uppercase tracking-tighter">{pallet.nombre}</p>
                                                                    <div className="flex gap-2">
                                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-slate-700 px-2 py-0.5 rounded-full">{pallet.cajas.length} Cajas</span>
                                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-slate-700 px-2 py-0.5 rounded-full">{pallet.productosSueltos.length} Sueltos</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="mt-8">
                                                        <h5 className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">Productos Sueltos</h5>

                                                        <div className="space-y-3">
                                                            {selectedRack?.productosSueltos.length === 0 ? (
                                                                <div className="border border-dashed border-gray-200 dark:border-slate-800 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
                                                                    <p className="text-gray-400 dark:text-slate-600 font-medium text-sm">No hay productos sueltos en este rack.</p>
                                                                </div>
                                                            ) : (
                                                                selectedRack?.productosSueltos.map((prod: any) => (
                                                                    <div key={prod.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-3xl flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                                                                                <Package size={18} />
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <p className="font-black text-sm text-gray-900 dark:text-slate-200 uppercase tracking-tighter">{prod.nombre}</p>
                                                                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">ID: {prod.sku}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                                            Cant: {prod.cantidad}
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // --- DIVISIONS & RACKS LIST ---
                                        selectedDeposito.divisiones.length === 0 ? (
                                            <div className="h-40 flex items-center justify-center text-gray-400 dark:text-slate-600 italic">
                                                No hay divisiones configuradas.
                                            </div>
                                        ) : (
                                            selectedDeposito.divisiones.map(division => (
                                                <div key={division.id} className="bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800/50 rounded-[2rem] overflow-hidden transition-all hover:border-orange-200/50 dark:hover:border-slate-700">
                                                    <div className="p-5 flex items-center justify-between bg-white dark:bg-slate-800/40 border-b border-gray-50 dark:border-slate-800/30">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2.5 bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 rounded-xl">
                                                                <Map size={20} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-gray-900 dark:text-slate-200 uppercase tracking-tighter">{division.nombre}</h4>
                                                                {division.descripcion && (
                                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{division.descripcion}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-all">
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
                                                                <Trash2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setActiveDivisionId(division.id);
                                                                    setIsNewRackOpen(true);
                                                                }}
                                                                className="ml-2 px-4 py-2 bg-orange-600 text-white text-xs font-black uppercase rounded-xl hover:bg-orange-500 transition-all shadow-md active:scale-95 flex items-center gap-2"
                                                            >
                                                                <Plus size={16} /> Nuevo Rack
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="p-6">
                                                        {division.racks.length === 0 ? (
                                                            <p className="text-xs text-gray-300 dark:text-slate-700 font-bold uppercase tracking-widest ml-14">Sin racks registrados.</p>
                                                        ) : (
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-14">
                                                                {division.racks.map(rack => (
                                                                    <div
                                                                        key={rack.id}
                                                                        onClick={() => {
                                                                            setActiveDivisionId(division.id);
                                                                            setSelectedRackId(rack.id);
                                                                        }}
                                                                        className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-5 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/5 group"
                                                                    >
                                                                        <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-orange-500 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-all">
                                                                            <Layers size={24} />
                                                                        </div>
                                                                        <p className="font-black text-sm text-gray-900 dark:text-slate-300 uppercase tracking-tighter">{rack.nombre}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            <NewDepositoModal
                isOpen={isNewDepositoOpen}
                onClose={() => setIsNewDepositoOpen(false)}
                onSubmit={handleCreateDeposito}
            />
            <NewDivisionModal
                isOpen={isNewDivisionOpen}
                onClose={() => setIsNewDivisionOpen(false)}
                onSubmit={handleCreateDivision}
            />
            <NewRackModal
                isOpen={isNewRackOpen}
                onClose={() => setIsNewRackOpen(false)}
                onSubmit={handleCreateRack}
            />
            <NewPalletModal
                isOpen={isNewPalletOpen}
                onClose={() => setIsNewPalletOpen(false)}
                onSubmit={handleCreatePallet}
            />
            <PalletContentModal
                isOpen={!!selectedPalletId && !selectedBoxId}
                onClose={() => setSelectedPalletId(null)}
                pallet={selectedPallet}
                onAddBox={() => setIsNewBoxOpen(true)}
                onAddProduct={() => {
                    setTargetForProduct({ type: 'pallet', id: selectedPalletId! });
                    setIsAddProductOpen(true);
                }}
                onSelectBox={(boxId) => setSelectedBoxId(boxId)}
            />
            <BoxContentModal
                isOpen={!!selectedBoxId}
                onClose={() => setSelectedBoxId(null)}
                box={selectedBox}
                onAddProduct={() => {
                    setTargetForProduct({ type: 'box', id: selectedBoxId! });
                    setIsAddProductOpen(true);
                }}
            />
            <NewBoxModal
                isOpen={isNewBoxOpen}
                onClose={() => setIsNewBoxOpen(false)}
                onSubmit={handleCreateBox}
            />
            <AddProductModal
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onSubmit={handleAddProduct}
            />
        </div>
    );
};
