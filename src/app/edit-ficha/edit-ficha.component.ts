import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegacaoService } from '../shared/navegacao.service';
import { FirestoreService } from '../shared/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../shared/util.service';
import { CamposFichaService } from '../shared/campos-ficha.service';

@Component({
  selector: 'app-edit-ficha',
  templateUrl: './edit-ficha.component.html',
  styleUrls: ['./edit-ficha.component.scss']
})
export class EditFichaComponent implements OnInit {
  collection!: string;
  subCollection!: string;
  registro: any = {};
  id!: string;
  fichaId: string | null = null; // Pode ser null se não houver fichaId
  ficha: any;
  isLoading = true;
  userId!: string;
  titulo_da_pagina: string = '';
  collectionNome: string = '';

  fichaForm!: FormGroup;
  campos: any[] = [];
  arquivos: { [key: string]: File } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navegacaoService: NavegacaoService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private firestoreService: FirestoreService<any>,
    private CamposFichaService: CamposFichaService,
    public util: UtilService
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      if (!user || !user.uid) {
        console.error('Usuário não autenticado.');
        this.util.goHome();
      }
      else {
        this.userId = user.uid; // Garantindo que userId seja inicializado corretamente
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.subCollection = this.route.snapshot.paramMap.get('subcollection')!;
        this.fichaId = this.route.snapshot.paramMap.get('fichaId') || null;

        this.titulo_da_pagina = "Editar " + this.util.capitalizar(this.subCollection);

        console.log('userId:', this.userId); // Garantir que o userId seja exibido corretamente
        console.log('Collection:', this.collection);
        console.log('ID:', this.id);
        console.log('subCollection:', this.subCollection);
        console.log('fichaId:', this.fichaId); // Garantir que o fichaId seja exibido corretamente

        if (!this.fichaId) {
          console.error('Ficha não identificada.');
          this.voltar();
        }
        this.carregarCampos();
        this.createForm();
        this.loadFicha();
        this.loadCollectionNome();
      }
    });
    console.log('Formulário de edição de ficha inicializado.');
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


  carregarCampos() {
    this.CamposFichaService.getCamposFicha(this.collection).subscribe((campos: any[]) => {
      this.campos = campos || [];
    });
  }



  loadCollectionNome() {
    const collectionPath = `users/${this.userId}/${this.collection}`;
    console.log('Caminho para o collection:', collectionPath);
    console.log('Id do collection:', this.id);

    this.firestoreService.getRegistroById(collectionPath, this.id).subscribe(collection => {
      if (collection && collection.nome) {
        this.collectionNome = collection.nome;
        console.log('Nome do collection carregado:', this.collectionNome);
        this.titulo_da_pagina = "Fichas de " + this.util.capitalizar(this.subCollection);
      } else {
        console.error('Collection não encontrado ou sem nome.');
      }
    }, error => {
      console.error('Erro ao carregar o collection:', error);
    });
  }




  loadFicha() {
    console.log('loadFicha()');
    console.log('subCollection: ' + this.subCollection);
    console.log('fichaId: ' + this.fichaId);

    if (!this.subCollection || !this.fichaId) {
      console.error('subCollection ou fichaId não definidos corretamente.');
    }
    else {
      // const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens/${this.fichaId}`;
      const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;
      console.log('Caminho para carregar ficha:', fichaPath);

      // Carrega a ficha para edição
      this.firestoreService.getRegistroById(fichaPath, this.fichaId).subscribe(ficha => {
        if (ficha) {
          this.ficha = ficha;
          this.fichaForm.patchValue(ficha); // Preenche o formulário com os dados da ficha
          console.log('Ficha carregada:', this.ficha);
        } else {
          console.error('Ficha não encontrada no caminho:', fichaPath);
          this.voltar();
        }
        this.isLoading = false;  // ☺Desativa o indicador de carregamento
      }, error => {
        console.error('Erro ao carregar ficha para edição:', error);
      });
    }
  }


  onFileSelected(event: any, campoNome: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivos[campoNome] = file;
    }
  }



  salvar() {
    if (this.fichaForm.valid) {
      const fichaAtualizada = this.fichaForm.value; // Obtém os valores do formulário
      const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;

      if (this.fichaId) {
        // Atualiza uma ficha existente
        console.log('Caminho para salvar a ficha:', fichaPath);
        console.log('ID da ficha:', this.fichaId);
        console.log('Dados da ficha a serem salvos:', fichaAtualizada);

        this.firestoreService.updateRegistro(fichaPath, this.fichaId, fichaAtualizada).then(() => {
          console.log('Ficha atualizada com sucesso');
          this.router.navigate([`/view-ficha/${this.collection}/${this.id}/ficha/${this.subCollection}/itens/${this.fichaId}`]);
        }).catch(error => {
          console.error('Erro ao atualizar a ficha:', error);
        });
      } else {
        // Adicionar nova ficha se fichaId for null
        this.firestore.collection(fichaPath).add(fichaAtualizada).then(docRef => {
          console.log('Nova ficha criada com sucesso com ID:', docRef.id);
          this.router.navigate([`/view-ficha/${this.collection}/${this.id}/ficha/${this.subCollection}/itens/${docRef.id}`]);
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

  voltar(): void {
    this.navegacaoService.goBack();
  }
}
