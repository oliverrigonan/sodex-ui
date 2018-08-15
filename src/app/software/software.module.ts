// ===============
// Angular Modules
// ===============
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ==========
// Components
// ==========
import { DashboardComponent } from './dashboard/dashboard.component';
import { SoftwareComponent } from './software.component';

// =======
// Routing
// =======
import { SoftwareRoutingModule } from './/software-routing.module';

// ===============
// Material Design
// ===============
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  imports: [
    CommonModule,
    SoftwareRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule
  ],
  declarations: [
    DashboardComponent,
    SoftwareComponent
  ]
})
export class SoftwareModule { }
