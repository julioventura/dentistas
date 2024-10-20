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
  isLoading = true;
  userId!: string;
  titulo_da_pagina: string = '';
  pacienteNome: string = '';

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
      if (user && user.uid) {
        this.userId = user.uid; // Garantindo que userId seja inicializado corretamente
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        this.id = this.route.snapshot.paramMap.get('id')!;
        this.subCollection = this.route.snapshot.paramMap.get('subcollection')!;
        this.fichaId = this.route.snapshot.paramMap.get('fichaId') || null;

        console.log('Collection:', this.collection);
        console.log('ID:', this.id);
        console.log('subCollection:', this.subCollection);
        console.log('userId:', this.userId); // Garantir que o userId seja exibido corretamente

        this.titulo_da_pagina = "Editar " + this.util.capitalizar(this.subCollection);

        this.carregarCampos();

        this.loadPacienteNome();

        if (this.fichaId) {
          // Carregar detalhes de uma ficha específica
          console.log('fichaId:', this.fichaId);
          this.loadFicha();
        }
      } else {
        console.error('Usuário não autenticado.');
      }
    });

    // Inicializa o formulário reativo
    this.fichaForm = this.fb.group({
      nome: ['', Validators.required], // Campo 'nome' com validação
      descricao: [''],
      valor: [''],
      data: [''] 
    });

    console.log('Formulário inicializado.');

    // Captura os parâmetros da rota
    this.collection = this.route.snapshot.paramMap.get('collection')!;
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.subCollection = this.route.snapshot.paramMap.get('subcollection')!;
    this.fichaId = this.route.snapshot.paramMap.get('fichaId')!;

    console.log('edit-ficha:');
    console.log('Collection:', this.collection);
    console.log('ID:', this.id);
    console.log('subCollection:', this.subCollection);
    console.log('fichaId:', this.fichaId);

    // this.createForm();
  }



  carregarCampos() {
    this.CamposFichaService.getCamposFicha(this.collection).subscribe((campos: any[]) => {
      this.campos = campos || [];
      this.createForm();
    });
  }



  loadPacienteNome() {
    const pacientePath = `users/${this.userId}/${this.collection}`;
    console.log('Caminho para o paciente:', pacientePath);
    console.log('Id do paciente:', this.id);

    this.firestoreService.getRegistroById(pacientePath, this.id).subscribe(paciente => {
      if (paciente && paciente.nome) {
        this.pacienteNome = paciente.nome;
        console.log('Nome do paciente carregado:', this.pacienteNome);
        this.titulo_da_pagina = "Fichas de " + this.util.capitalizar(this.subCollection);
      } else {
        console.error('Paciente não encontrado ou sem nome.');
      }
    }, error => {
      console.error('Erro ao carregar o paciente:', error);
    });
  }



  createForm() {
    this.fichaForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: [''], // Caso 'valor' seja opcional
      data: ['', Validators.required]
    });
  }


  loadFicha() {
    console.log('loadFicha()');
    console.log('subCollection: ' + this.subCollection);
    console.log('fichaId: ' + this.fichaId);

    if (this.subCollection && this.fichaId) {
      // const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens/${this.fichaId}`;
      const fichaPath = `users/${this.userId}/${this.collection}/${this.id}/fichas/${this.subCollection}/itens`;

      console.log('Caminho para carregar ficha:', fichaPath);

      // Carrega a ficha para edição
      this.firestoreService.getRegistroById(fichaPath, this.fichaId).subscribe(ficha => {
        console.log('Ficha carregada para edição:', ficha);

        if (ficha) {

          // Atualize o formulário com os dados da ficha
          // this.fichaForm.patchValue({
          //   nome: ficha.nome || '', // Garantir que os campos correspondam ao objeto ficha
          //   descricao: ficha.descricao || '',
          //   valor: ficha.valor || '',
          //   data: ficha.data || ''
          // });
          this.fichaForm.patchValue(ficha); // Preenche o formulário com os dados da ficha
          
          this.isLoading = false;
          console.log('Ficha para edição (ficha):', ficha);

        } else {
          console.error('Ficha não encontrada no caminho:', fichaPath);
        }
      }, error => {
        console.error('Erro ao carregar ficha para edição:', error);
      });
    } else {
      console.error('subCollection, fichaId ou userId não definidos corretamente.');
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
      console.error('Formulário inválido, não foi possível salvar.');
      console.log('Estado atual do formulário:', this.fichaForm.status);
      console.log('Erros no formulário:', this.fichaForm.errors);
    }
  }

  voltar(): void {
    this.navegacaoService.goBack();
  }
}
