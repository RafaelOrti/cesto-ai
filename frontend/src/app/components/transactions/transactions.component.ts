import { Component, OnInit } from '@angular/core';

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'adjustment' | 'commission';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  orderId?: string;
  supplierId?: string;
  date: string;
  paymentMethod?: string;
  fees?: number;
  netAmount?: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  supplierLogo: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  paymentTerms: string;
  notes?: string;
}

interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'credit_card' | 'paypal' | 'swish';
  name: string;
  details: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayments: number;
  overdueInvoices: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  revenueChange: number;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  selectedTab = 'transactions';
  searchQuery = '';
  selectedType = 'all';
  selectedStatus = 'all';
  dateRange = '30d';
  showFilters = false;

  // Financial summary
  financialSummary: FinancialSummary = {
    totalRevenue: 125430.50,
    totalExpenses: 89450.30,
    netProfit: 35980.20,
    pendingPayments: 12500.00,
    overdueInvoices: 2300.00,
    thisMonthRevenue: 25430.50,
    lastMonthRevenue: 21890.30,
    revenueChange: 16.2
  };

  // Transactions
  transactions: Transaction[] = [
    {
      id: '1',
      type: 'payment',
      status: 'completed',
      amount: 2304.50,
      currency: 'SEK',
      description: 'Payment to Fever Tree Beverages',
      reference: 'PAY-2024-001',
      orderId: 'ORD-2024-001',
      supplierId: 'SUP-001',
      date: '2024-01-18T14:30:00Z',
      paymentMethod: 'Bank Transfer',
      fees: 5.50,
      netAmount: 2299.00
    },
    {
      id: '2',
      type: 'payment',
      status: 'completed',
      amount: 720.00,
      currency: 'SEK',
      description: 'Payment to Luntgårdena Mejeri',
      reference: 'PAY-2024-002',
      orderId: 'ORD-2024-002',
      supplierId: 'SUP-002',
      date: '2024-01-17T10:15:00Z',
      paymentMethod: 'Credit Card',
      fees: 21.60,
      netAmount: 698.40
    },
    {
      id: '3',
      type: 'refund',
      status: 'completed',
      amount: -57.60,
      currency: 'SEK',
      description: 'Refund for damaged products',
      reference: 'REF-2024-001',
      orderId: 'ORD-2024-001',
      date: '2024-01-19T16:45:00Z',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '4',
      type: 'commission',
      status: 'pending',
      amount: 125.50,
      currency: 'SEK',
      description: 'Platform commission',
      reference: 'COM-2024-001',
      date: '2024-01-20T09:00:00Z'
    }
  ];

  // Invoices
  invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      supplier: 'Fever Tree Beverages',
      supplierLogo: 'assets/images/suppliers/fever-tree.png',
      amount: 2304.50,
      tax: 576.13,
      total: 2880.63,
      status: 'paid',
      issueDate: '2024-01-15',
      dueDate: '2024-01-22',
      paidDate: '2024-01-18',
      paymentTerms: 'Net 7',
      items: [
        {
          id: '1',
          productName: 'Premium Indian Tonic Water',
          quantity: 8,
          unitPrice: 288.06,
          totalPrice: 2304.50
        }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      supplier: 'Luntgårdena Mejeri',
      supplierLogo: 'assets/images/suppliers/luntgarden.png',
      amount: 720.00,
      tax: 180.00,
      total: 900.00,
      status: 'paid',
      issueDate: '2024-01-12',
      dueDate: '2024-01-19',
      paidDate: '2024-01-17',
      paymentTerms: 'Net 7',
      items: [
        {
          id: '2',
          productName: 'Organic Milk 330ml',
          quantity: 12,
          unitPrice: 60.00,
          totalPrice: 720.00
        }
      ]
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      supplier: 'TT Beverage Supplier',
      supplierLogo: 'assets/images/suppliers/tt-beverage.png',
      amount: 2040.00,
      tax: 510.00,
      total: 2550.00,
      status: 'overdue',
      issueDate: '2024-01-10',
      dueDate: '2024-01-17',
      paymentTerms: 'Net 7',
      items: [
        {
          id: '3',
          productName: 'Non-Alcoholic Origin',
          quantity: 24,
          unitPrice: 85.00,
          totalPrice: 2040.00
        }
      ]
    }
  ];

  // Payment methods
  paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'bank_transfer',
      name: 'Bank Transfer',
      details: 'SEB Bank ****1234',
      isDefault: true,
      status: 'active'
    },
    {
      id: '2',
      type: 'credit_card',
      name: 'Credit Card',
      details: 'Visa ****5678',
      isDefault: false,
      status: 'active'
    },
    {
      id: '3',
      type: 'swish',
      name: 'Swish',
      details: '+46 70 123 4567',
      isDefault: false,
      status: 'active'
    }
  ];

  transactionTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'payment', name: 'Payments' },
    { id: 'refund', name: 'Refunds' },
    { id: 'adjustment', name: 'Adjustments' },
    { id: 'commission', name: 'Commissions' }
  ];

  transactionStatuses = [
    { id: 'all', name: 'All Status' },
    { id: 'pending', name: 'Pending' },
    { id: 'completed', name: 'Completed' },
    { id: 'failed', name: 'Failed' },
    { id: 'cancelled', name: 'Cancelled' }
  ];

  invoiceStatuses = [
    { id: 'all', name: 'All Status' },
    { id: 'draft', name: 'Draft' },
    { id: 'sent', name: 'Sent' },
    { id: 'paid', name: 'Paid' },
    { id: 'overdue', name: 'Overdue' },
    { id: 'cancelled', name: 'Cancelled' }
  ];

  dateRanges = [
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 90 Days' },
    { id: '1y', name: 'Last Year' }
  ];

  get filteredTransactions(): Transaction[] {
    let filtered = this.transactions;

    // Type filter
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === this.selectedType);
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === this.selectedStatus);
    }

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        transaction.orderId?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return filtered;
  }

  get totalTransactionsAmount(): number {
    return this.filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  get pendingTransactionsCount(): number {
    return this.transactions.filter(transaction => transaction.status === 'pending').length;
  }

  get overdueInvoicesCount(): number {
    return this.invoices.filter(invoice => invoice.status === 'overdue').length;
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  onTabSelect(tab: string): void {
    this.selectedTab = tab;
  }

  onSearch(): void {
    // Search functionality is handled by getter
  }

  onTypeChange(type: string): void {
    this.selectedType = type;
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
  }

  onDateRangeChange(range: string): void {
    this.dateRange = range;
    this.loadTransactions();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = 'all';
    this.selectedStatus = 'all';
  }

  exportTransactions(): void {
    console.log('Exporting transactions...');
  }

  exportInvoices(): void {
    console.log('Exporting invoices...');
  }

  generateFinancialReport(): void {
    console.log('Generating financial report...');
  }

  payInvoice(invoice: Invoice): void {
    if (confirm(`Pay invoice ${invoice.invoiceNumber} for ${this.formatCurrency(invoice.total)}?`)) {
      invoice.status = 'paid';
      invoice.paidDate = new Date().toISOString().split('T')[0];
      console.log('Invoice paid:', invoice.invoiceNumber);
    }
  }

  viewTransactionDetails(transaction: Transaction): void {
    console.log('View transaction details:', transaction.id);
  }

  downloadInvoice(invoice: Invoice): void {
    console.log('Download invoice:', invoice.invoiceNumber);
  }

  sendInvoiceReminder(invoice: Invoice): void {
    console.log('Send reminder for invoice:', invoice.invoiceNumber);
  }

  addPaymentMethod(): void {
    console.log('Add new payment method...');
  }

  setDefaultPaymentMethod(method: PaymentMethod): void {
    this.paymentMethods.forEach(pm => pm.isDefault = false);
    method.isDefault = true;
    console.log('Default payment method set to:', method.name);
  }

  removePaymentMethod(method: PaymentMethod): void {
    if (confirm(`Remove payment method ${method.name}?`)) {
      const index = this.paymentMethods.indexOf(method);
      if (index > -1) {
        this.paymentMethods.splice(index, 1);
      }
      console.log('Payment method removed:', method.name);
    }
  }

  getTransactionTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      'payment': 'type-payment',
      'refund': 'type-refund',
      'adjustment': 'type-adjustment',
      'commission': 'type-commission'
    };
    return classes[type] || 'type-payment';
  }

  getTransactionStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'status-pending',
      'completed': 'status-completed',
      'failed': 'status-failed',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-pending';
  }

  getInvoiceStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'draft': 'status-draft',
      'sent': 'status-sent',
      'paid': 'status-paid',
      'overdue': 'status-overdue',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-draft';
  }

  getTransactionTypeName(type: string): string {
    const names: { [key: string]: string } = {
      'payment': 'Payment',
      'refund': 'Refund',
      'adjustment': 'Adjustment',
      'commission': 'Commission'
    };
    return names[type] || 'Payment';
  }

  getTransactionStatusName(status: string): string {
    const names: { [key: string]: string } = {
      'pending': 'Pending',
      'completed': 'Completed',
      'failed': 'Failed',
      'cancelled': 'Cancelled'
    };
    return names[status] || 'Pending';
  }

  getInvoiceStatusName(status: string): string {
    const names: { [key: string]: string } = {
      'draft': 'Draft',
      'sent': 'Sent',
      'paid': 'Paid',
      'overdue': 'Overdue',
      'cancelled': 'Cancelled'
    };
    return names[status] || 'Draft';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('sv-SE');
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('sv-SE');
  }

  formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  private loadTransactions(): void {
    // Load transactions from API based on selected date range
    console.log('Loading transactions for:', this.dateRange);
  }
}
