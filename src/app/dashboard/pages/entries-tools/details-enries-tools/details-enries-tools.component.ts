import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Entries } from 'src/app/dashboard/interfaces/entriesInterfaces';
import { EntriesToolsService } from 'src/app/dashboard/services/entries-tools.service';

@Component({
  selector: 'app-details-enries-tools',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl:'./details-entries-tools.component.html',
  styleUrls: ['./details-enries-tools.component.css'],
  
})
export class DetailsEnriesToolsComponent { 

  entrada: Entries;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entryService: EntriesToolsService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.entryService.getEntryById(id).subscribe((data: any) => {
      this.entrada = data;     
    });
  }

  editEntry(entry: Entries) {
    this.router.navigate(['dashboard/edit-entry-tools', entry.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-entries-tools']);
  }
}
