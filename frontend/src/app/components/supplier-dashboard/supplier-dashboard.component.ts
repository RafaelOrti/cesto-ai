import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-dashboard',
  templateUrl: './supplier-dashboard.component.html',
  styleUrls: ['./supplier-dashboard.component.scss']
})
export class SupplierDashboardComponent implements OnInit {
  currentView = 'dashboard';
  supplierStats = {
    totalProducts: 0,
    activeCampaigns: 0,
    pendingOrders: 0,
    totalRevenue: 0
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load supplier dashboard data
    this.supplierStats = {
      totalProducts: 45,
      activeCampaigns: 3,
      pendingOrders: 12,
      totalRevenue: 125000
    };
  }

  navigateToView(view: string): void {
    this.currentView = view;
  }

  navigateToEdi(): void {
    this.router.navigate(['/supplier/edi']);
  }
}


