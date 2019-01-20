import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';
import { MedicoService } from './../../services/service.index';
import { Medico } from './../../models/medico.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos:Medico[] = [];

  constructor(public medicosService:MedicoService, private mus:ModalUploadService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos(){
    this.medicosService.cargarMedicos().subscribe( (medicos)=> {
      this.medicos = medicos;
    })
  }

  buscarMedico(termino:string){
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.medicosService.buscarMedicos(termino).subscribe( medicos => this.medicos = medicos)
  }

  borrarMedico(medico:Medico){
    this.medicosService.borrarMedico(medico._id).subscribe(()=> this.cargarMedicos());
  }

}
