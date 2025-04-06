import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { CrmService } from '../../services/crm.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-pipeline-view',
  templateUrl: './pipeline-view.component.html',
  styleUrls: ['./pipeline-view.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DragDropModule, MaterialModule]
})
export class PipelineViewComponent implements OnInit {
  stageIds = ['novo', 'qualificado', 'em_atendimento', 'follow_up', 'concluido'];
  stageLabels: {[key: string]: string} = {
    'novo': 'Novos Leads',
    'qualificado': 'Qualificados',
    'em_atendimento': 'Em Atendimento',
    'follow_up': 'Follow-up',
    'concluido': 'Concluídos'
  };
  stageColors: {[key: string]: string} = {
    'novo': '#42a5f5',
    'qualificado': '#7e57c2',
    'em_atendimento': '#26a69a',
    'follow_up': '#ff7043',
    'concluido': '#66bb6a'
  };
  
  pipeline: {[key: string]: any[]} = {};
  selectedCollection = 'pacientes';
  isLoading = true;
  collections = [
    { id: 'pacientes', label: 'Pacientes' },
    { id: 'dentistas', label: 'Dentistas' },
    { id: 'fornecedores', label: 'Fornecedores' },
    { id: 'proteticos', label: 'Protéticos' }
  ];

  constructor(
    private crmService: CrmService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadPipeline();
  }

  loadPipeline(): void {
    this.isLoading = true;
    
    // Inicializar o pipeline
    this.stageIds.forEach(stageId => {
      this.pipeline[stageId] = [];
    });
    
    // Carregar dados para cada estágio
    const observables = this.stageIds.map(stageId => 
      this.crmService.getRegistrosByStatus(this.selectedCollection, stageId)
    );
    
    forkJoin(observables)
      .subscribe({
        next: (results) => {
          results.forEach((registros, index) => {
            const stageId = this.stageIds[index];
            this.pipeline[stageId] = registros;
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar pipeline:', error);
          this.snackBar.open('Erro ao carregar dados', 'OK', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      
      // Atualizar o status no Firestore
      const item = event.container.data[event.currentIndex];
      const newStage = event.container.id;
      
      if (item && item.crmData) {
        const updatedCrmData = {
          ...item.crmData,
          leadStatus: newStage,
          updatedAt: new Date()
        };
        
        this.crmService.updateCrmData(this.selectedCollection, item.id, updatedCrmData)
          .then(() => {
            this.snackBar.open('Status atualizado com sucesso', 'OK', { duration: 2000 });
          })
          .catch(error => {
            console.error('Erro ao atualizar status:', error);
            this.snackBar.open('Erro ao atualizar status', 'OK', { duration: 3000 });
            
            // Reverter a operação em caso de erro
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              event.currentIndex,
              event.previousIndex,
            );
          });
      }
    }
  }

  onCollectionChange(): void {
    this.loadPipeline();
  }

  viewRegistro(collection: string, id: string): void {
    this.router.navigate(['/view', collection, id]);
  }

  getBackgroundStyle(stageId: string): object {
    return {
      'border-top': `4px solid ${this.stageColors[stageId] || '#999'}`
    };
  }
}