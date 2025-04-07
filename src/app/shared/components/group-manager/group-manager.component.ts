import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { GroupService } from '../../services/group.service';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FirestoreService } from '../../services/firestore.service';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.scss'],
  standalone: false
})
export class GroupManagerComponent implements OnInit {
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  groupForm: FormGroup;
  isAdmin = false;
  isLoading = true;
  
  // Usuários para seleção
  users: any[] = [];
  adminUsers: any[] = [];
  memberUsers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private firestoreService: FirestoreService<any>,
    private snackBar: MatSnackBar
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      clinica: [''],
      adminIds: [[]],
      memberIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
  }

  loadGroups() {
    this.isLoading = true;
    this.groupService.getAllUserGroups().subscribe(groups => {
      this.groups = groups;
      this.isLoading = false;
      
      // Verificar se o usuário é admin em algum grupo
      if (groups.length > 0) {
        this.groupService.isGroupAdmin(groups[0].id).subscribe(isAdmin => {
          this.isAdmin = isAdmin;
        });
      }
    });
  }

  loadUsers() {
    // Usar o FirestoreService para carregar usuários, como visto em home.component.ts
    this.firestoreService.getRegistros('usuarios').subscribe(users => {
      this.users = users;
      // Podemos filtrar aqui por tipo de usuário se necessário
    });
  }

  selectGroup(group: Group) {
    this.selectedGroup = group;
    
    // Preencher o formulário
    this.groupForm.patchValue({
      name: group.name,
      description: group.description || '',
      clinica: group.clinica || '',
      adminIds: group.adminIds || [],
      memberIds: group.memberIds || []
    });
  }

  createOrUpdateGroup() {
    if (this.groupForm.invalid) {
      this.snackBar.open('Por favor preencha todos os campos obrigatórios', 'OK', {
        duration: 3000
      });
      return;
    }
    
    const groupData = this.groupForm.value;
    
    if (this.selectedGroup) {
      // Atualizar grupo
      this.groupService.updateGroup(this.selectedGroup.id, groupData)
        .then(() => {
          this.snackBar.open('Grupo atualizado com sucesso', 'OK', { duration: 3000 });
          this.resetForm();
          this.loadGroups();
        })
        .catch(error => {
          console.error('Erro ao atualizar grupo:', error);
          this.snackBar.open('Erro ao atualizar grupo', 'OK', { duration: 3000 });
        });
    } else {
      // Criar novo grupo
      this.groupService.createGroup(groupData)
        .then(() => {
          this.snackBar.open('Grupo criado com sucesso', 'OK', { duration: 3000 });
          this.resetForm();
          this.loadGroups();
        })
        .catch(error => {
          console.error('Erro ao criar grupo:', error);
          this.snackBar.open('Erro ao criar grupo', 'OK', { duration: 3000 });
        });
    }
  }

  resetForm() {
    this.groupForm.reset();
    this.selectedGroup = null;
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.nome : userId;
  }
}