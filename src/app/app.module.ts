// ===============
// Angular Modules
// ===============
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ==========
// Components
// ==========
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';

// =======
// Routing
// =======
import { AppRoutingModule } from './/app-routing.module';

// ===============
// Software Module
// ===============
import { SoftwareModule } from './software/software.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SoftwareModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }