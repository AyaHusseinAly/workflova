import { createActionGroup, props } from '@ngrx/store';
import { CandidateAction, Stage } from '../../models/candidate.model';

export const CandidatesActions = createActionGroup({
  source: 'Candidates',
  events: {
    'Update Stage': props<{ candidateId: string; stage: Stage }>(),
    'Add Note': props<{ candidateId: string; note: string }>(),
    'Add Interview Feedback': props<{ candidateId: string; feedback: string }>(),
    'Apply Action': props<{ candidateId: string; action: CandidateAction }>(),
  },
});
