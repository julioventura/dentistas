import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { NavegacaoService } from '../shared/navegacao.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CamposService } from '../shared/campos.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  collection!: string;
  registro: any = {};
  isNew = false;
  userId: string | null = null;

  registroForm!: FormGroup;
  campos: any[] = [];
  arquivos: { [key: string]: File } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreService: FirestoreService<any>,
    private navegacaoService: NavegacaoService,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private camposService: CamposService
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;

        this.collection = this.route.snapshot.paramMap.get('collection')!;
        const id = this.route.snapshot.paramMap.get('id');

        this.carregarCampos();

        if (id) {
          this.loadRegistro(id);
        } else {
          this.isNew = true;
          this.gerarNovoRegistro();
        }

        this.createForm();
      }
    });
  }

  carregarCampos() {
    this.camposService.getFormularios(this.collection).subscribe((campos: any[]) => {
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

      this.firestoreService.addRegistro(`users/${this.userId}/${this.collection}`, this.registro).then(() => {
        console.log('Novo registro criado com sucesso:', this.registro);
      }).catch(error => {
        console.error('Erro ao criar o novo registro:', error);
      });
    });
  }

  loadRegistro(id: string) {
    if (!this.userId || !this.collection) return;

    this.firestoreService.getRegistroById(`users/${this.userId}/${this.collection}`, id).subscribe(registro => {
      if (registro) {
        this.registro = registro;
        console.log('Registro carregado:', this.registro);

        Object.keys(this.registro).forEach(key => {
          if (!this.registroForm.contains(key)) {
            this.registroForm.addControl(key, new FormControl(''));
          }
        });

        this.registroForm.patchValue(this.registro);
      } else {
        console.error('Registro não encontrado com o ID:', id);
        alert(`Registro não encontrado com o ID: ${id}`);
        this.router.navigate([`/${this.collection}`]);
      }
    });
  }

  createForm() {
    const formControls = this.campos.reduce((acc, campo) => {
      acc[campo.nome] = new FormControl('');
      return acc;
    }, {});
    this.registroForm = this.fb.group(formControls);
  }

  onFileSelected(event: any, campoNome: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivos[campoNome] = file;
    }
  }

  salvar() {
    if (this.registroForm.valid && this.userId) {
      const registroAtualizado = { ...this.registro, ...this.registroForm.value };

      const uploadPromises = Object.keys(this.arquivos).map(campoNome => {
        const file = this.arquivos[campoNome];
        const url = prompt('Insira a URL do arquivo ou imagem:');
        return new Promise<void>((resolve) => {
          registroAtualizado[campoNome] = url;
          resolve();
        });
      });

      Promise.all(uploadPromises).then(() => {
        this.firestoreService.updateRegistro(`users/${this.userId}/${this.collection}`, this.registro.id, registroAtualizado)
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

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  isImageUrl(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    try {
      const parsedUrl = new URL(url);
      const extension = parsedUrl.pathname.split('.').pop();
      return imageExtensions.includes(extension!.toLowerCase());
    } catch (e) {
      return false;
    }
  }

}
