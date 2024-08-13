import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestManager } from '../managers/requestManager';

@Injectable({
  providedIn: 'root',
})

export class GeneralService{

    constructor(private requestManager:RequestManager){
        this.requestManager.setPath('PROVEEDORES_MID');
    }

    get(endpoint : any){
        this.requestManager.setPath("PROVEEDORES_MID");
        return this.requestManager.get(endpoint);
    }


    
    getCumplidosProveedoresCrud(endpoint : any){
        this.requestManager.setPath("PROVEDORES_CRUD");
        return this.requestManager.get(endpoint);
    }

    
    post(endpoint: any, element: any) {
        this.requestManager.setPath('PROVEEDORES_MID');
        return this.requestManager.post(endpoint, element);
      }

      getDocumnetosCrud(endpoint : any){
        this.requestManager.setPath("DOCUMENTOS_CRUD");
        return this.requestManager.get(endpoint);
    }

    
    

}