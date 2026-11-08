import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PizzeriaService } from '../pizzeria.service';

@Component({
  selector: 'app-captura',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './captura.html',
})
export class Captura implements OnInit {
  formulario!: FormGroup;

  constructor(public pizzeriaService: PizzeriaService) {}

  ngOnInit(): void {
    const hoy = new Date().toISOString().split('T')[0];

    this.formulario = new FormGroup({
      nombre: new FormControl(''),
      direccion: new FormControl(''),
      telefono: new FormControl(''),
      fecha: new FormControl(hoy),
      tamano: new FormControl('Chica'),
      jamon: new FormControl(false),
      pina: new FormControl(false),
      champinones: new FormControl(false),
      numPizzas: new FormControl(1)
    });

    this.pizzeriaService.cliente.fecha = hoy;
  }

  agregar(): void {
    const val = this.formulario.value;

    this.pizzeriaService.cliente = {
      nombre: val.nombre || '',
      direccion: val.direccion || '',
      telefono: val.telefono || '',
      fecha: val.fecha || new Date().toISOString().split('T')[0]
    };

    const ingredientes: string[] = [];
    if (val.jamon) ingredientes.push('Jamon');
    if (val.pina) ingredientes.push('Piña');
    if (val.champinones) ingredientes.push('Champiñones');

    const datosPizza = {
      tamano: val.tamano || 'Chica',
      ingredientes: ingredientes,
      numPizzas: Number(val.numPizzas) || 1
    };

    this.pizzeriaService.agregarTemporal(datosPizza).subscribe({
      next: (res) => {
        this.pizzeriaService.pizzasTemp = res.pizzas || [];
        this.formulario.patchValue({
          jamon: false,
          pina: false,
          champinones: false,
          numPizzas: 1
        });
      },
      error: (err) => console.error('Error al agregar pizza:', err)
    });
  }
}
