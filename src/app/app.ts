import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppToaster } from './layout/app-toaster/app-toaster';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppToaster],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
