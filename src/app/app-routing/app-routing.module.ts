import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DefaultComponent} from "../layouts/default/default.component";
import {DashboardComponent} from "../modules/dashboard/dashboard.component";
import {AuthGuard} from "../services/authGuard";
import {Role} from "../_models";
import {LoginComponent} from "../shared/components/login/login.component";
import {RegistryDomSchemaChecker} from "@angular/compiler-cli/src/ngtsc/typecheck/src/dom";
import {RegisterComponent} from "../shared/components/register/register.component";
import {ErrorComponent} from "../shared/components/error/error.component";
import {AdminComponent} from "../modules/admin/admin.component";



const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [{
      path: '',
      component: DashboardComponent,
      // canActivate: [AuthGuard],
      // data: { roles: [Role.User] }
    },{
      path: 'login',
      component: LoginComponent
    },{
      path: 'register',
      component: RegisterComponent
    },{
      path: 'error',
      component: ErrorComponent
    },{
      path: 'admin',
      component: AdminComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
    }
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
