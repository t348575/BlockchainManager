import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-delete-node',
  templateUrl: './delete-node.page.html',
  styleUrls: ['./delete-node.page.scss'],
})
export class DeleteNodePage implements OnInit {
  node: any;
  constructor(private modalController: ModalController, private navParams: NavParams, private electronService: ElectronService) {
    this.node = navParams.get('node');
  }
  ngOnInit() {
  }
  dismiss() {
    this.modalController.dismiss();
  }
  deleteNode() {
    if (this.electronService.isElectronApp) {
      const deleteN = this.electronService.remote.getGlobal('deleteNode');
      deleteN(this.node.id);
      this.modalController.dismiss('deleted');
    }
  }
}
