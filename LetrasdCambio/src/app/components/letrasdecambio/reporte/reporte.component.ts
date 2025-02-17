import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Letrasdecambio } from '../../../models/Letrasdecambio';
import { LetradecambioService } from '../../../services/letradecambio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-reporte',
  imports: [MatTableModule,MatPaginatorModule,FormsModule, ReactiveFormsModule,MatNativeDateModule, CommonModule,MatDatepickerModule,MatInputModule, MatFormFieldModule],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent {
  letras: any[] = [];
  form: FormGroup;
  displayedColumns:string[]=['c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12']
  dataSource:MatTableDataSource<Letrasdecambio>= new MatTableDataSource()
   @ViewChild(MatPaginator) paginator!: MatPaginator;

  

  constructor(private letraService: LetradecambioService,private fb: FormBuilder) {
     // Formulario reactivo para la fecha
     this.form = this.fb.group({
      fechaBusqueda: ['']
    });
  }

  ngOnInit(): void {
    this.buscarPorFecha(); // Si quieres cargar los datos al iniciar
  }

  buscarPorFecha(): void {
    const fecha = this.form.get('fechaBusqueda')?.value;  // Obtener la fecha del formulario
    if (fecha) {
      const formattedDate = this.formatDate(fecha); // Formateamos la fecha
      this.letraService.buscarfecha(formattedDate).subscribe((data: any[]) => {
        this.letras = data;
        this.dataSource = new MatTableDataSource(this.letras);  // Asignamos los datos al datasource
      });
    }
  }

  // Función para formatear la fecha al formato correcto
  formatDate(date: any): string {
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split('T')[0];  // Formato yyyy-MM-dd
  }
  
}
