// ===============
// Angular Modules
// ===============
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// ==========
// Components
// ==========
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

// ==============
// Custom Classes
// ==============
import { AppRouterActivate } from './app.router.activate';

// ======
// Routes
// ======
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [AppRouterActivate] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }