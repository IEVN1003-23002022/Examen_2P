import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PizzeriaService } from '../pizzeria.service';
import { IPedido } from '../pizzeria.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
})
export class Reportes implements OnInit {
  tipoFiltro: string = 'dia'; // 'dia' o 'mes'
  diaSeleccionado: string = 'lunes';
  mesSeleccionado: string = 'noviembre';
  pedidosEncontrados: IPedido[] = [];
  totalAcumulado: number = 0;
  pedidoSeleccionado: IPedido | null = null;
  busquedaRealizada: boolean = false;

  diasSemana = [
    { valor: 'lunes', texto: 'Lunes' },
    { valor: 'martes', texto: 'Martes' },
    { valor: 'miercoles', texto: 'Miércoles' },
    { valor: 'jueves', texto: 'Jueves' },
    { valor: 'viernes', texto: 'Viernes' },
    { valor: 'sabado', texto: 'Sábado' },
    { valor: 'domingo', texto: 'Domingo' }
  ];

  mesesAnio = [
    { valor: 'enero', texto: 'Enero' },
    { valor: 'febrero', texto: 'Febrero' },
    { valor: 'marzo', texto: 'Marzo' },
    { valor: 'abril', texto: 'Abril' },
    { valor: 'mayo', texto: 'Mayo' },
    { valor: 'junio', texto: 'Junio' },
    { valor: 'julio', texto: 'Julio' },
    { valor: 'agosto', texto: 'Agosto' },
    { valor: 'septiembre', texto: 'Septiembre' },
    { valor: 'octubre', texto: 'Octubre' },
    { valor: 'noviembre', texto: 'Noviembre' },
    { valor: 'diciembre', texto: 'Diciembre' }
  ];

  constructor(public pizzeriaService: PizzeriaService) {}

  ngOnInit(): void {}

  obtenerDiaSemana(fechaStr: string): string {
    if (!fechaStr) return '';
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return '';
    const fecha = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
    const mapaDias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    return mapaDias[fecha.getDay()];
  }

  obtenerMes(fechaStr: string): string {
    if (!fechaStr) return '';
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return '';
    const mesIndex = Number(partes[1]) - 1;
    const mapaMeses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return mapaMeses[mesIndex] || '';
  }

  buscar(): void {
    this.busquedaRealizada = true;
    this.pedidoSeleccionado = null;

    this.pizzeriaService.obtenerPedidos().subscribe({
      next: (res) => {
        const todos: IPedido[] = res.pedidos || [];

        if (this.tipoFiltro === 'dia') {
          if (!this.diaSeleccionado) {
            this.pedidosEncontrados = todos;
          } else {
            this.pedidosEncontrados = todos.filter(
              p => this.obtenerDiaSemana(p.fecha) === this.diaSeleccionado
            );
          }
        } else {
          if (!this.mesSeleccionado) {
            this.pedidosEncontrados = todos;
          } else {
            this.pedidosEncontrados = todos.filter(
              p => this.obtenerMes(p.fecha) === this.mesSeleccionado
            );
          }
        }

        this.totalAcumulado = this.pedidosEncontrados.reduce(
          (acc, p) => acc + Number(p.total),
          0
        );
      },
      error: (err) => console.error('Error al consultar ventas:', err)
    });
  }

  verDetalle(pedido: IPedido): void {
    this.pedidoSeleccionado = pedido;
  }
}
