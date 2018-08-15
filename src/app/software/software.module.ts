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
import { MatListModule } from '@angular/material/list';
import { ProfileComponent } from './profile/profile.component';
import { TransferComponent } from './transfer/transfer.component';
import { ReportsComponent } from './reports/reports.component';
import { CardsComponent } from './cards/cards.component';
import { CheckBalanceComponent } from './check-balance/check-balance.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [
    CommonModule,
    SoftwareRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule
  ],
  declarations: [
    DashboardComponent,
    SoftwareComponent,
    ProfileComponent,
    TransferComponent,
    ReportsComponent,
    CardsComponent,
    CheckBalanceComponent,
    UsersComponent
  ]
})
export class SoftwareModule { }
