import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditNodePage } from './edit-node.page';

describe('EditNodePage', () => {
  let component: EditNodePage;
  let fixture: ComponentFixture<EditNodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditNodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
