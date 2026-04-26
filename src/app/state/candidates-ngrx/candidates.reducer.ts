import { createReducer, on } from '@ngrx/store';
import { CandidatesActions } from './candidates.actions';
import { CandidatesState, initialCandidatesState } from './candidates.state';

export const candidatesReducer = createReducer(
  initialCandidatesState,
  on(CandidatesActions.updateStage, (state, { candidateId, stage }) => ({
    ...state,
    candidates: state.candidates.map((candidate) =>
      candidate.id === candidateId
        ? {
            ...candidate,
            stage,
            timeline: [{ type: 'stage_change', text: `Moved to ${stage}`, at: timestamp() }, ...candidate.timeline],
          }
        : candidate,
    ),
  })),
  on(CandidatesActions.addNote, (state, { candidateId, note }) => {
    const value = note.trim();
    if (!value) {
      return state;
    }

    return {
      ...state,
      candidates: state.candidates.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              notes: [value, ...candidate.notes],
              timeline: [{ type: 'note', text: value, at: timestamp() }, ...candidate.timeline],
            }
          : candidate,
      ),
    };
  }),
  on(CandidatesActions.addInterviewFeedback, (state, { candidateId, feedback }) => {
    const value = feedback.trim();
    if (!value) {
      return state;
    }

    return {
      ...state,
      candidates: state.candidates.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              interviewFeedback: [value, ...candidate.interviewFeedback],
              timeline: [{ type: 'feedback', text: value, at: timestamp() }, ...candidate.timeline],
            }
          : candidate,
      ),
    };
  }),
  on(CandidatesActions.applyAction, (state, { candidateId, action }) => ({
    ...state,
    candidates: state.candidates.map((candidate) => {
      if (candidate.id !== candidateId) {
        return candidate;
      }

      if (action === 'schedule') {
        return {
          ...candidate,
          timeline: [{ type: 'interview', text: 'Interview scheduled', at: timestamp() }, ...candidate.timeline],
        };
      }

      if (action === 'reject') {
        return {
          ...candidate,
          stage: 'Rejected',
          status: 'rejected',
          timeline: [{ type: 'status', text: 'Candidate rejected', at: timestamp() }, ...candidate.timeline],
        };
      }

      return {
        ...candidate,
        stage: 'Hired',
        status: 'hired',
        timeline: [{ type: 'status', text: 'Candidate hired', at: timestamp() }, ...candidate.timeline],
      };
    }),
  })),
);

function timestamp(): string {
  return new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
