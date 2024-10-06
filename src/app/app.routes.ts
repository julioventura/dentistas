import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { authGuard } from './auth.guard';  // Importar o Auth Guard
import { ResetPasswordComponent } from './reset-password/reset-password.component';  // Importar o componente
import { PacientesComponent } from './pacientes/pacientes.component';
import { ViewComponent } from './view/view.component'; // Certifique-se de importar o novo componente
import { EditComponent } from './edit/edit.component'; // Certifique-se de importar o novo componente

export const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },  // Nova rota
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'chatbot', component: ChatbotComponent, canActivate: [authGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
  { path: 'pacientes', component: PacientesComponent, canActivate: [authGuard] },
  { path: 'view/:codigo', component: ViewComponent },  
  { path: 'edit/:codigo', component: EditComponent }
 
  // { path: 'view/:codigo', component: ViewComponent, canActivate: [authGuard] },  // Proteger com o authGuard, se necessário
  // { path: 'edit/:codigo', component: EditComponent, canActivate: [authGuard] },  // Proteger com o authGuard, se necessário
];

