import { Component } from '@angular/core';
import { Captura } from './captura/captura';
import { Detalle } from './detalle/detalle';
import { VentasDia } from './ventas-dia/ventas-dia';
import { Reportes } from './reportes/reportes';

@Component({
  selector: 'app-pizzeria',
  standalone: true,
  imports: [Captura, Detalle, VentasDia, Reportes],
  templateUrl: './pizzeria.html',
})
export class Pizzeria {}
