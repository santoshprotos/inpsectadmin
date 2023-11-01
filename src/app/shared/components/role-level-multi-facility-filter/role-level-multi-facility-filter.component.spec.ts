import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoleLevelMultiFacilityFilterComponent } from './role-level-multi-facility-filter.component';

describe('RoleLevelMultiFacilityFilterComponent', () => {
  let component: RoleLevelMultiFacilityFilterComponent;
  let fixture: ComponentFixture<RoleLevelMultiFacilityFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleLevelMultiFacilityFilterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoleLevelMultiFacilityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
