import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-edet-details-assignment-materials-vehicle',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>add-edet-details-assignment-materials-vehicle works!</p>`,
  styleUrls: ['./add-edet-details-assignment-materials-vehicle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEdetDetailsAssignmentMaterialsVehicleComponent { }
