import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Horario {
  dia: string;
  horario: string;
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
  horariosDefault: Horario[] = [
    { dia: 'Segunda à Sexta', horario: '09:00 - 18:00' },
    { dia: 'Sábado', horario: '09:00 - 13:00' }
  ];
  
  getHorarios(): Horario[] {
    if (this.userProfile?.horarios && this.userProfile.horarios.length > 0) {
      return this.userProfile.horarios;
    }
    return this.horariosDefault;
  }
}