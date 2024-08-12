import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { TablaCargaSoportesComponent } from './components/carga-soportes/tabla-carga-soportes/tabla-carga-soportes.component';
import { ComponentePrincipalComponent } from './components/informe_seguimiento/componente-principal/componente-principal.component';
import { APP_BASE_HREF } from '@angular/common';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const routes: Routes = [
  {
    path:'subir-soportes',
    component: TablaCargaSoportesComponent,
  },
  {
    path: 'informe-seguimiento',
    component: ComponentePrincipalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    provideRouter(routes),
    { provide: APP_BASE_HREF, useValue: '/pages/'},
    getSingleSpaExtraProviders(),
    provideHttpClient(withFetch())]
})
export class AppRoutingModule { }
