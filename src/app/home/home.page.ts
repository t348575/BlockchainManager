import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  setup = false;
  stats: any;
  constructor(private router: Router, private electronService: ElectronService) {
    this.stats = {
      TCPByteCount: 0,
      HTTPByteCount: 0,
      chainLength: 0,
      nodeCount: 0
    };
    this.checkSettingSet();
    if (!this.setup) {
      this.router.navigate(['setup']);
    }
    if (this.electronService.isElectronApp) {
      setInterval(() => {
        const getGenStats = this.electronService.remote.getGlobal('getGenStats');
        this.stats = getGenStats();
      }, 1000);
    }
  }

  ngOnInit() {
  }
  public checkSettingSet() {
    if (this.electronService.isElectronApp) {
      const checkSettings = this.electronService.remote.getGlobal('checkSettings');
      this.setup = checkSettings();
    }
  }
}
