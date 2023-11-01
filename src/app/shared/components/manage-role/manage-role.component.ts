import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DataStorageService } from '../../services/data-storage.service';
import { projectConstants } from 'src/app/app.constant';
@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss'],
})
export class ManageRoleComponent implements OnInit {
  @Input('stringValues') public stringValues: any;
  @Input('userCategory') public userCategory?: any;
  @Input() registerUser: FormGroup;
  @Input('f') public f: any;
  assignedRoles: any = [];
  roleMaster: any = [];
  isAdminChecked: boolean = false;
  isUserChecked: boolean = false;
  adminRoles: any = [];
  userRoles: any = [];
  userAdminRoles: any = [];
  loginUserRole: string;

  constructor(
    private commonService: CommonService,
    private dataStorageService: DataStorageService
  ) { }

  ngOnInit() {
    this.getRoleMaster();
    this.getLoginUserRole();
    this.commonService
      .getRoleAndLevelFormValidity()
      .subscribe((isSuperAdmin: boolean) => {
        if (isSuperAdmin) {
          this.checkIsRoleSelected();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // clear radio buttons
    if (!changes.userCategory?.firstChange) {
      if (changes.userCategory?.previousValue !== changes.userCategory?.currentValue) {
        if(this.userCategory === projectConstants.CONTRACTOR) {
        this.clearRoles('admin');
        } else {
          this.clearRoles();
        }
      }
    }
  }

  async getLoginUserRole() {
    let getLoginUserRole = await this.dataStorageService.getLocalData(
      'loginUserRole'
    );
    if (getLoginUserRole) {
      this.loginUserRole = getLoginUserRole[0].roleCode;
    }
  }

  checkUserRole(roleCode: string): boolean {
    if (this.loginUserRole === projectConstants.SUPERADMIN) {
      return true;
    } else {
      if (roleCode === projectConstants.SUPERADMIN) {
        return false;
      }
      return true;
    }
  }

  checkIsRoleSelected() {
    let div = document.getElementById('roles_admin');
    let inputElements: any = div.getElementsByTagName('input');
    let checkedCount = 0;
    for (let i = 0; i < inputElements.length; i++) {
      if (
        inputElements[i].type === 'radio' ||
        inputElements[i].type === 'checkbox'
      ) {
        if (inputElements[i].checked) {
          checkedCount++;
        }
      }
    }
    if (checkedCount === 0) {
      this.registerUser.get('isRoleAndLevelFormValid')?.setValue(false);
      this.registerUser.get('isRoleAndLevelFormValid').setErrors({ required: true });
    } else {
      this.registerUser.get('isRoleAndLevelFormValid')?.setValue(true);
    }
  }

  async getRoleMaster() {
    let getRoleMaster = await this.dataStorageService.getLocalData(
      'roleMaster'
    );
    this.adminRoles = getRoleMaster.filter((roles: { categorycode: string }) =>
      roles.categorycode.toLocaleUpperCase() === projectConstants.ADMIN).sort((a, b) => a.id - b.id);
    this.userRoles = getRoleMaster.filter((roles: { categorycode: string }) =>
      roles.categorycode.toLocaleUpperCase() === projectConstants.USER).sort((a, b) => a.id - b.id);
    if (getRoleMaster) {
      this.roleMaster = this.commonService.getStringResources(
        getRoleMaster,
        'LOGIN'
      );
    }
  }

  handleRadioChange(radio: any) {
    this.userAdminRoles = [];
    let div = document.getElementById('roles_admin');
    let inputs = div.getElementsByTagName('input');
    if (radio.checked && radio.name.toLocaleLowerCase() === 'admin') {
      this.isAdminChecked = true;
      if (radio.id === projectConstants.SUPERADMIN) {
        this.isUserChecked = false;
        this.commonService.setIsSuperAdmin(true);
      } else {
        this.commonService.setIsSuperAdmin(false);
      }
    } else {
      this.isUserChecked = true;
    }
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].name.toLocaleLowerCase() !== 'admin') {
        if (radio.id === projectConstants.SUPERADMIN) {
          inputs[i].disabled = true;
          inputs[i].checked = false;
        } else {
          inputs[i].disabled = false;
        }
      }
      if (inputs[i].checked) {
        this.userAdminRoles.push(inputs[i].id);
      }
    }
    this.registerUser.get('userAdminRole')?.setValue(this.userAdminRoles);
  }

  clearRoles(type?: string) {
    if (type) {
      let div = document.getElementById('roles_admin');
      let inputs = div.getElementsByTagName('input');
      this.commonService.setIsSuperAdmin(false);
      type === 'admin' ? this.isAdminChecked = false : this.isUserChecked = false;
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].name.toLocaleLowerCase() === type) {
          this.userAdminRoles = this.userAdminRoles.filter(element => element !== inputs[i].id);
          this.registerUser.get('userAdminRole')?.setValue(this.userAdminRoles);
          inputs[i].checked = false;
        } else {
          if(this.userCategory === projectConstants.CONTRACTOR) {
            if(inputs[i].name === 'Admin') { 
              inputs[i].disabled = true;
              inputs[i].checked = false;
              this.isAdminChecked = false;
            }else {
              inputs[i].disabled = false;
            }            
          }else {
            inputs[i].disabled = false;
          }
          
        }
      }
    }
  }
}
