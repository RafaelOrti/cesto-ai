import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ean-management',
  templateUrl: './ean-management.component.html',
  styleUrls: ['./ean-management.component.scss']
})
export class EanManagementComponent implements OnInit {
  eanCodes: any[] = [];
  loading = false;
  selectedStatus = 'all';
  searchTerm = '';
  showAddModal = false;
  newEanCode = '';

  statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'expired', label: 'Expired' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadEanCodes();
  }

  loadEanCodes(): void {
    this.loading = true;
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.eanCodes = [
        {
          id: 1,
          eanCode: '1234567890123',
          productName: 'Organic Milk 1L',
          productId: 'PROD-001',
          status: 'active',
          createdAt: '2024-01-01',
          expiresAt: '2025-01-01',
          lastUsed: '2024-01-15',
          usageCount: 45
        },
        {
          id: 2,
          eanCode: '2345678901234',
          productName: 'Fresh Apples (kg)',
          productId: 'PROD-002',
          status: 'active',
          createdAt: '2024-01-02',
          expiresAt: '2025-01-02',
          lastUsed: '2024-01-14',
          usageCount: 32
        },
        {
          id: 3,
          eanCode: '3456789012345',
          productName: 'Ground Beef 500g',
          productId: 'PROD-003',
          status: 'pending',
          createdAt: '2024-01-10',
          expiresAt: '2025-01-10',
          lastUsed: null,
          usageCount: 0
        },
        {
          id: 4,
          eanCode: '4567890123456',
          productName: 'Frozen Vegetables Mix',
          productId: 'PROD-004',
          status: 'expired',
          createdAt: '2023-01-01',
          expiresAt: '2024-01-01',
          lastUsed: '2023-12-15',
          usageCount: 28
        }
      ];
      this.loading = false;
    }, 1000);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      case 'expired': return 'status-expired';
      default: return 'status-unknown';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'pending': return 'Pending';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.filterEanCodes();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterEanCodes();
  }

  filterEanCodes(): void {
    // Implement filtering logic
    // This would filter eanCodes based on selectedStatus and searchTerm
  }

  generateEanCode(): void {
    // Generate a new EAN code
    const newCode = this.generateRandomEan();
    this.newEanCode = newCode;
    this.showAddModal = true;
  }

  generateRandomEan(): string {
    // Generate a random 13-digit EAN code
    let ean = '';
    for (let i = 0; i < 12; i++) {
      ean += Math.floor(Math.random() * 10);
    }
    
    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(ean[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    ean += checkDigit;
    
    return ean;
  }

  addEanCode(): void {
    if (this.newEanCode && this.newEanCode.length === 13) {
      const newEan = {
        id: this.eanCodes.length + 1,
        eanCode: this.newEanCode,
        productName: 'New Product',
        productId: 'PROD-' + String(this.eanCodes.length + 1).padStart(3, '0'),
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastUsed: null,
        usageCount: 0
      };
      
      this.eanCodes.unshift(newEan);
      this.showAddModal = false;
      this.newEanCode = '';
    }
  }

  editEanCode(ean: any): void {
    console.log('Editing EAN code:', ean);
  }

  deactivateEanCode(ean: any): void {
    ean.status = 'inactive';
    console.log('Deactivating EAN code:', ean);
  }

  activateEanCode(ean: any): void {
    ean.status = 'active';
    console.log('Activating EAN code:', ean);
  }

  deleteEanCode(ean: any): void {
    const index = this.eanCodes.findIndex(item => item.id === ean.id);
    if (index > -1) {
      this.eanCodes.splice(index, 1);
    }
  }

  exportEanCodes(): void {
    console.log('Exporting EAN codes...');
  }

  importEanCodes(): void {
    console.log('Importing EAN codes...');
  }

  validateEanCode(eanCode: string): boolean {
    if (eanCode.length !== 13) return false;
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(eanCode[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return parseInt(eanCode[12]) === checkDigit;
  }

  getTotalActiveCodes(): number {
    return this.eanCodes.filter(code => code.status === 'active').length;
  }

  getTotalPendingCodes(): number {
    return this.eanCodes.filter(code => code.status === 'pending').length;
  }

  getTotalExpiredCodes(): number {
    return this.eanCodes.filter(code => code.status === 'expired').length;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('EAN code copied to clipboard:', text);
      // You could add a toast notification here
    }).catch(err => {
      console.error('Failed to copy EAN code:', err);
    });
  }
}