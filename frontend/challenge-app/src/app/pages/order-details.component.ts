import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface OrderItem {
  productId: number;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderDetails {
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
  items: OrderItem[];
}

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Order details</h1>

    <p>
      <a routerLink="/orders">Back to orders</a>
    </p>

    @if (error) {
      <p class="error">{{ error }}</p>
    }

    @if (order) {
      <dl>
        <dt>Order Number</dt>
        <dd>{{ order.orderNumber }}</dd>

        <dt>Customer</dt>
        <dd>{{ order.customer.code }} - {{ order.customer.name }}</dd>

        <dt>Date</dt>
        <dd>{{ order.orderDate | date: 'medium' }}</dd>

        <dt>Status</dt>
        <dd>
          {{ order.status === 1 ? 'Confirmed' : 'Cancelled' }}
        </dd>
      </dl>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          @for (item of order.items; track item.productId) {
            <tr>
              <td>{{ item.productCode }} - {{ item.productName }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.unitPrice }}</td>
              <td>{{ item.totalPrice }}</td>
            </tr>
          }
        </tbody>
      </table>

      <p>
        <strong>Order total:</strong>
        {{ order.totalAmount }}
      </p>
    }
  `,
})
export class OrderDetailsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  readonly id = this.route.snapshot.paramMap.get('id');

  order: OrderDetails | null = null;
  error = '';

  ngOnInit(): void {
    if (!this.id) {
      this.error = 'Order id is missing.';
      return;
    }

    this.http.get<OrderDetails>(`/api/orders/${this.id}`).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (error) => {
        this.error = error.error?.message ?? 'Failed to load order.';
      },
    });
  }
}
