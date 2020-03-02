import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageNodesPage } from './manage-nodes.page';

describe('ManageNodesPage', () => {
  let component: ManageNodesPage;
  let fixture: ComponentFixture<ManageNodesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageNodesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageNodesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
