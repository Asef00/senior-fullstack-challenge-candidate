import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Customer {
  id: number;
  code: string;
  name: string;
  phoneNumber: string;
}

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

interface ProductsResponse {
  items: Product[];
  totalPages: number;
}

interface OrderLine {
  productId: number | null;
  quantity: number;
  unitPrice: number;
}

@Component({
  selector: 'app-order-create',
  imports: [FormsModule, RouterLink],
  template: `
    <h1>Create order</h1>

    <label>
      Customer
      <select [(ngModel)]="customerId">
        <option [ngValue]="null">Select a customer</option>

        @for (customer of customers; track customer.id) {
          <option [ngValue]="customer.id">
            {{ customer.code }} - {{ customer.name }}
          </option>
        }
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
              <select
                [(ngModel)]="line.productId"
                (ngModelChange)="productChanged(line)"
              >
                <option [ngValue]="null">Select product</option>

                @for (product of products; track product.id) {
                  <option [ngValue]="product.id">
                    {{ product.code }} - {{ product.name }}
                  </option>
                }
              </select>
            </td>

            <td>
              <input type="number" min="1" [(ngModel)]="line.quantity" />
            </td>

            <td>{{ line.unitPrice }}</td>

            <td>{{ line.quantity * line.unitPrice }}</td>
          </tr>
        }
      </tbody>
    </table>

    <button type="button" (click)="addLine()">Add product</button>

    <p>
      <strong>Order total:</strong>
      {{ total }}
    </p>

    @if (message) {
      <p class="hint">{{ message }}</p>
    }

    <button type="button" (click)="submit()" [disabled]="loading">
      {{ loading ? 'Submitting...' : 'Submit' }}
    </button>

    <p>
      <a routerLink="/orders">Back to orders</a>
    </p>
  `,
})
export class OrderCreateComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  customers: Customer[] = [];
  products: Product[] = [];

  customerId: number | null = null;

  lines: OrderLine[] = [
    {
      productId: null,
      quantity: 1,
      unitPrice: 0,
    },
  ];

  message = '';
  loading = false;

  ngOnInit(): void {
    this.loadCustomers();
    this.loadProducts();
  }

  loadCustomers(): void {
    this.http.get<Customer[]>('/api/customers').subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: () => {
        this.message = 'Failed to load customers.';
      },
    });
  }

  loadProducts(): void {
    this.http
      .get<ProductsResponse>('/api/products', {
        params: {
          isActive: true,
          page: 1,
          pageSize: 100,
        },
      })
      .subscribe({
        next: (response) => {
          this.products = response.items;
        },
        error: () => {
          this.message = 'Failed to load products.';
        },
      });
  }

  productChanged(line: OrderLine): void {
    const product = this.products.find((x) => x.id === line.productId);

    line.unitPrice = product?.price ?? 0;
  }

  get total(): number {
    return this.lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0,
    );
  }

  addLine(): void {
    this.lines = [
      ...this.lines,
      {
        productId: null,
        quantity: 1,
        unitPrice: 0,
      },
    ];
  }

  submit(): void {
    this.message = '';

    if (!this.customerId) {
      this.message = 'Please select a customer.';
      return;
    }

    if (
      this.lines.length === 0 ||
      this.lines.some((line) => !line.productId || line.quantity <= 0)
    ) {
      this.message = 'Please select products and enter valid quantities.';
      return;
    }

    const productIds = this.lines.map((line) => line.productId);

    if (new Set(productIds).size !== productIds.length) {
      this.message = 'A product cannot appear more than once.';
      return;
    }

    this.loading = true;

    this.http
      .post<any>('/api/orders', {
        customerId: this.customerId,
        items: this.lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
        })),
      })
      .subscribe({
        next: (order) => {
          this.router.navigate(['/orders', order.id]);
        },
        error: (error) => {
          this.message = error.error?.message ?? 'Failed to create order.';
          this.loading = false;
        },
      });
  }
}
