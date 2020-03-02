import {Component, Input, OnInit} from '@angular/core';
import {StepModel} from '../../stepModel';

@Component({
  selector: 'app-two',
  templateUrl: './two.component.html',
  styleUrls: ['./two.component.scss'],
})
export class TwoComponent implements OnInit {
  @Input() setup: any;
  @Input() data: StepModel;
  password = 'kanichai';
  constructor() { }

  ngOnInit() {}
  public next() {
    this.setup.next();
  }
  public previous() {
    this.setup.previous();
  }
}
