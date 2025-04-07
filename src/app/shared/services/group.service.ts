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
    return this.firestore.collection('groups').add({
      ...groupData,
      createdAt: new Date(),
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
    return this.firestore.doc(`${collection}/${recordId}`).update({
      groupId: groupId,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  // Remover compartilhamento de um registro
  removeRecordSharing(collection: string, recordId: string): Promise<void> {
    return this.firestore.doc(`${collection}/${recordId}`).update({
      groupId: firebase.firestore.FieldValue.delete(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}