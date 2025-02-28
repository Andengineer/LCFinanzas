import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatButtonModule } from '@angular/material/button';
import { Carteras } from '../../../models/Carteras';
import { CarterasService } from '../../../services/carteras.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-reportexcartera',
  imports: [MatCheckboxModule,MatSelectModule,MatButtonModule, MatTableModule, MatPaginatorModule, FormsModule, MatIcon, ReactiveFormsModule, MatNativeDateModule, CommonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './reportexcartera.component.html',
  styleUrl: './reportexcartera.component.css'
})
export class ReportexcarteraComponent {
  listaAcreedores: Carteras[] = []
  letras: any[] = [];
  form: FormGroup;
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12','c13', 'accion01']
  dataSource: MatTableDataSource<Letrasdecambio> = new MatTableDataSource()
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  constructor(private letraService: LetradecambioService, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private cS: CarterasService) {
    // Formulario reactivo para la fecha
    this.form = this.formBuilder.group({
      hacredor: ['']
    });
  }

  ngOnInit(): void {
    this.buscarPorCartera(); // Si quieres cargar los datos al iniciar
     //para la lista foranea de asociados
     this.cS.list().subscribe(data => {
      this.listaAcreedores = data
    })
  }

  buscarPorCartera(): void {
    const carteraId = this.form.get('hacredor')?.value; // Obtener la cartera seleccionada
    if (carteraId) {
      this.letraService.list().subscribe(data => {
        // Filtra las letras de cambio asociadas a la cartera seleccionada
        const filteredLetras = data.filter((element: Letrasdecambio) => element.cartera.id_cartera === carteraId);

        if (filteredLetras.length > 0) {
          this.letras = filteredLetras;
          this.dataSource = new MatTableDataSource(this.letras);
        } else {
          this.letras = [];
          this.dataSource = new MatTableDataSource(this.letras);
        }
      });
    }
  }
  eliminar(id: number): void {
    this.letraService.delete(id).subscribe(
      () => {
        // Recargar la lista después de eliminar
        this.letraService.list().subscribe(data => {
          this.letraService.setList(data);
          this.snackBar.open('Elemento eliminado correctamente.', 'Cerrar', {
            duration: 3000,
          });
        });
      },
      error => {
        // Manejar el error de clave foránea
        if (error.status === 409) { // Ajusta el código de error si es necesario
          this.snackBar.open('Elimine el dato foráneo antes de eliminar este registro.', 'Cerrar', {
            duration: 5000,
          });
        } else {
          this.snackBar.open('Existe un elemento foraneo que depende de este, eliminelo antes de eliminar este', 'Cerrar', {
            duration: 3000,
          });
        }
      }
    );
  }
}
