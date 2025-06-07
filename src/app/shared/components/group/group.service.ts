// Alteração: remoção de logs de depuração (console.log)
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, take, filter, catchError } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Group, SharingMetadata, GroupJoinRequest } from './group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  userId: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe(user => {
      this.userId = user ? user.uid : null;
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
    return this.auth.user.pipe(
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
        if (!groups.length) return of([]);

        const groupIds = groups.map(group => group.id);

        return this.firestore.collection(collection, ref =>
          ref.where('groupId', 'in', groupIds)
        ).valueChanges({ idField: 'id' });
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

    // IMPORTANTE: Use client-side timestamp para log e histórico
    const now = new Date(); // Timestamp local
    // Conversão para Timestamp do Firestore para compatibilidade com SharingMetadata
    const nowTs = firebase.firestore.Timestamp.fromDate(now);

    return new Promise<void>((resolve, reject) => {
      // Verificar se o grupo existe
      this.firestore.doc(`groups/${groupId}`).get().pipe(
        take(1)
      ).subscribe({
        next: (groupDoc) => {
          if (!groupDoc.exists) {
            reject(new Error(`Grupo ${groupId} não encontrado`));
            return;
          }

          // Verificar o registro atual para determinar se já tem um groupId
          this.firestore.doc(`${collection}/${recordId}`).get().pipe(
            take(1)
          ).subscribe({
            next: (recordDoc) => {
              if (!recordDoc.exists) {
                reject(new Error(`Registro ${recordId} não encontrado`));
                return;
              }

              const record = recordDoc.data() as { groupId?: string };
              const previousGroupId = record?.groupId || null;

              // [Codex] Início da implementação real do compartilhamento usando batch
              // Batch de operações para garantir atomicidade
              const batch = this.firestore.firestore.batch();

              // Referências para o registro e subcoleção de histórico
              const recordRef = this.firestore.collection(collection).doc(recordId).ref;
              const historyRef = recordRef.collection('sharing_history').doc();

              // Dados de atualização do registro - informações de compartilhamento
              const updateData: any = {
                groupId: groupId,
                sharingMetadata: {
                  groupId: groupId,
                  previousGroupId: previousGroupId,
                  sharedBy: this.userId,
                  // Datas convertidas para Timestamp para respeitar o tipo do modelo
                  sharedAt: nowTs,
                  lastModifiedBy: this.userId,
                  lastModifiedAt: nowTs,
                } as SharingMetadata,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: this.userId,
              };

              // Entrada no histórico de compartilhamento para auditoria
              const historyData = {
                action: previousGroupId ? 'change' : 'share',
                groupId: groupId,
                previousGroupId: previousGroupId,
                performedBy: this.userId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              };

              // Incluir operações no batch
              batch.update(recordRef, updateData);
              batch.set(historyRef, historyData);

              // Executar batch e resolver/rejeitar conforme resultado
              batch
                .commit()
                .then(() => resolve())
                .catch((error) => {
                  console.error('GroupService: Erro ao compartilhar registro:', error);
                  reject(error);
                });
            },
            error: (error: any) => {
              console.error(`GroupService: Erro ao ler registro ${recordId}:`, error);
              reject(error);
            }
          });
        },
        error: (error: any) => {
          console.error(`GroupService: Erro ao ler grupo ${groupId}:`, error);
          reject(error);
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
    return this.auth.user.pipe(
      filter(user => !!user),
      switchMap(user => {
        if (!user || !user.uid) {
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
  getRegistroById(collection: string, id: string): Observable<any> {
    if (!collection || !id) {
      return of(null);
    }

    return this.firestore.collection(collection).doc(id).valueChanges().pipe(
      map(data => {
        if (!data) {
          // Remover este log para evitar spam no console
          return null;
        }
        return { id, ...data };
      }),
      catchError(error => {
        // Só fazer log de erros reais, não de documentos não encontrados
        if (error.code && error.code !== 'not-found' && error.code !== 'permission-denied') {
          console.error('GroupService: Erro ao buscar registro:', error);
        }
        return of(null);
      })
    );
  }
}