import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

// Fallback translations
const fallbackTranslations: any = {
  'en': {
    common: {
      search: 'Search',
      loading: 'Loading...',
      refresh: 'Refresh',
      verified: 'Verified',
      orders: 'Orders',
      totalSpent: 'Total Spent',
      lastOrder: 'Last Order',
      viewDetails: 'View Details',
      placeOrder: 'Place Order',
      requestRelationship: 'Request Relationship',
      noSuppliersFound: 'No suppliers found',
      noSuppliersMatch: 'No suppliers match your current filters',
      clearFilters: 'Clear Filters',
      user: 'User',
      explore: 'Explore',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      total: 'Total',
      filter: 'Filter',
      filters: 'Filters',
      clear: 'Clear',
      clearAll: 'Clear All',
      apply: 'Apply',
      reset: 'Reset',
      export: 'Export',
      import: 'Import',
      download: 'Download',
      upload: 'Upload',
      view: 'View',
      details: 'Details',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      country: 'Country',
      price: 'Price',
      quantity: 'Quantity',
      category: 'Category',
      supplier: 'Supplier',
      customer: 'Customer',
      order: 'Order',
      sales: 'Sales',
      revenue: 'Revenue',
      profit: 'Profit',
      rating: 'Rating',
      reviews: 'Reviews',
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
      cancelled: 'Cancelled',
      shipped: 'Shipped',
      delivered: 'Delivered',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      new: 'New',
      featured: 'Featured',
      onSale: 'On Sale',
      lowStock: 'Low Stock',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock'
    },
    navigation: {
      dashboard: 'Dashboard',
      suppliers: 'Suppliers',
      products: 'Products',
      orders: 'Orders',
      shoppingList: 'Shopping List',
      inventory: 'Inventory',
      analysis: 'Analysis',
      clients: 'Clients',
      admin: 'Admin',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      help: 'Help',
      team: 'Team',
      transactions: 'Transactions',
      notifications: 'Notifications',
      ean: 'EAN Management',
      edi: 'EDI Integration',
      supplierDashboard: 'Supplier Dashboard',
      clientDashboard: 'Client Dashboard',
      adminDashboard: 'Admin Dashboard',
      userManagement: 'User Management',
      systemSettings: 'System Settings'
    },
    roles: {
      user: 'User',
      admin: 'Admin',
      client: 'Client',
      supplier: 'Supplier'
    },
    suppliers: {
      mySuppliers: 'My Suppliers',
      manageRelationships: 'Manage Relationships',
      searchPlaceholder: 'Search suppliers...',
      searchBar: 'Search suppliers, brands, categories',
      insights: 'Insights',
      explore: 'Explore',
      title: 'Suppliers',
      subtitle: 'Manage your supplier relationships',
      addSupplier: 'Add Supplier',
      searchSuppliers: 'Search suppliers, brands, categories',
      discoverSuppliers: 'Discover new suppliers and manage relationships',
      filterByCategory: 'Filter by Category',
      filterByStatus: 'Filter by Status',
      viewDetails: 'View Details',
      placeOrder: 'Place Order',
      requestRelationship: 'Request Relationship',
      exploreSuppliers: 'Explore Suppliers',
      supplierProfile: 'Supplier Profile',
      companyName: 'Company Name',
      contactPerson: 'Contact Person',
      businessHours: 'Business Hours',
      minimumOrderAmount: 'Minimum Order Amount',
      deliveryAreas: 'Delivery Areas',
      totalOrders: 'Total Orders',
      totalSpent: 'Total Spent',
      lastOrderDate: 'Last Order Date',
      relationshipStatus: 'Relationship Status',
      verified: 'Verified',
      unverified: 'Unverified',
      clearFilters: 'Clear Filters',
      filters: {
        freeDelivery: 'Free Delivery',
        coDelivery: 'Co-Delivery',
        onSale: 'On Sale',
        suppliersMayNeedToBuy: 'Suppliers may need to buy',
        suppliersStoppedBuying: 'Suppliers stopped buying',
        combinedDelivery: 'Combined Delivery',
        freeShippingCost: 'Free Shipping Cost',
        activeCampaigns: 'Active Campaigns',
        newProducts: 'New Products'
      },
      recommendations: {
        all: 'All Suppliers'
      }
    },
    login: {
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      signInMessage: 'Sign in to your account',
      joinMessage: 'Join our platform today',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: 'Don\'t have an account?',
      termsAndConditions: 'I agree to the Terms and Conditions',
      privacyPolicy: 'Privacy Policy'
    },
    buyerInsights: {
      title: 'Buyer Insights',
      subtitle: 'Analytics and performance data for your business',
      aiAnalysis: 'AI Analysis',
      downloadReport: 'Download Report',
      dateRange: 'Date Range',
      store: 'Store',
      salesEuro: 'Sales (€)',
      orders: 'Orders',
      avgOrderEuro: 'Avg Order (€)',
      frequency: 'Frequency',
      amountOfStores: 'Amount of Stores',
      noData: 'No data available',
      generate: 'Generate',
      addComparison: 'Add Comparison',
      sales: 'Sales',
      deliveries: 'Deliveries',
      deliveryDate: 'Delivery Date'
    },
    clientInsights: {
      title: 'Client Insights',
      subtitle: 'Analytics and performance data for your clients',
      addFilter: 'Add Filter',
      orders: 'Orders',
      fromDate: 'From Date',
      toDate: 'To Date',
      addComparison: 'Add comparison',
      generate: 'Generate',
      highVolume: 'High Volume',
      analyticsChart: 'Analytics Chart',
      salesAndOrdersOverview: 'Sales and Orders Overview',
      customerPerformance: 'Customer Performance',
      salesAndOrderAnalysis: 'Sales and Order Analysis',
      amountOfStores: 'Amount of stores',
      graphicFilters: 'GRAPHIC (filters): sales orders',
      listFilters: 'LIST (Filters)',
      averageOrder: 'Average Order',
      frequency: 'Frequency',
      leadTime: 'Lead Time',
      days: 'days',
      noData: 'No data available',
      loadingData: 'Loading client data...',
      errorLoading: 'Error loading data',
      salesAnalytics: 'Sales Analytics',
      topPerformingClients: 'Top Performing Clients',
      trendAnalysis: 'Trend Analysis',
      seasonalPatterns: 'Seasonal Patterns',
      growthRate: 'Growth Rate',
      averageOrderValue: 'Average Order Value',
      peakSeason: 'Peak Season',
      lowSeason: 'Low Season',
      mayJune: 'May-June',
      octNov: 'Oct-Nov',
      upward: 'Upward',
      client: 'Client',
      ordersCount: 'Orders',
      averageOrderAmount: 'Average Order',
      frequencyValue: 'Frequency'
    },
    products: {
      title: 'Products',
      subtitle: 'Browse and manage product catalog',
      searchProducts: 'Search products, brands, suppliers',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      productDetails: 'Product Details',
      description: 'Description',
      specifications: 'Specifications',
      reviews: 'Reviews',
      relatedProducts: 'Related Products',
      newArrivals: 'New Arrivals',
      specialOffers: 'Special Offers',
      popularProducts: 'Popular Products',
      priceRange: 'Price Range',
      availability: 'Availability',
      sortBy: 'Sort by',
      newestFirst: 'Newest First',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      rating: 'Rating',
      nameAsc: 'Name: A-Z',
      nameDesc: 'Name: Z-A'
    },
    orders: {
      title: 'Orders',
      subtitle: 'Manage your orders and shipments',
      orderNumber: 'Order Number',
      orderDate: 'Order Date',
      orderStatus: 'Order Status',
      orderTotal: 'Order Total',
      shippingAddress: 'Shipping Address',
      billingAddress: 'Billing Address',
      paymentMethod: 'Payment Method',
      trackingNumber: 'Tracking Number',
      estimatedDelivery: 'Estimated Delivery',
      orderItems: 'Order Items',
      itemName: 'Item Name',
      unitPrice: 'Unit Price',
      subtotal: 'Subtotal',
      tax: 'Tax',
      shipping: 'Shipping',
      total: 'Total',
      createOrder: 'Create Order',
      updateOrder: 'Update Order',
      cancelOrder: 'Cancel Order',
      trackOrder: 'Track Order'
    },
    shoppingList: {
      title: 'Shopping List',
      subtitle: 'Organize your shopping needs',
      createList: 'Create List',
      createNewList: 'Create New List',
      myLists: 'My Lists',
      sharedLists: 'Shared Lists',
      aiInsights: 'AI Insights',
      listName: 'List Name',
      listType: 'List Type',
      personal: 'Personal',
      shared: 'Shared',
      team: 'Team',
      addItem: 'Add Item',
      itemName: 'Item Name',
      quantity: 'Quantity',
      unit: 'Unit',
      priority: 'Priority',
      estimatedPrice: 'Estimated Price',
      category: 'Category',
      supplier: 'Supplier',
      markAsPurchased: 'Mark as Purchased',
      removeItem: 'Remove Item',
      shareList: 'Share List',
      duplicateList: 'Duplicate List',
      aiRecommendations: 'AI Recommendations',
      confidence: 'Confidence'
    },
    inventory: {
      title: 'Inventory',
      subtitle: 'Track and manage your inventory',
      currentStock: 'Current Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock',
      reorderLevel: 'Reorder Level',
      lastUpdated: 'Last Updated',
      stockMovement: 'Stock Movement',
      incoming: 'Incoming',
      outgoing: 'Outgoing',
      adjustment: 'Adjustment',
      addStock: 'Add Stock',
      removeStock: 'Remove Stock',
      adjustStock: 'Adjust Stock',
      stockHistory: 'Stock History',
      productCode: 'Product Code',
      sku: 'SKU',
      barcode: 'Barcode',
      location: 'Location',
      warehouse: 'Warehouse',
      shelf: 'Shelf',
      bin: 'Bin'
    },
    analysis: {
      title: 'Analysis',
      subtitle: 'Business analytics and insights',
      salesAnalytics: 'Sales Analytics',
      revenueAnalytics: 'Revenue Analytics',
      customerAnalytics: 'Customer Analytics',
      supplierAnalytics: 'Supplier Analytics',
      productAnalytics: 'Product Analytics',
      inventoryAnalytics: 'Inventory Analytics',
      timeRange: 'Time Range',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      last90Days: 'Last 90 Days',
      lastYear: 'Last Year',
      customRange: 'Custom Range',
      metrics: 'Metrics',
      revenue: 'Revenue',
      orders: 'Orders',
      customers: 'Customers',
      products: 'Products',
      growth: 'Growth',
      trend: 'Trend',
      comparison: 'Comparison',
      exportData: 'Export Data',
      generateReport: 'Generate Report'
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your business performance',
      welcome: 'Welcome back',
      quickStats: 'Quick Stats',
      recentActivity: 'Recent Activity',
      upcomingTasks: 'Upcoming Tasks',
      notifications: 'Notifications',
      alerts: 'Alerts',
      overview: 'Overview',
      performance: 'Performance',
      trends: 'Trends',
      insights: 'Insights'
    },
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'System administration and management',
      users: 'Users',
      system: 'System',
      logs: 'Logs',
      settings: 'Settings',
      globalStats: 'Global Statistics',
      activeUsers: 'Active Users',
      newUsersThisWeek: 'New This Week',
      totalOrders: 'Total Orders',
      systemHealth: 'System Health',
      createUser: 'Create User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      userRole: 'User Role',
      admin: 'Admin',
      client: 'Client',
      supplier: 'Supplier',
      lastLogin: 'Last Login',
      accountStatus: 'Account Status',
      systemConfig: 'System Configuration',
      systemLogs: 'System Logs',
      logLevel: 'Log Level',
      message: 'Message',
      source: 'Source',
      timestamp: 'Timestamp'
    },
    language: {
      selectLanguage: 'Select Language',
      english: 'English',
      spanish: 'Spanish',
      swedish: 'Swedish',
      french: 'French',
      german: 'German',
      italian: 'Italian',
      portuguese: 'Portuguese',
      dutch: 'Dutch',
      norwegian: 'Norwegian',
      danish: 'Danish',
      finnish: 'Finnish'
    },
    companies: {
      stockfiller: 'Stockfiller.com',
      stocknetMicrodistribution: 'StockNet Microdistribution',
      stocknetMacrodistribution: 'StockNet Macrodistribution',
      deepGreenWholesalers: 'Deep Green Wholesalers',
      deepGreenRetailers: 'Deep Green Retailers',
      cityWareMerchants: 'City Ware Merchants'
    },
    months: {
      jan: 'Jan',
      feb: 'Feb',
      mar: 'Mar',
      apr: 'Apr',
      may: 'May',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Aug',
      sep: 'Sep',
      oct: 'Oct',
      nov: 'Nov',
      dec: 'Dec'
    },
    platform: {
      cesto: 'CESTO',
      aiPlatform: 'AI Platform',
      stockfiller: 'Stockfiller.com'
    },
    search: {
      placeholder: 'Search products, suppliers, orders...',
      suggestions: 'Suggestions',
      clear: 'Clear search',
      clearRecent: 'Clear recent searches',
      noResults: 'No results found',
      searchResults: 'Search Results',
      recentSearches: 'Recent Searches',
      popularSearches: 'Popular Searches',
      products: 'Products',
      suppliers: 'Suppliers',
      orders: 'Orders',
      shoppingLists: 'Shopping Lists',
      analytics: 'Analytics',
      inventory: 'Inventory'
    }
  },
  'es': {
    common: {
      search: 'Buscar',
      loading: 'Cargando...',
      refresh: 'Actualizar',
      verified: 'Verificado',
      orders: 'Pedidos',
      totalSpent: 'Total Gastado',
      lastOrder: 'Último Pedido',
      viewDetails: 'Ver Detalles',
      placeOrder: 'Realizar Pedido',
      requestRelationship: 'Solicitar Relación',
      noSuppliersFound: 'No se encontraron proveedores',
      noSuppliersMatch: 'Ningún proveedor coincide con tus filtros actuales',
      clearFilters: 'Limpiar Filtros',
      user: 'Usuario',
      explore: 'Explorar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Agregar',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      confirm: 'Confirmar',
      yes: 'Sí',
      no: 'No',
      total: 'Total',
      filter: 'Filtrar',
      filters: 'Filtros',
      clear: 'Limpiar',
      clearAll: 'Limpiar Todo',
      apply: 'Aplicar',
      reset: 'Restablecer',
      export: 'Exportar',
      import: 'Importar',
      download: 'Descargar',
      upload: 'Subir',
      view: 'Ver',
      details: 'Detalles',
      actions: 'Acciones',
      status: 'Estado',
      date: 'Fecha',
      name: 'Nombre',
      email: 'Correo',
      phone: 'Teléfono',
      address: 'Dirección',
      city: 'Ciudad',
      country: 'País',
      price: 'Precio',
      quantity: 'Cantidad',
      category: 'Categoría',
      supplier: 'Proveedor',
      customer: 'Cliente',
      order: 'Pedido',
      sales: 'Ventas',
      revenue: 'Ingresos',
      profit: 'Beneficio',
      rating: 'Calificación',
      reviews: 'Reseñas',
      active: 'Activo',
      inactive: 'Inactivo',
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      completed: 'Completado',
      cancelled: 'Cancelado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      new: 'Nuevo',
      featured: 'Destacado',
      onSale: 'En Oferta',
      lowStock: 'Stock Bajo',
      inStock: 'En Stock',
      outOfStock: 'Sin Stock'
    },
    navigation: {
      dashboard: 'Panel',
      suppliers: 'Proveedores',
      products: 'Productos',
      orders: 'Pedidos',
      shoppingList: 'Lista de Compras',
      inventory: 'Inventario',
      analysis: 'Análisis',
      clients: 'Clientes',
      admin: 'Admin',
      profile: 'Perfil',
      settings: 'Configuración',
      logout: 'Cerrar Sesión',
      help: 'Ayuda',
      team: 'Equipo',
      transactions: 'Transacciones',
      notifications: 'Notificaciones',
      ean: 'Gestión EAN',
      edi: 'Integración EDI',
      supplierDashboard: 'Panel de Proveedor',
      clientDashboard: 'Panel de Cliente',
      adminDashboard: 'Panel de Administración',
      userManagement: 'Gestión de Usuarios',
      systemSettings: 'Configuración del Sistema'
    },
    roles: {
      user: 'Usuario',
      admin: 'Admin',
      buyer: 'Comprador',
      supplier: 'Proveedor',
      client: 'Cliente'
    },
    suppliers: {
      mySuppliers: 'Mis Proveedores',
      manageRelationships: 'Gestionar Relaciones',
      searchPlaceholder: 'Buscar proveedores...',
      searchBar: 'Buscar proveedores, marcas, categorías',
      insights: 'Insights',
      explore: 'Explorar',
      title: 'Proveedores',
      subtitle: 'Gestiona tus relaciones con proveedores',
      addSupplier: 'Agregar Proveedor',
      searchSuppliers: 'Buscar proveedores, marcas, categorías',
      discoverSuppliers: 'Descubre nuevos proveedores y gestiona relaciones',
      filterByCategory: 'Filtrar por Categoría',
      filterByStatus: 'Filtrar por Estado',
      viewDetails: 'Ver Detalles',
      placeOrder: 'Realizar Pedido',
      requestRelationship: 'Solicitar Relación',
      exploreSuppliers: 'Explorar Proveedores',
      supplierProfile: 'Perfil del Proveedor',
      companyName: 'Nombre de la Empresa',
      contactPerson: 'Persona de Contacto',
      businessHours: 'Horario de Atención',
      minimumOrderAmount: 'Monto Mínimo de Pedido',
      deliveryAreas: 'Áreas de Entrega',
      totalOrders: 'Total de Pedidos',
      totalSpent: 'Total Gastado',
      lastOrderDate: 'Fecha del Último Pedido',
      relationshipStatus: 'Estado de la Relación',
      verified: 'Verificado',
      unverified: 'No Verificado',
      clearFilters: 'Limpiar Filtros',
      filters: {
        freeDelivery: 'Envío Gratis',
        coDelivery: 'Co-Envío',
        onSale: 'En Oferta',
        suppliersMayNeedToBuy: 'Proveedores que pueden necesitar comprar',
        suppliersStoppedBuying: 'Proveedores que dejaron de comprar',
        combinedDelivery: 'Envío Combinado',
        freeShippingCost: 'Costo de Envío Gratis',
        activeCampaigns: 'Campañas Activas',
        newProducts: 'Productos Nuevos'
      },
      recommendations: {
        all: 'Todos los Proveedores'
      }
    },
    login: {
      welcomeBack: 'Bienvenido de Vuelta',
      createAccount: 'Crear Cuenta',
      signInMessage: 'Inicia sesión en tu cuenta',
      joinMessage: 'Únete a nuestra plataforma hoy',
      email: 'Dirección de Correo',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      firstName: 'Nombre',
      lastName: 'Apellido',
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      forgotPassword: '¿Olvidaste tu contraseña?',
      rememberMe: 'Recordarme',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      dontHaveAccount: '¿No tienes una cuenta?',
      termsAndConditions: 'Acepto los Términos y Condiciones',
      privacyPolicy: 'Política de Privacidad'
    },
    buyerInsights: {
      title: 'Insights del Comprador',
      subtitle: 'Datos de análisis y rendimiento para tu negocio',
      aiAnalysis: 'Análisis de IA',
      downloadReport: 'Descargar Reporte',
      dateRange: 'Rango de Fechas',
      store: 'Tienda',
      salesEuro: 'Ventas (€)',
      orders: 'Pedidos',
      avgOrderEuro: 'Pedido Promedio (€)',
      frequency: 'Frecuencia',
      amountOfStores: 'Cantidad de Tiendas',
      noData: 'No hay datos disponibles',
      generate: 'Generar',
      addComparison: 'Agregar Comparación',
      sales: 'Ventas',
      deliveries: 'Entregas',
      deliveryDate: 'Fecha de Entrega'
    },
    clientInsights: {
      title: 'Información del Cliente',
      subtitle: 'Analíticas y datos de rendimiento para tus clientes',
      addFilter: 'Agregar Filtro',
      orders: 'Pedidos',
      fromDate: 'Desde Fecha',
      toDate: 'Hasta Fecha',
      addComparison: 'Agregar comparación',
      generate: 'Generar',
      highVolume: 'Alto Volumen',
      analyticsChart: 'Gráfico de Analíticas',
      salesAndOrdersOverview: 'Resumen de Ventas y Pedidos',
      customerPerformance: 'Rendimiento del Cliente',
      salesAndOrderAnalysis: 'Análisis de Ventas y Pedidos',
      amountOfStores: 'Cantidad de tiendas',
      graphicFilters: 'GRÁFICO (filtros): pedidos de ventas',
      listFilters: 'LISTA (Filtros)',
      averageOrder: 'Pedido Promedio',
      frequency: 'Frecuencia',
      leadTime: 'Tiempo de Entrega',
      days: 'días',
      noData: 'No hay datos disponibles',
      loadingData: 'Cargando datos del cliente...',
      errorLoading: 'Error cargando datos',
      salesAnalytics: 'Análisis de Ventas',
      topPerformingClients: 'Clientes con Mejor Rendimiento',
      trendAnalysis: 'Análisis de Tendencias',
      seasonalPatterns: 'Patrones Estacionales',
      growthRate: 'Tasa de Crecimiento',
      averageOrderValue: 'Valor Promedio del Pedido',
      peakSeason: 'Temporada Alta',
      lowSeason: 'Temporada Baja',
      mayJune: 'Mayo-Junio',
      octNov: 'Oct-Nov',
      upward: 'Ascendente',
      client: 'Cliente',
      ordersCount: 'Pedidos',
      averageOrderAmount: 'Pedido Promedio',
      frequencyValue: 'Frecuencia'
    },
    products: {
      title: 'Productos',
      subtitle: 'Explorar y gestionar catálogo de productos',
      searchProducts: 'Buscar productos, marcas, proveedores',
      addToCart: 'Agregar al Carrito',
      viewDetails: 'Ver Detalles',
      addToFavorites: 'Agregar a Favoritos',
      removeFromFavorites: 'Quitar de Favoritos',
      productDetails: 'Detalles del Producto',
      description: 'Descripción',
      specifications: 'Especificaciones',
      reviews: 'Reseñas',
      relatedProducts: 'Productos Relacionados',
      newArrivals: 'Nuevos Productos',
      specialOffers: 'Ofertas Especiales',
      popularProducts: 'Productos Populares',
      priceRange: 'Rango de Precios',
      availability: 'Disponibilidad',
      sortBy: 'Ordenar por',
      newestFirst: 'Más Recientes',
      priceLowToHigh: 'Precio: Bajo a Alto',
      priceHighToLow: 'Precio: Alto a Bajo',
      rating: 'Calificación',
      nameAsc: 'Nombre: A-Z',
      nameDesc: 'Nombre: Z-A'
    },
    orders: {
      title: 'Pedidos',
      subtitle: 'Gestiona tus pedidos y envíos',
      orderNumber: 'Número de Pedido',
      orderDate: 'Fecha del Pedido',
      orderStatus: 'Estado del Pedido',
      orderTotal: 'Total del Pedido',
      shippingAddress: 'Dirección de Envío',
      billingAddress: 'Dirección de Facturación',
      paymentMethod: 'Método de Pago',
      trackingNumber: 'Número de Seguimiento',
      estimatedDelivery: 'Entrega Estimada',
      orderItems: 'Artículos del Pedido',
      itemName: 'Nombre del Artículo',
      unitPrice: 'Precio Unitario',
      subtotal: 'Subtotal',
      tax: 'Impuesto',
      shipping: 'Envío',
      total: 'Total',
      createOrder: 'Crear Pedido',
      updateOrder: 'Actualizar Pedido',
      cancelOrder: 'Cancelar Pedido',
      trackOrder: 'Rastrear Pedido'
    },
    shoppingList: {
      title: 'Lista de Compras',
      subtitle: 'Organiza tus necesidades de compra',
      createList: 'Crear Lista',
      createNewList: 'Crear Nueva Lista',
      myLists: 'Mis Listas',
      sharedLists: 'Listas Compartidas',
      aiInsights: 'Insights de IA',
      listName: 'Nombre de la Lista',
      listType: 'Tipo de Lista',
      personal: 'Personal',
      shared: 'Compartida',
      team: 'Equipo',
      addItem: 'Agregar Artículo',
      itemName: 'Nombre del Artículo',
      quantity: 'Cantidad',
      unit: 'Unidad',
      priority: 'Prioridad',
      estimatedPrice: 'Precio Estimado',
      category: 'Categoría',
      supplier: 'Proveedor',
      markAsPurchased: 'Marcar como Comprado',
      removeItem: 'Quitar Artículo',
      shareList: 'Compartir Lista',
      duplicateList: 'Duplicar Lista',
      aiRecommendations: 'Recomendaciones de IA',
      confidence: 'Confianza'
    },
    inventory: {
      title: 'Inventario',
      subtitle: 'Rastrea y gestiona tu inventario',
      currentStock: 'Stock Actual',
      lowStock: 'Stock Bajo',
      outOfStock: 'Sin Stock',
      reorderLevel: 'Nivel de Reorden',
      lastUpdated: 'Última Actualización',
      stockMovement: 'Movimiento de Stock',
      incoming: 'Entrante',
      outgoing: 'Saliente',
      adjustment: 'Ajuste',
      addStock: 'Agregar Stock',
      removeStock: 'Quitar Stock',
      adjustStock: 'Ajustar Stock',
      stockHistory: 'Historial de Stock',
      productCode: 'Código del Producto',
      sku: 'SKU',
      barcode: 'Código de Barras',
      location: 'Ubicación',
      warehouse: 'Almacén',
      shelf: 'Estante',
      bin: 'Contenedor'
    },
    analysis: {
      title: 'Análisis',
      subtitle: 'Analíticas e insights del negocio',
      salesAnalytics: 'Análisis de Ventas',
      revenueAnalytics: 'Análisis de Ingresos',
      customerAnalytics: 'Análisis de Clientes',
      supplierAnalytics: 'Análisis de Proveedores',
      productAnalytics: 'Análisis de Productos',
      inventoryAnalytics: 'Análisis de Inventario',
      timeRange: 'Rango de Tiempo',
      last7Days: 'Últimos 7 Días',
      last30Days: 'Últimos 30 Días',
      last90Days: 'Últimos 90 Días',
      lastYear: 'Último Año',
      customRange: 'Rango Personalizado',
      metrics: 'Métricas',
      revenue: 'Ingresos',
      orders: 'Pedidos',
      customers: 'Clientes',
      products: 'Productos',
      growth: 'Crecimiento',
      trend: 'Tendencia',
      comparison: 'Comparación',
      exportData: 'Exportar Datos',
      generateReport: 'Generar Reporte'
    },
    dashboard: {
      title: 'Panel',
      subtitle: 'Resumen del rendimiento de tu negocio',
      welcome: 'Bienvenido de vuelta',
      quickStats: 'Estadísticas Rápidas',
      recentActivity: 'Actividad Reciente',
      upcomingTasks: 'Tareas Próximas',
      notifications: 'Notificaciones',
      alerts: 'Alertas',
      overview: 'Resumen',
      performance: 'Rendimiento',
      trends: 'Tendencias',
      insights: 'Insights'
    },
    admin: {
      title: 'Panel de Administración',
      subtitle: 'Administración y gestión del sistema',
      users: 'Usuarios',
      system: 'Sistema',
      logs: 'Registros',
      settings: 'Configuración',
      globalStats: 'Estadísticas Globales',
      activeUsers: 'Usuarios Activos',
      newUsersThisWeek: 'Nuevos Esta Semana',
      totalOrders: 'Total de Pedidos',
      systemHealth: 'Salud del Sistema',
      createUser: 'Crear Usuario',
      editUser: 'Editar Usuario',
      deleteUser: 'Eliminar Usuario',
      userRole: 'Rol de Usuario',
      admin: 'Admin',
      buyer: 'Comprador',
      supplier: 'Proveedor',
      client: 'Cliente',
      lastLogin: 'Último Inicio de Sesión',
      accountStatus: 'Estado de la Cuenta',
      systemConfig: 'Configuración del Sistema',
      systemLogs: 'Registros del Sistema',
      logLevel: 'Nivel de Registro',
      message: 'Mensaje',
      source: 'Fuente',
      timestamp: 'Marca de Tiempo'
    },
    language: {
      selectLanguage: 'Seleccionar Idioma',
      english: 'Inglés',
      spanish: 'Español',
      swedish: 'Sueco',
      french: 'Francés',
      german: 'Alemán',
      italian: 'Italiano',
      portuguese: 'Portugués',
      dutch: 'Holandés',
      norwegian: 'Noruego',
      danish: 'Danés',
      finnish: 'Finlandés'
    },
    companies: {
      stockfiller: 'Stockfiller.com',
      stocknetMicrodistribution: 'StockNet Microdistribution',
      stocknetMacrodistribution: 'StockNet Macrodistribution',
      deepGreenWholesalers: 'Deep Green Wholesalers',
      deepGreenRetailers: 'Deep Green Retailers',
      cityWareMerchants: 'City Ware Merchants'
    },
    months: {
      jan: 'Ene',
      feb: 'Feb',
      mar: 'Mar',
      apr: 'Abr',
      may: 'May',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Ago',
      sep: 'Sep',
      oct: 'Oct',
      nov: 'Nov',
      dec: 'Dic'
    },
    platform: {
      cesto: 'CESTO',
      aiPlatform: 'Plataforma IA',
      stockfiller: 'Stockfiller.com'
    },
    search: {
      placeholder: 'Buscar productos, proveedores, pedidos...',
      suggestions: 'Sugerencias',
      clear: 'Limpiar búsqueda',
      clearRecent: 'Limpiar búsquedas recientes',
      noResults: 'No se encontraron resultados',
      searchResults: 'Resultados de Búsqueda',
      recentSearches: 'Búsquedas Recientes',
      popularSearches: 'Búsquedas Populares',
      products: 'Productos',
      suppliers: 'Proveedores',
      orders: 'Pedidos',
      shoppingLists: 'Listas de Compras',
      analytics: 'Análisis',
      inventory: 'Inventario'
    }
  },
  'sv': {
    common: {
      search: 'Sök',
      loading: 'Laddar...',
      refresh: 'Uppdatera',
      verified: 'Verifierad',
      orders: 'Beställningar',
      totalSpent: 'Totalt Spenderat',
      lastOrder: 'Senaste Beställning',
      viewDetails: 'Visa Detaljer',
      placeOrder: 'Lägg Beställning',
      requestRelationship: 'Begär Relation',
      noSuppliersFound: 'Inga leverantörer hittades',
      noSuppliersMatch: 'Inga leverantörer matchar dina nuvarande filter',
      clearFilters: 'Rensa Filter',
      user: 'Användare',
      explore: 'Utforska',
      save: 'Spara',
      cancel: 'Avbryt',
      delete: 'Ta bort',
      edit: 'Redigera',
      add: 'Lägg till',
      close: 'Stäng',
      back: 'Tillbaka',
      next: 'Nästa',
      previous: 'Föregående',
      confirm: 'Bekräfta',
      yes: 'Ja',
      no: 'Nej',
      total: 'Totalt',
      filter: 'Filtrera',
      filters: 'Filter',
      clear: 'Rensa',
      clearAll: 'Rensa alla',
      apply: 'Tillämpa',
      reset: 'Återställ',
      export: 'Exportera',
      import: 'Importera',
      download: 'Ladda ner',
      upload: 'Ladda upp',
      view: 'Visa',
      details: 'Detaljer',
      actions: 'Åtgärder',
      status: 'Status',
      date: 'Datum',
      name: 'Namn',
      email: 'E-post',
      phone: 'Telefon',
      address: 'Adress',
      city: 'Stad',
      country: 'Land',
      price: 'Pris',
      quantity: 'Kvantitet',
      category: 'Kategori',
      supplier: 'Leverantör',
      customer: 'Kund',
      order: 'Beställning',
      sales: 'Försäljning',
      revenue: 'Intäkter',
      profit: 'Vinst',
      rating: 'Betyg',
      reviews: 'Recensioner',
      active: 'Aktiv',
      inactive: 'Inaktiv',
      pending: 'Väntande',
      approved: 'Godkänd',
      rejected: 'Avvisad',
      completed: 'Slutförd',
      cancelled: 'Avbruten',
      shipped: 'Skickad',
      delivered: 'Levererad',
      high: 'Hög',
      medium: 'Medium',
      low: 'Låg',
      new: 'Ny',
      featured: 'Utvald',
      onSale: 'På rea',
      lowStock: 'Låg lager',
      inStock: 'I lager',
      outOfStock: 'Slut i lager'
    },
    navigation: {
      dashboard: 'Instrumentpanel',
      suppliers: 'Leverantörer',
      products: 'Produkter',
      orders: 'Beställningar',
      shoppingList: 'Inköpslista',
      inventory: 'Lager',
      analysis: 'Analys',
      clients: 'Kunder',
      admin: 'Admin',
      profile: 'Profil',
      settings: 'Inställningar',
      logout: 'Logga ut',
      help: 'Hjälp'
    },
    roles: {
      user: 'Användare',
      admin: 'Admin',
      buyer: 'Köpare',
      supplier: 'Leverantör',
      client: 'Klient'
    },
    suppliers: {
      mySuppliers: 'Mina Leverantörer',
      manageRelationships: 'Hantera Relationer',
      searchPlaceholder: 'Sök leverantörer...',
      insights: 'Insikter',
      explore: 'Utforska',
      title: 'Leverantörer',
      subtitle: 'Hantera dina leverantörsrelationer',
      addSupplier: 'Lägg till leverantör',
      searchSuppliers: 'Sök leverantörer, märken, kategorier',
      filterByCategory: 'Filtrera efter kategori',
      filterByStatus: 'Filtrera efter status',
      viewDetails: 'Visa detaljer',
      placeOrder: 'Lägg beställning',
      requestRelationship: 'Begär relation',
      exploreSuppliers: 'Utforska leverantörer',
      supplierProfile: 'Leverantörsprofil',
      companyName: 'Företagsnamn',
      contactPerson: 'Kontaktperson',
      businessHours: 'Öppettider',
      minimumOrderAmount: 'Minsta beställningsbelopp',
      deliveryAreas: 'Leveransområden',
      totalOrders: 'Totalt antal beställningar',
      totalSpent: 'Totalt spenderat',
      lastOrderDate: 'Senaste beställningsdatum',
      relationshipStatus: 'Relationsstatus',
      verified: 'Verifierad',
      unverified: 'Overifierad'
    },
    login: {
      welcomeBack: 'Välkommen Tillbaka',
      createAccount: 'Skapa Konto',
      signInMessage: 'Logga in på ditt konto',
      joinMessage: 'Gå med i vår plattform idag',
      email: 'E-postadress',
      password: 'Lösenord',
      confirmPassword: 'Bekräfta Lösenord',
      firstName: 'Förnamn',
      lastName: 'Efternamn',
      signIn: 'Logga In',
      signUp: 'Registrera Dig',
      forgotPassword: 'Glömt lösenordet?',
      rememberMe: 'Kom ihåg mig',
      alreadyHaveAccount: 'Har du redan ett konto?',
      dontHaveAccount: 'Har du inget konto?',
      termsAndConditions: 'Jag accepterar Användarvillkoren',
      privacyPolicy: 'Integritetspolicy'
    },
    buyerInsights: {
      title: 'Köparinsikter',
      subtitle: 'Analys och prestandadata för ditt företag',
      aiAnalysis: 'AI-analys',
      downloadReport: 'Ladda ner rapport',
      dateRange: 'Datumintervall',
      store: 'Butik',
      salesEuro: 'Försäljning (€)',
      orders: 'Beställningar',
      avgOrderEuro: 'Genomsnittlig beställning (€)',
      frequency: 'Frekvens',
      amountOfStores: 'Antal butiker',
      noData: 'Ingen data tillgänglig',
      generate: 'Generera',
      addComparison: 'Lägg till jämförelse',
      sales: 'Försäljning',
      deliveries: 'Leveranser',
      deliveryDate: 'Leveransdatum'
    },
    clientInsights: {
      title: 'Kundinsikter',
      subtitle: 'Analys och prestandadata för dina kunder',
      addFilter: 'Lägg till filter',
      orders: 'Beställningar',
      fromDate: 'Från datum',
      toDate: 'Till datum',
      addComparison: 'Lägg till jämförelse',
      generate: 'Generera',
      highVolume: 'Hög volym',
      analyticsChart: 'Analysdiagram',
      salesAndOrdersOverview: 'Översikt av försäljning och beställningar',
      customerPerformance: 'Kundprestanda',
      salesAndOrderAnalysis: 'Försäljnings- och beställningsanalys',
      amountOfStores: 'Antal butiker',
      graphicFilters: 'GRAFIK (filter): försäljningsbeställningar',
      listFilters: 'LISTA (Filter)',
      averageOrder: 'Genomsnittlig beställning',
      frequency: 'Frekvens',
      leadTime: 'Leveranstid',
      days: 'dagar',
      noData: 'Ingen data tillgänglig',
      loadingData: 'Laddar kunddata...',
      errorLoading: 'Fel vid laddning av data',
      salesAnalytics: 'Försäljningsanalys',
      topPerformingClients: 'Bäst Presterande Kunder',
      trendAnalysis: 'Trendanalys',
      seasonalPatterns: 'Säsongsmönster',
      growthRate: 'Tillväxttakt',
      averageOrderValue: 'Genomsnittligt Beställningsvärde',
      peakSeason: 'Högsäsong',
      lowSeason: 'Lågsäsong',
      mayJune: 'Maj-Juni',
      octNov: 'Okt-Nov',
      upward: 'Uppåtgående',
      client: 'Kund',
      ordersCount: 'Beställningar',
      averageOrderAmount: 'Genomsnittlig beställning',
      frequencyValue: 'Frekvens'
    },
    language: {
      selectLanguage: 'Välj språk',
      english: 'Engelska',
      spanish: 'Spanska',
      swedish: 'Svenska',
      french: 'Franska',
      german: 'Tyska',
      italian: 'Italienska',
      portuguese: 'Portugisiska',
      dutch: 'Holländska',
      norwegian: 'Norska',
      danish: 'Danska',
      finnish: 'Finska'
    },
    companies: {
      stockfiller: 'Stockfiller.com',
      stocknetMicrodistribution: 'StockNet Microdistribution',
      stocknetMacrodistribution: 'StockNet Macrodistribution',
      deepGreenWholesalers: 'Deep Green Wholesalers',
      deepGreenRetailers: 'Deep Green Retailers',
      cityWareMerchants: 'City Ware Merchants'
    },
    months: {
      jan: 'Jan',
      feb: 'Feb',
      mar: 'Mar',
      apr: 'Apr',
      may: 'Maj',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Aug',
      sep: 'Sep',
      oct: 'Okt',
      nov: 'Nov',
      dec: 'Dec'
    },
    platform: {
      cesto: 'CESTO',
      aiPlatform: 'AI-plattform',
      stockfiller: 'Stockfiller.com'
    },
    search: {
      placeholder: 'Sök produkter, leverantörer, beställningar...',
      suggestions: 'Förslag',
      clear: 'Rensa sökning',
      clearRecent: 'Rensa senaste sökningar',
      noResults: 'Inga resultat hittades',
      searchResults: 'Sökresultat',
      recentSearches: 'Senaste Sökningar',
      popularSearches: 'Populära Sökningar',
      products: 'Produkter',
      suppliers: 'Leverantörer',
      orders: 'Beställningar',
      shoppingLists: 'Inköpslistor',
      analytics: 'Analys',
      inventory: 'Lager'
    }
  }
};

export interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  private translationsSubject = new BehaviorSubject<any>(fallbackTranslations['en']);
  
  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  public translations$ = this.translationsSubject.asObservable();
  
  private currentLanguage = 'en';
  private translations = fallbackTranslations['en'];

  // Available languages configuration
  public readonly availableLanguages: LanguageConfig[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' }
  ];

  constructor(private http: HttpClient) {
    // Load saved language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.loadTranslations(savedLanguage);
  }

  initializeLanguage(): void {
    // Load saved language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.loadTranslations(savedLanguage);
  }

  /**
   * Load translations from JSON file
   */
  private loadTranslations(languageCode: string): void {
    this.http.get(`/assets/i18n/${languageCode}.json`)
      .pipe(
        map((data: any) => data || fallbackTranslations[languageCode] || fallbackTranslations['en']),
        catchError(() => {
          console.warn(`Failed to load translations for ${languageCode}, using fallback`);
          return of(fallbackTranslations[languageCode] || fallbackTranslations['en']);
        })
      )
      .subscribe(translations => {
        this.currentLanguage = languageCode;
        this.translations = translations;
        
        // Update subjects
        this.currentLanguageSubject.next(languageCode);
        this.translationsSubject.next(this.translations);
        
        // Save to localStorage
        localStorage.setItem('selectedLanguage', languageCode);
        
        // Update document language attribute
        document.documentElement.lang = languageCode;
      });
  }


  /**
   * Set the current language
   */
  setLanguage(languageCode: string): void {
    this.loadTranslations(languageCode);
  }

  /**
   * Get the current language code
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): LanguageConfig[] {
    return this.availableLanguages;
  }

  /**
   * Get current language configuration
   */
  getCurrentLanguageConfig(): LanguageConfig | undefined {
    return this.availableLanguages.find(lang => lang.code === this.currentLanguage);
  }

  /**
   * Translate a key with optional parameters
   */
  translate(key: string, params?: { [key: string]: any }): string {
    const keys = key.split('.');
    let value: any = this.translations;
    
    // Navigate through nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key '${key}' not found in language '${this.currentLanguage}'`);
        return key; // Return the key itself if translation not found
      }
    }
    
    // If value is a string, apply parameters if provided
    if (typeof value === 'string') {
      if (params) {
        return this.interpolate(value, params);
      }
      return value;
    }
    
    console.warn(`Translation key '${key}' is not a string in language '${this.currentLanguage}'`);
    return key;
  }

  /**
   * Get a translation object for a specific section
   */
  getSection(section: string): any {
    return this.translations[section] || {};
  }

  /**
   * Check if a translation key exists
   */
  hasKey(key: string): boolean {
    const keys = key.split('.');
    let value: any = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return false;
      }
    }
    
    return typeof value === 'string';
  }

  /**
   * Interpolate parameters in a translation string
   */
  private interpolate(template: string, params: { [key: string]: any }): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  /**
   * Get a formatted date string in the current language
   */
  formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = this.getLocaleFromLanguageCode(this.currentLanguage);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString(locale, defaultOptions);
  }

  /**
   * Get a formatted number string in the current language
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.getLocaleFromLanguageCode(this.currentLanguage);
    
    const defaultOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options
    };
    
    return number.toLocaleString(locale, defaultOptions);
  }

  /**
   * Get a formatted currency string in the current language
   */
  formatCurrency(amount: number, currency: string = 'EUR', options?: Intl.NumberFormatOptions): string {
    const locale = this.getLocaleFromLanguageCode(this.currentLanguage);
    
    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    };
    
    return amount.toLocaleString(locale, defaultOptions);
  }

  /**
   * Convert language code to locale
   */
  private getLocaleFromLanguageCode(languageCode: string): string {
    const localeMap: { [key: string]: string } = {
      'en': 'en-US',
      'es': 'es-ES',
      'sv': 'sv-SE',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'nl': 'nl-NL',
      'no': 'nb-NO',
      'da': 'da-DK',
      'fi': 'fi-FI'
    };
    
    return localeMap[languageCode] || 'en-US';
  }

  /**
   * Get the current language name
   */
  getCurrentLanguageName(): string {
    const config = this.getCurrentLanguageConfig();
    return config ? config.name : 'English';
  }

  /**
   * Get the current language flag
   */
  getCurrentLanguageFlag(): string {
    const config = this.getCurrentLanguageConfig();
    return config ? config.flag : '🇺🇸';
  }
}