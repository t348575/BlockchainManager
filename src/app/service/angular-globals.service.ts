import { Injectable } from '@angular/core';
import {ElectronService} from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class AngularGlobalsService {
  private displayMenu = false;
  constructor(private electronService: ElectronService) {
    this.setMenuDisplay();
  }
  public setMenuDisplay() {
    if (this.electronService.isElectronApp) {
      const checkSettings = this.electronService.remote.getGlobal('checkSettings');
      this.displayMenu = checkSettings();
    } else {
      this.displayMenu = true;
    }
  }
  public getMenuDisplay() {
    return this.displayMenu;
  }
}
