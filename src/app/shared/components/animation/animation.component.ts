import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
})
export class AnimationComponent  implements OnInit {

  @Input('animationPath') public animationPath: string;
  @Input('height') public height: any;
  @Input('width') public width: any;
  constructor(private commonService: CommonService, private router: Router) {

   }

  ngOnInit() {
  }

}
