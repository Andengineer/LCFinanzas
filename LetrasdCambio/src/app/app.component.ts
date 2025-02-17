import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LetradecambioComponent } from './components/letrasdecambio/letradecambio/letradecambio.component';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [MatIconModule,MatMenuModule,MatButtonModule,MatToolbarModule,RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LetrasdCambio';
}
