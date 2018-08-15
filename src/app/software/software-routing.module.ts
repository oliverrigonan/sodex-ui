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

// ======
// Routes
// ======
const routes: Routes = [
  {
    path: 'software', component: SoftwareComponent, children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
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
