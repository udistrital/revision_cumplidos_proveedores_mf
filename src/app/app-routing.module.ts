import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { ComponentePrincipalComponent } from './components/informe_seguimiento/componente-principal/componente-principal.component'

const routes: Routes = [{
  path:"", component:EmptyRouteComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
