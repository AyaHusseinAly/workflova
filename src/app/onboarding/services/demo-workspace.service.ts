import { Injectable, computed, inject, signal } from '@angular/core';
import { DemoAuthService } from '../../auth/services/demo-auth.service';
import {
  UserWorkspace,
  WorkspaceInvite,
  WorkspaceTemplateId,
} from '../models/workspace-template.model';
import { WORKSPACE_TEMPLATES } from '../data/workspace-templates';

const WORKSPACES_STORAGE_KEY = 'workflova.demo.workspaces';

@Injectable({ providedIn: 'root' })
export class DemoWorkspaceService {
  private readonly auth = inject(DemoAuthService);
  private readonly workspaces = signal<Record<string, UserWorkspace>>(this.readWorkspaces());

  readonly templates = WORKSPACE_TEMPLATES;
  readonly currentWorkspace = computed(() => {
    const session = this.auth.currentSession();
    if (!session) {
      return null;
    }

    return this.workspaces()[session.userId] ?? null;
  });

  hasCompletedOnboarding(userId: string): boolean {
    return Boolean(this.workspaces()[userId]);
  }

  completeOnboarding(
    boardName: string,
    templateId: WorkspaceTemplateId,
    invites: WorkspaceInvite[] = [],
  ): UserWorkspace {
    const session = this.auth.currentSession();
    if (!session) {
      throw new Error('You need to be signed in to create a board.');
    }

    const workspace: UserWorkspace = {
      userId: session.userId,
      boardName: boardName.trim(),
      templateId,
      invites,
      completedAt: new Date().toISOString(),
    };

    const nextWorkspaces = {
      ...this.workspaces(),
      [session.userId]: workspace,
    };

    this.writeWorkspaces(nextWorkspaces);
    this.workspaces.set(nextWorkspaces);
    return workspace;
  }

  getPostAuthRoute(): string {
    const session = this.auth.currentSession();
    if (!session) {
      return '/login';
    }

    return this.hasCompletedOnboarding(session.userId) ? '/' : '/onboarding';
  }

  getTemplate(templateId: WorkspaceTemplateId) {
    return this.templates.find((template) => template.id === templateId) ?? null;
  }

  private readWorkspaces(): Record<string, UserWorkspace> {
    const raw = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, UserWorkspace>;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  private writeWorkspaces(workspaces: Record<string, UserWorkspace>): void {
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces));
  }
}
