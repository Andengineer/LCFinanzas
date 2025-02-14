import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LetradecambioComponent } from './components/letrasdecambio/letradecambio/letradecambio.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,LetradecambioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LetrasdCambio';
}
