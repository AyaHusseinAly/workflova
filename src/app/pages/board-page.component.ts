import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DemoAuthService } from '../auth/services/demo-auth.service';
import { DemoWorkspaceService } from '../onboarding/services/demo-workspace.service';
import { Candidate } from '../models/candidate.model';
import { CandidateCardComponent } from '../components/candidate-card/candidate-card.component';
import { getSeedCandidatesForTemplate } from '../data/domain-board.seed';
import { CandidatesActions } from '../state/candidates-ngrx/candidates.actions';
import { selectAllCandidates, selectHydratedTemplateId } from '../state/candidates-ngrx/candidates.selectors';

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, CandidateCardComponent],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss',
})
export class BoardPageComponent {
  private readonly store = inject(Store);
  private readonly auth = inject(DemoAuthService);
  private readonly workspace = inject(DemoWorkspaceService);
  private readonly router = inject(Router);

  readonly session = this.auth.currentSession;
  readonly activeWorkspace = this.workspace.currentWorkspace;
  readonly activeTemplate = computed(() => {
    const workspace = this.activeWorkspace();
    return workspace ? this.workspace.getTemplate(workspace.templateId) : null;
  });

  readonly stages = computed(() => this.activeTemplate()?.stages ?? []);
  readonly hydratedTemplateId = this.store.selectSignal(selectHydratedTemplateId);

  readonly search = signal('');
  readonly selectedTag = signal('all');
  readonly selectedPosition = signal('all');
  readonly candidates = this.store.selectSignal(selectAllCandidates);

  constructor() {
    effect(() => {
      const workspace = this.activeWorkspace();
      const hydratedId = this.hydratedTemplateId();
      if (!workspace) {
        return;
      }

      if (hydratedId === workspace.templateId) {
        return;
      }

      const template = this.workspace.getTemplate(workspace.templateId);
      if (!template) {
        return;
      }

      this.store.dispatch(
        CandidatesActions.hydrateBoard({
          templateId: workspace.templateId,
          candidates: getSeedCandidatesForTemplate(workspace.templateId),
          successStage: template.successStage,
          failureStage: template.failureStage,
        }),
      );
    });
  }

  readonly tags = computed(() => {
    const values = new Set(this.candidates().flatMap((candidate) => candidate.tags));
    return [...values].sort((a, b) => a.localeCompare(b));
  });

  readonly positions = computed(() => {
    const values = new Set(this.candidates().map((candidate) => candidate.position));
    return [...values].sort((a, b) => a.localeCompare(b));
  });

  readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    const tag = this.selectedTag();
    const position = this.selectedPosition();

    return this.candidates().filter((candidate) => {
      const matchesQuery =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.position.toLowerCase().includes(query) ||
        candidate.tags.join(' ').toLowerCase().includes(query);
      const matchesTag = tag === 'all' || candidate.tags.includes(tag);
      const matchesPosition = position === 'all' || candidate.position === position;
      return matchesQuery && matchesTag && matchesPosition;
    });
  });

  byStage(stage: string): Candidate[] {
    return this.filtered().filter((candidate) => candidate.stage === stage);
  }

  onDrop(stage: string, event: CdkDragDrop<Candidate[]>): void {
    const moved = event.item.data;
    if (!moved || moved.stage === stage) {
      return;
    }

    this.store.dispatch(CandidatesActions.updateStage({ candidateId: moved.id, stage }));
  }

  runAction(candidateId: string, action: 'schedule' | 'reject' | 'hire'): void {
    this.store.dispatch(CandidatesActions.applyAction({ candidateId, action }));
  }

  signOut(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
