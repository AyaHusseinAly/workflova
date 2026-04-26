import { INITIAL_CANDIDATES } from '../../data/candidates.seed';
import { Candidate } from '../../models/candidate.model';

export const CANDIDATES_FEATURE_KEY = 'candidates';

export interface CandidatesState {
  candidates: Candidate[];
}

export const initialCandidatesState: CandidatesState = {
  candidates: INITIAL_CANDIDATES,
};
