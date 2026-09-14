import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-details',
  imports: [RouterLink],
  template: `
    <h1>Order details</h1>
    <p><a routerLink="/orders">Back to orders</a></p>
    <dl>
      <dt>Order Number</dt>
      <dd>—</dd>
      <dt>Customer</dt>
      <dd>—</dd>
      <dt>Date</dt>
      <dd>—</dd>
      <dt>Status</dt>
      <dd>—</dd>
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
        <tr>
          <td colspan="4">Load GET /api/orders/{{ id }} and show historical unit prices.</td>
        </tr>
      </tbody>
    </table>
    <p><strong>Order total:</strong> —</p>
  `
})
export class OrderDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  readonly id = this.route.snapshot.paramMap.get('id');
}
