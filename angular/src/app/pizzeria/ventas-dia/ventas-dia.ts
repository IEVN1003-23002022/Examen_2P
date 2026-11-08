import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzeriaService } from '../pizzeria.service';
import { IPedido } from '../pizzeria.model';

@Component({
  selector: 'app-ventas-dia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas-dia.html',
})
export class VentasDia implements OnInit {
  ventasMostradas: IPedido[] = [];
  totalAcumulado: number = 0;

  constructor(public pizzeriaService: PizzeriaService) {}

  ngOnInit(): void {
    this.consultarVentas();
  }

  consultarVentas(): void {
    this.pizzeriaService.obtenerPedidos().subscribe({
      next: (res) => {
        const todos: IPedido[] = res.pedidos || [];
        const hoy = new Date().toISOString().split('T')[0];
        
        // Ventas registradas con fecha de hoy
        this.ventasMostradas = todos.filter(p => p.fecha === hoy);
        if (this.ventasMostradas.length === 0) {
          this.ventasMostradas = todos; // Si no hay hoy, muestra las existentes
        }
        this.totalAcumulado = this.ventasMostradas.reduce((acc, p) => acc + Number(p.total), 0);
      },
      error: (err) => console.error('Error al consultar ventas:', err)
    });
  }
}
