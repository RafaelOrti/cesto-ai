# CESTO AI - Sistema de Colores Global

## Descripción General

El sistema de colores de CESTO AI está diseñado para proporcionar una experiencia visual consistente y profesional utilizando tonos de verde y grises. El sistema está completamente integrado con Angular Material y permite personalización dinámica de colores.

## Características Principales

- **Paleta de colores centralizada**: Todos los colores se gestionan desde un servicio central
- **Integración con Angular Material**: Compatible con todos los componentes de Material Design
- **Personalización dinámica**: Los colores se pueden cambiar en tiempo real
- **Presets predefinidos**: Incluye varios temas predefinidos
- **Responsive**: Se adapta a diferentes dispositivos y tamaños de pantalla

## Estructura del Sistema

### Servicio de Configuración de Colores

El `ColorConfigService` gestiona toda la configuración de colores:

```typescript
// Ubicación: src/app/core/services/color-config.service.ts
import { ColorConfigService } from './core/services/color-config.service';

// Obtener la paleta actual
const palette = this.colorConfigService.getPalette();

// Actualizar colores
this.colorConfigService.updatePalette(newPalette);

// Obtener un color específico
const primaryColor = this.colorConfigService.getColor('primary.main');
```

### Paleta de Colores por Defecto

```typescript
interface ColorPalette {
  primary: {
    main: '#2E7D32',      // Verde principal
    light: '#4CAF50',     // Verde claro
    dark: '#1B5E20',      // Verde oscuro
    contrast: '#FFFFFF'   // Contraste
  };
  secondary: {
    main: '#5f6368',      // Gris principal
    light: '#9aa0a6',     // Gris claro
    dark: '#3c4043',      // Gris oscuro
    contrast: '#FFFFFF'   // Contraste
  };
  // ... más colores
}
```

## Uso en Componentes

### 1. Usando Variables CSS

```scss
.my-component {
  background-color: var(--mat-primary-main);
  color: var(--mat-primary-contrast);
  border: 1px solid var(--mat-border-primary);
}
```

### 2. Usando el Servicio en TypeScript

```typescript
import { ColorConfigService } from '../core/services/color-config.service';

constructor(private colorConfig: ColorConfigService) {}

ngOnInit() {
  const primaryColor = this.colorConfig.getColor('primary.main');
  const gradient = this.colorConfig.getGradient('primary');
}
```

### 3. Clases de Utilidad

```html
<div class="mat-mdc-bg-primary mat-mdc-text-primary">
  Contenido con colores primarios
</div>

<button class="mat-mdc-border-primary mat-mdc-hover-lift">
  Botón con efectos
</button>
```

## Presets Disponibles

### 1. Default (Por defecto)
- Verde principal con grises secundarios
- Ideal para aplicaciones empresariales

### 2. Light (Claro)
- Tema claro con colores suaves
- Perfecto para interfaces limpias

### 3. Dark (Oscuro)
- Tema oscuro profesional
- Reduce la fatiga visual

### 4. Green Light (Verde Claro)
- Variación verde más suave
- Ideal para aplicaciones ecológicas

### 5. Green Dark (Verde Oscuro)
- Tema verde oscuro intenso
- Para aplicaciones especializadas

## Componentes Material Design

Todos los componentes de Angular Material están personalizados para usar el sistema de colores:

### Botones
```html
<button mat-raised-button color="primary">Primario</button>
<button mat-stroked-button color="primary">Secundario</button>
<button mat-flat-button color="accent">Acento</button>
```

### Tarjetas
```html
<mat-card class="mat-mdc-hover-lift">
  <mat-card-content>
    Contenido de la tarjeta
  </mat-card-content>
</mat-card>
```

### Formularios
```html
<mat-form-field appearance="outline">
  <mat-label>Campo de texto</mat-label>
  <input matInput>
</mat-form-field>
```

## Personalización Avanzada

### 1. Componente de Configuración

El componente `ColorConfigComponent` permite personalizar colores visualmente:

```html
<app-color-config></app-color-config>
```

### 2. Crear Presets Personalizados

