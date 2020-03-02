import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddNodePage } from './add-node.page';

describe('AddNodePage', () => {
  let component: AddNodePage;
  let fixture: ComponentFixture<AddNodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
