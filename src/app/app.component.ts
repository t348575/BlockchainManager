import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AngularGlobalsService} from './service/angular-globals.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  displayMenu;
  menu = [
    {
      labelText: 'Home',
      icon: 'home-outline'
    },
    {
      labelText: 'Statistics',
      icon: 'stats-chart-outline'
    },
    {
      labelText: 'Manage nodes',
      icon: 'hammer-outline'
    },
    {
      labelText: 'Manage chain',
      icon: 'cube-outline'
    },
    {
      labelText: 'Preferences',
      icon: 'cog-outline'
    }
  ];
  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private angularGlobalsService: AngularGlobalsService,
      private router: Router
  ) {
    this.initializeApp();
    this.displayMenu = angularGlobalsService.getMenuDisplay();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  public handleMenu(location: string) {
    switch (location) {
      case 'Home': {
        this.router.navigate(['./home']);
        break;
      }
      case 'Statistics': {
        this.router.navigate(['./statistics']);
        break;
      }
      case 'Manage nodes': {
        this.router.navigate(['./manage-nodes']);
        break;
      }
      case 'Manage chain': {
        this.router.navigate(['./manage-chain']);
        break;
      }
      case 'Preferences': {
        this.router.navigate(['./preferences']);
        break;
      }
    }
  }
}
