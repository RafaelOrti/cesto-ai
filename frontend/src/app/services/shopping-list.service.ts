import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ShoppingList {
  id: string;
  name: string;
  type: 'personal' | 'shared' | 'team';
  itemCount: number;
  estimatedValue: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  sharedWith: string[];
}

export interface ShoppingListItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  checked: boolean;
  notes: string;
  addedAt: string;
  unitPrice?: number;
}

export interface ShoppingListDetail extends ShoppingList {
  items: ShoppingListItem[];
}

export interface Reminder {
  id: string;
  type: 'temporal' | 'restock';
  date: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  active: boolean;
}

export interface AIRecommendation {
  productId: string;
  productName: string;
  recommendedQuantity: number;
  confidence: number;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedStockoutDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') apiBaseUrl: string
  ) {
    this.apiUrl = `${apiBaseUrl}/shopping-lists`;
  }

  /**
   * Get all shopping lists
   */
  getAll(): Observable<ShoppingList[]> {
    return this.http.get<{ data: ShoppingList[] }>(`${this.apiUrl}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get shopping list by ID
   */
  getById(id: string): Observable<ShoppingListDetail> {
    return this.http.get<{ data: ShoppingListDetail }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Create new shopping list
   */
  create(data: {
    name: string;
    type: 'personal' | 'shared' | 'team';
    items?: Array<{ productId: string; quantity: number; notes?: string }>;
  }): Observable<ShoppingList> {
    return this.http.post<{ data: ShoppingList }>(`${this.apiUrl}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update shopping list
   */
  update(id: string, data: Partial<ShoppingList>): Observable<ShoppingList> {
    return this.http.put<{ data: ShoppingList }>(`${this.apiUrl}/${id}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Delete shopping list
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Add item to shopping list
   */
  addItem(listId: string, item: {
    productId: string;
    quantity: number;
    notes?: string;
  }): Observable<ShoppingListItem> {
    return this.http.post<{ data: ShoppingListItem }>(`${this.apiUrl}/${listId}/items`, item)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Update item in shopping list
   */
  updateItem(listId: string, itemId: string, data: Partial<ShoppingListItem>): Observable<ShoppingListItem> {
    return this.http.put<{ data: ShoppingListItem }>(`${this.apiUrl}/${listId}/items/${itemId}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Remove item from shopping list
   */
  removeItem(listId: string, itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${listId}/items/${itemId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Share shopping list with users
   */
  share(listId: string, data: {
    userIds: string[];
    permissions: 'view' | 'edit';
  }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${listId}/share`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Convert shopping list to order
   */
  convertToOrder(listId: string): Observable<{ orderId: string }> {
    return this.http.post<{ orderId: string }>(`${this.apiUrl}/${listId}/convert-to-order`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Get reminders for shopping list
   */
  getReminders(listId: string): Observable<Reminder[]> {
    return this.http.get<{ data: Reminder[] }>(`${this.apiUrl}/${listId}/reminders`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Set reminder for shopping list
   */
  setReminder(listId: string, reminder: {
    type: 'temporal' | 'restock';
    date: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
  }): Observable<Reminder> {
    return this.http.post<{ data: Reminder }>(`${this.apiUrl}/${listId}/reminders`, reminder)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Get AI restock recommendations
   */
  getAIRecommendations(): Observable<AIRecommendation[]> {
    return this.http.get<{ data: AIRecommendation[] }>(`${this.apiUrl}/ai-recommendations`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Export shopping list
   */
  export(listId: string, format: 'pdf' | 'xlsx' | 'csv'): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/${listId}/export`, { format }, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('Shopping List Service Error:', error);
    throw error;
  }
}


