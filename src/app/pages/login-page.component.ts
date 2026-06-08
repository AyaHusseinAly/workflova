import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';
import { DemoAuthService } from '../auth/services/demo-auth.service';
import { DemoWorkspaceService } from '../onboarding/services/demo-workspace.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, AuthShellComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(DemoAuthService);
  private readonly workspace = inject(DemoWorkspaceService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    try {
      const { email, password } = this.form.getRawValue();
      this.auth.login(email, password);
      void this.router.navigateByUrl(this.workspace.getPostAuthRoute());
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      this.submitting.set(false);
    }
  }

  hasError(controlName: 'email' | 'password', errorCode: string): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.hasError(errorCode);
  }
}
