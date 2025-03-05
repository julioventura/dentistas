import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { UtilService } from '../shared/utils/util.service';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { getProfileFormConfig, getGroupedProfileFields, ProfileField } from '../shared/constants/profile-fields.constants';
import { finalize } from 'rxjs/operators';

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
  userEmail: string | null = null;
  isEditing: boolean = false;
  isSaving = false;
  usernameError = '';
  originalUsername = '';
  
  // Configuração de layout
  customLabelWidthValue: number = 100;
  customLabelWidth: string = `${this.customLabelWidthValue}px`;

  // Add reference to grouped fields for the template
  groupedFields: { [key: string]: ProfileField[] };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public util: UtilService,
    private firestoreService: FirestoreService<any>,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.isEditing = false;
    this.profileForm = this.fb.group(getProfileFormConfig());
    this.profileForm.disable(); // Inicialmente desabilitado (modo visualização)
    this.groupedFields = getGroupedProfileFields();
  }

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user && user.email) {
        console.log('User authenticated with email:', user.email);
        this.userEmail = user.email;
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
    
    this.firestoreService.getRegistroById('usuarios/dentistascombr/users', this.userEmail).subscribe(
      (userData: any) => {
        if (userData) {
          console.log('User profile data retrieved:', userData);
          this.userProfileData = userData;
          this.originalUsername = userData.username || '';
          
          localStorage.setItem('userData', JSON.stringify(userData));
          this.updateFormWithProfileData();
        } else {
          console.log('No profile data found, creating new profile');
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
      // Resetar valores antes de preencher
      this.profileForm.reset();
      
      // Preencher com os dados do perfil
      const formValues = Object.keys(this.profileForm.controls)
        .reduce((acc, key) => {
          acc[key] = this.userProfileData[key] || 
                    (key === 'email' ? this.userEmail : '');
          return acc;
        }, {} as Record<string, any>);
      
      this.profileForm.patchValue(formValues);
      
      if (!this.userProfileData.email && this.userEmail) {
        this.userProfileData.email = this.userEmail;
      }
    }
  }

  updateCustomLabelWidth() {
    this.customLabelWidth = `${this.customLabelWidthValue}px`;
  }

  editar(): void {
    this.isEditing = true;
    this.profileForm.enable(); // Habilita todos os campos para edição
    
    // Aplicar validadores ao entrar em modo de edição
    this.profileForm.get('nome')?.setValidators([Validators.required]);
    this.profileForm.get('username')?.setValidators([
      Validators.pattern('^[a-zA-Z0-9_.]+$'),
      Validators.minLength(3)
    ]);
    this.profileForm.get('email')?.setValidators([Validators.required, Validators.email]);
    
    // Atualizar os validadores
    this.profileForm.get('nome')?.updateValueAndValidity();
    this.profileForm.get('username')?.updateValueAndValidity();
    this.profileForm.get('email')?.updateValueAndValidity();
    
    // Desabilitar o campo email para garantir que não seja alterado
    this.profileForm.get('email')?.disable();
  }

  cancelEdit(): void {
    if (confirm('Deseja cancelar as alterações?')) {
      this.isEditing = false;
      this.loadUserProfile(); // Recarrega os dados originais
      this.profileForm.disable(); // Desabilita os campos
      this.usernameError = '';
    }
  }

  checkUsername(): void {
    const username = this.profileForm.get('username')?.value;
    
    if (!username) {
      this.usernameError = '';
      return;
    }
    
    // Não validar se for o mesmo username original
    if (username === this.originalUsername) {
      this.usernameError = '';
      return;
    }

    // Verifica padrão antes de consultar o Firestore
    const usernamePattern = /^[a-zA-Z0-9_.]+$/;
    if (!usernamePattern.test(username)) {
      this.usernameError = 'Username pode conter apenas letras, números, underscore e ponto.';
      return;
    }
    
    if (username.length < 3) {
      this.usernameError = 'Username deve ter pelo menos 3 caracteres.';
      return;
    }

    this.userService.isValidUsername(username).subscribe(exists => {
      this.usernameError = exists ? 'Este username já está em uso.' : '';
    });
  }

  onFieldChanged(event: { field: string; value: any }) {
    // Handle the field change
    console.log(`Field ${event.field} changed to ${event.value}`);
    // Your implementation...
  }

  salvar(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      return;
    }
    
    if (this.usernameError) {
      this.errorMessage = 'Por favor, escolha outro username.';
      return;
    }
    
    if (!this.userEmail) {
      console.error('Email do usuário não encontrado.');
      this.errorMessage = 'Email do usuário não encontrado.';
      return;
    }

    this.isSaving = true;
    
    // Obter dados do formulário
    const formValues = this.profileForm.getRawValue(); // Inclui campos disabled
    
    const updatedProfile = {
      ...this.userProfileData,
      ...formValues,
      email: this.userEmail // Garantir que o email não mude
    };
    
    this.userService.updateUserProfile(this.userEmail, updatedProfile)
      .then(() => {
        console.log('Perfil atualizado com sucesso!');
        this.userProfileData = updatedProfile;
        localStorage.setItem('userData', JSON.stringify(updatedProfile));
        this.isEditing = false;
        this.profileForm.disable(); // Desabilita os campos após salvar
        this.isSaving = false;
        this.errorMessage = '';
        this.usernameError = '';
        this.originalUsername = updatedProfile.username || '';
        alert('Perfil atualizado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao atualizar perfil:', error);
        this.errorMessage = `Erro ao salvar: ${error.message}`;
        this.isSaving = false;
      });
  }

  voltar(): void {
    if (this.isEditing) {
      if (confirm('Deseja sair sem salvar as alterações?')) {
        this.isEditing = false;
        this.loadUserProfile();
        this.profileForm.disable();
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  // Helper method for setting classes based on edit mode
  setClass(baseClass: string): string {
    return `${baseClass} ${this.isEditing ? 'edit-mode' : 'view-mode'}`;
  }

  // Helper method for displaying field values properly
  displayValue(field: ProfileField): string {
    const value = this.profileForm.get(field.controlName)?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    return value;
  }
  
  // Helper method to check if a field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const control = this.profileForm.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }
  
  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (!control || !control.errors) {
      return '';
    }
    
    if (control.errors['required']) {
      return 'Este campo é obrigatório';
    }
    if (control.errors['email']) {
      return 'Email inválido';
    }
    if (control.errors['pattern']) {
      return 'Formato inválido';
    }
    if (control.errors['minlength']) {
      return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
    }
    
    return 'Campo inválido';
  }
  
  // Handle field blur event for validation
  onFieldBlur(fieldName: string): void {
    if (fieldName === 'username') {
      this.checkUsername();
    }
  }
  
  // Handle field change event
  onFieldChange(event: Event, fieldName: string): void {
    this.onFieldChanged({ field: fieldName, value: (event.target as HTMLInputElement).value });
  }
}
