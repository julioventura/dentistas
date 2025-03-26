import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SignupDialogData {
  email: string;
  name: string;
  confirm: boolean;
}

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class SignupDialogComponent {
  name: string = '';
  data: { email: string };

  // Usando abordagem alternativa sem @Inject para evitar o erro
  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    private injector: Injector
  ) { 
    // Obter dados do diálogo usando o injector
    try {
      this.data = this.injector.get(MAT_DIALOG_DATA);
      if (!this.data) {
        this.data = { email: '' };
      }
    } catch (error) {
      console.error('Erro ao obter dados do diálogo:', error);
      this.data = { email: '' };
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close({ name: this.name, email: this.data.email });
  }
}
