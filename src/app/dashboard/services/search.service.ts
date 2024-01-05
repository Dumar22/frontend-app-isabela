import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { map } from 'rxjs/operators';

import { User } from '../interfaces/usersInterface';
import { MaterialClass } from '../interfaces/materialsInterface';
import { CollaboratorClass } from '../interfaces/collaboratorInterface';
import { InvoiceClass } from '../interfaces/invoiceInterface';
import { WarehouseC } from '../interfaces/warehouseInterface';
import { ProviderC } from '../interfaces/providerInterface';
import { MeterClass } from '../interfaces/metersInterface';
import { WorkRegisterC } from '../interfaces/workRegisterInterface';
import { ExitC } from '../interfaces/exitInterfaces';


const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }


  private transformarUsuarios( resultados: any[] ): User[] {

    return resultados.map(
      user => new User( 
        user.id ,
        user.name, 
        user.user, 
        user.status, 
        user.rol,
        user.warehouse )
    );
  }

  private transformarWarehouses( resultados: any[] ): WarehouseC[] {

    return resultados.map(
      warehouse => new WarehouseC( warehouse.id ,warehouse.name  )
    );
  }
  private transformarProviders( resultados: any[] ): ProviderC[] {

    return resultados.map(
      provider => new ProviderC( provider.id, provider.name, provider.nit  )
    );
  }
  
  private transformCollabolators( resultados: any[] ): CollaboratorClass[] {
    return resultados.map(
      collaborator => new CollaboratorClass(  
        collaborator.id ,
        collaborator.code,
        collaborator.name,
        collaborator.operation,
        collaborator.document,
        collaborator.phone,
        collaborator.state,
        collaborator.warehouse )
    );
  }

   private transformarExitRegister( resultados: any[] ): ExitC[] {

    return resultados.map(
      exit => new ExitC( 
      exit.id,
      exit.date,
      exit.exitNumber,
      exit.warehouse, 
      exit.collaboratorCode, 
      exit.collaboratorName ,     
      exit.collaboratorDocument,   
      exit.collaboratorOperation,    
      exit.materialExitDetail )     
    );
  }
   private transformarExit( resultados: any[] ): ExitC[] {

    return resultados.map(
      exit => new ExitC( 
      exit.id,
      exit.date,
      exit.exitNumber,
      exit.warehouse, 
      exit.collaboratorCode, 
      exit.collaboratorName ,     
      exit.collaboratorDocument,   
      exit.collaboratorOperation,    
      exit.materialExitDetail )     
    );
  }
   private transformarWorkInstall( resultados: any[] ): WorkRegisterC[] {

    return resultados.map(
      register => new WorkRegisterC( 
      register.id  ,
      register.registration ,
      register.name ,
      register.ot , 
      register.address , 
      register.phone  )     
    );
  }
   private transformarMeters( resultados: any[] ): MeterClass[] {

    return resultados.map(
      meter => new MeterClass( 
      meter.id ,
      meter.name,
      meter.code,
      meter.unity, 
      meter.quantity, 
      meter.value, 
      meter.serial,  
      meter.brand,    
      meter.available )
    );
  }
   private transformarMaterials( resultados: any[] ): MaterialClass[] {

    return resultados.map(
      material => new MaterialClass( 
      material.id ,
      material.name,
      material.code,
      material.unity, 
      material.quantity, 
      material.value, 
      material.serial,      
      material.available )
    );
  }

   private transformInvoices( resultados: any[] ): InvoiceClass[] {

    return resultados.map(
      invoice => new InvoiceClass( invoice.id, invoice.date, invoice.invoiceNumber, invoice.origin, invoice.providerName, invoice.providerNit, invoice.materialInvoiceDetail)
    );
  }

  search(
      table: 'users'|'materials' | 'meters' |'exit' |'exitregister' |'workinstall' |'providers'|'collaborators'|'invoices'|'warehouses',
      term: string
    ) {

    const url = `${ base_url }/colection/${ table }/${ term }`;
    return this.http.get<any[]>( url, this.headers )
            .pipe(
              map( (resp: any ) => {

                switch ( table ) {
                  case 'users':
                    return this.transformarUsuarios( resp.resultados );                                   

                  case 'collaborators':
                      
                      return this.transformCollabolators( resp.resultados );
                 
                      case 'materials':
                      
                      return this.transformarMaterials( resp.resultados );
                      
                      case 'meters':
                      
                      return this.transformarMeters( resp.resultados );

                  case 'exit':
                      
                      return this.transformarExit( resp.resultados )

                  case 'exitregister':
                      
                      return this.transformarExitRegister( resp.resultados )

                  case 'invoices':
                      
                      return this.transformInvoices( resp.resultados )

                   case 'warehouses':

                     return this.transformarWarehouses( resp.resultados );   
 
                   case 'workinstall':

                     return this.transformarWorkInstall( resp.resultados );   
 
                   case 'providers':

                     return this.transformarProviders( resp.resultados );   
 
                  default:
                    return [];
                }

              })
            );

  }


}
