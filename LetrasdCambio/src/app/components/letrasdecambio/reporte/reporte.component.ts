import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Letrasdecambio } from '../../../models/Letrasdecambio';
import { LetradecambioService } from '../../../services/letradecambio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-reporte',
  imports: [FormsModule, ReactiveFormsModule,MatNativeDateModule, CommonModule,MatDatepickerModule,MatInputModule, MatFormFieldModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent {
  form: FormGroup;
  letras: Letrasdecambio[] = [];

  constructor(
    private fb: FormBuilder,
    private lS: LetradecambioService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      fechaBusqueda: ['']
    });
  }

  ngOnInit(): void {}

  buscarPorFecha(): void {
    if (this.form.valid) {
      const fechaSeleccionada: Date = this.form.get('fechaBusqueda')?.value;
  
      if (fechaSeleccionada) {
        // Convertir la fecha a formato YYYY-MM-DD
        const fechaFormateada = fechaSeleccionada.toISOString().split('T')[0];
  
        // Llamar al servicio con la fecha formateada
        this.lS.buscarfecha(fechaFormateada).subscribe({
          next: (data) => {
            this.letras = data;
          },
          error: (err) => {
            console.error("Error al buscar letras de cambio:", err);
            this.letras = [];
          }
        });
      }
    }
  }
  
}
