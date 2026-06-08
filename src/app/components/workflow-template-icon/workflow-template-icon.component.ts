import { Component, input } from '@angular/core';
import { WorkspaceTemplateId } from '../../onboarding/models/workspace-template.model';

@Component({
  selector: 'app-workflow-template-icon',
  standalone: true,
  templateUrl: './workflow-template-icon.component.html',
  styleUrl: './workflow-template-icon.component.scss',
})
export class WorkflowTemplateIconComponent {
  readonly templateId = input.required<WorkspaceTemplateId>();
  readonly accentFrom = input.required<string>();
  readonly accentTo = input.required<string>();
}
