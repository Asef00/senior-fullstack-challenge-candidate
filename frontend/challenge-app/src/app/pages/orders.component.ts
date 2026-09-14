import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [FormsModule, RouterLink],
  template: `
    <h1>Orders</h1>
    <p><a routerLink="/orders/create">Create order</a></p>
    <div class="toolbar">
      <input [(ngModel)]="orderNumber" placeholder="Order number" />
      <input [(ngModel)]="customerId" placeholder="Customer id" />
      <select [(ngModel)]="status">
        <option value="">All statuses</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <input type="date" [(ngModel)]="fromDate" />
      <input type="date" [(ngModel)]="toDate" />
      <button type="button" (click)="load()">Filter</button>
    </div>
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
        <tr>
          <td colspan="6">Load GET /api/orders with server-side search, filter, sort, and pagination.</td>
        </tr>
      </tbody>
    </table>
    <div class="toolbar">
      <button type="button" (click)="prev()">Previous</button>
      <span>Page {{ page }}</span>
      <button type="button" (click)="next()">Next</button>
    </div>
  `
})
export class OrdersComponent {
  orderNumber = '';
  customerId = '';
  status = '';
  fromDate = '';
  toDate = '';
  page = 1;

  load(): void {}
  prev(): void {
    if (this.page > 1) {
      this.page -= 1;
    }
  }
  next(): void {
    this.page += 1;
  }
}
