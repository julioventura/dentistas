import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmRoutingModule } from './crm-routing.module';

import { CrmDashboardComponent } from './components/crm-dashboard/crm-dashboard.component';
import { PipelineViewComponent } from './components/pipeline-view/pipeline-view.component';
import { LeadDetailComponent } from './components/lead-detail/lead-detail.component';
import { ReminderFormComponent } from './components/reminder-form/reminder-form.component';

@NgModule({
  imports: [
    CommonModule,
    CrmRoutingModule,
    // These components are imported as they are standalone
    CrmDashboardComponent,
    PipelineViewComponent,
    LeadDetailComponent,
    ReminderFormComponent
  ]
})
export class CrmModule { }