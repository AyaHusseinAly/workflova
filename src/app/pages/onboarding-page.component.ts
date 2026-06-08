import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DemoAuthService } from '../auth/services/demo-auth.service';
import { WORKSPACE_TEMPLATES } from '../onboarding/data/workspace-templates';
import { WorkflowTemplateIconComponent } from '../components/workflow-template-icon/workflow-template-icon.component';
import { DemoWorkspaceService } from '../onboarding/services/demo-workspace.service';
import {
  WorkspaceInvite,
  WorkspaceMemberRole,
  WorkspaceTemplateId,
} from '../onboarding/models/workspace-template.model';

@Component({
  selector: 'app-onboarding-page',
  standalone: true,
  imports: [ReactiveFormsModule, WorkflowTemplateIconComponent],
  templateUrl: './onboarding-page.component.html',
  styleUrl: './onboarding-page.component.scss',
})
export class OnboardingPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(DemoAuthService);
  private readonly workspace = inject(DemoWorkspaceService);
  private readonly router = inject(Router);

  readonly step = signal<1 | 2>(1);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly templates = WORKSPACE_TEMPLATES;
  readonly roles: WorkspaceMemberRole[] = ['Admin', 'Member', 'Viewer'];
  readonly session = this.auth.currentSession;

  readonly setupForm = this.formBuilder.nonNullable.group({
    boardName: ['', [Validators.required, Validators.minLength(2)]],
    templateId: this.formBuilder.control<WorkspaceTemplateId | null>(null, Validators.required),
  });

  readonly inviteForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email]],
    role: this.formBuilder.nonNullable.control<WorkspaceMemberRole>('Member'),
  });

  readonly pendingInvites = signal<WorkspaceInvite[]>([]);

  readonly selectedTemplate = computed(() => {
    const templateId = this.setupForm.controls.templateId.value;
    return templateId ? this.workspace.getTemplate(templateId) : null;
  });

  continueToInvites(): void {
    this.errorMessage.set(null);

    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      return;
    }

    this.step.set(2);
  }

  backToSetup(): void {
    this.errorMessage.set(null);
    this.step.set(1);
  }

  addInvite(): void {
    this.errorMessage.set(null);
    const emailControl = this.inviteForm.controls.email;

    if (emailControl.invalid || !emailControl.value.trim()) {
      emailControl.markAsTouched();
      return;
    }

    const email = emailControl.value.trim().toLowerCase();
    const role = this.inviteForm.controls.role.value;

    if (this.pendingInvites().some((invite) => invite.email === email)) {
      this.errorMessage.set('That teammate is already on the invite list.');
      return;
    }

    this.pendingInvites.update((invites) => [...invites, { email, role }]);
    this.inviteForm.reset({ email: '', role: 'Member' });
  }

  removeInvite(email: string): void {
    this.pendingInvites.update((invites) => invites.filter((invite) => invite.email !== email));
  }

  finishOnboarding(invites: WorkspaceInvite[] = this.pendingInvites()): void {
    this.errorMessage.set(null);

    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      this.step.set(1);
      return;
    }

    this.submitting.set(true);

    try {
      const { boardName, templateId } = this.setupForm.getRawValue();
      if (!templateId) {
        throw new Error('Choose a workflow template to continue.');
      }

      this.workspace.completeOnboarding(boardName, templateId, invites);
      void this.router.navigateByUrl('/');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to create your board.');
    } finally {
      this.submitting.set(false);
    }
  }

  skipInvites(): void {
    this.finishOnboarding([]);
  }

  signOut(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }

  selectTemplate(templateId: WorkspaceTemplateId): void {
    this.setupForm.controls.templateId.setValue(templateId);
    this.setupForm.controls.templateId.markAsTouched();
  }

  hasSetupError(controlName: 'boardName' | 'templateId', errorCode: string): boolean {
    const control = this.setupForm.controls[controlName];
    return control.touched && control.hasError(errorCode);
  }

  hasInviteEmailError(): boolean {
    const control = this.inviteForm.controls.email;
    return control.touched && control.hasError('email');
  }
}
