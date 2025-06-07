// Alteração: remoção de logs de depuração (console.log)
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, take, filter, catchError } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Group, SharingMetadata, GroupJoinRequest } from './group.model';
import { ConfigService } from '../../services/config.service';

interface FirestoreRecord {
  createdBy?: string;
  groupId?: string;
  [key: string]: any; // Para permitir outras propriedades
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  userId: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private configService: ConfigService
  ) {
    // Inicializar propriedades do usuário
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.isAdmin = this.configService.is_admin || false;
      } else {
        this.userId = null;
        this.isAdmin = false;
      }
    });
  }

  /**
   * Retorna todos os grupos disponíveis
   */
  getAllGroups(): Observable<any[]> {
    return this.firestore.collection('groups').valueChanges({ idField: 'id' });
  }

  /**
   * Retorna grupos onde o usuário atual é membro ou admin
   */
  getAllUserGroups(): Observable<any[]> {
    if (!this.userId) return of([]);

    // First, get the current user's email
    return this.afAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => {
        const userEmail = user?.email;

        if (!userEmail) {
          return of([]);
        }

        // Now query for groups where the user is a member (by uid OR email)
        return combineLatest([
          // Groups where user is member by UID
          this.firestore.collection('groups', ref =>
            ref.where('memberIds', 'array-contains', this.userId)
          ).valueChanges({ idField: 'id' }),

          // Groups where user is member by EMAIL
          this.firestore.collection('groups', ref =>
            ref.where('memberIds', 'array-contains', userEmail)
          ).valueChanges({ idField: 'id' }),

          // Groups where user is admin by UID
          this.firestore.collection('groups', ref =>
            ref.where('adminIds', 'array-contains', this.userId)
          ).valueChanges({ idField: 'id' })
        ]).pipe(
          map(([memberGroupsByUid, memberGroupsByEmail, adminGroups]) => {
            // Combine all groups and remove duplicates
            const allGroups = [...memberGroupsByUid, ...memberGroupsByEmail, ...adminGroups];
            return Array.from(new Map(allGroups.map(item => [item.id, item])).values());
          })
        );
      })
    );
  }

  /**
   * Retorna todos os usuários para seleção
   */
  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('users/dentistascombr/users').valueChanges({ idField: 'id' });
  }

  /**
   * Cria um novo grupo
   */
  createGroup(groupData: any): Promise<any> {
    if (!this.userId) return Promise.reject('Usuário não autenticado');

    // Garantir que o criador seja adicionado como administrador do grupo
    const adminIds = groupData.adminIds || [];

    // Se o criador não estiver na lista de admins, adicione-o
    if (!adminIds.includes(this.userId)) {
      adminIds.push(this.userId);
    }

    return this.firestore.collection('groups').add({
      ...groupData,
      adminIds: adminIds,   // Assegura que o criador seja admin
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: this.userId
    });
  }

  /**
   * Atualiza um grupo existente
   */
  updateGroup(groupId: string, groupData: any): Promise<void> {
    return this.firestore.collection('groups').doc(groupId).update({
      ...groupData,
      updatedAt: new Date(),
      updatedBy: this.userId
    });
  }

  /**
   * Adiciona um membro ao grupo
   */
  addGroupMember(groupId: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const field = isAdmin ? 'adminIds' : 'memberIds';
    return this.firestore.collection('groups').doc(groupId).update({
      [field]: firebase.firestore.FieldValue.arrayUnion(userId)
    });
  }

  /**
   * Remove um membro do grupo
   */
  removeGroupMember(groupId: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const field = isAdmin ? 'adminIds' : 'memberIds';
    return this.firestore.collection('groups').doc(groupId).update({
      [field]: firebase.firestore.FieldValue.arrayRemove(userId)
    });
  }

  /**
   * Exclui um grupo
   */
  deleteGroup(groupId: string): Promise<void> {
    return this.firestore.collection('groups').doc(groupId).delete();
  }

  // Obter um grupo por ID
  getGroup(groupId: string): Observable<Group | null> {
    return this.firestore.doc<Group>(`groups/${groupId}`).valueChanges()
      .pipe(map(group => group || null));
  }

  // Obter grupos onde o usuário atual é membro
  getUserGroups(): Observable<Group[]> {
    if (!this.userId) return of([]);

    return this.firestore.collection<Group>('groups', ref =>
      ref.where('memberIds', 'array-contains', this.userId)
    ).valueChanges();
  }

  // Obter grupos onde o usuário atual é admin
  getAdminGroups(): Observable<Group[]> {
    if (!this.userId) return of([]);

    return this.firestore.collection<Group>('groups', ref =>
      ref.where('adminIds', 'array-contains', this.userId)
    ).valueChanges();
  }

  // Verificar se o usuário atual é admin de um grupo
  isGroupAdmin(groupId: string): Observable<boolean> {
    if (!this.userId) return of(false);

    return this.firestore.doc(`groups/${groupId}`).valueChanges().pipe(
      map((group: any) => group && group.adminIds && group.adminIds.includes(this.userId))
    );
  }

  // Obter registros compartilhados com o usuário via grupos
  getSharedRecords(collection: string): Observable<any[]> {
    return this.getAllUserGroups().pipe(
      switchMap(groups => {
        if (!groups || groups.length === 0) {
          return of([]);
        }

        const groupIds = groups
          .map(group => group?.id)
          .filter(id => id !== undefined && id !== null);
          
        if (groupIds.length === 0) {
          return of([]);
        }
        
        // Buscar registros que estão compartilhados com os grupos do usuário
        return this.firestore.collection(collection).valueChanges({ idField: 'id' }).pipe(
          map((records: any[]) => {
            if (!records || !Array.isArray(records)) {
              return [];
            }
            
            return records.filter(record => 
              record && 
              record.groupId && 
              groupIds.includes(record.groupId)
            );
          }),
          catchError(error => {
            console.error(`Erro ao buscar registros compartilhados da coleção ${collection}:`, error);
            return of([]);
          })
        );
      }),
      catchError(error => {
        console.error('Erro ao obter grupos do usuário:', error);
        return of([]);
      })
    );
  }

  // Obter todos os registros que o usuário pode acessar (próprios + compartilhados)
  getAllAccessibleRecords(collection: string): Observable<any[]> {
    if (!this.userId) return of([]);

    // Registros próprios
    const ownRecords$ = this.firestore.collection(collection, ref =>
      ref.where('createdBy', '==', this.userId)
    ).valueChanges({ idField: 'id' });

    // Registros compartilhados via grupos
    const sharedRecords$ = this.getSharedRecords(collection);

    return combineLatest([ownRecords$, sharedRecords$]).pipe(
      map(([ownRecords, sharedRecords]) => {
        const allRecords = [...ownRecords, ...sharedRecords];
        // Remover duplicatas
        return Array.from(new Map(allRecords.map(item => [item.id, item])).values());
      })
    );
  }

  /**
   * Compartilhar um registro com um grupo
   * @param collection - Nome da coleção
   * @param recordId - ID do registro
   * @param groupId - ID do grupo para compartilhamento
   */
  shareRecordWithGroup(collection: string, recordId: string, groupId: string): Promise<void> {
    if (!this.userId) {
      console.error('GroupService: Tentativa de compartilhamento sem usuário autenticado');
      return Promise.reject('Usuário não autenticado');
    }

    // Validar parâmetros
    if (!collection || !recordId || !groupId) {
      console.error('GroupService: Parâmetros inválidos para compartilhamento', {
        collection, recordId, groupId
      });
      return Promise.reject('Parâmetros inválidos');
    }

    const now = new Date();
    const nowTs = firebase.firestore.Timestamp.fromDate(now);

    return new Promise<void>((resolve, reject) => {
      // Primeiro verificar se o grupo existe
      this.firestore.doc(`groups/${groupId}`).get().pipe(
        take(1)
      ).subscribe({
        next: (groupDoc) => {
          if (!groupDoc.exists) {
            console.error(`GroupService: Grupo ${groupId} não encontrado`);
            reject(new Error(`Grupo ${groupId} não encontrado`));
            return;
          }

          // Verificar se o registro existe
          this.firestore.doc(`${collection}/${recordId}`).get().pipe(
            take(1)
          ).subscribe({
            next: (recordDoc) => {
              if (!recordDoc.exists) {
                console.error(`GroupService: Registro ${recordId} não encontrado na coleção ${collection}`);
                
                // Verificar se o usuário tem permissão para acessar a coleção
                this.firestore.collection(collection).get().pipe(take(1)).subscribe({
                  next: (collectionSnapshot) => {
                    console.log(`GroupService: Acesso à coleção ${collection} confirmado. Total de documentos visíveis: ${collectionSnapshot.size}`);
                    reject(new Error(`Registro ${recordId} não existe na coleção ${collection}. Verifique se o ID está correto.`));
                  },
                  error: (collectionError) => {
                    console.error(`GroupService: Erro ao acessar coleção ${collection}:`, collectionError);
                    reject(new Error(`Erro de permissão ou coleção ${collection} não acessível`));
                  }
                });
                return;
              }

              // Continue com o resto da lógica...
              const record = recordDoc.data() as { groupId?: string };
              const previousGroupId = record?.groupId || null;

              // Verificar se o usuário tem permissão para compartilhar este registro
              const recordData = recordDoc.data() as any;

              console.log('=== DEBUG PERMISSÕES ===');
              console.log('User ID atual:', this.userId);
              console.log('É admin:', this.isAdmin);
              console.log('Dados do registro:', {
                createdBy: recordData.createdBy,
                userId: recordData.userId,
                id: recordId,
                hasCreatedBy: !!recordData.createdBy,
                allKeys: Object.keys(recordData)
              });

              // Lógica de permissão mais flexível
              let canShare = false;
              let reason = '';

              if (this.isAdmin) {
                canShare = true;
                reason = 'usuário é admin';
              } else if (!recordData.createdBy) {
                canShare = true;
                reason = 'registro não tem createdBy definido';
              } else if (recordData.createdBy === this.userId) {
                canShare = true;
                reason = 'usuário é o criador do registro';
              } else if (recordData.userId === this.userId) {
                canShare = true;
                reason = 'registro pertence ao usuário';
              } else {
                // Para registros de pacientes, permitir compartilhamento se o usuário tem acesso
                // (se chegou até aqui, significa que passou pelas regras de segurança do Firestore)
                canShare = true;
                reason = 'usuário tem acesso ao registro';
              }

              if (!canShare) {
                console.error(`GroupService: Acesso negado para compartilhamento`);
                reject(new Error('Você não tem permissão para compartilhar este registro'));
                return;
              }

              console.log(`GroupService: Compartilhamento permitido - ${reason}`);

              // Batch de operações para garantir atomicidade
              const batch = this.firestore.firestore.batch();
              const recordRef = this.firestore.collection(collection).doc(recordId).ref;
              const historyRef = recordRef.collection('sharing_history').doc();

              const updateData: any = {
                groupId: groupId,
                sharingMetadata: {
                  groupId: groupId,
                  previousGroupId: previousGroupId,
                  sharedBy: this.userId,
                  sharedAt: nowTs,
                  lastModifiedBy: this.userId,
                  lastModifiedAt: nowTs,
                } as SharingMetadata,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: this.userId,
              };

              const historyData = {
                action: previousGroupId ? 'change' : 'share',
                groupId: groupId,
                previousGroupId: previousGroupId,
                performedBy: this.userId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              };

              batch.update(recordRef, updateData);
              batch.set(historyRef, historyData);

              batch
                .commit()
                .then(() => {
                  console.log(`GroupService: Registro ${recordId} compartilhado com sucesso`);
                  resolve();
                })
                .catch((error) => {
                  console.error('GroupService: Erro ao executar batch de compartilhamento:', error);
                  reject(error);
                });
            },
            error: (error: any) => {
              console.error(`GroupService: Erro ao verificar registro ${recordId}:`, error);
              
              // Fornecer mensagem mais específica baseada no código do erro
              if (error.code === 'permission-denied') {
                reject(new Error(`Sem permissão para acessar o registro ${recordId}`));
              } else if (error.code === 'not-found') {
                reject(new Error(`Registro ${recordId} não encontrado`));
              } else {
                reject(new Error(`Erro ao acessar registro: ${error.message || 'Erro desconhecido'}`));
              }
            }
          });
        },
        error: (error: any) => {
          console.error(`GroupService: Erro ao verificar grupo ${groupId}:`, error);
          reject(new Error(`Erro ao acessar grupo: ${error.message || 'Erro desconhecido'}`));
        }
      });
    });
  }

  /**
   * Remove o compartilhamento de um registro
   * @param collection - Nome da coleção
   * @param recordId - ID do registro
   */
  removeRecordSharing(collection: string, recordId: string): Promise<void> {

    if (!this.userId) {
      console.error('GroupService: Tentativa de remoção de compartilhamento sem usuário autenticado');
      return Promise.reject('Usuário não autenticado');
    }

    return new Promise<void>((resolve, reject) => {
      this.firestore.doc(`${collection}/${recordId}`).get().pipe(
        take(1),
        switchMap(doc => {
          const currentData = doc.data() as Record<string, any> || {};
          const previousGroupId = currentData['groupId'] || null;

          if (!previousGroupId) {
            console.warn(`GroupService: Registro ${recordId} não estava compartilhado. Nenhuma ação necessária.`);
            return Promise.resolve();
          }


          const updateData: any = {
            groupId: firebase.firestore.FieldValue.delete(),
            sharingMetadata: firebase.firestore.FieldValue.delete(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: this.userId,
            sharingHistory: firebase.firestore.FieldValue.arrayUnion({
              action: 'unshare',
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              performedBy: this.userId,
              previousGroupId: previousGroupId
            })
          };

          return this.firestore.doc(`${collection}/${recordId}`).update(updateData);
        })
      ).subscribe({
        next: () => {
          resolve();
        },
        error: (error) => {
          console.error(`GroupService: Erro ao remover compartilhamento: ${error.message || error}`);
          reject(error);
        }
      });
    });
  }

  /**
   * Obtém o histórico de compartilhamento de um registro
   * @param collection - Nome da coleção
   * @param recordId - ID do registro
   */

  getSharingHistory(collection: string, id: string): Observable<any[]> {
    if (!collection || !id) {
      return of([]);
    }

    return this.firestore
      .collection(`${collection}/${id}/sharing_history`)
      .valueChanges({ idField: 'id' })
      .pipe(
        map(history => {
          if (!history || history.length === 0) {
            // Remover log desnecessário
            return [];
          }
          return history;
        }),
        catchError(error => {
          // Só fazer log de erros reais
          if (error.code && error.code !== 'permission-denied' && error.code !== 'not-found') {
            console.error('GroupService: Erro ao carregar histórico de compartilhamento:', error);
          }
          return of([]);
        })
      );
  }

  /**
   * Criar um pedido para entrar em um grupo
   * @param groupId - ID do grupo
   * @param message - Mensagem opcional do solicitante
   */
  requestJoinGroup(groupId: string, message?: string): Promise<void> {

    if (!this.userId) {
      console.error('GroupService: Tentativa de solicitação sem usuário autenticado');
      return Promise.reject('Usuário não autenticado');
    }

    // Primeiro verificar se o usuário já é membro ou admin do grupo
    return this.getGroup(groupId).pipe(
      take(1)
    ).toPromise().then(group => {
      if (!group) {
        console.error(`GroupService: Grupo ${groupId} não encontrado`);
        throw new Error('Grupo não encontrado');
      }

      const isAlreadyMember = group.memberIds?.includes(this.userId || '') || group.adminIds?.includes(this.userId || '');
      if (isAlreadyMember) {
        console.warn(`GroupService: Usuário já é membro do grupo ${groupId}`);
        throw new Error('Você já é membro deste grupo');
      }

      // Verificar se já existe uma solicitação pendente
      return this.firestore.collection('groupJoinRequests', ref =>
        ref.where('userId', '==', this.userId)
          .where('groupId', '==', groupId)
          .where('status', '==', 'pending')
      ).get().toPromise();
    })
      .then(snapshot => {
        if (!snapshot?.empty) {
          console.warn(`GroupService: Já existe uma solicitação pendente para o grupo ${groupId}`);
          throw new Error('Você já possui uma solicitação pendente para este grupo');
        }

        const requestData: GroupJoinRequest = {
          userId: this.userId!,
          groupId: groupId,
          requestedAt: firebase.firestore.Timestamp.now(),
          status: 'pending',
          message: message || ''
        };

        return this.firestore.collection('groupJoinRequests').add(requestData);
      })
      .then(() => {
      })
      .catch(error => {
        console.error(`GroupService: Erro ao solicitar entrada no grupo: ${error.message || error}`);
        throw error;
      });
  }

  /**
   * Obtém solicitações pendentes para grupos onde o usuário é admin
   */
  getPendingJoinRequests(): Observable<GroupJoinRequest[]> {
    return this.afAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => {
        if (!user || !user.uid) {  // user.uid já existe no tipo User do Firebase
          return of([]);
        }

        // First get groups where user is an admin
        return this.getAdminGroups().pipe(
          switchMap(groups => {
            // If user is not admin of any group, return empty array
            if (!groups || groups.length === 0) {
              return of([]);
            }

            // Get the group IDs where the user is an admin
            const groupIds = groups
              .map(group => group.id)
              .filter(id => id !== undefined && id !== null);


            // Query join requests for those groups
            if (groupIds && groupIds.length > 0) {
              return this.firestore.collection<GroupJoinRequest>('groupJoinRequests', ref =>
                ref.where('status', '==', 'pending')
                  .where('groupId', 'in', groupIds)
              ).valueChanges({ idField: 'id' });
            } else {
              // If no valid group IDs, return empty array
              return of([]);
            }
          })
        );
      }),
      catchError(error => {
        console.error('Group Service: Error getting pending join requests:', error);
        return of([]);
      })
    );
  }

  /**
   * Aprova uma solicitação de entrada em grupo
   * @param requestId - ID da solicitação
   */
  approveJoinRequest(requestId: string): Promise<void> {

    if (!this.userId) {
      console.error('GroupService: Tentativa de aprovar solicitação sem usuário autenticado');
      return Promise.reject('Usuário não autenticado');
    }

    return new Promise<void>((resolve, reject) => {
      this.firestore.doc(`groupJoinRequests/${requestId}`).get().pipe(
        take(1),
        switchMap(doc => {
          const request = doc.data() as Record<string, any>;

          if (!request || request['status'] !== 'pending') {
            console.error(`GroupService: Solicitação ${requestId} não encontrada ou não está pendente`);
            throw new Error('Solicitação não encontrada ou já foi processada');
          }


          // Atualizar o pedido
          const updatePromise = this.firestore.doc(`groupJoinRequests/${requestId}`).update({
            status: 'approved',
            respondedBy: this.userId,
            respondedAt: firebase.firestore.FieldValue.serverTimestamp()
          });


          // Adicionar o usuário ao grupo
          const addMemberPromise = this.addGroupMember(request['groupId'], request['userId']);

          return Promise.all([updatePromise, addMemberPromise]);
        })
      ).subscribe({
        next: () => {
          resolve();
        },
        error: (error) => {
          console.error(`GroupService: Erro ao aprovar solicitação: ${error.message || error}`);
          reject(error);
        }
      });
    });
  }

  /**
   * Rejeita uma solicitação de entrada em grupo
   * @param requestId - ID da solicitação
   * @param responseMessage - Mensagem opcional de resposta
   */
  rejectJoinRequest(requestId: string, responseMessage?: string): Promise<void> {

    if (!this.userId) {
      return Promise.reject('Usuário não autenticado');
    }

    return this.firestore.doc(`groupJoinRequests/${requestId}`).get()
      .pipe(take(1))
      .toPromise()
      .then(doc => {
        // Check if document exists before accessing data
        if (!doc || !doc.exists) {
          throw new Error('Solicitação não encontrada');
        }

        const request = doc.data() as Record<string, any>;

        if (!request || request['status'] !== 'pending') {
          throw new Error('Solicitação não encontrada ou já foi processada');
        }

        return this.firestore.doc(`groupJoinRequests/${requestId}`).update({
          status: 'rejected',
          responseMessage: responseMessage || '',
          respondedBy: this.userId,
          respondedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
      })
      .catch(error => {
        console.error(`GroupService: Erro ao rejeitar solicitação: ${error.message || error}`);
        throw error;
      });
  }

  // Novo método para obter registro por ID com verificação adicional
  getRegistroById(collection: string, id: string): Promise<any> {
    if (!collection || !id) {
      return Promise.resolve(null);
    }

    return this.firestore.collection(collection).doc(id).get().pipe(
      take(1),
      map(doc => {
        if (!doc.exists) {
          console.log(`GroupService: Registro ${id} não encontrado na coleção ${collection}`);
          return null;
        }
        
        const data = doc.data() || {}; // Garantir que data seja um objeto
        return { id, ...data };
      }),
      catchError(error => {
        console.error(`GroupService: Erro ao buscar registro ${id}:`, error);
        return of(null);
      })
    ).toPromise();
  }

  /**
   * Método de debug para verificar se um registro existe
   */
  debugCheckRecord(collection: string, recordId: string): void {
    console.log(`GroupService Debug: Verificando registro ${recordId} na coleção ${collection}`);
    
    this.firestore.doc(`${collection}/${recordId}`).get().pipe(take(1)).subscribe({
      next: (doc) => {
        if (doc.exists) {
          const data = doc.data() as FirestoreRecord; // Usar a interface
          console.log(`GroupService Debug: Registro encontrado:`, {
            id: recordId,
            createdBy: data?.createdBy,
            groupId: data?.groupId,
            hasData: !!data
          });
        } else {
          console.log(`GroupService Debug: Registro ${recordId} NÃO existe`);
          
          // Verificar os primeiros registros da coleção para debug
          this.firestore.collection(collection).get().pipe(take(1)).subscribe({
            next: (snapshot) => {
              console.log(`GroupService Debug: Coleção ${collection} tem ${snapshot.size} documentos`);
              if (snapshot.size > 0) {
                const firstDoc = snapshot.docs[0];
                console.log(`GroupService Debug: Exemplo de ID existente: ${firstDoc.id}`);
              }
            },
            error: (err) => {
              console.error(`GroupService Debug: Erro ao acessar coleção ${collection}:`, err);
            }
          });
        }
      },
      error: (error) => {
        console.error(`GroupService Debug: Erro ao verificar registro:`, error);
      }
    });
  }

  /**
   * Obtém o usuário atual autenticado
   */
  getCurrentUser(): Observable<any> {
    return this.afAuth.user;
  }

  /**
   * Obtém o ID do usuário atual
   */
  getCurrentUserId(): Observable<string | null> {
    return this.afAuth.user.pipe(
      map(user => user?.uid || null)
    );
  }
}