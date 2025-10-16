import { DataSource } from 'typeorm';

/**
 * Sample supplier data based on the image description
 */
export interface SampleSupplier {
  name: string;
  description: string;
  category: string;
  verified: boolean;
  freeDelivery: boolean;
  coDelivery: boolean;
  onSale: boolean;
  rating: number;
  reviewCount: number;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  address: string;
  specialties: string[];
  certifications: string[];
  minimumOrder: number;
  paymentTerms: string;
  establishedYear: number;
  employeeCount: string;
  annualRevenue: string;
  languages: string[];
  deliveryAreas: string[];
  responseTime: string;
}

/**
 * Initialize sample suppliers in the database
 */
export async function initializeSampleSuppliers(_dataSource: DataSource): Promise<void> {
  // This would typically use a suppliers repository
  // For now, we'll just log the sample data structure
  
  const sampleSuppliers: SampleSupplier[] = [
    {
      name: 'Engelmanns',
      description: 'Tenemos todo para la tabla de embutidos perfecta. ¡Bienvenido a descubrir sabores fantásticos con nosotros!',
      category: 'delicatessen',
      verified: true,
      freeDelivery: true,
      coDelivery: false,
      onSale: false,
      rating: 4.8,
      reviewCount: 156,
      contactEmail: 'contacto@engelmanns.com',
      contactPhone: '+34 91 123 4567',
      website: 'www.engelmanns.com',
      address: 'Madrid, España',
      specialties: ['Embutidos', 'Quesos', 'Vinos'],
      certifications: ['ISO 9001', 'HACCP'],
      minimumOrder: 100,
      paymentTerms: '30 días',
      establishedYear: 1985,
      employeeCount: '50-100',
      annualRevenue: '5M-10M',
      languages: ['Español', 'Inglés', 'Alemán'],
      deliveryAreas: ['Madrid', 'Barcelona', 'Valencia'],
      responseTime: '2 horas'
    },
    {
      name: 'Gastro Import',
      description: 'Tenemos más de 25 años de experiencia en la importación de especialidades gourmet de la región mediterránea que vendemos a restaurantes, tiendas de delicatessen y tiendas minoristas. La empresa fue fundada en 1988 y...',
      category: 'delicatessen',
      verified: true,
      freeDelivery: false,
      coDelivery: true,
      onSale: true,
      rating: 4.6,
      reviewCount: 89,
      contactEmail: 'ventas@gastroimport.es',
      contactPhone: '+34 93 987 6543',
      website: 'www.gastroimport.es',
      address: 'Barcelona, España',
      specialties: ['Productos mediterráneos', 'Aceites', 'Conservas'],
      certifications: ['ISO 9001', 'IFS'],
      minimumOrder: 200,
      paymentTerms: '15 días',
      establishedYear: 1988,
      employeeCount: '20-50',
      annualRevenue: '2M-5M',
      languages: ['Español', 'Catalán', 'Inglés'],
      deliveryAreas: ['Barcelona', 'Girona', 'Tarragona'],
      responseTime: '4 horas'
    },
    {
      name: 'Fresh Produce Co',
      description: 'Especialistas en productos frescos de temporada, cultivados localmente con los más altos estándares de calidad.',
      category: 'fruits-vegetables',
      verified: true,
      freeDelivery: true,
      coDelivery: true,
      onSale: false,
      rating: 4.9,
      reviewCount: 234,
      contactEmail: 'pedidos@freshproduce.com',
      contactPhone: '+34 96 555 1234',
      address: 'Valencia, España',
      specialties: ['Verduras de temporada', 'Frutas locales', 'Hierbas aromáticas'],
      certifications: ['Agricultura ecológica', 'GlobalGAP'],
      minimumOrder: 50,
      paymentTerms: '7 días',
      establishedYear: 1995,
      employeeCount: '10-20',
      annualRevenue: '1M-2M',
      languages: ['Español', 'Valenciano'],
      deliveryAreas: ['Valencia', 'Alicante', 'Castellón'],
      responseTime: '1 hora'
    },
    {
      name: 'Dairy Masters',
      description: 'Productores de lácteos premium con más de 30 años de experiencia en el sector.',
      category: 'dairy',
      verified: true,
      freeDelivery: true,
      coDelivery: false,
      onSale: true,
      rating: 4.7,
      reviewCount: 187,
      contactEmail: 'info@dairymasters.es',
      contactPhone: '+34 94 444 7777',
      website: 'www.dairymasters.es',
      address: 'Bilbao, España',
      specialties: ['Leche orgánica', 'Quesos artesanales', 'Yogures'],
      certifications: ['Agricultura ecológica', 'ISO 22000'],
      minimumOrder: 75,
      paymentTerms: '14 días',
      establishedYear: 1992,
      employeeCount: '30-50',
      annualRevenue: '3M-5M',
      languages: ['Español', 'Euskera'],
      deliveryAreas: ['País Vasco', 'Cantabria', 'La Rioja'],
      responseTime: '3 horas'
    },
    {
      name: 'Seafood Deluxe',
      description: 'Importadores directos de pescado y marisco fresco del Atlántico Norte.',
      category: 'seafood',
      verified: true,
      freeDelivery: false,
      coDelivery: true,
      onSale: false,
      rating: 4.5,
      reviewCount: 142,
      contactEmail: 'ventas@seafooddeluxe.com',
      contactPhone: '+34 98 888 9999',
      website: 'www.seafooddeluxe.com',
      address: 'Vigo, España',
      specialties: ['Pescado fresco', 'Marisco', 'Productos ahumados'],
      certifications: ['MSC', 'ASC', 'ISO 9001'],
      minimumOrder: 150,
      paymentTerms: '21 días',
      establishedYear: 1980,
      employeeCount: '40-60',
      annualRevenue: '8M-12M',
      languages: ['Español', 'Gallego', 'Inglés'],
      deliveryAreas: ['Galicia', 'Asturias', 'Madrid'],
      responseTime: '6 horas'
    },
    {
      name: 'Frozen Foods Ltd',
      description: 'Especialistas en productos congelados de alta calidad para el sector HORECA.',
      category: 'frozen',
      verified: true,
      freeDelivery: true,
      coDelivery: true,
      onSale: true,
      rating: 4.3,
      reviewCount: 98,
      contactEmail: 'pedidos@frozenfoodsltd.es',
      contactPhone: '+34 95 555 4444',
      address: 'Sevilla, España',
      specialties: ['Verduras congeladas', 'Pescado congelado', 'Preparados'],
      certifications: ['BRC', 'IFS'],
      minimumOrder: 200,
      paymentTerms: '30 días',
      establishedYear: 1998,
      employeeCount: '25-40',
      annualRevenue: '4M-6M',
      languages: ['Español', 'Inglés'],
      deliveryAreas: ['Andalucía', 'Extremadura', 'Murcia'],
      responseTime: '4 horas'
    }
  ];

  console.log('Sample suppliers data structure created:');
  sampleSuppliers.forEach((supplier, index) => {
    console.log(`${index + 1}. ${supplier.name} - ${supplier.category}`);
  });

  // In a real implementation, you would save these to the database
  // using the appropriate repository
  console.log('Sample suppliers initialization completed');
}

/**
 * Run the initialization if this script is executed directly
 */
if (require.main === module) {
  console.log('Initializing sample suppliers...');
}
