import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {NodeModel} from '../../nodeModel';
import {ModalController, NavParams} from '@ionic/angular';
import ipcMain = Electron.ipcMain;

@Component({
  selector: 'app-find-nodes',
  templateUrl: './find-nodes.page.html',
  styleUrls: ['./find-nodes.page.scss'],
})
export class FindNodesPage implements OnInit {
  timeout: number;
  nodes: any[];
  ready = false;
  dismissTimeout: any;
  hasFindNodesBeenCalled = false;
  displayMessage = 'New nodes:';
  // tslint:disable-next-line:max-line-length
  constructor(private modalController: ModalController, private electronService: ElectronService) {
    if (electronService.isElectronApp) {
      electronService.ipcRenderer.on('local-server-ready', (event) => {
        this.ready = true;
      });
      this.ready = !electronService.remote.getGlobal('isSearchingForPeers')[0];
      if (this.ready) {
        electronService.ipcRenderer.send('stop-chain-server');
      } else {
        this.dismissTimeout = setTimeout(() => this.dismiss(), 3000);
      }
    }
  }

  ngOnInit() {
  }
  dismiss() {
    clearTimeout(this.dismissTimeout);
    if (this.hasFindNodesBeenCalled) {
      this.electronService.ipcRenderer.send('stop-finding-nodes', this.timeout);
    }
    this.modalController.dismiss();
  }
  findNodes() {
    if (this.electronService.isElectronApp) {
      this.hasFindNodesBeenCalled = true;
      const findNodes = this.electronService.remote.getGlobal('findNodes');
      findNodes(this.timeout);
      this.electronService.ipcRenderer.on('find-nodes', (event, message) => {
        if (message.length === 0) {
          this.displayMessage = 'No new nodes found!';
        }
        this.nodes = message;
      });
    }
  }
  saveNodesToFile() {
    if (this.electronService.isElectronApp) {
      const saveNodes = this.electronService.remote.getGlobal('saveNodes');
      saveNodes(this.nodes);
      clearTimeout(this.dismissTimeout);
      if (this.hasFindNodesBeenCalled) {
        this.electronService.ipcRenderer.send('stop-finding-nodes', this.timeout);
      }
      this.modalController.dismiss('found');
    }
  }
}
