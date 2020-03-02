import {Component, Input, OnInit} from '@angular/core';
import {StepModel} from '../../stepModel';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.scss'],
})
export class OneComponent implements OnInit {
  @Input() setup: any;
  @Input() data: StepModel;
  constructor() {
  }

  ngOnInit() {}
  public next() {
    this.setup.next();
  }
}
