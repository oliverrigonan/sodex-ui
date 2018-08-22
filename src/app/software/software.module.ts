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
import { ProfileService } from './profile/profile.service';
import { TransferService } from './transfer/transfer.service';
import { CheckBalanceService } from './check-balance/check-balance.service';
import { UsersService } from './users/users.service';

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
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// =====
// Wijmo
// =====
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

// ============
// Curreny Mask
// ============
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  decimal: ".",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ","
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SoftwareRoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    CurrencyMaskModule,
    WjGridFilterModule,
    WjGridModule,
    WjInputModule,
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
    CardsService,
    ProfileService,
    TransferService,
    CheckBalanceService,
    UsersService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ]
})
export class SoftwareModule { }
