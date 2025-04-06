import { NgModule } from '@angular/core';
import { CrmRoutingModule } from './crm-routing.module';
import { CrmDashboardComponent } from './components/crm-dashboard/crm-dashboard.component';
import { PipelineViewComponent } from './components/pipeline-view/pipeline-view.component';

@NgModule({
  imports: [
    CrmRoutingModule,
    CrmDashboardComponent,
    PipelineViewComponent
  ]
})
export class CrmModule { }