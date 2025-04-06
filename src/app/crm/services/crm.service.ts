import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CRMData, PipelineConfig } from '../models/crm.model';
import { CRMConfig } from '../models/crm-config.model';

// Define an interface for the metrics response
interface CrmMetrics {
  total: number;
  byStatus: { [key: string]: number };
  bySource: { [key: string]: number };
  valorPotencialTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  constructor(
    private firestore: AngularFirestore
  ) { }
  
  // Obter dados de CRM para um registro específico
  getCrmData(collectionPath: string, docId: string): Observable<CRMData | null> {
    return this.firestore.doc(`${collectionPath}/${docId}`)
      .valueChanges()
      .pipe(
        map((doc: any) => doc?.crmData || null),
        catchError(error => {
          console.error('Erro ao obter dados CRM:', error);
          return of(null);
        })
      );
  }
  
  // Atualizar ou criar dados de CRM para um registro
  updateCrmData(collectionPath: string, docId: string, crmData: CRMData): Promise<void> {
    const updatedData = {
      ...crmData,
      updatedAt: new Date()
    };
    
    return this.firestore.doc(`${collectionPath}/${docId}`)
      .update({ crmData: updatedData })
      .catch(error => {
        console.error('Erro ao atualizar dados CRM:', error);
        throw error;
      });
  }
  
  // Inicializar dados de CRM para um novo registro
  initializeCrmData(collectionPath: string, docId: string): Promise<void> {
    // Obter configuração padrão para determinar estágio inicial
    return this.getCrmConfig().pipe(
      map(config => {
        const defaultStage = config?.pipeline?.defaultStage || 'novo';
        
        const crmData: CRMData = {
          leadStatus: defaultStage as any,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return crmData;
      }),
      catchError(() => {
        // Configuração padrão caso não exista configuração no banco
        const crmData: CRMData = {
          leadStatus: 'novo',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return of(crmData);
      })
    ).toPromise()
    .then(crmData => {
      return this.firestore.doc(`${collectionPath}/${docId}`)
        .update({ crmData });
    });
  }
  
  // Obter registros por status para o pipeline
  getRegistrosByStatus(collectionPath: string, status?: string): Observable<any[]> {
    if (status) {
      return this.firestore.collection(collectionPath, ref => 
        ref.where('crmData.leadStatus', '==', status)
      ).valueChanges({ idField: 'id' });
    } else {
      return this.firestore.collection(collectionPath, ref => 
        ref.where('crmData', '!=', null)
      ).valueChanges({ idField: 'id' });
    }
  }
  
  // Obter todos os registros com dados de CRM
  getAllCrmRegistros(collectionPath: string): Observable<any[]> {
    return this.firestore.collection(collectionPath, ref => 
      ref.where('crmData', '!=', null)
    ).valueChanges({ idField: 'id' });
  }
  
  // Obter configuração do CRM
  getCrmConfig(): Observable<CRMConfig | null> {
    return this.firestore.doc('configuracoes/crm')
      .valueChanges()
      .pipe(
        map((config: any) => config as CRMConfig),
        catchError(error => {
          console.error('Erro ao obter configuração CRM:', error);
          return of(null);
        })
      );
  }
  
  // Obter configuração do pipeline
  getPipelineConfig(): Observable<PipelineConfig | null> {
    return this.getCrmConfig().pipe(
      map(config => {
        if (config && config.pipeline) {
          return {
            stages: config.pipeline.stages,
            isActive: true
          };
        }
        return null;
      })
    );
  }
  
  // Atualizar configuração do CRM
  updateCrmConfig(config: CRMConfig): Promise<void> {
    return this.firestore.doc('configuracoes/crm')
      .set(config, { merge: true })
      .catch(error => {
        console.error('Erro ao atualizar configuração CRM:', error);
        throw error;
      });
  }
  
  // Obter métricas básicas do CRM
  getCrmMetrics(collectionPath: string): Observable<CrmMetrics> {
    return this.getAllCrmRegistros(collectionPath).pipe(
      map(registros => {
        const metrics: CrmMetrics = {
          total: registros.length,
          byStatus: {},
          bySource: {},
          valorPotencialTotal: 0
        };
        
        registros.forEach(registro => {
          if (registro.crmData) {
            // Contagem por status
            const status = registro.crmData.leadStatus as string;
            if (status) {
              metrics.byStatus[status] = (metrics.byStatus[status] || 0) + 1;
            }
            
            // Contagem por origem
            if (registro.crmData.leadSource) {
              const source = registro.crmData.leadSource as string;
              metrics.bySource[source] = (metrics.bySource[source] || 0) + 1;
            }
            
            // Somar valor potencial
            if (registro.crmData.valorPotencial) {
              metrics.valorPotencialTotal += registro.crmData.valorPotencial;
            }
          }
        });
        
        return metrics;
      })
    );
  }
}