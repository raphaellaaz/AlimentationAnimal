import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Component, inject, model, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { IngredienteModel } from '../../../models/ingrediente.model';

import { IngredientesService } from '../../../services/ingredientes-service.service';
import { IngredienteConPrecio } from '../../../interfaces/ingrediente_interfaces';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-searchingrediente-inp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './search-inp.component.html',
  styleUrl: './search-inp.component.css',
})
export class SearchInpComponent implements OnInit {
  @Output() selectionChange = new EventEmitter<IngredienteConPrecio[]>();

  myControl = new FormControl('');

  optionsIngredientes: IngredienteModel[] = []; //api data from endpoint
  filteredOptions!: Observable<IngredienteModel[]>;
  // Lista de seleccionados

  selectedIngrediente!: IngredienteModel;
  ingredientesConPrecio: IngredienteConPrecio[] = [];

  constructor(private ingredienteService: IngredientesService) {}

  ngOnInit() {
    this.ingredienteService.ingredienteSeleccionado$.subscribe(ingredientes => {
      if (ingredientes === null) {
        this.ingredientesConPrecio = [];
      }
    });

    this.ingredienteService.getAllIngredientes().subscribe((data) => {
      this.optionsIngredientes = data.map(
        (ingredientes: IngredienteModel) => ingredientes
      );
      console.log(this.optionsIngredientes);
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

    dialog = inject(MatDialog);
  
    openDialog() {
      const dialogRef = this.dialog.open(DialogIngrediente, {
        width: '500px',
        data: {
          ingrediente: this.selectedIngrediente,
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Precio seleccionada desde diálogo:', result);
          // Aquí puedes guardar la etapa seleccionada en tu componente principal

          const index = this.ingredientesConPrecio.findIndex(
            ing => ing.id === this.selectedIngrediente.id
          );
          
          if (index !== -1) {
            // Si ya existe, actualizar el precio
            this.ingredientesConPrecio[index].precio = parseFloat(result);
          } else {

            console.log("Dentrod e Else", this.selectedIngrediente.PB____);
            this.ingredientesConPrecio.push({
              id: this.selectedIngrediente.id,
              Nombre_Ingrediente: this.selectedIngrediente.Nombre_Ingrediente, // Copia todas las propiedades de IngredienteModel
              precio: parseFloat(result), // Agrega el campo precio
              //peso: 1, // Asignar un valor predeterminado si falta


              // Transferir nutrientes
              NUTRIENTES: {
                PB____: this.selectedIngrediente.PB____ || 0, //PROTEINA BRUTA
                EE____: this.selectedIngrediente.EE____ || 0,
                EE_VERD____: this.selectedIngrediente.EE_VERD____ || 0,
                FB____: this.selectedIngrediente.FB____ || 0,
                FND____: this.selectedIngrediente.FND____ || 0,
                FAD____: this.selectedIngrediente.FAD____ || 0,
                LAD____: this.selectedIngrediente.LAD____ || 0,
                ALMIDON____: this.selectedIngrediente.ALMIDON____ || 0,
                AZUCARES____: this.selectedIngrediente.AZUCARES____ || 0,
                SUMA____: this.selectedIngrediente.SUMA____ || 0,
                C14_0____: this.selectedIngrediente.C14_0____ || 0,
                C16_0____: this.selectedIngrediente.C16_0____ || 0,
                C16_1____: this.selectedIngrediente.C16_1____ || 0,
                C18_0____: this.selectedIngrediente.C18_0____ || 0,
                C18_1____: this.selectedIngrediente.C18_1____ || 0,
                C18_2____: this.selectedIngrediente.C18_2____ || 0,
                C18_3____: this.selectedIngrediente.C18_3____ || 0,
                C_20____: this.selectedIngrediente.C_20____ || 0,
                Ca____: this.selectedIngrediente.Ca____ || 0,
                P____: this.selectedIngrediente.P____ || 0,
                Pf_tico____: this.selectedIngrediente.Pf_tico____ || 0,
                Pdisp_AVES____: this.selectedIngrediente.Pdisp_AVES____ || 0,
                Pdig_AVES____: this.selectedIngrediente.Pdig_AVES____ || 0,
                Pdig_PORC____: this.selectedIngrediente.Pdig_PORC____ || 0,
                Na____: this.selectedIngrediente.Na____ || 0,
                Cl____: this.selectedIngrediente.Cl____ || 0,
                Mg____: this.selectedIngrediente.Mg____ || 0,
                K____: this.selectedIngrediente.K____ || 0,
                S____: this.selectedIngrediente.S____ || 0,
                Cu_ppm: this.selectedIngrediente.Cu_ppm || 0,
                Fe_ppm: this.selectedIngrediente.Fe_ppm || 0,
                Mn_ppm: this.selectedIngrediente.Mn_ppm || 0,
                Zn_ppm: this.selectedIngrediente.Zn_ppm || 0,
                Vit__E_ppm: this.selectedIngrediente.Vit__E_ppm || 0,
                Biotina_ppm: this.selectedIngrediente.Biotina_ppm || 0,
                Colina_ppm: this.selectedIngrediente.Colina_ppm || 0,
              },

              ENERGIA: {

                EM_RTES_Kcal_kg: this.selectedIngrediente.EM_RTES_Kcal_kg || 0, // Transferir energía
                UFL_UF_kg: this.selectedIngrediente.UFL_UF_kg || 0,
                UFC_UF_kg: this.selectedIngrediente.UFC_UF_kg || 0,
                ENL_RTES_Kcal_kg: this.selectedIngrediente.ENL_RTES_Kcal_kg || 0,
                ENM_RTES_Kcal_kg: this.selectedIngrediente.ENM_RTES_Kcal_kg || 0,
                ENC_RTES_Kcal_kg: this.selectedIngrediente.ENC_RTES_Kcal_kg || 0,
                ALM_SOLUBLE____: this.selectedIngrediente.ALM_SOLUBLE____ || 0,
                ALM_DEGRAD____: this.selectedIngrediente.ALM_DEGRAD_____ || 0,
                ED_PORC_Kcal_kg: this.selectedIngrediente.ED_PORC_Kcal_kg || 0,
                EM_PORC_Kcal_kg: this.selectedIngrediente.EM_PORC_Kcal_kg || 0,
                EN_PORC_Kcal_kg: this.selectedIngrediente.EN_PORC_Kcal_kg || 0,
                EN_CERDAS_Kcal_kg: this.selectedIngrediente.EN_CERDAS_Kcal_kg || 0,
                EMA_POLLIT_Kcal_kg: this.selectedIngrediente.EMA_POLLIT_Kcal_kg || 0,
                EMA_AVES_Kcal_kg: this.selectedIngrediente.EMA_AVES_Kcal_kg || 0,
                ED_CONEJOS_Kcal_kg: this.selectedIngrediente.ED_CONEJOS_Kcal_kg || 0,
                ED_CABALLO_Kcal_kg: this.selectedIngrediente.ED_CABALLO_Kcal_kg || 0,
              },
              DIGESTIBILIDAD:{
                PBDIG_RUM____: this.selectedIngrediente.PBDIG_RUM____ || 0, // Transferir digestibilidad
                PBDIG_PORC____: this.selectedIngrediente.PBDIG_PORC____ || 0,
                PBDIG_AVES____: this.selectedIngrediente.PBDIG_AVES____ || 0,
                PBDIG_CON____: this.selectedIngrediente.PBDIG_CON____ || 0,
                PBDIG_CAB____: this.selectedIngrediente.PBDIG_CAB____ || 0,
                PDIA____: this.selectedIngrediente.PDIA____ || 0,
                PDIE____: this.selectedIngrediente.PDIE____ || 0,
                PDIN____: this.selectedIngrediente.PDIN____ || 0,
                LYS___PDIE_: this.selectedIngrediente.LYS___PDIE_ || 0,
                MET___PDIE_: this.selectedIngrediente.MET___PDIE_ || 0,
                LYS____: this.selectedIngrediente.LYS____ || 0,
                MET____: this.selectedIngrediente.MET____ || 0,
                M_C____: this.selectedIngrediente.M_C____ || 0,
                THR____: this.selectedIngrediente.THR____ || 0,
                TRP____: this.selectedIngrediente.TRP____ || 0,
                ILE____: this.selectedIngrediente.ILE____ || 0,
                VAL____: this.selectedIngrediente.VAL____ || 0,
                ARG____: this.selectedIngrediente.ARG____ || 0,
                GLYeq____: this.selectedIngrediente.GLYeq____ || 0,
                LYS_DIA____: this.selectedIngrediente.LYS_DIA____ || 0,
                MET_DIA____: this.selectedIngrediente.MET_DIA____ || 0,
                M_C_DIA____: this.selectedIngrediente.M_C_DIA____ || 0,
                THR_DIA____: this.selectedIngrediente.THR_DIA____ || 0,
                TRP_DIA____: this.selectedIngrediente.TRP_DIA____ || 0,
                ILE_DIA____: this.selectedIngrediente.ILE_DIA____ || 0,
                VAL_DIA____: this.selectedIngrediente.VAL_DIA____ || 0,
                ARG_DIA____: this.selectedIngrediente.ARG_DIA____ || 0,
                GLYeq_DIA____: this.selectedIngrediente.GLYeq_DIA____ || 0,
                LYS_DIS____: this.selectedIngrediente.LYS_DIS____ || 0,
                MET_DIS____: this.selectedIngrediente.MET_DIS____ || 0,
                M_C_DIS____: this.selectedIngrediente.M_C_DIS____ || 0,
                THR_DIS____: this.selectedIngrediente.THR_DIS____ || 0,
                TRP_DIS____: this.selectedIngrediente.TRP_DIS____ || 0,
                ILE_DIS____: this.selectedIngrediente.ILE_DIS____ || 0,
                VAL_DIS____: this.selectedIngrediente.VAL_DIS____ || 0,
                ARG_DIS____: this.selectedIngrediente.ARG_DIS____ || 0,
                GLYeq_DIS____: this.selectedIngrediente.GLYeq_DIS____ || 0,
                LYS_DR____: this.selectedIngrediente.LYS_DR____ || 0,
                MET_DR____: this.selectedIngrediente.MET_DR____ || 0,
                M_C_DR____: this.selectedIngrediente.M_C_DR____ || 0,
                THR_DR____: this.selectedIngrediente.THR_DR____ || 0,
                TRP_DR____: this.selectedIngrediente.TRP_DR____ || 0,
                ILE_DR____: this.selectedIngrediente.ILE_DR____ || 0,
                VAL_DR____: this.selectedIngrediente.VAL_DR____ || 0,
                ARG_DR____: this.selectedIngrediente.ARG_DR____ || 0,
                GLYeq_DR____: this.selectedIngrediente.GLYeq_DR____ || 0,
              },
              MISC:{
                HUMEDAD____: this.selectedIngrediente.HUMEDAD____ || 0,
                CENIZAS____: this.selectedIngrediente.CENIZAS____ || 0,
              },
             
            });
            
            console.log("Ingrediente con precio",this.ingredientesConPrecio);
          }

          
          
          //this.selectedIngredientes = result; // Si quieres guardar solo la seleccionada
          this.ingredienteService.setIngredienteSeleccionado(this.ingredientesConPrecio); /// pasar model con precio en dialog
          this.selectionChange.emit(this.ingredientesConPrecio);
        }
      });
    }


  private _filter(value: string): IngredienteModel[] {

    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';

    return this.optionsIngredientes.filter((option) =>
      option.Nombre_Ingrediente.toLowerCase().includes(filterValue)
    );
  }

  onShowInputPrice(event: any) {
    this.selectedIngrediente = event.option.value;

    this.openDialog();

    this.myControl.setValue('');
  }

  removeItem(item: IngredienteConPrecio) {
    const index = this.ingredientesConPrecio.findIndex(
      (ingrediente) => ingrediente.id === item.id
    );

    if (index !== -1) {
      this.ingredientesConPrecio.splice(index, 1);
      this.ingredienteService.setIngredienteSeleccionado(this.ingredientesConPrecio);
      this.selectionChange.emit(this.ingredientesConPrecio);
    }
  }
}

@Component({
  selector: 'dialog-ingrediente-precio',
  templateUrl: 'dialog-ingrediente.html',
  styleUrl: 'dialog-ingrediente.css',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    CommonModule
  ],
})
export class DialogIngrediente implements OnInit {
  data = inject(MAT_DIALOG_DATA);

  dialogRef = inject(MatDialogRef<DialogIngrediente>);

  optionsIngredientePrecio: IngredienteConPrecio[] = [];
  form: FormGroup;
  ingredienteControl = new FormControl();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      precio: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.ingredienteControl.setValue(this.data.ingrediente);
    console.log(this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}