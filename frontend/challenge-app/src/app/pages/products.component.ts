import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  template: `
    <h1>Products</h1>
    <div class="toolbar">
      <input [(ngModel)]="search" placeholder="Search" />
      <button type="button" (click)="load()">Search</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Price</th>
          <th>Available Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="4">Load GET /api/products with search and pagination.</td>
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
export class ProductsComponent {
  search = '';
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
