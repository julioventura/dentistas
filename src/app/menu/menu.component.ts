import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  // Recebe a lista de subcoleções para exibição
  @Input() subcolecoes: { nome: string, rota: string }[] = [];
  @Input() colecao: string = '';
  @Input() id: string = '';

  constructor(private router: Router) { }

  // Função para navegar para a rota da subcoleção selecionada
  navegarPara(subcolecao: string) {
    // this.router.navigate([rota]);

    const listPath = `/list-fichas/${this.colecao}/${this.id}/fichas`;
    console.log('listPath = ', listPath);

    this.router.navigate([`${listPath}`, subcolecao]);
  }
}
