/* 
  Métodos do service FormService:
  1. carregarCamposFichas(userId: string, subcollection: string): Observable<any[]>
     - Carrega os campos personalizados para uma ficha (subcollection) por meio do CamposFichaService e invoca createForm().
  2. carregarCamposRegistro(userId: string, collection: string): Observable<any[]>
     - Carrega os campos personalizados para o registro principal de uma coleção usando o CamposService e invoca createForm().
  3. createForm(): void
     - Cria ou atualiza o FormGroup (fichaForm) com base na definição dos campos carregados.
  4. loadRegistro(userId: string, collection: string, id: string, view_only: boolean): Promise<void>
     - Carrega do Firestore os dados do registro principal, formata campos de data, adiciona controles dinâmicos e preenche o FormGroup.
  5. loadFicha(userId: string, collection: string, id: string, subcollection: string, fichaId: string, view_only: boolean): Promise<void>
     - Carrega os dados de uma ficha interna (subcollection) do Firestore, aplica formatação em campos de data, adiciona campos faltantes e preenche o FormGroup.
  6. onFieldChange(event: any, campoNome: string): void
     - Processa a mudança de valor em um campo do formulário, aplicando transformações (como capitalização) e atualizando o controle.
  7. salvarCollection(userId: string, collection: string, id: string): void
     - Salva alterações no registro principal do Firestore, validando o formulário e atualizando os dados.
  8. salvarSubcollection(userId: string, collection: string, id: string, subcollection: string, fichaId: string): void
     - Salva as alterações de uma ficha interna (subcollection) no Firestore após validação do formulário.
*/

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './firestore.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CamposService } from './campos.service';
import { CamposFichaService } from './campos-ficha.service';
import { UtilService } from '../shared/utils/util.service';
import { switchMap, tap } from 'rxjs/operators';
import { Campo } from './models/campo.model';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    // FormGroup que armazena os controles do formulário dinâmico
    fichaForm!: FormGroup;
    // Vetor que contem a definição dos campos a serem exibidos no formulário
    campos: any[] = [];
    // Flag indicando o estado de carregamento dos dados
    isLoading: boolean = true;
    // Registro carregado do Firestore
    public registro: any = null;
    // Nome extraído do registro, usado na interface
    public nome_in_collection: string = '';
    public collection: string = '';
    public subcollection: string = '';

    constructor(
        private firestoreService: FirestoreService<any>,
        private fb: FormBuilder,
        private camposService: CamposService,
        private camposFichaService: CamposFichaService,
        private router: Router,
        public util: UtilService
    ) { 
        // Injeção de dependências e inicialização do serviço
    }

    // Carrega os campos da ficha (subcollection) e cria/atualiza o formulário
    carregarCamposFichas(userId: string, subcollection: string) {
        return this.camposFichaService.getCamposFichaRegistro(userId, subcollection).pipe(
            tap((campos: any[]) => {
                this.campos = campos || [];
                console.log('Campos carregados:', this.campos);
                this.createForm();
            })
        );
    }

    // Carrega os campos do registro principal para a collection e cria/atualiza o formulário
    carregarCamposRegistro(userId: string, collection: string) {
        return this.camposService.getCamposRegistro(userId, collection).pipe(
            tap((campos: any[]) => {
                this.campos = campos || [];
                console.log('Campos carregados:', this.campos);
                this.createForm();
            })
        );
    }

    // Cria ou atualiza o FormGroup com os controles definidos nos campos carregados
    createForm() {
        console.log('createForm()');
        if (!this.fichaForm) {
          // Cria controles a partir de cada campo
          const formControls = this.campos.reduce((acc, campo) => {
            let defaultValue;
            if (campo.tipo === 'checkbox' || campo.tipo === 'boolean') {
              defaultValue = (this.registro && this.registro[campo.nome] !== undefined) ? this.registro[campo.nome] : false;
            } else {
              defaultValue = (this.registro && this.registro[campo.nome]) ? this.registro[campo.nome] : '';
            }
            acc[campo.nome] = new FormControl(defaultValue);
            return acc;
          }, {} as { [key: string]: any });
          if (Object.keys(formControls).length > 0) {
            this.fichaForm = this.fb.group(formControls);
            console.log('FormGroup criado com sucesso:', this.fichaForm);
          } else {
            console.error('Nenhum campo foi adicionado ao FormGroup.');
          }
        } else {
          // Se o FormGroup já existe, adiciona controles dinâmicos para os campos ausentes
          this.campos.forEach(campo => {
            if (!this.fichaForm.contains(campo.nome)) {
              let defaultValue;
              if (campo.tipo === 'checkbox' || campo.tipo === 'boolean') {
                defaultValue = (this.registro && this.registro[campo.nome] !== undefined) ? this.registro[campo.nome] : false;
              } else {
                defaultValue = (this.registro && this.registro[campo.nome]) ? this.registro[campo.nome] : '';
              }
              this.fichaForm.addControl(campo.nome, new FormControl(defaultValue));
              console.log(`Controle customizado adicionado para o campo: ${campo.nome}`);
            }
          });
        }
      }

    // Carrega os dados de um registro principal; formata datas, adiciona controles dinâmicos e atualiza o FormGroup
    loadRegistro(userId: string, collection: string, id: string, view_only: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('loadRegistro()');
            this.collection = collection;
            this.isLoading = true;

            if (userId && collection && id) {
                const fichaPath = `users/${userId}/${collection}`;
                console.log('Caminho para carregar ficha:', fichaPath);
                this.carregarCamposRegistro(userId, collection).pipe(
                    switchMap(() => this.firestoreService.getRegistroById(fichaPath, id))
                ).subscribe(ficha => {
                    if (ficha) {
                        console.log('Ficha carregada:', ficha);
                        this.registro = ficha;
                        this.nome_in_collection = this.registro.nome;

                        // Realiza a formatação dos campos de data, se necessário
                        const formattedData = { ...ficha };
                        for (const key in formattedData) {
                            if (formattedData.hasOwnProperty(key) && this.isDateField(key)) {
                                const formattedDate = this.formatToDateInput(formattedData[key]);
                                formattedData[key] = formattedDate ? formattedDate : formattedData[key];
                            }
                        }

                        // Adiciona controles para campos não definidos inicialmente e preenche o formulário
                        this.addDynamicFields(formattedData);
                        this.fichaForm.patchValue(formattedData);

                        // Se for somente visualização, desabilita o formulário
                        if (view_only) {
                            this.fichaForm.disable();
                            console.log("Formulário desabilitado.");
                        } else {
                            this.fichaForm.enable();
                            console.log("Formulário habilitado.");
                        }

                        this.isLoading = false;
                        console.log('isLoading == false');
                        resolve();
                    } else {
                        console.error('Ficha não encontrada no caminho:', fichaPath);
                        this.isLoading = false;
                        reject('Ficha não encontrada');
                    }
                }, error => {
                    console.error('Erro ao carregar ficha para edição:', error);
                    this.isLoading = false;
                    reject(error);
                });
            } else {
                console.error('Identificador id não definido corretamente.');
                this.isLoading = false;
                reject('Identificador id não definido corretamente');
            }
        });
    }

    // Adiciona controles dinâmicos ao formulário para quaisquer campos que não estejam previamente definidos
    private addDynamicFields(data: any) {
        for (const key in data) {
            if (data.hasOwnProperty(key) && !this.fichaForm.contains(key)) {
                this.fichaForm.addControl(key, new FormControl(''));
            }
        }
    }

    // Verifica se o nome do campo corresponde a um campo de data (ex.: 'nascimento')
    private isDateField(fieldName: string): boolean {
        return fieldName === 'nascimento';
    }

    // Converte uma data do formato dd/MM/yyyy para yyyy-MM-dd, para uso em inputs de data
    private formatToDateInput(dateString: string): string | null {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(dateRegex);
        if (match) {
            const day = match[1];
            const month = match[2];
            const year = match[3];
            return `${year}-${month}-${day}`;
        }
        return null;
    }

    // Carrega os dados de uma ficha (subcollection); formata datas e atualiza o FormGroup com controles dinâmicos
    loadFicha(userId: string, collection: string, id: string, subcollection: string, fichaId: string, view_only: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('loadFicha()');
            console.log('userId: ', userId);
            console.log('collection:', collection);
            console.log('id:', id);
            console.log('subcollection:', subcollection);
            console.log('fichaId:', fichaId);
            console.log('view (visualizar registro): ', view_only);

            if (subcollection && fichaId) {
                this.subcollection = subcollection;
                const fichaPath = `users/${userId}/${collection}/${id}/fichas/${subcollection}/itens`;
                console.log('Caminho para carregar ficha:', fichaPath);
                this.isLoading = true;
                this.carregarCamposFichas(userId, subcollection).subscribe(() => {
                    this.firestoreService.getRegistroById(fichaPath, fichaId).subscribe(ficha => {
                        if (ficha) {
                            console.log('Ficha carregada:', ficha);
                            this.registro = ficha;
                            const formattedData = { ...ficha };
                            for (const key in formattedData) {
                                if (formattedData.hasOwnProperty(key) && this.isDateField(key)) {
                                    const formattedDate = this.formatToDateInput(formattedData[key]);
                                    formattedData[key] = formattedDate ? formattedDate : formattedData[key];
                                }
                            }
                            this.addDynamicFields(formattedData);
                            this.fichaForm.patchValue(formattedData);

                            if (view_only) {
                                this.fichaForm.disable();
                                console.log("Formulário desabilitado.");
                            } else {
                                this.fichaForm.enable();
                                console.log("Formulário habilitado.");
                            }
                            console.log('Estado do formulário (disabled):', this.fichaForm.disabled);
                            this.isLoading = false;
                            console.log('isLoading == false');
                            resolve();
                        } else {
                            this.isLoading = false;
                            reject('Ficha não encontrada');
                        }
                    }, error => {
                        console.error('Erro ao carregar ficha para edição:', error);
                        this.isLoading = false;
                        reject(error);
                    });
                });
            } else {
                console.error('subcollection ou fichaId não definidos corretamente.');
                this.isLoading = false;
                reject('subcollection ou fichaId não definidos corretamente');
            }
        });
    }

    // Processa alterações em um campo do formulário, aplicando capitalização para campos de texto e atualizando o controle
    onFieldChange(event: any, campoNome: string): void {
        console.log(`onFieldChange(event, campoNome = ${campoNome})`);
        // Se o input for do tipo checkbox, use o valor booleano e não aplique capitalização
        if (event.target && event.target.type === 'checkbox') {
            this.fichaForm.get(campoNome)?.setValue(event.target.checked);
            return;
        }
        if (this.fichaForm && this.fichaForm.get(campoNome)) {
            const valorAtual = event.target.value;
            const valorCapitalizado = this.util.capitalizar(valorAtual);
            console.log("Valor capitalizado:", valorCapitalizado);
            this.fichaForm.get(campoNome)?.setValue(valorCapitalizado);
        } else {
            console.error(`O campo ${campoNome} não foi encontrado no FormGroup ou o FormGroup não está pronto.`);
        }
    }

    // Salva as alterações do registro principal no Firestore se o formulário for válido
    salvarCollection(userId: string, collection: string, id: string) {
        if (this.fichaForm.valid) {
            const fichaAtualizada = this.fichaForm.value;
            const fichaPath = `users/${userId}/${collection}`;
            const fichaRoute = `/view/${collection}`;
            console.log('Caminho para salvar a ficha:', fichaPath);
            console.log('id da coleção:', id);
            console.log('Dados da ficha a serem salvos:', fichaAtualizada);
            if (id) {
                this.firestoreService.updateRegistro(fichaPath, id, fichaAtualizada).then(() => {
                    console.log('Ficha atualizada com sucesso');
                    this.router.navigate([`fichaRoute/${id}`]);
                }).catch(error => {
                    console.error('Erro ao atualizar a ficha:', error);
                });
            }
        }
    }

    // Salva alterações na ficha (subcollection) no Firestore se o formulário for válido
    salvarSubcollection(userId: string, collection: string, id: string, subcollection: string, fichaId: string) {
        if (this.fichaForm.valid) {
            const fichaAtualizada = this.fichaForm.value;
            const fichaPath = `users/${userId}/${collection}/${id}/fichas/${subcollection}/itens`;
            const fichaRoute = `/view-ficha/${collection}/${id}/fichas/${subcollection}/itens`;
            console.log('fichaPath - Caminho para salvar a ficha:', fichaPath);
            console.log('fichaRoute - Caminho para acessar a ficha:', fichaRoute);
            console.log('ID da ficha:', fichaId);
            console.log('Dados da ficha a serem salvos:', fichaAtualizada);
            if (fichaId) {
                this.firestoreService.updateRegistro(fichaPath, fichaId, fichaAtualizada).then(() => {
                    console.log('Ficha atualizada com sucesso');
                    this.router.navigate([`${fichaRoute}/${fichaId}`]);
                }).catch(error => {
                    console.error('Erro ao atualizar a ficha:', error);
                });
            }
        } else {
            console.error('Formulário inválido. Verifique os campos obrigatórios.');
            console.log('Estado atual do formulário:', this.fichaForm.status);
            console.log('Erros no formulário:', this.fichaForm.errors);
        }
    }
}
