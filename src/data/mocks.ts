
export const INITIAL_PRODUCTS = [
    {
        id: 'BOLS-001',
        name: 'Bolso Playero XL - Arena',
        alias: 'Bolso Arena XL',
        category: 'Playa',
        stock: 12,
        committed: 2,
        minStock: 15,
        ean: '7791234567890',
        brand: 'SummerVibes',
        model: 'XL-2023',
        color: 'Arena',
        measures: '40x50x15 cm',
        weight: '0.5 kg',
        tags: 'Verano, Oferta, Playa',
        description: 'Bolso amplio ideal para la playa, con cierre reforzado y tela impermeable.',
        lastUpdated: '10/01/2026',
        cost: 2500,
        price: 4500,
        salesLast30: 45,
        location: 'A-01',
        imgUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=100&q=80',
        channels: [
            {
                id: 'mel',
                platform: 'MercadoLibre',
                status: 'active',
                externalId: 'MLA-1423985',
                title: 'Bolso Playero Grande Mujer Verano Cierre',
                permalink: '#',
                priceOverride: 4500,
                bufferStock: 2,
                lastSync: 'Hace 5 min',
                shippingType: 'full'
            },
            {
                id: 'woo',
                platform: 'WooCommerce',
                status: 'paused',
                externalId: 'WOO-5592',
                title: 'Bolso Playero XL - Arena Premium',
                permalink: '#',
                priceOverride: 4800,
                bufferStock: 0,
                lastSync: 'Hace 1 hora',
                shippingType: 'local'
            },
            {
                id: 'frav',
                platform: 'Fravega',
                status: 'error',
                externalId: 'FRV-999',
                title: 'Bolso SummerVibes XL',
                permalink: '#',
                priceOverride: 4500,
                bufferStock: 5,
                lastSync: 'Error al sincronizar',
                shippingType: 'standard'
            }
        ],
        syncStatus: { platform: 'Multi', status: 'Activo', link: '#' },
    },
    {
        id: 'BOT-DEP-05',
        name: 'Botella Deportiva 1L - Azul',
        alias: 'Botella Azul 1L',
        category: 'Deportes',
        stock: 150,
        committed: 10,
        minStock: 20,
        ean: '7799876543210',
        brand: 'Sporty',
        model: 'Hydra-1000',
        color: 'Azul Marino',
        measures: '25x8x8 cm',
        weight: '0.2 kg',
        tags: 'Hidratación, Gym, Bici',
        description: 'Botella libre de BPA, tapa a rosca anti-derrame.',
        syncStatus: { platform: 'Mercado Libre', status: 'Pendiente', link: '#' },
        lastUpdated: '05/01/2026',
        cost: 1200,
        price: 2200,
        salesLast30: 8,
        location: 'B-04',
        imgUrl: 'https://images.unsplash.com/photo-1602143407151-11115cdbf6e0?auto=format&fit=crop&w=100&q=80'
    },
    {
        id: 'LONA-002',
        name: 'Lona Estampada Tropical',
        alias: '',
        category: 'Playa',
        stock: 25,
        committed: 0,
        minStock: 10,
        ean: 'Sin EAN',
        brand: 'Generic',
        model: 'Trop-01',
        color: 'Multicolor',
        measures: '150x200 cm',
        weight: '0.8 kg',
        tags: 'Picnic, Exterior',
        description: '',
        syncStatus: { platform: 'Tienda Nube', status: 'Error', link: '#' },
        lastUpdated: '20/12/2025',
        cost: 3000,
        price: 5500,
        salesLast30: 20,
        location: 'A-02',
        imgUrl: null
    },
    {
        id: 'GOR-010',
        name: 'Gorra Visera Plana - Negra',
        alias: 'Gorra Negra',
        category: 'Accesorios',
        stock: 200,
        committed: 50,
        minStock: 30,
        ean: '7791112223334',
        brand: 'UrbanCap',
        model: 'Flat-V',
        color: 'Negro',
        measures: 'Adjustable',
        weight: '0.1 kg',
        tags: 'Moda, Verano',
        description: 'Gorra estilo urbano con visera plana y broche ajustable.',
        syncStatus: { platform: 'Mercado Libre', status: 'Sincronizado', link: '#' },
        cost: 1500,
        price: 2800,
        salesLast30: 0,
        location: 'C-01',
        lastUpdated: '15/11/2025',
        imgUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=100&q=80'
    },
    {
        id: 'CRM-SOL-50',
        name: 'Protector Solar FPS 50',
        alias: 'Protector 50',
        category: 'Cuidado',
        stock: 5,
        committed: 0,
        minStock: 20,
        ean: '7795556667778',
        brand: 'SunGuard',
        model: 'FPS-50',
        color: 'Blanco',
        measures: '200ml',
        weight: '0.25 kg',
        tags: 'Salud, Verano',
        description: 'Alta protección contra rayos UVA/UVB.',
        syncStatus: { platform: 'Farmacia', status: 'Sincronizado', link: '#' },
        cost: 4500,
        price: 8000,
        salesLast30: 60,
        location: 'D-05',
        lastUpdated: '08/01/2026',
        imgUrl: null
    },
];

