import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'; // Adiciona FormControl
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Importa a autenticação para capturar o usuário logado
import { CamposService } from '../shared/campos.service'; // Importa o serviço de campos

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  collection!: string;
  registro: any = {}; // O registro começa vazio para evitar problemas de inicialização
  isNew = false; // Identifica se é um novo registro ou edição de um existente
  userId: string | null = null; // Armazena o ID do usuário logado

  // Formulário dinâmico
  registroForm!: FormGroup; // FormGroup para o formulário dinâmico
  campos: any[] = []; // Campos serão definidos dinamicamente com base na coleção

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>, // Serviço genérico
    private navegacaoService: NavegacaoService,
    private afAuth: AngularFireAuth, // Serviço de autenticação
    private fb: FormBuilder, // FormBuilder para o formulário dinâmico
    private camposService: CamposService // Serviço de campos
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid; // Define o ID do usuário logado

        // Captura o nome da coleção da rota
        this.collection = this.route.snapshot.paramMap.get('collection')!;
        const id = this.route.snapshot.paramMap.get('id');

        // Define os campos do formulário com base na coleção
        this.carregarCampos(); // Método ajustado para carregar campos do Firestore

        if (id) {
          this.loadRegistro(id);
        } else {
          this.isNew = true;
          this.gerarNovoRegistro(); // Se não houver id, cria um novo registro
        }

        // Inicializa o formulário dinâmico
        this.createForm();
      }
    });
  }

  carregarCampos() {
    // Se inscreve no Observable retornado pelo serviço e atribui os campos ao array
    this.camposService.getFormularios(this.collection).subscribe((campos: any[]) => {
      this.campos = campos || []; // Inicializa com um array vazio se não houver campos
      this.createForm(); // Recria o formulário após carregar os campos
    });
  }

  gerarNovoRegistro() {
    if (!this.userId || !this.collection) return; // Verifica se o userId e a collection estão disponíveis

    this.firestoreService.gerarProximoCodigo(`users/${this.userId}/${this.collection}`).then(novoCodigo => {
      const id = this.firestoreService.createId(); // Gera o ID único no momento da criação
      this.registro = {
        id, // O ID gerado será usado para operações no Firestore
        codigo: novoCodigo,
        ...this.campos.reduce((acc, campo) => ({ ...acc, [campo.nome]: '' }), {})
      };

      // Adiciona o registro recém-criado à subcoleção do usuário logado
      this.firestoreService.addRegistro(`users/${this.userId}/${this.collection}`, this.registro).then(() => {
        console.log('Novo registro criado com sucesso:', this.registro);
      }).catch(error => {
        console.error('Erro ao criar o novo registro:', error);
      });
    });
  }

  loadRegistro(id: string) {
    if (!this.userId || !this.collection) return; // Verifica se o userId e a collection estão disponíveis

    this.firestoreService.getRegistroById(`users/${this.userId}/${this.collection}`, id).subscribe(registro => {
      if (registro) {
        this.registro = registro;
        console.log('Registro carregado:', this.registro);

        // Adiciona campos ao formulário dinamicamente se não estiverem presentes
        Object.keys(this.registro).forEach(key => {
          if (!this.registroForm.contains(key)) {
            this.registroForm.addControl(key, new FormControl(''));
          }
        });

        // Atualiza o formulário com os dados do registro
        this.registroForm.patchValue(this.registro);
      } else {
        console.error('Registro não encontrado com o ID:', id);
        alert(`Registro não encontrado com o ID: ${id}`);
        this.router.navigate([`/${this.collection}`]); // Redireciona se não encontrar o registro
      }
    });
  }

  createForm() {
    // Cria o formulário com os campos esperados
    const formControls = this.campos.reduce((acc, campo) => {
      acc[campo.nome] = new FormControl('');
      return acc;
    }, {});
    this.registroForm = this.fb.group(formControls);
  }

  salvar() {
    if (this.registroForm.valid && this.userId) {
      const registroAtualizado = { ...this.registro, ...this.registroForm.value }; // Atualiza o registro com os dados do formulário
      console.log('Salvando registro:', registroAtualizado);

      this.firestoreService.updateRegistro(`users/${this.userId}/${this.collection}`, this.registro.id, registroAtualizado)
        .then(() => {
          this.router.navigate([`/view/${this.collection}`, this.registro.id]);
        })
        .catch(error => {
          console.error('Erro ao salvar o registro:', error);
          alert('Erro ao salvar o registro. Por favor, tente novamente.');
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
