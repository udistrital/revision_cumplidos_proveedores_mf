import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { TablaCargaSoportesComponent } from './components/carga-soportes/tabla-carga-soportes/tabla-carga-soportes.component';
import { ComponentePrincipalComponent } from './components/informe_seguimiento/componente-principal/componente-principal.component';

export const routes: Routes = [
  {
    path:'',
    component: TablaCargaSoportesComponent,
  },
  {
    path: 'informe-seguimiento',
    component: ComponentePrincipalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
