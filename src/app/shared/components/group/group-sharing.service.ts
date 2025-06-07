import { Injectable } from '@angular/core';
import { Observable, of, from, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from './group.service';
import { SharingMetadata } from './group.model';
import { LoggingService } from '../../services/logging.service';

@Injectable({
  providedIn: 'root'
})
export class GroupSharingService {
  constructor(
    private groupService: GroupService,
    private snackBar: MatSnackBar,
    private logger: LoggingService
  ) {}

  /**
   * Gerencia todas as operações de compartilhamento em um único método
   * @param collection Nome da coleção
   * @param recordId ID do registro
   * @param newGroupId Novo ID do grupo (null para remover compartilhamento)
   * @param previousGroupId ID de grupo anterior (null se não havia compartilhamento)
   * @returns Observable que completa quando a operação termina
   */
  handleRecordSharing(
    collection: string, 
    recordId: string, 
    newGroupId: string | null, 
    previousGroupId: string | null
  ): Observable<void> {
    this.logger.log('GroupSharingService', `Gerenciando compartilhamento: ${collection}/${recordId}`, 
      { newGroupId, previousGroupId });
    
    // Validação mais rigorosa
    if (!collection || !recordId) {
      const errorMsg = 'Parâmetros inválidos para compartilhamento';
      this.snackBar.open(errorMsg, 'OK', { duration: 5000 });
      return throwError(() => new Error(errorMsg));
    }

    // Verificar se o recordId é válido
    if (recordId.trim() === '' || recordId === 'undefined' || recordId === 'null') {
      const errorMsg = `ID do registro inválido: "${recordId}"`;
      this.snackBar.open(errorMsg, 'OK', { duration: 5000 });
      return throwError(() => new Error(errorMsg));
    }

    console.log('GroupSharingService: Tentando encontrar registro em diferentes caminhos...');
    
    // Tentar encontrar o registro em múltiplos caminhos
    return this.findRecordInMultiplePaths(collection, recordId).pipe(
      switchMap(({ foundCollection, record }) => {
        if (!record || !foundCollection) {
          const errorMsg = `Registro ${recordId} não encontrado. Pode ter sido excluído.`;
          this.snackBar.open(errorMsg, 'OK', { duration: 5000 });
          return throwError(() => new Error(errorMsg));
        }

        console.log(`GroupSharingService: Registro encontrado em: ${foundCollection}`);
        
        // Usar a coleção onde o registro foi encontrado
        return this.processSharing(foundCollection, recordId, newGroupId, previousGroupId);
      }),
      catchError(error => {
        this.logger.error('GroupSharingService', 'Erro na verificação inicial do registro', error);
        const errorMsg = this.getErrorMessage(error);
        this.snackBar.open(`Erro: ${errorMsg}`, 'OK', { duration: 5000 });
        return throwError(() => error);
      })
    );
  }

  /**
   * Carrega o histórico de compartilhamento de um registro
   * @param collection Nome da coleção
   * @param recordId ID do registro
   * @returns Observable com array de metadados de compartilhamento
   */
  loadSharingHistory(collection: string, recordId: string): Observable<SharingMetadata[]> {
    return this.groupService.getSharingHistory(collection, recordId).pipe(
      catchError(error => {
        this.logger.error('GroupSharingService', 'Erro ao carregar histórico de compartilhamento', error);
        this.snackBar.open(`Erro ao carregar histórico: ${error.message}`, 'OK', { duration: 3000 });
        return of([]);
      })
    );
  }

  /**
   * Carrega informações detalhadas dos grupos para exibição
   * @param groupIds Array de IDs de grupos
   * @returns Observable com objeto de detalhes dos grupos
   */
  loadGroupDetails(groupIds: string[]): Observable<{[key: string]: any}> {
    if (!groupIds || groupIds.length === 0) {
      return of({});
    }

    // Criar observables para cada grupo
    const requests = groupIds.map(id => 
      this.groupService.getGroup(id).pipe(
        map(group => ({ id, group })),
        catchError(error => {
          this.logger.error('GroupSharingService', `Erro ao carregar grupo ${id}`, error);
          return of({ id, group: null });
        })
      )
    );

    // Combinar resultados em um único objeto
    return forkJoin(requests).pipe(
      map(results => {
        const details: {[key: string]: any} = {};
        results.forEach(item => {
          if (item.group) {
            details[item.id] = item.group;
          }
        });
        return details;
      })
    );
  }

  /**
   * Obtém os detalhes de um grupo específico
   * @param groupId ID do grupo
   * @returns Observable com os detalhes do grupo ou null se não encontrado
   */
  getGroupDetails(groupId: string): Observable<any> {
    if (!groupId) {
        return of(null);
    }

    return this.groupService.getGroup(groupId).pipe(
      map(data => {
        if (!data) {
          return null;
        }
        // Garantir que o id seja sempre o groupId fornecido
        return { ...data, id: groupId };
      }),
      catchError(error => {
        if (error.code !== 'not-found' && error.code !== 'permission-denied') {
          console.error('Erro ao carregar detalhes do grupo:', error);
        }
        return of(null);
      })
    );
  }

  /**
   * Tenta encontrar o registro em diferentes caminhos possíveis
   */
  private findRecordInMultiplePaths(collection: string, recordId: string): Observable<{foundCollection: string | null, record: any}> {
    const possiblePaths = [
      collection, // Caminho original
    ];
    
    // Se não contém 'users/', adicionar o caminho do usuário
    if (!collection.includes('users/')) {
      // Obter userId atual usando o método público
      return this.groupService.getCurrentUser().pipe(
        take(1),
        switchMap(user => {
          if (user?.uid) {
            possiblePaths.push(`users/${user.uid}/${collection}`);
          }
          
          // Tentar cada caminho
          return this.tryPaths(possiblePaths, recordId);
        })
      );
    }
    
    return this.tryPaths(possiblePaths, recordId);
  }

  /**
   * Tenta encontrar o registro em cada caminho da lista
   */
  private tryPaths(paths: string[], recordId: string): Observable<{foundCollection: string | null, record: any}> {
    if (paths.length === 0) {
      return of({ foundCollection: null, record: null });
    }
    
    const currentPath = paths[0];
    const remainingPaths = paths.slice(1);
    
    return from(this.groupService.getRegistroById(currentPath, recordId)).pipe(
      switchMap(record => {
        if (record) {
          return of({ foundCollection: currentPath, record });
        }
        
        // Se não encontrou neste caminho, tentar o próximo
        return this.tryPaths(remainingPaths, recordId);
      }),
      catchError(() => {
        // Se deu erro neste caminho, tentar o próximo
        return this.tryPaths(remainingPaths, recordId);
      })
    );
  }

  /**
   * Processa o compartilhamento após encontrar o registro
   */
  private processSharing(
    collection: string,
    recordId: string, 
    newGroupId: string | null, 
    previousGroupId: string | null
  ): Observable<void> {
    // Sem mudança no compartilhamento
    if (newGroupId === previousGroupId) {
      this.logger.log('GroupSharingService', 'Sem mudanças no compartilhamento');
      return of(void 0);
    }

    // Remover compartilhamento
    if (!newGroupId && previousGroupId) {
      this.logger.log('GroupSharingService', 'Removendo compartilhamento');
      return from(this.groupService.removeRecordSharing(collection, recordId)).pipe(
        tap(() => this.snackBar.open('Compartilhamento removido', 'OK', { duration: 3000 })),
        catchError(error => {
          this.logger.error('GroupSharingService', 'Erro ao remover compartilhamento', error);
          const errorMsg = this.getErrorMessage(error);
          this.snackBar.open(`Erro ao remover compartilhamento: ${errorMsg}`, 'OK', { duration: 5000 });
          return throwError(() => error);
        })
      );
    }

    // Adicionar ou atualizar compartilhamento
    if (newGroupId) {
      const operation = previousGroupId ? 'Atualizando' : 'Adicionando';
      this.logger.log('GroupSharingService', `${operation} compartilhamento para grupo: ${newGroupId}`);
      
      return from(this.groupService.shareRecordWithGroup(collection, recordId, newGroupId)).pipe(
        tap(() => this.snackBar.open('Registro compartilhado com o grupo', 'OK', { duration: 3000 })),
        catchError(error => {
          this.logger.error('GroupSharingService', 'Erro ao compartilhar registro', error);
          const errorMsg = this.getErrorMessage(error);
          this.snackBar.open(`Erro ao compartilhar registro: ${errorMsg}`, 'OK', { duration: 5000 });
          return throwError(() => error);
        })
      );
    }

    return of(void 0);
  }

  /**
   * Extrai mensagem de erro mais amigável
   */
  private getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.code) {
      switch (error.code) {
        case 'not-found':
          return 'Registro não encontrado';
        case 'permission-denied':
          return 'Sem permissão para esta operação';
        default:
          return `Erro do sistema: ${error.code}`;
      }
    }
    
    return 'Erro desconhecido';
  }
}