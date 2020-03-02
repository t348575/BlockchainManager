import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-view-block',
  templateUrl: './view-block.page.html',
  styleUrls: ['./view-block.page.scss'],
})
export class ViewBlockPage implements OnInit {
  block: any;
  constructor(private modalController: ModalController, private navParams: NavParams) {
    this.block = JSON.parse(navParams.get('blk'));
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
