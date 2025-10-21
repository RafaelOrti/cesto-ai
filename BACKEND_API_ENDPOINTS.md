# CESTO Backend API - Complete Endpoints Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:3400/api/v1`  
**Authentication:** JWT Bearer Token  
**Date:** October 20, 2025

---

## 📋 Table of Contents

1. [Authentication & Users](#authentication--users)
2. [Dashboard & Analytics](#dashboard--analytics)
3. [Suppliers](#suppliers)
4. [Products](#products)
5. [Orders](#orders)
6. [Shopping Lists](#shopping-lists)
7. [Inventory](#inventory)
8. [Analysis](#analysis)
9. [Team Management](#team-management)
10. [Transactions](#transactions)
11. [Notifications](#notifications)
12. [Settings](#settings)

---

## 🔐 Authentication & Users

### POST `/auth/register`
**Description:** Register a new user  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "client|supplier|admin",
  "companyName": "Company Inc",
  "firstName": "John",
  "lastName": "Doe"
}
```
**Response:** `201 Created`

### POST `/auth/login`
**Description:** Login user  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "client",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### POST `/auth/refresh`
**Description:** Refresh access token  
**Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

### POST `/auth/logout`
**Description:** Logout user  
**Headers:** `Authorization: Bearer {token}`

### GET `/auth/me`
**Description:** Get current user  
**Headers:** `Authorization: Bearer {token}`

### PUT `/auth/profile`
**Description:** Update user profile  
**Headers:** `Authorization: Bearer {token}`

### PUT `/auth/change-password`
**Description:** Change password  
**Headers:** `Authorization: Bearer {token}`

---

## 📊 Dashboard & Analytics

### GET `/dashboard/stats`
**Description:** Get dashboard statistics  
**Headers:** `Authorization: Bearer {token}`  
**Response:**
```json
{
  "totalOrders": 156,
  "totalRevenue": 245678.50,
  "totalSuppliers": 24,
  "activeSuppliers": 18,
  "pendingOrders": 12,
  "completedOrders": 144,
  "averageOrderValue": 1575.50,
  "monthlyGrowth": 15.3
}
```

### GET `/dashboard/charts/revenue`
**Description:** Get revenue chart data  
**Query Params:** `?startDate=2024-01-01&endDate=2024-12-31&groupBy=month`  
**Response:**
```json
{
  "data": [
    { "date": "2024-01", "revenue": 45000, "orders": 30 },
    { "date": "2024-02", "revenue": 52000, "orders": 35 }
  ]
}
```

### GET `/dashboard/charts/orders`
**Description:** Get orders chart data  
**Query Params:** `?startDate=2024-01-01&endDate=2024-12-31`

### GET `/dashboard/charts/suppliers`
**Description:** Get suppliers performance chart  
**Query Params:** `?period=30d`

### GET `/dashboard/recent-orders`
**Description:** Get recent orders  
**Query Params:** `?limit=10`

### GET `/dashboard/top-suppliers`
**Description:** Get top suppliers  
**Query Params:** `?limit=5&sortBy=totalValue`

### GET `/dashboard/quick-actions`
**Description:** Get available quick actions for user

### GET `/dashboard/notifications`
**Description:** Get dashboard notifications  
**Query Params:** `?unreadOnly=true&limit=10`

### GET `/dashboard/insights`
**Description:** Get buyer insights data  
**Query Params:** `?metric=sales&startDate=2024-01-01&endDate=2024-12-31`

---

## 🏢 Suppliers

### GET `/suppliers`
**Description:** Get all suppliers with filters  
**Query Params:**
- `page=1`
- `limit=20`
- `search=query`
- `category=dairy`
- `status=active|pending|inactive`
- `freeDelivery=true`
- `coDelivery=true`
- `onSale=true`
- `hasNewProducts=true`
- `hasCampaigns=true`
- `sortBy=name|lastDelivery|rating`
- `sortOrder=asc|desc`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Fresh Dairy Co",
      "companyName": "Fresh Dairy Co",
      "description": "Premium dairy products...",
      "logo": "url_to_logo",
      "rating": 4.8,
      "reviewCount": 127,
      "categories": ["Dairy", "Organic"],
      "isVerified": true,
      "lastDelivery": "2024-01-15",
      "futureDelivery": "2024-02-01",
      "hasCampaign": true,
      "hasNewProducts": false,
      "freeShipping": true,
      "coDelivery": true,
      "minimumOrder": 500,
      "totalOrders": 45,
      "totalSpent": 125000
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

### GET `/suppliers/my-suppliers`
**Description:** Get user's current suppliers  
**Query Params:** Same as `/suppliers`

### GET `/suppliers/search`
**Description:** Search for new suppliers to add  
**Query Params:** Same as `/suppliers` + `exclude=mySuppliers`

### GET `/suppliers/:id`
**Description:** Get supplier details  
**Response:**
```json
{
  "id": "uuid",
  "name": "Fresh Dairy Co",
  "description": "...",
  "logo": "...",
  "rating": 4.8,
  "address": "...",
  "phone": "...",
  "email": "...",
  "website": "...",
  "businessHours": "Mon-Fri 8:00-17:00",
  "deliveryAreas": ["Stockholm", "Uppsala"],
  "paymentTerms": "Net 30",
  "minimumOrder": 500,
  "categories": [],
  "certifications": [],
  "stats": {
    "totalOrders": 45,
    "totalSpent": 125000,
    "averageOrderValue": 2777,
    "lastOrderDate": "2024-01-15"
  }
}
```

### GET `/suppliers/:id/products`
**Description:** Get products from a specific supplier  
**Query Params:** `?page=1&limit=20&category=dairy&onSale=true`

### GET `/suppliers/:id/order-history`
**Description:** Get order history with a supplier  
**Query Params:** `?page=1&limit=10&startDate=2023-01-01`

### POST `/suppliers/:id/favorite`
**Description:** Add supplier to favorites

### DELETE `/suppliers/:id/favorite`
**Description:** Remove supplier from favorites

### POST `/suppliers/:id/contact`
**Description:** Send inquiry to supplier  
**Body:**
```json
{
  "subject": "Product Inquiry",
  "message": "I'm interested in...",
  "requestType": "inquiry|quote|meeting"
}
```

### POST `/suppliers/relationship-request`
**Description:** Request relationship with new supplier  
**Body:**
```json
{
  "supplierId": "uuid",
  "message": "We would like to...",
  "requestType": "inquiry"
}
```

### GET `/suppliers/categories`
**Description:** Get all supplier categories

### GET `/suppliers/recommendations`
**Description:** Get AI-recommended suppliers  
**Query Params:** `?limit=10`

---

## 📦 Products

### GET `/products`
**Description:** Get all products  
**Query Params:**
- `page=1`
- `limit=20`
- `search=query`
- `category=dairy`
- `supplierId=uuid`
- `onSale=true`
- `inStock=true`
- `minPrice=0`
- `maxPrice=1000`
- `sortBy=name|price|createdAt`
- `sortOrder=asc|desc`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Premium Milk 1L",
      "description": "...",
      "sku": "MILK-001",
      "images": ["url1", "url2"],
      "price": 3.50,
      "originalPrice": 4.00,
      "discount": 12.5,
      "isOnSale": true,
      "stock": 150,
      "unit": "liter",
      "moq": 10,
      "supplier": {
        "id": "uuid",
        "name": "Fresh Dairy Co",
        "logo": "url"
      },
      "category": "Dairy",
      "rating": 4.7,
      "reviewCount": 45,
      "isFeatured": false,
      "createdAt": "2024-01-01"
    }
  ],
  "total": 500,
  "page": 1,
  "limit": 20
}
```

### GET `/products/on-sale`
**Description:** Get products on sale  
**Query Params:** Same as `/products`

### GET `/products/featured`
**Description:** Get featured products

### GET `/products/new`
**Description:** Get new products  
**Query Params:** `?days=30`

### GET `/products/:id`
**Description:** Get product details  
**Response:**
```json
{
  "id": "uuid",
  "name": "Premium Milk 1L",
  "description": "Full description...",
  "specifications": {},
  "images": [],
  "price": 3.50,
  "stock": 150,
  "supplier": {},
  "relatedProducts": [],
  "reviews": []
}
```

### GET `/products/categories`
**Description:** Get all product categories  
**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Dairy",
      "slug": "dairy",
      "icon": "🥛",
      "productCount": 156
    }
  ]
}
```

### POST `/products/:id/cart`
**Description:** Add product to cart  
**Body:**
```json
{
  "quantity": 2,
  "notes": "Optional notes"
}
```

### POST `/products/:id/wishlist`
**Description:** Add product to wishlist

### GET `/products/search-suggestions`
**Description:** Get search suggestions  
**Query Params:** `?q=milk`

---

## 📋 Orders

### GET `/orders`
**Description:** Get all orders  
**Query Params:**
- `page=1`
- `limit=20`
- `status=pending|confirmed|shipped|delivered|cancelled`
- `filter=past|incoming`
- `supplierId=uuid`
- `startDate=2024-01-01`
- `endDate=2024-12-31`
- `search=orderNumber`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2024-001",
      "supplier": {
        "id": "uuid",
        "name": "Fresh Dairy Co",
        "logo": "url"
      },
      "status": "delivered",
      "orderDate": "2024-01-15",
      "deliveryDate": "2024-01-18",
      "items": [
        {
          "productId": "uuid",
          "productName": "Premium Milk 1L",
          "quantity": 10,
          "unitPrice": 3.50,
          "totalPrice": 35.00
        }
      ],
      "subtotal": 35.00,
      "tax": 8.75,
      "shipping": 5.00,
      "total": 48.75,
      "trackingNumber": "TRK123456",
      "notes": ""
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 20
}
```

### GET `/orders/past`
**Description:** Get past orders  
**Query Params:** Same as `/orders`

### GET `/orders/incoming`
**Description:** Get incoming/future orders

### GET `/orders/:id`
**Description:** Get order details

### POST `/orders`
**Description:** Create new order  
**Body:**
```json
{
  "supplierId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 10
    }
  ],
  "deliveryDate": "2024-02-01",
  "notes": "Please deliver in the morning"
}
```

### PUT `/orders/:id`
**Description:** Update order

### DELETE `/orders/:id`
**Description:** Cancel order

### POST `/orders/:id/reorder`
**Description:** Reorder same items

### GET `/orders/:id/invoice`
**Description:** Get order invoice PDF

### GET `/orders/:id/tracking`
**Description:** Get order tracking information

### POST `/orders/:id/report-issue`
**Description:** Report issue with order  
**Body:**
```json
{
  "issueType": "damaged|missing|wrong",
  "description": "...",
  "images": ["url1", "url2"]
}
```

### GET `/orders/purchase-orders`
**Description:** Get purchase orders

### POST `/orders/purchase-orders`
**Description:** Create purchase order

### GET `/orders/unfulfilled`
**Description:** Get unfulfilled orders

### GET `/orders/stats`
**Description:** Get order statistics  
**Response:**
```json
{
  "totalOrders": 156,
  "pendingOrders": 12,
  "completedOrders": 144,
  "cancelledOrders": 0,
  "totalValue": 245678.50,
  "averageOrderValue": 1575.50
}
```

---

## 🛒 Shopping Lists

### GET `/shopping-lists`
**Description:** Get all shopping lists  
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Weekly Shopping",
      "type": "personal|shared|team",
      "itemCount": 15,
      "estimatedValue": 350.00,
      "createdBy": "userId",
      "createdAt": "2024-01-01",
      "updatedAt": "2024-01-15",
      "sharedWith": []
    }
  ]
}
```

### POST `/shopping-lists`
**Description:** Create shopping list  
**Body:**
```json
{
  "name": "Weekly Shopping",
  "type": "personal",
  "items": []
}
```

### GET `/shopping-lists/:id`
**Description:** Get shopping list details  
**Response:**
```json
{
  "id": "uuid",
  "name": "Weekly Shopping",
  "type": "personal",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Premium Milk 1L",
      "quantity": 10,
      "checked": false,
      "notes": "",
      "addedAt": "2024-01-15"
    }
  ],
  "estimatedValue": 350.00
}
```

### PUT `/shopping-lists/:id`
**Description:** Update shopping list

### DELETE `/shopping-lists/:id`
**Description:** Delete shopping list

### POST `/shopping-lists/:id/items`
**Description:** Add item to shopping list  
**Body:**
```json
{
  "productId": "uuid",
  "quantity": 10,
  "notes": ""
}
```

### PUT `/shopping-lists/:listId/items/:itemId`
**Description:** Update item in shopping list

### DELETE `/shopping-lists/:listId/items/:itemId`
**Description:** Remove item from shopping list

### POST `/shopping-lists/:id/share`
**Description:** Share shopping list  
**Body:**
```json
{
  "userIds": ["uuid1", "uuid2"],
  "permissions": "view|edit"
}
```

### POST `/shopping-lists/:id/convert-to-order`
**Description:** Convert shopping list to order

### GET `/shopping-lists/:id/reminders`
**Description:** Get reminders for shopping list

### POST `/shopping-lists/:id/reminders`
**Description:** Set reminder for shopping list  
**Body:**
```json
{
  "type": "temporal|restock",
  "date": "2024-02-01",
  "frequency": "weekly|monthly"
}
```

### GET `/shopping-lists/ai-recommendations`
**Description:** Get AI restock recommendations

---

## 📊 Inventory

### GET `/inventory`
**Description:** Get inventory items  
**Query Params:**
- `page=1`
- `limit=20`
- `search=query`
- `category=dairy`
- `department=refrigerated`
- `lowStock=true`
- `outOfStock=true`
- `sortBy=name|stock|lastRestocked`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Premium Milk 1L",
      "productImage": "url",
      "sku": "MILK-001",
      "category": "Dairy",
      "department": "Refrigerated",
      "supplier": {
        "id": "uuid",
        "name": "Fresh Dairy Co"
      },
      "currentStock": 45,
      "minStock": 20,
      "maxStock": 200,
      "unit": "unit",
      "unitCost": 3.50,
      "totalValue": 157.50,
      "lastRestocked": "2024-01-15",
      "nextRestockDate": "2024-02-01",
      "aiPrediction": {
        "recommendedStock": 80,
        "confidence": 92,
        "urgency": "medium",
        "reason": "Based on historical data..."
      },
      "stockStatus": "ok|low|critical|out"
    }
  ],
  "total": 456,
  "page": 1,
  "limit": 20
}
```

### GET `/inventory/:id`
**Description:** Get inventory item details

### PUT `/inventory/:id`
**Description:** Update inventory item  
**Body:**
```json
{
  "currentStock": 100,
  "minStock": 20,
  "maxStock": 200,
  "notes": ""
}
```

### POST `/inventory/restock`
**Description:** Record restock event  
**Body:**
```json
{
  "inventoryItemId": "uuid",
  "quantity": 50,
  "supplier": "uuid",
  "cost": 175.00,
  "invoiceNumber": "INV-001"
}
```

### GET `/inventory/low-stock`
**Description:** Get low stock items  
**Query Params:** `?threshold=10`

### GET `/inventory/out-of-stock`
**Description:** Get out of stock items

### GET `/inventory/stock-history/:id`
**Description:** Get stock history for item  
**Query Params:** `?startDate=2024-01-01&endDate=2024-12-31`

### GET `/inventory/alerts`
**Description:** Get inventory alerts  
**Response:**
```json
{
  "alerts": [
    {
      "id": "uuid",
      "type": "low_stock|out_of_stock|expiring_soon",
      "severity": "low|medium|high|critical",
      "inventoryItemId": "uuid",
      "productName": "Premium Milk 1L",
      "message": "Stock is below 10%",
      "createdAt": "2024-01-20",
      "actionRequired": true
    }
  ]
}
```

### PUT `/inventory/alerts/:id/dismiss`
**Description:** Dismiss inventory alert

### GET `/inventory/stats`
**Description:** Get inventory statistics  
**Response:**
```json
{
  "totalItems": 456,
  "totalValue": 125000.00,
  "lowStockItems": 23,
  "outOfStockItems": 5,
  "expiringItems": 12,
  "turnoverRate": 4.5
}
```

### POST `/inventory/export`
**Description:** Export inventory report  
**Body:**
```json
{
  "format": "xlsx|csv|pdf",
  "filters": {}
}
```

### GET `/inventory/ai-predictions`
**Description:** Get AI restock predictions  
**Query Params:** `?productIds=uuid1,uuid2`

---

## 📈 Analysis

### GET `/analysis/sales-performance`
**Description:** Get sales performance analysis  
**Query Params:** `?startDate=2024-01-01&endDate=2024-12-31&groupBy=month`  
**Response:**
```json
{
  "data": [
    {
      "period": "2024-01",
      "sales": 45000,
      "orders": 30,
      "averageOrderValue": 1500,
      "growth": 15.3
    }
  ],
  "totals": {
    "sales": 540000,
    "orders": 360,
    "averageOrderValue": 1500
  }
}
```

### GET `/analysis/purchases-performance`
**Description:** Get purchases performance analysis

### GET `/analysis/sales-vs-purchases`
**Description:** Get sales vs purchases comparison

### GET `/analysis/product-performance`
**Description:** Get product performance analysis  
**Query Params:** `?productId=uuid&period=30d`

### GET `/analysis/supplier-performance`
**Description:** Get supplier performance analysis  
**Query Params:** `?supplierId=uuid&period=90d`

### GET `/analysis/category-performance`
**Description:** Get category performance

### GET `/analysis/seasonal-trends`
**Description:** Get seasonal trends analysis  
**Query Params:** `?year=2024&category=dairy`

### GET `/analysis/forecast`
**Description:** Get sales forecast  
**Query Params:** `?months=6&confidence=95`  
**Response:**
```json
{
  "forecast": [
    {
      "period": "2024-07",
      "predictedSales": 48000,
      "lowerBound": 43000,
      "upperBound": 53000,
      "confidence": 95
    }
  ]
}
```

### GET `/analysis/kpis`
**Description:** Get Key Performance Indicators  
**Response:**
```json
{
  "revenue": {
    "current": 540000,
    "previous": 470000,
    "growth": 14.9,
    "target": 600000
  },
  "profitMargin": 23.5,
  "customerRetention": 87.3,
  "orderFulfillment": 95.2,
  "inventoryTurnover": 4.5
}
```

### GET `/analysis/competitor-comparison`
**Description:** Get competitor comparison data  
**Query Params:** `?productIds=uuid1,uuid2`

### POST `/analysis/custom-report`
**Description:** Generate custom analysis report  
**Body:**
```json
{
  "metrics": ["sales", "orders", "customers"],
  "dimensions": ["product", "supplier", "category"],
  "filters": {},
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  }
}
```

### GET `/analysis/export`
**Description:** Export analysis data  
**Query Params:** `?format=xlsx&type=sales-performance&period=2024`

---

## 👥 Team Management

### GET `/team/members`
**Description:** Get team members  
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@company.com",
      "role": "admin|manager|buyer|viewer",
      "status": "active|inactive|pending",
      "avatar": "url",
      "department": "Operations",
      "phone": "+46 70 123 4567",
      "permissions": ["orders", "inventory"],
      "joinedDate": "2023-01-15",
      "lastActive": "2024-01-20T10:30:00Z"
    }
  ]
}
```

### POST `/team/members/invite`
**Description:** Invite team member  
**Body:**
```json
{
  "email": "newmember@company.com",
  "role": "buyer",
  "permissions": ["orders", "products"],
  "message": "Welcome to the team!"
}
```

### GET `/team/members/:id`
**Description:** Get team member details

### PUT `/team/members/:id`
**Description:** Update team member  
**Body:**
```json
{
  "role": "manager",
  "permissions": ["orders", "inventory", "suppliers"],
  "status": "active"
}
```

### DELETE `/team/members/:id`
**Description:** Remove team member

### POST `/team/members/:id/activate`
**Description:** Activate team member

### POST `/team/members/:id/deactivate`
**Description:** Deactivate team member

### GET `/team/invitations`
**Description:** Get pending invitations  
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "pending@company.com",
      "role": "buyer",
      "status": "pending",
      "invitedBy": "John Doe",
      "invitedDate": "2024-01-19",
      "expiresAt": "2024-01-26"
    }
  ]
}
```

