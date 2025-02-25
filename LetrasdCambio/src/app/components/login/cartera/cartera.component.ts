import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Carteras } from '../../../models/Carteras';
import { CarterasService } from '../../../services/carteras.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartera',
  providers: [provideNativeDateAdapter()],
    standalone: true,
  imports: [MatCheckboxModule, MatDatepickerModule, FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './cartera.component.html',
  styleUrl: './cartera.component.css'
})
export class CarteraComponent {
  cartera: Carteras = new Carteras();
  form: FormGroup = new FormGroup({});
  listaMonedas = [
    { id_moneda: 'USD', nombre: 'Dólar Estadounidense' },
    { id_moneda: 'EUR', nombre: 'Euro' },
    { id_moneda: 'PEN', nombre: 'Sol Peruano' },
    { id_moneda: 'GBP', nombre: 'Libra Esterlina' },
    { id_moneda: 'JPY', nombre: 'Yen Japonés' },
    { id_moneda: 'CNY', nombre: 'Yuan Chino' },
    { id_moneda: 'CHF', nombre: 'Franco Suizo' },
    { id_moneda: 'CAD', nombre: 'Dólar Canadiense' },
    { id_moneda: 'AUD', nombre: 'Dólar Australiano' },
    { id_moneda: 'BRL', nombre: 'Real Brasileño' },
    { id_moneda: 'MXN', nombre: 'Peso Mexicano' },
    { id_moneda: 'ARS', nombre: 'Peso Argentino' },
    { id_moneda: 'COP', nombre: 'Peso Colombiano' },
    { id_moneda: 'CLP', nombre: 'Peso Chileno' },
    { id_moneda: 'INR', nombre: 'Rupia India' },
    { id_moneda: 'KRW', nombre: 'Won Surcoreano' }
  ];
  constructor(private formBuilder: FormBuilder,private cS:CarterasService,private snackBar: MatSnackBar,private router: Router) { }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      hfecha2: ['', Validators.required],
      hacredor: ['', Validators.required],
      hmoneda: ['', Validators.required]
    })
  }

  generarCartera(): void {
    if (this.form.valid) {
      this.cartera.moneda = this.form.get('hmoneda')?.value;
      this.cartera.acreedor = this.form.get('hacredor')?.value;
      this.cartera.fechad= this.form.get('hfecha2')?.value;
      this.cartera.tcea=0;
    }
    this.cS.insert(this.cartera).subscribe(d => {

      this.cS.list().subscribe(data => { this.cS.setList(data); });

      console.log('Cartera registrada');
      this.snackBar.open('Cartera registrada', 'Cerrar', {
        duration: 3000,  // Duración del mensaje (3 segundos)
        verticalPosition: 'top', // Posición superior
        horizontalPosition: 'center', // Posición centrada
        panelClass: ['snackbar-success'] // Clase personalizada (opcional)
      }); this.router.navigate(['letrasdecambio/carteralist']);
    });
  }
}
