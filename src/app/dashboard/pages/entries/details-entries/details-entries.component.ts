import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EntriesService } from 'src/app/dashboard/services/entries.service';
import { Entries } from 'src/app/dashboard/interfaces/entriesInterfaces';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-entries.component.html',
  styleUrls: ['./details-entries.component.css']
})
export class DetailsEntriesComponent {
  entrada: Entries;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entryService: EntriesService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.entryService.getEntryById(id).subscribe((data: any) => {
      this.entrada = data;     
    });
  }

  editEntry(entry: Entries) {
    this.router.navigate(['dashboard/edit-entry', entry.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-entries']);
  }
  
}
