import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-titulacoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './titulacoes.component.html', 
  styleUrls: ['./titulacoes.component.scss']
})
export class TitulacoesComponent {

  public userProfile: any;
  formacao: string = '';
  especialidades: string = '';

  constructor(
    public userService: UserService
  ) {
    console.log('TitulacoesComponent constructor');
  }

  ngOnInit() {
    console.log('TitulacoesComponent initialized');
    
    // Move subscription to ngOnInit and load user data if needed
    this.userService.getUserProfileData().subscribe(profile => {
      this.userProfile = profile;
      console.log('User profile loaded:', this.userProfile);
      
      this.formacao = this.userProfile.formacao || '';
      this.especialidades = this.userProfile.especialidades || ''; 
      console.log('Formação:', this.formacao);
      console.log('Especialidades:', this.especialidades);
    });
  }

}