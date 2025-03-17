import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot-widget',
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ChatbotWidgetComponent implements OnInit {
  @Input() dentistId!: string;
  @Input() dentistName!: string;
  @Output() expansionChange = new EventEmitter<boolean>();

  isMinimized: boolean = true;

  constructor() { }

  ngOnInit(): void { }

  toggleChat(): void {
    this.isMinimized = !this.isMinimized;
    this.expansionChange.emit(!this.isMinimized);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    // Lógica de ajuste, se necessário
  }
}
