import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transfers } from 'src/app/dashboard/interfaces/transferInterface';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferServiceService } from 'src/app/dashboard/services/transfer-service.service';
import { Material } from 'src/app/dashboard/interfaces/materialsInterface';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-transfer.component.html',
  styleUrls: ['./details-transfer.component.css']
})
export class DetailsTransferComponent {
  
  transfer: Transfers

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transferService: TransferServiceService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.transferService.getTransfersById(id).subscribe((data: Transfers) => {
      this.transfer = data;               
     });
  }

  editTransfer(transfer: Transfers) {
    this.router.navigate(['dashboard/edit-transfer', transfer.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-trasfers']);
  }
  
}
