export const translations = {
  en: {
    suppliers: {
      title: 'SUPPLIERS',
      exploreSuppliers: 'Explore Suppliers',
      searchPlaceholder: 'Search for supplier',
      searchBar: 'SEARCHBAR',
      addSupplier: 'Add Supplier',
      sendInquiry: 'Send Inquiry',
      inquirySent: 'Inquiry Sent',
      clearFilters: 'Clear All',
      noResults: 'No suppliers found',
      tryAdjusting: 'Try adjusting your search criteria or filters',
      loading: 'Loading suppliers...',
      categories: {
        dairy: 'Dairy',
        fruitsVegetables: 'Fruits & Vegetables',
        deli: 'Deli',
        healthBeauty: 'Health & Beauty',
        frozen: 'Frozen',
        freshMeat: 'Fresh Meat',
        packaged: 'Packaged'
      },
      recommendations: {
        recentlyAdded: 'Recently Added',
        popular: 'Popular',
        all: 'All Suppliers'
      },
      filters: {
        freeDelivery: 'FREE DELIVERY',
        coDelivery: 'CO-DELIVERY',
        onSale: 'ON SALE',
        suppliersEtc: 'SUPPLIERS ETC'
      },
      features: {
        freeDelivery: 'Free Delivery',
        onSale: 'On Sale',
        coDelivery: 'Co-Delivery',
        recentlyAdded: 'New',
        popular: 'Popular'
      }
    }
  },
  sv: {
    suppliers: {
      title: 'LEVERANTÖRER',
      exploreSuppliers: 'Utforska leverantörer',
      searchPlaceholder: 'Sök på leverantör',
      searchBar: 'SÖK',
      addSupplier: 'Lägg Till Leverantör',
      sendInquiry: 'Skicka förfrågan',
      inquirySent: 'Förfrågan skickad',
      clearFilters: 'Rensa alla',
      noResults: 'Inga leverantörer hittades',
      tryAdjusting: 'Försök justera dina sökkriterier eller filter',
      loading: 'Laddar leverantörer...',
      categories: {
        dairy: 'Mejeri',
        fruitsVegetables: 'Frukt & Grönt',
        deli: 'Chark',
        healthBeauty: 'Hälsa & Skönhet',
        frozen: 'Djupfryst',
        freshMeat: 'Färskvaror, Ko',
        packaged: 'Packade'
      },
      recommendations: {
        recentlyAdded: 'Nyligen Tillagd',
        popular: 'Popular',
        all: 'Alla Leverantörer'
      },
      filters: {
        freeDelivery: 'GRATIS FRAKT',
        coDelivery: 'SAMLEVERANS',
        onSale: 'REA',
        suppliersEtc: 'LEVERANTÖRER ETC'
      },
      features: {
        freeDelivery: 'Gratis frakt',
        onSale: 'På rea',
        coDelivery: 'Samleverans',
        recentlyAdded: 'Ny',
        popular: 'Populär'
      }
    }
  },
  es: {
    suppliers: {
      title: 'PROVEEDORES',
      exploreSuppliers: 'Explorar Proveedores',
      searchPlaceholder: 'Buscar proveedor',
      searchBar: 'BARRA DE BÚSQUEDA',
      addSupplier: 'Añadir Proveedor',
      sendInquiry: 'Enviar Consulta',
      inquirySent: 'Consulta Enviada',
      clearFilters: 'Limpiar Todo',
      noResults: 'No se encontraron proveedores',
      tryAdjusting: 'Intenta ajustar tus criterios de búsqueda o filtros',
      loading: 'Cargando proveedores...',
      categories: {
        dairy: 'Lácteos',
        fruitsVegetables: 'Frutas y Verduras',
        deli: 'Charcutería',
        healthBeauty: 'Salud y Belleza',
        frozen: 'Congelados',
        freshMeat: 'Carne Fresca',
        packaged: 'Empaquetados'
      },
      recommendations: {
        recentlyAdded: 'Recientemente Añadido',
        popular: 'Popular',
        all: 'Todos los Proveedores'
      },
      filters: {
        freeDelivery: 'ENVÍO GRATIS',
        coDelivery: 'ENTREGA COMBINADA',
        onSale: 'EN OFERTA',
        suppliersEtc: 'PROVEEDORES ETC'
      },
      features: {
        freeDelivery: 'Envío Gratis',
        onSale: 'En Oferta',
        coDelivery: 'Entrega Combinada',
        recentlyAdded: 'Nuevo',
        popular: 'Popular'
      }
    }
  }
};

export type Language = 'en' | 'sv' | 'es';
export type TranslationKey = keyof typeof translations.en.suppliers;