export const DEFAULT_COLUMN_CONFIG = [
    { key: 'img', label: 'Img', visible: true, sortable: false, align: 'center', width: 'w-14' },
    { key: 'name', label: 'Nombre Producto', visible: true, sortable: true, sortKey: 'name' },
    { key: 'sku', label: 'SKU', visible: true, sortable: true, sortKey: 'sku', className: 'hidden md:table-cell' },
    { key: 'ean', label: 'EAN', visible: false, sortable: false },
    { key: 'brand', label: 'Marca', visible: false, sortable: false },
    { key: 'stock', label: 'Stock', visible: true, sortable: true, sortKey: 'stock', align: 'center' },
    { key: 'category', label: 'Categoría', visible: true, sortable: true, sortKey: 'category', className: 'hidden sm:table-cell' },
    { key: 'status', label: 'Estado', visible: true, sortable: false, align: 'center' },
    { key: 'location', label: 'Depósito', visible: true, sortable: false, align: 'center', className: 'hidden lg:table-cell' },
    { key: 'actions', label: 'Acciones', visible: true, sortable: false, align: 'center', width: 'w-20' },
];

export const INITIAL_DEPOSITOS = [
    {
        id: 'DEPO-1',
        nombre: 'DEPO 1 (SALA A)',
        ciudad: 'Ibicuy',
        provincia: 'Entre Ríos',
        direccion: 'Calle Falsa 123',
        divisiones: [
            {
                id: 'DIV-1',
                nombre: 'DIV 1',
                descripcion: 'Sección de Carga Pesada',
                racks: [
                    {
                        id: 'RACK-A1',
                        nombre: 'A1',
                        descripcion: 'Rack Principal',
                        pallets: [
                            {
                                id: 'PAL-001',
                                nombre: 'Pallet #123',
                                cajas: [
                                    {
                                        id: 'CAJA-101',
                                        nombre: 'Caja A-101',
                                        productos: [
                                            { id: 'P1', nombre: 'Bolso Playero XL', sku: 'BOLS-001', cantidad: 10 },
                                            { id: 'P2', nombre: 'Lona Estampada', sku: 'LONA-002', cantidad: 5 }
                                        ]
                                    }
                                ],
                                productosSueltos: [
                                    { id: 'PS1', nombre: 'Gorra Visera Plana', sku: 'GOR-010', cantidad: 2 }
                                ]
                            }
                        ],
                        productosSueltos: []
                    }
                ]
            }
        ]
    },
    {
        id: 'DEPO-2',
        nombre: 'DEPO 2 (LOGÍSTICA)',
        ciudad: 'CABA',
        provincia: 'Buenos Aires',
        direccion: 'Av. Corrientes 500',
        divisiones: [
            {
                id: 'DIV-X',
                nombre: 'Sector E-commerce',
                racks: [
                    {
                        id: 'RACK-B1',
                        nombre: 'B1',
                        pallets: [],
                        productosSueltos: [
                            { id: 'P3', nombre: 'Botella Deportiva 1L', sku: 'BOT-DEP-05', cantidad: 50 }
                        ]
                    }
                ]
            }
        ]
    }
];
