import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { UtilService } from '../shared/utils/util.service';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: false
})
export class PerfilComponent implements OnInit {
  profileForm: FormGroup;
  userProfileData: any = {};
  isLoading = true;
  errorMessage = '';
  userEmail: string | null = null; // Email do usuário logado
  isEditing: boolean = false; // Controla o modo de edição

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public util: UtilService,
    private firestoreService: FirestoreService<any>,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    // Initialize form with empty values
    this.profileForm = this.fb.group({
      nome: ['', Validators.required],
      username: [''],
      foto: [''],
      nascimento: [''],
      email: ['', Validators.email],
      whatsapp: [''],
      telefone: [''],
      endereco: ['']
    });
  }

  ngOnInit() {
    // First get the authenticated user's email
    this.auth.authState.subscribe(user => {
      if (user && user.email) {
        console.log('User authenticated with email:', user.email);
        this.userEmail = user.email;
        
        // Now load the profile data
        this.loadUserProfile();
      } else {
        console.error('No authenticated user found');
        this.errorMessage = 'Usuário não autenticado';
        this.isLoading = false;
      }
    }, error => {
      console.error('Error getting auth state:', error);
      this.errorMessage = 'Erro ao verificar autenticação';
      this.isLoading = false;
    });
  }

  loadUserProfile() {
    this.isLoading = true;
    
    if (!this.userEmail) {
      console.error('Cannot load profile: userEmail is not set');
      this.errorMessage = 'Email do usuário não encontrado';
      this.isLoading = false;
      return;
    }

    console.log('Loading profile for email:', this.userEmail);
    
    // Directly load the profile from Firestore
    this.firestoreService.getRegistroById('usuarios/dentistascombr/users', this.userEmail).subscribe(
      (userData: any) => {
        if (userData) {
          console.log('User profile data retrieved:', userData);
          this.userProfileData = userData;
          
          // Store in localStorage for future use
          localStorage.setItem('userData', JSON.stringify(userData));
          
          // Update form with the retrieved data
          this.updateFormWithProfileData();
        } else {
          console.log('No profile data found, creating new profile');
          // If no profile exists yet, initialize with the email
          this.userProfileData = { email: this.userEmail };
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error loading profile from Firestore:', error);
        this.errorMessage = 'Erro ao carregar perfil';
        this.isLoading = false;
      }
    );
  }

  updateFormWithProfileData() {
    if (this.userProfileData) {
      // Update form with profile data
      this.profileForm.patchValue({
        nome: this.userProfileData.nome || '',
        username: this.userProfileData.username || '',
        foto: this.userProfileData.foto || '',
        nascimento: this.userProfileData.nascimento || '',
        email: this.userProfileData.email || this.userEmail || '',
        whatsapp: this.userProfileData.whatsapp || '',
        telefone: this.userProfileData.telefone || '',
        endereco: this.userProfileData.endereco || ''
      });
      
      // Ensure email field has a value
      if (!this.userProfileData.email && this.userEmail) {
        this.userProfileData.email = this.userEmail;
      }
    }
  }

  editar(): void {
    this.isEditing = true;
  }

  salvar(): void {
    if (!this.userEmail) {
      console.error('Email do usuário não encontrado.');
      this.errorMessage = 'Email do usuário não encontrado.';
      
      // Try to get email from authentication again
      this.auth.authState.subscribe(user => {
        if (user && user.email) {
          this.userEmail = user.email;
          this.proceedWithSaving();
        } else {
          alert('Não foi possível identificar o usuário. Por favor, faça login novamente.');
        }
      });
    } else {
      this.proceedWithSaving();
    }
  }

  proceedWithSaving(): void {
    if (this.userEmail) {
      console.log('Salvando dados para o email:', this.userEmail);
      console.log('Dados a serem salvos:', this.userProfileData);

      // Ensure userProfileData has the email
      if (!this.userProfileData.email) {
        this.userProfileData.email = this.userEmail;
      }

      this.firestoreService
        .updateRegistro('usuarios/dentistascombr/users', this.userEmail, this.userProfileData)
        .then(() => {
          console.log('Perfil atualizado com sucesso!');
          localStorage.setItem('userData', JSON.stringify(this.userProfileData));
          alert('Dados atualizados com sucesso!');
          this.isEditing = false;
        })
        .catch((error) => {
          console.error('Erro ao atualizar os dados do perfil:', error);
          this.errorMessage = `Erro ao salvar os dados: ${error.message}`;
          alert(this.errorMessage);
        });
    }
  }

  voltar(): void {
    if (this.isEditing) {
      if (confirm('Deseja sair sem salvar as alterações?')) {
        this.isEditing = false;
        this.loadUserProfile(); // Reload original data
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
