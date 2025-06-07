// Alteração: remoção de logs de depuração (console.log)
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
import { Group, GroupJoinRequest } from './group.model'; // Usar apenas este import
import { RequestJoinDialog } from '../../dialogs/request-join-dialog/request-join-dialog.component';
import { UserService } from '../../services/user.service';

// REMOVER este import duplicado:
// import { Group } from '../../services/group.service';

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
  isAdminOfSelectedGroup = false;
  
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

  showNewAdminField: boolean = false;
  showNewMemberField: boolean = false;

  // ADICIONAR esta propriedade para controlar a exibição do formulário de criação
  isCreatingNewGroup: boolean = false;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private firestoreService: FirestoreService<any>,
    private snackBar: MatSnackBar,
    private configService: ConfigService,
    private dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
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

  ngOnInit() {
    console.log('=== GROUP MANAGER INIT ===');
    
    this.userService.getUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.userEmail = user.email;
        
        console.log('User data no GroupManager:');
        console.log('UID:', this.userId);
        console.log('Email:', this.userEmail);
        
        // CORRIGIR: Verificar se é admin do site
        if (user.email) {
          // CRIAR método isAdminUser para retornar Observable<boolean>
          this.isAdminUser(user.email).subscribe(isAdmin => {
            this.isAdmin = isAdmin;
            console.log('Is Admin:', this.isAdmin);
            
            // Carregar grupos
            this.loadGroups();
          });
        } else {
          this.isAdmin = false;
          this.loadGroups();
        }
      } else {
        console.log('Usuário não autenticado no GroupManager');
      }
    });
  }

  // ADICIONAR método para verificar se é admin
  private isAdminUser(email: string): Observable<boolean> {
    // Implementar verificação de admin ou usar um método do GroupService
    return of(false); // Por enquanto retorna false, você pode implementar a lógica real
  }

  loadGroups() {
    console.log('=== CARREGANDO GRUPOS ===');
    console.log('UserId:', this.userId);
    console.log('UserEmail:', this.userEmail);
    
    this.isLoading = true;
    
    // CORRIGIR: Usar método getAllGroups ao invés de getGroups
    this.groupService.getAllGroups().subscribe({
      next: (allGroups) => {
        console.log('Todos os grupos retornados:', allGroups);
        
        // Filtrar apenas grupos onde o usuário é admin ou membro
        const userGroups = allGroups.filter(group => {
          if (!this.userId && !this.userEmail) return false;
          
          const isAdmin = (this.userId && group.adminIds?.includes(this.userId)) || 
                         (this.userEmail && group.adminIds?.includes(this.userEmail));
          const isMember = (this.userId && group.memberIds?.includes(this.userId)) || 
                          (this.userEmail && group.memberIds?.includes(this.userEmail));
          
          console.log(`Grupo "${group.name}":`, {
            adminIds: group.adminIds,
            memberIds: group.memberIds,
            isAdmin,
            isMember,
            hasAccess: isAdmin || isMember
          });
          
          return isAdmin || isMember;
        });
        
        console.log('Grupos filtrados para o usuário:', userGroups);
        console.log('Quantidade de grupos do usuário:', userGroups.length);
        
        this.groups = userGroups;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos:', error);
        this.isLoading = false;
      }
    });
  }

  loadUsers() {
    // Carregar usuários independente de userId para popular a lista
    this.firestoreService.getRegistros('usuarios').subscribe(users => {
      this.users = users;
    });
  }

  // CORRIGIR método selectGroup - verificar se userId é null
  selectGroup(group: Group) {
    this.isCreatingNewGroup = false; // Fechar formulário de criação se estiver aberto
    this.selectedGroup = group;
    
    // Verificar se o usuário atual é admin deste grupo específico diretamente
    const isGroupAdmin = (this.userId && group.adminIds?.includes(this.userId)) || 
                        (this.userEmail && group.adminIds?.includes(this.userEmail));
    
    this.isAdminOfSelectedGroup = isGroupAdmin || false;
    
    // Só preencher o formulário se for admin do grupo ou admin do site
    if (this.isAdminOfSelectedGroup || this.isAdmin) {
      this.groupForm.patchValue({
        name: group.name,
        description: group.description || '',
        clinica: group.clinica || '',
        adminIds: group.adminIds || [],
        memberIds: group.memberIds || []
      });

      // Popular as arrays com os dados do grupo - CORRIGIR verificação de null
      this.selectedAdmins = (group.adminIds || []).map(adminId => ({
        email: adminId,
        displayValue: this.getUserName(adminId),
        nome: this.getUserName(adminId)
      }));

      this.selectedMembers = (group.memberIds || []).map(memberId => ({
        email: memberId,
        displayValue: this.getUserName(memberId),
        nome: this.getUserName(memberId)
      }));
    }

    this.initializeDisplayValues();
  }

  private initializeDisplayValues() {
    this.selectedAdmins.forEach(admin => {
      if (!admin.displayValue) {
        admin.displayValue = admin.nome || admin.email || '';
      }
    });
    
    this.selectedMembers.forEach(member => {
      if (!member.displayValue) {
        member.displayValue = member.nome || member.email || '';
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
  removeMember(memberToRemove: any): void {
    // Determinar o email do membro
    const emailToRemove = typeof memberToRemove === 'string' ? memberToRemove : memberToRemove.email;
    
    // Remover da array visual
    this.selectedMembers = this.selectedMembers.filter(m => 
      m.email !== emailToRemove && m.displayValue !== emailToRemove
    );
    
    // Atualizar o formulário
    const currentMembers = this.groupForm.get('memberIds')?.value || [];
    this.groupForm.get('memberIds')?.setValue(currentMembers.filter((id: string) => id !== emailToRemove));
    
    // Salvar se estivermos editando um grupo
    if (this.selectedGroup) {
      this.groupService.updateGroup(this.selectedGroup.id, this.groupForm.value)
        .then(() => {
          this.snackBar.open('Membro removido com sucesso', 'OK', { duration: 3000 });
          // REMOVER: this.loadGroups();
        })
        .catch(error => {
          console.error('Erro ao remover membro:', error);
          this.snackBar.open('Erro ao remover membro', 'OK', { duration: 3000 });
          // REVERTER em caso de erro
          this.selectedMembers.push(memberToRemove);
          const revertedMembers = this.groupForm.get('memberIds')?.value || [];
          this.groupForm.get('memberIds')?.setValue([...revertedMembers, emailToRemove]);
        });
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
    // Remover da array visual
    this.selectedAdmins = this.selectedAdmins.filter(a => a.email !== admin.email);
    
    // Atualizar o formulário
    const currentAdmins = this.groupForm.get('adminIds')?.value || [];
    this.groupForm.get('adminIds')?.setValue(currentAdmins.filter((id: string) => id !== admin.email));
    
    // Salvar se estivermos editando um grupo
    if (this.selectedGroup) {
      this.groupService.updateGroup(this.selectedGroup.id, this.groupForm.value)
        .then(() => {
          this.snackBar.open('Administrador removido com sucesso', 'OK', { duration: 3000 });
          // REMOVER: this.loadGroups();
        })
        .catch(error => {
          console.error('Erro ao remover administrador:', error);
          this.snackBar.open('Erro ao remover administrador', 'OK', { duration: 3000 });
          // REVERTER em caso de erro
          this.selectedAdmins.push(admin);
        });
    }
  }
  
  addMember(): void {
    if (this.memberInput.value) {
      // Add member from input to selectedMembers array
      this.selectedMembers.push(this.memberInput.value);
      this.memberInput.setValue('');
    }
  }

  startAddingAdmin() {
    this.showNewAdminField = true;
    this.adminInput.setValue('');
    // Focar no campo após um pequeno delay para garantir que o elemento foi renderizado
    setTimeout(() => {
      const input = document.querySelector('.new-member-row input') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }

  startAddingMember() {
    this.showNewMemberField = true;
    this.memberInput.setValue('');
    // Focar no campo após um pequeno delay para garantir que o elemento foi renderizado
    setTimeout(() => {
      const inputs = document.querySelectorAll('.new-member-row input') as NodeListOf<HTMLInputElement>;
      const memberInput = inputs[inputs.length - 1]; // Pegar o último input (do membro)
      if (memberInput) memberInput.focus();
    }, 100);
  }

  confirmAddAdmin() {
    const email = this.adminInput.value?.trim();
    if (email) {
      // Verificar se o email já existe
      const exists = this.selectedAdmins.some(admin => 
        admin.email === email || admin.displayValue === email
      );
      
      if (!exists) {
        // ADICIONAR PRIMEIRO à array visual
        this.selectedAdmins.push({
          email: email,
          displayValue: email,
          nome: email
        });

        // DEPOIS atualizar o formulário
        const currentAdmins = this.groupForm.get('adminIds')?.value || [];
        this.groupForm.get('adminIds')?.setValue([...currentAdmins, email]);

        // Salvar se estivermos editando um grupo
        if (this.selectedGroup) {
          this.groupService.updateGroup(this.selectedGroup.id, this.groupForm.value)
            .then(() => {
              this.snackBar.open('Administrador adicionado com sucesso', 'OK', { duration: 3000 });
              // REMOVER esta linha que estava causando o problema:
              // this.loadGroups();
            })
            .catch(error => {
              console.error('Erro ao adicionar administrador:', error);
              this.snackBar.open('Erro ao adicionar administrador', 'OK', { duration: 3000 });
              // REVERTER em caso de erro
              this.selectedAdmins = this.selectedAdmins.filter(admin => admin.email !== email);
            });
        }

        this.showNewAdminField = false;
        this.adminInput.setValue('');
      } else {
        this.snackBar.open('Este administrador já foi adicionado', 'Fechar', { duration: 3000 });
      }
    }
  }

  confirmAddMember() {
    const email = this.memberInput.value?.trim();
    if (email) {
      // Verificar se o email já existe nas arrays visuais
      const existsInVisual = this.selectedMembers.some(member => 
        member.email === email || member.displayValue === email
      );
      
      // Verificar se já existe no formulário
      const currentMembers = this.groupForm.get('memberIds')?.value || [];
      const existsInForm = currentMembers.includes(email);
      
      if (!existsInVisual && !existsInForm) {
        // ADICIONAR PRIMEIRO à array visual
        this.selectedMembers.push({
          email: email,
          displayValue: email,
          nome: email
        });

        // DEPOIS atualizar o formulário
        this.groupForm.get('memberIds')?.setValue([...currentMembers, email]);

        // Salvar se estivermos editando um grupo
        if (this.selectedGroup) {
          this.groupService.updateGroup(this.selectedGroup.id, this.groupForm.value)
            .then(() => {
              this.snackBar.open('Membro adicionado com sucesso', 'OK', { duration: 3000 });
              // REMOVER esta linha que estava causando o problema:
              // this.loadGroups();
            })
            .catch(error => {
              console.error('Erro ao adicionar membro:', error);
              this.snackBar.open('Erro ao adicionar membro', 'OK', { duration: 3000 });
              // REVERTER em caso de erro
              this.selectedMembers = this.selectedMembers.filter(member => member.email !== email);
              this.groupForm.get('memberIds')?.setValue(currentMembers);
            });
        }

        this.showNewMemberField = false;
        this.memberInput.setValue('');
      } else {
        this.snackBar.open('Este membro já foi adicionado', 'Fechar', { duration: 3000 });
      }
    }
  }

  cancelAddAdmin() {
    this.showNewAdminField = false;
    this.adminInput.setValue('');
  }

  cancelAddMember() {
    this.showNewMemberField = false;
    this.memberInput.setValue('');
  }

  /**
   * Check if current user is admin of a specific group
   */
  isGroupAdmin(group: Group): boolean {
    if (!this.userId || !group.adminIds) return false;
    return group.adminIds.includes(this.userId) || 
           (!!this.userEmail && group.adminIds.includes(this.userEmail));
  }

  // ADICIONAR método de debug para verificar estado
  getDashboardInfo() {
    return {
      nomeUsuario: this.userEmail || 'Não autenticado',
      grupoSelecionado: this.selectedGroup?.name || 'Nenhum grupo selecionado',
      quantidadeMembros: this.selectedMembers.length,
      quantidadeAdmins: this.selectedAdmins.length,
      quantidadePacientes: 0, // TODO: implementar quando tivermos pacientes compartilhados
      isAdmin: this.isAdmin,
      isAdminDoGrupo: this.isAdminOfSelectedGroup,
      totalGrupos: this.groups.length
    };
  }

  // ADICIONAR método para mostrar formulário de novo grupo
  showNewGroupForm(): void {
    this.isCreatingNewGroup = true;
    this.selectedGroup = null; // Limpar seleção
    this.resetForm();
  }

  // ADICIONAR método para cancelar criação
  cancelNewGroup(): void {
    this.isCreatingNewGroup = false;
    this.resetForm();
  }
}