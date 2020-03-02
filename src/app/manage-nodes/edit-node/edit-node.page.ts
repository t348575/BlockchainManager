import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {NodeModel} from '../../nodeModel';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.page.html',
  styleUrls: ['./edit-node.page.scss'],
})
export class EditNodePage implements OnInit {
  node: any;
  ip: string;
  constructor(private modalController: ModalController, private navParams: NavParams, private electronService: ElectronService) {
    this.node = navParams.get('node');
    this.ip = '';
  }
  ngOnInit() {
  }
  dismiss() {
    this.modalController.dismiss();
  }
  saveEditedNode() {
    if (this.electronService.isElectronApp) {
      const saveNode = this.electronService.remote.getGlobal('saveEditedNode');
      saveNode(this.node.id, this.ip);
      this.modalController.dismiss('edited');
    }
  }
}
