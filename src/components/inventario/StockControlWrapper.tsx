import React, { useState } from 'react';
import { StockControlView } from './StockControl';
import { INITIAL_PRODUCTS } from '../../data/mocks';

export const StockControlWrapper = () => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [categories, setCategories] = useState(['Playa', 'Deportes', 'Hogar', 'Accesorios', 'Cuidado']);

    const handleUpdateProduct = (originalId: string, updatedProduct: any) => {
        setProducts(prev => prev.map(p => p.id === originalId ? updatedProduct : p));
    };

    const handleAddCategory = (newCat: string) => {
        if (!categories.includes(newCat)) setCategories([...categories, newCat]);
    };

    return (
        <StockControlView
            products={products}
            onUpdateProduct={handleUpdateProduct}
            categories={categories}
            onAddCategory={handleAddCategory}
        />
    );
};
