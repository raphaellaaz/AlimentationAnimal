import { Routes } from '@angular/router';
import { LoginComponent } from './components/usuario/login/login.component';
import { AppComponent } from './app.component';
import { FormdataComponent } from './components/formdata/formdata.component';
import { RegisterComponent } from './components/usuario/register/register.component';
import { RecoverComponent } from './components/usuario/recover/recover.component';




export const routes: Routes = [
    
    { path: '', component: FormdataComponent }, // Página principal
    { path: 'login', component: LoginComponent } ,
    { path: 'register', component: RegisterComponent } ,
    { path: 'recover',component: RecoverComponent},

];

