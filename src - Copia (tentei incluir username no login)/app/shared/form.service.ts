import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importa o serviço de Storage
import { FirestoreService } from './firestore.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CamposFichaService } from './campos-ficha.service';

@Injectable({
    providedIn: 'root'
})

export class FormService {

    fichaForm!: FormGroup;
    campos: any[] = [];
    isLoading = true;
    registro: any = null;


    constructor(
        private firestore: AngularFirestore,
        private storage: AngularFireStorage,
        private firestoreService: FirestoreService<any>,
        private fb: FormBuilder,
        private CamposFichaService: CamposFichaService,
        private router: Router,

    ) { }



    carregarCampos(collection: string) {
        this.CamposFichaService.getCamposFicha(collection).subscribe((campos: any[]) => {
            this.campos = campos || [];
        });
    }

    createForm() {
        console.log('createForm()');
        // Inicializa o formulário reativo
        this.fichaForm = this.fb.group({
            nome: ['', Validators.required],  // Apenas o campo nome é obrigatório
            descricao: [''],
            valor: [''],
            data: ['']
        });
    }


    loadFicha(userId: string, collection: string, id: string, subCollection: string, fichaId: string, view: boolean = false) {
        console.log('loadFicha()');

        console.log('Collection:', collection);
        console.log('ID:', id);
        console.log('subCollection: ' + subCollection);
        console.log('fichaId: ' + fichaId);

        if (subCollection && fichaId) {

            const fichaPath = `users/${userId}/${collection}/${id}/fichas/${subCollection}/itens`;
            console.log('Caminho para carregar ficha:', fichaPath);

            this.carregarCampos(collection);
            this.createForm();

            // Carrega a ficha para edição
            this.firestoreService.getRegistroById(fichaPath, fichaId).subscribe(ficha => {
                if (ficha) {
                    if (view) {
                        this.fichaForm.disable();  // Desabilita todo o formulário
                    }
                    else {
                        this.fichaForm.enable();  // Habilita todo o formulário
                    }

                    this.registro = ficha;  // pro view-ficha

                    this.fichaForm.patchValue(ficha); // Preenche o formulário - edit-ficha

                    this.isLoading = false;  // Desativa o indicador de carregamento
                    console.log('isLoading == false');

                    console.log('Ficha carregada:', ficha);
                } else {
                    console.error('Ficha não encontrada no caminho:', fichaPath);
                    // this.voltar();
                }
            }, error => {
                console.error('Erro ao carregar ficha para edição:', error);
            });
        }
        else {
            console.error('subCollection ou fichaId não definidos corretamente.');
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
