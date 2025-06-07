import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

// Definir a interface Group aqui se não existir o arquivo
export interface Group {
  id?: string;
  name: string;
  description?: string;
  clinica?: string;
  adminIds?: string[];
  memberIds?: string[];
  createdAt?: any;
  updatedAt?: any;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) { }

  // ADICIONAR método getAllGroups
  getAllGroups(): Observable<Group[]> {
    console.log('=== GROUP SERVICE - GET ALL GROUPS ===');
    
    const groupsRef = collection(this.firestore, 'groups');
    return collectionData(groupsRef, { idField: 'id' }).pipe(
      map((groups: any[]) => {
        console.log('Todos os grupos do Firestore (getAllGroups):', groups);
        return groups as Group[];
      })
    );
  }

  // Manter o método getGroups existente, mas garantir que ele existe:
  getGroups(): Observable<Group[]> {
    console.log('=== GROUP SERVICE - GET GROUPS ===');
    
    return this.userService.getUser().pipe(
      switchMap(user => {
        if (!user) {
          console.log('Usuário não autenticado no GroupService');
          return of([]);
        }
        
        console.log('User no GroupService:');
        console.log('UID:', user.uid);
        console.log('Email:', user.email);
        
        const groupsRef = collection(this.firestore, 'groups');
        return collectionData(groupsRef, { idField: 'id' }).pipe(
          map((groups: any[]) => {
            console.log('Todos os grupos do Firestore:', groups);
            
            const filteredGroups = groups.filter((group: Group) => {
              const isAdmin = group.adminIds?.includes(user.uid) || group.adminIds?.includes(user.email || '');
              const isMember = group.memberIds?.includes(user.uid) || group.memberIds?.includes(user.email || '');
              const hasAccess = isAdmin || isMember;
              
              console.log(`Grupo "${group.name}":`, {
                adminIds: group.adminIds,
                memberIds: group.memberIds,
                isAdmin,
                isMember,
                hasAccess
              });
              
              return hasAccess;
            });
            
            console.log('Grupos filtrados para o usuário:', filteredGroups);
            return filteredGroups as Group[];
          })
        );
      })
    );
  }

  // Método isAdmin corrigido
  isAdmin(userEmail: string): Observable<boolean> {
    const adminRef = doc(this.firestore, 'admins', userEmail);
    return new Observable(observer => {
      getDoc(adminRef).then(docSnap => {
        observer.next(docSnap.exists());
        observer.complete();
      }).catch(error => {
        console.error('Erro ao verificar admin:', error);
        observer.next(false);
        observer.complete();
      });
    });
  }

  // Outros métodos que possam existir...
  getGroup(id: string): Observable<Group | null> {
    const groupRef = doc(this.firestore, 'groups', id);
    return new Observable(observer => {
      getDoc(groupRef).then(docSnap => {
        if (docSnap.exists()) {
          observer.next({ id: docSnap.id, ...docSnap.data() } as Group);
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    });
  }

  createGroup(group: Partial<Group>): Promise<any> {
    const groupsRef = collection(this.firestore, 'groups');
    // Implementar lógica de criação
    return Promise.resolve();
  }

  updateGroup(id: string, data: Partial<Group>): Promise<void> {
    // Implementar lógica de atualização
    return Promise.resolve();
  }

  deleteGroup(id: string): Promise<void> {
    // Implementar lógica de remoção
    return Promise.resolve();
  }

  isGroupAdmin(groupId: string): Observable<boolean> {
    // Implementar verificação de admin do grupo
    return of(false);
  }

  // ADICIONAR método getAllUserGroups
  getAllUserGroups(): Observable<Group[]> {
    return this.userService.getUser().pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }

        const groupsRef = collection(this.firestore, 'groups');
        return collectionData(groupsRef, { idField: 'id' }).pipe(
          map((groups: any[]) => {
            const filteredGroups = groups.filter((group: Group) => {
              const isAdmin = group.adminIds?.includes(user.uid) || group.adminIds?.includes(user.email || '');
              const isMember = group.memberIds?.includes(user.uid) || group.memberIds?.includes(user.email || '');
              return isAdmin || isMember;
            });
            
            return filteredGroups as Group[];
          })
        );
      }),
      catchError(error => {
        console.error('Erro ao obter grupos do usuário:', error);
        return of([]);
      })
    );
  }

  // CORRIGIR método getSharedRecords - usar collection do Firestore corretamente
  getSharedRecords(collectionName: string): Observable<any[]> {
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
        
        // CORRIGIR: usar collection() do Firestore corretamente
        const recordsRef = collection(this.firestore, collectionName);
        return collectionData(recordsRef, { idField: 'id' }).pipe(
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
            console.error(`Erro ao buscar registros compartilhados da coleção ${collectionName}:`, error);
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
}