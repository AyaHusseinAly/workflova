import { CandidatesActions } from './candidates.actions';
import { candidatesReducer } from './candidates.reducer';
import { initialCandidatesState } from './candidates.state';
import { getSeedCandidatesForTemplate } from '../../data/domain-board.seed';

describe('candidatesReducer', () => {
  it('updates candidate stage and prepends timeline event', () => {
    const seeded = candidatesReducer(
      initialCandidatesState,
      CandidatesActions.hydrateBoard({
        templateId: 'recruitment',
        candidates: getSeedCandidatesForTemplate('recruitment'),
        successStage: 'Hired',
        failureStage: 'Rejected',
      }),
    );

    const candidateId = seeded.candidates[0].id;
    const updated = candidatesReducer(
      seeded,
      CandidatesActions.updateStage({ candidateId, stage: 'Screening' }),
    );

    const candidate = updated.candidates.find((item) => item.id === candidateId);

    expect(candidate?.stage).toBe('Screening');
    expect(candidate?.timeline[0].type).toBe('stage_change');
    expect(candidate?.timeline[0].text).toBe('Moved to Screening');
  });
});
