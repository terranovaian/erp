import React, { useState } from 'react';
import { INITIAL_PRODUCTS } from './data/mocks';
import { MainLayout } from './layouts/MainLayout';
import { DashboardView } from './components/views/DashboardView';
import { StockControlView } from './components/views/StockControlView';
import { StockHistoryView } from './components/views/StockHistoryView';
import { ValuationView } from './components/views/ValuationView';
import { RotationView } from './components/views/RotationView';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h1>
                    <pre className="text-left bg-gray-100 p-4 rounded overflow-auto text-xs text-red-800 border border-red-200">
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const App = () => {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [categories, setCategories] = useState(['Playa', 'Deportes', 'Hogar', 'Accesorios', 'Cuidado']);
    const [activeView, setActiveView] = useState('control');

    // Manejador para actualizar un producto desde el modal
    const handleUpdateProduct = (originalId: string, updatedProduct: any) => {
        setProducts(prevProducts =>
            prevProducts.map(p => p.id === originalId ? updatedProduct : p)
        );
    };

    const handleAddCategory = (newCat: string) => {
        if (!categories.includes(newCat)) {
            setCategories([...categories, newCat]);
        }
    };

    return (
        <ErrorBoundary>
            <MainLayout currentPath={`/inventario/${activeView}`}>
                {activeView === 'dashboard' && <DashboardView products={products} />}
                {activeView === 'control' &&
                    <StockControlView
                        products={products}
                        onUpdateProduct={handleUpdateProduct}
                        categories={categories}
                        onAddCategory={handleAddCategory}
                    />
                }
                {activeView === 'history' && <StockHistoryView />}
                {activeView === 'valuation' && <ValuationView products={products} />}
                {activeView === 'rotation' && <RotationView />}
            </MainLayout>
        </ErrorBoundary>
    );
};

export default App;