### POST `/team/invitations/:id/resend`
**Description:** Resend invitation

### DELETE `/team/invitations/:id`
**Description:** Cancel invitation

### GET `/team/activity`
**Description:** Get team activity log  
**Query Params:** `?page=1&limit=50&memberId=uuid&startDate=2024-01-01`  
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "member": "John Doe",
      "action": "created_order",
      "details": "Created order ORD-2024-001",
      "timestamp": "2024-01-20T10:30:00Z",
      "ipAddress": "192.168.1.100"
    }
  ]
}
```

### GET `/team/permissions`
**Description:** Get available permissions list

### GET `/team/plan`
**Description:** Get current team plan  
**Response:**
```json
{
  "planId": "professional",
  "planName": "Professional",
  "maxMembers": 10,
  "currentMembers": 5,
  "price": 29.99,
  "billingCycle": "monthly",
  "nextBillingDate": "2024-02-01",
  "features": []
}
```

### POST `/team/plan/upgrade`
**Description:** Upgrade team plan  
**Body:**
```json
{
  "planId": "enterprise",
  "billingCycle": "monthly"
}
```

---

## 💰 Transactions

### GET `/transactions`
**Description:** Get all transactions  
**Query Params:**
- `page=1`
- `limit=20`
- `type=payment|refund|adjustment|commission`
- `status=pending|completed|failed|cancelled`
- `startDate=2024-01-01`
- `endDate=2024-12-31`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "payment",
      "status": "completed",
      "amount": 2304.50,
      "currency": "SEK",
      "description": "Payment to Fresh Dairy Co",
      "reference": "PAY-2024-001",
      "orderId": "uuid",
      "supplierId": "uuid",
      "date": "2024-01-18T14:30:00Z",
      "paymentMethod": "Bank Transfer",
      "fees": 5.50,
      "netAmount": 2299.00
    }
  ],
  "total": 245,
  "page": 1,
  "limit": 20
}
```

