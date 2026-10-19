import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppFooter } from '../app-footer/app-footer';
import { AppHeader } from '../app-header/app-header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, AppHeader, AppFooter],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {}
