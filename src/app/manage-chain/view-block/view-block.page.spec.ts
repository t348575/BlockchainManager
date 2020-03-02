import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewBlockPage } from './view-block.page';

describe('ViewBlockPage', () => {
  let component: ViewBlockPage;
  let fixture: ComponentFixture<ViewBlockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBlockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
