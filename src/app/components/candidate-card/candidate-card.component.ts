import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Candidate, CandidateAction } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidate-card.component.html',
  styleUrl: './candidate-card.component.scss',
})
export class CandidateCardComponent {
  readonly candidate = input.required<Candidate>();
  readonly action = output<CandidateAction>();

  onAction(action: CandidateAction): void {
    this.action.emit(action);
  }
}
