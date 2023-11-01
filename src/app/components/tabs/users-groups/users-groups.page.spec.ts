import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersGroupsPage } from './users-groups.page';

describe('UsersGroupsPage', () => {
  let component: UsersGroupsPage;
  let fixture: ComponentFixture<UsersGroupsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersGroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
