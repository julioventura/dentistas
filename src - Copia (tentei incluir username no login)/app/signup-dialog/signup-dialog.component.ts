import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SignupDialogData {
  email: string;
  name: string;
  apelido: string;
  confirm: boolean;
}

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent {
  email: string = '';
  name: string = '';
  apelido: string = '';

  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SignupDialogData // Injeção de dados ajustada
  ) {
    // Inicializar as variáveis com os dados injetados
    this.email = data.email;
    this.name = data.name;
    this.apelido = data.apelido;
  }

  onConfirm(): void {
    if (this.name.trim()) {
      this.dialogRef.close({ confirm: true, email: this.email, name: this.name, apelido: this.apelido });
    } else {
      alert('Por favor, insira um nome válido.');
    }
  }

  onCancel(): void {
    this.dialogRef.close({ confirm: false });
  }
}