import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  expiringSoon: number;
  averageStockTurnover: number;
  topCategories: Array<{ category: string; value: number; count: number }>;
  costAnalysis: {
    totalCarryingCost: number;
    totalOrderingCost: number;
    averageUnitCost: number;
    costVariance: number;
  };
  aiInsights: {
    recommendedRestocks: Array<{ productId: string; productName: string; recommendedQuantity: number; urgency: string }>;
    seasonalTrends: Array<{ category: string; trend: string; confidence: number }>;
    priceOptimization: Array<{ productId: string; currentPrice: number; suggestedPrice: number; potentialSavings: number }>;
  };
}

export interface AlertSettings {
  lowStockThreshold: number;
  overstockThreshold: number;
  priceChangeThreshold: number;
  expiryWarningDays: number;
  enableEmailAlerts: boolean;
  enableSmsAlerts: boolean;
  enablePushAlerts: boolean;
  alertFrequency: 'immediate' | 'daily' | 'weekly';
  departmentAlerts: string[];
  categoryAlerts: string[];
  flavorAlerts: string[];
  offerAlerts: boolean;
  campaignAlerts: boolean;
}

export interface InventoryAlert {
  id: string;
  inventoryId: string;
  type: string;
  status: string;
  priority: string;
  message: string;
  description?: string;
  metadata?: any;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  acknowledgmentNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryMovement {
  id: string;
  inventoryId: string;
  type: string;
  reason: string;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  unitCost?: number;
  totalCost?: number;
  reference?: string;
  notes?: string;
  location?: string;
  batchNumber?: string;
  expiryDate?: Date;
  performedBy?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface RestockRecommendation {
  inventoryId: string;
  productId: string;
  productName: string;
  currentQuantity: number;
  recommendedQuantity: number;
  urgency: string;
  estimatedCost: number;
  lastRestocked?: Date;
  nextRestockDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedInventoryService {
  private apiUrl = `${environment.apiUrl}/inventory/advanced`;

  constructor(private http: HttpClient) {}

  getInventoryAnalytics(): Observable<InventoryAnalytics> {
    return this.http.get<InventoryAnalytics>(`${this.apiUrl}/analytics`);
  }

  updateAlertSettings(productId: string, settings: Partial<AlertSettings>): Observable<any> {
    return this.http.put(`${this.apiUrl}/alert-settings/${productId}`, settings);
  }

  createAlert(alertData: {
    inventoryId: string;
    type: string;
    message: string;
    priority?: string;
    metadata?: any;
  }): Observable<InventoryAlert> {
    return this.http.post<InventoryAlert>(`${this.apiUrl}/alerts`, alertData);
  }

  acknowledgeAlert(alertId: string, notes?: string): Observable<InventoryAlert> {
    return this.http.put<InventoryAlert>(`${this.apiUrl}/alerts/${alertId}/acknowledge`, { notes });
  }

  resolveAlert(alertId: string, notes?: string): Observable<InventoryAlert> {
    return this.http.put<InventoryAlert>(`${this.apiUrl}/alerts/${alertId}/resolve`, { notes });
  }

  getActiveAlerts(type?: string): Observable<InventoryAlert[]> {
    const params = type ? { type } : {};
    return this.http.get<InventoryAlert[]>(`${this.apiUrl}/alerts`, { params });
  }

  recordMovement(movementData: {
    inventoryId: string;
    type: string;
    reason: string;
    quantity: number;
    metadata?: any;
  }): Observable<InventoryMovement> {
    return this.http.post<InventoryMovement>(`${this.apiUrl}/movements`, movementData);
  }

  getMovementHistory(
    inventoryId: string,
    startDate?: Date,
    endDate?: Date
  ): Observable<InventoryMovement[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    
    return this.http.get<InventoryMovement[]>(`${this.apiUrl}/movements/${inventoryId}`, { params });
  }

  getRestockRecommendations(): Observable<RestockRecommendation[]> {
    return this.http.get<RestockRecommendation[]>(`${this.apiUrl}/restock-recommendations`);
  }

  updateAiInsights(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/update-ai-insights`, {});
  }
}

