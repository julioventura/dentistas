import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importado aqui
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Firebase e Firestore
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

// Componentes da aplicação
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { EditComponent } from './edit/edit.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ViewComponent } from './view/view.component';
import { ConfigComponent } from './shared/config/config.component';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { RegistrosComponent } from './registros/registros.component'; // Novo componente Registros

// Serviços
import { FirestoreService } from './shared/firestore.service';
import { ConfigService } from './shared/config.service';
import { UserService } from './shared/user.service';

// Importações do Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ChatbotComponent,
    EditComponent,
    FooterComponent,
    MenuComponent,
    ResetPasswordComponent,
    ViewComponent,
    ConfigComponent,
    SignupDialogComponent,
    RegistrosComponent // Declaração do novo componente Registros
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Adicionado aqui
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'chatbot', component: ChatbotComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'view/:collection/:id', component: ViewComponent },
      { path: 'edit/:collection/:id', component: EditComponent },
      { path: 'config', component: ConfigComponent },
      { path: 'registros/:collection', component: RegistrosComponent }, // Rota para o componente Registros
      { path: '**', redirectTo: '' }
    ]),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [FirestoreService, ConfigService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
