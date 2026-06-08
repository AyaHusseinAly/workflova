import { Candidate } from '../../models/candidate.model';

export const CANDIDATES_FEATURE_KEY = 'candidates';

export interface CandidatesState {
  candidates: Candidate[];
  /** Last template id used to populate the board (null = not hydrated yet). */
  hydratedTemplateId: string | null;
  successStage: string;
  failureStage: string;
}

export const initialCandidatesState: CandidatesState = {
  candidates: [],
  hydratedTemplateId: null,
  successStage: 'Hired',
  failureStage: 'Rejected',
};
