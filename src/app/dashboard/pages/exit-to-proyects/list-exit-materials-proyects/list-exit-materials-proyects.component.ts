import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-list-exit-materials-proyects',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>list-exit-materials-proyects works!</p>`,
  styleUrls: ['./list-exit-materials-proyects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListExitMaterialsProyectsComponent { }
