import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { LoadingService } from '../../services/Http-services/loading.service';

@Component({
  selector: 'app-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss'],
})
export class ProgressIndicatorComponent implements OnInit {

  debounceTime = 200;
  loading = false;
  loadingSubscription: Subscription;

  constructor(public commonService: CommonService, private loadingService: LoadingService, private elmRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.elmRef.nativeElement.style.display = 'none';
    this.loadingSubscription = this.loadingService.loadingStatus.pipe(debounceTime(this.debounceTime)).subscribe(
      (status: boolean) => {
        this.elmRef.nativeElement.style.display = status ? 'block' : 'none';
        this.changeDetectorRef.detectChanges();
      }

    );
  }
}