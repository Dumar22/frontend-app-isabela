import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Entries } from 'src/app/dashboard/interfaces/entriesInterfaces';
import Swal from 'sweetalert2';
import { EntriesToolsService } from '../../../services/entries-tools.service';

@Component({
  selector: 'app-list-entries-tools',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './list-entries-tools.component.html',
  styleUrls: ['./list-entries-tools.component.css'],
  
})
export class ListEntriesToolsComponent { 

  route: [] = [];

  public entry: any[] = [];
  public factura : Entries;
  public entryTemp: Entries[] = [];
  public loading: boolean = true;

  constructor(private entryService: EntriesToolsService,
    private router: Router) { }

    ngOnInit(): void{

      this.getListEntries();
  
     };
  
  
     getListEntries(){
  
      this.loading = true;
      this.entryService.getEntries()
      .subscribe((data:any) =>{        
        this.entry = data;
        //console.log(data);        
        this.entryTemp = data;
        this.loading = false;
      } );
     }


     //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.entry = this.entryTemp;
    return ;
  }
   this.entryService.searchEntry( term )
        .subscribe( resp => {
          this.entry = resp;
        });
  }

  downloadEntry(entry: Entries) {
    const id = entry.id; // replace with your transfer ID
    const entryNumber = entry.entryNumber;
    this.entryService.downloadPDF(id).subscribe((data: ArrayBuffer) => {
      // Crea un Blob a partir del ArrayBuffer recibido
      const blob = new Blob([data], { type: 'application/pdf' });
    
      // Crea una URL para el Blob y utiliza un enlace <a> para iniciar la descarga del archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Entrada_${entryNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
 
    
     
    });
  }
  
  detailsEntry(entry: Entries){      
  this.router.navigate(['dashboard/details-entries-tools', entry.id]);
  }

  deleteEntry(entry: Entries) {   

    Swal.fire({
      title: '¿Borrar entrada?',
      text: `Esta a punto de borrar a ${ entry.entryNumber }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {

        this.entryService.deleteEntry( entry )
          .subscribe( resp => {

            this.getListEntries();
            Swal.fire(
              'Usuario borrado',
              `${ entry.entryNumber } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })


  }

addEntry(){
    this.router.navigate(['dashboard/add-entry-tools']);
  }
  
editEntry(entry: Entries) {
  this.router.navigate(['dashboard/edit-entry-tools', entry.id]);
}
}
