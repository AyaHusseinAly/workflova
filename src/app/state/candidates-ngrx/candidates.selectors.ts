import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CandidatesState, CANDIDATES_FEATURE_KEY } from './candidates.state';

export const selectCandidatesState = createFeatureSelector<CandidatesState>(CANDIDATES_FEATURE_KEY);

export const selectAllCandidates = createSelector(selectCandidatesState, (state) => state.candidates);

export const selectHydratedTemplateId = createSelector(
  selectCandidatesState,
  (state) => state.hydratedTemplateId,
);

export const selectCandidateById = (candidateId: string) =>
  createSelector(selectAllCandidates, (candidates) => candidates.find((candidate) => candidate.id === candidateId));
