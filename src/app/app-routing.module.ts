import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { ListarContratosComponent } from './components/supervisor/listar-contratos/listar-contratos.component';
import { InformeSatisfaccionComponent } from './components/supervisor/informe_seguimiento/informe-satisfaccion.component';
import { APP_BASE_HREF } from '@angular/common';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RevisionCumplidosContratacionComponent } from './components/contratacion/revision-cumplidos-contratacion/revision-cumplidos-contratacion.component';
import { RevisionCumplidosOrdenadorComponent } from './components/ordenador/revision-cumplidos-ordenador/revision-cumplidos-ordenador.component';
import { AuthGuard } from 'src/_guards/auth.guard';
import { ListarCumplidosReversiblesComponent } from './components/ordenador/listar-cumplidos-reversibles/listar-cumplidos-reversibles.component';
import { HistoricoCumplidosComponent } from './components/historico-cumplidos/historico-cumplidos.component';
import { GestionEvaluadoresComponent } from './components/evaluacion-proveedor/gestion-evaluadores/gestion-evaluadores.component';
import { FormEvaluacionContratoComponent } from './components/evaluacion-proveedor/form-evaluacion-contrato/form-evaluacion-contrato.component';
import { ListarContratosEvaluarComponent } from './components/evaluacion-proveedor/listar-contratos-evaluar/listar-contratos-evaluar.component';

export const routes: Routes = [
  {
    path:'supervisor/subir-soportes',
    canActivate: [AuthGuard],
    component: ListarContratosComponent,
  },
  {
    path: 'cumplido-satisfaccion/:cumplidoId',
    canActivate: [AuthGuard],
    component: InformeSatisfaccionComponent,
  },
  {
    path: 'contratacion/revision-cumplidos',
    canActivate: [AuthGuard],
    component: RevisionCumplidosContratacionComponent,
  },
  {
    path: 'ordenador/revision-cumplidos',
    canActivate: [AuthGuard],
    component: RevisionCumplidosOrdenadorComponent,
  },
  {
    path: 'gestion-evaluadores',
    component: GestionEvaluadoresComponent,
  },
  {
    path: 'evaluacion-contrato',
    component: FormEvaluacionContratoComponent,
  },
  {
    path: 'listar-contratos-evaluar',
    component: ListarContratosEvaluarComponent,
  },
  {
    path: 'ordenador/reversion-cumplidos',
    canActivate: [AuthGuard],
    component: ListarCumplidosReversiblesComponent,
  },
  {
    path: 'historicos-cumplidos',
    canActivate: [AuthGuard],
    component: HistoricoCumplidosComponent
  },
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
