/**
 * EditComponent
 * 
 * Métodos:
 * 1. ngOnInit: Inicializa o componente, autentica o usuário, obtém parâmetros da rota e carrega o registro.
 * 2. ngAfterViewInit: Após a renderização da view, foca o campo "Nome".
 * 3. salvar: Invocado via template para salvar o registro; decide entre salvar collection ou subcollection.
 * 4. salvar_collection_anterior: Persiste alterações no registro principal (collection); 
 *    - Parâmetros: N/A (usa propriedades internas como FormService.fichaForm e FormService.registro)
 *    - Executa a atualização do registro e, após upload de arquivos, navega para a view do registro.
 * 5. verFicha: Navega para a visualização (view) do registro ou ficha.
 * 6. voltar: Retorna à rota de visualização do registro.
 * 7. loadCustomFields: Recria e preenche o FormGroup com os controles personalizados a partir dos dados carregados;
 *    - Parâmetros: Usa userId, collection, subcollection.
 * 8. updateCustomLabelWidth: Atualiza a propriedade customLabelWidth com base no valor customLabelWidthValue.
 * 9. fixedFields (getter): Retorna os campos fixos (por exemplo, 'nome', 'data', 'nuvem', 'obs').
 * 10. adjustableFields (getter): Retorna os campos que não são fixos.
 * 11. onSubmit: Processa o submit do formulário e exibe os dados para depuração (continua o fluxo de salvamento).
 * 12. groupByGrupo: Agrupa os campos com base na propriedade "grupo".
 * 13. camposAgrupados (getter): Retorna os campos agrupados para utilização no template.
 */

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilService } from '../shared/utils/util.service';
import { FormService } from '../shared/form.service';
import { CamposFichaService } from '../shared/campos-ficha.service';  // Serviço para carregar campos de subcollections
import { FormControl, FormGroup } from '@angular/forms';
import { CamposService } from '../shared/campos.service'; // Serviço para carregar campos de coleções
import { KeyValue } from '@angular/common';
import { fadeAnimation } from '../animations/fade.animation';
import { CanComponentDeactivate } from '../shared/guards/can-deactivate.guard';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

interface Campo {
  nome: string;
  tipo: string;
  label?: string;
  grupo?: string;
  subgrupo?: string;
  opcoes?: any[];
  defaultValue?: any;
  expandido?: boolean;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated, // Sobre encapsulamento, para permitir uso global de variáveis CSS (None)
  animations: [fadeAnimation]
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy, CanComponentDeactivate {
  @ViewChild('nomeInput') nomeInput?: ElementRef;
  userId: string | null = null;
  collection!: string;
  subcollection!: string;
  registro: any = {};
  id!: string;
  view_only: boolean = false;
  fichaId: string = '';
  titulo_da_pagina: string = '';
  subtitulo_da_pagina: string = '';
  isLoading = true;
  registroPath: string = '';
  routePath: string = '';
  arquivos: { [key: string]: File } = {};
  formReady: boolean = false;
  customLabelWidthValue: number = 200;
  customLabelWidth: string = `${this.customLabelWidthValue}px`;
  
  // Adicione esta propriedade para controlar grupos expandidos
  gruposExpandidos: { [key: string]: boolean } = {};
  
  // Adicione esta propriedade para controlar subgrupos expandidos
  subgruposExpandidos: { [key: string]: boolean } = {};
  
  private boundBeforeUnloadHandler!: (event: BeforeUnloadEvent) => void;
  
  // Adicione esta propriedade à classe
  private dialogAlreadyShown = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private afAuth: AngularFireAuth,
    public util: UtilService,
    public FormService: FormService,
    private camposFichaService: CamposFichaService,  // Injeção para subcollections
    private camposService: CamposService,              // Injeção para collections
    private dialog: MatDialog
  ) { }

  /**
   * ngOnInit()
   * 
   * Parâmetros: N/A.
   * Funcionalidade: 
   * - Subscrição do authState para obter o usuário autenticado.
   * - Obtém parâmetros da rota (id, collection, subcollection, fichaId).
   * - Carrega o registro: se for subcollection, chama loadFicha; caso contrário, loadRegistro.
   * - Define o subtítulo com base no nome do registro e ajusta a largura dos labels.
   * Retorna: void.
   */
  ngOnInit() {
    console.log('ngOnInit()');
    
    // Inicializa todos os grupos como colapsados
    this.gruposExpandidos = {};
    this.subgruposExpandidos = {};
    
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) { this.id = id; }
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.subcollection = this.route.snapshot.paramMap.get('subcollection')!;
        this.fichaId = this.route.snapshot.paramMap.get('fichaId')!;