### GET `/transactions/:id`
**Description:** Get transaction details

### GET `/transactions/invoices`
**Description:** Get invoices  
**Query Params:** `?status=paid|unpaid|overdue`  
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "invoiceNumber": "INV-2024-001",
      "supplier": {
        "id": "uuid",
        "name": "Fresh Dairy Co",
        "logo": "url"
      },
      "amount": 2304.50,
      "tax": 576.13,
      "total": 2880.63,
      "status": "paid",
      "issueDate": "2024-01-15",
      "dueDate": "2024-01-22",
      "paidDate": "2024-01-18",
      "paymentTerms": "Net 7",
      "items": []
    }
  ]
}
```

### GET `/transactions/invoices/:id`
**Description:** Get invoice details

### POST `/transactions/invoices/:id/pay`
**Description:** Pay invoice  
**Body:**
```json
{
  "paymentMethodId": "uuid",
  "amount": 2880.63
}
```

### GET `/transactions/invoices/:id/download`
**Description:** Download invoice PDF

### POST `/transactions/invoices/:id/send-reminder`
**Description:** Send payment reminder

### GET `/transactions/purchase-orders`
**Description:** Get purchase orders  
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "poNumber": "PO-2024-001",
      "supplier": {
        "id": "uuid",
        "name": "Fresh Dairy Co"
      },
      "status": "draft|sent|confirmed|completed",
      "date": "2024-01-15",
      "totalAmount": 5000.00,
      "items": [],
      "approvalRequired": true,
      "approvedBy": "John Doe",
      "approvedDate": "2024-01-16"
    }
  ]
}
```

