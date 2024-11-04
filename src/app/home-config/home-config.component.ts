import { Component, OnInit } from '@angular/core';
import { NavegacaoService } from '../shared/navegacao.service';

import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-home-config',
  templateUrl: './home-config.component.html',
  styleUrls: ['./home-config.component.scss']
})
export class HomeConfigComponent implements OnInit {
  colecoesAtivas = ['Pacientes', 'Alunos', 'Professores', 'Dentistas', 'Equipe', 'Protéticos']; // Exemplo de coleções ativas
  colecaoSelecionada: string | null = null;

  // Ícones disponíveis e sua visibilidade
  icons = [
    { key: 'pacientes', label: 'Pacientes' },
    { key: 'alunos', label: 'Alunos' },
    { key: 'professores', label: 'Professores' },
    { key: 'dentistas', label: 'Dentistas' },
    { key: 'equipe', label: 'Equipe' },
    { key: 'proteticos', label: 'Protéticos' },
    { key: 'indicador', label: 'Indicador' },
    { key: 'dentais', label: 'Dentais' },
    { key: 'empresas', label: 'Empresas' },
    { key: 'perfil', label: 'Perfil' },
    { key: 'homepage', label: 'Homepage' }
  ];
  visibleIcons: { [key: string]: boolean } = {};


  constructor(
    public util: UtilService,
    private navegacaoService: NavegacaoService,
  ) { }


  ngOnInit() {
    this.loadIconConfig();
  }

  selecionarColecao(colecao: string) {
    this.colecaoSelecionada = colecao;
  }

  loadIconConfig() {
    const savedConfig = localStorage.getItem('iconVisibility');
    if (savedConfig) {
      this.visibleIcons = JSON.parse(savedConfig);
    } else {
      // Define todos como visíveis por padrão se não houver configuração salva
      this.icons.forEach(icon => {
        this.visibleIcons[icon.key] = true;
      });
    }
  }

  salvarConfiguracoes() {
    localStorage.setItem('iconVisibility', JSON.stringify(this.visibleIcons));
    alert('Configurações salvas com sucesso!');
  }

  voltar() {
    this.navegacaoService.goBack();
  }
}