        this.titulo_da_pagina = this.util.titulo_ajuste_singular(this.subcollection || this.collection);

        console.log('userId:', this.userId);
        console.log('collection:', this.collection);
        console.log('id:', id);
        console.log('titulo_da_pagina:', this.titulo_da_pagina);
        console.log('subcollection:', this.subcollection);
        console.log('fichaId:', this.fichaId);

        if (!this.id) {
          console.error('Registro não identificado.');
          this.voltar();
        } else {
          if (this.subcollection) {
            this.FormService.loadFicha(this.userId, this.collection, this.id, this.subcollection, this.fichaId, this.view_only)
              .then(() => {
                // Inicializar todos os grupos como fechados após carregar os dados
                this.inicializarGruposESubgrupos();
              });
          } else {
            this.FormService.loadRegistro(this.userId, this.collection, this.id, this.view_only)
              .then(() => {
                // Inicializar todos os grupos como fechados após carregar os dados
                this.inicializarGruposESubgrupos();
              });
          }
        }
        
        this.subtitulo_da_pagina = this.FormService.nome_in_collection;
        if (this.subcollection) {
          this.customLabelWidthValue = 350;
        }
        else {
          this.customLabelWidthValue = 150;
        }
        this.updateCustomLabelWidth();

      } else {
        console.error('Usuário não autenticado.');
        this.util.goHome();
      }
    });

    // Armazena a referência para remover depois
    this.boundBeforeUnloadHandler = this.beforeUnloadHandler.bind(this);
    window.addEventListener('beforeunload', this.boundBeforeUnloadHandler);
  }
  
  // Método para inicializar todos os grupos como fechados
  inicializarGruposFechados() {
    if (this.FormService.campos) {
      const grupos = this.groupByGrupo(this.FormService.campos);
      
      Object.keys(grupos).forEach(grupoNome => {
        this.gruposExpandidos[grupoNome] = false;
        
        // Verificar se o grupo tem subgrupos
        const campos = grupos[grupoNome];
        if (this.hasSubgrupos(campos)) {
          const subgrupos = this.getUniqueSubgrupos(campos);
          subgrupos.forEach(subgrupo => {
            if (subgrupo) {
              this.subgruposExpandidos[`${grupoNome}-${subgrupo}`] = false;
            }
          });
        }
      });
    }
    console.log('Grupos e subgrupos inicializados como fechados');
  }
  
  // Método para inicializar grupos e subgrupos
  inicializarGruposExpandidos() {
    if (this.FormService.campos) {
      const grupos = this.groupByGrupo(this.FormService.campos);
      
      Object.keys(grupos).forEach(grupoNome => {
        // Iniciar grupos expandidos
        this.gruposExpandidos[grupoNome] = true;
        
        // Verificar se o grupo tem subgrupos
        const campos = grupos[grupoNome];
        if (this.hasSubgrupos(campos)) {
          const subgrupos = this.getUniqueSubgrupos(campos);
          subgrupos.forEach(subgrupo => {
            if (subgrupo) {
              // Iniciar subgrupos expandidos
              this.subgruposExpandidos[`${grupoNome}-${subgrupo}`] = true;
            }
          });
        }
      });
    }
    console.log('Grupos e subgrupos inicializados como expandidos');
  }
  
  // Inicializar grupos expandidos e subgrupos colapsados
  inicializarGruposESubgrupos() {
    if (this.FormService.campos) {
      const grupos = this.groupByGrupo(this.FormService.campos);
      
      Object.keys(grupos).forEach(grupoNome => {
        const campos = grupos[grupoNome];
        
        // Verificar se algum campo no grupo tem a propriedade expandido=true
        const temCampoExpandido = campos?.some(campo => campo.expandido === true) || false;
        
        // Iniciar o grupo como expandido se algum campo tiver a propriedade expandido=true
        this.gruposExpandidos[grupoNome] = temCampoExpandido;
        
        // Verificar se o grupo tem subgrupos
        if (this.hasSubgrupos(campos)) {
          const subgrupos = this.getUniqueSubgrupos(campos);
          
          subgrupos.forEach(subgrupo => {
            if (subgrupo) {
              // Verificar se algum campo no subgrupo tem a propriedade expandido=true
              const camposSubgrupo = campos.filter(campo => campo.subgrupo === subgrupo);
              const temSubgrupoExpandido = camposSubgrupo.some(campo => campo.expandido === true);
              
              // Iniciar o subgrupo como expandido se algum campo tiver a propriedade expandido=true
              this.subgruposExpandidos[`${grupoNome}-${subgrupo}`] = temSubgrupoExpandido;
            }
          });
        }
      });
    }
    console.log('Grupos e subgrupos inicializados com base na propriedade expandido');
  }
  
  // Método para alternar a visibilidade de um grupo
  toggleGrupo(grupoNome: string): void {
    // console.log(`Alternando grupo ${grupoNome} de ${this.gruposExpandidos[grupoNome]} para ${!this.gruposExpandidos[grupoNome]}`);
    this.gruposExpandidos[grupoNome] = !this.gruposExpandidos[grupoNome];
  }

  // Método para alternar a visibilidade de um subgrupo
  toggleSubgrupo(subgrupoKey: string): void {
    // console.log(`Alternando subgrupo ${subgrupoKey} de ${this.subgruposExpandidos[subgrupoKey]} para ${!this.subgruposExpandidos[subgrupoKey]}`);
    this.subgruposExpandidos[subgrupoKey] = !this.subgruposExpandidos[subgrupoKey];
  }
  
  // Método para obter subgrupos únicos em um conjunto de campos
  getUniqueSubgrupos(campos: any[]): string[] {
    const subgrupos = campos.map(campo => campo.subgrupo || '');
    return [...new Set(subgrupos)];
  }
  
  // Método para agrupar campos por subgrupo
  groupBySubgrupo(campos: any[]): { [key: string]: any[] } {
    // Se não houver campos com subgrupo, cria um grupo vazio
    if (!this.hasSubgrupos(campos)) {
      return { '': campos };
    }
    
    return campos.reduce((acc, campo) => {
      const subgrupo = campo.subgrupo || '';
      if (!acc[subgrupo]) {
        acc[subgrupo] = [];
      }
      acc[subgrupo].push(campo);
      return acc;
    }, {} as { [key: string]: any[] });
  }
  
  // Método para verificar se um grupo tem subgrupos
  hasSubgrupos(campos: any[]): boolean {
    if (!campos || campos.length === 0) return false;
    
    // Verifica se pelo menos um campo tem um subgrupo não vazio
    return campos.some(campo => campo.subgrupo && campo.subgrupo.trim() !== '');
  }

  /**
   * updateCustomLabelWidth()
   * 
   * Funcionalidade:
   * - Atualiza a propriedade customLabelWidth (string) baseada em customLabelWidthValue.
   * Retorna: void.
   */
  updateCustomLabelWidth() {
    this.customLabelWidth = `${this.customLabelWidthValue}px`;
  }

  /**
   * ngAfterViewInit()
   * 
   * Parâmetros: N/A.
   * Funcionalidade:
   * - Tenta focar o campo "nome" logo após a renderização da view.
   * Retorna: void.
   */
  ngAfterViewInit() {
    if (this.nomeInput) {
      setTimeout(() => {
        this.nomeInput?.nativeElement.focus();
      }, 0);
    } else {
      // O campo "nome" não foi encontrado; verificar se o template carrega corretamente..
      console.warn('O campo "nome" não foi encontrado.');
    }
  }

  /**
   * salvar()
   * 
   * Parâmetros: N/A. (Invocado via template)
   * Funcionalidade:
   * - Valida se há usuário autenticado.
   * - Dependendo se o registro é uma subcollection, chama:
   *    - FormService.salvarSubcollection() para subcollections, ou
   *    - salvar_collection_anterior() para coleções principais.
   * - Marca o formulário como "não sujo" antes de navegar.
   * - Navega para a visualização do registro sem passar pelo diálogo.
   */
  salvar() {
    console.log('salvar()');
    if (this.userId) {
      console.log('userId:', this.userId);
      console.log('collection:', this.collection);
      console.log('id:', this.id);
      console.log('subcollection:', this.subcollection);
      console.log('fichaId:', this.fichaId);
      
      if (this.subcollection) {
        console.log("Salvar uma subcollection: ", this.subcollection);
        if (this.fichaId) {
          this.FormService.salvarSubcollection(this.userId, this.collection, this.id, this.subcollection, this.fichaId);
        }
      } else {
        console.log("Salvar uma collection: ", this.collection);
        this.salvar_collection_anterior();
      }
      
      // Marcar o formulário como "não sujo" (não modificado) antes de navegar
      if (this.FormService.fichaForm) {
        this.FormService.fichaForm.markAsPristine();
      }
      
      // Navegar para a ficha sem passar pelo diálogo de confirmação
      const fichaPath = this.subcollection ?
        `/view-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens/${this.fichaId}` :
        `view/${this.collection}/${this.id}`;
      
      this.router.navigate([fichaPath]);
    }
  }

  /**
   * salvar_collection_anterior()
   * 
   * Parâmetros: N/A.
   * Funcionalidade:
   * - Valida o formulário (FormService.fichaForm).
   * - Converte email para minúsculas (caso exista).
   * - Atualiza o objeto registro com os valores do formulário.
   * - Executa upload de arquivos (se necessário) e, após o upload, chama o serviço
   *   firestoreService.updateRegistro() para persistir as alterações.
   * - Navega para a view do registro após salvar.
   * Retorna: void.
   */
  salvar_collection_anterior() {
    if (this.FormService.fichaForm.valid && this.userId) {
      const formValues = { ...this.FormService.fichaForm.value };
      if (formValues.email) {
        formValues.email = formValues.email.toLowerCase();
      }
      const registroAtualizado = { ...this.FormService.registro, ...formValues };
      if (!this.FormService.registro.id) {
        console.error('Erro: ID do registro está indefinido. Não é possível atualizar o registro.');
        alert('Erro ao atualizar o registro. O ID está indefinido.');
        return;
      }
      const registroPath = `users/${this.userId}/${this.collection}`;
      console.log('registroPath =', registroPath);
      console.log('Tentando salvar o registro:');
      console.log('Atualizando registro no caminho:', registroPath, 'com ID:', this.FormService.registro.id);
      console.log('Dados do registro a serem atualizados:', registroAtualizado);
      const uploadPromises = Object.keys(this.arquivos).map(campoNome => {
        const file = this.arquivos[campoNome];
        const url = prompt('Insira a URL do arquivo ou imagem:');
        return new Promise<void>((resolve) => {
          registroAtualizado[campoNome] = url;
          resolve();
        });
      });
      Promise.all(uploadPromises).then(() => {
        this.firestoreService.updateRegistro(registroPath, this.FormService.registro.id, registroAtualizado)
          .then(() => {
            this.router.navigate([`/view/${this.collection}`, this.FormService.registro.id]);
          })
          .catch(error => {
            console.error('Erro ao salvar o registro:', error);
            alert('Erro ao salvar o registro. Por favor, tente novamente.');
          });
      });
    } else {
      console.error('Registro inválido ou sem ID:', this.FormService.registro);
      alert('Registro inválido ou sem ID. Não é possível salvar.');
    }
  }

  /**
   * verFicha()
   * 
   * Parâmetros: N/A.
   * Funcionalidade:
   * - Define o caminho (rota) para visualizar o registro ou ficha, dependendo de subcollection.
   * - Navega para a rota definida.
   * Retorna: void.
   */
  verFicha() {
    console.log("verFicha()");
    const fichaPath = this.subcollection ?
      `/view-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens/${this.fichaId}` :
      `view/${this.collection}/${this.id}`;
    this.router.navigate([fichaPath]);
  }

  /**
   * voltar()
   * 
   * Parâmetros: N/A.
   * Funcionalidade:
   * - Define a rota de retorno para a visualização do registro.
   * - Navega à rota definida.
   * Retorna: void.
   */
  voltar() {
    // Não faça nova verificação aqui, apenas navegue
    // O guard canDeactivate já se encarrega da confirmação
    this.router.navigate([this.getViewPath()]);
  }

  private getViewPath(): string {
    return this.subcollection ?
      `/view-ficha/${this.collection}/${this.id}/fichas/${this.subcollection}/itens/${this.fichaId}` :
      `view/${this.collection}/${this.id}`;
  }

  /**
   * loadCustomFields()
   * 
   * Parâmetros: N/A.
   * Funcionalidade:
   * - Recria o FormGroup (FormService.fichaForm) para evitar conflitos.
   * - Chama o serviço adequado (camposFichaService para subcollections ou camposService para collections)
   *   para obter os campos personalizados.
   * - Para cada campo, adiciona um controle ao FormGroup com valor padrão (true/false para checkboxes, string para outros).
   * - Atualiza o formulário com os dados existentes e marca formReady como true.
   * Retorna: void.
   */
  loadCustomFields() {
    console.log("loadCustomFields()");
    console.log("this.userId =", this.userId);
    console.log("this.collection =", this.collection);
    console.log("this.subcollection =", this.subcollection);
    if (this.userId) {
      // Recria o FormGroup para evitar conflitos
      this.FormService.fichaForm = new FormGroup({});
      if (this.subcollection) {
        console.log("Carregando campos personalizados (subcollection)...", this.subcollection);
        // Se estiver criando nova ficha, limpar registros armazenados
        if (!this.fichaId) {
          this.FormService.registro = {};
        }
        this.camposFichaService.getCamposFichaRegistro(this.userId, this.subcollection).subscribe(
          (campos: any[]) => {
            const registroData = this.fichaId ? this.FormService.registro : {};
            campos.forEach(campo => {
              // Adicione tipo explícito
              const defaultValue: string | boolean | number | null = this.getFieldDefaultValue(campo);
              this.FormService.fichaForm.addControl(campo.nome, new FormControl(defaultValue));
            });
            // Preenche somente em edição
            if (this.fichaId) {
              this.FormService.fichaForm.patchValue(this.FormService.registro);
            }
            this.formReady = true;
          },
          error => {
            console.error('Erro ao carregar campos personalizados (subcollection):', error);
          }
        );
      } else {
        console.log("Carregando campos personalizados (collection)...", this.collection);
        this.camposService.getCamposRegistro(this.userId, this.collection).subscribe(
          (campos: any[]) => {
            campos.forEach(campo => {
              let defaultValue;
              if (campo.tipo === 'checkbox' || campo.tipo === 'boolean') {
                defaultValue = (this.FormService.registro && this.FormService.registro[campo.nome] !== undefined)
                  ? this.FormService.registro[campo.nome] : false;
              } else {
                defaultValue = (this.FormService.registro && this.FormService.registro[campo.nome])
                  ? this.FormService.registro[campo.nome] : '';
              }
              this.FormService.fichaForm.addControl(campo.nome, new FormControl(defaultValue));
              console.log(`Controle customizado adicionado (collection) para o campo: ${campo.nome}`);
            });
            this.FormService.fichaForm.patchValue(this.FormService.registro);
            this.formReady = true;
          },
          error => {
            console.error('Erro ao carregar campos personalizados (collection):', error);
          }
        );
      }
    }
  }

  /**
   * groupByGrupo()
   * 
   * Agrupa os campos com base na propriedade "grupo".
   * @param campos Array de campos.
   * @returns Objeto onde a chave é o nome do grupo e o valor é o array de campos pertencentes a esse grupo.
   */
  groupByGrupo(campos: any[]): { [key: string]: any[] } {
    return campos.reduce((acc, campo) => {
      const grupo = campo.grupo || '';
      if (!acc[grupo]) {
        acc[grupo] = [];
      }
      acc[grupo].push(campo);
      return acc;
    }, {} as { [key: string]: any[] });
  }

  /**
   * Getter para camposAgrupados, que retorna os campos agrupados por grupo.
   */
  get camposAgrupados(): { [key: string]: any[] } {
    return this.groupByGrupo(this.FormService.campos);
  }

  /**
   * fixedFields (getter)
   * 
   * Funcionalidade:
   * - Retorna os campos fixos, definidos como ['nome', 'data', 'nuvem', 'obs'].
   * Retorna: Array de objetos de campo.
   */
  get fixedFields(): any[] {
    const fixed = ['nome', 'data', 'nuvem', 'obs'];
    return this.FormService.campos.filter(campo => fixed.includes(campo.nome));
  }

  /**
   * adjustableFields (getter)
   * 
   * Funcionalidade:
   * - Retorna os campos que não são fixos.
   * Retorna: Array de objetos de campo.
   */
  get adjustableFields(): any[] {
    return this.FormService.campos.filter(campo => campo.grupo && campo.grupo !== '');
  }

  /**
   * onSubmit()
   * 
   * Parâmetros: N/A.
   * Funcionalidade:
   * - Evento de submit do formulário.
   * - Se o formulário for válido, imprime os dados do formulário para depuração.
   * Retorna: void.
   */
  onSubmit() {
    if (this.FormService.fichaForm.valid) {
      console.log('Dados do formulário:', this.FormService.fichaForm.value);
      // Continuação do fluxo para salvar o registro (pode ser expandido conforme necessidade)
    }
  }


  trackByKey(index: number, item: KeyValue<string, any[]>): string {
    return item.key;
  }

  trackByCampo(index: number, campo: any): string {
    return campo.nome;
  }
  
  // Track by function para subgrupos
  trackBySubgrupo(index: number, item: KeyValue<string, any[]>): string {
    return item.key;
  }
  
  /**
   * Verifica se um grupo contém pelo menos um campo (independente de valor)
   */
  hasFields(campos: any[]): boolean {
    return campos && campos.length > 0;
  }

  /**
   * Verifica se um grupo tem pelo menos um campo válido para exibição
   * No caso de edição, todos os campos são considerados válidos
   */
  hasValidFields(campos: any[]): boolean {
    if (!campos || campos.length === 0) return false;
    return true; // Na edição, todos os campos podem ser editados
  }

  /**
   * Verifica se um subgrupo realmente existe e tem conteúdo
   */
  isValidSubgrupo(subgrupoKey: string): boolean {
    return subgrupoKey !== undefined && subgrupoKey !== null && subgrupoKey.trim() !== '';
  }
  
  private hasUnsavedChanges(): boolean {
    return this.FormService.fichaForm && this.FormService.fichaForm.dirty;
  }

  // Método chamado pelo CanDeactivateGuard
  async canDeactivate(): Promise<boolean> {
    // Só mostrar o diálogo se houver mudanças não salvas
    if (this.hasUnsavedChanges()) {
      // Verificar se o diálogo já foi mostrado nesta navegação
      if (this.dialogAlreadyShown) {
        this.dialogAlreadyShown = false;
        return true;
      }
      
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Sair da edição',
          message: 'Existem alterações não salvas. Deseja realmente sair?',
          confirmText: 'Sim, sair',
          cancelText: 'Não, continuar editando'
        }
      });

      try {
        // Use firstValueFrom para tratar o Observable como Promise
        const result = await firstValueFrom(dialogRef.afterClosed());
        this.dialogAlreadyShown = result === true;
        return result === true;
      } catch (error) {
        console.error('Erro ao processar resultado do diálogo:', error);
        return false;
      }
    }
    return true;
  }
  
  beforeUnloadHandler(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedChanges()) {
      // Previne o fechamento/recarregamento e exibe a mensagem padrão do navegador
      event.preventDefault();
      event.returnValue = 'Existem alterações não salvas!';
    }
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.boundBeforeUnloadHandler);
    // Seu código de destruição existente...
  }
  
  // Adicione underscore aos parâmetros não utilizados
  onAddItem(_file: any) {
    // implementação existente
  }

  // Adicione underscore aos índices não utilizados
  handleCheckboxChange(_index: number, itemCampo: any) {
    if (!itemCampo) return;
    // implementação existente
  }

  handleRadioChange(_index: number, itemCampo: any) {
    if (!itemCampo) return;
    // implementação existente
  }

  handleOptionChange(_index: number, itemCampo: any) {
    if (!itemCampo) return;
    // implementação existente
  }

  // Adicionar este método à classe EditComponent
  private getFieldDefaultValue(campo: any): any {
    // Verificar se o campo tem um valor padrão definido
    if (campo.defaultValue !== undefined) {
      return campo.defaultValue;
    }
    
    // Se não tiver um valor padrão, definir com base no tipo
    switch(campo.tipo) {
      case 'checkbox':
        return false;
      case 'radio':
      case 'select':
        // Para radio/select, retornar a primeira opção, se disponível
        return campo.opcoes && campo.opcoes.length > 0 ? campo.opcoes[0].value : null;
      case 'number':
        return 0;
      case 'text':
      case 'textarea':
      case 'date':
      default:
        return '';
    }
  }
}
