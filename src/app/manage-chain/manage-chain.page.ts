import { Component, OnInit } from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {NodeModel} from '../nodeModel';
import {ModalController} from '@ionic/angular';
import {ViewBlockPage} from './view-block/view-block.page';
import {Router} from '@angular/router';

@Component({
  selector: 'app-manage-chain',
  templateUrl: './manage-chain.page.html',
  styleUrls: ['./manage-chain.page.scss'],
})
export class ManageChainPage implements OnInit {
  data: string;
  difficulty: number;
  prevhash: string;
  chain: any[];
  localServerReady = false;
  constructor(private electronService: ElectronService, private modalController: ModalController, private router: Router) {
    this.chain = [];
    if (electronService.isElectronApp) {
      setInterval(() => {
        this.chain = electronService.remote.getGlobal('chain');
      }, 1000);
    }
    if (electronService.isElectronApp) {
      electronService.ipcRenderer.on('local-server-ready', (event, message) => {
        this.localServerReady = true;
      });
      this.localServerReady = !electronService.remote.getGlobal('isSearchingForPeers')[0];
    }
  }

  ngOnInit() {
  }
  addBlockToChain() {
    if (this.electronService.isElectronApp && !this.electronService.remote.getGlobal('isSearchingForPeers')[0]) {
      const addBlock = this.electronService.remote.getGlobal('addBlock');
      if (this.electronService.remote.getGlobal('chain').length === 0) {
        const options = {
          inData: this.data,
          difficulty: this.difficulty,
          prev_hash: this.prevhash
        };
        addBlock(options);
      } else {
        addBlock({ inData: this.data });
      }
      this.data = '';
    }
  }
  verifyChain() {
    if (this.electronService.isElectronApp) {
      const tempNo = this.electronService.remote.getGlobal('getTempNo');
      const verify = this.electronService.remote.getGlobal('verifyChain');
      const num = tempNo();
      verify(this.chain, num);
      this.electronService.ipcRenderer.on('verify-chain', (event, message) => {
        if (message === num) {
          alert('Chain verified');
        } else if (message === 'false') {
          alert('Chain not true!');
        }
      });
    }
  }
  getBlock(block: string): object {
    return JSON.parse(block);
  }
  async viewBlockDetails(block: any) {
    const modal = await this.modalController.create({
      component: ViewBlockPage,
      cssClass: 'modal-fullscreen',
      componentProps: {
        blk: block
      }
    });
    await modal.present();
    await modal.onWillDismiss();
    this.router.navigate(['./manage-chain']);
  }
}
