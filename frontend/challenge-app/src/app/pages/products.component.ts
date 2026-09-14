import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

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
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  template: `
    <h1>Products</h1>

    <div class="toolbar">
      <input [(ngModel)]="search" placeholder="Search" />
      <button type="button" (click)="load()">Search</button>
      <button type="button" (click)="createOrder()">Create Order</button>
    </div>

    @if (error) {
      <p class="error">{{ error }}</p>
    }

    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Price</th>
          <th>Available Stock</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        @for (product of products; track product.id) {
          <tr>
            <td>{{ product.code }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>{{ product.isActive ? 'Active' : 'Inactive' }}</td>
          </tr>
        } @empty {
          <tr>
            <td colspan="5">No products found.</td>
          </tr>
        }
      </tbody>
    </table>

    <div class="toolbar">
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
export class ProductsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  products: Product[] = [];
  search = '';
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

    let params = new HttpParams()
      .set('page', this.page)
      .set('pageSize', this.pageSize);

    if (this.search.trim()) {
      params = params.set('search', this.search.trim());
    }

    this.http.get<ProductsResponse>('/api/products', { params }).subscribe({
      next: (response) => {
        this.products = response.items;
        this.page = response.page;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message ?? 'Failed to load products.';
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

  createOrder(): void {
    this.router.navigate(['/orders/new']);
  }
}
