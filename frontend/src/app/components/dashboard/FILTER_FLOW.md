# Flujo de Filtros Funcionales - Client Insights Dashboard

## Diagrama de Flujo

```
Usuario Interactúa con Filtros
           ↓
    [Dropdown de Filtros]
           ↓
    Selecciona Filtro
           ↓
    [AnalyticsService]
           ↓
    Procesa Filtros
           ↓
    Filtra Datos Mock
           ↓
    Retorna Datos Filtrados
           ↓
    [DashboardComponent]
           ↓
    Actualiza Vista
           ↓
    [Gráfico + Tabla + Leyenda]
```

## Componentes del Sistema

### 1. DashboardComponent
- **Estado**: selectedFilter, filters[], dateRange, additionalFilters[]
- **Métodos**: onFilterChange(), onDateRangeChange(), generateReport()
- **Responsabilidades**: Manejo de UI y coordinación de filtros

### 2. AnalyticsService
- **Datos**: Mock data para sales, orders, deliveryDate
- **Métodos**: getAnalyticsData(), generateReport(), addComparison()
- **Responsabilidades**: Lógica de filtrado y procesamiento de datos

### 3. Filtros Disponibles

#### Filtros Primarios
- **Sales**: Datos de ventas por mes
- **Orders**: Número de órdenes por mes  
- **Delivere**: Datos de entrega por mes
- **Delivery date**: Fechas de entrega

#### Filtros Secundarios
- **Customer Type**: Tipo de cliente
- **Region**: Región geográfica
- **Product Category**: Categoría de producto

#### Filtros Adicionales
- **High Volume**: Clientes con alto volumen
- **High Frequency**: Clientes con alta frecuencia
- **New Customers**: Clientes nuevos

## Flujo Detallado

### 1. Inicialización
```
ngOnInit() → loadInitialData() → forkJoin({
  filters: getFilters(),
  analytics: getAnalyticsData()
}) → updateAnalyticsData()
```

### 2. Cambio de Filtro Principal
```
onFilterChange(filter) → loadAnalyticsData() → 
getCurrentFilters() → analyticsService.getAnalyticsData() → 
updateAnalyticsData()
```

### 3. Cambio de Rango de Fechas
```
onDateRangeChange() → loadAnalyticsData() → 
getCurrentFilters() → analyticsService.getAnalyticsData() → 
updateAnalyticsData()
```

### 4. Generación de Reporte
```
generateReport() → analyticsService.generateReport() → 
{ reportId, filters, generatedAt, status }
```

### 5. Comparación
```
addComparison() → showComparison = true → 
applyComparison() → analyticsService.addComparison() → 
{ originalData, comparisonData, comparisonType }
```

## Estados de la Aplicación

### Estado Inicial
- selectedFilter: 'Sales'
- dateRange: { from: '2022-02-01', to: '2023-01-31' }
- filters: ['Sales', 'Orders', 'Delivere', 'Delivery date']
- additionalFilters: []

### Estado Durante Filtrado
- isLoading: true
- showFilterDropdown: false
- showComparison: false

### Estado con Comparación
- showComparison: true
- comparisonFilters: { dateRange: { from, to } }

## Datos Procesados

### Entrada
- Filtros seleccionados
- Rango de fechas
- Filtros adicionales activos

### Procesamiento
- Filtrar datos por fecha
- Aplicar filtros por tipo
- Calcular totales
- Generar datos de leyenda

### Salida
- chartData: Datos para el gráfico
- customerData: Datos de clientes filtrados
- summaryTotals: Totales calculados
- legendData: Datos de leyenda actualizados

## Ejemplo de Uso

1. **Usuario selecciona filtro "Orders"**
   - onFilterChange('Orders') se ejecuta
   - loadAnalyticsData() carga datos de órdenes
   - El gráfico muestra datos de órdenes por mes

2. **Usuario cambia rango de fechas**
   - onDateRangeChange() se ejecuta
   - Los datos se filtran por el nuevo rango
   - La tabla y gráfico se actualizan

3. **Usuario activa "High Volume"**
   - toggleAdditionalFilter() se ejecuta
   - Los datos se filtran para mostrar solo clientes de alto volumen
   - Los totales se recalculan

4. **Usuario genera reporte**
   - generateReport() se ejecuta
   - Se muestra indicador de carga
   - Se genera reporte con filtros actuales

## Beneficios del Sistema

- **Reactivo**: Los datos se actualizan automáticamente
- **Combinable**: Los filtros se pueden combinar
- **Persistente**: El estado se mantiene durante la sesión
- **Extensible**: Fácil agregar nuevos tipos de filtros
- **Performante**: Usa trackBy para optimizar rendering
- **User-Friendly**: Interfaz intuitiva con feedback visual
