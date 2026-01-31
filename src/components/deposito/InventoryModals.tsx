import React, { useState } from 'react';
import { X, Plus, Minus, Box, Package, Layers, Search, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../../data/mocks';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#121212] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {children}
                </div>
                {footer && (
                    <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-[#161616]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Confirmation Modal ---
// Modal de confirmación genérico
export const ConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
    if (!isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10">
                        {cancelText}
                    </button>
                    <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20">
                        {confirmText}
                    </button>
                </>
            }
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-500">
                    <AlertTriangle size={24} />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
            </div>
        </BaseModal>
    );
};

// --- Modal Nuevo Depósito ---
interface NewDepositoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => boolean;
    initialData?: { nombre: string; ciudad: string; provincia: string; direccion: string } | null;
}

export const NewDepositoModal: React.FC<NewDepositoModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({ nombre: '', ciudad: '', provincia: '', direccion: '' });

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (isOpen) {
            setFormData({ nombre: '', ciudad: '', provincia: '', direccion: '' });
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit(formData)) {
            if (!initialData) setFormData({ nombre: '', ciudad: '', provincia: '', direccion: '' });
            onClose();
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Editar Almacén" : "Nuevo Almacén"}
            footer={
                <>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/20">
                        {initialData ? "Guardar Cambios" : "Guardar y Configurar"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Nombre (Ej: Depósito Norte)"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                        value={formData.nombre}
                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Ciudad"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                        value={formData.ciudad}
                        onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Provincia"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                        value={formData.provincia}
                        onChange={e => setFormData({ ...formData, provincia: e.target.value })}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Dirección"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                        value={formData.direccion}
                        onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                    />
                </div>
            </div>
        </BaseModal>
    );
};

// --- Modal Nueva División ---
interface NewDivisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => boolean;
    initialData?: { nombre: string; descripcion: string } | null;
}

export const NewDivisionModal: React.FC<NewDivisionModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (isOpen) {
            setFormData({ nombre: '', descripcion: '' });
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit(formData)) {
            if (!initialData) setFormData({ nombre: '', descripcion: '' });
            onClose();
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Editar División" : "Nueva División"}
            footer={
                <>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/20">
                        {initialData ? "Guardar Cambios" : "Crear División"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">Nombre</label>
                    <input
                        type="text"
                        placeholder="Ej: Materiales Pesados"
                        className="w-full bg-[#1a1a1a] border border-orange-500/50 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                        value={formData.nombre}
                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">Descripción (Opcional)</label>
                    <input
                        type="text"
                        placeholder="Ej: Para cementos y hierros..."
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                        value={formData.descripcion}
                        onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                </div>
            </div>
        </BaseModal>
    );
};

// --- Modal Nuevo Rack ---
interface NewRackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => boolean;
    initialData?: { nombre: string; descripcion: string } | null;
}

export const NewRackModal: React.FC<NewRackModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (isOpen) {
            setFormData({ nombre: '', descripcion: '' });
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit(formData)) {
            if (!initialData) setFormData({ nombre: '', descripcion: '' });
            onClose();
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Editar Rack" : "Nuevo Rack"}
            footer={
                <>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/20">
                        {initialData ? "Guardar Cambios" : "Crear Rack"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">Nombre / Código</label>
                    <input
                        type="text"
                        placeholder="Ej: Estantería A-1"
                        className="w-full bg-[#1a1a1a] border border-orange-500/50 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                        value={formData.nombre}
                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">Descripción (Opcional)</label>
                    <input
                        type="text"
                        placeholder="Ej: Para productos pequeños"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                        value={formData.descripcion}
                        onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                    />
                </div>
            </div>
        </BaseModal>
    );
};
// --- Modal Nuevo Pallet ---
export const NewPalletModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (nombre: string) => boolean; initialData?: { nombre: string } | null }> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [nombre, setNombre] = useState('');

    React.useEffect(() => {
        if (isOpen && initialData) {
            setNombre(initialData.nombre);
        } else if (isOpen) {
            setNombre('');
        }
    }, [isOpen, initialData]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Editar Pallet" : "Nuevo Pallet"}
            footer={
                <>
                    <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white border border-white/10 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            if (onSubmit(nombre)) {
                                if (!initialData) setNombre('');
                                onClose();
                            }
                        }}
                        className="px-6 py-2 rounded-xl text-sm font-black text-white bg-[#f06428] hover:bg-[#d8531e] transition-all shadow-lg shadow-orange-900/40"
                    >
                        {initialData ? "Guardar Cambios" : "Crear Pallet"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Nombre / Código de Pallet</label>
                    <input
                        type="text"
                        placeholder="Ej: Pallet #123"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f06428]/50 transition-all"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
        </BaseModal>
    );
};

