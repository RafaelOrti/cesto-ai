import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PaginatedResponse } from '../../shared/types/common.types';

export interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'adjustment' | 'commission';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  orderId?: string;
  supplierId?: string;
  supplierName?: string;
  date: string;
  paymentMethod: string;
  fees: number;
  netAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplier: {
    id: string;
    name: string;
    logo?: string;
  };
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentTerms: string;
  items: InvoiceItem[];
  notes?: string;
  attachments?: string[];
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: {
    id: string;
    name: string;
    logo?: string;
  };
  status: 'draft' | 'sent' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  totalAmount: number;
  items: PurchaseOrderItem[];
  approvalRequired: boolean;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  attachments?: string[];
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'credit_card' | 'paypal' | 'swish' | 'invoice';
  name: string;
  details: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayments: number;
  overdueInvoices: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  revenueChange: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') apiBaseUrl: string
  ) {
    this.apiUrl = `${apiBaseUrl}/transactions`;
  }

  // ==================== TRANSACTIONS ====================

  /**
   * Get all transactions
   */
  getAll(params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  } = {}): Observable<PaginatedResponse<Transaction>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<PaginatedResponse<Transaction>>(`${this.apiUrl}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get transaction by ID
   */
  getById(id: string): Observable<Transaction> {
    return this.http.get<{ data: Transaction }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // ==================== INVOICES ====================

  /**
   * Get all invoices
   */
  getInvoices(params: {
    page?: number;
    limit?: number;
    status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    search?: string;
  } = {}): Observable<PaginatedResponse<Invoice>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<PaginatedResponse<Invoice>>(`${this.apiUrl}/invoices`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get invoice by ID
   */
  getInvoiceById(id: string): Observable<Invoice> {
    return this.http.get<{ data: Invoice }>(`${this.apiUrl}/invoices/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Pay invoice
   */
  payInvoice(id: string, data: {
    paymentMethodId: string;
    amount: number;
  }): Observable<Transaction> {
    return this.http.post<{ data: Transaction }>(`${this.apiUrl}/invoices/${id}/pay`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Download invoice PDF
   */
  downloadInvoice(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/invoices/${id}/download`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Send payment reminder
   */
  sendInvoiceReminder(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invoices/${id}/send-reminder`, {})
      .pipe(catchError(this.handleError));
  }

  // ==================== PURCHASE ORDERS ====================

  /**
   * Get all purchase orders
   */
  getPurchaseOrders(params: {
    page?: number;
    limit?: number;
    status?: 'draft' | 'sent' | 'confirmed' | 'completed' | 'cancelled';
    search?: string;
  } = {}): Observable<PaginatedResponse<PurchaseOrder>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<PaginatedResponse<PurchaseOrder>>(`${this.apiUrl}/purchase-orders`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get purchase order by ID
   */
  getPurchaseOrderById(id: string): Observable<PurchaseOrder> {
    return this.http.get<{ data: PurchaseOrder }>(`${this.apiUrl}/purchase-orders/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Create purchase order
   */
  createPurchaseOrder(data: {
    supplierId: string;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
    deliveryDate?: string;
    notes?: string;
  }): Observable<PurchaseOrder> {
    return this.http.post<{ data: PurchaseOrder }>(`${this.apiUrl}/purchase-orders`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update purchase order
   */
  updatePurchaseOrder(id: string, data: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
    return this.http.put<{ data: PurchaseOrder }>(`${this.apiUrl}/purchase-orders/${id}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Approve purchase order
   */
  approvePurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.post<{ data: PurchaseOrder }>(`${this.apiUrl}/purchase-orders/${id}/approve`, {})
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Send purchase order to supplier
   */
  sendPurchaseOrder(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/purchase-orders/${id}/send`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Download purchase order PDF
   */
  downloadPurchaseOrder(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/purchase-orders/${id}/download`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  // ==================== PAYMENT METHODS ====================

  /**
   * Get payment methods
   */
  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<{ data: PaymentMethod[] }>(`${this.apiUrl}/payment-methods`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Add payment method
   */
  addPaymentMethod(data: {
    type: 'bank_transfer' | 'credit_card' | 'paypal' | 'swish' | 'invoice';
    name: string;
    details: string;
  }): Observable<PaymentMethod> {
    return this.http.post<{ data: PaymentMethod }>(`${this.apiUrl}/payment-methods`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update payment method
   */
  updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Observable<PaymentMethod> {
    return this.http.put<{ data: PaymentMethod }>(`${this.apiUrl}/payment-methods/${id}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Remove payment method
   */
  removePaymentMethod(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/payment-methods/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Set default payment method
   */
  setDefaultPaymentMethod(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/payment-methods/${id}/set-default`, {})
      .pipe(catchError(this.handleError));
  }

  // ==================== SUMMARY & REPORTS ====================

  /**
   * Get financial summary
   */
  getSummary(period?: 'week' | 'month' | 'quarter' | 'year'): Observable<FinancialSummary> {
    const params = period ? new HttpParams().set('period', period) : new HttpParams();
    
    return this.http.get<FinancialSummary>(`${this.apiUrl}/summary`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Export transactions
   */
  export(params: {
    format: 'xlsx' | 'csv' | 'pdf';
    type: 'transactions' | 'invoices' | 'purchase-orders';
    filters?: any;
  }): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, params, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('Transactions Service Error:', error);
    throw error;
  }
}


