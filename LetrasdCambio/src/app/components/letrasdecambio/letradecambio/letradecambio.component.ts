import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-letradecambio',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [MatCheckboxModule,MatDatepickerModule,FormsModule,MatInputModule, MatFormFieldModule,MatSelectModule,MatButtonModule,MatIconModule,ReactiveFormsModule,CommonModule],
  templateUrl: './letradecambio.component.html',
  styleUrl: './letradecambio.component.css'
})
export class LetradecambioComponent {
  disableSelect = new FormControl(false);
  form:FormGroup=new FormGroup({});
  monto: number = 0;
  fechaVencimiento: string = '';
  deudor: string = '';
  acreedor: string = '';
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
  constructor(private formBuilder:FormBuilder){}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      hmonto: ['', Validators.required],
      hfecha: ['', Validators.required],
      hfecha2: ['', Validators.required],
      hdeudor: ['', Validators.required],
      hacredor: ['', Validators.required],
      hcurso: ['', Validators.required],
      htasa: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      htasar: [{ value: '', disabled: true }, [Validators.min(0), Validators.max(100)]], // Inicialmente deshabilitado
      aplicarRetencion: [false] // Control para el checkbox
    });

    // Escuchar cambios en el checkbox y habilitar/deshabilitar la tasa de retención
    this.form.get('aplicarRetencion')?.valueChanges.subscribe((valor) => {
      if (valor) {
        this.form.get('htasar')?.enable();
      } else {
        this.form.get('htasar')?.disable();
        this.form.get('htasar')?.setValue(''); // Limpiar el campo si se deshabilita
      }
    });
  }

  generarLetra(): void {
    console.log('Letra de Cambio Generada:', {
      monto: this.form.value.hmonto,
      fechaVencimiento: this.form.value.hfecha,
      deudor: this.form.value.hdeudor,
      acreedor: this.form.value.hacredor
    });
  }
  aplicarRetenciones() {
    console.log("Aplicando retenciones...");
    // Aquí puedes agregar la lógica de cálculo de retenciones según tu necesidad.
  }
}
