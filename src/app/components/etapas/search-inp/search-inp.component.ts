import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Component, OnInit, inject, model } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { EtapasService } from '../../../services/etapas-service.service';
import { EspeciesService } from '../../../services/especies-service.service';

import { EtapaModel } from '../../../models/etapa-desarrollo.model';
import { EspecieModel } from '../../../models/especie.model';

@Component({
  selector: 'app-searchetapa-inp',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './search-inp.component.html',
  styleUrl: './search-inp.component.css',
})
export class SearchInpComponent implements OnInit {
  allEtapas: EtapaModel[] = []; //api data from endpoint
  optionsEtapas: EtapaModel[] = []; //Guardar datos de etapas filter by id especie
  // Lista de seleccionados
  selectedEtapas: EtapaModel;
  especieSelected!: EspecieModel;

  readonly disabled = model(true);

  constructor(
    private apiEtapas: EtapasService,
    private especieService: EspeciesService
  ) {
    this.selectedEtapas = {
      id_etapa: 0,
      id_especie: 0,
      nombre_etapa: '',
      edad_inicio: 0,
      edad_fin: 0,
    };
  }

  ngOnInit(): void {
    this.apiEtapas.getAllEtapas().subscribe((data) => {
      this.allEtapas = data.map((etapas: EtapaModel) => ({
        id_etapa: etapas.id_etapa,
        id_especie: etapas.id_especie,
        nombre_etapa: etapas.nombre_etapa,
        edad_inicio: etapas.edad_inicio,
        edad_fin: etapas.edad_fin,
        descripcion: etapas.descripcion,
      }));
      console.log(this.allEtapas);
    });

    this.especieService.especieSeleccionada$.subscribe((especie) => {
      this.disabled.set(especie === null);

      if (especie !== null) {
        this.especieSelected = especie;
        //console.log('ID de Especie recibido:', this.especieSelected);

        // Filtrar y mapear las etapas una vez que tenemos el id_especie
        this.optionsEtapas = this.allEtapas.filter(
          (etapas: EtapaModel) => etapas.id_especie === this.especieSelected.id_especie
        );
        //console.log(this.optionsEtapas); // Aquí debería salir el resultado filtrado
      }
    });
  }

  dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogEtapa, {
      width: '800px',
      data: {
        data: this.optionsEtapas,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Etapa seleccionada desde diálogo:', result);
        // Aquí puedes guardar la etapa seleccionada en tu componente principal
        this.selectedEtapas = result; // Si quieres guardar solo la seleccionada
        this.apiEtapas.setEtapaSeleccionada(this.selectedEtapas)
      }
    });
  }
}

@Component({
  selector: 'dialog-etapa',
  templateUrl: 'dialog-etapa.html',
  styleUrl: './dialog-etapa.css',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
  ],
})
export class DialogEtapa implements OnInit {
  data = inject(MAT_DIALOG_DATA);

  dialogRef = inject(MatDialogRef<DialogEtapa>);

  optionsEtapas: EtapaModel[] = [];
  form: FormGroup;
  etapasControl = new FormControl();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      etapa: this.etapasControl,
    });
  }

  ngOnInit() {
    // Acceder correctamente a los datos pasados
    this.optionsEtapas = this.data.data;
    console.log('Opciones de etapas en dialog:', this.optionsEtapas);
  }

  onOptionSelected(etapa: any) {
    const selectedValue = this.etapasControl.value[0];
    this.dialogRef.close(selectedValue);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
