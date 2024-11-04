import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './firestore.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CamposService } from './campos.service';
import { CamposFichaService } from './campos-ficha.service';
import { UtilService } from '../shared/util.service';
import { switchMap, tap } from 'rxjs/operators';
import { formatDate } from '@angular/common';  // Adicione essa importação
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class FormService {

    fichaForm!: FormGroup;
    campos: any[] = []; // Definição dos campos do formulário
    isLoading: boolean = true;
    public registro: any = null; // Dados do registro
    public nome_in_collection: string = '';
    public collection: string = '';
    public subcollection: string = '';

    constructor(
        private firestoreService: FirestoreService<any>,
        private fb: FormBuilder,
        private CamposService: CamposService,
        private CamposFichaService: CamposFichaService,
        private router: Router,
        public util: UtilService,
        private datePipe: DatePipe
    ) { }



    carregarCamposFichas(userId: string, collection: string) {
        return this.CamposFichaService.getCamposRegistro(userId, collection).pipe(
            tap((campos: any[]) => {
                this.campos = campos || [];
                console.log('Campos carregados:', this.campos);
                this.createForm();
            })
        );
    }



    carregarCamposRegistro(userId: string, collection: string) {
        return this.CamposService.getCamposRegistro(userId, collection).pipe(
            tap((campos: any[]) => {
                this.campos = campos || [];
                console.log('Campos carregados:', this.campos);
                this.createForm();
            })
        );
    }



    createForm() {
        console.log('createForm()');

        const formControls = this.campos.reduce((acc, campo) => {
            acc[campo.nome] = new FormControl('');
            return acc;
        }, {});

        // Verifica se o FormGroup foi corretamente criado
        if (Object.keys(formControls).length > 0) {
            this.fichaForm = this.fb.group(formControls);
            console.log('FormGroup criado com sucesso:', this.fichaForm);
            console.log('Formulário criado com os controles:', this.fichaForm.controls);
        } else {
            console.error('Nenhum campo foi adicionado ao FormGroup.');
        }
    }



    loadRegistro(userId: string, collection: string, id: string, view: boolean) {
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

                    // Verifica se o campo é uma data e formata para "yyyy-MM-dd"
                    const formattedData = { ...ficha };
                    for (const key in formattedData) {
                        if (formattedData.hasOwnProperty(key) && this.isDateField(key)) {
                            formattedData[key] = this.formatToDateInput(formattedData[key]);
                        }
                    }

                    // Preenche o FormGroup com os dados formatados
                    this.fichaForm.patchValue(formattedData);

                    if (view) {
                        this.fichaForm.disable();
                        console.log("Formulário desabilitado.");
                    } else {
                        this.fichaForm.enable();
                        console.log("Formulário habilitado.");
                    }

                    this.isLoading = false;
                    console.log('isLoading == false');
                } else {
                    console.error('Ficha não encontrada no caminho:', fichaPath);
                    this.isLoading = false;
                }
            }, error => {
                console.error('Erro ao carregar ficha para edição:', error);
                this.isLoading = false;
            });
        } else {
            console.error('Identificador id não definido corretamente.');
            this.isLoading = false;
        }
    }

    
    // Função auxiliar para verificar se um campo é de data (ajuste conforme necessário)
    private isDateField(fieldName: string): boolean {
        return fieldName === 'nascimento';  // Adicione outros campos de data aqui se necessário
    }


    // Função auxiliar para converter para o formato "yyyy-MM-dd"
    private formatToDateInput(dateString: string): string {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;  // Converte para o formato esperado
    }


    loadFicha(userId: string, collection: string, id: string, subcollection: string, fichaId: string, view: boolean) {
        console.log('loadFicha()');
    
        console.log('userId: ', userId);
        console.log('collection:', collection);
        console.log('id:', id);
        console.log('subcollection: ' + subcollection);
        console.log('fichaId: ' + fichaId);
        console.log('view (visualizar registro): ', view);
    
        if (subcollection && fichaId) {
    
            this.subcollection = subcollection;
    
            const fichaPath = `users/${userId}/${collection}/${id}/fichas/${subcollection}/itens`;
            console.log('Caminho para carregar ficha:', fichaPath);
    
            // Define o formulário como carregando
            this.isLoading = true;
    
            // Carrega os campos do formulário antes de tentar carregar a ficha
            this.carregarCamposFichas(userId, subcollection);
    
            // Carrega os dados da ficha do Firestore
            this.firestoreService.getRegistroById(fichaPath, fichaId).subscribe(ficha => {
                if (ficha) {
                    console.log('Ficha carregada:', ficha);
                    this.registro = ficha;  // Para o view-ficha, se necessário
    
                    // Formata a data de nascimento para 'dd-MM-yyyy'
                    if (ficha.nascimento) {
                        ficha.nascimento = this.datePipe.transform(ficha.nascimento, 'dd-MM-yyyy');
                    }
    
                    // Verifica se os campos foram carregados corretamente antes de preencher o formulário
                    if (this.fichaForm && this.campos.length > 0) {
                        // Preenche o FormGroup com os dados da ficha
                        this.fichaForm.patchValue(ficha); // Preenche o formulário de edição
                    } else {
                        console.error('Formulário ou campos não carregados corretamente.');
                    }
    
                    // Condicional para desabilitar o formulário se estiver na view (visualização)
                    if (view) {
                        this.fichaForm.disable();  // Desabilita o formulário
                        console.log("Formulário desabilitado.");
                    } else {
                        this.fichaForm.enable();  // Habilita o formulário
                        console.log("Formulário habilitado.");
                    }
                    console.log('Estado do formulário (disabled):', this.fichaForm.disabled);  // Deve retornar "true" se estiver desabilitado
    
                    // Marca como carregado (isLoading = false)
                    this.isLoading = false;
                    console.log('isLoading == false');
    
                } else {
                    console.error('Ficha não encontrada no caminho:', fichaPath);
                    this.isLoading = false;
                }
            }, error => {
                console.error('Erro ao carregar ficha para edição:', error);
                this.isLoading = false;
            });
        } else {
            console.error('subcollection ou fichaId não definidos corretamente.');
            this.isLoading = false;
        }
    }


    onFieldChange(event: any, campoNome: string): void {
        console.log(`onFieldChange(event, campoNome = ${campoNome})`);
        console.log(campoNome);
        // Verifica se o formGroup está inicializado e o controle existe
        if (this.fichaForm) {
            console.log('fichaForm controls:', this.fichaForm.controls);
        }

        if (this.fichaForm && this.fichaForm.get(campoNome)) {
            const valorAtual = event.target.value;

            // Capitaliza o valor ou aplica outras transformações
            const valorCapitalizado = this.util.capitalizar(valorAtual);
            console.log("Valor capitalizado:", valorCapitalizado);

            // Atualiza o valor no FormGroup
            this.fichaForm.get(campoNome)?.setValue(valorCapitalizado);
        } else {
            console.error(`O campo ${campoNome} não foi encontrado no FormGroup ou o FormGroup não está pronto.`);
        }
    }



    salvarCollection(userId: string, collection: string, id: string) {

        if (this.fichaForm.valid) {
            const fichaAtualizada = this.fichaForm.value; // Obtém os valores do formulário
            const fichaPath = `users/${userId}/${collection}`;
            const fichaRoute = `/view/${collection}`;

            console.log('Caminho para salvar a ficha:', fichaPath);
            console.log('id da coleção:', id);
            console.log('Dados da ficha a serem salvos:', fichaAtualizada);

            // this.firestore.collection(fichaPath).add(fichaAtualizada).then(docRef => {
            //     console.log('Nova ficha criada com sucesso com ID:', docRef.id);
            //     this.router.navigate([`/view-ficha/${collection}/${id}/fichas/${subcollection}/itens/${docRef.id}`]);
            // }).catch(error => {
            //     console.error('Erro ao criar nova ficha:', error);
            // });

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
