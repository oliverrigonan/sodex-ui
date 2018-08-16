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

// =======
// Routing
// =======
import { SoftwareRoutingModule } from './/software-routing.module';

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

// =========
// Bootstrap
// =========
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SoftwareRoutingModule,
    ModalModule.forRoot(),
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
    MatDatepickerModule
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
