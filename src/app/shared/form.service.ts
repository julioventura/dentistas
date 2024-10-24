import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreService } from './firestore.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CamposService } from './campos.service';
import { CamposFichaService } from './campos-ficha.service';
import { UtilService } from '../shared/util.service';

@Injectable({
    providedIn: 'root'
})

export class FormService {

    fichaForm!: FormGroup;
    campos: any[] = [];
    isLoading = true;
    public registro: any = null;
    public id_nome_collected: string = ' ';

    constructor(
        private firestore: AngularFirestore,
        private firestoreService: FirestoreService<any>,
        private fb: FormBuilder,
        private CamposService: CamposService,
        private CamposFichaService: CamposFichaService,
        private router: Router,
        public util: UtilService,

    ) { }

    carregarCamposFichas(userId: string, collection: string) {
        this.CamposFichaService.getCamposRegistro(userId, collection).subscribe((campos: any[]) => {
            this.campos = campos || [];
            console.log('Campos carregados:', this.campos);

            // Chama o método para criar o FormGroup APÓS carregar os campos
            this.createForm();
        });
    }


    carregarCamposRegistro(userId: string, collection: string) {
        this.CamposService.getCamposRegistro(userId, collection).subscribe((campos: any[]) => {
            this.campos = campos || [];
            console.log('Campos carregados:', this.campos);

            // Chama o método para criar o FormGroup APÓS carregar os campos
            this.createForm();
        });
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

        console.log('userId: ', userId);
        console.log('Collection: ', collection);
        console.log('ID: ', id);
        console.log('view (visualizar registro): ', view);

        if (id) {

            const fichaPath = `users/${userId}/${collection}`;
            console.log('Caminho para carregar ficha:', fichaPath);

            // Define o formulário como carregando
            this.isLoading = true;

            // Carrega os campos do formulário antes de tentar carregar a ficha
            this.carregarCamposRegistro(userId, collection);

            // Carrega os dados da ficha do Firestore
            this.firestoreService.getRegistroById(fichaPath, id).subscribe(ficha => {
                if (ficha) {
                    console.log('Ficha carregada:', ficha);
                    this.registro = ficha;  // Para o view-ficha, se necessário

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
                    Object.keys(this.fichaForm.controls).forEach(campoNome => {
                        console.log(`Campo ${campoNome} está desabilitado:`, this.fichaForm.get(campoNome)?.disabled);
                    });

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
            console.error('Identificador id não definido corretamente.');
            this.isLoading = false;
        }
    }


    loadFicha(userId: string, collection: string, id: string, subCollection: string, fichaId: string, view: boolean) {
        console.log('loadFicha()');

        console.log('userId: ', userId);
        console.log('Collection:', collection);
        console.log('ID:', id);
        console.log('subCollection: ' + subCollection);
        console.log('fichaId: ' + fichaId);
        console.log('view (visualizar registro): ', view);

        if (subCollection && fichaId) {

            const fichaPath = `users/${userId}/${collection}/${id}/fichas/${subCollection}/itens`;
            console.log('Caminho para carregar ficha:', fichaPath);

            // Define o formulário como carregando
            this.isLoading = true;

            // Carrega os campos do formulário antes de tentar carregar a ficha
            this.carregarCamposFichas(userId, subCollection);

            // Carrega os dados da ficha do Firestore
            this.firestoreService.getRegistroById(fichaPath, fichaId).subscribe(ficha => {
                if (ficha) {
                    console.log('Ficha carregada:', ficha);
                    this.registro = ficha;  // Para o view-ficha, se necessário

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
                    Object.keys(this.fichaForm.controls).forEach(campoNome => {
                        console.log(`Campo ${campoNome} está desabilitado:`, this.fichaForm.get(campoNome)?.disabled);
                    });

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
            console.error('subCollection ou fichaId não definidos corretamente.');
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



    salvar(userId: string, collection: string, id: string, subCollection: string, fichaId: string) {

        if (this.fichaForm.valid) {
            const fichaAtualizada = this.fichaForm.value; // Obtém os valores do formulário
            const fichaPath = `users/${userId}/${collection}/${id}/fichas/${subCollection}/itens`;

            if (fichaId) {
                // Atualiza uma ficha existente
                console.log('Caminho para salvar a ficha:', fichaPath);
                console.log('ID da ficha:', fichaId);
                console.log('Dados da ficha a serem salvos:', fichaAtualizada);

                this.firestoreService.updateRegistro(fichaPath, fichaId, fichaAtualizada).then(() => {
                    console.log('Ficha atualizada com sucesso');
                    this.router.navigate([`/view-ficha/${collection}/${id}/ficha/${subCollection}/itens/${fichaId}`]);
                }).catch(error => {
                    console.error('Erro ao atualizar a ficha:', error);
                });
            } else {
                // Adicionar nova ficha se fichaId for null
                this.firestore.collection(fichaPath).add(fichaAtualizada).then(docRef => {
                    console.log('Nova ficha criada com sucesso com ID:', docRef.id);
                    this.router.navigate([`/view-ficha/${collection}/${id}/ficha/${subCollection}/itens/${docRef.id}`]);
                }).catch(error => {
                    console.error('Erro ao criar nova ficha:', error);
                });
            }
        } else {
            console.error('Formulário inválido. Verifique os campos obrigatórios.');
            console.log('Estado atual do formulário:', this.fichaForm.status);
            console.log('Erros no formulário:', this.fichaForm.errors);
        }
    }



}
