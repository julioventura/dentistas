import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  nome: string;
  nascimento: string;
  dataChamadaOriginal: string;
  enviosSeguintes: string;
  dataResposta: string;
  dataComparecimento: string;
}

@Component({
  selector: 'app-erupcoes-popup',
  templateUrl: './erupcoes-popup.component.html',
  styleUrls: ['./erupcoes-popup.component.scss']
})
export class ErupcoesPopupComponent {
  // Define `data` como uma propriedade opcional, que será atribuída depois
  public data?: DialogData;

  constructor(public dialogRef: MatDialogRef<ErupcoesPopupComponent>) {}

  fechar(): void {
    this.dialogRef.close();
  }
}
