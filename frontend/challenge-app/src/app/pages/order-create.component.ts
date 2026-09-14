import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-create',
  imports: [FormsModule, RouterLink],
  template: `
    <h1>Create order</h1>
    <label>
      Customer
      <select [(ngModel)]="customerId">
        <option [ngValue]="null">Select a customer</option>
      </select>
    </label>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Unit price</th>
          <th>Line total</th>
        </tr>
      </thead>
      <tbody>
        @for (line of lines; track $index) {
          <tr>
            <td>
              <select [(ngModel)]="line.productId">
                <option [ngValue]="null">Select product</option>
              </select>
            </td>
            <td><input type="number" min="1" [(ngModel)]="line.quantity" /></td>
            <td>{{ line.unitPrice }}</td>
            <td>{{ line.quantity * line.unitPrice }}</td>
          </tr>
        }
      </tbody>
    </table>
    <button type="button" (click)="addLine()">Add product</button>
    <p><strong>Order total:</strong> {{ total }}</p>
    <button type="button" (click)="submit()">Submit</button>
    <p class="hint">{{ message }}</p>
    <p><a routerLink="/orders">Back to orders</a></p>
  `
})
export class OrderCreateComponent {
  customerId: number | null = null;
  lines = [{ productId: null as number | null, quantity: 1, unitPrice: 0 }];
  message = 'Wire this screen to customers, products, and POST /api/orders.';

  get total(): number {
    return this.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  }

  addLine(): void {
    this.lines = [...this.lines, { productId: null, quantity: 1, unitPrice: 0 }];
  }

  submit(): void {
    this.message = 'Order submission is not implemented yet.';
  }
}
