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
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cartera',
  providers: [provideNativeDateAdapter()],
    standalone: true,
  imports: [MatCheckboxModule, MatDatepickerModule, FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, ReactiveFormsModule, CommonModule],
  templateUrl: './cartera.component.html',
  styleUrl: './cartera.component.css'
})
export class CarteraComponent {
  id:number=0;
  edicion:boolean=false
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
  constructor(private formBuilder: FormBuilder,private cS:CarterasService,private snackBar: MatSnackBar,private router: Router,private route:ActivatedRoute) { }
  ngOnInit(): void {
    this.route.params.subscribe((data:Params)=>{
      this.id=data['id'];
      console.log("ID obtenido de la ruta:", this.id); // Verifica el valor de ID
      this.edicion=data['id']!=null
      //captura data que viene de la lista |^|
      this.init()
    })
    this.form = this.formBuilder.group({
      hfecha2: ['', Validators.required],
      hacredor: ['', Validators.required],
      hmoneda: ['', Validators.required],
      hcodigo:['']
    })
  }

  generarCartera(): void {
    if (this.form.valid) {
      this.cartera.id_cartera = this.form.get('hcodigo')?.value;
      this.cartera.moneda = this.form.get('hmoneda')?.value;
      this.cartera.acreedor = this.form.get('hacredor')?.value;
      this.cartera.fechad= this.form.get('hfecha2')?.value;
      this.cartera.tcea=0;
    }
    if (this.edicion) {
      this.cS.update(this.cartera).subscribe(d => {
        this.cS.list().subscribe(data => {
          this.cS.setList(data);
    
          // Mensaje de confirmación para actualización
          this.snackBar.open('Cartera actualizada', 'Cerrar', {
            duration: 3000, // 3 segundos
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
    
          this.router.navigate(['letrasdecambio/carteralist']);
        });
      });
    } else {
      this.cS.insert(this.cartera).subscribe(d => {
        this.cS.list().subscribe(data => {
          this.cS.setList(data);
        });
    
        // Mensaje de confirmación para registro
        this.snackBar.open('Cartera registrada', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
    
        this.router.navigate(['letrasdecambio/carteralist']);
      });
    }
    

    
  }
  
  init() {
    if (this.edicion) {
      this.cS.list().subscribe(data => {
        const filteredData = data.filter((element: Carteras) => element.id_cartera ==this.id);
  
        if (filteredData.length > 0) {
          let fecha = new Date(filteredData[0].fechad);
          fecha.setDate(fecha.getDate() + 1); // Agrega 1 día
  
          const fechaISO = fecha.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
  
          this.form.patchValue({
            hcodigo: filteredData[0].id_cartera,
            hmoneda: filteredData[0].moneda,
            hfecha2: fechaISO, // Ya está en el formato correcto
            hacredor: filteredData[0].acreedor
          });
  
          console.log("Fecha actualizada:", fechaISO);
        }
      });
    }
  }
  
  

}
