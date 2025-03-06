import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Horario {
  dia: string;
  horario: string;
  local: string;
}

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss']
}) 
export class HorariosComponent {
  @Input() showIcon: boolean = true;
  @Input() darkMode: boolean = false;
  @Input() userProfile: any;
  
  // Dados padrão
  horariosDefault: Horario[] = [];      
  
  getHorarios(): Horario[] {
    if (!this.userProfile?.horarios) return [];

    // Se for string (formato antigo), tenta converter
    if (typeof this.userProfile.horarios === 'string') {
      try {
        return JSON.parse(this.userProfile.horarios);
      } catch (e) {
        console.error('Erro ao converter horários', e);
        return [];
      }
    }

    // Se já for array
    if (Array.isArray(this.userProfile.horarios)) {
      return this.userProfile.horarios;
    }

    return [];
  }
}