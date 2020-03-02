import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NodeModel} from '../nodeModel';
import {SelectionType} from '@swimlane/ngx-datatable';
import {ElectronService} from 'ngx-electron';
import {ModalController} from '@ionic/angular';
import {AddNodePage} from './add-node/add-node.page';
import {EditNodePage} from './edit-node/edit-node.page';
import {DeleteNodePage} from './delete-node/delete-node.page';
import {FindNodesPage} from './find-nodes/find-nodes.page';
import {Router} from '@angular/router';

@Component({
  selector: 'app-manage-nodes',
  templateUrl: './manage-nodes.page.html',
  styleUrls: ['./manage-nodes.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageNodesPage implements OnInit {
  isNodeSelected: boolean;
  nodes: any[];
  numNodes: number;
  isSearching: boolean;
  refreshed = false;
  autoRefreshNodes = false;
  selected: NodeModel[];
  SelectionType = SelectionType;
  constructor(private electronService: ElectronService, private modalController: ModalController, private router: Router) {
    this.isNodeSelected = false;
    this.selected = [];
    const getNodeList = electronService.remote.getGlobal('getNodeList');
    const isSearchingForPeers = electronService.remote.getGlobal('isSearchingForPeers')[0];
    const settings = this.electronService.remote.getGlobal('settings');
    if (settings !== -1) {
      this.refreshed = settings.autoRefreshNodes;
      if (getNodeList('copy') === -1) {
        this.autoRefreshNodes = false;
      } else {
        this.autoRefreshNodes = settings.autoRefreshNodes;
      }
    }
    this.isSearching = !(getNodeList('copy') === -1 || !isSearchingForPeers);
    this.editTable();
    electronService.ipcRenderer.on('newPeers', (event, message) => {
      if (message === 'newPeers') {
        this.editTable();
      }
    });
  }
  ngOnInit() {
  }
  stopFinding() {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send('stop-searching-auto');
      this.isSearching = !this.isSearching;
    }
  }
  editTable() {
    const getNodeList = this.electronService.remote.getGlobal('getNodeList');
    const nodes = JSON.parse(getNodeList('reload').toString());
    if (nodes !== -1) {
      this.nodes = nodes.nodes;
      const isInitialSearchDone = this.electronService.remote.getGlobal('isInitialSearchDone');
      if (isInitialSearchDone || this.refreshed) {
        const unConnectedNodes = this.electronService.remote.getGlobal('unConnectedNodes');
        let flag = false;
        for (const i of this.nodes) {
          flag = false;
          for (const j of unConnectedNodes) {
            if (i.id === j.id) {
              i.connected = 'danger';
              i.updated = Date.now().toString();
              flag = true;
            }
          }
          if (!flag) {
            i.connected = 'success';
            i.updated = Date.now().toString();
          }
        }
      } else {
        for (const v of this.nodes) {
          v.connected = 'warning';
          v.updated = Date.now().toString();
        }
      }
      this.numNodes = this.nodes.length;
    } else {
      this.numNodes = 0;
    }
  }
  onSelect(selected) {
    if (Array.isArray(this.selected) && this.selected.length === 1) {
      if (this.selected[0].hasOwnProperty('id') && this.selected[0].id === selected.selected[0].id) {
        this.isNodeSelected = !this.isNodeSelected;
      } else if (this.selected[0].hasOwnProperty('id') && this.selected[0].id !== selected.selected[0].id) {
        this.selected = selected.selected;
        this.isNodeSelected = true;
      }
    } else {
      this.selected = selected.selected;
      this.isNodeSelected = true;
    }
  }
  async findNodes() {
    const modal = await this.modalController.create({ component: FindNodesPage, cssClass: 'modal-fullscreen'});
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === 'found' && this.electronService.isElectronApp) {
      this.refreshPage();
    }
  }
  async addNode() {
    const modal = await this.modalController.create({ component: AddNodePage, cssClass: 'modal-fullscreen'});
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === 'add' && this.electronService.isElectronApp) {
      this.refreshPage();
    }
  }
  async editNode() {
    const modal = await this.modalController.create({
      component: EditNodePage,
      cssClass: 'modal-fullscreen',
      componentProps: {
        node: this.selected[0]
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === 'edited' && this.electronService.isElectronApp) {
      this.refreshPage();
    }
  }
  async deleteNode() {
    const modal = await this.modalController.create({
      component: DeleteNodePage,
      cssClass: 'modal-fullscreen',
      componentProps: {
        node: this.selected[0]
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === 'deleted' && this.electronService.isElectronApp) {
      this.refreshPage();
    }
  }
  refreshNodes() {
    this.autoRefreshNodes = true;
    const refreshNodes = this.electronService.remote.getGlobal('refreshNodes');
    refreshNodes();
    this.refreshed = true;
    // tslint:disable-next-line:max-line-length
    setTimeout(() => { this.autoRefreshNodes = false; this.refreshed = false; }, this.electronService.remote.getGlobal('settings').timeout * 1000);
  }
  refreshPage() {
    if (this.electronService.isElectronApp) {
      const getNodeList = this.electronService.remote.getGlobal('getNodeList');
      getNodeList('reSeed');
      this.redirectTo('./manage-nodes');
    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([uri]));
  }
}
