# Client Insights Dashboard - Functional Filters

Este componente implementa un sistema completo de filtros funcionales para el dashboard de análisis de clientes.

## Características Implementadas

### 1. Dropdown de Filtros Dinámico
- **Botón "+ Choose filter"**: Abre un dropdown con opciones de filtros disponibles
- **Filtros dinámicos**: Se cargan desde el servicio de analytics
- **Filtros primarios**: Sales, Orders, Delivere, Delivery date
- **Filtros secundarios**: Customer Type, Region, Product Category

### 2. Filtros Activos
- **Pestañas de filtros**: Muestran los filtros seleccionados
- **Indicador activo**: El filtro seleccionado se resalta en azul
- **Botón de eliminar**: Cada filtro tiene un "×" para eliminarlo
- **Selección múltiple**: Se pueden tener varios filtros activos

### 3. Filtros de Fecha
- **Rango de fechas**: Inputs para fecha desde y hasta
- **Actualización automática**: Los datos se refrescan al cambiar las fechas
- **Validación**: Las fechas se validan automáticamente

### 4. Filtros Adicionales
- **Filtros por chips**: High Volume, High Frequency, New Customers
- **Toggle activo/inactivo**: Los chips cambian de color al activarse
- **Filtrado combinado**: Se pueden combinar con otros filtros

### 5. Funcionalidad de Comparación
- **Botón "Add comparison"**: Activa el modo de comparación
- **Filtros de comparación**: Permite seleccionar un rango de fechas diferente
- **Aplicación de comparación**: Botón para ejecutar la comparación

### 6. Generación de Reportes
- **Botón "Generate"**: Genera reportes con los filtros actuales
- **Estado de carga**: Muestra indicador mientras genera el reporte
- **Deshabilitación temporal**: El botón se deshabilita durante la generación

## Funcionalidad Técnica

### Servicio de Analytics
El `AnalyticsService` proporciona:
- Datos mock para diferentes tipos de filtros
- Lógica de filtrado por fecha y tipo
- Generación de reportes
- Funcionalidad de comparación

### Estados del Componente
- `selectedFilter`: Filtro principal seleccionado
- `filters`: Array de filtros activos
- `dateRange`: Rango de fechas seleccionado
- `additionalFilters`: Filtros adicionales activos
- `showComparison`: Estado de la funcionalidad de comparación
- `isLoading`: Estado de carga para operaciones asíncronas

### Métodos Principales
- `onFilterChange()`: Cambia el filtro principal y recarga datos
- `onDateRangeChange()`: Actualiza datos al cambiar fechas
- `toggleFilterDropdown()`: Controla la visibilidad del dropdown
- `addFilter()`: Agrega un nuevo filtro
- `removeFilter()`: Elimina un filtro específico
- `toggleAdditionalFilter()`: Activa/desactiva filtros adicionales
- `generateReport()`: Genera reporte con filtros actuales
- `addComparison()`: Activa/desactiva modo comparación

## Uso

### Cambiar Filtro Principal
1. Haz clic en una de las pestañas de filtros (Sales, Orders, etc.)
2. Los datos del gráfico y tabla se actualizarán automáticamente

### Agregar Nuevos Filtros
1. Haz clic en "+ Choose filter"
2. Selecciona un filtro del dropdown
3. El filtro aparecerá como una nueva pestaña

### Filtrar por Fecha
1. Selecciona fecha de inicio en el primer input
2. Selecciona fecha de fin en el segundo input
3. Los datos se filtrarán automáticamente

### Usar Filtros Adicionales
1. Haz clic en los chips de filtros (High Volume, etc.)
2. Los chips activos se resaltarán en azul
3. Los datos se filtrarán según los criterios seleccionados

### Generar Reporte
1. Configura todos los filtros deseados
2. Haz clic en "Generate"
3. El sistema generará un reporte con los filtros aplicados

### Comparar Períodos
1. Haz clic en "Add comparison"
2. Selecciona un rango de fechas diferente
3. Haz clic en "Apply Comparison"
4. Los datos se compararán entre períodos

## Datos Mock

El servicio incluye datos de ejemplo para:
- **Ventas**: Datos mensuales de febrero 2022 a enero 2023
- **Órdenes**: Número de órdenes por mes
- **Fechas de entrega**: Porcentajes de cumplimiento
- **Clientes**: 5 clientes de ejemplo con diferentes métricas

## Estilos

Los filtros incluyen:
- Animaciones suaves para transiciones
- Estados hover y active
- Indicadores de carga
- Responsive design para móviles
- Colores consistentes con el tema de la aplicación

## Próximas Mejoras

- Integración con API real
- Más tipos de filtros
- Exportación de datos filtrados
- Filtros guardados/predefinidos
- Gráficos comparativos lado a lado
