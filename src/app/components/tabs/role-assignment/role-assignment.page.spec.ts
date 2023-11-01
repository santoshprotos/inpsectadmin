import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleAssignmentPage } from './role-assignment.page';

describe('RoleAssignmentPage', () => {
  let component: RoleAssignmentPage;
  let fixture: ComponentFixture<RoleAssignmentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RoleAssignmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
