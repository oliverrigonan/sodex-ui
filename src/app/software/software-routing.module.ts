// ===============
// Angular Modules
// ===============
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

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
import { ForbiddenComponent } from './forbidden/forbidden.component';

// ==============
// Custom Classes
// ==============
import { SoftwareRouterActivate } from './software.router.activate';

// ======
// Routes
// ======
const routes: Routes = [
  {
    path: 'software', component: SoftwareComponent, canActivate: [SoftwareRouterActivate],
    children: [
      { path: '', component: DashboardComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'dashboard', component: DashboardComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'profile', component: ProfileComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'transfer', component: TransferComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'reports', component: ReportsComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'cards', component: CardsComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'checkbalance', component: CheckBalanceComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'users', component: UsersComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'forbidden', component: ForbiddenComponent, canActivate: [SoftwareRouterActivate] }
    ]
  },
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
export class SoftwareRoutingModule { }
