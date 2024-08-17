import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root',
})

export class Service{

    constructor(private requestManager:RequestManager){
        this.requestManager.setPath('CUMPLIDOS_PROVEEDORES_MID_SERVICE');
    }

    get(endpoint : any){
        this.requestManager.setPath("CUMPLIDOS_PROVEEDORES_MID_SERVICE");
        return this.requestManager.get(endpoint);
    }



    getCumplidosProveedoresCrud(endpoint : any){
        this.requestManager.setPath("CUMPLIDOS_PROVEEDORES_CRUD_SERVICE");
        return this.requestManager.get(endpoint);
    }


    post(endpoint: any, element: any) {
        this.requestManager.setPath('CUMPLIDOS_PROVEEDORES_MID_SERVICE');
        return this.requestManager.post(endpoint, element);
      }

      
    postCumplidosProveedoresCrud(endpoint: any, element: any) {
        this.requestManager.setPath('CUMPLIDOS_PROVEEDORES_CRUD_SERVICE');
        return this.requestManager.post(endpoint, element);
      }
      getDocumnetosCrud(endpoint : any){
        this.requestManager.setPath("DOCUMENTOS_CRUD");
        return this.requestManager.get(endpoint);
    }



    postFirmaElectronica (endpoint:any , element :any){ 
        this.requestManager.setPath('FIRMA_ELECTRONICA_MID');
    return this.requestManager.post(endpoint, element); 

}



}
