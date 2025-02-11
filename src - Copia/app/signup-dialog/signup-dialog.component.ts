import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SignupDialogData {
  email: string;
  name: string;
  confirm: boolean;
}

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent {
  name: string = '';

  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SignupDialogData
  ) { }

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
