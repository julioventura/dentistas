import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrmDashboardComponent } from './components/crm-dashboard/crm-dashboard.component';
import { PipelineViewComponent } from './components/pipeline-view/pipeline-view.component';
import { LeadDetailComponent } from './components/lead-detail/lead-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CrmDashboardComponent
  },
  {
    path: 'pipeline',
    component: PipelineViewComponent
  },
  {
    path: 'leads',
    component: CrmDashboardComponent
  },
  {
    path: 'lead/:collection/:id',
    component: LeadDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }