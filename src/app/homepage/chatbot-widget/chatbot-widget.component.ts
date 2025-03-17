import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.scss'],
  animations: [
    trigger('expandAnimation', [
      state('minimized', style({
        height: '50px',            // Mantém altura do estado minimizado
        transform: 'translateY(0)',// Sem deslocamento
        opacity: 1                 // Visível
      })),
      state('expanded', style({
        height: '*',               // Altura automática quando expandido
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('minimized => expanded', [
        style({ height: '50px', transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition('expanded => minimized', [
        animate('300ms ease-in', style({ height: '50px', transform: 'translateY(-20px)', opacity: 0 })),
        style({ height: '50px', transform: 'translateY(0)', opacity: 1 })
      ])
    ])
  ]
})
export class ChatbotWidgetComponent implements OnInit {

  dentistId!: string;
  dentistName!: string;

  isMinimized = true;
  isMaximized = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.dentistId = this.userService.dentistId;
    this.dentistName = this.userService.dentistName;
    // Define o estado inicial do chatbot no serviço
    this.userService.setChatbotExpanded(!this.isMinimized);
  }

  toggleChat(): void {
    if (this.isMaximized) {
      this.isMaximized = false;
    }
    this.isMinimized = !this.isMinimized;
    this.userService.setChatbotExpanded(!this.isMinimized);
  }

  toggleMaximize(): void {
    if (!this.isMinimized) {
      this.isMaximized = !this.isMaximized;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    // Se necessário, implemente ajustes responsivos aqui.
  }
}
