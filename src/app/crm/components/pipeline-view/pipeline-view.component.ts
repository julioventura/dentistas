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
import { PipelineConfig, PipelineStage } from '../../models/crm.model';

@Component({
  selector: 'app-pipeline-view',
  templateUrl: './pipeline-view.component.html',
  styleUrls: ['./pipeline-view.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DragDropModule, MaterialModule]
})
export class PipelineViewComponent implements OnInit {
  stageIds: string[] = [];
  stageLabels: {[key: string]: string} = {};
  pipeline: {[key: string]: any[]} = {};
  isLoading = true;
  selectedCollection = 'pacientes';
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
    this.loadPipelineData();
  }

  loadPipeline(): void {
    this.loadPipelineData();
  }

  loadPipelineData(): void {
    this.isLoading = true;
    
    // Use map operator to transform the response before subscribing
    this.crmService.getPipelineConfig().pipe(
      map(config => {
        // Transform the config to ensure we have consistent format
        if (config && config.stages) {
          // Convert array to record if it's an array
          let stagesRecord: Record<string, any>;
          
          if (Array.isArray(config.stages)) {
            // Convert array to a record with IDs as keys
            stagesRecord = {};
            config.stages.forEach((stage: any, index: number) => {
              // Use the label as key if available, otherwise use index
              const key = stage.label?.toLowerCase?.().replace(/\s+/g, '_') || `stage_${index}`;
              stagesRecord[key] = stage;
            });
          } else {
            // Already a record/object, just use as is
            stagesRecord = config.stages as any;
          }
          
          return {
            stages: stagesRecord,
            isActive: config.isActive
          };
        }
        return null;
      })
    ).subscribe(config => {
      // Now work with the transformed config
      if (config && config.stages) {
        this.stageIds = Object.keys(config.stages);
        this.stageLabels = {};
        
        // Initialize pipeline object
        this.stageIds.forEach(stageId => {
          this.pipeline[stageId] = [];
          // Access stage properties safely with any type
          const stage = config.stages[stageId];
          this.stageLabels[stageId] = stage?.label || stageId;
        });
        
        // Rest of the method remains unchanged
        const observables: Observable<any[]>[] = [];
        this.stageIds.forEach(stageId => {
          observables.push(this.crmService.getRegistrosByStatus(this.selectedCollection, stageId));
        });
        
        if (observables.length > 0) {
          forkJoin(observables).subscribe(results => {
            results.forEach((leads, index) => {
              this.pipeline[this.stageIds[index]] = leads;
            });
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
        }
      } else {
        // Handle case where config is null or has no stages
        this.isLoading = false;
        this.snackBar.open('Configuração de pipeline não encontrada', 'OK', {
          duration: 3000
        });
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
      
      // Update lead status
      const lead = event.container.data[event.currentIndex];
      const newStatus = event.container.id;
      
      this.crmService.updateCrmData(this.selectedCollection, lead.id, {
        ...lead.crmData,
        leadStatus: newStatus
      }).then(() => {
        this.snackBar.open('Status atualizado com sucesso', 'OK', {
          duration: 3000
        });
      }).catch(err => {
        this.snackBar.open('Erro ao atualizar status', 'OK', {
          duration: 3000
        });
      });
    }
  }

  onCollectionChange(): void {
    this.loadPipelineData();
  }

  viewRegistro(collection: string, id: string): void {
    this.router.navigate(['/view', collection, id]);
  }

  getBackgroundStyle(stageId: string): any {
    // Define colors with index signature
    const colors: {[key: string]: string} = {
      'novo': '#e3f2fd',
      'qualificado': '#e8f5e9',
      'em_atendimento': '#fff8e1', 
      'fechado_ganho': '#e8eaf6',
      'fechado_perdido': '#ffebee'
    };
    
    return {
      'background-color': colors[stageId] || '#f5f5f5'
    };
  }
}