import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/AuthService.service";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root' // Esto asegura que Angular maneje la inyección de dependencias correctamente
})
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}