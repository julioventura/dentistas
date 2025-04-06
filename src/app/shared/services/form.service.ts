/**
 * FormService
 * 
 * Métodos:
 * 1. carregarCamposFichas: Carrega os campos personalizados para uma ficha (subcollection) por meio do CamposFichaService e invoca createForm().
 * 2. carregarCamposRegistro: Carrega os campos personalizados para o registro principal de uma coleção usando o CamposService e invoca createForm().
 * 3. createForm: Cria ou atualiza o FormGroup (fichaForm) com base na definição dos campos carregados.
 * 4. loadRegistro: Carrega do Firestore os dados do registro principal, formata campos de data, adiciona controles dinâmicos e preenche o FormGroup.
 * 5. loadFicha: Carrega os dados de uma ficha interna (subcollection) do Firestore, aplica formatação em campos de data, adiciona campos faltantes e preenche o FormGroup.
 * 6. onFieldChange: Processa a mudança de valor em um campo do formulário, aplicando transformações (como capitalização) e atualizando o controle.
 * 7. salvarCollection: Salva alterações no registro principal do Firestore, validando o formulário e atualizando os dados.
 * 8. salvarSubcollection: Salva as alterações de uma ficha interna (subcollection) no Firestore após validação do formulário.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './firestore.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CamposService } from '../services/campos.service';
import { CamposFichaService } from '../services/campos-ficha.service';
import { UtilService } from '../utils/util.service';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    fichaForm!: FormGroup; // FormGroup que armazena os controles do formulário dinâmico
    campos: any[] = []; // Vetor que contém a definição dos campos a serem exibidos no formulário
    isLoading: boolean = true; // Flag indicando o estado de carregamento dos dados
    public registro: any = null; // Registro carregado do Firestore
    public nome_in_collection: string = ''; // Nome extraído do registro, usado na interface
    public collection: string = '';
    public subcollection: string = '';
    camposNaoAgrupados: any[] = [];
    gruposCampos: { [key: string]: any[] } = {};

    constructor(
        private firestoreService: FirestoreService<any>,
        private fb: FormBuilder,
        private camposService: CamposService,
        private camposFichaService: CamposFichaService,
        private router: Router,
        public util: UtilService
    ) { }

    /**
     * carregarCamposFichas(userId: string, subcollection: string)
     * 
     * Parâmetros:
     * - userId: string - ID do usuário autenticado.
     * - subcollection: string - Nome da subcollection.
     * Funcionalidade:
     * - Carrega os campos personalizados para uma ficha (subcollection) por meio do CamposFichaService.
     * - Invoca createForm() para criar ou atualizar o FormGroup.
     * Retorna: Observable<any[]>.
     */
    carregarCamposFichas(userId: string, subcollection: string) {
        return this.camposFichaService.getCamposFichaRegistro(userId, subcollection).pipe(
            tap((campos: any[]) => {
                this.campos = campos || [];
                console.log('Ficha carregada. Subcollection =', subcollection);
                console.log('Campos carregados:', this.campos);
                this.createForm();
            })
        );
    }

    /**
     * carregarCamposRegistro(userId: string, collection: string)
     * 
     * Parâmetros:
     * - userId: string - ID do usuário autenticado.
     * - collection: string - Nome da coleção.
     * Funcionalidade:
     * - Carrega os campos personalizados para o registro principal de uma coleção usando o CamposService.
     * - Invoca createForm() para criar ou atualizar o FormGroup.
     * Retorna: Observable<any[]>.
     */
    carregarCamposRegistro(userId: string, collection: string) {
        return this.camposService.getCamposRegistro(userId, collection).pipe(
            tap((campos: any[]) => {
                this.campos = campos || [];
                console.log('Ficha carregada. Collection =', collection);
                console.log('Campos carregados:', this.campos);
                this.createForm();
            })
        );
    }

    /**
     * createForm()
     * 
     * Parâmetros: N/A.
     * Funcionalidade:
     * - Cria ou atualiza o FormGroup (fichaForm) com base na definição dos campos carregados.
     * - Adiciona controles dinâmicos para os campos ausentes.
     * Retorna: void.
     */
    createForm() {
        console.log('createForm()');
        if (!this.fichaForm) {
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
            this.campos.forEach(campo => {
                if (!this.fichaForm.contains(campo.nome)) {
                    let defaultValue;
                    if (campo.tipo === 'checkbox' || campo.tipo === 'boolean') {
                        defaultValue = (this.registro && this.registro[campo.nome] !== undefined) ? this.registro[campo.nome] : false;
                    } else {
                        defaultValue = (this.registro && this.registro[campo.nome]) ? this.registro[campo.nome] : '';
                    }
                    this.fichaForm.addControl(campo.nome, new FormControl(defaultValue));
                }
            });
        }
    }

    /**
     * loadRegistro(userId: string, collection: string, id: string, view_only: boolean): Promise<void>
     * 
     * Parâmetros:
     * - userId: string - ID do usuário autenticado.
     * - collection: string - Nome da coleção.
     * - id: string - ID do registro.
     * - view_only: boolean - Indica se o formulário deve ser apenas visualizado (readonly).
     * Funcionalidade:
     * - Carrega do Firestore os dados do registro principal.
     * - Formata campos de data, adiciona controles dinâmicos e preenche o FormGroup.
     * Retorna: Promise<void>.
     */
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

                        // Separar campos por grupo
                        this.camposNaoAgrupados = this.campos.filter(campo => !campo.grupo || campo.grupo === '');
                        
                        // Agrupar campos por grupo
                        this.gruposCampos = {};
                        this.campos
                          .filter(campo => campo.grupo && campo.grupo !== '')
                          .forEach(campo => {
                            if (!this.gruposCampos[campo.grupo]) {
                              this.gruposCampos[campo.grupo] = [];
                            }
                            this.gruposCampos[campo.grupo].push(campo);
                          });

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

    /**
     * addDynamicFields(data: any)
     * 
     * Parâmetros:
     * - data: any - Dados do registro carregado.
     * Funcionalidade:
     * - Adiciona controles dinâmicos ao formulário para quaisquer campos que não estejam previamente definidos.
     * Retorna: void.
     */
    private addDynamicFields(data: any) {
        for (const key in data) {
            if (data.hasOwnProperty(key) && !this.fichaForm.contains(key)) {
                this.fichaForm.addControl(key, new FormControl(''));
            }
        }
    }

    /**
     * isDateField(fieldName: string): boolean
     * 
     * Parâmetros:
     * - fieldName: string - Nome do campo.
     * Funcionalidade:
     * - Verifica se o nome do campo corresponde a um campo de data (ex.: 'nascimento').
     * Retorna: boolean.
     */
    private isDateField(fieldName: string): boolean {
        return fieldName === 'nascimento';
    }

    /**
     * formatToDateInput(dateString: string): string | null
     * 
     * Parâmetros:
     * - dateString: string - Data no formato dd/MM/yyyy.
     * Funcionalidade:
     * - Converte uma data do formato dd/MM/yyyy para yyyy-MM-dd, para uso em inputs de data.
     * Retorna: string | null.
     */
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

    /**
     * loadFicha(userId: string, collection: string, id: string, subcollection: string, fichaId: string, view_only: boolean): Promise<void>
     * 
     * Parâmetros:
     * - userId: string - ID do usuário autenticado.
     * - collection: string - Nome da coleção.
     * - id: string - ID do registro principal.
     * - subcollection: string - Nome da subcollection.
     * - fichaId: string - ID da ficha interna.
     * - view_only: boolean - Indica se o formulário deve ser apenas visualizado (readonly).
     * Funcionalidade:
     * - Carrega os dados de uma ficha interna (subcollection) do Firestore.
     * - Aplica formatação em campos de data, adiciona campos faltantes e preenche o FormGroup.
     * Retorna: Promise<void>.
     */
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

    /**
     * onFieldChange(event: any, campoNome: string): void
     * 
     * Parâmetros:
     * - event: any - Evento de mudança de valor no campo.
     * - campoNome: string - Nome do campo.
     * Funcionalidade:
     * - Processa a mudança de valor em um campo do formulário.
     * - Aplica transformações (como capitalização) e atualiza o controle.
     * Retorna: void.
     */
    onFieldChange(event: any, campoNome: string): void {
        console.log(`onFieldChange(event, campoNome = ${campoNome})`);
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

    /**
     * salvarCollection(userId: string, collection: string, id: string)
     * 
     * Parâmetros:
     * - userId: string - ID do usuário autenticado.
     * - collection: string - Nome da coleção.
     * - id: string - ID do registro.
     * Funcionalidade:
     * - Salva alterações no registro principal do Firestore, validando o formulário e atualizando os dados.
     * Retorna: void.
     */
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

    /**
     * salvarSubcollection(userId: string, collection: string, id: string, subcollection: string, fichaId: string)
     * 
     * Parâmetros:
     * - userId: string - ID do usuário autenticado.
     * - collection: string - Nome da coleção.
     * - id: string - ID do registro principal.
     * - subcollection: string - Nome da subcollection.
     * - fichaId: string - ID da ficha interna.
     * Funcionalidade:
     * - Salva as alterações de uma ficha interna (subcollection) no Firestore após validação do formulário.
     * Retorna: void.
     */
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
