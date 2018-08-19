// ===============
// Angular Modules
// ===============
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// ==========
// Components
// ==========
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

// ========
// Services
// ========
import { LoginService } from './login/login.service';

// =======
// Routing
// =======
import { AppRoutingModule } from './app-routing.module';
import { AppRouterActivate } from './app.router.activate';

// ===============
// Software Module
// ===============
import { SoftwareModule } from './software/software.module';
import { LoginComponent } from './login/login.component';

// ===============
// Material Design
// ===============
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// ======
// Toastr
// ======
import { ToastrModule } from 'ngx-toastr';

// ==============
// Custom Classes
// ==============
import { AppSettings } from './app.settings';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AppRoutingModule,
    SoftwareModule
  ],
  providers: [
    AppSettings,
    AppRouterActivate,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }