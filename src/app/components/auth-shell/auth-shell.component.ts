import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss',
})
export class AuthShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly footerPrompt = input.required<string>();
  readonly footerLinkLabel = input.required<string>();
  readonly footerLinkPath = input.required<string>();
}
