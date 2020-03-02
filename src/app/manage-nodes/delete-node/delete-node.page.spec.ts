import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeleteNodePage } from './delete-node.page';

describe('DeleteNodePage', () => {
  let component: DeleteNodePage;
  let fixture: ComponentFixture<DeleteNodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteNodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteNodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
