import { Component, OnInit } from '@angular/core';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage implements OnInit {
  port: number;
  address: string;
  timeout: number;
  autoNodeSearch: boolean;
  autoRefreshNodes: boolean;
  searchInterval: number;
  settings: any;
  canSave = false;
  constructor(private electronService: ElectronService) {
    const getSettings = electronService.remote.getGlobal('getSettings');
    this.settings = getSettings();
    if (this.settings !== -1) {
      this.settings = JSON.parse(this.settings.toString());
      this.port = this.settings.port;
      this.address = this.settings.address;
      this.timeout = this.settings.timeout;
      this.autoNodeSearch = this.settings.autoNodeSearch;
      this.searchInterval = this.settings.searchInterval;
      this.autoRefreshNodes = this.settings.autoRefreshNodes;
    }
    if (!this.electronService.remote.getGlobal('isSearchingForPeers')[0]) {
      this.canSave = true;
    } else {
      this.electronService.ipcRenderer.on('local-server-ready', () => this.canSave = true);
    }
  }
  ngOnInit() {
  }
  updateSettings() {
    if (this.electronService.isElectronApp) {
      const update = this.electronService.remote.getGlobal('updateSettings');
      // tslint:disable-next-line:max-line-length
      update({ port: this.port, address: this.address, timeout: this.timeout, autoNodeSearch: this.autoNodeSearch, searchInterval: this.searchInterval, autoRefreshNodes: this.autoRefreshNodes });
    }
  }
}
