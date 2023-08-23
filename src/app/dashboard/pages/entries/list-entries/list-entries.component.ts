import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from 'src/app/dashboard/services/search.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Entries } from 'src/app/dashboard/interfaces/entriesInterfaces';
import { EntriesService } from 'src/app/dashboard/services/entries.service';

@Component({
  selector: 'app-list-innvoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-entries.component.html',
  styleUrls: ['./list-entries.component.css']
})
export class ListEntriesComponent {
  
  route: [] = [];

  public entry: any[] = [];
  public factura : Entries;
  public entryTemp: Entries[] = [];
  public loading: boolean = true;

  constructor(private entryService: EntriesService,
    private searchService: SearchService,
    private router: Router) { }

    ngOnInit(): void{

      this.getListEntries();
  
     };
  
  
     getListEntries(){
  
      this.loading = true;
      this.entryService.getEntries()
      .subscribe((data:any) =>{        
        this.entry = data.entries;
        //console.log(data);        
        this.entryTemp = data.entries;
        this.loading = false;
      } );
     }


     //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.entry = this.entryTemp;
    return ;
  }
   this.searchService.search('invoices', term )
        .subscribe( resp => {
          this.entry = resp;
        });
  }

  downloadEntry(entry: Entries) {
    console.log('dowload',entry.id);
    
    this.entryService.downloadEntryPDF(entry.id)
    .subscribe(response => {
      
      const url = window.URL.createObjectURL(response);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${entry.entryNumber}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);

    });
  }
  
  detailsEntry(entry: Entries){      
  this.router.navigate(['dashboard/details-entries', entry.id]);
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
    this.router.navigate(['dashboard/add-entry']);
  }
  
editEntry(entry: Entries) {
  this.router.navigate(['dashboard/edit-entry', entry.id]);
}

  

}
