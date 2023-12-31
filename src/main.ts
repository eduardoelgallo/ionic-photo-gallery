import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@Ionic/pwa-elements/loader'

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

defineCustomElements();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
