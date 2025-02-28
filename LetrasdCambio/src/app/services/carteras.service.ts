import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Carteras } from '../models/Carteras';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base
@Injectable({
  providedIn: 'root'
})
export class CarterasService {
  private url = `${base_url}/carteras`
  private listaCambio= new Subject<Carteras[]>();
  constructor(private http:HttpClient) { }
   insert(as:Carteras){
      return this.http.post(this.url,as)
    }
    list(){
      return this.http.get<Carteras[]>(this.url)
    }
    getList(){
      return this.listaCambio.asObservable();
    }
    delete(id:number){
      return this.http.delete(`${this.url}/${id}`)
    }
    setList(listaNueva:Carteras[]){
      this.listaCambio.next(listaNueva);
    }
    update(a:Carteras){
      return this.http.put(this.url,a)
    }
    calcularTCEA(id: number) {
      return this.http.post(`${this.url}/${id}/calcular-tcea`, {});
    }
}
