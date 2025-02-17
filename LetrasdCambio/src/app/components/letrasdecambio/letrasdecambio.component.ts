import { Component } from '@angular/core';
import { ListarletrasComponent } from "./listarletras/listarletras.component";
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-letrasdecambio',
  imports: [ListarletrasComponent,RouterOutlet],
  templateUrl: './letrasdecambio.component.html',
  styleUrl: './letrasdecambio.component.css'
})
export class LetrasdecambioComponent {
  constructor(public route:ActivatedRoute){}
}