```typescript
const customPreset: Partial<ColorPalette> = {
  primary: {
    main: '#FF5722',
    light: '#FF8A65',
    dark: '#D84315',
    contrast: '#FFFFFF'
  }
};

this.colorConfigService.updatePalette(customPreset);
```

### 3. Gradientes Personalizados

```scss
.custom-gradient {
  background: var(--mat-primary-gradient);
}

.custom-success-gradient {
  background: var(--mat-success-gradient);
}
```

## Clases de Utilidad Disponibles

### Colores de Texto
- `.mat-mdc-text-primary`
- `.mat-mdc-text-secondary`
- `.mat-mdc-text-disabled`
- `.mat-mdc-text-tertiary`

### Colores de Fondo
- `.mat-mdc-bg-primary`
- `.mat-mdc-bg-secondary`
- `.mat-mdc-bg-accent`
- `.mat-mdc-bg-surface`

### Bordes
- `.mat-mdc-border-primary`
- `.mat-mdc-border-secondary`
- `.mat-mdc-border-light`

### Sombras
- `.mat-mdc-shadow-sm`
- `.mat-mdc-shadow-md`
- `.mat-mdc-shadow-lg`
- `.mat-mdc-shadow-xl`

### Transiciones
- `.mat-mdc-transition-fast`
- `.mat-mdc-transition-normal`
- `.mat-mdc-transition-slow`

### Efectos de Hover
- `.mat-mdc-hover-lift`
- `.mat-mdc-hover-scale`

## Responsive Design

El sistema incluye utilidades responsive:

```html
<!-- Ocultar en móvil -->
<div class="mat-mdc-mobile-hidden">Contenido desktop</div>

<!-- Mostrar solo en móvil -->
<div class="mat-mdc-desktop-hidden">Contenido móvil</div>
```

## Accesibilidad

### Estados de Enfoque
```scss
.mat-mdc-focus-visible {
  outline: 2px solid var(--mat-primary);
  outline-offset: 2px;
}
```

### Contraste
Todos los colores están diseñados para cumplir con los estándares de accesibilidad WCAG 2.1.

## Mejores Prácticas

### 1. Consistencia
- Siempre usa las variables CSS definidas
- No hardcodees colores en los componentes
- Usa el servicio para acceder a colores dinámicamente

### 2. Performance
- Las variables CSS son más eficientes que cambiar estilos dinámicamente
- El servicio aplica cambios de forma optimizada

### 3. Mantenibilidad
- Centraliza todos los cambios de color en el servicio
- Usa los presets cuando sea posible
- Documenta colores personalizados

## Ejemplos de Implementación

### Dashboard Component
```typescript
export class DashboardComponent implements OnInit {
  constructor(private colorConfig: ColorConfigService) {}

  ngOnInit() {
    // Aplicar tema personalizado
    this.colorConfig.updatePalette({
      primary: {
        main: '#2E7D32',
        light: '#4CAF50',
        dark: '#1B5E20',
        contrast: '#FFFFFF'
      }
    });
  }
}
```

### Custom Component Styles
```scss
.custom-widget {
  background: var(--mat-surface-primary);
  border: 1px solid var(--mat-border-primary);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--mat-primary);
    box-shadow: var(--mat-shadow-md);
  }

  .widget-title {
    color: var(--mat-primary);
    font-weight: 600;
  }

  .widget-content {
    color: var(--mat-text-primary);
  }
}
```

## Troubleshooting

### Problemas Comunes

1. **Colores no se aplican**: Verifica que el servicio esté inicializado
2. **Variables CSS no definidas**: Asegúrate de importar los estilos globales
3. **Componentes Material no estilizados**: Verifica la importación del tema

### Debug

```typescript
// Verificar paleta actual
console.log(this.colorConfigService.getPalette());

// Verificar color específico
console.log(this.colorConfigService.getColor('primary.main'));
```

## Actualizaciones Futuras

- Soporte para temas dinámicos basados en hora del día
- Integración con preferencias del sistema
- Más presets de colores
- Herramientas de contraste automático

---

Para más información o soporte, consulta la documentación de Angular Material o contacta al equipo de desarrollo.
