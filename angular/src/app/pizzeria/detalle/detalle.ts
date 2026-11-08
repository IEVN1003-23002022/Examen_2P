import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PizzeriaService } from '../pizzeria.service';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle.html',
})
export class Detalle implements OnInit {
  indiceSeleccionado: number = -1;

  constructor(public pizzeriaService: PizzeriaService) {}

  ngOnInit(): void {
    this.pizzeriaService.cargarTemporal();
  }

  quitar(): void {
    if (this.pizzeriaService.pizzasTemp.length === 0) {
      return;
    }

    const index = this.indiceSeleccionado !== -1
      ? this.indiceSeleccionado
      : this.pizzeriaService.pizzasTemp.length - 1;

    this.pizzeriaService.quitarTemporal(index).subscribe({
      next: (res) => {
        this.pizzeriaService.pizzasTemp = res.pizzas || [];
        this.indiceSeleccionado = -1;
      },
      error: (err) => console.error('Error al quitar pizza:', err)
    });
  }

  terminar(): void {
    if (this.pizzeriaService.pizzasTemp.length === 0) {
      return;
    }

    const cli = {
      nombre: this.pizzeriaService.cliente.nombre || 'Cliente',
      direccion: this.pizzeriaService.cliente.direccion || 'Sin direccion',
      telefono: this.pizzeriaService.cliente.telefono || 'Sin telefono',
      fecha: this.pizzeriaService.cliente.fecha || new Date().toISOString().split('T')[0]
    };

    this.pizzeriaService.terminarPedido(cli).subscribe({
      next: () => {
        this.pizzeriaService.pizzasTemp = [];
        this.pizzeriaService.cargarPedidos();
      },
      error: (err) => console.error('Error al terminar pedido:', err)
    });
  }
}
