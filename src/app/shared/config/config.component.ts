import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';  // Importando o ConfigService
import { NavegacaoService } from '../navegacao.service';
import { Router } from '@angular/router';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  apiUrl: string = '';
  environment: string = '';
  firebaseConfig: any;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private navegacaoService: NavegacaoService,
    public util: UtilService
  ) { }

  ngOnInit(): void {
    // Pegando as configurações do ConfigService
    this.apiUrl = this.configService.getApiUrl();
    this.environment = this.configService.getEnvironment();
    this.firebaseConfig = this.configService.getFirebaseConfig();
  }


  // Método para voltar para a página anterior
  voltar() {
    this.navegacaoService.goBack();  // Chama o método do serviço para voltar
  }


  editar() {

  }


}
