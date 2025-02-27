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
import { LetradecambioService } from '../../../services/letradecambio.service';
import { Letrasdecambio } from '../../../models/Letrasdecambio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CarterasService } from '../../../services/carteras.service';
import { Carteras } from '../../../models/Carteras';

@Component({
  selector: 'app-letradecambio',
  providers: [provideNativeDateAdapter()],
  standalone: true,
  imports: [MatCheckboxModule, MatDatepickerModule, FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './letradecambio.component.html',
  styleUrl: './letradecambio.component.css'
})
export class LetradecambioComponent {
  id: number = 0;
  edicion: boolean = false
  id_cartera: number = 0
  listaAcreedores: Carteras[] = []
  disableSelect = new FormControl(false);
  form: FormGroup = new FormGroup({});
  importeRetencion: number = 0;
  importeDescuento: number = 0;
  importeSD: number = 0;
  MontoRecibido: number = 0;
  MontoEntregado: number = 0;
  TCEA: number = 0;
  tasadedescuento: number = 0;
  letradecambio: Letrasdecambio = new Letrasdecambio();
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
  constructor(private cS: CarterasService, private formBuilder: FormBuilder, private lS: LetradecambioService, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      console.log("ID obtenido de la ruta:", this.id); // Verifica el valor de ID
      this.edicion = data['id'] != null
      //captura data que viene de la lista |^|
      this.init()
    })
    //para la lista foranea de asociados
    this.cS.list().subscribe(data => {
      this.listaAcreedores = data
    })
    this.form = this.formBuilder.group({
      hcodigo:[''],
      hmonto: ['', Validators.required],
      hfecha: ['', Validators.required],
      hfecha2: ['', Validators.required],
      hdeudor: ['', Validators.required],
      hacredor: ['', Validators.required],
      hmoneda: ['', Validators.required],
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
    this.form.get('hacredor')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
      this.cS.list().subscribe(data => {
        // Filtra los datos solo para el usuario actual
        const filteredData = data.filter((element: Carteras) => element.id_cartera === this.form.get('hacredor')?.value);

        if (filteredData.length > 0) {
          let fecha = new Date(filteredData[0].fechad);
          fecha.setDate(fecha.getDate() + 1); // Agrega 1 día

          const fechaFormateada = `${fecha.getMonth() + 1}/${fecha.getDate()}/${fecha.getFullYear()}`;

          // Actualiza solo los valores necesarios en el formulario sin reemplazarlo
          this.form.patchValue({
            hmoneda: filteredData[0].moneda,
            hfecha2: fechaFormateada
          });
        }
      });

    });

    this.form.get('hfecha')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
    });
    this.form.get('htasa')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
    });
    this.form.get('hcapitalizacion')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
    });
    this.form.get('htipotasa')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
    });
    this.form.get('httasa')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
    });

    this.form.get('hfecha2')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
    });
    this.form.get('hmonto')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
    });
    this.form.get('htasar')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
    });
    this.form.get('htasa')?.valueChanges.subscribe(() => {
      this.calcularRetencion()
      this.calcularSD()
      this.calcularTCEA()
      this.calcularDescuento()
      this.generarMontorecibido()
      this.generarMontoentregado()
      this.calcularDiasDescontados()
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
  //calcular Seguro desgravamen
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
    const tasa = this.form.get('htasa')?.value || 0;
    const tipoTasa = this.form.get('htipotasa')?.value; // "Nominal" o "Efectiva"
    const capitalizacion = this.form.get('hcapitalizacion')?.value || 0; // Solo para Nominal
    const tiempoSeleccionado = this.form.get('httasa')?.value; // Tiempo seleccionado (diaria, mensual, etc.)
    const fechaVencimiento = new Date(this.form.get('hfecha')?.value);
    const fechaDescuento = new Date(this.form.get('hfecha2')?.value);

    if (!monto || !tasa || isNaN(fechaVencimiento.getTime()) || isNaN(fechaDescuento.getTime())) {
      console.error("Error: Datos inválidos.");
      this.importeDescuento = 0;
      return;
    }

    // Calcular la diferencia de días entre las fechas
    const dias = (fechaVencimiento.getTime() - fechaDescuento.getTime()) / (1000 * 60 * 60 * 24);

    if (dias <= 0) {
      console.error("Error: La fecha de vencimiento debe ser posterior a la fecha de descuento.");
      this.importeDescuento = 0;
      return;
    }

    let TEn = 0; // Tasa efectiva a N días

    if (tipoTasa === 'Nominal') {
      const tiempo = this.listatiempos.find(t => t.id === tiempoSeleccionado);
      if (!tiempo) {
        console.error("Error: Tipo de tiempo no válido.");
        this.importeDescuento = 0;
        return;
      }
      if (!capitalizacion || capitalizacion <= 0) {
        console.error("Error: La capitalización debe ser mayor a 0 para tasas nominales.");
        this.importeDescuento = 0;
        return;
      }
      //////////////////////////////
      // Convertir tasa nominal a efectiva periódica (TEP)
      const TEP = Math.pow(1 + (tasa / 100) / (tiempo.dias / capitalizacion), 360 / capitalizacion) - 1;
      console.log(TEP)
      // Convertir la TEP a tasa efectiva a N días (TEn)
      TEn = Math.pow(1 + TEP, dias / 360) - 1;
      console.log(TEn)
    } else if (tipoTasa === 'Efectiva') {
      // Obtener los días del tiempo seleccionado (diario, mensual, etc.)
      const tiempo = this.listatiempos.find(t => t.id === tiempoSeleccionado);
      if (!tiempo) {
        console.error("Error: Tipo de tiempo no válido.");
        this.importeDescuento = 0;
        return;
      }

      // Convertir la tasa efectiva seleccionada a tasa efectiva a N días
      TEn = Math.pow(1 + tasa / 100, dias / tiempo.dias) - 1;
    } else {
      console.error("Error: Tipo de tasa no válido.");
      this.importeDescuento = 0;
      return;
    }

    // Calcular la tasa de descuento
    const tasaDescuento = TEn / (1 + TEn);
    this.tasadedescuento = tasaDescuento * 100;
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
  calcularDiasDescontados(): number {
    const fechaDescuento = new Date(this.form.get('hfecha2')?.value);
    const fechaVencimiento = new Date(this.form.get('hfecha')?.value);
    
    // Calcular la diferencia en milisegundos y convertir a días
    const diferenciaMs = fechaVencimiento.getTime() - fechaDescuento.getTime();
    const diasDescontados = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    
    // Asegurar que no haya valores negativos
    return diasDescontados > 0 ? diasDescontados : 0;
  }
  generarLetra(): void {
    if (this.form.valid) {
      this.letradecambio.id_letra = this.form.get('hcodigo')?.value;
      this.letradecambio.monto = this.form.get('hmonto')?.value;
      this.letradecambio.tea = this.tasadedescuento;
      this.letradecambio.fechav = new Date(this.form.get('hfecha')?.value);
      this.letradecambio.deudor = this.form.get('hdeudor')?.value;
      this.letradecambio.monto_recibido = this.MontoRecibido;
      this.letradecambio.monto_entregado = this.MontoEntregado;
      this.letradecambio.importe_descontado = this.importeDescuento;
      this.letradecambio.importe_retenido = this.importeRetencion;
      this.letradecambio.cartera.id_cartera = this.form.get('hacredor')?.value;
      this.letradecambio.dias_descontado = this.calcularDiasDescontados();
  
      if (this.edicion) {
        this.lS.update(this.letradecambio).subscribe(d => {
          this.lS.list().subscribe(data => {
            this.lS.setList(data);
  
            this.snackBar.open('Letra actualizada', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['snackbar-success']
            });
  
            this.router.navigate(['letrasdecambio']);
          });
        });
      } else {
        this.lS.insert(this.letradecambio).subscribe(d => {
          this.lS.list().subscribe(data => {
            this.lS.setList(data);
          });
  
          // Calcular TCEA después de registrar la letra
          this.cS.calcularTCEA(this.letradecambio.cartera.id_cartera).subscribe(() => {
            console.log('TCEA calculada para cartera:', this.letradecambio.cartera.id_cartera);
          });
  
          this.snackBar.open('Letra de cambio registrada', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
  
          this.router.navigate(['letrasdecambio']);
        });
      }
    }
  }
  
  init() {
    if (this.edicion) {
      this.lS.list().subscribe(data => {
        // Filtra los datos solo para el usuario actual
        const filteredData = data.filter((element: Letrasdecambio) => element.id_letra == this.id);
  
        if (filteredData.length > 0) {
          let fecha = new Date(filteredData[0].fechav);
          let fecha2 = new Date(filteredData[0].cartera.fechad);
  
          fecha.setDate(fecha.getDate() + 1);  // Agrega 1 día a la fecha de vencimiento
          fecha2.setDate(fecha2.getDate() + 1); // Agrega 1 día a la fecha de descuento
  
          // Formatear fechas en MM/DD/YYYY
          const fechaISO2 = fecha.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
          const fechaISO = fecha2.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
  
          // Verifica si las fechas son correctas antes de actualizar el formulario
          console.log("Fecha de Vencimiento (hfecha):", fechaISO2);
          console.log("Fecha de Descuento (hfecha2):", fechaISO);
  
          // Actualiza solo los valores necesarios en el formulario sin reemplazarlo
          this.form.patchValue({
            hacredor: filteredData[0].cartera.id_cartera,
            hmoneda: filteredData[0].cartera.moneda,
            hfecha: fechaISO2,  // Fecha de vencimiento
            hfecha2: fechaISO, // Fecha de descuento
            hcodigo: filteredData[0].id_letra,
            hmonto: filteredData[0].monto,
            hdeudor: filteredData[0].deudor,
          });
  
          console.log("Acreedor:", filteredData[0].cartera.acreedor);
        }
      });
    }
  }
  


}
