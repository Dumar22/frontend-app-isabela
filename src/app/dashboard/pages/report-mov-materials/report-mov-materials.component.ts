import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntriesService } from '../../services/entries.service';
import { Router } from '@angular/router';
import { UiModulesModule } from '../../components/ui-modules/ui-modules.module';

@Component({
  selector: 'app-report-mov-materials',
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule, UiModulesModule
  ],
  templateUrl: './report-mov-materials.component.html',
  styleUrls: ['./report-mov-materials.component.css'],
  
})
export class ReportMovMaterialsComponent { 

  startDate: string;
  endDate: string;
  reportForm: FormGroup;
  constructor(private entryService: EntriesService,
    private fb: FormBuilder,
    private router: Router) { }

    ngOnInit(): void{

      
      this.reportForm = this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
      });
     };
  
  
     

  downloadExcel(): void {
    if (this.reportForm.valid) {
      const dates = this.reportForm.value;

      this.entryService.reportExcelEntry(dates).subscribe(
        (response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = `Reporte_${dates.startDate}_to_${dates.endDate}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        (error) => {
          console.error('Error downloading the file', error);
        }
      );
    }
  }
}
