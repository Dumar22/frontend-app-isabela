import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Provider } from 'src/app/dashboard/interfaces/providerInterface';
import { ProviderService } from '../../../services/provider.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SearchService } from 'src/app/dashboard/services/search.service';

@Component({
  selector: 'list-providers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.css']
})
export class ListProvidersComponent {
  
  public providers: any[] = [];  
  public providerTemp: Provider[] = [];
  public loading: boolean = true;  
  public providersCount: number = 0;
 

  constructor(private providerService: ProviderService,    
    private searchService: SearchService,
    private router: Router) { }

  ngOnInit(): void{
    this.getListProviders();
    };
 
   getListProviders(){
    this.loading = true;
    this.providerService.getProviders()
    .subscribe((data:any) =>{
      this.providersCount = data.total;
      this.providers = data.providers;
      this.providerTemp = data.providers;
      this.loading = false;
    } );
   }

   //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.providers = this.providerTemp;
    return ;
  }
   this.searchService.search('providers', term )
        .subscribe( resp => {
          this.providers = resp;
        });
  }



   deleteProvider(provider:Provider) {


    Swal.fire({
      title: '¿Borrar usuario?',
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
              'Usuario borrado',
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
