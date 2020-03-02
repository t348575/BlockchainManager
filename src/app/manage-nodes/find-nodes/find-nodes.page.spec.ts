import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindNodesPage } from './find-nodes.page';

describe('FindNodesPage', () => {
  let component: FindNodesPage;
  let fixture: ComponentFixture<FindNodesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindNodesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindNodesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
