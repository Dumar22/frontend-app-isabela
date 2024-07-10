import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Provider } from 'src/app/dashboard/interfaces/providerInterface';
import { ProviderService } from '../../../services/provider.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { UiModulesModule } from 'src/app/dashboard/components/ui-modules/ui-modules.module';

@Component({
  selector: 'list-providers',
  standalone: true,
  imports: [CommonModule,UiModulesModule],
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.css']
})
export class ListProvidersComponent {
  
  public providers: any[] = [];  
  public providerTemp: Provider[] = [];
  public loading: boolean = true;  
  public providersCount: number = 0;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
 

  constructor(private providerService: ProviderService,    
    private router: Router) { }

  ngOnInit(): void{
    this.getListProviders();
    };
 
   getListProviders(){
    this.loading = true;
     this.providerService.getProviders()
  .subscribe((data: any) => {    
    this.providers = data;
    this.providers.sort((a, b) => a.name.localeCompare(b.name));
    this.providerTemp = data;  
    this.loading = false;
    } );
   }

   onTableDataChange(event: any) {
    this.page = event;
    this.getListProviders();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getListProviders();
  }

   //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.providers = this.providerTemp;
    return ;
  }
   this.providerService.searchProvider( term )
        .subscribe( resp => {
          this.providers = resp;
        });
  }



   deleteProvider(provider:Provider) {


    Swal.fire({
      title: '¿Borrar proveedor?',
      text: `Esta a punto de borrar a ${ provider.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {

        this.providerService.deleteProvider( provider )
          .subscribe( resp => {

            this.getListProviders();
            Swal.fire(
              'Porveedor borrado',
              `${ provider.name } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })
  }

  updateProvider(provider: Provider){
    this.router.navigate(['dashboard/editprovider/',provider.id]);
  }

  addProvider():void{
    this.router.navigate(['dashboard/addprovider']);
  }

}
