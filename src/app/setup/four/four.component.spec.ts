import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FourComponent } from './four.component';

describe('FourComponent', () => {
  let component: FourComponent;
  let fixture: ComponentFixture<FourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
