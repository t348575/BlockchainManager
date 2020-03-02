import {AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {StepModel} from '../stepModel';
import {OneComponent} from './one/one.component';
import {TwoComponent} from './two/two.component';
import {ThreeComponent} from './three/three.component';
import {FourComponent} from './four/four.component';
import {unescapeIdentifier} from '@angular/compiler';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit, AfterViewInit {
  currentStep = -1;
  steps: StepModel[];
  stepComponents: ComponentRef<any>[];
  @ViewChild('steps', { static: true, read: ViewContainerRef }) container: ViewContainerRef;
  constructor(private resolver: ComponentFactoryResolver) {
    this.steps = [
      { view: true, title: 'Welcome to Blockchain Manager', stepNo: 0, component: OneComponent },
      { view: false, title: 'Security key', stepNo: 1, component: TwoComponent },
      { view: false, title: 'Port\'s & Address\'s', stepNo: 2, component: ThreeComponent},
      { view: false, title: 'Done', stepNo: 3, component: FourComponent }
    ];
  }
  ngOnInit() {
    this.stepComponents = [];
  }

  public next() {
    this.currentStep++;
    if (this.currentStep > 0) {
      try {
        this.stepComponents[this.currentStep].destroy();
      } catch (e) { }
      this.steps[this.currentStep - 1].view = false;
    }
    this.steps[this.currentStep].view = true;
    const factory = this.resolver.resolveComponentFactory(this.steps[this.currentStep].component);
    const component = this.container.createComponent(factory);
    (component.instance as OneComponent).data = this.steps[this.currentStep];
    (component.instance as OneComponent).setup = this;
    this.stepComponents[this.currentStep] = component;
  }
  ngAfterViewInit() {
    this.next();
  }
  public previous() {
    try {
      this.stepComponents[this.currentStep - 1].destroy();
    } catch (e) { }
    this.currentStep--;
    this.steps[this.currentStep + 1].view = false;
    this.steps[this.currentStep].view = true;
    const factory = this.resolver.resolveComponentFactory(this.steps[this.currentStep].component);
    const component = this.container.createComponent(factory);
    (component.instance as OneComponent).data = this.steps[this.currentStep];
    (component.instance as OneComponent).setup = this;
    this.stepComponents[this.currentStep] = component;
  }
  public returnSettingsData() {
    const settings = {
      password: (this.stepComponents[1].instance as TwoComponent).password,
      port: (this.stepComponents[2].instance as ThreeComponent).getPort(),
      address: (this.stepComponents[2].instance as ThreeComponent).address
    };
    return settings;
  }
  public validateAndStart() {
    // tslint:disable-next-line:max-line-length
    const testIP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if ((this.stepComponents[1].instance as TwoComponent).password.length === 0) {
      alert('No security key given!');
      this.previous();
      this.previous();
      return false;
    }
    if ((this.stepComponents[2].instance as ThreeComponent).getPort() === '-') {
      alert('Improper port!');
      this.previous();
      return false;
    }
    if (!testIP.test((this.stepComponents[2].instance as ThreeComponent).address)) {
      alert('Improper multicast address!');
      this.previous();
      return false;
    }
    return true;
  }
}
