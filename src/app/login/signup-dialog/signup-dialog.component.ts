import { Component, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ]
})
export class SignupDialogComponent {
  name: string = '';
  data: SignupDialogData;

  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    private injector: Injector
  ) { 
    this.data = this.injector.get(MAT_DIALOG_DATA);
  }

  onConfirm(): void {
    if (this.name.trim()) {
      this.dialogRef.close({ confirm: true, name: this.name });
    } else {
      alert('Por favor, insira um nome válido.');
    }
  }

  onCancel(): void {
    this.dialogRef.close({ confirm: false });
  }
}
