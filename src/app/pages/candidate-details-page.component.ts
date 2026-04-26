import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CandidatesActions } from '../state/candidates-ngrx/candidates.actions';
import { selectCandidateById } from '../state/candidates-ngrx/candidates.selectors';

@Component({
  selector: 'app-candidate-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './candidate-details-page.component.html',
  styleUrl: './candidate-details-page.component.scss',
})
export class CandidateDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  readonly noteInput = signal('');
  readonly feedbackInput = signal('');
  readonly candidateId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly candidate = this.store.selectSignal(selectCandidateById(this.candidateId));

  saveNote(): void {
    this.store.dispatch(CandidatesActions.addNote({ candidateId: this.candidateId, note: this.noteInput() }));
    this.noteInput.set('');
  }

  saveFeedback(): void {
    this.store.dispatch(
      CandidatesActions.addInterviewFeedback({ candidateId: this.candidateId, feedback: this.feedbackInput() }),
    );
    this.feedbackInput.set('');
  }
}
