import React, { useState } from 'react';
import {
    Clock,
    Edit,
    Save,
    X,
    AlertTriangle,
    Plus,
    Check,
    CheckCircle,
    Image as ImageIcon
} from 'lucide-react';
import { Card } from '../ui/Card';
import { DataRow } from '../ui/DataRow';
import { SyncChannelCard } from "../integraciones/SyncChannelCard";

interface Product {
    id: string;
    name: string;
    alias: string;
    category: string;
    stock: number;
    committed: number;
    minStock: number;
    ean: string;
    brand: string;
    model: string;
    color: string;
    measures: string;
    tags: string;
    description: string;
    lastUpdated: string;
    cost: number;
    price: number;
    imgUrl?: string | null;
    channels?: any[];
    syncStatus?: any;
}

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onUpdate: (originalId: string, updatedProduct: Product) => void;
    categories: string[];
    onAddCategory: (newCat: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onUpdate, categories, onAddCategory }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...product });

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    if (!product) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        const currentStock = parseInt(formData.stock.toString()) || 0;

        // Iterar sobre canales para aplicar regla de auto-pausa
        const processedChannels = (formData.channels || []).map((ch: any) => {
            if (!ch.autoPauseEnabled) return ch;

            if (currentStock < ch.bufferStock) {
                // Solo pausar si estaba activo o ya auto-pausado
                if (ch.status === 'active' || ch.status === 'auto_paused') {
                    return { ...ch, status: 'auto_paused' };
                }
            } else if (ch.status === 'auto_paused' && currentStock >= ch.bufferStock) {
                // Reactivar si el stock ahora es suficiente
                return { ...ch, status: 'active' };
            }
            return ch;
        });

        onUpdate(product.id, {
            ...formData,
            stock: currentStock,
            channels: processedChannels,
            lastUpdated: new Date().toLocaleDateString('es-AR')
        });
        setIsEditing(false);
    };

    const handleUpdateChannel = (id: string, updatedChannel: any) => {
        setFormData(prev => ({
            ...prev,
            channels: (prev.channels || []).map((ch: any) => ch.id === id ? updatedChannel : ch)
        }));
    };

    const handleSaveNewCategory = () => {
        if (newCategoryName.trim()) {
            const newCat = newCategoryName.trim();
            onAddCategory(newCat);
            setFormData(prev => ({ ...prev, category: newCat }));
            setIsAddingCategory(false);
            setNewCategoryName("");
        }
    };

    const readClass = "bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm font-medium w-full focus:ring-0 block transition-colors";
    const editClass = "bg-white border border-blue-400 rounded-lg px-3 py-2 text-gray-900 text-sm font-medium w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm block transition-all";
    const textAreaReadClass = "bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm font-medium w-full resize-none focus:ring-0 leading-relaxed block";

    const getInputClass = () => isEditing ? editClass : readClass;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-100 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-zoom-in">

                <div className="px-8 py-5 border-b border-gray-200 bg-white flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{isEditing ? 'Editar Producto' : formData.name}</h3>
                            {!isEditing && <span className="text-sm text-gray-500 font-mono">ID: {product.id}</span>}
                        </div>
                        {isEditing && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full uppercase font-bold tracking-wider animate-pulse ml-4">Modo Edición</span>
                        )}
                    </div>

                    <div className="flex gap-3 items-center">
                        {!isEditing ? (
                            <>
                                <div className="hidden sm:flex items-center gap-1.5 text-gray-400 mr-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <Clock size={14} />
                                    <span className="text-xs font-medium">Editado: {product.lastUpdated}</span>
                                </div>

                                <button onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
                                >
                                    <Edit size={18} /> <span className="hidden sm:inline">Editar</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => {
                                    setIsEditing(false); setFormData({ ...product });
                                    setIsAddingCategory(false);
                                }}
                                    className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-bold"
                                >
                                    Cancelar
                                </button>
                                <button onClick={handleSave}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-bold flex items-center gap-2 shadow-md">
                                    <Save size={18} /> Guardar
                                </button>
                            </div>
                        )}
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        <button onClick={onClose}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                            title="Cerrar">
                            <X size={28} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <div className="flex flex-col space-y-8 max-w-4xl mx-auto">

                        <Card title="Información del Producto">
                            <DataRow label="Nombre">
                                <input name="name" type="text" value={formData.name} onChange={handleChange}
                                    className={getInputClass()} readOnly={!isEditing} />
                            </DataRow>

                            <DataRow label="SKU">
                                <input name="id" type="text" value={formData.id} onChange={handleChange}
                                    className={`${isEditing ? editClass : `${readClass} bg-gray-100 text-gray-500`} font-mono`} disabled={!isEditing} readOnly={!isEditing} />
                                {isEditing && <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                                    <AlertTriangle size={10} /> Precaución: Cambiar el SKU puede afectar historial.
                                </p>}
                            </DataRow>

                            <DataRow label="Alias">
                                <input name="alias" type="text" value={formData.alias} onChange={handleChange}
                                    placeholder="-" className={getInputClass()} readOnly={!isEditing} />
                            </DataRow>

                            <DataRow label="EAN">
                                <input name="ean" type="text" value={formData.ean} onChange={handleChange}
                                    placeholder="-" className={getInputClass()} readOnly={!isEditing} />
                            </DataRow>

                            <DataRow label="Categoría">
                                {isEditing ? (
                                    <div className="flex gap-2 w-full items-center">
                                        {!isAddingCategory ? (
                                            <>
                                                <select name="category" value={formData.category} onChange={handleChange} className={editClass}>
                                                    {categories && categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => setIsAddingCategory(true)}
                                                    className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
                                                    title="Crear nueva categoría"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="Nombre nueva categoría..."
                                                    className={editClass}
                                                    autoFocus
                                                />
                                                <button onClick={handleSaveNewCategory}
                                                    className="p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm"
                                                    title="Confirmar">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => {
                                                    setIsAddingCategory(false); setNewCategoryName("");
                                                }}
                                                    className="p-2.5 bg-gray-100 text-gray-500 rounded-lg border border-gray-200 hover:bg-gray-200 hover:text-red-500"
                                                    title="Cancelar"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className={readClass}>
                                        {formData.category}
                                    </div>
                                )}
                            </DataRow>

                            <DataRow label="Stock" isLast>
                                <div className="flex items-center gap-3">
                                    <input name="stock" type="number" value={formData.stock} onChange={handleChange}
                                        className={`${getInputClass()} font-bold ${!isEditing ? 'text-blue-700' : ''} w-32`} readOnly={!isEditing} />
                                    {!isEditing && <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">unidades disponibles</span>}
                                </div>
                            </DataRow>
                        </Card>

                        <Card title="Información de Atributos">
                            <div className="py-6 border-b border-gray-100">
                                <span className="block text-sm font-bold text-gray-700 mb-4">Imágenes</span>
                                <div className="flex gap-4 overflow-x-auto">
                                    <div className="w-32 h-32 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center relative group overflow-hidden">
                                        {product.imgUrl ? <img src={product.imgUrl} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="text-gray-300" size={32} />}
                                    </div>
                                    {[1, 2].map(i => (
                                        <div key={i} className={`w-32 h-32 flex-shrink-0 rounded-xl border-2 border-dashed flex items-center justify-center bg-gray-50/50 ${isEditing ? 'border-gray-300 hover:border-blue-400 cursor-pointer hover:bg-white' : 'border-gray-200'}`}>
                                            {isEditing ? <span className="text-gray-400 text-2xl font-light">+</span> : <ImageIcon className="text-gray-200" size={24} />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <DataRow label="Descripción">
                                <textarea name="description" rows={3} value={formData.description} onChange={handleChange}
                                    className={isEditing ? editClass : textAreaReadClass} readOnly={!isEditing} placeholder="Sin descripción..."></textarea>
                            </DataRow>

                            <DataRow label="Marca">
                                <input name="brand" type="text" value={formData.brand} onChange={handleChange}
                                    placeholder="-" className={getInputClass()} readOnly={!isEditing} />
                            </DataRow>

                            <DataRow label="Etiquetas" isLast>
                                <input name="tags" type="text" value={formData.tags} onChange={handleChange}
                                    placeholder="Ej: Verano, Oferta" className={getInputClass()} readOnly={!isEditing} />
                            </DataRow>
                        </Card>

                        <Card title="Sincronización Multicanal">
                            {formData.channels ? (
                                <div className="py-2">
                                    {formData.channels.map((channel: any) => (
                                        <SyncChannelCard
                                            key={channel.id}
                                            channel={channel}
                                            generalPrice={formData.price}
                                            onUpdate={handleUpdateChannel}
                                        />
                                    ))}

                                    {isEditing && (
                                        <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
                                            <Plus size={16} /> Vincular nuevo canal
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <DataRow label="Estado" isLast>
                                    <div className={`flex items-center gap-2 ${readClass} !bg-transparent !border-0`}>
                                        {product.syncStatus.status === 'Sincronizado' ? (
                                            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                                                <CheckCircle size={16} />
                                                <span>Sincronizado con {product.syncStatus.platform}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                                                <AlertTriangle size={16} />
                                                <span>{product.syncStatus.status} - {product.syncStatus.platform}</span>
                                            </div>
                                        )}
                                    </div>
                                </DataRow>
                            )}
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
};
