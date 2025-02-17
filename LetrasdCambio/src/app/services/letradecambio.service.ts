import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Letrasdecambio } from '../models/Letrasdecambio';
import { Subject } from 'rxjs';
const base_url=environment.base
@Injectable({
  providedIn: 'root'
})
export class LetradecambioService {
  private url=`${base_url}/letrasdecambio`
  private listaCambio= new Subject<Letrasdecambio[]>();
  constructor(private http:HttpClient) { }
  insert(as:Letrasdecambio){
    return this.http.post(this.url,as)
  }
  list(){
    return this.http.get<Letrasdecambio[]>(this.url)
  }
  getList(){
    return this.listaCambio.asObservable();
  }
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`)
  }
  setList(listaNueva:Letrasdecambio[]){
    this.listaCambio.next(listaNueva);
  }
}
