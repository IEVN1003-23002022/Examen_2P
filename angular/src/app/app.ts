import { Component } from '@angular/core';
import { Pizzeria } from './pizzeria/pizzeria';

@Component({
  selector: 'app-root',
  imports: [Pizzeria],
  templateUrl: './app.html',
})
export class App {}
