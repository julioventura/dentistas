import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrmDashboardComponent } from './components/crm-dashboard/crm-dashboard.component';
import { PipelineViewComponent } from './components/pipeline-view/pipeline-view.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }