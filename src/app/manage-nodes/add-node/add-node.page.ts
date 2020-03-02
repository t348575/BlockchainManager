import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.page.html',
  styleUrls: ['./add-node.page.scss'],
})
export class AddNodePage implements OnInit {
  ip: string;
  name: string;
  constructor(private modalController: ModalController, private electronService: ElectronService) {
    this.ip = '';
    this.name = '';
  }

  ngOnInit() {
  }
  dismiss() {
    this.modalController.dismiss();
  }
  addNode() {
    if (this.electronService.isElectronApp) {
      const addN = this.electronService.remote.getGlobal('addNode');
      addN(this.ip, this.name);
      this.modalController.dismiss('add');
    }
  }
}
