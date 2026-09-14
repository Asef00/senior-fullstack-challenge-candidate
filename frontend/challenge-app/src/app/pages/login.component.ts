import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  role: string;
  expiresAt: string;
}

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
        <input
          type="password"
          formControlName="password"
          autocomplete="current-password"
        />
      </label>

      <button type="submit" [disabled]="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    @if (message) {
      <p class="hint">{{ message }}</p>
    }
  `,
})
export class LoginComponent {
  private readonly fb = new FormBuilder();
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    username: '',
    password: '',
  });

  loading = false;
  message = '';

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.message = '';

    this.http
      .post<LoginResponse>('/api/auth/login', this.form.getRawValue())
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem(
            'user',
            JSON.stringify({
              userId: response.userId,
              username: response.username,
              role: response.role,
            }),
          );

          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.message =
            error.error?.message ?? 'Login failed. Please try again.';
          this.loading = false;
        },
      });
  }
}
