import { createActionGroup, props } from '@ngrx/store';
import { Candidate, CandidateAction } from '../../models/candidate.model';

export const CandidatesActions = createActionGroup({
  source: 'Candidates',
  events: {
    'Hydrate Board': props<{
      templateId: string;
      candidates: Candidate[];
      successStage: string;
      failureStage: string;
    }>(),
    'Update Stage': props<{ candidateId: string; stage: string }>(),
    'Add Note': props<{ candidateId: string; note: string }>(),
    'Add Interview Feedback': props<{ candidateId: string; feedback: string }>(),
    'Apply Action': props<{ candidateId: string; action: CandidateAction }>(),
  },
});
