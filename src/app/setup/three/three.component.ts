import {Component, Input, OnInit} from '@angular/core';
import {StepModel} from '../../stepModel';

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss'],
})
export class ThreeComponent implements OnInit {
  @Input() setup: any;
  @Input() data: StepModel;
  port = 19236;
  address = '239.255.255.255';
  constructor() { }

  ngOnInit() {}
  public next() {
    this.setup.next();
  }
  public previous() {
    this.setup.previous();
  }
  getPortAsInt() {
    return this.port;
  }
  getPort() {
    if (!this.port) {
      return '-';
    }
    if (!Number.isNaN(this.port)) {
      return this.port;
    } else {
      return '-';
    }
  }
}
