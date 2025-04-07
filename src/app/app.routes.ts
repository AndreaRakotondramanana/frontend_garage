import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DetailCategorieComponent } from './components/detail-categorie/detail-categorie.component';
import { DetailHistoriqueRepComponent } from './components/detail-historique-rep/detail-historique-rep.component';
import { DetailSuiviRepComponent } from './components/detail-suivi-rep/detail-suivi-rep.component';
import { PrendreRdvComponent } from './components/prendre-rdv/prendre-rdv.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'detail-categorie/:id', component: DetailCategorieComponent },
    { path: 'detail-historique-rep', component: DetailHistoriqueRepComponent},
    { path: 'detail-suivi-rep', component: DetailSuiviRepComponent},
    { path: 'prendre-rdv', component: PrendreRdvComponent},
];
