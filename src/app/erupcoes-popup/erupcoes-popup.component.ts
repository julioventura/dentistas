import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-erupcoes-popup',
  templateUrl: './erupcoes-popup.component.html',
  styleUrls: ['./erupcoes-popup.component.scss']
})
export class ErupcoesPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ErupcoesPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dataChamadaOriginal: string, enviosSeguintes: string, dataResposta: string, dataComparecimento: string }
  ) {}

  fechar(): void {
    this.dialogRef.close();
  }
}
