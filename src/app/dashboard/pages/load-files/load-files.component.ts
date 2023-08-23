import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-load-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './load-files.component.html',
  styleUrls: ['./load-files.component.css']
})
export class LoadFilesComponent {

  imageUrl: string = '../../../../assets/loadExcel1.png';


  fileLoaded: boolean;


  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // Aquí puedes procesar el archivo según tus necesidades
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    const dropArea = document.getElementById('drop-area');
    dropArea.classList.add('drag-over');
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    const dropArea = document.getElementById('drop-area');
    dropArea.classList.remove('drag-over');
  }
  
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El archivo seleccionado no es un archivo de Excel',
      });
      this.fileLoaded = false;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageUrl = reader.result as string;
      this.fileLoaded = true;
    };
  }

  onFileRemoved() {
    this.imageUrl = '';
    this.fileLoaded = false;
  }


}
