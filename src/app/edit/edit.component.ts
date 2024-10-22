import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CamposService } from '../shared/campos.service';
import { UtilService } from '../shared/util.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  collection!: string;
  registro: any = {};
  isLoading = true;

  isNew = false;
  userId: string | null = null;

  registroForm!: FormGroup;
  campos: any[] = [];
  arquivos: { [key: string]: File } = {};
  titulo_da_pagina: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private navegacaoService: NavegacaoService,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private camposService: CamposService,
    public util: UtilService
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;

        this.collection = this.route.snapshot.paramMap.get('collection')!;
        const id = this.route.snapshot.paramMap.get('id');

        this.carregarCampos();

        this.titulo_da_pagina = this.util.capitalizar(this.collection);

        if (id) {
          this.loadRegistro(id);
        } else {
          this.isNew = true;
          this.gerarNovoRegistro();  // Gera um ID e cria um registro temporário
        }
      }
    });

    // Inicializa o formulário
    this.registroForm = this.fb.group({
      nome: [''],
      codigo: [''],
      cpf: [''],
      telefone: [''],
      nascimento: ['']
    });
  }

  carregarCampos() {
    this.camposService.getCamposRegistro(this.collection).subscribe((campos: any[]) => {
      this.campos = campos || [];
      this.createForm();
    });
  }

  gerarNovoRegistro() {
    if (!this.userId || !this.collection) return;

    this.firestoreService.gerarProximoCodigo(`users/${this.userId}/${this.collection}`).then(novoCodigo => {
      const id = this.firestoreService.createId();
      this.registro = {
        id,
        codigo: novoCodigo,
        ...this.campos.reduce((acc, campo) => ({ ...acc, [campo.nome]: '' }), {})
      };

      console.log('Novo registro gerado (temporário):', this.registro);
    });
  }

  loadRegistro(id: string) {
    if (!this.userId || !this.collection) return;

    const registroPath = `users/${this.userId}/${this.collection}`;
    console.log('Tentando carregar o registro no caminho:', registroPath, 'com ID:', id);

    this.firestoreService.getRegistroById(registroPath, id).subscribe(
      (registro) => {
        if (registro) {
          // Se o registro não tiver um campo 'id', atribuímos o ID manualmente
          if (!registro.id) {
            registro.id = id; // Atribui o id lido do caminho como id do registro
            console.log('Registro não tinha ID, atribuído o id do caminho:', id);

            // Atualiza o Firestore com o campo 'id' adicionado
            this.firestoreService.updateRegistro(registroPath, id, { id });
          }

          this.registro = { ...registro, id };
          console.log('Registro carregado:', this.registro);

          Object.keys(this.registro).forEach(key => {
            if (!this.registroForm.contains(key)) {
              this.registroForm.addControl(key, new FormControl(''));
            }
          });

          // ------------------------------
          this.registroForm.patchValue(this.registro); // Preenche o formulário com os dados do registro
          // ------------------------------

        } else {
          console.error('Registro não encontrado com o ID:', id);
          alert(`Registro não encontrado com o ID: ${id}`);
          this.router.navigate([`/${this.collection}`]);
        }
        this.isLoading = false;  // ☺Desativa o indicador de carregamento
      },
      (error) => {
        console.error('Erro ao carregar o registro:', error);
        alert('Erro ao carregar o registro.');
      }
    );
  }


  createForm() {
    const formControls = this.campos.reduce((acc, campo) => {
      acc[campo.nome] = new FormControl('');
      return acc;
    }, {});

    this.registroForm = this.fb.group(formControls);
  }

  salvar() {
    if (this.registroForm.valid && this.userId) {
      const registroAtualizado = { ...this.registro, ...this.registroForm.value };

      // Verifique se o ID está presente antes de salvar
      if (!this.registro.id) {
        console.error('Erro: ID do registro está indefinido. Não é possível atualizar o registro.');
        alert('Erro ao atualizar o registro. O ID está indefinido.');
        return;
      }

      const registroPath = `users/${this.userId}/${this.collection}`;

      console.log('Tentando salvar o registro:');
      console.log('Atualizando registro no caminho:', registroPath, 'com ID:', this.registro.id);
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
        this.firestoreService.updateRegistro(registroPath, this.registro.id, registroAtualizado)
          .then(() => {
            this.router.navigate([`/view/${this.collection}`, this.registro.id]);
          })
          .catch(error => {
            console.error('Erro ao salvar o registro:', error);
            alert('Erro ao salvar o registro. Por favor, tente novamente.');
          });
      });
    } else {
      console.error('Registro inválido ou sem ID:', this.registro);
      alert('Registro inválido ou sem ID. Não é possível salvar.');
    }
  }


  voltar() {
    this.navegacaoService.goBack();
  }
}
