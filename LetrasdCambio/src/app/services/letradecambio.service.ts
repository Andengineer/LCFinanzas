import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Letrasdecambio } from '../models/Letrasdecambio';
const base_url=environment.base
@Injectable({
  providedIn: 'root'
})
export class LetradecambioService {
  private url=`${base_url}/letrasdecambio`
  constructor(private http:HttpClient) { }
  insert(as:Letrasdecambio){
    return this.http.post(this.url,as)
  }
}
