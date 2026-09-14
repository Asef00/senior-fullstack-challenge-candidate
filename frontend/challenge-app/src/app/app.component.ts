import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <strong>Sales Challenge</strong>
      <nav>
        <a routerLink="/login">Login</a>
        <a routerLink="/products">Products</a>
        <a routerLink="/orders">Orders</a>
        <a routerLink="/orders/create">Create order</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
  `
})
export class AppComponent {}
