import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { PopUpManager } from 'src/app/managers/popUpManager';
import { DecodedToken } from 'src/app/models/decode_token';
import { UserService } from 'src/app/services/user.services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  user!:DecodedToken;
  pathForRol:any={
    'pages/cumplido-satisfaccion/:cumplidoId':['SUPERVISOR']
  }
  constructor(
    private popUpManager: PopUpManager,
    private userService: UserService
  ) {
    this.user=userService.getPayload()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("route",route)
    const menuInfo = localStorage.getItem('menu');
    console.log(this.user)
    const menuPermisos = menuInfo ? JSON.parse(atob(menuInfo)) : null;
    console.log("Menu",menuPermisos)
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    //const path = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
    const path= 'pages/'+route.routeConfig?.path

    // Obtener parámetros de la ruta
    const params = route.params;

    console.log("Path actual:", path);


    if (menuPermisos != null) {
      
      // Pasar tanto la URL como los parámetros a la función de verificación
      if (checkUrlExists(menuPermisos, path?path:'', params)) {
        return true;
      }else{
        if(this.pathForRol[path]!=undefined && this.pathForRol[path].some((item:string) => this.user.role.includes(item))){
          return true
        }
      }
    }

    this.popUpManager.showErrorAlert('No tienes permiso para acceder a esta ruta o no has iniciado sesión');
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}

// Recorrer el menú para verificar si la URL y los parámetros existen
function checkUrlExists(menuItems: any, targetUrl: string, params: any) {
  return menuItems.some((item: any) => {
    // Verificar la URL y los parámetros
    console.log("Item:", item.Url)
    if (item.Url === targetUrl && checkParams(item.Params, params)) {
      return true;
    }
    if (item.Opciones && item.Opciones.length > 0) {
      return checkUrlExists((item.Opciones), targetUrl, params);
    }
    return false;
  });
}

// Verificar los parámetros de la ruta
function checkParams(expectedParams: any, actualParams: any): boolean {
  if (!expectedParams) {
    return true; // No se requieren parámetros específicos
  }
  for (let key in expectedParams) {
    if (expectedParams[key] !== actualParams[key]) {
      return false; // Un parámetro no coincide
    }
  }
  return true; // Todos los parámetros coinciden
}
