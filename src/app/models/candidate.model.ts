export type CandidateAction = 'schedule' | 'reject' | 'hire';

export interface CandidateActivity {
  type: 'note' | 'stage_change' | 'interview' | 'feedback' | 'status';
  text: string;
  at: string;
}

/** Workflow column id — comes from the active domain template `stages`. */
export type WorkflowStage = string;

export interface Candidate {
  id: string;
  name: string;
  position: string;
  experience: number;
  stage: WorkflowStage;
  status: 'active' | 'hired' | 'rejected';
  tags: string[];
  notes: string[];
  interviewFeedback: string[];
  timeline: CandidateActivity[];
}
