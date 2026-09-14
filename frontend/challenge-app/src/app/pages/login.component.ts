import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <h1>Login</h1>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>
        Username
        <input formControlName="username" autocomplete="username" />
      </label>
      <label>
        Password
        <input type="password" formControlName="password" autocomplete="current-password" />
      </label>
      <button type="submit">Login</button>
    </form>
    @if (message) {
      <p class="hint">{{ message }}</p>
    }
  `
})
export class LoginComponent {
  private readonly fb = new FormBuilder();
  readonly form = this.fb.nonNullable.group({
    username: '',
    password: ''
  });
  message = 'Connect this form to POST /api/auth/login.';

  submit(): void {
    this.message = 'Login is not implemented yet.';
  }
}