### POST `/transactions/purchase-orders`
**Description:** Create purchase order  
**Body:**
```json
{
  "supplierId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 100,
      "unitPrice": 3.50
    }
  ],
  "deliveryDate": "2024-02-01",
  "notes": ""
}
```

### GET `/transactions/purchase-orders/:id`
**Description:** Get purchase order details

### PUT `/transactions/purchase-orders/:id`
**Description:** Update purchase order

### POST `/transactions/purchase-orders/:id/approve`
**Description:** Approve purchase order

### POST `/transactions/purchase-orders/:id/send`
**Description:** Send purchase order to supplier

### GET `/transactions/payment-methods`
**Description:** Get payment methods  
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "bank_transfer|credit_card|paypal|swish",
      "name": "Bank Transfer",
      "details": "SEB Bank ****1234",
      "isDefault": true,
      "status": "active"
    }
  ]
}
```

### POST `/transactions/payment-methods`
**Description:** Add payment method

### PUT `/transactions/payment-methods/:id`
**Description:** Update payment method

### DELETE `/transactions/payment-methods/:id`
**Description:** Remove payment method

### POST `/transactions/payment-methods/:id/set-default`
**Description:** Set default payment method

### GET `/transactions/summary`
**Description:** Get financial summary  
**Query Params:** `?period=month`  
**Response:**
```json
{
  "totalRevenue": 125430.50,
  "totalExpenses": 89450.30,
  "netProfit": 35980.20,
  "pendingPayments": 12500.00,
  "overdueInvoices": 2300.00,
  "thisMonthRevenue": 25430.50,
  "lastMonthRevenue": 21890.30,
  "revenueChange": 16.2
}
```

### POST `/transactions/export`
**Description:** Export transactions  
**Body:**
```json
{
  "format": "xlsx|csv|pdf",
  "type": "transactions|invoices|purchase-orders",
  "filters": {}
}
```

---

## 🔔 Notifications

### GET `/notifications`
**Description:** Get user notifications  
**Query Params:** `?unread=true&page=1&limit=20`  
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "order|payment|alert|system",
      "title": "Order Delivered",
      "message": "Your order ORD-2024-001 has been delivered",
      "isRead": false,
      "createdAt": "2024-01-20T10:30:00Z",
      "link": "/orders/uuid",
      "priority": "low|medium|high"
    }
  ],
  "unreadCount": 5
}
```

