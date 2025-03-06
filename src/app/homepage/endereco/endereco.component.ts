import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-endereco',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './endereco.component.html', 
  styleUrls: ['./endereco.component.scss']
})
export class EnderecoComponent {
  @Input() showIcon: boolean = true;
  @Input() darkMode: boolean = false;
  @Input() userProfile: any; // Recebe dados do perfil
  
  // Dados padrão, usados apenas se userProfile não for fornecido
  endereco = {
    rua: 'Av. Paulista, 1000',
    complemento: 'Sala 501',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    telefone: '(11) 3456-7890',
    email: 'contato@dentistaapp.com.br'
  };
  

  ngOnInit(): void {
    console.log('EnderecoComponent - Iniciando com endereco:', this.endereco);
    
    // Inicializa os endereços assim que o componente carregar
    this.processarEnderecos();
  }

  // Novo método para processar os endereços ao inicializar o componente
  private processarEnderecos(): void {
    if (this.enderecos) {
      console.log('Processando endereços:', this.endereco);
      
      let enderecosTemp: any[] = [];
      
      if (Array.isArray(this.enderecos)) {
        enderecosTemp = [...this.enderecos];
        console.log('Endereços carregados como array:', enderecosTemp);
      } 
      else if (typeof this.enderecos === 'string') {
          try {
            const parsed = JSON.parse(this.enderecos);
            enderecosTemp = Array.isArray(parsed) ? parsed : [];
            console.log('Endereços convertidos de string:', enderecosTemp);
          } catch (e) {
            console.error('Erro ao converter endereços de string:', e);
            enderecosTemp = [];
          }
        } 
        else {
          console.warn('Formato de endereços não reconhecido:', typeof this.enderecos);
          enderecosTemp = [];
        }
      
      // Validates and normalizes each endereco object
      this.enderecos = enderecosTemp.map(item => this.normalizeEndereco(item))
        .filter(Boolean) as Endereco[];
      
      // Set the primary address if available
      if (this.enderecos.length > 0) {
        this.endereco = this.enderecos[0];
      }
    } else {
      console.log('Sem endereços para processar');
      this.enderecos = [];
    }
  }
  
  // Helper method to normalize the endereco object
  private normalizeEndereco(obj: any): Endereco | null {
    if (!obj || typeof obj !== 'object') return null;
    
    return {
      rua: typeof obj.rua === 'string' ? obj.rua : '',
      bairro: typeof obj.bairro === 'string' ? obj.bairro : '',
      cidade: typeof obj.cidade === 'string' ? obj.cidade : '',
      estado: typeof obj.estado === 'string' ? obj.estado : '',
  // Método para retornar se há endereços adicionais
  hasEnderecosAdicionais(): boolean {
    console.log('Verificando se há endereços adicionais:', this.enderecos && this.enderecos.length > 0);
    return this.enderecos && this.enderecos.length > 0;
  }
  // Método para retornar se há endereços adicionais
  hasEnderecosAdicionais(): boolean {
    console.log('Verificando se há endereços adicionais:', this.endereco && this.endereco.length > 0);
    return this.endereco && this.endereco.length > 0;
  }

  // Método para obter o endereço principal formatado
  getEnderecoCompleto(): string {
    if (this.userProfile) {
      return `${this.userProfile.endereco || ''}, ${this.userProfile.bairro || ''} - ${this.userProfile.cidade || ''}, ${this.userProfile.estado || ''}`;
    }
    return `${this.endereco.rua}, ${this.endereco.complemento} - ${this.endereco.bairro}`;
  }
  
  getCidadeEstadoCep(): string {
    if (this.userProfile) {
      return `${this.userProfile.cidade || 'XXXXXX'} - ${this.userProfile.estado || 'XX'}, CEP ${this.userProfile.cep || 'XXXXX-XXX'}`;
    }
    else {
      return '';
    }
  }

  getCep(): string {
    return this.userProfile?.cep || '';
  }
}