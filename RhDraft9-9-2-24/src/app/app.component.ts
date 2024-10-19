import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isLoading: boolean = false;

  constructor(private router: Router, private loaderService: LoaderService) {
    // Show loader during navigation start
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.loaderService.hide();
      }
    });

    // Subscribe to the loader service
    this.loaderService.isLoading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
}