// --- Modal Nueva Caja ---
export const NewBoxModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (nombre: string) => boolean; initialData?: { nombre: string } | null }> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [nombre, setNombre] = useState('');

    React.useEffect(() => {
        if (isOpen && initialData) {
            setNombre(initialData.nombre);
        } else if (isOpen) {
            setNombre('');
        }
    }, [isOpen, initialData]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Editar Caja" : "Nueva Caja"}
            footer={
                <>
                    <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white border border-white/10 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            if (onSubmit(nombre)) {
                                if (!initialData) setNombre('');
                                onClose();
                            }
                        }}
                        className="px-6 py-2 rounded-xl text-sm font-black text-white bg-[#f06428] hover:bg-[#d8531e] transition-all shadow-lg shadow-orange-900/40"
                    >
                        {initialData ? "Guardar Cambios" : "Crear Caja"}
                    </button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Nombre / Código de Caja</label>
                    <input
                        type="text"
                        placeholder="Ej: Caja A-101"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f06428]/50 transition-all"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
        </BaseModal>
    );
};

// --- Modal Contenido del Pallet ---
export const PalletContentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    pallet: any;
    onAddBox: () => void;
    onAddProduct: () => void;
    onSelectBox: (id: string) => void;
    onDelete: () => void;
    onEditBox: (boxId: string) => void;
    onDeleteBox: (boxId: string) => void;
}> = ({ isOpen, onClose, pallet, onAddBox, onAddProduct, onSelectBox, onDelete, onEditBox, onDeleteBox }) => {
    if (!isOpen || !pallet) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Contenido del Pallet: ${pallet.nombre}`}
            footer={
                <div className="flex w-full justify-between">
                    <button onClick={onDelete} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20">
                        Eliminar Pallet
                    </button>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10">
                        Cerrar
                    </button>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Cajas section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cajas en Pallet</label>
                        <button
                            onClick={onAddBox}
                            className="flex items-center gap-2 px-4 py-2 border border-[#f06428]/40 text-[#f06428] rounded-xl text-[10px] font-black uppercase hover:bg-[#f06428]/5 transition-all"
                        >
                            <Plus size={12} /> Agregar Caja
                        </button>
                    </div>

                    <div className="space-y-2">
                        {(!pallet.cajas || pallet.cajas.length === 0) ? (
                            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-center italic text-gray-600 text-xs">
                                No hay cajas creadas en este pallet.
                            </div>
                        ) : (
                            pallet.cajas.map((caja: any) => (
                                <div
                                    key={caja.id}
                                    className="bg-[#1a1a1a] border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-orange-500/30 transition-all"
                                >
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer flex-1"
                                        onClick={() => onSelectBox(caja.id)}
                                    >
                                        <div className="text-orange-500">
                                            <Box size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-sm text-white uppercase tracking-tighter">{caja.nombre}</p>
                                            <p className="text-[10px] font-bold text-gray-500 lowercase">{caja.productos.length} productos</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onEditBox(caja.id); }}
                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteBox(caja.id); }}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div onClick={() => onSelectBox(caja.id)} className="cursor-pointer">
                                            <ArrowRight size={14} className="text-gray-700 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Productos Sueltos section */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block">Productos Sueltos</label>
                    <div className="space-y-2">
                        {(!pallet.productosSueltos || pallet.productosSueltos.length === 0) ? (
                            <div className="border border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center">
                                <div className="text-gray-700">
                                    <Package size={32} />
                                </div>
                                <p className="text-gray-500 text-xs font-medium">Pallet vacío de productos sueltos</p>
                            </div>
                        ) : (
                            pallet.productosSueltos.map((prod: any) => (
                                <div key={prod.id} className="bg-[#1a1a1a] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center">
                                            <Package size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-sm text-white uppercase tracking-tighter">{prod.nombre}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">SKU: {prod.sku}</p>
                                        </div>
                                    </div>
                                    <div className="bg-orange-600/20 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black">
                                        x{prod.cantidad}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <button
                        onClick={onAddProduct}
                        className="w-full py-3 bg-[#f06428] text-white rounded-xl font-black text-xs uppercase tracking-[0.1em] hover:bg-[#d8531e] transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Agregar Producto Suelto
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

// --- Modal Contenido de la Caja ---
export const BoxContentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    box: any;
    onAddProduct: () => void;
    onDelete: () => void;
}> = ({ isOpen, onClose, box, onAddProduct, onDelete }) => {
    if (!isOpen || !box) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Contenido de la Caja: ${box.nombre}`}
            footer={
                <div className="flex w-full justify-between">
                    <button onClick={onDelete} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-900/20">
                        Eliminar Caja
                    </button>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/10">
                        Cerrar
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 block">Productos en Caja</label>
                    <div className="space-y-2">
                        {(!box.productos || box.productos.length === 0) ? (
                            <div className="bg-black/20 border border-white/5 rounded-2xl p-8 text-center italic text-gray-600 text-xs">
                                Esta caja está vacía.
                            </div>
                        ) : (
                            box.productos.map((prod: any) => (
                                <div key={prod.id} className="bg-[#1a1a1a] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center">
                                            <Package size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-sm text-white uppercase tracking-tighter">{prod.nombre}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">SKU: {prod.sku}</p>
                                        </div>
                                    </div>
                                    <div className="bg-orange-600/20 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black">
                                        x{prod.cantidad}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <button
                        onClick={onAddProduct}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-black text-xs uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Añadir Producto a Caja
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

// --- Modal Agregar Producto ---
export const AddProductModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { id: string, nombre: string, sku: string, cantidad: number, source?: { type: 'unassigned' | 'location', locationId?: string, locationName?: string } }) => void;
    depositos?: any[];
}> = ({ isOpen, onClose, onSubmit, depositos = [] }) => {
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [cantidad, setCantidad] = useState(1);
    const [showResults, setShowResults] = useState(false);
    
    // Logic for sources
    const [selectedSource, setSelectedSource] = useState<{ type: 'unassigned' | 'location', locationId?: string, locationName?: string, available: number } | null>(null);
    const [availableSources, setAvailableSources] = useState<{ type: 'unassigned' | 'location', locationId?: string, locationName?: string, available: number }[]>([]);

    const products = INITIAL_PRODUCTS;
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase())
    );

    // Calculate sources when product is selected
    React.useEffect(() => {
        if (!selectedProduct) {
            setAvailableSources([]);
            setSelectedSource(null);
            return;
        }

        let assignedCount = 0;
        const locations: { type: 'location', locationId: string, locationName: string, available: number }[] = [];

        // Traverse depositos to find assignments
        depositos.forEach(dep => {
            dep.divisiones.forEach((div: any) => {
                div.racks.forEach((rack: any) => {
                    // Rack products
                    rack.productosSueltos.forEach((p: any) => {
                        if (p.sku === selectedProduct.id || p.sku === selectedProduct.sku) {
                            assignedCount += p.cantidad;
                            locations.push({
                                type: 'location',
                                locationId: rack.id,
                                locationName: `${dep.nombre} > ${rack.nombre} (Rack)`,
                                available: p.cantidad
                            });
                        }
                    });

                    rack.pallets.forEach((pallet: any) => {
                        // Pallet products
                        pallet.productosSueltos.forEach((p: any) => {
                            if (p.sku === selectedProduct.id || p.sku === selectedProduct.sku) {
                                assignedCount += p.cantidad;
                                locations.push({
                                    type: 'location',
                                    locationId: pallet.id,
                                    locationName: `${dep.nombre} > ${pallet.nombre} (Pallet)`,
                                    available: p.cantidad
                                });
                            }
                        });

                        // Box products
                        pallet.cajas?.forEach((caja: any) => {
                            caja.productos.forEach((p: any) => {
                                if (p.sku === selectedProduct.id || p.sku === selectedProduct.sku) {
                                    assignedCount += p.cantidad;
                                    locations.push({
                                        type: 'location',
                                        locationId: caja.id,
                                        locationName: `${dep.nombre} > ${caja.nombre} (Caja)`,
                                        available: p.cantidad
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });

        const unassigned = Math.max(0, selectedProduct.stock - assignedCount);
        const sources: any[] = [];
        
        if (unassigned > 0) {
            sources.push({ type: 'unassigned', locationName: 'Stock Libre / No Asignado', available: unassigned });
        }
        
        sources.push(...locations);
        setAvailableSources(sources);
        
        // Auto-select first available source
        if (sources.length > 0) {
            setSelectedSource(sources[0]);
        }

    }, [selectedProduct, depositos]);

    // Update max stock based on selected source
    const maxStock = selectedSource ? selectedSource.available : (selectedProduct ? selectedProduct.stock : 1);

    const adjustCantidad = (val: number) => {
        setCantidad(prev => Math.max(1, Math.min(maxStock, prev + val)));
    };

    const handleSelect = (p: any) => {
        setSelectedProduct(p);
        setSearch(p.name);
        setCantidad(1);
        setShowResults(false);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Añadir Producto">
            <div className="space-y-6">
                {/* Search & Selection */}
                <div className="relative">
                    <div className={`bg-[#1a1a1a] border ${selectedProduct ? 'border-orange-500/50 shadow-[0_0_15px_rgba(240,100,40,0.1)]' : 'border-white/5'} rounded-2xl p-5 transition-all`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 ${selectedProduct ? 'bg-orange-500 text-white' : 'bg-orange-500/10 text-orange-500'} rounded-xl flex items-center justify-center transition-colors`}>
                                <Search size={18} />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Buscar en inventario..."
                                    className="w-full bg-transparent border-none text-sm text-white placeholder-gray-600 focus:outline-none"
                                    value={search}
                                    onChange={e => {
                                        setSearch(e.target.value);
                                        setShowResults(true);
                                        if (selectedProduct) setSelectedProduct(null);
                                    }}
                                    onFocus={() => setShowResults(true)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU / ID</span>
                                <span className="text-xs text-orange-500 font-bold min-h-[1.25rem]">
                                    {selectedProduct ? selectedProduct.id : search ? 'Buscando...' : '-'}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-gray-500 uppercase block">Disponibilidad en Stock</span>
                                <span className={`text-xs font-bold ${selectedProduct?.stock > 0 ? 'text-green-500' : 'text-gray-600'}`}>
                                    {selectedProduct ? `${selectedProduct.stock} unidades` : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Results Dropdown */}
                    {showResults && search.length > 0 && !selectedProduct && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-[60] max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredProducts.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-xs italic">No se encontraron productos</div>
                            ) : (
                                filteredProducts.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => handleSelect(p)}
                                        className="p-4 border-b border-white/5 last:border-none hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-800">
                                                {p.imgUrl ? <img src={p.imgUrl} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-2 text-gray-600" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white group-hover:text-orange-500 transition-colors">{p.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-black">{p.id}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400">STOCK: {p.stock}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Source Selection - ONLY if product selected */}
                {selectedProduct && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                         <label className="block text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Fuente de Origen</label>
                         <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                            {availableSources.length === 0 ? (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                                    <p className="text-red-400 text-xs font-bold">Sin stock disponible para asignar.</p>
                                </div>
                            ) : (
                                availableSources.map((source, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => {
                                            setSelectedSource(source);
                                            setCantidad(1); // Reset quantity on source change
                                        }}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                            selectedSource === source 
                                            ? 'bg-orange-500/10 border-orange-500 text-white' 
                                            : 'bg-[#1a1a1a] border-white/5 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${source.type === 'unassigned' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                            <div className="text-xs font-bold">{source.locationName}</div>
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md">
                                            Disp: {source.available}
                                        </div>
                                    </div>
                                ))
                            )}
                         </div>
                    </div>
                )}

                {/* Quantity Selector */}
                <div className={`py-4 space-y-8 transition-opacity duration-300 ${selectedProduct && selectedSource ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                    <label className="block text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Seleccionar Cantidad</label>

                    <div className="flex items-center justify-center gap-8">
                        <button
                            onClick={() => adjustCantidad(-1)}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all active:scale-90"
                        >
                            <Minus size={24} />
                        </button>

                        <div className="text-5xl font-black text-white w-24 text-center tracking-tighter">
                            {cantidad}
                        </div>

                        <button
                            onClick={() => adjustCantidad(1)}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all active:scale-90"
                        >
                            <Plus size={24} />
                        </button>
                    </div>

                    <div className="px-4 space-y-2">
                        <div className="relative h-1.5 bg-white/10 rounded-full">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                                style={{ width: `${maxStock > 1 ? ((cantidad - 1) / (maxStock - 1)) * 100 : 100}%` }}
                            />
                            <input
                                type="range"
                                min="1"
                                max={maxStock}
                                value={cantidad}
                                onChange={(e) => setCantidad(parseInt(e.target.value))}
                                className="absolute -top-1.5 left-0 w-full h-4 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            <span>Mín: 1</span>
                            <span>Máx Disponible: {maxStock}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 border border-white/10 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={!selectedProduct || !selectedSource}
                        onClick={() => {
                            if (selectedProduct && selectedSource) {
                                onSubmit({
                                    id: selectedProduct.id,
                                    nombre: selectedProduct.name,
                                    sku: selectedProduct.id,
                                    cantidad: cantidad,
                                    source: selectedSource
                                });
                                setSelectedProduct(null);
                                setSearch('');
                                setCantidad(1);
                                onClose();
                            }
                        }}
                        className={`flex-[1.5] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all shadow-xl ${selectedProduct && selectedSource
                            ? 'bg-[#f06428] text-white hover:bg-[#d8531e] shadow-orange-950/20'
                            : 'bg-white/5 text-gray-600 grayscale cursor-not-allowed'
                            }`}
                    >
                        {selectedSource?.type === 'unassigned' ? 'Confirmar Asignación' : 'Confirmar Movimiento'}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
};

const ArrowRight = ({ size, className }: { size: number; className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m9 18 6-6-6-6" />
    </svg>
);
