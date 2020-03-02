import {Component, Input, OnInit} from '@angular/core';
import {StepModel} from '../../stepModel';
import {Router} from '@angular/router';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-four',
  templateUrl: './four.component.html',
  styleUrls: ['./four.component.scss'],
})
export class FourComponent implements OnInit {
  @Input() setup: any;
  @Input() data: StepModel;
  constructor(private router: Router, private electronService: ElectronService) { }

  ngOnInit() {}
  public finish() {
    if (this.setup.validateAndStart()) {
      if (this.electronService.isElectronApp) {
        const createSettings = this.electronService.remote.getGlobal('createSettings');
        const settings = this.setup.returnSettingsData();
        createSettings(settings);
      }
    }
  }

}
