// ===============
// Angular Modules
// ===============
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ==========
// Components
// ==========
import { DashboardComponent } from './dashboard/dashboard.component';
import { SoftwareComponent } from './software.component';
import { ProfileComponent } from './profile/profile.component';
import { TransferComponent } from './transfer/transfer.component';
import { ReportsComponent } from './reports/reports.component';
import { CardsComponent } from './cards/cards.component';
import { CheckBalanceComponent } from './check-balance/check-balance.component';
import { UsersComponent } from './users/users.component';

// ========
// Services
// ========
import { CardsService } from './cards/cards.service';

// =======
// Routing
// =======
import { SoftwareRoutingModule } from './software-routing.module';
import { SoftwareRouterActivate } from './software.router.activate';

// ===============
// Material Design
// ===============
import { MatNativeDateModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// =========
// Bootstrap
// =========
import { ModalModule } from 'ngx-bootstrap';

// =====
// Wijmo
// =====
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SoftwareRoutingModule,
    ModalModule.forRoot(),
    WjGridFilterModule,
    WjGridModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatCardModule,
    MatProgressBarModule
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
  ],
  providers: [
    SoftwareRouterActivate,
    CardsService
  ]
})
export class SoftwareModule { }