### PUT `/notifications/:id/read`
**Description:** Mark notification as read

### PUT `/notifications/read-all`
**Description:** Mark all notifications as read

### DELETE `/notifications/:id`
**Description:** Delete notification

### GET `/notifications/settings`
**Description:** Get notification settings

### PUT `/notifications/settings`
**Description:** Update notification settings  
**Body:**
```json
{
  "email": {
    "orders": true,
    "payments": true,
    "lowStock": true
  },
  "push": {
    "orders": true,
    "payments": false
  }
}
```

---

## ⚙️ Settings

### GET `/settings/profile`
**Description:** Get user profile settings

### PUT `/settings/profile`
**Description:** Update profile settings

### GET `/settings/preferences`
**Description:** Get user preferences

### PUT `/settings/preferences`
**Description:** Update preferences  
**Body:**
```json
{
  "language": "en|sv|es",
  "currency": "SEK|EUR|USD",
  "timezone": "Europe/Stockholm",
  "dateFormat": "YYYY-MM-DD",
  "theme": "light|dark|auto"
}
```

### GET `/settings/company`
**Description:** Get company settings

### PUT `/settings/company`
**Description:** Update company settings

### POST `/settings/avatar`
**Description:** Upload avatar  
**Content-Type:** `multipart/form-data`

### GET `/settings/security`
**Description:** Get security settings

### PUT `/settings/security/two-factor`
**Description:** Enable/disable 2FA

### GET `/settings/integrations`
**Description:** Get third-party integrations

### POST `/settings/integrations/:service/connect`
**Description:** Connect integration (TrueCommerce, Edicom, etc.)

---

## 📝 General Endpoints

### GET `/health`
**Description:** Health check endpoint  
**Response:** `200 OK`

### GET `/version`
**Description:** API version  
**Response:**
```json
{
  "version": "1.0.0",
  "environment": "production"
}
```

---

## 🔄 Pagination & Filtering

All list endpoints support standard pagination and filtering:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sortBy` (field name)
- `sortOrder` (asc|desc)
- `search` (general search)
- Custom filters per endpoint

**Response Format:**
```json
{
  "data": [],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

**Common Error Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🔐 Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer {access_token}
```

Token expires in 1 hour. Use `/auth/refresh` to get new token.

---

**Total Endpoints:** 150+  
**Documentation Complete:** ✅  
**Ready for Implementation:** ✅



