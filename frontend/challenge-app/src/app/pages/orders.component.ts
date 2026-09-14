import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: number;
  totalAmount: number;
  customer: {
    id: number;
    code: string;
    name: string;
  };
}

interface OrdersResponse {
  items: Order[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Orders</h1>

    <p>
      <a routerLink="/orders/create">Create order</a>
      |
      <a routerLink="/products">Products</a>
    </p>

    @if (error) {
      <p class="error">{{ error }}</p>
    }

    <table>
      <thead>
        <tr>
          <th>Order Number</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        @for (order of orders; track order.id) {
          <tr>
            <td>{{ order.orderNumber }}</td>
            <td>{{ order.customer.code }} - {{ order.customer.name }}</td>
            <td>{{ order.orderDate | date: 'medium' }}</td>
            <td>{{ order.totalAmount }}</td>
            <td>{{ order.status === 1 ? 'Confirmed' : 'Cancelled' }}</td>
            <td>
              <a [routerLink]="['/orders', order.id]"> Details </a>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="6">No orders found.</td>
          </tr>
        }
      </tbody>
    </table>

    <div>
      <button type="button" (click)="prev()" [disabled]="page <= 1 || loading">
        Previous
      </button>

      <span> Page {{ page }} / {{ totalPages || 1 }} </span>

      <button
        type="button"
        (click)="next()"
        [disabled]="page >= totalPages || loading"
      >
        Next
      </button>
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  private readonly http = inject(HttpClient);

  orders: Order[] = [];
  page = 1;
  pageSize = 10;
  totalPages = 0;
  loading = false;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    const params = new HttpParams()
      .set('page', this.page)
      .set('pageSize', this.pageSize);

    this.http.get<OrdersResponse>('/api/orders', { params }).subscribe({
      next: (response) => {
        this.orders = response.items;
        this.page = response.page;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message ?? 'Failed to load orders.';
        this.loading = false;
      },
    });
  }

  prev(): void {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }

  next(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.load();
    }
  }
}
