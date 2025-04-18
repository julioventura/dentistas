import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { catchError, filter, take } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';

import { FirestoreService } from '../../services/firestore.service';
import { GroupService } from './group.service';
import { ConfigService } from '../../services/config.service';
import { Group, GroupJoinRequest } from './group.model';
import { RequestJoinDialog } from '../../dialogs/request-join-dialog/request-join-dialog.component';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatListModule,
    RouterModule,
    MatCardModule,
    MatSelectModule,
    MatTooltipModule
  ],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class GroupManagerComponent implements OnInit {
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  groupForm: FormGroup;
  userId: string | null = null;
  userEmail: string | null = null;

  isAdmin = false;
  isAdminOfSelectedGroup = false; // Changed from isGroupAdmin
  
  isLoading = true;
  users: any[] = [];
  joinRequests: any[] = [];

  manualEmail: string = '';
  showManualEmailInput: boolean = false;

  filteredUsers: Observable<any[]> = of([]);
  filteredAdmins: Observable<any[]> = of([]);
  selectedUserToAdd: any = null;
  
  titulo_da_pagina: string = '';

  adminInput = new FormControl('');
  memberInput = new FormControl('');
  selectedAdmins: any[] = [];
  selectedMembers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private firestoreService: FirestoreService<any>,
    private snackBar: MatSnackBar,
    private configService: ConfigService,
    private dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    // Obter o email do usuário atual
    this.afAuth.user.subscribe(user => {
      this.userId = user?.uid || null;
      this.userEmail = user?.email || null;
    });

    this.titulo_da_pagina = "Grupos e Compartilhamento";
    
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      clinica: [''],
      adminIds: [[]],
      memberIds: [[]]
    });

    this.filteredAdmins = new Observable<any[]>();
    this.filteredUsers = new Observable<any[]>();
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.userEmail = user.email;
        // Agora temos o usuário autenticado, então carregamos os grupos
        this.loadGroups();
        // Carregar outras funções que dependem do usuário
        this.loadUsers();
        this.loadPendingJoinRequests();
      }
    });
    
    // Outras inicializações não dependentes do usuário...
    this.isAdmin = this.configService.is_admin;
  }

  loadGroups() {
    this.isLoading = true;
    this.groupService.getAllUserGroups().subscribe(groups => {
      this.groups = groups;
      this.isLoading = false;
      
      // Não precisamos mais verificar se é admin para mostrar o formulário
      // A criação de grupos agora é permitida para todos
    });
  }

  loadUsers() {
    this.firestoreService.getRegistros('usuarios').subscribe(users => {
      this.users = users;
    });
  }

  selectGroup(group: Group) {
    this.selectedGroup = group;
    
    // Verificar se o usuário atual é admin deste grupo específico
    this.groupService.isGroupAdmin(group.id).subscribe(isAdmin => {
      this.isAdminOfSelectedGroup = isAdmin; // Changed from isGroupAdmin
      
      // Só preencher o formulário se for admin do grupo ou admin do site
      if (this.isAdminOfSelectedGroup || this.isAdmin) {
        this.groupForm.patchValue({
          name: group.name,
          description: group.description || '',
          clinica: group.clinica || '',
          adminIds: group.adminIds || [],
          memberIds: group.memberIds || []
        });
      }
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
      // Atualizar grupo - só é possível se for admin do grupo ou admin do site
      if (this.isAdminOfSelectedGroup || this.isAdmin) {
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
        this.snackBar.open('Você não tem permissão para editar este grupo', 'OK', { duration: 3000 });
      }
    } else {
      // Criar novo grupo - permitido para qualquer usuário (regra 1)
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
    this.groupForm.reset({
      memberIds: []
    });
    this.selectedGroup = null;
    this.isAdminOfSelectedGroup = false;
    this.selectedAdmins = [];
    this.selectedMembers = [];
  }

  getUserName(userId: string | null | undefined): string {
    if (!userId) {
      return 'Usuário desconhecido';
    }

    // Verificar se a lista de usuários está carregada
    if (!this.users || this.users.length === 0) {
      return `Usuário ${userId}`;
    }

    const user = this.users.find(u => u.id === userId);

    if (!user) {
      return `Usuário ${userId}`;
    }

    // Verificar múltiplas propriedades possíveis para o nome
    return user.nome || user.name || user.displayName || user.email || `Usuário ${userId}`;
  }

  // Método para verificar se pode editar um grupo
  canEditGroup(group: Group): boolean {
    return this.isAdmin || this.isAdminOfSelectedGroup;
  }

  // Adicione este método para carregar os pedidos pendentes
  loadPendingJoinRequests(): void {
    this.groupService.getPendingJoinRequests().pipe(
      catchError(error => {
        console.error('Erro ao carregar pedidos de entrada:', error);
        this.snackBar.open('Erro ao carregar pedidos de entrada', 'OK', { duration: 3000 });
        return of([]);
      })
    ).subscribe(requests => {
      this.joinRequests = requests;
      console.log(`${requests.length} pedidos de entrada pendentes carregados`);
    });
  }

  // Adicione os métodos para aprovar e rejeitar pedidos
  approveJoinRequest(requestId: string): void {
    this.groupService.approveJoinRequest(requestId)
      .then(() => {
        this.snackBar.open('Usuário adicionado ao grupo com sucesso', 'OK', { duration: 3000 });
        this.loadPendingJoinRequests(); // Recarregar a lista
        this.loadGroups(); // Recarregar os grupos para mostrar o novo membro
      })
      .catch(error => {
        console.error('Erro ao aprovar pedido:', error);
        this.snackBar.open('Erro ao aprovar pedido', 'OK', { duration: 3000 });
      });
  }

  rejectJoinRequest(requestId: string): void {
    // Poderia abrir um diálogo para solicitar motivo da rejeição
    this.groupService.rejectJoinRequest(requestId)
      .then(() => {
        this.snackBar.open('Pedido rejeitado', 'OK', { duration: 3000 });
        this.loadPendingJoinRequests(); // Recarregar a lista
      })
      .catch(error => {
        console.error('Erro ao rejeitar pedido:', error);
        this.snackBar.open('Erro ao rejeitar pedido', 'OK', { duration: 3000 });
      });
  }

  // Método auxiliar para obter o nome do grupo
  getGroupName(groupId: string): string {
    const group = this.groups.find(g => g.id === groupId);
    return group ? group.name : 'Grupo desconhecido';
  }

  // Método para solicitar entrada em um grupo
  requestToJoinGroup(groupId: string): void {
    const dialogRef = this.dialog.open(RequestJoinDialog, {
      width: '400px',
      data: { groupId: groupId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.requestJoinGroup(groupId, result.message)
          .then(() => {
            this.snackBar.open('Solicitação enviada com sucesso', 'OK', { duration: 3000 });
          })
          .catch(error => {
            console.error('Erro ao enviar solicitação:', error);
            this.snackBar.open('Erro ao enviar solicitação', 'OK', { duration: 3000 });
          });
      }
    });
  }

  // Substitua o método existente por esta versão atualizada
  addMemberByEmail(email: string): void {
    if (!email || !email.includes('@')) {
      this.snackBar.open('Por favor, insira um email válido', 'OK', { duration: 3000 });
      return;
    }
    
    // Obter membros atuais
    const currentMembers = this.groupForm.get('memberIds')?.value || [];
    
    // Verificar se já está na lista
    if (currentMembers.includes(email)) {
      this.snackBar.open('Este email já está na lista de membros', 'OK', { duration: 3000 });
      return;
    }
    
    // Adicionar o email ao formulário
    this.groupForm.get('memberIds')?.setValue([...currentMembers, email]);
    
    // Salvar o grupo (criar ou atualizar)
    if (this.selectedGroup) {
      // Atualizar grupo existente
      this.groupService.updateGroup(this.selectedGroup.id, this.groupForm.value)
        .then(() => {
          this.snackBar.open(`${email} adicionado e grupo atualizado com sucesso`, 'OK', { duration: 3000 });
          this.loadGroups(); // Recarregar grupos para atualizar a lista
        })
        .catch(error => {
          console.error('Erro ao atualizar grupo:', error);
          this.snackBar.open('Erro ao adicionar membro', 'OK', { duration: 3000 });
        });
    } else {
      // Criar novo grupo
      if (this.groupForm.invalid) {
        this.snackBar.open('Por favor preencha o nome do grupo', 'OK', { duration: 3000 });
        return;
      }
      
      this.groupService.createGroup(this.groupForm.value)
        .then(() => {
          this.snackBar.open(`Grupo criado com ${email} como membro`, 'OK', { duration: 3000 });
          this.loadGroups(); // Recarregar grupos
          this.resetForm();  // Resetar formulário após criação bem-sucedida
        })
        .catch(error => {
          console.error('Erro ao criar grupo:', error);
          this.snackBar.open('Erro ao criar grupo', 'OK', { duration: 3000 });
        });
    }
    
    // Limpar o campo de entrada
    this.manualEmail = '';
  }

  // Atualize o método removeMember para salvar após remover
  removeMember(userIdOrEmail: string): void {
    const currentMembers = this.groupForm.get('memberIds')?.value || [];
    this.groupForm.get('memberIds')?.setValue(currentMembers.filter((id: string) => id !== userIdOrEmail));
    
    // Salvar as mudanças automaticamente
    if (this.selectedGroup) {
      this.groupService.updateGroup(this.selectedGroup.id, this.groupForm.value)
        .then(() => {
          this.snackBar.open('Membro removido do grupo', 'OK', { duration: 3000 });
          this.loadGroups(); // Recarregar a lista
        })
        .catch(error => {
          console.error('Erro ao atualizar grupo:', error);
          this.snackBar.open('Erro ao remover membro', 'OK', { duration: 3000 });
        });
    } else {
      this.snackBar.open('Membro removido', 'OK', { duration: 3000 });
    }
  }

  /**
   * Display user name in autocomplete
   */
  displayUserFn(user: any): string {
    if (!user) return '';
    return user.email || user.nome || user.name || user.displayName || '';
  }

  // Adicione os métodos para verificar se é membro, sair do grupo e excluir grupo
  isMember(group: Group): boolean {
    if (!this.userId || !group.memberIds) return false;
    // Verificar se o usuário está na lista de membros por ID ou email
    return group.memberIds.includes(this.userId) || 
           (!!this.userEmail && group.memberIds.includes(this.userEmail));
  }

  leaveGroup(group: Group): void {
    // Confirmar antes de sair
    if (!confirm(`Tem certeza que deseja sair do grupo "${group.name}"?`)) {
      return;
    }

    // Se temos o userId
    if (this.userId) {
      this.groupService.removeGroupMember(group.id, this.userId)
        .then(() => {
          this.snackBar.open('Você saiu do grupo com sucesso', 'OK', { duration: 3000 });
          this.selectedGroup = null;
          this.loadGroups(); // Recarregar a lista de grupos
        })
        .catch(error => {
          console.error('Erro ao sair do grupo:', error);
          this.snackBar.open('Erro ao sair do grupo', 'OK', { duration: 3000 });
        });
    }
    
    // Se estamos usando email
    if (this.userEmail && group.memberIds.includes(this.userEmail)) {
      // Crie uma cópia do grupo sem o email na lista
      const updatedGroup = {...group};
      updatedGroup.memberIds = updatedGroup.memberIds.filter(id => id !== this.userEmail);
      
      this.groupService.updateGroup(group.id, updatedGroup)
        .then(() => {
          this.snackBar.open('Você saiu do grupo com sucesso', 'OK', { duration: 3000 });
          this.selectedGroup = null;
          this.loadGroups(); // Recarregar a lista de grupos
        })
        .catch(error => {
          console.error('Erro ao sair do grupo:', error);
          this.snackBar.open('Erro ao sair do grupo', 'OK', { duration: 3000 });
        });
    }
  }

  deleteGroup(): void {
    if (!this.selectedGroup) return;
    
    // Confirmar antes de excluir
    if (!confirm(`ATENÇÃO: Esta ação é irreversível!\n\nTem certeza que deseja excluir permanentemente o grupo "${this.selectedGroup.name}"?`)) {
      return;
    }
    
    this.groupService.deleteGroup(this.selectedGroup.id)
      .then(() => {
        this.snackBar.open('Grupo excluído com sucesso', 'OK', { duration: 3000 });
        this.selectedGroup = null;
        this.resetForm();
        this.loadGroups(); // Recarregar a lista de grupos
      })
      .catch(error => {
        console.error('Erro ao excluir grupo:', error);
        this.snackBar.open('Erro ao excluir grupo', 'OK', { duration: 3000 });
      });
  }

  recarregar(): void {
    this.loadGroups();
    this.snackBar.open('Lista de grupos recarregada', 'OK', { duration: 3000 });
  }

  voltar(): void {
    this.router.navigate(['/']);
  }
  
  getViewPath(): string {
    return '/';
  }

  addAdmin(): void {
    if (this.adminInput.value) {
      // Add admin from input to selectedAdmins array
      this.selectedAdmins.push(this.adminInput.value);
      this.adminInput.setValue('');
    }
  }
  
  removeAdmin(admin: any): void {
    // Remove admin from selectedAdmins array
    const index = this.selectedAdmins.indexOf(admin);
    if (index >= 0) {
      this.selectedAdmins.splice(index, 1);
    }
  }
  
  addMember(): void {
    if (this.memberInput.value) {
      // Add member from input to selectedMembers array
      this.selectedMembers.push(this.memberInput.value);
      this.memberInput.setValue('');
    }
  }

  /**
   * Check if current user is admin of a specific group
   */
  isGroupAdmin(group: Group): boolean {
    if (!this.userId || !group.adminIds) return false;
    return group.adminIds.includes(this.userId) || 
           (!!this.userEmail && group.adminIds.includes(this.userEmail));
  }
}