import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthShellComponent } from '../components/auth-shell/auth-shell.component';
import { DemoAuthService } from '../auth/services/demo-auth.service';
import { DemoWorkspaceService } from '../onboarding/services/demo-workspace.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [ReactiveFormsModule, AuthShellComponent],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss',
})
export class SignupPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(DemoAuthService);
  private readonly workspace = inject(DemoWorkspaceService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    try {
      const { email, password } = this.form.getRawValue();
      this.auth.signup(email, password);
      void this.router.navigateByUrl(this.workspace.getPostAuthRoute());
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to create your account.');
    } finally {
      this.submitting.set(false);
    }
  }

  hasError(controlName: 'email' | 'password' | 'confirmPassword', errorCode: string): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.hasError(errorCode);
  }

  hasPasswordMismatch(): boolean {
    return this.form.touched && this.form.hasError('passwordMismatch');
  }
}
