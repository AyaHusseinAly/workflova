export const STAGES = [
  'Applied',
  'Screening',
  'First Interview',
  'Technical Interview',
  'Offer',
  'Hired',
  'Rejected',
] as const;

export type Stage = (typeof STAGES)[number];

export type CandidateAction = 'schedule' | 'reject' | 'hire';

export interface CandidateActivity {
  type: 'note' | 'stage_change' | 'interview' | 'feedback' | 'status';
  text: string;
  at: string;
}

export interface Candidate {
  id: string;
  name: string;
  position: string;
  experience: number;
  stage: Stage;
  status: 'active' | 'hired' | 'rejected';
  tags: string[];
  notes: string[];
  interviewFeedback: string[];
  timeline: CandidateActivity[];
}
