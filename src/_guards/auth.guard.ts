import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { PopUpManager } from 'src/app/managers/popUpManager';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private popUpManager: PopUpManager,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const menuInfo = localStorage.getItem('menu');
    const menuPermisos = menuInfo ? JSON.parse(atob(menuInfo)) : null;
    console.log("Menu",menuPermisos)
    const fullUrl = window.location.href;
    const url = new URL(fullUrl);
    const path = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;


    // Obtener parámetros de la ruta
    const params = route.params;

    console.log("Path actual:", path);


    if (menuPermisos != null) {
      // Pasar tanto la URL como los parámetros a la función de verificación
      if (checkUrlExists(menuPermisos, path, params)) {
        return true;
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
