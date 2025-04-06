import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CrmService } from '../../services/crm.service';
import { ReminderService } from '../../services/reminder.service';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-crm-dashboard',
  templateUrl: './crm-dashboard.component.html',
  styleUrls: ['./crm-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MaterialModule,
    CurrencyPipe,
    DatePipe
  ]
})
export class CrmDashboardComponent implements OnInit {
  // Dados para métricas
  metricas: any = {
    byStatus: {},
    valorPotencialTotal: 0
  };
  lembretesPendentes$: Observable<any[]>;
  lembretesAtrasados$: Observable<any[]>;
  isLoading = true;
  
  // Coleções disponíveis para CRM
  colecoes = [
    { id: 'pacientes', titulo: 'Pacientes', icone: 'healing' },
    { id: 'dentistas', titulo: 'Dentistas', icone: 'medical_services' },
    { id: 'fornecedores', titulo: 'Fornecedores', icone: 'inventory' },
    { id: 'proteticos', titulo: 'Protéticos', icone: 'construction' }
  ];

  constructor(
    private crmService: CrmService,
    private reminderService: ReminderService,
    private router: Router
  ) {
    this.lembretesPendentes$ = this.reminderService.getPendingReminders();
    this.lembretesAtrasados$ = this.reminderService.getOverdueReminders();
  }

  ngOnInit(): void {
    this.carregarMetricas();
  }

  carregarMetricas(): void {
    this.isLoading = true;
    
    this.crmService.getCrmMetrics('pacientes')
      .subscribe({
        next: (metrics) => {
          this.metricas = metrics || {
            byStatus: {},
            valorPotencialTotal: 0
          };
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar métricas:', error);
          this.isLoading = false;
        }
      });
  }

  abrirPipeline(): void {
    this.router.navigate(['/crm/pipeline']);
  }

  abrirLeadsPorStatus(status: string): void {
    // Fix: ensure status is used correctly, not called as a function
    this.router.navigate(['/crm/leads'], { 
      queryParams: { status: status }
    });
  }

  irParaColecao(colecao: string): void {
    this.router.navigate(['/list', colecao], {
      queryParams: { crm: 'true' }
    });
  }
  
  marcarLembreteComoConcluido(lembrete: any): void {
    if (lembrete && lembrete.parentPath && lembrete.id) {
      const paths = lembrete.parentPath.split('/');
      if (paths.length >= 2) {
        const collectionPath = paths[0];
        const docId = paths[1];
        
        this.reminderService.markReminderAsCompleted(collectionPath, docId, lembrete.id)
          .then(() => {
            this.lembretesPendentes$ = this.reminderService.getPendingReminders();
            this.lembretesAtrasados$ = this.reminderService.getOverdueReminders();
          });
      }
    }
  }
}

