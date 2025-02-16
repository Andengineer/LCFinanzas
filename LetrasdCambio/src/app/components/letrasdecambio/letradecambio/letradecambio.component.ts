import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-letradecambio',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [MatCheckboxModule, MatDatepickerModule, FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './letradecambio.component.html',
  styleUrl: './letradecambio.component.css'
})
export class LetradecambioComponent {
  disableSelect = new FormControl(false);
  form: FormGroup = new FormGroup({});
  importeRetencion: number = 0;
  importeDescuento: number = 0;
  importeSD: number = 0;
  MontoRecibido: number = 0;
  MontoEntregado: number = 0;
  TCEA: number = 0;
  //
  monto: number = 0;
  fechaVencimiento: string = '';
  deudor: string = '';
  acreedor: string = '';
  //
  listtasa = [
    { id: 1, nombre: "Efectiva" },
    { id: 2, nombre: "Nominal" }
  ]
  listatiempos = [
    { id: 1, nombre: "Diaria", dias: 1 },
    { id: 2, nombre: "Semanal", dias: 7 },
    { id: 3, nombre: "Quincenal", dias: 15 },
    { id: 4, nombre: "Mensual", dias: 30 },
    { id: 5, nombre: "Bimestral", dias: 60 },
    { id: 6, nombre: "Trimestral", dias: 90 },
    { id: 7, nombre: "Cuatrimestral", dias: 120 },
    { id: 8, nombre: "Semestral", dias: 180 },
    { id: 9, nombre: "Anual", dias: 360 }
  ];

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
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      hmonto: ['', Validators.required],
      hfecha: ['', Validators.required],
      hfecha2: ['', Validators.required],
      hdeudor: ['', Validators.required],
      hacredor: ['', Validators.required],
      hcurso: ['', Validators.required],
      hcapitalizacion: [{ value: '', disabled: true }], // Inicialmente deshabilitado
      httasa: ['', Validators.required],
      htipotasa: ['', Validators.required],
      htasa: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      htasar: [{ value: '', disabled: true }, [Validators.min(0), Validators.max(100)]],
      aplicarRetencion: [false]
    });
     // Habilitar o deshabilitar `hcapitalizacion` dependiendo de `htipotasa`
  this.form.get('htipotasa')?.valueChanges.subscribe(value => {
    const capitalizacionControl = this.form.get('hcapitalizacion');

    if (value === 'Nominal') {
      capitalizacionControl?.enable();
      capitalizacionControl?.setValidators(Validators.required);
    } else {
      capitalizacionControl?.disable();
      capitalizacionControl?.setValue(null);
      capitalizacionControl?.clearValidators();
    }

    capitalizacionControl?.updateValueAndValidity();
  });

    this.form.get('hfecha')?.valueChanges.subscribe(() => {
      this.calcularDescuento();
      this.calcularTCEA();
    });

    this.form.get('hfecha2')?.valueChanges.subscribe(() => {
      this.calcularDescuento();
      this.calcularTCEA();
    });
    this.form.get('hmonto')?.valueChanges.subscribe(() => {
      this.calcularRetencion();
      this.calcularDescuento();
      this.calcularSD();
      this.generarMontorecibido();
      this.generarMontoentregado();
      this.calcularTCEA();
    });
    this.form.get('htasar')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.generarMontorecibido();
      this.generarMontoentregado();
      this.calcularTCEA();
    });
    this.form.get('htasa')?.valueChanges.subscribe(() => {
      this.calcularDescuento()
      this.generarMontorecibido();
      this.calcularTCEA();
    });

    this.form.get('aplicarRetencion')?.valueChanges.subscribe((valor) => {
      if (valor) {
        this.form.get('htasar')?.enable();
      } else {
        this.form.get('htasar')?.disable();
        this.form.get('htasar')?.setValue('');
      }
    });
  }


  calcularRetencion(): void {
    const monto = this.form.get('hmonto')?.value || 0;
    const tasa = this.form.get('htasar')?.value || 0;
    this.importeRetencion = monto * (tasa / 100);
  }
  calcularSD(): void {
    const monto = this.form.get('hmonto')?.value || 0;
    this.importeSD = monto * (0.14 / 100);
  }
  calcularTCEA(): void {
    const fechaVencimiento = new Date(this.form.get('hfecha')?.value);
    const fechaDescuento = new Date(this.form.get('hfecha2')?.value);

    // Calcular la diferencia de días entre las fechas
    const dias = (fechaVencimiento.getTime() - fechaDescuento.getTime()) / (1000 * 60 * 60 * 24);

    // Validar que los días sean mayores que 0 para evitar divisiones por cero
    if (dias <= 0) {
      console.error("Error: La fecha de vencimiento debe ser posterior a la fecha de descuento.");
      return;
    }

    // Calcular la TCEA
    this.TCEA = (Math.pow(this.MontoEntregado / this.MontoRecibido, (360 / dias)) - 1) * 100;
  }
  calcularDescuento(): void {
    const monto = this.form.get('hmonto')?.value || 0;
    const tasaTEA = this.form.get('htasa')?.value || 0;
    const fechaVencimiento = new Date(this.form.get('hfecha')?.value);
    const fechaDescuento = new Date(this.form.get('hfecha2')?.value);

    if (!monto || !tasaTEA || isNaN(fechaVencimiento.getTime()) || isNaN(fechaDescuento.getTime())) {
      this.importeDescuento = 0;
      return;
    }

    // Calcular la diferencia de días entre las fechas
    const dias = (fechaVencimiento.getTime() - fechaDescuento.getTime()) / (1000 * 60 * 60 * 24);

    // Convertir la TEA en una Tasa Efectiva a N días (TEn)
    const TEn = Math.pow(1 + tasaTEA / 100, dias / 360) - 1;

    // Calcular la tasa de descuento
    const tasaDescuento = TEn / (1 + TEn);

    // Calcular el importe de descuento
    this.importeDescuento = monto * tasaDescuento;
  }
  generarMontorecibido(): void {
    const monto = this.form.get('hmonto')?.value || 0;
    this.MontoRecibido = monto - 20 - 2 - this.importeSD - this.importeRetencion;
  }
  generarMontoentregado(): void {
    const monto = this.form.get('hmonto')?.value || 0;
    this.MontoEntregado = monto + 15 + 6 - this.importeRetencion;
  }
  generarLetra(): void {
    console.log('Letra de Cambio Generada:', {
      monto: this.form.value.hmonto,
      fechaVencimiento: this.form.value.hfecha,
      deudor: this.form.value.hdeudor,
      acreedor: this.form.value.hacredor
    });
  }

}
