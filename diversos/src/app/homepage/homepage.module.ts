import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage.component'; // Certifique-se de que está importando o componente correto

@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomepageComponent } // Carrega o componente correto
    ])
  ],
  exports: [
    HomepageComponent
  ]
})
export class HomepageModule { }
