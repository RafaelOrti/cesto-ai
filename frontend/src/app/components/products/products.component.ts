import { Component, OnInit } from '@angular/core';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Tab {
  id: string;
  label: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  supplier: string;
  volume: string;
  quantity: string;
  pricePerPiece: number;
  totalPrice: number;
  originalPrice?: number;
  discount?: number;
  bestBefore?: string;
  isCampaign?: boolean;
  category: string;
}

interface Offer {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  volume: string;
  deliveryDate: string;
  category: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'all';
  selectedTab = 'all-items';
  showTutorial = true;

  categories: Category[] = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'fruits', name: 'Fruits & Vegetables', icon: '🥕' },
    { id: 'meat', name: 'Meat & Deli', icon: '🥩' },
    { id: 'frozen', name: 'Frozen', icon: '🧊' },
    { id: 'seafood', name: 'Fresh Seafood', icon: '🐟' },
    { id: 'bakery', name: 'Bakery', icon: '🥖' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' }
  ];

  tabs: Tab[] = [
    { id: 'all-items', label: 'All Items/Artículos' },
    { id: 'on-sale', label: 'On Sale' }
  ];

  private popularProductsData: Product[] = [
    {
      id: 1,
      name: 'Fever Tree Premium Indian Tonic Water',
      image: 'assets/images/products/tonic-water.png',
      supplier: 'Fever Tree The beverage supplier',
      volume: '500 ml',
      quantity: '8 PC',
      pricePerPiece: 28.8,
      totalPrice: 230.4,
      category: 'drink'
    },
    {
      id: 2,
      name: 'Milk 330 ml',
      image: 'assets/images/products/milk.png',
      supplier: 'Luntgårdena Mejeri',
      volume: '330 ml',
      quantity: '12 st',
      pricePerPiece: 6,
      totalPrice: 72,
      originalPrice: 144,
      discount: 50,
      bestBefore: '2022-12-24',
      isCampaign: true,
      category: 'dairy'
    },
    {
      id: 3,
      name: 'Fuzn Slim All White',
      image: 'assets/images/products/snus.png',
      supplier: 'General G. 4 Snus supplier',
      volume: '19.2 g',
      quantity: '240 st',
      pricePerPiece: 15,
      totalPrice: 3600,
      category: 'tobacco'
    },
    {
      id: 4,
      name: 'Non-Alcoholic Origin',
      image: 'assets/images/products/non-alcoholic.png',
      supplier: 'TT Beverage supplier',
      volume: '33 cl',
      quantity: '24 st',
      pricePerPiece: 8.5,
      totalPrice: 204,
      category: 'drink'
    }
  ];

  private offersData: Offer[] = [
    {
      id: 1,
      name: 'Yabba Lamborghini Energy Drink 250ml Pál (2024-10-05)',
      image: 'assets/images/products/energy-drink.png',
      originalPrice: 32,
      discountPrice: 24,
      discount: 25,
      volume: '250 ml',
      deliveryDate: 'Första leverans 21 Mars - Mar',
      category: 'drink'
    },
    {
      id: 2,
      name: 'RSCUED shot Citron/Sichuan 6 cl',
      image: 'assets/images/products/shot.png',
      originalPrice: 40,
      discountPrice: 30,
      discount: 25,
      volume: '6 cl',
      deliveryDate: 'Första leverans 21 Mars - Mar',
      category: 'drink'
    },
    {
      id: 3,
      name: 'Gowell Jordgubb & Hallon & Myrts',
      image: 'assets/images/products/gowell1.png',
      originalPrice: 40,
      discountPrice: 30,
      discount: 25,
      volume: '33 cl',
      deliveryDate: 'Första leverans 21 Mars - Mar',
      category: 'drink'
    },
    {
      id: 4,
      name: 'Gowell Jordgubb & Lime',
      image: 'assets/images/products/gowell2.png',
      originalPrice: 40,
      discountPrice: 30,
      discount: 25,
      volume: '33 cl',
      deliveryDate: 'Första leverans 21 Mars - Mar',
      category: 'drink'
    },
    {
      id: 5,
      name: 'Gowell Ananas & Kaktus',
      image: 'assets/images/products/gowell3.png',
      originalPrice: 40,
      discountPrice: 30,
      discount: 25,
      volume: '33 cl',
      deliveryDate: 'Första leverans 21 Mars - Mar',
      category: 'drink'
    }
  ];

  get popularProducts(): Product[] {
    return this.filterProductsByCategory(this.popularProductsData);
  }

  get offers(): Offer[] {
    return this.filterOffersByCategory(this.offersData);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterProducts();
  }

  onTabSelect(tabId: string): void {
    this.selectedTab = tabId;
    this.filterProducts();
  }

  onSearch(): void {
    this.filterProducts();
  }

  addToCart(product: Product | Offer): void {
    // Implementation for adding to cart
  }

  addToCheckout(product: Product | Offer): void {
    // Implementation for adding to checkout
  }

  buyProduct(product: Product | Offer): void {
    // Implementation for buying product
  }

  closeTutorial(): void {
    this.showTutorial = false;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  private loadProducts(): void {
    // Load products from API
  }

  private filterProducts(): void {
    // Implementation for filtering products
  }

  private filterProductsByCategory(products: Product[]): Product[] {
    if (this.selectedCategory === 'all') return products;
    return products.filter(product => product.category === this.selectedCategory);
  }

  private filterOffersByCategory(offers: Offer[]): Offer[] {
    if (this.selectedCategory === 'all') return offers;
    return offers.filter(offer => offer.category === this.selectedCategory);
  }
}
