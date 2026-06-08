export type WorkspaceTemplateId =
  | 'recruitment'
  | 'real-estate'
  | 'student-admission'
  | 'insurance-claims'
  | 'order-fulfillment'
  | 'customer-onboarding';

export type WorkspaceMemberRole = 'Admin' | 'Member' | 'Viewer';

export interface WorkspaceTemplate {
  id: WorkspaceTemplateId;
  name: string;
  description: string;
  entityLabel: string;
  /** Plural label for board counts (e.g. "Candidates", "Leads"). */
  entityPlural: string;
  /** Label for the secondary filter (maps to `position` on each record). */
  secondaryFilterLabel: string;
  stages: string[];
  /** Stage name moved to when using the primary "win" action on a card. */
  successStage: string;
  /** Stage name moved to when using the "lose" action on a card. */
  failureStage: string;
  accentFrom: string;
  accentTo: string;
}

export interface WorkspaceInvite {
  email: string;
  role: WorkspaceMemberRole;
}

export interface UserWorkspace {
  userId: string;
  boardName: string;
  templateId: WorkspaceTemplateId;
  invites: WorkspaceInvite[];
  completedAt: string;
}
