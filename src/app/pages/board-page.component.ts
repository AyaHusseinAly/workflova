import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Candidate, STAGES, Stage } from '../models/candidate.model';
import { CandidateCardComponent } from '../components/candidate-card/candidate-card.component';
import { CandidatesActions } from '../state/candidates-ngrx/candidates.actions';
import { selectAllCandidates } from '../state/candidates-ngrx/candidates.selectors';

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, CandidateCardComponent],
  templateUrl: './board-page.component.html',
  styleUrl: './board-page.component.scss',
})
export class BoardPageComponent {
  private readonly store = inject(Store);
  readonly stages = STAGES;

  readonly search = signal('');
  readonly selectedTag = signal('all');
  readonly selectedPosition = signal('all');
  readonly candidates = this.store.selectSignal(selectAllCandidates);

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

  byStage(stage: Stage): Candidate[] {
    return this.filtered().filter((candidate) => candidate.stage === stage);
  }

  onDrop(stage: Stage, event: CdkDragDrop<Candidate[]>): void {
    const moved = event.item.data;
    if (!moved || moved.stage === stage) {
      return;
    }

    this.store.dispatch(CandidatesActions.updateStage({ candidateId: moved.id, stage }));
  }

  runAction(candidateId: string, action: 'schedule' | 'reject' | 'hire'): void {
    this.store.dispatch(CandidatesActions.applyAction({ candidateId, action }));
  }
}
