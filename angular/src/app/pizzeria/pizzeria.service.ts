import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPedido, IPizzaDetalle } from './pizzeria.model';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaService {

  cliente = {
    nombre: '',
    direccion: '',
    telefono: '',
    fecha: ''
  };

  pizzasTemp: IPizzaDetalle[] = [];
  pedidosGuardados: IPedido[] = [];

  constructor(private http: HttpClient) { }

  cargarTemporal(): void {
    this.http.get<any>('http://127.0.0.1:5000/pizzeria/temporal').subscribe({
      next: (res) => {
        this.pizzasTemp = res.pizzas || [];
      },
      error: (err) => console.error('Error al cargar temporal:', err)
    });
  }

  agregarTemporal(datos: any): Observable<any> {
    return this.http.post('http://127.0.0.1:5000/pizzeria/temporal', datos);
  }

  quitarTemporal(index: number): Observable<any> {
    return this.http.delete('http://127.0.0.1:5000/pizzeria/temporal/' + index);
  }

  terminarPedido(datosCliente: any): Observable<any> {
    return this.http.post('http://127.0.0.1:5000/pizzeria/pedidos', datosCliente);
  }

  obtenerPedidos(): Observable<any> {
    return this.http.get<any>('http://127.0.0.1:5000/pizzeria/pedidos');
  }

  cargarPedidos(): void {
    this.obtenerPedidos().subscribe({
      next: (res) => {
        this.pedidosGuardados = res.pedidos || [];
      },
      error: (err) => console.error('Error al cargar pedidos:', err)
    });
  }
}
