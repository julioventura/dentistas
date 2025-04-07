import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Group } from '../models/group.model';

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

    return combineLatest([
      this.firestore.collection('groups', ref =>
        ref.where('memberIds', 'array-contains', this.userId)
      ).valueChanges({ idField: 'id' }),
      this.firestore.collection('groups', ref =>
        ref.where('adminIds', 'array-contains', this.userId)
      ).valueChanges({ idField: 'id' })
    ]).pipe(
      map(([memberGroups, adminGroups]) => {
        // Combine and remove duplicates
        const allGroups = [...memberGroups, ...adminGroups];
        return Array.from(new Map(allGroups.map(item => [item.id, item])).values());
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

  // Compartilhar um registro com um grupo
  shareRecordWithGroup(collection: string, recordId: string, groupId: string): Promise<void> {
    if (!this.userId) return Promise.reject('Usuário não autenticado');

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    return new Promise<void>((resolve, reject) => {
      this.firestore.doc(`${collection}/${recordId}`).get().pipe(
        take(1),
        switchMap(doc => {
          // Fix: Add proper type assertion for document data
          const currentData = doc.data() as Record<string, any> || {};
          // FIX: Use bracket notation instead of dot notation
          const previousGroupId = currentData['groupId'] || null;

          // FIX: Use bracket notation 
          const existingHistory = currentData['sharingHistory'] || [];

          // Criar novo objeto de histórico
          const sharingData = {
            groupId: groupId,
            sharingMetadata: {
              groupId: groupId,
              sharedBy: this.userId,
              sharedAt: timestamp,
              previousGroupId: previousGroupId
            },
            sharingHistory: firebase.firestore.FieldValue.arrayUnion({
              action: previousGroupId ? 'change' : 'share',
              timestamp: timestamp,
              performedBy: this.userId,
              groupId: groupId,
              previousGroupId: previousGroupId
            }),
            updatedAt: timestamp,
            updatedBy: this.userId
          };

          return this.firestore.doc(`${collection}/${recordId}`).update(sharingData);
        })
      ).subscribe({
        next: () => resolve(),
        error: (error) => reject(error)
      });
    });
  }

  // Remover compartilhamento de um registro
  removeRecordSharing(collection: string, recordId: string): Promise<void> {
    if (!this.userId) return Promise.reject('Usuário não autenticado');

    return new Promise<void>((resolve, reject) => {
      this.firestore.doc(`${collection}/${recordId}`).get().pipe(
        take(1),
        switchMap(doc => {
          // Fix: Add proper type assertion for document data
          const currentData = doc.data() as Record<string, any> || {};
          // FIX: Use bracket notation instead of dot notation
          const previousGroupId = currentData['groupId'] || null;

          // Preparar dados de atualização
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
        next: () => resolve(),
        error: (error) => reject(error)
      });
    });
  }

  // Obter histórico de compartilhamento de um registro
  getSharingHistory(collection: string, recordId: string): Observable<any[]> {
    return this.firestore.doc(`${collection}/${recordId}`).valueChanges()
      .pipe(
        map((record: any) => record && record.sharingHistory ? record.sharingHistory : []),
        map(history => {
          // Ordenar por timestamp (mais recente primeiro)
          return [...history].sort((a, b) => {
            const timeA = a.timestamp && a.timestamp.toDate ? a.timestamp.toDate().getTime() : 0;
            const timeB = b.timestamp && b.timestamp.toDate ? b.timestamp.toDate().getTime() : 0;
            return timeB - timeA;
          });
        })
      );
  }

  /**
   * Criar um pedido para entrar em um grupo
   */
  requestJoinGroup(groupId: string, message?: string): Promise<void> {
    if (!this.userId) return Promise.reject('Usuário não autenticado');
    
    const requestData: any = {
      userId: this.userId,
      groupId: groupId,
      requestedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      message: message || ''
    };
    
    // Convert the Promise<DocumentReference> to Promise<void>
    return this.firestore.collection('groupJoinRequests').add(requestData)
      .then(() => {
        // Return nothing (void) after the operation completes
        return;
      });
  }

  /**
   * Obter pedidos de entrada pendentes para grupos onde o usuário é admin
   */
  getPendingJoinRequests(): Observable<any[]> {
    if (!this.userId) return of([]);
    
    return this.getAdminGroups().pipe(
      switchMap(groups => {
        if (!groups.length) return of([]);
        
        const groupIds = groups.map(group => group.id);
        
        return this.firestore.collection('groupJoinRequests', ref => 
          ref.where('groupId', 'in', groupIds)
            .where('status', '==', 'pending')
        ).valueChanges({ idField: 'id' });
      })
    );
  }

  /**
   * Aprovar um pedido de entrada
   */
  approveJoinRequest(requestId: string): Promise<void> {
    if (!this.userId) return Promise.reject('Usuário não autenticado');

    return new Promise<void>((resolve, reject) => {
      this.firestore.doc(`groupJoinRequests/${requestId}`).get().pipe(
        take(1),
        switchMap(doc => {
          const request = doc.data() as Record<string, any>;
          
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
        next: () => resolve(),
        error: (error) => reject(error)
      });
    });
  }

  /**
   * Rejeitar um pedido de entrada
   */
  rejectJoinRequest(requestId: string, responseMessage?: string): Promise<void> {
    if (!this.userId) return Promise.reject('Usuário não autenticado');
    
    return this.firestore.doc(`groupJoinRequests/${requestId}`).update({
      status: 'rejected',
      responseMessage: responseMessage || '',
      respondedBy: this.userId,
      respondedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}