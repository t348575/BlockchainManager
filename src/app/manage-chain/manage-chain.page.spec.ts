import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageChainPage } from './manage-chain.page';

describe('ManageChainPage', () => {
  let component: ManageChainPage;
  let fixture: ComponentFixture<ManageChainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageChainPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageChainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
