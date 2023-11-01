/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// console.log = (message?: any, ...optionalParams: any[]) => {
//   alert('Console log triggered!!' + message);
// };

// console.error = (message?: any, ...optionalParams: any[]) => {
//   alert(message+ 'error');
// };

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
