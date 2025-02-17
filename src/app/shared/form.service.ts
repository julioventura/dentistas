import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './firestore.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CamposService } from './campos.service';
import { CamposFichaService } from './campos-ficha.service';
import { UtilService } from '../shared/utils/util.service';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    // Propriedades do serviço para armazenar o formulário dinâmico,
    // os campos a serem exibidos, bem como o estado do registro carregado.
    fichaForm!: FormGroup;
    campos: any[] = []; // Armazena a definição dos campos do formulário
    isLoading: boolean = true; // Flag que indica se os dados estão sendo carregados
    public registro: any = null; // Armazena os dados do registro carregado
    public nome_in_collection: string = ''; // Armazena o nome recebido do registro para exibir na interface
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
        // Construtor injetando as dependências necessárias: acesso ao Firestore, criação de formulários,
        // serviços para obtenção dos campos e utilidades, entre outros.
    }

    // Método para carregar os campos da ficha (subcollection) e criar o formulário a partir deles.
    carregarCamposFichas(userId: string, subcollection: string) {
        return this.camposFichaService.getCamposFichaRegistro(userId, subcollection).pipe(
            tap((campos: any[]) => {
                this.campos = campos || [];
                console.log('Campos carregados:', this.campos);
                this.createForm();
            })
        );
    }

    // Método semelhante ao carregarCamposFichas, mas para a collection principal.
    carregarCamposRegistro(userId: string, collection: string) {
        return this.camposService.getCamposRegistro(userId, collection).pipe(
            tap((campos: any[]) => {
                this.campos = campos || [];
                console.log('Campos carregados:', this.campos);
                this.createForm();
            })
        );
    }

    // Cria ou atualiza o FormGroup com base na definição dos campos carregados.
    createForm() {
        console.log('createForm()');
        
        if (!this.fichaForm) {
            // Cria o FormGroup inicialmente com todos os controles.
            const formControls = this.campos.reduce((acc, campo) => {
                acc[campo.nome] = new FormControl('');
                return acc;
            }, {});
            if (Object.keys(formControls).length > 0) {
                this.fichaForm = this.fb.group(formControls);
                console.log('FormGroup criado com sucesso:', this.fichaForm);
            } else {
                console.error('Nenhum campo foi adicionado ao FormGroup.');
            }
        } else {
            // Se o FormGroup já existe, adiciona controles para novos campos.
            this.campos.forEach(campo => {
                if (!this.fichaForm.contains(campo.nome)) {
                    this.fichaForm.addControl(campo.nome, new FormControl(''));
                    // console.log(`Controle adicionado para o campo: ${campo.nome}`);
                }
            });
        }
    }

    // Método que carrega os dados do registro principal da collection.
    // Retorna uma Promise que permite encadear ações após o carregamento.
    loadRegistro(userId: string, collection: string, id: string, view_only: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('loadRegistro()');

            // Armazena a collection e define o estado de carregamento.
            this.collection = collection;
            this.isLoading = true;

            if (userId && collection && id) {
                // Define o caminho no Firestore para a collection principal.
                const fichaPath = `users/${userId}/${collection}`;
                console.log('Caminho para carregar ficha:', fichaPath);

                // Primeiro carrega os campos do registro e, em seguida, faz a consulta ao Firestore.
                this.carregarCamposRegistro(userId, collection).pipe(
                    switchMap(() => this.firestoreService.getRegistroById(fichaPath, id))
                ).subscribe(ficha => {
                    if (ficha) {
                        console.log('Ficha carregada:', ficha);
                        // Armazena o registro e extrai o nome para exibir posteriormente.
                        this.registro = ficha;
                        this.nome_in_collection = this.registro.nome;

                        // Realiza formatação para campos de data, se necessário.
                        const formattedData = { ...ficha };
                        for (const key in formattedData) {
                            if (formattedData.hasOwnProperty(key) && this.isDateField(key)) {
                                const formattedDate = this.formatToDateInput(formattedData[key]);
                                formattedData[key] = formattedDate ? formattedDate : formattedData[key];
                            }
                        }

                        // Adiciona campos dinâmicos ao formulário caso não estejam previamente definidos.
                        this.addDynamicFields(formattedData);
                        // Preenche o formulário com os dados carregados.
                        this.fichaForm.patchValue(formattedData);

                        // Desabilita o formulário se for somente visualização; caso contrário, habilita.
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

    // Função auxiliar para adicionar controles dinâmicos ao formulário para campos não definidos inicialmente.
    private addDynamicFields(data: any) {
        for (const key in data) {
            if (data.hasOwnProperty(key) && !this.fichaForm.contains(key)) {
                this.fichaForm.addControl(key, new FormControl(''));
            }
        }
    }

    // Verifica se o nome do campo corresponde a um campo de data.
    // Pode ser expandido para incluir outros campos além de 'nascimento'.
    private isDateField(fieldName: string): boolean {
        return fieldName === 'nascimento';  // Adicione outros campos de data aqui se necessário
    }

    // Converte uma data no formato dd/MM/yyyy para o formato yyyy-MM-dd, adequado para inputs de data.
    private formatToDateInput(dateString: string): string | null {
        // Verifica se a data está no formato dd/MM/yyyy
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(dateRegex);

        if (match) {
            const day = match[1];
            const month = match[2];
            const year = match[3];
            return `${year}-${month}-${day}`; // Formato yyyy-MM-dd
        }

        // Retorna null se o formato da data não for reconhecido
        return null;
    }

    // Método para carregar os dados de uma ficha (subcollection) específica.
    // Retorna uma Promise para possibilitar ações after load.
    loadFicha(userId: string, collection: string, id: string, subcollection: string, fichaId: string, view_only: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('loadFicha()');

            console.log('userId: ', userId);
            console.log('collection:', collection);
            console.log('id:', id);
            console.log('subcollection: ' + subcollection);
            console.log('fichaId: ' + fichaId);
            console.log('view (visualizar registro): ', view_only);

            // Verifica se os parâmetros de subcollection e fichaId foram informados.
            if (subcollection && fichaId) {
                this.subcollection = subcollection;

                // Define o caminho para acessar a ficha dentro da subcollection.
                const fichaPath = `users/${userId}/${collection}/${id}/fichas/${subcollection}/itens`;
                console.log('Caminho para carregar ficha:', fichaPath);

                // Define o carregamento do formulário.
                this.isLoading = true;

                // Primeiro carrega os campos específicos da ficha (subcollection).
                this.carregarCamposFichas(userId, subcollection).subscribe(() => {
                    // Realiza a consulta ao Firestore para obter os dados da ficha.
                    this.firestoreService.getRegistroById(fichaPath, fichaId).subscribe(ficha => {
                        if (ficha) {
                            console.log('Ficha carregada:', ficha);
                            // Armazena o registro carregado para utilização futura.
                            this.registro = ficha;

                            // Formata os campos de data e adiciona campos dinâmicos se necessário.
                            const formattedData = { ...ficha };
                            for (const key in formattedData) {
                                if (formattedData.hasOwnProperty(key) && this.isDateField(key)) {
                                    const formattedDate = this.formatToDateInput(formattedData[key]);
                                    formattedData[key] = formattedDate ? formattedDate : formattedData[key];
                                }
                            }

                            // Adiciona controles dinâmicos e preenche o FormGroup com os dados da ficha.
                            this.addDynamicFields(formattedData);
                            this.fichaForm.patchValue(formattedData);

                            // Desabilita o formulário se for apenas visualização.
                            if (view_only) {
                                this.fichaForm.disable();
                                console.log("Formulário desabilitado.");
                            } else {
                                this.fichaForm.enable();
                                console.log("Formulário habilitado.");
                            }
                            console.log('Estado do formulário (disabled):', this.fichaForm.disabled);

                            // Carregamento concluído.
                            this.isLoading = false;
                            console.log('isLoading == false');
                            resolve();
                        } else {
                            // console.error('Ficha não encontrada no caminho:', fichaPath);
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

    // Função de callback para tratar mudanças em um campo específico do formulário.
    // Realiza transformações, como a capitalização do valor, e atualiza o controle do FormGroup.
    onFieldChange(event: any, campoNome: string): void {
        console.log(`onFieldChange(event, campoNome = ${campoNome})`);
        console.log(campoNome);
        // Verifica e loga os controles atuais do formulário.
        if (this.fichaForm) {
            console.log('fichaForm controls:', this.fichaForm.controls);
        }

        if (this.fichaForm && this.fichaForm.get(campoNome)) {
            const valorAtual = event.target.value;

            // Aplica transformação (capitalização) no valor recebido.
            const valorCapitalizado = this.util.capitalizar(valorAtual);
            console.log("Valor capitalizado:", valorCapitalizado);

            // Atualiza o valor do campo no FormGroup.
            this.fichaForm.get(campoNome)?.setValue(valorCapitalizado);
        } else {
            console.error(`O campo ${campoNome} não foi encontrado no FormGroup ou o FormGroup não está pronto.`);
        }
    }

    // Método para salvar as alterações na collection principal.
    // Verifica se o formulário é válido e atualiza o registro no Firestore.
    salvarCollection(userId: string, collection: string, id: string) {
        if (this.fichaForm.valid) {
            const fichaAtualizada = this.fichaForm.value; // Obtém os valores do formulário
            const fichaPath = `users/${userId}/${collection}`;
            const fichaRoute = `/view/${collection}`;

            console.log('Caminho para salvar a ficha:', fichaPath);
            console.log('id da coleção:', id);
            console.log('Dados da ficha a serem salvos:', fichaAtualizada);

            // Exemplo comentado de criação de nova ficha.
            // ...existing code...

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

    // Método para salvar alterações em uma subcollection (ficha interna).
    // Opera de forma análoga ao salvarCollection, ajustando o caminho e a rota.
    salvarSubcollection(userId: string, collection: string, id: string, subcollection: string, fichaId: string) {
        if (this.fichaForm.valid) {
            const fichaAtualizada = this.fichaForm.value; // Obtém os valores do formulário
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
