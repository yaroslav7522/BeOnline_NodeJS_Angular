import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {AuthLayoutComponent} from "./shared/layuots/auth-layout/auth-layout.component";
import {MainLayoutComponent} from "./shared/layuots/main-layout/main-layout.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {OverviewPageComponent} from "./overview-page/overview-page.component";
import {AnalyticsPageComponent} from "./analytics-page/analytics-page.component";
import {TabelsPageComponent} from "./tabels-page/tabels-page.component";
import {PositionsPageComponent} from "./positions-page/positions-page.component";
import {PositionFormComponent} from "./positions-page/position-form/position-form.component";
import {CategoryFormComponent} from "./positions-page/category-form/category-form.component";
import {OrdersPageComponent} from "./orders-page/orders-page.component";
import {ClientsPageComponent} from "./clients-page/clients-page.component";
import {ClientFormComponent} from "./clients-page/client-form/client-form.component";
import {OrderFormComponent} from "./orders-page/order-form/order-form.component";

const routes: Routes = [
  {
    path:'', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'reg', component: RegisterPageComponent}
    ]
  },
  {
    path:'', component: MainLayoutComponent,canActivate: [AuthGuard], children: [
      {path: 'overview', component: OverviewPageComponent},
      {path: 'analytics', component: AnalyticsPageComponent},
      {path: 'orders', component: OrdersPageComponent},
      {path: 'order/new', component: OrderFormComponent},
      {path: 'order/change/:id', component: OrderFormComponent},
      {path: 'tables', component: TabelsPageComponent},
      {path: 'positions', component: PositionsPageComponent},
      {path: 'positions/:id', component: PositionsPageComponent},
      {path: 'position/new', component: PositionFormComponent},
      {path: 'position/change/:id', component: PositionFormComponent},
      {path: 'category/new', component: CategoryFormComponent},
      {path: 'category/change/:id', component: CategoryFormComponent},
      {path: 'clients', component: ClientsPageComponent},
      {path: 'client/new', component: ClientFormComponent},
      {path: 'client/change/:id', component: ClientFormComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
